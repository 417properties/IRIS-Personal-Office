export type EffectDisposition = 'VERIFIED_EFFECT' | 'VERIFIED_NO_EFFECT' | 'AMBIGUOUS_EFFECT' | 'CONFLICT' | 'UNKNOWN';
export interface EffectVerification {
  verification_id: string;
  intent_id: string;
  receipt_id?: string;
  disposition: EffectDisposition;
  evidence_refs: string[];
  verified_at: string;
  notes: string[];
}
export function mayBlindRetry(disposition: EffectDisposition): boolean {
  return disposition === 'VERIFIED_NO_EFFECT';
}
