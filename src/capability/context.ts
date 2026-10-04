// B5 reads B2 Current. This is a bracketed, disposable interpretation, never a
// new Current, authority plane, journal, or capability ontology.
import {MemoryCanonicalRepository, canonicalJSON, type CanonicalRepository} from '../state/repository.ts';
import {SCHEMA_VERSION, decodeReference, type CanonicalRecord, type Reference} from '../domain/canonical.ts';
import {decodeIdentity, type Identity} from '../semantic-kernel/identity.ts';
import {instant, knownAsOf} from '../semantic-kernel/temporal.ts';
import {demand, record, freeze, text} from '../semantic-kernel/validation.ts';
import {digest} from '../enforcement/contracts.ts';
export const B5='IRIS_B5_V1' as const;
export const predicate=(name:string)=>canonicalJSON([B5,text(name)]);
export const same=(a:unknown,b:unknown)=>canonicalJSON(a)===canonicalJSON(b);
export function id(value:unknown,kind:Identity['kind']):Identity {const i=decodeIdentity(value);demand(i.kind===kind,'B5_IDENTITY_KIND');return i;}
export function active(row:CanonicalRecord,at:string){const t=row.temporal;demand(t.valid_until!==undefined&&t.observed_at!==undefined&&knownAsOf(t,at)&&(t.occurred_at===undefined||Date.parse(t.occurred_at)<=Date.parse(at))&&(t.requalification_at===undefined||Date.parse(t.requalification_at)>Date.parse(at)),'B5_TEMPORAL_HOLD');}
export class CapabilityContext {
 readonly repository:CanonicalRepository;readonly principal:Identity;readonly as_of:string;readonly snapshot_digest:string;
 constructor(repository:CanonicalRepository,principal:Identity,at:string,snapshot:string){this.repository=repository;this.principal=id(principal,'PRINCIPAL');this.as_of=instant(at);this.snapshot_digest=digest(JSON.parse(snapshot));}
 async current(subject:Identity,name:string){
  const c=await this.repository.current({schema_version:SCHEMA_VERSION,principal:this.principal,subject,predicate:predicate(name),as_of:this.as_of});
  demand(c.status==='RECORDED_AS_OF'&&c.record!==null,'B5_CURRENT_REQUIRED');active(c.record,this.as_of);
  const p=record(c.record.payload,['subject','predicate','value','epistemic']),e=p.epistemic as Record<string,unknown>;
  demand(e.knowledge_state==='KNOWN'&&e.applicability_state==='APPLICABLE'&&e.freshness_state==='CURRENT_AS_OF'&&e.coverage_state==='COMPLETE_FOR_DECLARED_SCOPE'&&Array.isArray(e.invalidators)&&e.invalidators.length===0,'B5_EPISTEMIC_HOLD');
  return {row:c.record,value:p.value};
 }
 async reference(input:unknown){const ref=decodeReference(input),v=await this.repository.reconstruct({schema_version:SCHEMA_VERSION,principal:this.principal,as_of:this.as_of});
  const selected=v.views.find(x=>x.selected?.record_id===ref.record_id)?.selected;
  demand(selected&&selected.version===ref.version&&same(selected.object,ref.object),'B5_REFERENCE_DRIFT');active(selected,this.as_of);return selected;
 }
 async boundReference(input:unknown,subject:Identity,name:string){const ref=decodeReference(input),c=await this.current(subject,name);demand(same(ref,this.ref(c.row)),'B5_SELECTED_REFERENCE_MISMATCH');return c;}
 ref(row:CanonicalRecord):Reference{return {record_id:row.record_id,object:row.object,version:row.version};}
 async registered(subject:Identity){const m=await this.repository.reconstruct({schema_version:SCHEMA_VERSION,principal:this.principal,as_of:this.as_of});demand(m.views.some(v=>v.known_effective&&v.selected?.object_type==='IDENTITY'&&same(v.selected.object,subject)),'B5_UNREGISTERED_SUBJECT');}
}
export async function withCapabilityContext<T>(repo:CanonicalRepository,principalInput:Identity,atInput:string,work:(c:CapabilityContext)=>Promise<T>):Promise<Readonly<T>>{
 const principal=freeze(id(principalInput,'PRINCIPAL')),at=instant(atInput),wire=await repo.exportSnapshot(),local=new MemoryCanonicalRepository();await local.importSnapshot(wire);
 const result=await work(new CapabilityContext(local,principal,at,wire));
 demand(same(JSON.parse(wire),JSON.parse(await repo.exportSnapshot())),'B5_CURRENT_CHANGED_DURING_INTERPRETATION');return freeze(result);
}
