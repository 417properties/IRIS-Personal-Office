import {randomUUID} from 'node:crypto';
import {decodeIntent,validateAuthority,authorityPredicate,ENFORCEMENT_SCHEMA,digest,type ReleaseIntent,type ValidatedAuthoritySnapshot} from './contracts.ts';
import {decodeContinuation,type ContinuationClaim} from '../semantic-kernel/continuation.ts';
import {decodeIdentity,sameIdentity,type Identity} from '../semantic-kernel/identity.ts';
import {instant,knownAsOf} from '../semantic-kernel/temporal.ts';
import {demand,record,text,version,evidence,freeze} from '../semantic-kernel/validation.ts';
import {jsonValue,denseArray,parseJSON} from '../domain/json.ts';
import {MemoryCanonicalRepository,canonicalJSON,type CanonicalRepository,type AppendCommand} from '../state/repository.ts';
import {SCHEMA_VERSION} from '../domain/canonical.ts';
export type ReleaseState='PREPARED'|'NO_SUBMISSION_PROVEN'|'SUBMITTING'|'RELEASED_SUBMITTED'|'AMBIGUOUS_SUBMISSION'|'DENIED';
export interface SubmissionReceipt {receipt:Identity;attempt:Identity;intent:Identity;occurrence:Identity;operation_digest:string;provider_call_id:string;evidence_refs:string[];status:'SUBMISSION_KNOWN'}
export interface ReleaseAttempt {schema_version:typeof ENFORCEMENT_SCHEMA;attempt:Identity;intent:Readonly<ReleaseIntent>;state:ReleaseState;version:number;prepared_at:string;updated_at:string;fence:Readonly<ContinuationClaim>;authority:Readonly<ValidatedAuthoritySnapshot>;dispatch_id:string|null;receipt:Readonly<SubmissionReceipt>|null;evidence_refs:string[];reason:string|null;effect:'NOT_ADJUDICATED'}
interface LeaseRecord {principal:Identity;lease_id:string;intent_digest:string;authority:Readonly<ValidatedAuthoritySnapshot>}
interface State {claims:ContinuationClaim[];leases:LeaseRecord[];attempts:ReleaseAttempt[];revocations:{principal:Identity;domain:string;generation:number;evidence_refs:string[]}[]}
export interface EnforcementEvent {schema_version:typeof ENFORCEMENT_SCHEMA;sequence:number;at:string;canonical_count:number;canonical_digest:string;command:unknown;result:unknown}
export interface AtomicView {canonical:CanonicalRepository;canonical_commands:readonly AppendCommand[];events:readonly EnforcementEvent[];append(event:EnforcementEvent):Promise<void>}
export interface EnforcementBackend {atomic<T>(work:(view:AtomicView)=>Promise<T>):Promise<T>;canonical:CanonicalRepository;clock:()=>string;exportSnapshot():Promise<string>;importSnapshot(wire:string):Promise<void>}
const same=(a:unknown,b:unknown)=>canonicalJSON(a)===canonicalJSON(b);
const claimKey=(p:Identity,c:Identity)=>canonicalJSON([p,c]);
function activeClaim(s:State,i:ReleaseIntent):ContinuationClaim{const c=s.claims.find(c=>claimKey(c.principal,c.causal_episode)===claimKey(i.principal,i.causal_episode));demand(c,'ACTIVE_CONTINUATION_REQUIRED');return c;}
function attempt(s:State,ref:unknown):ReleaseAttempt{const id=decodeIdentity(ref);demand(id.kind==='RELEASE_ATTEMPT','ATTEMPT_KIND');const a=s.attempts.find(a=>sameIdentity(a.attempt,id));demand(a,'ATTEMPT_MISSING');return a;}
async function authority(repo:CanonicalRepository,s:State,i:ReleaseIntent,a:Identity,c:ContinuationClaim,at:string){
 const history=await repo.history({schema_version:SCHEMA_VERSION,principal:i.principal,as_of:at});
 for(const ref of [i.principal,i.sponsor,i.grantee,i.incarnation,i.objective,i.obligation,i.work_episode,i.causal_episode,i.occurrence,i.privacy.recipient])demand(history.some(v=>v.object_type==='IDENTITY'&&same(v.object,ref)&&knownAsOf(v.temporal,at)),'UNREGISTERED_RELEASE_IDENTITY');
 const current=await repo.current({schema_version:SCHEMA_VERSION,principal:i.principal,subject:i.principal,predicate:authorityPredicate(i.authority_domain),as_of:at});
 const seen=s.leases.filter(l=>sameIdentity(l.principal,i.principal)&&l.authority.authority.binding.authority_domain===i.authority_domain);
 demand(seen.every(l=>i.authority_generation>=l.authority.authority.latest_generation&&i.authority_policy_version>=l.authority.authority.policy_version&&i.privacy_policy_version>=l.authority.authority.privacy_policy_version),'AUTHORITY_STATE_REGRESSION');
 const revoked=s.revocations.find(r=>sameIdentity(r.principal,i.principal)&&r.domain===i.authority_domain)?.generation??0;
 return validateAuthority(current,i,a,c,at,revoked);
}
function fence(s:State,i:ReleaseIntent,expected:unknown):ContinuationClaim{const c=activeClaim(s,i),x=decodeContinuation(expected);demand(same(c,x),'CONTINUATION_COMPARE_FAILED');return c;}
export function decodeSubmission(input:unknown,a:ReleaseAttempt):Readonly<SubmissionReceipt>{
 const r=record(input,['receipt','attempt','intent','occurrence','operation_digest','provider_call_id','evidence_refs','status']);const receipt=decodeIdentity(r.receipt);
 demand(receipt.kind==='RECEIPT'&&sameIdentity(decodeIdentity(r.attempt),a.attempt)&&sameIdentity(decodeIdentity(r.intent),a.intent.intent)&&sameIdentity(decodeIdentity(r.occurrence),a.intent.occurrence)&&r.operation_digest===a.intent.operation_digest&&r.status==='SUBMISSION_KNOWN','SUBMISSION_RECEIPT_BINDING');
 return freeze({receipt,attempt:a.attempt,intent:a.intent.intent,occurrence:a.intent.occurrence,operation_digest:a.intent.operation_digest,provider_call_id:text(r.provider_call_id),evidence_refs:evidence(denseArray(r.evidence_refs)),status:'SUBMISSION_KNOWN'});
}
async function reduce(s:State,repo:CanonicalRepository,input:unknown,at:string):Promise<unknown>{
 const outer=record(input,['kind','value']),kind=text(outer.kind);
 if(kind==='ADMIT_CONTINUATION'){
  const r=record(outer.value,['claim']),c=decodeContinuation(r.claim);demand(c.temporal.valid_until!==undefined&&knownAsOf(c.temporal,at),'INITIAL_CONTINUATION_INVALID');
  demand(!s.claims.some(x=>claimKey(x.principal,x.causal_episode)===claimKey(c.principal,c.causal_episode)),'CONTINUATION_ALREADY_ADMITTED');
  const model=await repo.reconstruct({schema_version:SCHEMA_VERSION,principal:c.principal,as_of:at});
  demand(model.views.some(v=>v.known_effective&&v.selected?.object_type==='CONTINUATION'&&same(v.selected.payload,c)),'CANONICAL_INITIAL_CLAIM_REQUIRED');
  s.claims.push(structuredClone(c));return c;
 }
 if(kind==='TRANSFER_CONTINUATION'){
  const r=record(outer.value,['expected','successor']),x=decodeContinuation(r.expected),n=decodeContinuation(r.successor),idx=s.claims.findIndex(c=>claimKey(c.principal,c.causal_episode)===claimKey(x.principal,x.causal_episode));
  demand(idx>=0&&same(s.claims[idx],x),'CONTINUATION_COMPARE_FAILED');
  demand(sameIdentity(n.principal,x.principal)&&sameIdentity(n.causal_episode,x.causal_episode)&&!sameIdentity(n.owner_incarnation,x.owner_incarnation)&&!sameIdentity(n.claim,x.claim)&&n.generation===x.generation+1&&n.fence_token!==x.fence_token,'SUCCESSOR_FENCE_REQUIRED');
  demand(n.temporal.valid_until!==undefined&&knownAsOf(n.temporal,at),'SUCCESSOR_TEMPORAL_INVALID');
  const history=await repo.history({schema_version:SCHEMA_VERSION,principal:n.principal,as_of:at});demand(history.some(v=>v.object_type==='IDENTITY'&&sameIdentity(v.object as Identity,n.owner_incarnation)&&knownAsOf(v.temporal,at)),'SUCCESSOR_INCARNATION_UNREGISTERED');
  s.claims[idx]=structuredClone(n);return n;
 }
 if(kind==='REVOKE'){
  const r=record(outer.value,['principal','domain','expected_generation','evidence_refs']),principal=decodeIdentity(r.principal);demand(principal.kind==='PRINCIPAL','PRINCIPAL_KIND');const domain=text(r.domain),g=version(r.expected_generation),refs=evidence(denseArray(r.evidence_refs));
  const current=await repo.current({schema_version:SCHEMA_VERSION,principal,subject:principal,predicate:authorityPredicate(domain),as_of:at});demand(current.status==='RECORDED_AS_OF'&&current.record!==null,'REVOCATION_CURRENT_REQUIRED');
  const payload=current.record.payload as {value:{latest_generation:number}};demand(payload.value.latest_generation===g,'REVOCATION_GENERATION_COMPARE_FAILED');
  const prior=s.revocations.find(x=>sameIdentity(x.principal,principal)&&x.domain===domain);demand(!prior||g>prior.generation,'GENERATION_ALREADY_REVOKED');
  const value={principal,domain,generation:g,evidence_refs:refs};if(prior)Object.assign(prior,value);else s.revocations.push(value);return value;
 }
 if(kind==='ISSUE_LEASE'||kind==='PREPARE'){
  const r=record(outer.value,['intent','attempt','fence']),i=decodeIntent(r.intent),a=decodeIdentity(r.attempt);demand(a.kind==='RELEASE_ATTEMPT','ATTEMPT_KIND');
  if(kind==='PREPARE'){
   const old=s.attempts.find(x=>sameIdentity(x.intent.intent,i.intent)||sameIdentity(x.attempt,a));if(old){demand(sameIdentity(old.attempt,a)&&same(old.intent,i),'INTENT_OR_ATTEMPT_IDENTITY_DRIFT');return old;}
   demand(!s.attempts.some(x=>sameIdentity(x.intent.principal,i.principal)&&sameIdentity(x.intent.occurrence,i.occurrence)),'OCCURRENCE_ALREADY_OWNED');
   demand(!s.attempts.some(x=>sameIdentity(x.intent.principal,i.principal)&&x.intent.tool_id===i.tool_id&&x.intent.idempotency_key===i.idempotency_key),'IDEMPOTENCY_CLASS_ALREADY_OWNED');
  }
  const c=fence(s,i,r.fence),snapshot=await authority(repo,s,i,a,c,at);
  if(kind==='ISSUE_LEASE'){
   const old=s.leases.find(x=>sameIdentity(x.principal,i.principal)&&x.lease_id===i.lease_id);if(old){demand(old.intent_digest===i.operation_digest,'LEASE_IDENTITY_DRIFT');return old;}
   const l={principal:i.principal,lease_id:i.lease_id,intent_digest:i.operation_digest,authority:snapshot};s.leases.push(l);return l;
  }
  demand(s.leases.some(x=>sameIdentity(x.principal,i.principal)&&x.lease_id===i.lease_id&&x.intent_digest===i.operation_digest),'DURABLE_VALIDATED_LEASE_REQUIRED');
  const result:ReleaseAttempt={schema_version:ENFORCEMENT_SCHEMA,attempt:a,intent:i,state:'PREPARED',version:1,prepared_at:at,updated_at:at,fence:c,authority:snapshot,dispatch_id:null,receipt:null,evidence_refs:[...i.evidence_refs],reason:null,effect:'NOT_ADJUDICATED'};s.attempts.push(result);return result;
 }
 if(kind==='RELEASE'){
  const r=record(outer.value,['attempt','dispatch_id','retry']),a=attempt(s,r.attempt);demand(typeof r.retry==='boolean','EXPLICIT_RETRY_REQUIRED');const dispatch=text(r.dispatch_id);
  if(!['PREPARED','NO_SUBMISSION_PROVEN'].includes(a.state))return {owned:false,attempt:a};
  if(a.state==='NO_SUBMISSION_PROVEN')demand(r.retry===true&&a.intent.retry_class!=='NON_IDEMPOTENT_UNSAFE','RETRY_NOT_ELIGIBLE');else demand(r.retry===false,'RETRY_WITHOUT_PROOF');
  try{const c=fence(s,a.intent,a.fence);a.authority=await authority(repo,s,a.intent,a.attempt,c,at);}
  catch(error){a.state='DENIED';a.reason=(error as Error).message;a.updated_at=at;a.version++;return {owned:false,attempt:a};}
  a.state='SUBMITTING';a.dispatch_id=dispatch;a.updated_at=at;a.version++;a.reason='POSSIBLE_SUBMISSION_RECONCILIATION_REQUIRED';return {owned:true,attempt:a};
 }
 if(kind==='PRE_SUBMISSION_FAILURE'){
  const r=record(outer.value,['attempt','evidence_refs']),a=attempt(s,r.attempt),refs=evidence(denseArray(r.evidence_refs));
  if(a.state==='PREPARED'){a.state='NO_SUBMISSION_PROVEN';a.evidence_refs.push(...refs);a.reason='PREFLIGHT_FAILED_BEFORE_RELEASE_OWNERSHIP';a.updated_at=at;a.version++;}return a;
 }
 if(kind==='COMPLETE'||kind==='AMBIGUOUS'){
  const r=record(outer.value,kind==='COMPLETE'?['attempt','dispatch_id','receipt']:['attempt','dispatch_id','evidence_refs']),a=attempt(s,r.attempt);
  demand(a.state==='SUBMITTING'&&a.dispatch_id===text(r.dispatch_id),'DISPATCH_COMPARE_FAILED');
  if(kind==='COMPLETE'){const receipt=decodeSubmission(r.receipt,a);demand(!s.attempts.some(x=>x.receipt&&sameIdentity(x.receipt.receipt,receipt.receipt)),'DUPLICATE_RECEIPT_ID');a.receipt=receipt;a.state='RELEASED_SUBMITTED';a.reason=null;}
  else{a.evidence_refs.push(...evidence(denseArray(r.evidence_refs)));a.state='AMBIGUOUS_SUBMISSION';a.reason='RECONCILIATION_REQUIRED_NO_BLIND_RETRY';}
  a.updated_at=at;a.version++;return a;
 }
 demand(false,'UNSUPPORTED_ENFORCEMENT_COMMAND');
}
async function canonicalAt(commands:readonly AppendCommand[]):Promise<CanonicalRepository>{const repo=new MemoryCanonicalRepository();await repo.importSnapshot(canonicalJSON({schema_version:SCHEMA_VERSION,commands,records:commands.map(c=>c.value)}));return repo;}
export async function replayEnforcement(events:readonly EnforcementEvent[],commands:readonly AppendCommand[]):Promise<State>{
 const state:State={claims:[],leases:[],attempts:[],revocations:[]};let count=0,last=-Infinity;
 for(const [index,input] of events.entries()){const e=record(input,['schema_version','sequence','at','canonical_count','canonical_digest','command','result']);demand(e.schema_version===ENFORCEMENT_SCHEMA&&e.sequence===index+1,'ENFORCEMENT_EVENT_SEQUENCE');
  const at=instant(e.at),n=e.canonical_count as number;demand(Number.isSafeInteger(n)&&n>=count&&n<=commands.length,'CANONICAL_CAPTURE_COUNT');demand(Date.parse(at)>=last,'ENFORCEMENT_TIME_REGRESSION');
  const captured=commands.slice(0,n);demand(e.canonical_digest===digest(captured),'CANONICAL_CAPTURE_DRIFT');const repo=await canonicalAt(captured);const result=await reduce(state,repo,e.command,at);demand(same(result,e.result),'ENFORCEMENT_RESULT_DRIFT');count=n;last=Date.parse(at);
 }
 return state;
}
export class EnforcementRepository {
 readonly canonical:CanonicalRepository;#backend:EnforcementBackend;
 constructor(backend:EnforcementBackend){
  this.#backend=backend;
  // Capture before either backend can queue or await. B1/B2 decoders remain authoritative.
  const c=backend.canonical,capture=<T>(v:T)=>freeze(jsonValue(v)) as T;
  this.canonical={append:async v=>c.append(capture(v)),history:async v=>c.history(capture(v)),current:async v=>c.current(capture(v)),reconstruct:async v=>c.reconstruct(capture(v)),exportSnapshot:()=>c.exportSnapshot(),importSnapshot:async wire=>c.importSnapshot(text(wire))};
 }
 async command(input:unknown):Promise<unknown>{const captured=freeze(jsonValue(input));return this.#backend.atomic(async v=>{
  const s=await replayEnforcement(v.events,v.canonical_commands),at=instant(this.#backend.clock());demand(!v.events.length||Date.parse(at)>=Date.parse(v.events.at(-1)!.at),'ENFORCEMENT_TIME_REGRESSION');
  const before=canonicalJSON(s),result=await reduce(s,v.canonical,captured,at);if(canonicalJSON(s)===before)return freeze(result);const event:EnforcementEvent={schema_version:ENFORCEMENT_SCHEMA,sequence:v.events.length+1,at,canonical_count:v.canonical_commands.length,canonical_digest:digest(v.canonical_commands),command:captured,result:jsonValue(result)};
  await v.append(event);return freeze(result);
 });}
 async inspect():Promise<Readonly<State>>{return this.#backend.atomic(async v=>freeze(await replayEnforcement(v.events,v.canonical_commands)));}
 async nextSafeAction(ref:unknown){const a=await this.getAttempt(ref);return ['SUBMITTING','AMBIGUOUS_SUBMISSION'].includes(a.state)?'RECONCILIATION_REQUIRED':a.state==='RELEASED_SUBMITTED'?'B4_EFFECT_VERIFICATION_REQUIRED':a.state==='DENIED'?'HOLD':'VALIDATE_AT_RELEASE';}
 async getAttempt(ref:unknown):Promise<Readonly<ReleaseAttempt>>{const captured=freeze(decodeIdentity(ref));return freeze(attempt(await this.inspect() as State,captured));}
 async reconstruct(principal:Identity,at:string){const captured=freeze(decodeIdentity(principal)),cut=instant(at);return this.#backend.atomic(async v=>{
  const events=v.events.filter(e=>Date.parse(e.at)<=Date.parse(cut)),state=await replayEnforcement(events,v.canonical_commands);
  const canonical=await v.canonical.reconstruct({schema_version:SCHEMA_VERSION,principal:captured,as_of:cut});
  return freeze({schema_version:ENFORCEMENT_SCHEMA,canonical,enforcement:{claims:state.claims.filter(c=>sameIdentity(c.principal,captured)),leases:state.leases.filter(l=>sameIdentity(l.principal,captured)),attempts:state.attempts.filter(a=>sameIdentity(a.intent.principal,captured)),revocations:state.revocations.filter(r=>sameIdentity(r.principal,captured))},admission:'NOT_ADJUDICATED',effect_verification:'NOT_ADJUDICATED'});
 });}
 exportSnapshot(){return this.#backend.exportSnapshot();}importSnapshot(wire:string){return this.#backend.importSnapshot(wire);}
}
export interface ReleaseRequest {intent:ReleaseIntent;attempt:Identity;fence:ContinuationClaim;retry:boolean}
export function decodeReleaseRequest(input:unknown):Readonly<ReleaseRequest>{
 const r=record(input,['intent','attempt','fence','retry']),attempt=decodeIdentity(r.attempt);
 demand(attempt.kind==='RELEASE_ATTEMPT','ATTEMPT_KIND');demand(typeof r.retry==='boolean','EXPLICIT_RETRY_REQUIRED');
 return freeze({intent:decodeIntent(r.intent) as ReleaseIntent,attempt,fence:decodeContinuation(r.fence) as ContinuationClaim,retry:r.retry});
}
export interface SubmissionPermit {readonly dispatch_id:string}
const permits=new WeakMap<SubmissionPermit,{intent:ReleaseIntent;attempt:Identity}>();
// Unforgeable process-local dispatch capability, minted only after durable ownership.
// It is never persisted, serialized, reconstructed, or a provider credential.
export function consumeSubmissionPermit(permit:SubmissionPermit,intent:ReleaseIntent,attempt:Identity){
 const binding=permits.get(permit);demand(binding&&same(binding.intent,intent)&&sameIdentity(binding.attempt,attempt),'DURABLE_SUBMISSION_PERMIT_REQUIRED');permits.delete(permit);return permit.dispatch_id;
}
export interface ConsequentialTransport {
 readonly binding:{tool_id:string;configuration_digest:string;capability_id:string;qualification_id:string};
 // This probe must have no consequential effect; throwing is a proven local pre-release failure only.
 preflight(intent:Readonly<ReleaseIntent>):Promise<{ready:true}|{ready:false;evidence_refs:string[]}>;
 submit(intent:Readonly<ReleaseIntent>,attempt:Identity,permit:SubmissionPermit):Promise<SubmissionReceipt>;
}
export class ReleaseService {
 readonly repository:EnforcementRepository;#transport:ConsequentialTransport;#actor:{principal:Identity;grantee:Identity;incarnation:Identity;configuration_digest:string};
 constructor(repository:EnforcementRepository,transport:ConsequentialTransport,actor:{principal:Identity;grantee:Identity;incarnation:Identity;configuration_digest:string}){this.repository=repository;this.#transport=transport;this.#actor=freeze(actor);}
 async release(request:ReleaseRequest):Promise<Readonly<ReleaseAttempt>>{
  const captured=decodeReleaseRequest(request),intent=captured.intent;const b=freeze(jsonValue(this.#transport.binding)) as ConsequentialTransport['binding'];const preflight=this.#transport.preflight.bind(this.#transport),submit=this.#transport.submit.bind(this.#transport);demand(b.tool_id===intent.tool_id&&b.configuration_digest===intent.configuration_digest&&b.capability_id===intent.capability_id&&b.qualification_id===intent.qualification_id,'TRANSPORT_BINDING_MISMATCH');demand(sameIdentity(intent.principal,this.#actor.principal)&&sameIdentity(intent.grantee,this.#actor.grantee)&&sameIdentity(intent.incarnation,this.#actor.incarnation)&&intent.configuration_digest===this.#actor.configuration_digest,'EXECUTION_ACTOR_BINDING_MISMATCH');
  const prepared=await this.repository.command({kind:'PREPARE',value:{intent,attempt:captured.attempt,fence:captured.fence}}) as ReleaseAttempt;
  demand(same(prepared.attempt,captured.attempt)&&same(prepared.intent,intent)&&same(prepared.fence,captured.fence),'PREPARED_INVOCATION_BINDING_MISMATCH');
  if(!['PREPARED','NO_SUBMISSION_PROVEN'].includes(prepared.state))return prepared;
  if(prepared.state==='NO_SUBMISSION_PROVEN'&&!captured.retry)return prepared;
  let probe:{ready:true}|{ready:false;evidence_refs:string[]};
  try{probe=await preflight(intent);}catch{probe={ready:false,evidence_refs:['B3_LOCAL_PREFLIGHT_EXCEPTION_BEFORE_DISPATCH']};}
  const p=record(probe,probe.ready===true?['ready']:['ready','evidence_refs']);demand(typeof p.ready==='boolean','PREFLIGHT_RESULT_INVALID');
  if(!probe.ready)return await this.repository.command({kind:'PRE_SUBMISSION_FAILURE',value:{attempt:captured.attempt,evidence_refs:probe.evidence_refs}}) as ReleaseAttempt;
  const dispatchId=randomUUID();const claimed=await this.repository.command({kind:'RELEASE',value:{attempt:captured.attempt,dispatch_id:dispatchId,retry:captured.retry}}) as {owned:boolean;attempt:ReleaseAttempt};
  demand(same(claimed.attempt.attempt,captured.attempt)&&same(claimed.attempt.intent,intent)&&same(claimed.attempt.fence,captured.fence),'CLAIMED_INVOCATION_BINDING_MISMATCH');
  if(!claimed.owned)return claimed.attempt;
  demand(claimed.attempt.dispatch_id===dispatchId&&claimed.attempt.state==='SUBMITTING'&&same(b,jsonValue(this.#transport.binding)),'DISPATCH_BINDING_MISMATCH');
  // Durable SUBMITTING linearizes release before any provider dispatch. Once possibly
  // submitted, every exception/timeout/malformed receipt is ambiguous, never retry proof.
  let receipt:SubmissionReceipt;const permit=Object.freeze({dispatch_id:dispatchId});permits.set(permit,{intent,attempt:captured.attempt});
  try{receipt=decodeSubmission(await submit(intent,captured.attempt,permit),claimed.attempt);}
  catch{return await this.repository.command({kind:'AMBIGUOUS',value:{attempt:captured.attempt,dispatch_id:dispatchId,evidence_refs:['B3_TRANSPORT_EXCEPTION_OR_INVALID_RECEIPT_AFTER_RELEASE']}}) as ReleaseAttempt;}
  finally{permits.delete(permit);}
  // Persistence failure here propagates. A later caller sees SUBMITTING and reconciles.
  return await this.repository.command({kind:'COMPLETE',value:{attempt:captured.attempt,dispatch_id:dispatchId,receipt}}) as ReleaseAttempt;
 }
}
export async function decodeEnforcementSnapshot(wire:string){const r=record(parseJSON(text(wire)),['schema_version','canonical','events']);demand(r.schema_version===ENFORCEMENT_SCHEMA,'B3_SNAPSHOT_SCHEMA');const canonical=await canonicalAt(denseArray((record(r.canonical,['schema_version','commands','records'])).commands) as unknown as AppendCommand[]);const exported=parseJSON(await canonical.exportSnapshot());demand(same(exported,r.canonical),'CANONICAL_SNAPSHOT_DRIFT');const commands=(exported as {commands:AppendCommand[]}).commands,events=denseArray(r.events) as unknown as EnforcementEvent[];await replayEnforcement(events,commands);return {canonical:exported,commands,events};}
