import { demand, evidence, freeze, member, record, strings } from './validation.ts';
import { decodeIdentity, sameIdentity, type Identity } from './identity.ts';
import { instant } from './temporal.ts';

export const KNOWLEDGE = ['KNOWN', 'UNKNOWN', 'MISSING', 'UNAVAILABLE', 'CONFLICTED', 'INVALID', 'REJECTED'] as const;
export const APPLICABILITY = ['APPLICABLE', 'NOT_APPLICABLE_PROVEN', 'SATISFIED', 'SUPERSEDED', 'ABANDONED', 'UNKNOWN'] as const;
export const FRESHNESS = ['CURRENT_AS_OF', 'STALE', 'UNKNOWN'] as const;
export const COVERAGE = ['COMPLETE_FOR_DECLARED_SCOPE', 'INCOMPLETE', 'CONFLICTED', 'UNKNOWN'] as const;
export const DISPOSITIONS = ['KNOWN_REQUIRED', 'RELEVANCE_UNKNOWN', 'TERMINAL_RETAINED', 'JUSTIFIED_NOT_APPLICABLE', 'PRIVACY_EXCLUDED', 'DEFERRED_SUPPRESSED_WITH_REACTIVATION', 'CONFLICT_HOLD', 'INVALID_REJECTED'] as const;
export interface EpistemicState {
  knowledge_state: typeof KNOWLEDGE[number]; applicability_state: typeof APPLICABILITY[number];
  freshness_state: typeof FRESHNESS[number]; coverage_state: typeof COVERAGE[number];
  as_of: string; evidence_refs: string[]; invalidators: string[];
}
export function decodeEpistemic(value: unknown): Readonly<EpistemicState> {
  const r = record(value, ['knowledge_state', 'applicability_state', 'freshness_state', 'coverage_state', 'as_of', 'evidence_refs', 'invalidators']);
  const state = { knowledge_state: member(r.knowledge_state, KNOWLEDGE), applicability_state: member(r.applicability_state, APPLICABILITY), freshness_state: member(r.freshness_state, FRESHNESS), coverage_state: member(r.coverage_state, COVERAGE), as_of: instant(r.as_of), evidence_refs: strings(r.evidence_refs), invalidators: strings(r.invalidators) };
  if (state.knowledge_state === 'KNOWN' || state.applicability_state === 'NOT_APPLICABLE_PROVEN') evidence(state.evidence_refs);
  if (state.applicability_state === 'NOT_APPLICABLE_PROVEN') demand(state.knowledge_state === 'KNOWN', 'NOT_APPLICABLE_PROOF_UNKNOWN');
  return freeze(state);
}
export interface ItemFact {
  root: Identity; principal: Identity; epistemic: EpistemicState;
  requirement: 'REQUIRED' | 'NOT_REQUIRED_PROVEN' | 'UNKNOWN';
  disposition: typeof DISPOSITIONS[number]; disposition_evidence: string[]; reactivation_refs: string[];
}
export function decodeFact(value: unknown): Readonly<ItemFact> {
  const r = record(value, ['root', 'principal', 'epistemic', 'requirement', 'disposition', 'disposition_evidence', 'reactivation_refs']);
  const root = decodeIdentity(r.root), principal = decodeIdentity(r.principal); demand(principal.kind === 'PRINCIPAL', 'PRINCIPAL_KIND');
  const epistemic = decodeEpistemic(r.epistemic), requirement = member(r.requirement, ['REQUIRED', 'NOT_REQUIRED_PROVEN', 'UNKNOWN'] as const);
  const disposition = member(r.disposition, DISPOSITIONS), refs = strings(r.disposition_evidence), reactivation = strings(r.reactivation_refs);
  const known = epistemic.knowledge_state === 'KNOWN' && epistemic.freshness_state === 'CURRENT_AS_OF';
  if (requirement !== 'UNKNOWN') demand(known && epistemic.applicability_state !== 'UNKNOWN', 'REQUIREMENT_NOT_KNOWN');
  if (disposition === 'KNOWN_REQUIRED') demand(known && requirement === 'REQUIRED' && epistemic.applicability_state === 'APPLICABLE', 'REQUIRED_DISPOSITION_INVALID');
  if (disposition === 'TERMINAL_RETAINED') demand(known && ['SATISFIED', 'SUPERSEDED', 'ABANDONED'].includes(epistemic.applicability_state), 'TERMINAL_PROOF_REQUIRED');
  if (disposition === 'JUSTIFIED_NOT_APPLICABLE') demand(known && epistemic.applicability_state === 'NOT_APPLICABLE_PROVEN' && requirement === 'NOT_REQUIRED_PROVEN', 'NOT_APPLICABLE_PROOF_REQUIRED');
  if (['PRIVACY_EXCLUDED', 'DEFERRED_SUPPRESSED_WITH_REACTIVATION'].includes(disposition)) evidence(refs);
  if (disposition === 'DEFERRED_SUPPRESSED_WITH_REACTIVATION') evidence(reactivation);
  if (disposition === 'INVALID_REJECTED') demand(['INVALID', 'REJECTED'].includes(epistemic.knowledge_state), 'INVALID_DISPOSITION_INVALID');
  if (disposition === 'CONFLICT_HOLD') demand(epistemic.knowledge_state === 'CONFLICTED' || epistemic.coverage_state === 'CONFLICTED', 'CONFLICT_DISPOSITION_INVALID');
  return freeze({ root, principal, epistemic, requirement, disposition, disposition_evidence: refs, reactivation_refs: reactivation });
}
// One fact list drives root conservation and coverage; no separate unknown predicate.
// This is shared algebra, not the B6 Pilot classifier or an A3 authority adjudicator.
export function reduceCoverage(scope: { roots: readonly Identity[]; principal: Identity; as_of: string }, inputs: readonly unknown[]) {
  instant(scope.as_of); const p = decodeIdentity(scope.principal); demand(p.kind === 'PRINCIPAL', 'PRINCIPAL_KIND');
  const roots = scope.roots.map(decodeIdentity), facts = inputs.map(decodeFact);
  demand(roots.every((r, i) => !roots.slice(0, i).some(x => sameIdentity(x, r))), 'DUPLICATE_SCOPE_ROOT');
  demand(facts.length === roots.length && facts.every(f => roots.some(r => sameIdentity(f.root, r))) && roots.every(r => facts.filter(f => sameIdentity(r, f.root)).length === 1), 'ROOT_DISPOSITION_CONSERVATION');
  demand(facts.every(f => sameIdentity(f.principal, p) && f.epistemic.as_of === scope.as_of), 'FACT_SCOPE_OR_CUT_MISMATCH');
  let coverage: typeof COVERAGE[number];
  if (facts.some(f => f.epistemic.knowledge_state === 'CONFLICTED' || f.epistemic.coverage_state === 'CONFLICTED' || f.disposition === 'CONFLICT_HOLD')) coverage = 'CONFLICTED';
  else if (!facts.length || facts.some(f => ['MISSING', 'UNAVAILABLE', 'INVALID', 'REJECTED'].includes(f.epistemic.knowledge_state) || f.epistemic.freshness_state === 'STALE' || f.epistemic.coverage_state === 'INCOMPLETE')) coverage = 'INCOMPLETE';
  else if (facts.some(f => f.epistemic.knowledge_state === 'UNKNOWN' || f.epistemic.applicability_state === 'UNKNOWN' || f.epistemic.freshness_state === 'UNKNOWN' || f.epistemic.coverage_state === 'UNKNOWN' || f.requirement === 'UNKNOWN' || f.disposition === 'RELEVANCE_UNKNOWN')) coverage = 'UNKNOWN';
  else coverage = 'COMPLETE_FOR_DECLARED_SCOPE';
  return freeze({ schema_version: 'IRIS_B1_V1' as const, as_of: scope.as_of, coverage_state: coverage, facts });
}
