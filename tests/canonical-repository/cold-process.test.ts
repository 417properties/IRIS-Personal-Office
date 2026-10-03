import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync,writeFileSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {MemoryCanonicalRepository} from '../../src/state/repository.ts';
import {PostgresCanonicalRepository} from '../../src/state/postgres-repository.ts';
import {engine} from './sql-fixture.ts';
import {principal,object,T0,T1,T2,T3,epistemic,identityRow,command,value,reference,query,temporal,currentRow,lifecycle} from './fixtures.ts';
for(const backend of ['MEMORY','SQL'] as const)test(backend+' fresh process reconstructs persisted state without predecessor context',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'iris-b2-cold-')),store=join(dir,'database');
 let e:any;try{
  e=backend==='SQL'?await engine(undefined,store):null;
  const repo=e?new PostgresCanonicalRepository(e.executor):new MemoryCanonicalRepository();
  await repo.append(command(identityRow(principal)));await repo.append(command(identityRow(object)));await repo.append(command(currentRow()));
  const v=currentRow();v.version=2;v.temporal={recorded_at:T2,effective_from:T1,revoked_at:T3};v.payload.value={state:'unknown'};v.payload.epistemic=epistemic(T2);await repo.append(command(v));
  const intent={kind:'INTENT' as const,id:'intent:cold'},occ={kind:'CAUSAL_OCCURRENCE' as const,id:'causal:cold'},owner={kind:'WORKER' as const,id:'worker:cold'},claim={kind:'CONTINUATION' as const,id:'continuation:cold'};
  for(const ref of [intent,occ,owner,claim])await repo.append(command(identityRow(ref)));
  const occurrence=value('CAUSAL_OCCURRENCE',{occurrence:occ,originating_ref:intent,first_occurred_at:T0,operation_digest:'operation:immutable',evidence_refs:['source:causal']},occ);occurrence.references=[reference(intent)];await repo.append(command(occurrence));
  const effect=value('EFFECT',{intent,operation_digest:'operation:immutable',occurrence:occ,version:1,disposition:'AMBIGUOUS_EFFECT',last_event_ref:'effect:ambiguous',proof:'AMBIGUOUS',evidence_refs:['readback:ambiguous']},intent);effect.references=[reference(occ)];await repo.append(command(effect));
  const continuation=value('CONTINUATION',{claim,principal,causal_episode:occ,owner_incarnation:owner,generation:1,fence_token:'representation:only',temporal:temporal(),admission_evidence_refs:['admission:declaration']},claim);continuation.references=[reference(occ),reference(owner)];await repo.append(command(continuation));
  const fact=value('ITEM_FACT',{root:object,principal,epistemic:epistemic(),requirement:'UNKNOWN',disposition:'RELEVANCE_UNKNOWN',disposition_evidence:[],reactivation_refs:[]});await repo.append(command(fact));
  const reasons=value('ROOT_DISPOSITION',{schema_version:'IRIS_ROOT_DISPOSITION_V2',root_ref:object,principal_ref:principal,version:1,as_of:T0,boundary_id:'boundary:cold',consumer_class:'INTERNAL_RECONSTRUCTION',epistemic:epistemic(),lifecycle:lifecycle().payload,requirement:'UNKNOWN',holder_knowledge_state:'UNKNOWN',holder_ref:null,privacy:{recipient_ref:principal,purpose_ref:'purpose:reconstruction',disclosure_result:'UNKNOWN',evidence_refs:['privacy:unknown']},primary_visible_disposition:'RELEVANCE_UNKNOWN',reason_set:[{reason_id:'REQUIRED_HOLDER_UNKNOWN',reason_type:'HOLDER',canonical_code:'UNKNOWN',evidence_refs:['holder:unknown']}],visible_reason_projection:['REQUIRED_HOLDER_UNKNOWN'],reactivation_refs:[],invalidator_refs:[],provenance_refs:['IBA:5971926463'],projection_qualification:'NOT_ADJUDICATED'});reasons.references=[reference(principal)];await repo.append(command(reasons));

  const models=await Promise.all([T0,T1,T2,T3].map(cut=>repo.reconstruct(query(cut))));
  const wire=await repo.exportSnapshot();writeFileSync(join(dir,'snapshot.json'),wire);await e?.db.close();e=null;
  for(const [i,cut] of [T0,T1,T2,T3].entries()){
   const file=join(dir,'query.json');writeFileSync(file,JSON.stringify(query(cut)));
   const child=spawnSync(process.execPath,['--experimental-strip-types',new URL('./cold-reader.ts',import.meta.url).pathname,backend,backend==='SQL'?store:join(dir,'snapshot.json'),file],{encoding:'utf8',timeout:30000});
   assert.equal(child.status,0,child.stderr);assert.deepEqual(JSON.parse(child.stdout),models[i]);assert.equal(JSON.parse(child.stdout).admission,'NOT_ADJUDICATED');
  }
 }finally{await e?.db.close();rmSync(dir,{recursive:true,force:true});}
});
