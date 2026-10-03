// Source: accepted IBA #703/5971926463, not sealed Batch-C vectors/outputs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MemoryCanonicalRepository} from '../../src/state/repository.ts';
import {PostgresCanonicalRepository} from '../../src/state/postgres-repository.ts';
import {decodeRecord} from '../../src/domain/canonical.ts';
import {decodeRootDisposition} from '../../src/domain/root-disposition.ts';
import {engine} from './sql-fixture.ts';
import {principal,object,T0,T1,epistemic,value,lifecycle,identityRow,reference,command,query} from './fixtures.ts';
function payload(prohibited=false):any{
 const ep={...epistemic(),knowledge_state:'CONFLICTED',applicability_state:'SATISFIED',freshness_state:'CURRENT_AS_OF',evidence_refs:['canonical:source']};
 return {schema_version:'IRIS_ROOT_DISPOSITION_V2',root_ref:object,principal_ref:principal,version:1,as_of:T0,boundary_id:prohibited?'boundary:prohibited':'boundary:internal',consumer_class:prohibited?'EXTERNAL_CONSUMER':'INTERNAL_HISTORY',epistemic:ep,lifecycle:lifecycle('SATISFIED').payload,requirement:'UNKNOWN',holder_knowledge_state:'UNKNOWN',holder_ref:null,
 privacy:{recipient_ref:principal,purpose_ref:'purpose:exact',disclosure_result:prohibited?'PROHIBITED':'PERMITTED',evidence_refs:['privacy:declaration']},primary_visible_disposition:prohibited?'PRIVACY_EXCLUDED':'CONFLICT_HOLD',reason_set:[
  {reason_id:'TERMINAL_SATISFIED',reason_type:'LIFECYCLE',canonical_code:'SATISFIED',evidence_refs:['terminal:source']},
  {reason_id:'EPISTEMIC_CONFLICT',reason_type:'KNOWLEDGE',canonical_code:'CONFLICTED',evidence_refs:['conflict:source']},
  {reason_id:'REQUIRED_HOLDER_UNKNOWN',reason_type:'HOLDER',canonical_code:'UNKNOWN',evidence_refs:['holder:source']},
  {reason_id:prohibited?'DISCLOSURE_PROHIBITED':'DISCLOSURE_PERMITTED',reason_type:'DISCLOSURE',canonical_code:prohibited?'PROHIBITED':'PERMITTED',evidence_refs:['privacy:source']}
 ],visible_reason_projection:prohibited?['DISCLOSURE_PROHIBITED']:['TERMINAL_SATISFIED','EPISTEMIC_CONFLICT','REQUIRED_HOLDER_UNKNOWN','DISCLOSURE_PERMITTED'],reactivation_refs:[],invalidator_refs:['reconcile:conflict'],provenance_refs:['IBA:5971926463'],projection_qualification:'NOT_ADJUDICATED'};
}
function row(prohibited=false){const v=value('ROOT_DISPOSITION',payload(prohibited),object,prohibited?'root:external':'root:internal');v.references=[reference(principal)];return v;}

test('accepted compound-reason declaration preserves all reasons through domain/SQL/snapshot/cold-independent model',async()=>{
 const e=await engine(),memory=new MemoryCanonicalRepository(),sql=new PostgresCanonicalRepository(e.executor);
 try{
  for(const repo of [memory,sql]){
   await repo.append(command(identityRow(principal)));await repo.append(command(identityRow(object)));
   for(const prohibited of [false,true])await repo.append(command(row(prohibited)));
   const model=await repo.reconstruct(query()) as any;
   for(const v of model.views.filter((x:any)=>x.selected?.object_type==='ROOT_DISPOSITION')){assert.equal(v.selected.payload.reason_set.length,4);assert.equal(v.selected.payload.holder_knowledge_state,'UNKNOWN');assert.equal(v.selected.payload.lifecycle.state,'SATISFIED');assert.equal(v.selected.payload.projection_qualification,'NOT_ADJUDICATED');}
  }
  assert.equal(await memory.exportSnapshot(),await sql.exportSnapshot());assert.deepEqual(await memory.reconstruct(query()),await sql.reconstruct(query()));
  const imported=new MemoryCanonicalRepository();await imported.importSnapshot(await sql.exportSnapshot());assert.deepEqual(await imported.reconstruct(query()),await sql.reconstruct(query()));
 }finally{await e.db.close();}
});

test('compound-reason typed enums/NULL/missing/drift/privacy loss controls agree with SQL',async t=>{
 const e=await engine();
 try{
  const controls:Record<string,(p:any)=>void>={missing_reason_set:p=>delete p.reason_set,empty_reason_set:p=>p.reason_set=[],null_reason:p=>p.reason_set=null,reason_type:p=>p.reason_set[0].reason_type='LOCAL_DEFAULT',state_drift:p=>p.reason_set[0].canonical_code='ABANDONED',reason_evidence:p=>p.reason_set[0].evidence_refs=[],duplicate_reason:p=>p.reason_set.push(p.reason_set[0]),foreign_visible_reason:p=>p.visible_reason_projection=['not-present'],private_secondary_leak:p=>p.visible_reason_projection=['TERMINAL_SATISFIED'],privacy_primary:p=>p.primary_visible_disposition='TERMINAL_RETAINED',unknown_field:p=>p.local_precedence='invented',missing_boundary:p=>delete p.boundary_id,version:p=>p.schema_version='IRIS_ROOT_DISPOSITION_V1',self_qualified:p=>p.projection_qualification='PASS',lifecycle_missing:p=>p.lifecycle=null};
  for(const [name,mutate] of Object.entries(controls))await t.test(name,async()=>{const p=payload(true);mutate(p);assert.throws(()=>decodeRootDisposition(p));const v=row(true);v.payload=p;assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_record($1::jsonb) as valid',[JSON.stringify(v)]))[0]!.valid,false);});
 }finally{await e.db.close();}
});

test('changing boundary retains canonical coordinate/reason population; selector qualification remains withheld',()=>{
 const internal=decodeRootDisposition(payload()),external=decodeRootDisposition(payload(true));
 assert.deepEqual(internal.epistemic,external.epistemic);assert.deepEqual(internal.lifecycle,external.lifecycle);assert.deepEqual(internal.reason_set.slice(0,3),external.reason_set.slice(0,3));assert.equal(external.visible_reason_projection.length,1);assert.equal(external.primary_visible_disposition,'PRIVACY_EXCLUDED');assert.equal(internal.projection_qualification,'NOT_ADJUDICATED');assert.ok(Object.isFrozen(decodeRecord(row()).payload));
});
