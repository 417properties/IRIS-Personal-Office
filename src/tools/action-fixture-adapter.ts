import { createHash } from 'node:crypto';
import type { ActionIntent } from '../domain/action-intent.ts';
import type { ActionReceipt } from '../domain/action-receipt.ts';
import type { ToolExecutor } from './tool-contract.ts';

export class ActionFixtureAdapter implements ToolExecutor {
  private value:unknown;
  readonly calls:string[]=[];
  readonly applyEffect:boolean;
  constructor(initial:unknown, applyEffect=true) { this.value=structuredClone(initial); this.applyEffect=applyEffect; }
  read():unknown { return structuredClone(this.value); }
  async execute(intent:ActionIntent):Promise<ActionReceipt> {
    this.calls.push(intent.intent_id);
    if (this.applyEffect) this.value=structuredClone(intent.expected_effect);
    const digest=createHash('sha256').update(JSON.stringify({intent:intent.intent_id,value:this.value})).digest('hex');
    return {
      receipt_id:`receipt:${intent.intent_id}:${this.calls.length}`,
      intent_id:intent.intent_id,
      provider_call_id:`fixture-call:${this.calls.length}`,
      request_digest:intent.arguments_digest,
      completion_class:'SUCCESS',
      returned_payload_digest:digest,
      tool_reported_status:'SUCCESS',
      received_at:new Date().toISOString()
    };
  }
}
