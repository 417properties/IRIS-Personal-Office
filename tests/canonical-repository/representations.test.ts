import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryCanonicalRepository } from '../../src/state/repository.ts';
import { PostgresCanonicalRepository } from '../../src/state/postgres-repository.ts';
import { SOURCE_SCHEMAS, decodeSource, mapSourceToDomain, restoreSource } from '../../src/domain/legacy-maps.ts';
import { sourceReferences } from '../../src/domain/relations.ts';
import { decodeRecord, type RepositoryIdentity } from '../../src/domain/canonical.ts';
import { denseArray, parseJSON } from '../../src/domain/json.ts';
import { principal,object,T0,T1,T2,T3,epistemic,value,lifecycle,identityRow,reference,command,query } from './fixtures.ts';
import { engine } from './sql-fixture.ts';
const kinds:Record<string,RepositoryIdentity['kind']>={ACTIONDECISION_V0:'ACTION_DECISION',PRINCIPAL_V0:'PRINCIPAL',ORIENTATIONSTATE_V0:'ORIENTATION',EVIDENCEOCCURRENCE_V0:'EVIDENCE',ACTIONINTENT_V0:'INTENT',ACTIONRECEIPT_V0:'RECEIPT',AUTHORITYPOLICY_V0:'AUTHORITY_POLICY',PRIVACYPOLICY_V0:'PRIVACY_POLICY',CAPABILITYPROCEDURE_V0:'CAPABILITY',LEARNINGRECORD_V0:'LEARNING',WORKEPISODE_V0:'WORK_EPISODE',OBJECTIVE_V0:'OBJECTIVE',OBLIGATION_V0:'OBLIGATION',EFFECTVERIFICATION_V0:'INTENT',CURRENTASSERTION_V0:'OBJECTIVE'};
function source(version:string){
 const schema=(SOURCE_SCHEMAS as any)[version],fields:Record<string,unknown>={};
 for(const [key,descriptor] of Object.entries(schema.fields) as any){const c=descriptor.codec;
  fields[key]=Array.isArray(c)?c[0]:c==='instant'?T0:c==='version'?1:c==='strings'||c==='preferences'?[]:c==='json'?{source:'value'}:'source:'+version+':'+key;
 }
 if(Object.hasOwn(fields,'principal_id'))fields.principal_id=principal.id;
 if(version==='PRINCIPAL_V0')fields.principal_id=principal.id;
 return {representation_version:version,source:fields};
}
function target(src:any){
 const fields=src.source,kind=kinds[src.representation_version],descriptor=(SOURCE_SCHEMAS as any)[src.representation_version];
 const ref={kind,id:fields[descriptor.id_field]} as RepositoryIdentity;
 let v:any;
 if(src.representation_version==='OBJECTIVE_V0'||src.representation_version==='OBLIGATION_V0')v=lifecycle('NONTERMINAL',ref as any);
 else if(src.representation_version==='EFFECTVERIFICATION_V0'){
  ref.id=fields.intent_id;v=value('EFFECT',{intent:ref,operation_digest:'operation:exact',occurrence:{kind:'CAUSAL_OCCURRENCE',id:'source:causal'},version:1,disposition:'EFFECT_VERIFIED',last_event_ref:'effect:declared',proof:'MATCHING_EFFECT',evidence_refs:['effect:source']},ref);v.references=[reference(v.payload.occurrence)];
 }else if(src.representation_version==='CURRENTASSERTION_V0'){
  ref.id=fields.subject_ref;v=value('CURRENT',{subject:ref,predicate:fields.predicate,value:fields.value,epistemic:epistemic()},ref);
 }else v=value('ENTITY',{entity_version:'IRIS_B2_ENTITY_V1',source:src,epistemic:epistemic()},ref);
 v.record_id='source-record:'+src.representation_version;v.source_representations=[src];
 const refs=sourceReferences(v);for(const x of refs)if(!v.references.some((r:any)=>r.object.kind===x.kind&&r.object.id===x.id))v.references.push(reference(x));
 return v;
}

