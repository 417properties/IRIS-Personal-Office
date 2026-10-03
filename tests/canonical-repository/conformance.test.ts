import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryCanonicalRepository, canonicalJSON } from '../../src/state/repository.ts';
import { PostgresCanonicalRepository } from '../../src/state/postgres-repository.ts';
import { decodeRecord, domainToDTO, dtoToDomain, SCHEMA_VERSION, RECORD_KINDS, METADATA_KINDS } from '../../src/domain/canonical.ts';
import { ID_KINDS } from '../../src/semantic-kernel/identity.ts';
import { KNOWLEDGE, APPLICABILITY, FRESHNESS, COVERAGE, DISPOSITIONS } from '../../src/semantic-kernel/epistemic.ts';
import { EFFECT, LIFECYCLE, DECISION_LIFECYCLE, reduceLifecycle } from '../../src/semantic-kernel/lifecycle.ts';
import { decodeSource, SOURCE_SCHEMAS, mapSourceToDomain, restoreSource } from '../../src/domain/legacy-maps.ts';
import { engine } from './sql-fixture.ts';
import { T0,T1,T2,T3,principal,object,temporal,epistemic,value,command,query,identityRow,reference,currentRow,lifecycle } from './fixtures.ts';

async function seed(repo:any){await repo.append(command(identityRow(principal)));await repo.append(command(identityRow(object)));}
const currentQuery=(cut=T3)=>({...query(cut),subject:object,predicate:'status'});
const proofs:Record<string,string>={NO_SUBMISSION_PROVEN:'POSITIVE_ABSENCE',SUBMISSION_KNOWN:'SUBMISSION_ACCEPTED',EFFECT_VERIFIED:'MATCHING_EFFECT',NO_EFFECT_VERIFIED:'POSITIVE_ABSENCE',PARTIAL_EFFECT:'PARTIAL_MATCH',AMBIGUOUS_EFFECT:'AMBIGUOUS',CONFLICTED_EFFECT:'CONFLICT',RECONCILIATION_REQUIRED:'NONE',UNAVAILABLE_READBACK:'UNAVAILABLE',UNKNOWN:'NONE'};

