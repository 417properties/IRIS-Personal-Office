import { demand, evidence, freeze, member, record, text, version } from './validation.ts';
import { decodeIdentity, sameIdentity, type Identity } from './identity.ts';
import { instant } from './temporal.ts';

export const LIFECYCLE = ['NONTERMINAL', 'SATISFIED', 'SUPERSEDED', 'ABANDONED', 'UNKNOWN'] as const;
export const DECISION_LIFECYCLE = ['OPEN', 'RESOLVED', 'SUPERSEDED', 'ABANDONED', 'UNKNOWN'] as const;
export interface LifecycleState {
  object: Identity; principal: Identity; version: number;
  state: typeof LIFECYCLE[number] | typeof DECISION_LIFECYCLE[number];
  last_event_ref: string;
  evidence_refs: string[];
  basis_ref: string;
}
function statesFor(ref: Identity) {
  demand(['OBJECTIVE', 'OBLIGATION', 'DECISION_REQUIREMENT'].includes(ref.kind), 'LIFECYCLE_OBJECT_KIND');
  return ref.kind === 'DECISION_REQUIREMENT' ? DECISION_LIFECYCLE : LIFECYCLE;
}
export function decodeLifecycle(value: unknown): Readonly<LifecycleState> {
  const r = record(value, ['object', 'principal', 'version', 'state', 'last_event_ref', 'evidence_refs', 'basis_ref']);
  const object = decodeIdentity(r.object), principal = decodeIdentity(r.principal); demand(principal.kind === 'PRINCIPAL', 'PRINCIPAL_KIND');
  return freeze({ object, principal, version: version(r.version), state: member(r.state, statesFor(object)), last_event_ref: text(r.last_event_ref), evidence_refs: evidence(r.evidence_refs), basis_ref: text(r.basis_ref) });
}
export interface LifecycleEvent {
  event_id: string; object: Identity; principal: Identity; expected_version: number;
  next_state: LifecycleState['state']; kind: 'TRANSITION' | 'CORRECTION' | 'SUPERSESSION';
  evidence_refs: string[]; at: string; basis_ref: string;
  basis_kind: 'LIFECYCLE_EVIDENCE' | 'CLOSURE_RECONCILIATION' | 'CORRECTION' | 'SUPERSESSION';
  basis_knowledge: 'KNOWN';
}
// Pure transition validation. Actual closure reconciliation, durable CAS, and
// release authority remain B2/B3/B4; this reducer never asserts those occurred.
export function reduceLifecycle(input: unknown, command: unknown): Readonly<LifecycleState> {
  const state = decodeLifecycle(input);
  const r = record(command, ['event_id', 'object', 'principal', 'expected_version', 'next_state', 'kind', 'evidence_refs', 'at', 'basis_ref', 'basis_kind', 'basis_knowledge']);
  const ref = decodeIdentity(r.object), p = decodeIdentity(r.principal);
  demand(sameIdentity(state.object, ref) && sameIdentity(state.principal, p), 'LIFECYCLE_EXACT_TARGET');
  demand(version(r.expected_version) === state.version, 'STALE_LIFECYCLE_VERSION');
  const next = member(r.next_state, statesFor(ref)), kind = member(r.kind, ['TRANSITION', 'CORRECTION', 'SUPERSESSION'] as const);
  evidence(r.evidence_refs); instant(r.at); text(r.basis_ref); const event = text(r.event_id);
  demand(r.basis_knowledge === 'KNOWN', 'LIFECYCLE_BASIS_UNKNOWN');
  const basisKind = member(r.basis_kind, ['LIFECYCLE_EVIDENCE', 'CLOSURE_RECONCILIATION', 'CORRECTION', 'SUPERSESSION'] as const);
  if (kind === 'CORRECTION') demand(basisKind === 'CORRECTION', 'CORRECTION_BASIS_REQUIRED');
  else if (kind === 'SUPERSESSION') demand(basisKind === 'SUPERSESSION', 'SUPERSESSION_BASIS_REQUIRED');
  else if (['SATISFIED', 'RESOLVED'].includes(next)) demand(basisKind === 'CLOSURE_RECONCILIATION', 'CLOSURE_RECONCILIATION_REQUIRED');
  else demand(basisKind === 'LIFECYCLE_EVIDENCE', 'LIFECYCLE_EVIDENCE_REQUIRED');
  demand(event !== state.last_event_ref, 'DUPLICATE_LIFECYCLE_EVENT');
  demand(next !== state.state, 'NO_STATE_CHANGE');
  const terminal = ['SATISFIED', 'RESOLVED', 'SUPERSEDED', 'ABANDONED'].includes(state.state);
  demand(!terminal || kind === 'CORRECTION' || kind === 'SUPERSESSION', 'TERMINAL_CORRECTION_REQUIRED');
  if (kind === 'SUPERSESSION') demand(next === 'SUPERSEDED', 'SUPERSESSION_TARGET');
  demand(state.version < Number.MAX_SAFE_INTEGER, 'VERSION_OVERFLOW');
  return freeze({ ...state, state: next, version: state.version + 1, last_event_ref: event, evidence_refs: evidence(r.evidence_refs), basis_ref: text(r.basis_ref) });
}

