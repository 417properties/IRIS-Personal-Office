import {VerificationService} from '../recovery/service.ts';
export function verifyCanonicalEffect(service:VerificationService,input:unknown){if(!(service instanceof VerificationService))throw new Error('B4_QUALIFIED_VERIFIER_REQUIRED');return service.verify(input);}
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
    disposition:'UNKNOWN',
    evidence_refs:[`fixture-readback:${intent.intent_id}`],
    verified_at:new Date().toISOString(),
    notes:['B4_QUALIFIED_SOURCE_PROOF_REQUIRED',same?'UNQUALIFIED_MATCH':'UNQUALIFIED_MISMATCH_NOT_ABSENCE']
  };
}
