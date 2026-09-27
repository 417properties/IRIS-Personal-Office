import type { RetryClassification, ActionIntent } from '../domain/action-intent.ts';
import type { ActionReceipt } from '../domain/action-receipt.ts';
export interface ToolContract {
  tool_id:string;
  authority_scope:string;
  privacy_scope:string;
  retry_classification:RetryClassification;
  external:boolean;
}
export interface ToolExecutor {
  execute(intent:ActionIntent): Promise<ActionReceipt>;
}
export function toolContractMatches(intent:ActionIntent,contract:ToolContract,actionScope:string,privacyScope:string): boolean {
  return intent.tool_id===contract.tool_id
    && intent.retry_classification===contract.retry_classification
    && actionScope===contract.authority_scope
    && privacyScope===contract.privacy_scope;
}
export function retryDisposition(retryClass:RetryClassification,effect:'VERIFIED_EFFECT'|'VERIFIED_NO_EFFECT'|'AMBIGUOUS_EFFECT'|'CONFLICT'|'UNKNOWN'): 'RETRY_ALLOWED'|'NO_RETRY'|'RECONCILE_FIRST'|'HOLD' {
  if (effect==='VERIFIED_EFFECT') return 'NO_RETRY';
  if (['AMBIGUOUS_EFFECT','CONFLICT','UNKNOWN'].includes(effect)) return retryClass==='NON_IDEMPOTENT_UNSAFE'?'HOLD':'RECONCILE_FIRST';
  if (effect==='VERIFIED_NO_EFFECT') return retryClass==='NON_IDEMPOTENT_UNSAFE'?'HOLD':'RETRY_ALLOWED';
  return 'HOLD';
}
