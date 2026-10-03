import { decodeRecord, recordKey, SCHEMA_VERSION, type CanonicalRecord, decodeRepositoryIdentity as decodeIdentity, sameRepositoryIdentity as sameIdentity, type RepositoryIdentity as Identity } from '../domain/canonical.ts';
import { instant, knownAsOf, temporalAsOf } from '../semantic-kernel/temporal.ts';
import { parseJSON, denseArray } from '../domain/json.ts';
import { sourceReferences } from '../domain/relations.ts';
import { reduceLifecycle, reduceEffect } from '../semantic-kernel/lifecycle.ts';
import { demand, evidence, freeze, member, record, text } from '../semantic-kernel/validation.ts';
export interface AppendCommand { schema_version: typeof SCHEMA_VERSION; expected_version: number; transition: unknown; value: CanonicalRecord }
export interface AsOfQuery { schema_version: typeof SCHEMA_VERSION; principal: import('../semantic-kernel/identity.ts').Identity; as_of: string }
export interface ReconstructionView { record_id:string; selected:Readonly<CanonicalRecord>|null; temporal:ReturnType<typeof temporalAsOf>|null; known_effective:boolean }
export interface ReconstructionDTO { schema_version:typeof SCHEMA_VERSION; principal:AsOfQuery['principal']; as_of:string; history:readonly CanonicalRecord[]; views:readonly ReconstructionView[]; admission:'NOT_ADJUDICATED' }
export interface CurrentDTO { schema_version:typeof SCHEMA_VERSION; principal:AsOfQuery['principal']; as_of:string; subject:Identity; predicate:string; status:'MISSING'|'RECORDED_AS_OF'|'INACTIVE_AS_OF'; record:Readonly<CanonicalRecord>|null; temporal:ReturnType<typeof temporalAsOf>|null }
export interface CanonicalSnapshot { schema_version: typeof SCHEMA_VERSION; records: CanonicalRecord[]; commands: AppendCommand[] }
export interface CanonicalRepository {
  append(command: unknown): Promise<Readonly<CanonicalRecord>>;
  history(query: unknown): Promise<readonly CanonicalRecord[]>;
  reconstruct(query: unknown): Promise<Readonly<ReconstructionDTO>>;
  current(query: unknown): Promise<Readonly<CurrentDTO>>;
  exportSnapshot(): Promise<string>;
  importSnapshot(wire: string): Promise<void>;
}
export function decodeQuery(value: unknown): AsOfQuery {
  const r=record(value,['schema_version','principal','as_of']); demand(r.schema_version===SCHEMA_VERSION,'UNSUPPORTED_REPOSITORY_SCHEMA');
  const principal=decodeIdentity(r.principal); demand(principal.kind==='PRINCIPAL','PRINCIPAL_KIND');
  return freeze({schema_version:SCHEMA_VERSION,principal:principal as AsOfQuery['principal'],as_of:instant(r.as_of)});
}
function zeroVersion(v:unknown): number { demand(Number.isSafeInteger(v)&&(v as number)>=0,'EXPECTED_VERSION_REQUIRED'); return v as number; }
export function decodeCommand(value:unknown): AppendCommand {
  const r=record(value,['schema_version','expected_version','transition','value']); demand(r.schema_version===SCHEMA_VERSION,'UNSUPPORTED_REPOSITORY_SCHEMA');
  return freeze({schema_version:SCHEMA_VERSION,expected_version:zeroVersion(r.expected_version),transition:r.transition,value:decodeRecord(r.value)});
}
export function canonicalJSON(value:unknown):string {
  function order(v:unknown):unknown { if(Array.isArray(v)) return v.map(order); if(v!==null&&typeof v==='object') return Object.fromEntries(Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,x])=>[k,order(x)]));return v;}
  return JSON.stringify(order(value));
}
function equal(a:unknown,b:unknown) { return canonicalJSON(a)===canonicalJSON(b); }
function referencedIdentities(v:CanonicalRecord): Identity[] {
  const p=v.payload as Record<string,unknown>;
  if(v.object_type==='ROOT_DISPOSITION'){const privacy=p.privacy as Record<string,unknown>;return [decodeIdentity(privacy.recipient_ref),...(p.holder_ref===null?[]:[decodeIdentity(p.holder_ref)])];}
  if(v.object_type==='RELATION') return [decodeIdentity(p.source),decodeIdentity(p.target)];
  if(v.object_type==='CAUSAL_OCCURRENCE') return [decodeIdentity(p.originating_ref)];
  if(v.object_type==='CONTINUATION') return [decodeIdentity(p.causal_episode),decodeIdentity(p.owner_incarnation)];
  if(v.object_type==='EFFECT') return [decodeIdentity(p.occurrence)];
  return [];
}
export function validateAppend(prior: readonly CanonicalRecord[], input:unknown): AppendCommand {
  const command=decodeCommand(input), v=command.value;
  const list=prior.filter(x=>recordKey(x)===recordKey(v)); const prev=list.at(-1);
  demand(command.expected_version===(prev?.version??0),'STALE_REPOSITORY_VERSION');
  demand(v.version===command.expected_version+1&&Number.isSafeInteger(v.version),'NONCONTIGUOUS_VERSION');
  demand(!list.some(x=>x.event_ref===v.event_ref),'DUPLICATE_RECORD_EVENT');
  if(['LIFECYCLE','EFFECT','CONTINUATION','ENTITY'].includes(v.object_type))demand(!prior.some(x=>sameIdentity(x.principal,v.principal)&&sameIdentity(x.object,v.object)&&x.object_type===v.object_type&&x.record_id!==v.record_id),'DUPLICATE_SEMANTIC_STREAM');
  if(v.object_type==='ROOT_DISPOSITION')demand(!prior.some(x=>sameIdentity(x.principal,v.principal)&&sameIdentity(x.object,v.object)&&x.object_type==='ROOT_DISPOSITION'&&(x.payload as Record<string,unknown>).boundary_id===(v.payload as Record<string,unknown>).boundary_id&&(x.payload as Record<string,unknown>).consumer_class===(v.payload as Record<string,unknown>).consumer_class&&x.record_id!==v.record_id),'DUPLICATE_BOUNDARY_DISPOSITION_STREAM');
  if(v.object_type==='RELATION')demand(!prior.some(x=>sameIdentity(x.principal,v.principal)&&x.object_type==='RELATION'&&(x.payload as Record<string,unknown>).relation_id===(v.payload as Record<string,unknown>).relation_id&&x.record_id!==v.record_id),'DUPLICATE_RELATION_ID');
  demand(!prev||sameIdentity(prev.object,v.object)&&prev.object_type===v.object_type,'IMMUTABLE_RECORD_BINDING');
  demand(!prev||Date.parse(v.temporal.recorded_at)>=Date.parse(prev.temporal.recorded_at),'RECORDING_TIME_REGRESSION');
  const visible=prior.filter(x=>sameIdentity(x.principal,v.principal)&&Date.parse(x.temporal.recorded_at)<=Date.parse(v.temporal.recorded_at));
  demand(v.object_type==='IDENTITY'&&sameIdentity(v.object,v.principal)||visible.some(x=>x.object_type==='IDENTITY'&&sameIdentity(x.object,v.principal)),'UNREGISTERED_PRINCIPAL');
  demand(v.object_type==='IDENTITY'||visible.some(x=>x.object_type==='IDENTITY'&&sameIdentity(x.object,v.object)),'UNREGISTERED_OBJECT');
  for(const ref of v.references) demand(visible.some(x=>x.record_id===ref.record_id&&sameIdentity(x.object,ref.object)&&x.version===ref.version),'DANGLING_OR_FUTURE_REFERENCE');
  for(const ref of [...referencedIdentities(v),...sourceReferences(v)]) demand(v.references.some(x=>sameIdentity(x.object,ref)),'PAYLOAD_REFERENCE_NOT_DECLARED');
  if(v.object_type==='IDENTITY'||v.object_type==='CAUSAL_OCCURRENCE') {demand(!prev,'IMMUTABLE_IDENTITY_OR_OCCURRENCE');demand(!prior.some(x=>x.object_type===v.object_type&&sameIdentity(x.principal,v.principal)&&sameIdentity(x.object,v.object)),'DUPLICATE_IDENTITY_OR_OCCURRENCE');}
  if(prev&&['LIFECYCLE','EFFECT'].includes(v.object_type)) {
    const reduced=v.object_type==='LIFECYCLE'?reduceLifecycle(prev.payload,command.transition):reduceEffect(prev.payload,command.transition);
    demand(equal(reduced,v.payload),'CALLER_SEMANTIC_SHORTCUT');
    demand((command.transition as Record<string,unknown>).at===v.temporal.effective_from,'TRANSITION_TIME_MISMATCH');
  } else if(prev&&v.object_type==='RELATION'){
    const p=prev.payload as Record<string,unknown>,n=v.payload as Record<string,unknown>;
    demand(p.relation_id===n.relation_id&&p.kind===n.kind&&equal(p.source,n.source)&&equal(p.target,n.target),'IMMUTABLE_RELATION_BINDING');
    const event=record(command.transition,['event_id','kind','at','evidence_refs']);
    demand(text(event.event_id)===v.event_ref&&instant(event.at)===v.temporal.recorded_at,'RELATION_EVENT_BINDING');evidence(event.evidence_refs);
    const kind=member(event.kind,['CORRECTION','SUPERSESSION','REVOCATION'] as const);
    if(kind==='SUPERSESSION')demand(v.temporal.superseded_at!==undefined,'SUPERSESSION_COORDINATE_REQUIRED');
    if(kind==='REVOCATION')demand(v.temporal.revoked_at!==undefined,'REVOCATION_COORDINATE_REQUIRED');
  } else if(v.object_type!=='CURRENT') demand(command.transition===null,'UNEXPECTED_TRANSITION');
  if(prev&&v.object_type==='CONTINUATION') demand(false,'B3_CONTINUATION_TRANSFER_REQUIRED');
  if(v.object_type==='CURRENT') {
    const event=record(command.transition,['event_id','kind','at','evidence_refs']);text(event.event_id);evidence(event.evidence_refs);
    const kind=member(event.kind,['ASSERT','CORRECTION','SUPERSESSION','REVOCATION','EXPIRY'] as const);
    demand(instant(event.at)===v.temporal.recorded_at,'CURRENT_EVENT_RECORDING_MISMATCH');
    demand(prev?kind!=='ASSERT':kind==='ASSERT','CURRENT_EVENT_KIND');
    demand(event.event_id===v.event_ref,'CURRENT_EVENT_ID_MISMATCH');
    demand(!prior.some(x=>sameIdentity(x.principal,v.principal)&&x.record_id===v.record_id&&x.event_ref===v.event_ref),'DUPLICATE_CURRENT_EVENT');
    if(kind==='REVOCATION')demand(v.temporal.revoked_at!==undefined,'REVOCATION_COORDINATE_REQUIRED');
    if(kind==='EXPIRY')demand(v.temporal.valid_until!==undefined,'EXPIRY_COORDINATE_REQUIRED');
    const p=v.payload as Record<string,unknown>;
    demand(!prev||equal((prev.payload as Record<string,unknown>).subject,p.subject)&&(prev.payload as Record<string,unknown>).predicate===p.predicate,'CURRENT_BINDING_DRIFT');
    demand(!prior.some(x=>x.object_type==='CURRENT'&&sameIdentity(x.principal,v.principal)&&x.record_id!==v.record_id&&sameIdentity(x.object,v.object)&&(x.payload as Record<string,unknown>).predicate===p.predicate),'DUPLICATE_CURRENT_STREAM');
  }
  return command;
}
export interface Journal { read():Promise<readonly AppendCommand[]>; append(command:AppendCommand):Promise<void>; importEmpty(commands:readonly AppendCommand[]):Promise<void> }
function replay(commands:readonly unknown[]): {records:CanonicalRecord[];commands:AppendCommand[]} {
  const values:CanonicalRecord[]=[], result:AppendCommand[]=[];
  for(const input of commands) { const c=validateAppend(values,input); values.push(c.value); result.push(c); }
  return {records:values,commands:result};
}
export class ValidatedRepository implements CanonicalRepository {
  #journal:Journal;
  constructor(journal:Journal){this.#journal=journal;}
  async append(input:unknown) {const {records}=replay(await this.#journal.read());const c=validateAppend(records,input);await this.#journal.append(c);return freeze(c.value);}
  async history(input:unknown){const q=decodeQuery(input);const {records}=replay(await this.#journal.read());return freeze(records.filter(x=>sameIdentity(x.principal,q.principal)&&Date.parse(x.temporal.recorded_at)<=Date.parse(q.as_of)));}
  async reconstruct(input:unknown):Promise<Readonly<ReconstructionDTO>>{
    const q=decodeQuery(input), history=await this.history(q), streams=new Map<string,CanonicalRecord[]>();
    for(const v of history){const k=recordKey(v); streams.set(k,[...(streams.get(k)??[]),v]);}
    const views=[...streams.values()].map(list=>{
      // Select a superseding recorded/effective event BEFORE validity evaluation;
      // an expired/revoked replacement must never resurrect predecessor truth.
      const eligible=list.filter(x=>Date.parse(x.temporal.effective_from)<=Date.parse(q.as_of));
      const selected=eligible.at(-1);
      return {record_id:list[0]!.record_id,selected:selected??null,temporal:selected?temporalAsOf(selected.temporal,q.as_of):null,known_effective:selected?knownAsOf(selected.temporal,q.as_of):false};
    });
    return freeze({schema_version:SCHEMA_VERSION,principal:q.principal,as_of:q.as_of,history,views,admission:'NOT_ADJUDICATED'});
  }
  async current(input:unknown):Promise<Readonly<CurrentDTO>>{
    const r=record(input,['schema_version','principal','as_of','subject','predicate']);const q=decodeQuery({schema_version:r.schema_version,principal:r.principal,as_of:r.as_of});
    const subject=decodeIdentity(r.subject),predicate=text(r.predicate);const model=await this.reconstruct(q);
    const matches=model.views.filter(v=>v.selected?.object_type==='CURRENT'&&sameIdentity(v.selected.object,subject)&&(v.selected.payload as Record<string,unknown>).predicate===predicate);
    demand(matches.length<=1,'CONFLICTING_CURRENT_STREAMS'); const view=matches[0];
    return freeze({schema_version:SCHEMA_VERSION,principal:q.principal,as_of:q.as_of,subject,predicate,status:!view?'MISSING':view.known_effective?'RECORDED_AS_OF':'INACTIVE_AS_OF',record:view?.selected??null,temporal:view?.temporal??null});
  }
  async exportSnapshot(){const model=replay(await this.#journal.read());return canonicalJSON({schema_version:SCHEMA_VERSION,...model});}
  async importSnapshot(wire:string){
    const r=record(parseJSON(text(wire)),['schema_version','records','commands']); demand(r.schema_version===SCHEMA_VERSION,'UNSUPPORTED_REPOSITORY_SCHEMA');
    const commands=denseArray(r.commands),records=denseArray(r.records);
    const model=replay(commands); demand(equal(records.map(decodeRecord),model.records),'SNAPSHOT_JOURNAL_DRIFT');
    await this.#journal.importEmpty(model.commands);
  }
}
export class MemoryCanonicalRepository extends ValidatedRepository {
  constructor(){
    let commands:AppendCommand[]=[];
    const journal:Journal={read:async()=>freeze(commands),append:async c=>{validateAppend(commands.map(x=>x.value),c);commands.push(freeze(c));},importEmpty:async c=>{demand(commands.length===0,'IMPORT_REQUIRES_EMPTY_STORE');commands=[...freeze(c)];}};
    super(journal);
  }
}