for(const backend of ['MEMORY','SQL'] as const){
 test(backend+' common repository contract',async t=>{
  const e=backend==='SQL'?await engine():null;
  const repo=backend==='SQL'?new PostgresCanonicalRepository(e!.executor):new MemoryCanonicalRepository();
  try{
   await seed(repo);
   await t.test('detached frozen command/result/history',async()=>{
    const v=currentRow(),result=await repo.append(command(v));v.payload.value.state='tampered';
    assert.equal((result.payload as any).value.state,'old');assert.ok(Object.isFrozen((result.payload as any).value));
    assert.throws(()=>{(result.payload as any).value.state='tampered';},TypeError);
    const history=await repo.history(query());assert.ok(Object.isFrozen(history));assert.ok(Object.isFrozen(history[0]!.object));
   });
   await t.test('later-recorded correction is not earlier knowledge; UNKNOWN shadows prior known',async()=>{
    const v=currentRow();v.version=2;v.temporal={recorded_at:T2,effective_from:T1,valid_until:T3};v.payload.epistemic=epistemic(T2);v.payload.value={state:'replacement'};
    await repo.append(command(v));
    assert.equal(((await repo.current(currentQuery(T1))) as any).record.version,1);
    const selected=await repo.current(currentQuery(T2)) as any;assert.equal(selected.record.version,2);assert.equal(selected.record.payload.epistemic.knowledge_state,'UNKNOWN');
   });
   await t.test('exact expiry cut retains inactive replacement; no predecessor resurrection',async()=>{
    const result=await repo.current(currentQuery(T3)) as any;assert.equal(result.status,'INACTIVE_AS_OF');assert.equal(result.record.version,2);assert.equal(result.temporal.effective,false);
   });
   await t.test('first-class revocation/supersession and observed/future effective boundaries',async()=>{
    const v=value('TEMPORAL',{recorded_at:T1,effective_from:T0,revoked_at:T2,observed_at:T1,superseded_at:T3,requalification_at:T2},object,'temporal:boundaries');v.temporal=v.payload;
    await repo.append(command(v));const a=await repo.reconstruct(query(T1)) as any,b=await repo.reconstruct(query(T2)) as any;
    assert.equal(a.views.find((x:any)=>x.record_id===v.record_id).known_effective,true);
    assert.equal(b.views.find((x:any)=>x.record_id===v.record_id).known_effective,false);
    assert.equal(b.views.find((x:any)=>x.record_id===v.record_id).temporal.requalification_due,true);
   });
   await t.test('principal isolation and opaque IDs including delimiters',async()=>{
    const other={kind:'PRINCIPAL' as const,id:'principal:two::same'},o=identityRow(other);o.principal=other;await repo.append(command(o));
    const rows=await repo.history({...query(),principal:other});assert.equal(rows.length,1);assert.deepEqual(rows[0]!.object,other);
    assert.ok((await repo.history(query())).every(x=>x.principal.id===principal.id));
   });
   await t.test('lifecycle changes consume shared reducer; shortcut and terminal reopen HOLD',async()=>{
    const initial=lifecycle();await repo.append(command(initial));
    const event={event_id:'event:close',object,principal,expected_version:1,next_state:'SATISFIED',kind:'TRANSITION',evidence_refs:['closure:declaration'],at:T1,basis_ref:'closure:reconciliation',basis_kind:'CLOSURE_RECONCILIATION',basis_knowledge:'KNOWN'};
    const next=lifecycle();next.version=2;next.temporal=temporal(T1);next.payload=reduceLifecycle(initial.payload,event);await repo.append(command(next,event));
    const bad=lifecycle();bad.version=3;bad.temporal=temporal(T2);bad.payload={...next.payload,version:3,state:'NONTERMINAL',last_event_ref:'event:reopen'};
    await assert.rejects(repo.append(command(bad,{...event,event_id:'event:reopen',expected_version:2,next_state:'NONTERMINAL',at:T2,basis_kind:'LIFECYCLE_EVIDENCE'})),/TERMINAL_CORRECTION_REQUIRED/);
    const model=await repo.reconstruct(query()) as any;assert.equal(model.admission,'NOT_ADJUDICATED');
   });
   await t.test('concurrent same-version commands earn one append only',async()=>{
    const v=value('EPISTEMIC',epistemic(),object,'concurrency:one');const result=await Promise.allSettled([repo.append(command(v)),repo.append(command(v))]);
    assert.equal(result.filter(x=>x.status==='fulfilled').length,1);assert.equal(result.filter(x=>x.status==='rejected').length,1);
   });
   const negative:Record<string,(v:any)=>void>={
    schema:v=>v.schema_version='iris_b2_v1',kind:v=>v.object_type='current',missing:v=>delete v.principal,null:v=>v.principal=null,extra:v=>v.unsafe=true,version_zero:v=>v.version=0,version_float:v=>v.version=1.5,version_unsafe:v=>v.version=Number.MAX_SAFE_INTEGER+1,
    missing_time:v=>delete v.temporal.recorded_at,null_time:v=>v.temporal.valid_until=null,invalid_calendar:v=>v.temporal.recorded_at='2026-02-30T00:00:00Z',offset_time:v=>v.temporal.recorded_at='2026-10-01T00:00:00+00:00',empty_interval:v=>v.temporal.valid_until=T0,
    evidence_empty:v=>v.evidence_refs=[],evidence_null:v=>v.evidence_refs=null,provenance_empty:v=>v.provenance_refs=[],epistemic_enum:v=>v.payload.knowledge_state='known',epistemic_missing:v=>delete v.payload.coverage_state,epistemic_null:v=>v.payload.coverage_state=null,recording_cut:v=>v.payload.as_of=T1,
    unregistered_object:v=>v.object={kind:'OBJECTIVE',id:'unknown'},unregistered_principal:v=>v.principal={kind:'PRINCIPAL',id:'unknown'},dangling:v=>v.references=[{record_id:'missing',object,version:1}],reference_version:v=>v.references=[{...reference(object),version:2}],duplicate_reference:v=>v.references=[reference(object),reference(object)],reference_null:v=>v.references=null,
    unsupported_source:v=>v.source_representations=[{representation_version:'UNKNOWN_V99',source:{}}]
   };
   for(const [name,mutate] of Object.entries(negative)) await t.test('malformed HOLD no mutation '+name,async()=>{
    const before=await repo.exportSnapshot(),v=value('EPISTEMIC',epistemic(),object,'negative:'+name);mutate(v);await assert.rejects(repo.append(command(v)));assert.equal(await repo.exportSnapshot(),before);
   });
   await t.test('query principal/as-of/version malformed HOLD',async()=>{
    for(const q of [{...query(),as_of:null},{...query(),principal:object},{...query(),schema_version:'IRIS_B1_V1'},{principal,as_of:T0},{...query(),extra:true}])await assert.rejects(repo.history(q));
   });
   await t.test('same exact export reconstructs histories without latest-row leakage',async()=>{
    const snapshot=JSON.parse(await repo.exportSnapshot());assert.ok(snapshot.records.length>0);assert.equal(snapshot.schema_version,SCHEMA_VERSION);
    assert.equal((await repo.history(query(T1))).filter(x=>x.object_type==='CURRENT').length,1);
    await assert.rejects(repo.importSnapshot(JSON.stringify(snapshot)),/IMPORT_REQUIRES_EMPTY_STORE/);
   });
  }finally{await e?.db.close();}
 });
}

