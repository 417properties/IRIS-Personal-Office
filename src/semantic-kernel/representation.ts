import { demand, member, record, text, freeze } from './validation.ts';
import { COVERAGE, decodeEpistemic, decodeFact, type EpistemicState, type ItemFact } from './epistemic.ts';
import { decodeIdentity, decodeOccurrence, decodeRelation, type Identity, type CausalOccurrence, type Relation } from './identity.ts';
import { decodeTemporal, type TemporalCoordinates } from './temporal.ts';
import { decodeContinuation, type ContinuationClaim } from './continuation.ts';
import { decodeEffect, decodeLifecycle, EFFECT, LIFECYCLE, DECISION_LIFECYCLE, type EffectState, type LifecycleState } from './lifecycle.ts';

export const KERNEL_SCHEMA_VERSION = 'IRIS_B1_V1' as const;
type Objects = { EPISTEMIC: EpistemicState; ITEM_FACT: ItemFact; IDENTITY: Identity; RELATION: Relation; CAUSAL_OCCURRENCE: CausalOccurrence; CONTINUATION: ContinuationClaim; TEMPORAL: TemporalCoordinates; LIFECYCLE: LifecycleState; EFFECT: EffectState };
const DECODERS = { EPISTEMIC: decodeEpistemic, ITEM_FACT: decodeFact, IDENTITY: decodeIdentity, RELATION: decodeRelation, CAUSAL_OCCURRENCE: decodeOccurrence, CONTINUATION: decodeContinuation, TEMPORAL: decodeTemporal, LIFECYCLE: decodeLifecycle, EFFECT: decodeEffect };
export type KernelKind = keyof Objects;
export function decodeEnvelope(value: unknown) {
  const r = record(value, ['schema_version', 'object_type', 'payload']);
  demand(r.schema_version === KERNEL_SCHEMA_VERSION, 'UNSUPPORTED_SCHEMA_VERSION');
  const kind = member(r.object_type, Object.keys(DECODERS) as KernelKind[]);
  return freeze({ schema_version: KERNEL_SCHEMA_VERSION, object_type: kind, payload: DECODERS[kind](r.payload) });
}
export function encodeEnvelope<K extends KernelKind>(kind: K, payload: Objects[K]): string {
  return JSON.stringify(decodeEnvelope({ schema_version: KERNEL_SCHEMA_VERSION, object_type: kind, payload }));
}
export function decodeWire(wire: string) { return decodeEnvelope(JSON.parse(text(wire))); }

// Representation-only tables: unsupported or semantically ambiguous legacy
// tokens HOLD. CLOSED and UNSATISFIED cannot manufacture terminal semantics.
const OBLIGATION_V0 = { OPEN: 'NONTERMINAL', IN_PROGRESS: 'NONTERMINAL', WAITING: 'NONTERMINAL', HOLD: 'NONTERMINAL', UNKNOWN: 'UNKNOWN' } as const;
const OBJECTIVE_V0 = { OPEN: 'NONTERMINAL', HOLD: 'NONTERMINAL', SATISFIED: 'SATISFIED', ABANDONED: 'ABANDONED' } as const;
const COVERAGE_V0 = { COMPLETE_FOR_DECLARED_SCOPE: 'COMPLETE_FOR_DECLARED_SCOPE', INCOMPLETE_COVERAGE: 'INCOMPLETE', CONFLICTED_COVERAGE: 'CONFLICTED', UNKNOWN_COVERAGE: 'UNKNOWN' } as const;
const EFFECT_V0 = { VERIFIED_EFFECT: 'EFFECT_VERIFIED', VERIFIED_NO_EFFECT: 'NO_EFFECT_VERIFIED', AMBIGUOUS_EFFECT: 'AMBIGUOUS_EFFECT', CONFLICT: 'CONFLICTED_EFFECT', UNKNOWN: 'UNKNOWN' } as const;
export const LEGACY_MAPS = freeze({ OBLIGATION_V0, OBJECTIVE_V0, COVERAGE_V0, EFFECT_V0 });
export function translateLegacy(map: keyof typeof LEGACY_MAPS, token: unknown): string {
  const table = LEGACY_MAPS[member(map, Object.keys(LEGACY_MAPS) as (keyof typeof LEGACY_MAPS)[])];
  const key = text(token); demand(Object.hasOwn(table, key), 'UNMAPPED_LEGACY_STATE');
  return table[key as keyof typeof table];
}
// Retain the exact legacy spelling alongside canonical meaning when many-to-one
// maps are used; reverse translation verifies both, rather than guessing OPEN.
export function retainLegacy(map: keyof typeof LEGACY_MAPS, token: string) {
  return freeze({ representation_version: map, source_token: token, semantic_state: translateLegacy(map, token) });
}
export function restoreLegacy(value: unknown): string {
  const r = record(value, ['representation_version', 'source_token', 'semantic_state']);
  const map = member(r.representation_version, Object.keys(LEGACY_MAPS) as (keyof typeof LEGACY_MAPS)[]);
  demand(translateLegacy(map, r.source_token) === r.semantic_state, 'LEGACY_REPRESENTATION_DRIFT'); return text(r.source_token);
}
// Canonical spellings have a total identity map; no case folding is permitted.
export const CANONICAL_ENUMS = freeze({ COVERAGE, EFFECT, LIFECYCLE, DECISION_LIFECYCLE });
