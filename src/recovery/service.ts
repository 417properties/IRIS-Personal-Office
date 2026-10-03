import {randomUUID} from 'node:crypto';
import {EnforcementRepository,ReleaseService,type ReleaseRequest} from '../enforcement/repository.ts';
import {B4,decodeReadback,qualifiedSource,id,same,type Readback,type EffectProof} from './contracts.ts';
import {decodeContinuation,type ContinuationClaim} from '../semantic-kernel/continuation.ts';
import {sameIdentity,type Identity} from '../semantic-kernel/identity.ts';
import {instant} from '../semantic-kernel/temporal.ts';
import {record,demand,freeze,text} from '../semantic-kernel/validation.ts';
import {jsonValue} from '../domain/json.ts';
import {digest} from '../enforcement/contracts.ts';
import {SCHEMA_VERSION,decodeReference,type Reference} from '../domain/canonical.ts';
export interface QualifiedReadbackSource {readonly binding:{source_id:string;configuration_digest:string};scan(request:Readonly<{schema_version:typeof B4;principal:Identity;intent:Identity;attempt:Identity;attempt_version:number;occurrence:Identity;operation_digest:string;scope_refs:string[];as_of:string}>):Promise<Readback>}
export class VerificationService {
 readonly repository:EnforcementRepository;#source:QualifiedReadbackSource;#clock:()=>string;
 constructor(repository:EnforcementRepository,source:QualifiedReadbackSource,clock:()=>string=()=>new Date().toISOString()){this.repository=repository;this.#source=source;this.#clock=clock;}
 async verify(input:unknown):Promise<Readonly<EffectProof>>{
  const r=record(input,['attempt','verification','prediction_ref']),captured=freeze({attempt:id(r.attempt,'RELEASE_ATTEMPT'),verification:id(r.verification,'VERIFICATION'),prediction_ref:r.prediction_ref===null?null:decodeReference(r.prediction_ref)}),binding=freeze(jsonValue(this.#source.binding)) as QualifiedReadbackSource['binding'],scan=this.#source.scan.bind(this.#source),at=instant(this.#clock()),a=await this.repository.getAttempt(captured.attempt),q=await qualifiedSource(this.repository.canonical,a,binding.source_id,at);demand(binding.configuration_digest===q.qualification.configuration_digest,'B4_SOURCE_CONFIGURATION_MISMATCH');
  const request=freeze({schema_version:B4,principal:a.intent.principal,intent:a.intent.intent,attempt:a.attempt,attempt_version:a.version,occurrence:a.intent.occurrence,operation_digest:a.intent.operation_digest,scope_refs:a.intent.object_refs,as_of:at});
  // A thrown/unavailable scan is no proof of absence. No consequential callback exists.
  const observation=decodeReadback(await scan(request));demand(same(binding,jsonValue(this.#source.binding)),'B4_SOURCE_CONFIGURATION_CHANGED');
  const result=await this.repository.command({kind:'VERIFY_EFFECT',value:{schema_version:B4,verification:captured.verification,attempt:captured.attempt,expected_attempt_version:a.version,source_id:binding.source_id,source_version:q.current_version,observation,prediction_ref:captured.prediction_ref}}) as {proof:EffectProof};return freeze(result.proof);
 }
 async verifyNew(attempt:Identity,predictionRef:Reference|null=null){return this.verify({attempt,verification:{kind:'VERIFICATION',id:randomUUID()},prediction_ref:predictionRef});}
}
export class RecoveryService {
 readonly repository:EnforcementRepository;
 constructor(repository:EnforcementRepository){this.repository=repository;}
 reconcileClosure(input:unknown){return this.repository.command({kind:'RECONCILE_CLOSURE',value:freeze(jsonValue(input))});}
 authorizeRetry(input:unknown){return this.repository.command({kind:'AUTHORIZE_VERIFIED_RETRY',value:freeze(jsonValue(input))});}
 qualifyCheckpoint(input:unknown){return this.repository.command({kind:'QUALIFY_CHECKPOINT',value:freeze(jsonValue(input))});}
 project(input:unknown){return this.repository.command({kind:'VERIFY_PROJECTION',value:freeze(jsonValue(input))});}
 reconstruct(principal:Identity,at:string){return this.repository.recoverySnapshot(principal,at);}
 async resume(input:unknown){
  const r=record(input,['checkpoint_id','principal','workflow','step_id','payload','continuation','as_of']),captured=freeze({checkpoint_id:text(r.checkpoint_id),principal:id(r.principal,'PRINCIPAL'),workflow:id(r.workflow,'WORK_EPISODE'),step_id:text(r.step_id),payload:jsonValue(r.payload),continuation:decodeContinuation(r.continuation),as_of:instant(r.as_of)}),snapshot=await this.reconstruct(captured.principal,captured.as_of),checkpoint=snapshot.checkpoints.find(p=>p.identity===captured.checkpoint_id);demand(checkpoint,'B4_QUALIFIED_CHECKPOINT_REQUIRED');const c=checkpoint.data,prior=decodeContinuation(c.continuation);demand(same(c.workflow,captured.workflow)&&c.step_id===captured.step_id&&c.payload_digest===digest(captured.payload),'B4_RESUME_PAYLOAD_BINDING');demand(typeof c.valid_until==='string'&&Date.parse(c.valid_until)>Date.parse(captured.as_of),'B4_CHECKPOINT_EXPIRED');demand(snapshot.recovery.admission==='RECOVERY_EVIDENCE_PASS','B4_RESUME_RECONCILIATION_REQUIRED');demand(snapshot.recovery.claims.some(claim=>same(claim,captured.continuation)),'B4_RESUME_FENCE_DRIFT');
  demand(same(prior,captured.continuation)||sameIdentity(prior.principal,captured.continuation.principal)&&sameIdentity(prior.causal_episode,captured.continuation.causal_episode)&&!sameIdentity(prior.owner_incarnation,captured.continuation.owner_incarnation)&&captured.continuation.generation>prior.generation,'B4_SUCCESSOR_IDENTITY_REQUIRED');
  const q=await this.repository.canonical.current({schema_version:SCHEMA_VERSION,principal:captured.principal,subject:captured.workflow,predicate:JSON.stringify([B4,'CHECKPOINT:'+captured.step_id]),as_of:captured.as_of});demand(q.status==='RECORDED_AS_OF'&&q.record&&q.record.record_id===c.qualification_record&&q.record.version===c.qualification_version&&digest(q.record)===c.qualification_digest,'B4_CHECKPOINT_SUPERSEDED');
  const end=await this.reconstruct(captured.principal,captured.as_of);demand(same(end.snapshot,snapshot.snapshot),'B4_RESUME_STATE_CHANGED');
  return freeze({schema_version:B4,checkpoint_id:checkpoint.identity,disposition:c.effect_class==='EFFECTFUL'&&c.replay_class!=='READ_ONLY_SAFE'?'NO_AUTOMATIC_REPLAY':'RESUME_ZERO_EFFECT',continuation:captured.continuation,recovery:snapshot.recovery,authority_effect:'NONE',continuity_ON:false});
 }
}
// Reconciliation never submits. A permitted retry still traverses the sole B3
// authority/fence/dispatch owner; no transport or permit is available to B4.
export function releaseVerifiedRetry(service:ReleaseService,request:ReleaseRequest){demand(service instanceof ReleaseService,'CANONICAL_RELEASE_REQUIRED');return service.release(request);}
export function sameContinuation(a:ContinuationClaim,b:ContinuationClaim){return same(a,b);}
