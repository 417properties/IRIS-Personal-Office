import { randomUUID } from 'node:crypto';
import type { ActionIntent } from '../domain/action-intent.ts';
import type { ActionReceipt } from '../domain/action-receipt.ts';
import type { EffectVerification } from '../domain/effect-verification.ts';
export function verifyFixtureEffect(intent:ActionIntent,receipt:ActionReceipt,actual:unknown,expected:unknown):EffectVerification {
  const same=JSON.stringify(actual)===JSON.stringify(expected);
  return {
    verification_id:`verification:${randomUUID()}`,
    intent_id:intent.intent_id,
    receipt_id:receipt.receipt_id,
    disposition:same?'VERIFIED_EFFECT':'VERIFIED_NO_EFFECT',
    evidence_refs:[`fixture-readback:${intent.intent_id}`],
    verified_at:new Date().toISOString(),
    notes:[same?'EXPECTED_EFFECT_OBSERVED':'TOOL_SUCCESS_WITHOUT_EXPECTED_EFFECT']
  };
}