test('all 15 inherited domain DTO descriptors are explicit, lossless and SQL-valid',async t=>{
 const e=await engine();
 try{
  for(const version of Object.keys(SOURCE_SCHEMAS))await t.test(version+' exact original fields/spelling retained',async()=>{
   const src=source(version),v=target(src),mapped=mapSourceToDomain(src,v);
   assert.deepEqual(restoreSource(mapped),decodeSource(src));assert.deepEqual(decodeRecord(v).source_representations[0],decodeSource(src));
   assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_source($1::jsonb) as valid',[JSON.stringify(src)]))[0]!.valid,true);
   assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_record($1::jsonb) as valid',[JSON.stringify(v)]))[0]!.valid,true);
  });
  await t.test('every inherited enum token is retained exactly; no case fold',async()=>{
   for(const version of Object.keys(SOURCE_SCHEMAS))for(const [field,descriptor] of Object.entries((SOURCE_SCHEMAS as any)[version].fields) as any){
    if(!Array.isArray(descriptor.codec))continue;
    for(const token of descriptor.codec){const src=source(version);src.source[field]=token;assert.equal((decodeSource(src).source as any)[field],token);assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_source($1::jsonb) as valid',[JSON.stringify(src)]))[0]!.valid,true);}
    const bad=source(version);bad.source[field]='wrong';assert.throws(()=>decodeSource(bad));assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_source($1::jsonb) as valid',[JSON.stringify(bad)]))[0]!.valid,false);
   }
  });
  await t.test('CLOSED/UNSATISFIED never manufacture canonical terminal lifecycle',async()=>{
   for(const [version,status] of [['OBLIGATION_V0','CLOSED'],['OBJECTIVE_V0','UNSATISFIED']]){const src=source(version!);src.source.status=status;assert.throws(()=>mapSourceToDomain(src,target(src)),/UNMAPPED_LEGACY_STATE/);}
  });
  await t.test('unsupported/missing/null/extra source coordinates cannot disappear',async()=>{
   for(const version of Object.keys(SOURCE_SCHEMAS)){
    const src=source(version);for(const key of Object.keys(src.source)){const bad=structuredClone(src);delete bad.source[key];const optional=(SOURCE_SCHEMAS as any)[version].fields[key].optional;if(optional)continue;assert.throws(()=>decodeSource(bad));assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_source($1::jsonb) as valid',[JSON.stringify(bad)]))[0]!.valid,false);}
    const bad=source(version);bad.source.unknown_field=true;assert.throws(()=>decodeSource(bad));
   }
  });
 }finally{await e.db.close();}
});

test('source aggregates and explicit relation objects persist identically in both adapters',async()=>{
 const e=await engine(),memory=new MemoryCanonicalRepository(),sql=new PostgresCanonicalRepository(e.executor);
 try{
  for(const repo of [memory,sql]){
   const registered=new Set<string>();
   const register=async(ref:RepositoryIdentity)=>{const key=JSON.stringify(ref);if(!registered.has(key)){await repo.append(command(identityRow(ref)));registered.add(key);}};
   await register(principal);
   for(const version of Object.keys(SOURCE_SCHEMAS)){
    const v=target(source(version));await register(v.object);for(const ref of v.references)await register(ref.object);await repo.append(command(v));
   }
   const sourceID={kind:'RESOLUTION' as const,id:'resolution:alpha'},targetID={kind:'RESOLUTION' as const,id:'resolution:beta'};
   await register(sourceID);await register(targetID);
   const rel=value('RELATION',{relation_id:'relation:explicit',principal,source:sourceID,target:targetID,kind:'RESOLUTION_EQUIVALENCE',version:1,temporal:{recorded_at:T0,effective_from:T0},evidence_refs:['relation:proof']},sourceID,'relation:one');
   rel.references=[reference(sourceID),reference(targetID)];await repo.append(command(rel));
  }
  assert.equal(await sql.exportSnapshot(),await memory.exportSnapshot());
  for(const as_of of [T0,T1,T2,T3])assert.deepEqual(await sql.reconstruct(query(as_of)),await memory.reconstruct(query(as_of)));
 }finally{await e.db.close();}
});

test('data arrays and duplicate wire coordinates fail closed',()=>{
 for(const x of [[,],Object.assign([],{hidden:'value'}),Object.defineProperty([1],'0',{get:()=>1,enumerable:true}),Object.assign([],{[Symbol('x')]:1})])assert.throws(()=>denseArray(x));
 for(const wire of ['{"schema_version":"first","schema_version":"second"}','{"outer":{"principal":"a","principal":"b"}}','[{"version":1,"version":2}]','{"a":1,"\\u0061":2}'])assert.throws(()=>parseJSON(wire),/DUPLICATE_JSON_COORDINATE/);
 assert.deepEqual(parseJSON('{"same":[{"x":1},{"x":2}],"nested":{}}'),{same:[{x:1},{x:2}],nested:{}});
});

test('source/domain drift and ambiguous legacy lifecycle HOLD in both representations',async()=>{
 const e=await engine();try{
  for(const version of Object.keys(SOURCE_SCHEMAS)){
   const v=target(source(version));
   if(v.object_type==='ENTITY')v.object.id='different-id';
   else if(v.object_type==='LIFECYCLE')v.payload.state='UNKNOWN';
   else if(v.object_type==='CURRENT')v.payload.value='different-value';
   else v.payload.disposition='UNKNOWN';
   assert.throws(()=>decodeRecord(v));assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_record($1::jsonb) as valid',[JSON.stringify(v)]))[0]!.valid,false,version);
  }
  for(const [version,status] of [['OBLIGATION_V0','CLOSED'],['OBJECTIVE_V0','UNSATISFIED']]){const src=source(version!);src.source.status=status;const v=target(src);assert.throws(()=>decodeRecord(v),/UNMAPPED_LEGACY_STATE/);assert.equal((await e.executor.query<{valid:boolean}>('select iris_b2_record($1::jsonb) as valid',[JSON.stringify(v)]))[0]!.valid,false);}
 }finally{await e.db.close();}
});
