export interface PrivacyPolicy {
  policy_id: string;
  principal_id: string;
  scopes: string[];
  disclosure: 'ALLOW' | 'DENY';
  valid_from: string;
  valid_to?: string;
  source_ref: string;
  version: number;
}
export type PrivacyDisposition = 'ALLOW' | 'DENY' | 'UNKNOWN';
export function evaluatePrivacy(policies: PrivacyPolicy[], scope: string, now: string): PrivacyDisposition {
  const active = policies.filter(p => p.scopes.includes(scope) && p.valid_from <= now && (!p.valid_to || p.valid_to >= now));
  if (active.some(p => p.disclosure === 'DENY')) return 'DENY';
  if (active.some(p => p.disclosure === 'ALLOW')) return 'ALLOW';
  return 'UNKNOWN';
}
