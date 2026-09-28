export const CONSEQUENCE_WEIGHTS = Object.freeze({ C1: 1, C2: 4, C3: 16, C4: 64 });
export interface SyntheticMetricCase {
  consequence: keyof typeof CONSEQUENCE_WEIGHTS; required: boolean; included: boolean; justified_omission: boolean; omission_valid: boolean;
  abstained: boolean; complete: boolean; completeness_valid: boolean; provenance: boolean; leaked: boolean; institutional_changes: number;
}
// Local synthetic arithmetic only. This is deliberately not an E1 label/scoring interface.
export function syntheticMetrics(cases: readonly SyntheticMetricCase[], populationKind: 'SYNTHETIC_LOCAL_ONLY') {
  if (populationKind !== 'SYNTHETIC_LOCAL_ONLY') throw new Error('INDEPENDENT_GOVERNING_SCORING_REQUIRED');
  const required = cases.filter(x => x.required), missed = required.filter(x => !x.included);
  const totalWeight = required.reduce((s, x) => s + CONSEQUENCE_WEIGHTS[x.consequence], 0);
  const weightedMiss = totalWeight ? missed.reduce((s, x) => s + CONSEQUENCE_WEIGHTS[x.consequence], 0) / totalWeight : null;
  const omissions = cases.filter(x => x.justified_omission), included = cases.filter(x => x.included);
  const invalidOmissions = omissions.filter(x => !x.omission_valid || x.required || x.abstained || !x.complete);
  const consequentialMisses = missed.filter(x => x.consequence === 'C3' || x.consequence === 'C4').length;
  const falseComplete = cases.filter(x => x.complete && !x.completeness_valid).length;
  const complete = cases.filter(x => x.complete && x.completeness_valid && !x.abstained);
  const decisions = complete.filter(x => x.included).length;
  return { weighted_miss_rate: weightedMiss, recall: required.length ? (required.length - missed.length) / required.length : null,
    consequential_misses: consequentialMisses, justified_omission_precision: omissions.length ? (omissions.length - invalidOmissions.length) / omissions.length : null,
    provenance_coverage: included.length ? included.filter(x => x.provenance).length / included.length : null,
    excess_notification_rate: included.length ? included.filter(x => !x.required).length / included.length : null,
    abstention_count: cases.filter(x => x.abstained).length, incomplete_count: cases.filter(x => !x.complete).length,
    false_complete: falseComplete, cross_principal_leakage: cases.filter(x => x.leaked).length,
    compression_ratio: decisions ? complete.reduce((s, x) => s + x.institutional_changes, 0) / decisions : null,
    safety_pass: required.length > 0 && missed.length === 0 && invalidOmissions.length === 0 && falseComplete === 0 && cases.every(x => !x.leaked && (!x.included || x.provenance)),
    governing_score: 'NOT_PERFORMED' as const, utility_qualified: false };
}
export function mechanicalInterventionRate(mechanical: number, verifiedProgressEpisodes: number): number | null {
  if (!Number.isInteger(mechanical) || mechanical < 0 || !Number.isInteger(verifiedProgressEpisodes) || verifiedProgressEpisodes < 0) throw new Error('INVALID_AMIR_COUNTS');
  return verifiedProgressEpisodes ? mechanical / verifiedProgressEpisodes : null;
}
