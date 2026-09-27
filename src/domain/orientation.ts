export interface PreferenceRecord {
  key: string;
  value: unknown;
  source_ref: string;
  effective_from: string;
  effective_to?: string;
}
export interface OrientationState {
  orientation_id: string;
  principal_id: string;
  effective_from: string;
  effective_to?: string;
  source_basis_refs: string[];
  standing_preferences: PreferenceRecord[];
  explicit_current_decisions: PreferenceRecord[];
  predicted_preferences: PreferenceRecord[];
  privacy_constraints: string[];
  authority_constraints: string[];
  version: number;
  supersedes_orientation_id?: string;
}
