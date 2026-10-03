// IRIS_LEGACY_V0 source representation. Explicit decoders/maps are in
// source-dto.ts / legacy-maps.ts; qualified canonical records use canonical.ts.
export type AuthorityBasisType = 'EXPLICIT_CURRENT_DECISION' | 'STANDING_AUTHORIZATION' | 'INTERNAL_NONCONSEQUENTIAL' | 'PREDICTED_PREFERENCE';
export interface AuthorityPolicy {
  policy_id: string;
  principal_id: string;
  basis_type: AuthorityBasisType;
  scopes: string[];
  valid_from: string;
  valid_to?: string;
  source_ref: string;
  version: number;
}
export type AuthorityDisposition =
  | 'AUTHORIZED_WITHIN_STANDING_SCOPE'
  | 'REQUIRES_EXPLICIT_AARON_DECISION'
  | 'DENIED'
  | 'UNKNOWN';

export function evaluateAuthority(
  policies: AuthorityPolicy[],
  requestedScope: string,
  now: string,
  explicitDecisionScopes: string[] = []
): AuthorityDisposition {
  if (explicitDecisionScopes.includes(requestedScope)) return 'AUTHORIZED_WITHIN_STANDING_SCOPE';
  const active = policies.filter(p => p.scopes.includes(requestedScope) && p.valid_from <= now && (!p.valid_to || p.valid_to >= now));
  if (active.some(p => p.basis_type === 'STANDING_AUTHORIZATION')) return 'AUTHORIZED_WITHIN_STANDING_SCOPE';
  if (active.some(p => p.basis_type === 'PREDICTED_PREFERENCE')) return 'REQUIRES_EXPLICIT_AARON_DECISION';
  if (active.some(p => p.basis_type === 'INTERNAL_NONCONSEQUENTIAL')) return 'AUTHORIZED_WITHIN_STANDING_SCOPE';
  return 'UNKNOWN';
}
