import { SCHEMA_VERSION, type CanonicalRecord, type RepositoryIdentity } from '../../src/domain/canonical.ts';
export const T0='2026-10-01T00:00:00.000Z',T1='2026-10-01T01:00:00.000Z',T2='2026-10-01T02:00:00.000Z',T3='2026-10-01T03:00:00.000Z';
export const principal={kind:'PRINCIPAL' as const,id:'principal:one'};
export const object={kind:'OBJECTIVE' as const,id:'object:one'};
export function temporal(time=T0){return {recorded_at:time,effective_from:time};}
export function epistemic(time=T0){return {knowledge_state:'UNKNOWN',applicability_state:'UNKNOWN',freshness_state:'UNKNOWN',coverage_state:'UNKNOWN',as_of:time,evidence_refs:[],invalidators:[]};}
export function value(kind:CanonicalRecord['object_type'],payload:unknown,target:RepositoryIdentity=object,record_id='record:'+kind):any {
 return {schema_version:SCHEMA_VERSION,record_id,event_ref:(payload as any)?.last_event_ref??'event:'+record_id+':1',object_type:kind,object:target,principal,version:1,temporal:temporal(),evidence_refs:['evidence:source'],provenance_refs:['provenance:source'],privacy_refs:['privacy:retained'],authority_refs:[],references:[],source_representations:[],payload};
}
export function command(v:any,transition:unknown=v.object_type==='CURRENT'?{event_id:'event:'+v.record_id+':'+v.version,kind:v.version===1?'ASSERT':'CORRECTION',at:v.temporal.recorded_at,evidence_refs:v.evidence_refs}:null){return {schema_version:SCHEMA_VERSION,expected_version:v.version-1,transition,value:{...v,event_ref:(v.payload as any)?.last_event_ref??(v.object_type==='CURRENT'?(transition as any)?.event_id:v.event_ref)}};}
export function query(cut=T3){return {schema_version:SCHEMA_VERSION,principal,as_of:cut};}
export function identityRow(ref:RepositoryIdentity){return value('IDENTITY',ref,ref,'identity:'+ref.kind+':'+ref.id);}
export function reference(ref:RepositoryIdentity){return {record_id:identityRow(ref).record_id,object:ref,version:1};}
export function currentRow(){return value('CURRENT',{subject:object,predicate:'status',value:{state:'old'},epistemic:epistemic()},object,'current:status');}
export function lifecycle(state='NONTERMINAL',target=object){return value('LIFECYCLE',{object:target,principal,version:1,state,last_event_ref:'event:initial',evidence_refs:['evidence:source'],basis_ref:'basis:source'},target);}