export const EFFECT = ['NO_SUBMISSION_PROVEN', 'SUBMISSION_KNOWN', 'EFFECT_VERIFIED', 'NO_EFFECT_VERIFIED', 'PARTIAL_EFFECT', 'AMBIGUOUS_EFFECT', 'CONFLICTED_EFFECT', 'RECONCILIATION_REQUIRED', 'UNAVAILABLE_READBACK', 'UNKNOWN'] as const;
export interface EffectState {
  intent: Identity; operation_digest: string; occurrence: Identity; version: number;
  disposition: typeof EFFECT[number]; last_event_ref: string;
  proof: 'SUBMISSION_ACCEPTED' | 'POSITIVE_ABSENCE' | 'MATCHING_EFFECT' | 'PARTIAL_MATCH' | 'AMBIGUOUS' | 'CONFLICT' | 'UNAVAILABLE' | 'NONE';
  evidence_refs: string[];
}
export function decodeEffect(value: unknown): Readonly<EffectState> {
  const r = record(value, ['intent', 'operation_digest', 'occurrence', 'version', 'disposition', 'last_event_ref', 'proof', 'evidence_refs']);
  const intent = decodeIdentity(r.intent), occurrence = decodeIdentity(r.occurrence);
  demand(intent.kind === 'INTENT' && occurrence.kind === 'CAUSAL_OCCURRENCE', 'EFFECT_IDENTITY_KIND');
  const disposition = member(r.disposition, EFFECT); demand(r.proof === PROOF[disposition], 'EFFECT_PROOF_KIND_MISMATCH');
  return freeze({ intent, occurrence, operation_digest: text(r.operation_digest), version: version(r.version), disposition, last_event_ref: text(r.last_event_ref), proof: PROOF[disposition], evidence_refs: evidence(r.evidence_refs) });
}
export interface EffectEvent {
  event_id: string; intent: Identity; operation_digest: string; occurrence: Identity; expected_version: number;
  next_disposition: EffectState['disposition']; kind: 'OBSERVATION' | 'CORRECTION';
  proof: 'SUBMISSION_ACCEPTED' | 'POSITIVE_ABSENCE' | 'MATCHING_EFFECT' | 'PARTIAL_MATCH' | 'AMBIGUOUS' | 'CONFLICT' | 'UNAVAILABLE' | 'NONE';
  evidence_refs: string[]; at: string;
}
const PROOF: Record<EffectState['disposition'], EffectEvent['proof']> = {
  NO_SUBMISSION_PROVEN: 'POSITIVE_ABSENCE', SUBMISSION_KNOWN: 'SUBMISSION_ACCEPTED', EFFECT_VERIFIED: 'MATCHING_EFFECT',
  NO_EFFECT_VERIFIED: 'POSITIVE_ABSENCE', PARTIAL_EFFECT: 'PARTIAL_MATCH', AMBIGUOUS_EFFECT: 'AMBIGUOUS',
  CONFLICTED_EFFECT: 'CONFLICT', RECONCILIATION_REQUIRED: 'NONE', UNAVAILABLE_READBACK: 'UNAVAILABLE', UNKNOWN: 'NONE',
};
// Source-backed proof declarations are required, never generated from transport
// success or unequal readback. Their independent verification is B4's obligation.
export function reduceEffect(input: unknown, command: unknown): Readonly<EffectState> {
  const state = decodeEffect(input);
  const r = record(command, ['event_id', 'intent', 'operation_digest', 'occurrence', 'expected_version', 'next_disposition', 'kind', 'proof', 'evidence_refs', 'at']);
  demand(sameIdentity(state.intent, decodeIdentity(r.intent)) && sameIdentity(state.occurrence, decodeIdentity(r.occurrence)) && state.operation_digest === text(r.operation_digest), 'IMMUTABLE_EFFECT_BINDING_DRIFT');
  demand(version(r.expected_version) === state.version, 'STALE_EFFECT_VERSION');
  const next = member(r.next_disposition, EFFECT), kind = member(r.kind, ['OBSERVATION', 'CORRECTION'] as const);
  demand(r.proof === PROOF[next], 'EFFECT_PROOF_KIND_MISMATCH'); evidence(r.evidence_refs); instant(r.at);
  const event = text(r.event_id); demand(event !== state.last_event_ref, 'DUPLICATE_EFFECT_EVENT'); demand(next !== state.disposition, 'NO_STATE_CHANGE');
  if (['EFFECT_VERIFIED', 'NO_EFFECT_VERIFIED'].includes(state.disposition)) demand(kind === 'CORRECTION', 'VERIFIED_EFFECT_CORRECTION_REQUIRED');
  // A new release after verified non-submission/no-effect is a separate B3 release
  // event; this observation reducer does not submit or grant retry permission.
  if (next === 'NO_SUBMISSION_PROVEN' && state.disposition !== 'UNKNOWN') demand(kind === 'CORRECTION', 'SUBMISSION_HISTORY_CORRECTION_REQUIRED');
  demand(state.version < Number.MAX_SAFE_INTEGER, 'VERSION_OVERFLOW');
  return freeze({ ...state, disposition: next, version: state.version + 1, last_event_ref: event, proof: PROOF[next], evidence_refs: evidence(r.evidence_refs) });
}
export function retryEvidenceDisposition(input: unknown): 'RETRY_EVIDENCE_SUFFICIENT' | 'RECONCILE_FIRST' | 'NO_RETRY' {
  const state = decodeEffect(input);
  if (state.disposition === 'EFFECT_VERIFIED') return 'NO_RETRY';
  if (['NO_SUBMISSION_PROVEN', 'NO_EFFECT_VERIFIED'].includes(state.disposition)) return 'RETRY_EVIDENCE_SUFFICIENT';
  return 'RECONCILE_FIRST';
}