test('total B1 domain/DTO/SQL/reconstruction representation algebra',async t=>{
 const e=await engine();
 try{
  await t.test('all 504 epistemic coordinate combinations with B1 invalid combinations rejected in SQL too',async()=>{
   let admitted=0,held=0;
   for(const k of KNOWLEDGE)for(const a of APPLICABILITY)for(const f of FRESHNESS)for(const c of COVERAGE){
    const ep={...epistemic(),knowledge_state:k,applicability_state:a,freshness_state:f,coverage_state:c,evidence_refs:['evidence:source']};const v=value('EPISTEMIC',ep);
    let valid=true;try{assert.deepEqual(dtoToDomain(domainToDTO(v)),decodeRecord(v));}catch{valid=false;}
    const rows=await e.executor.query<{valid:boolean}>('select iris_b2_record($1::jsonb) as valid',[JSON.stringify(v)]);assert.equal(rows[0]!.valid,valid,canonicalJSON(ep));valid?admitted++:held++;
   }
   assert.equal(admitted+held,504);assert.equal(held,72);
  });
  await t.test('every lifecycle/decision/effect state and proof survives SQL representation',async()=>{
   const records:any[]=[];
   for(const s of LIFECYCLE)records.push(lifecycle(s));
   const decision={kind:'DECISION_REQUIREMENT' as const,id:'decision:one'};
   for(const s of DECISION_LIFECYCLE)records.push(lifecycle(s,decision as any));
   const intent={kind:'INTENT' as const,id:'intent:one'},occurrence={kind:'CAUSAL_OCCURRENCE' as const,id:'occurrence:one'};
   for(const disposition of EFFECT)records.push(value('EFFECT',{intent,occurrence,operation_digest:'digest:one',version:1,disposition,last_event_ref:'event:one',proof:proofs[disposition],evidence_refs:['proof:source']},intent));
   for(const v of records){assert.deepEqual(dtoToDomain(domainToDTO(v)),decodeRecord(v));assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_record($1::jsonb) as valid',[JSON.stringify(v)]))[0]!.valid,true);}
  });
  await t.test('all opaque identity kinds including metadata extension round trip',async()=>{
   for(const kind of [...ID_KINDS,...METADATA_KINDS]){const ref={kind,id:'opaque::'+kind+'|not-a-prefix'},v=identityRow(ref);assert.deepEqual(decodeRecord(v).object,ref);assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_record($1::jsonb) as valid',[JSON.stringify(v)]))[0]!.valid,true);}
  });
  await t.test('all temporal coordinates survive SQL and wire without defaults',async()=>{
   const tc={...temporal(),observed_at:T0,occurred_at:T0,valid_until:T3,superseded_at:T3,revoked_at:T3,requalification_at:T2},v=value('TEMPORAL',tc);v.temporal=tc;
   assert.deepEqual(decodeRecord(v).payload,tc);assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_record($1::jsonb) as valid',[JSON.stringify(v)]))[0]!.valid,true);
  });
  await t.test('SQL required/missing/JSON NULL constraints agree with strict DTOs',async()=>{
   const base=value('EPISTEMIC',epistemic());
   for(const field of Object.keys(base))for(const mode of ['missing','null']){const v=structuredClone(base);mode==='missing'?delete v[field]:v[field]=null;
    assert.throws(()=>decodeRecord(v));assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_record($1::jsonb) as valid',[JSON.stringify(v)]))[0]!.valid,false,field+':'+mode);
   }
  });
  await t.test('journal rejects malformed direct SQL and is append-only',async()=>{
   const repo=new PostgresCanonicalRepository(e.executor);await seed(repo);
   const v=value('EPISTEMIC',epistemic());delete v.payload.coverage_state;
   await assert.rejects(e.executor.query('insert into iris_b2_journal(principal_id,record_id,version,command) values($1,$2,$3,$4::jsonb)',[principal.id,v.record_id,1,JSON.stringify(command(v))]));
   for(const sql of ['update iris_b2_journal set record_id=record_id','delete from iris_b2_journal','truncate iris_b2_journal'])await assert.rejects(e.executor.query(sql),/CANONICAL_APPEND_ONLY/);
  });
 }finally{await e.db.close();}
});

for(const backend of ['MEMORY','SQL'] as const)test(backend+' validated snapshot import atomicity and relation integrity',async t=>{
 const source=new MemoryCanonicalRepository();await seed(source);await source.append(command(currentRow()));const wire=await source.exportSnapshot();
 const mutations:Record<string,(s:any)=>void>={schema:s=>s.schema_version='wrong',record_drift:s=>s.records[0].object.id='drift',command_drift:s=>s.commands[0].value.object.id='drift',duplicate:s=>{s.commands.push(s.commands[0]);s.records.push(s.records[0]);},gap:s=>{s.commands[2].value.version=3;s.records[2].version=3;},dangling:s=>{s.commands[2].value.references=[{record_id:'missing',object,version:1}];s.records[2].references=s.commands[2].value.references;},foreign_principal:s=>{s.commands[2].value.principal={kind:'PRINCIPAL',id:'other'};s.records[2].principal=s.commands[2].value.principal;},unknown_payload:s=>{s.commands[2].value.payload.epistemic.coverage_state='made-up';s.records[2].payload=s.commands[2].value.payload;},null:s=>s.records=null};
 for(const [name,mutate] of Object.entries(mutations))await t.test(name+' rejects without partial import',async()=>{
  const e=backend==='SQL'?await engine():null,repo=e?new PostgresCanonicalRepository(e.executor):new MemoryCanonicalRepository();
  try{const before=await repo.exportSnapshot(),s=JSON.parse(wire);mutate(s);await assert.rejects(repo.importSnapshot(JSON.stringify(s)));assert.equal(await repo.exportSnapshot(),before);}finally{await e?.db.close();}
 });
 await t.test('exact valid wire round trip and historical reconstruction',async()=>{
  const e=backend==='SQL'?await engine():null,repo=e?new PostgresCanonicalRepository(e.executor):new MemoryCanonicalRepository();
  try{await repo.importSnapshot(wire);assert.equal(await repo.exportSnapshot(),wire);assert.deepEqual(await repo.reconstruct(query(T0)),await source.reconstruct(query(T0)));}finally{await e?.db.close();}
 });
});

test('later-known future-observed replacement does not resurrect earlier Current',async()=>{
 const e=await engine();try{
  for(const repo of [new MemoryCanonicalRepository(),new PostgresCanonicalRepository(e.executor)]){
   await seed(repo);await repo.append(command(currentRow()));
   const v=currentRow();v.version=2;v.temporal={recorded_at:T1,effective_from:T1,observed_at:T2};v.payload.epistemic=epistemic(T1);v.payload.value='future-observed';await repo.append(command(v));
   const before=await repo.current(currentQuery(T0)) as any,at=await repo.current(currentQuery(T1)) as any;
   assert.equal(before.record.version,1);assert.equal(at.record.version,2);assert.equal(at.status,'INACTIVE_AS_OF');assert.equal(at.temporal.observed_by_cut,false);
  }
 }finally{await e.db.close();}
});

test('SQL import rolls back on an actual mid-transaction storage failure',async()=>{
 const memory=new MemoryCanonicalRepository();await seed(memory);await memory.append(command(currentRow()));
 const e=await engine();let inserts=0;
 const failing={...e.executor,transaction:<T>(work:any)=>e.executor.transaction(tx=>work({query:async(sql:string,args?:unknown[])=>{
  if(sql.startsWith('insert into iris_b2_journal')&&++inserts===3)throw Error('DISCRIMINATING_STORAGE_FAILURE');
  return tx.query(sql,args);
 }}))};
 const repo=new PostgresCanonicalRepository(failing as any);
 try{const before=await repo.exportSnapshot();await assert.rejects(repo.importSnapshot(await memory.exportSnapshot()),/DISCRIMINATING_STORAGE_FAILURE/);assert.equal(inserts,3);assert.equal(await repo.exportSnapshot(),before);}finally{await e.db.close();}
});

test('physical inherited SQL constraint rejects ADMITTED qualification with NULL validity',async()=>{
 const e=await engine();try{
  await e.executor.query(`insert into capability_candidate(capability_candidate_id,role_scope,toolset_digest,procedure_refs,reasoning_profile,runtime_placement,privacy_profile_digest,evidence_contract_digest,candidate_version,created_at) values('candidate:local','scope:local','tools:local','[]','profile:local','offline','privacy:local','evidence:local',1,$1)`,[T0]);
  const sql=`insert into capability_qualification(qualification_id,capability_candidate_id,role_scope,evaluation_population_ref,dimensions,evidence_refs,falsifier_refs,evaluation_result,admission_state,qualified_at,valid_until,version) values($1,'candidate:local','scope:local','population:local','{}','["source:local"]','["falsifier:local"]','PASS','ADMITTED',$2,$3,1)`;
  await assert.rejects(e.executor.query(sql,['qualification:null',T0,null]),/check constraint/);
  await e.executor.query(sql,['qualification:valid',T0,T3]);
  await assert.rejects(e.executor.query("update capability_qualification set admission_state='DEMOTED'"),/TRANSITION_APPEND_ONLY/);
 }finally{await e.db.close();}
});

test('all B1 ItemFact dispositions are exact supplied coordinates, with no new precedence rule',async()=>{
 const e=await engine();try{
  for(const disposition of DISPOSITIONS){
   const ep:any={...epistemic(),evidence_refs:['proof:source']};let requirement='UNKNOWN';const disposition_evidence=['disposition:source'],reactivation_refs=['wake:source'];
   if(disposition==='KNOWN_REQUIRED'){ep.knowledge_state='KNOWN';ep.applicability_state='APPLICABLE';ep.freshness_state='CURRENT_AS_OF';requirement='REQUIRED';}
   if(disposition==='TERMINAL_RETAINED'){ep.knowledge_state='KNOWN';ep.applicability_state='SATISFIED';ep.freshness_state='CURRENT_AS_OF';}
   if(disposition==='JUSTIFIED_NOT_APPLICABLE'){ep.knowledge_state='KNOWN';ep.applicability_state='NOT_APPLICABLE_PROVEN';ep.freshness_state='CURRENT_AS_OF';requirement='NOT_REQUIRED_PROVEN';}
   if(disposition==='CONFLICT_HOLD')ep.knowledge_state='CONFLICTED';
   if(disposition==='INVALID_REJECTED')ep.knowledge_state='INVALID';
   const v=value('ITEM_FACT',{root:object,principal,epistemic:ep,requirement,disposition,disposition_evidence,reactivation_refs});
   assert.equal((decodeRecord(v).payload as any).disposition,disposition);
   assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_record($1::jsonb) as valid',[JSON.stringify(v)]))[0]!.valid,true);
  }
 }finally{await e.db.close();}
});

test('explicit versioned relation revocation reconstructs as-of without mutating history',async()=>{
 const e=await engine();try{
  for(const repo of [new MemoryCanonicalRepository(),new PostgresCanonicalRepository(e.executor)]){
   await seed(repo);const target={kind:'RESOLUTION' as const,id:'resolution:target'};await repo.append(command(identityRow(target)));
   const v=value('RELATION',{relation_id:'relation:context',principal,source:object,target,kind:'CONTEXT',version:1,temporal:{recorded_at:T0,effective_from:T0},evidence_refs:['relation:source']},object,'relation:versioned');v.references=[reference(object),reference(target)];await repo.append(command(v));
   const next=structuredClone(v);next.version=2;next.event_ref='event:revoke';next.temporal={recorded_at:T2,effective_from:T0,revoked_at:T2};next.payload.version=2;next.payload.temporal=next.temporal;
   await repo.append(command(next,{event_id:next.event_ref,kind:'REVOCATION',at:T2,evidence_refs:['revocation:source']}));
   const earlier=await repo.reconstruct(query(T1)) as any,after=await repo.reconstruct(query(T2)) as any;
   assert.equal(earlier.views.find((x:any)=>x.record_id===v.record_id).known_effective,true);assert.equal(after.views.find((x:any)=>x.record_id===v.record_id).known_effective,false);
   const rows=await repo.history(query());assert.equal((rows.find(x=>x.record_id===v.record_id&&x.version===1)!.temporal as any).revoked_at,undefined);
  }
 }finally{await e.db.close();}
});

test('SQL integrity rejects raw version gap, dangling reference and foreign principal',async()=>{
 const e=await engine();try{
  const repo=new PostgresCanonicalRepository(e.executor);await seed(repo);
  const insert=async(v:any)=>e.executor.query('insert into iris_b2_journal(principal_id,record_id,version,command) values($1,$2,$3,$4::jsonb)',[v.principal.id,v.record_id,v.version,JSON.stringify(command(v))]);
  const gap=value('EPISTEMIC',epistemic(),object,'gap:raw');gap.version=2;await assert.rejects(insert(gap),/STALE_REPOSITORY_VERSION/);
  const dangling=value('EPISTEMIC',epistemic(),object,'ref:raw');dangling.references=[{record_id:'no-record',object,version:1}];await assert.rejects(insert(dangling),/DANGLING_OR_FUTURE_REFERENCE/);
  const foreign=value('EPISTEMIC',epistemic(),object,'principal:raw');foreign.principal={kind:'PRINCIPAL',id:'unknown'};await assert.rejects(insert(foreign),/UNREGISTERED_PRINCIPAL/);
 }finally{await e.db.close();}
});
for(const backend of ['MEMORY','SQL'] as const)test(backend+' cannot create alternate lifecycle truth or duplicate event under a new version',async()=>{
 const e=backend==='SQL'?await engine():null,repo=e?new PostgresCanonicalRepository(e.executor):new MemoryCanonicalRepository();
 try{
  await seed(repo);await repo.append(command(lifecycle()));const alternate=lifecycle('UNKNOWN');alternate.record_id='alternate:truth';await assert.rejects(repo.append(command(alternate)),/DUPLICATE_SEMANTIC_STREAM/);
  const first=value('EPISTEMIC',epistemic(),object,'event:stream');await repo.append(command(first));const second=structuredClone(first);second.version=2;second.temporal={recorded_at:T1,effective_from:T1};second.payload=epistemic(T1);
  const before=await repo.exportSnapshot();await assert.rejects(repo.append(command(second)),/DUPLICATE_RECORD_EVENT/);assert.equal(await repo.exportSnapshot(),before);
 }finally{await e?.db.close();}
});
