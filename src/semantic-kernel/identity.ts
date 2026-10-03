import { demand, evidence, freeze, member, record, text, version } from './validation.ts';
import { decodeTemporal, instant, knownAsOf, type TemporalCoordinates } from './temporal.ts';

export const ID_KINDS = ['PRINCIPAL', 'OBJECTIVE', 'OBLIGATION', 'DECISION_REQUIREMENT', 'INTENT', 'RELEASE_ATTEMPT', 'RECEIPT', 'EFFECT', 'VERIFICATION', 'CONFLICT', 'RESOLUTION', 'WORK_EPISODE', 'CONTINUATION', 'WORKER', 'SUBSTRATE', 'CAUSAL_OCCURRENCE', 'PROJECTION_RUN', 'COMMUNICATION_EVENT'] as const;
export type IdentityKind = typeof ID_KINDS[number];
export interface Identity { kind: IdentityKind; id: string }
export function identity(kind: IdentityKind, id: string): Readonly<Identity> {
  return freeze({ kind: member(kind, ID_KINDS), id: text(id) });
}
export function decodeIdentity(value: unknown): Readonly<Identity> {
  const r = record(value, ['kind', 'id']); return identity(member(r.kind, ID_KINDS), text(r.id));
}
export function sameIdentity(a: Identity, b: Identity): boolean {
  const x = decodeIdentity(a), y = decodeIdentity(b); return x.kind === y.kind && x.id === y.id;
}
export interface Relation {
  relation_id: string; principal: Identity; source: Identity; target: Identity;
  kind: 'RESOLUTION_EQUIVALENCE' | 'CONTEXT' | 'PARENT_OCCURRENCE' | 'REPRESENTATION_OF';
  version: number; temporal: TemporalCoordinates; evidence_refs: string[];
}
export function decodeRelation(value: unknown): Readonly<Relation> {
  const r = record(value, ['relation_id', 'principal', 'source', 'target', 'kind', 'version', 'temporal', 'evidence_refs']);
  const principal = decodeIdentity(r.principal); demand(principal.kind === 'PRINCIPAL', 'PRINCIPAL_KIND');
  const kind = member(r.kind, ['RESOLUTION_EQUIVALENCE', 'CONTEXT', 'PARENT_OCCURRENCE', 'REPRESENTATION_OF'] as const);
  const source = decodeIdentity(r.source), target = decodeIdentity(r.target);
  if (kind === 'RESOLUTION_EQUIVALENCE') demand(source.kind === 'RESOLUTION' && target.kind === 'RESOLUTION', 'RESOLUTION_KIND');
  if (kind === 'PARENT_OCCURRENCE') demand(source.kind === 'CAUSAL_OCCURRENCE' && target.kind === 'CAUSAL_OCCURRENCE' && !sameIdentity(source, target), 'PARENT_OCCURRENCE_KIND');
  if (kind === 'REPRESENTATION_OF') demand(target.kind === 'CAUSAL_OCCURRENCE', 'OCCURRENCE_TARGET');
  return freeze({ relation_id: text(r.relation_id), principal, source, target, kind, version: version(r.version), temporal: decodeTemporal(r.temporal), evidence_refs: evidence(r.evidence_refs) } as Relation);
}
export function resolutionsEquivalent(a: Identity, b: Identity, principal: Identity, relations: readonly unknown[], asOf: string): boolean {
  const x = decodeIdentity(a), y = decodeIdentity(b), p = decodeIdentity(principal);
  demand(x.kind === 'RESOLUTION' && y.kind === 'RESOLUTION' && p.kind === 'PRINCIPAL', 'RESOLUTION_QUERY_KIND'); instant(asOf);
  if (sameIdentity(x, y)) return true; // Exact explicit identity, never shared context.
  return relations.map(decodeRelation).some(r => r.kind === 'RESOLUTION_EQUIVALENCE' && sameIdentity(r.principal, p)
    && knownAsOf(r.temporal, asOf) && ((sameIdentity(r.source, x) && sameIdentity(r.target, y)) || (sameIdentity(r.source, y) && sameIdentity(r.target, x))));
}
export interface CausalOccurrence {
  occurrence: Identity; originating_ref: Identity; first_occurred_at: string;
  operation_digest: string; evidence_refs: string[];
}
export function decodeOccurrence(value: unknown): Readonly<CausalOccurrence> {
  const r = record(value, ['occurrence', 'originating_ref', 'first_occurred_at', 'operation_digest', 'evidence_refs']);
  const occurrence = decodeIdentity(r.occurrence); demand(occurrence.kind === 'CAUSAL_OCCURRENCE', 'OCCURRENCE_KIND');
  return freeze({ occurrence, originating_ref: decodeIdentity(r.originating_ref), first_occurred_at: instant(r.first_occurred_at), operation_digest: text(r.operation_digest), evidence_refs: evidence(r.evidence_refs) });
}
export function experienceKeys(values: readonly unknown[]): readonly string[] {
  const seen = new Map<string, Readonly<CausalOccurrence>>();
  for (const input of values) {
    const v = decodeOccurrence(input), prior = seen.get(v.occurrence.id);
    if (prior) demand(sameIdentity(prior.originating_ref, v.originating_ref) && prior.operation_digest === v.operation_digest && prior.first_occurred_at === v.first_occurred_at, 'OCCURRENCE_IDENTITY_DRIFT');
    seen.set(v.occurrence.id, v);
  }
  return freeze([...seen.keys()]);
}
