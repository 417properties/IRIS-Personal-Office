import type { ActionIntent } from '../domain/action-intent.ts';
import type { ActionReceipt } from '../domain/action-receipt.ts';
import type { ToolExecutor } from './tool-contract.ts';

export class ActionFixtureAdapter implements ToolExecutor {
  private value:unknown;
  readonly calls:string[]=[];
  readonly applyEffect:boolean;
  constructor(initial:unknown, applyEffect=true) { this.value=structuredClone(initial); this.applyEffect=applyEffect; }
  read():unknown { return structuredClone(this.value); }
  async execute(_intent:ActionIntent):Promise<ActionReceipt> {throw new Error('CANONICAL_RELEASE_REQUIRED');}
}

import {consumeSubmissionPermit,type ConsequentialTransport,type SubmissionPermit,type SubmissionReceipt} from '../enforcement/repository.ts';
import {freeze,demand} from '../semantic-kernel/validation.ts';
import {identity,type Identity} from '../semantic-kernel/identity.ts';
import type {ReleaseIntent} from '../enforcement/contracts.ts';
// Qualification adapter only. This is not an external provider or effect verifier.
export class CanonicalActionFixtureAdapter implements ConsequentialTransport {
 readonly binding:ConsequentialTransport['binding'];#value:unknown;#calls:string[]=[];
 constructor(binding:ConsequentialTransport['binding'],initial:unknown){this.binding=freeze(binding);this.#value=structuredClone(initial);}
 get calls(){return freeze(this.#calls);}read(){return freeze(this.#value);}
 async preflight(_intent:Readonly<ReleaseIntent>):Promise<{ready:true}>{return {ready:true};}
 async submit(intent:Readonly<ReleaseIntent>,attempt:Identity,permit:SubmissionPermit):Promise<SubmissionReceipt>{
  demand(intent.tool_id===this.binding.tool_id&&intent.configuration_digest===this.binding.configuration_digest&&intent.capability_id===this.binding.capability_id&&intent.qualification_id===this.binding.qualification_id,'FIXTURE_TRANSPORT_BINDING_MISMATCH');
  const dispatch=consumeSubmissionPermit(permit,intent,attempt);this.#calls.push(dispatch);this.#value=structuredClone(intent.arguments);
  return {receipt:identity('RECEIPT','fixture-receipt:'+dispatch),attempt,intent:intent.intent,occurrence:intent.occurrence,operation_digest:intent.operation_digest,provider_call_id:dispatch,evidence_refs:['fixture:accepted-submission'],status:'SUBMISSION_KNOWN'};
 }
}
