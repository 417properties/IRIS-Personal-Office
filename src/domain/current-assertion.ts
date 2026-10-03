// IRIS_LEGACY_V0 source representation. Explicit decoders/maps are in
// source-dto.ts / legacy-maps.ts; qualified canonical records use canonical.ts.
export type Qualification = 'VERIFIED' | 'QUALIFIED' | 'CONFLICT' | 'UNKNOWN' | 'INAPPLICABLE';
export interface CurrentAssertion {
  assertion_id: string;
  subject_ref: string;
  predicate: string;
  value: unknown;
  effective_from: string;
  effective_to?: string;
  source_occurrence_refs: string[];
  qualification: Qualification;
  freshness: 'FRESH' | 'STALE' | 'UNKNOWN';
  coverage: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'UNKNOWN' | 'CONFLICT';
  uncertainty: string[];
  version: number;
  supersedes_assertion_id?: string;
  invalidated_by_refs: string[];
}
export function currentKey(a: Pick<CurrentAssertion,'subject_ref'|'predicate'>): string {
  return `${a.subject_ref}::${a.predicate}`;
}
