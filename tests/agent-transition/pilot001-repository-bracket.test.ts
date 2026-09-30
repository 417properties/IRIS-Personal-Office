import test from 'node:test';
import assert from 'node:assert/strict';
import {PostgresTransitionProjectionRepository,type SnapshotDecoder,type CanonicalRows} from '../../src/agent-transition/transition-repository.ts';
import {REQUIRED_SOURCE_REQUIREMENT_IDS} from '../../src/agent-transition/pilot001-coverage.ts';
import type {SqlExecutor} from '../../src/state/postgres-repository.ts';
import type {SourceEvaluation} from '../../src/agent-transition/pilot001-types.ts';

const sources:SourceEvaluation[]=REQUIRED_SOURCE_REQUIREMENT_IDS.map(source_id=>({source_id,required:true,present:true,principal_match:true,identity:'VERIFIED',applicability:'APPLICABLE',freshness:'CURRENT',provenance_ok:true,partial:false}));
const decoder:SnapshotDecoder={decode(_rows:Readonly<CanonicalRows>,at:string){return {candidates:[],sources,conflicts:[],privacyExcluded:[],bracket:'STABLE',started_at:at,emitted_at:at};}};

class FakeSql implements SqlExecutor{
  tx=0;
  versions:string[];
  constructor(versions:string[]){this.versions=versions;}
  async query<T=Record<string,unknown>>(text:string):Promise<T[]>{
    if(text.startsWith('BEGIN')){this.tx++;return [];}
    if(text==='COMMIT'||text==='ROLLBACK') return [];
    if(text.startsWith('SELECT * FROM ')) return [{version:this.versions[this.tx-1]??this.versions.at(-1)??'X'} as T];
    return [];
  }
}

test('repository type-erased decoder cannot promote malformed required-source facts to COMPLETE',async()=>{
  const malformedDecoder:SnapshotDecoder={decode(_rows:Readonly<CanonicalRows>,at:string){
    const malformed=structuredClone(sources) as unknown as Array<Record<string,unknown>>;
    Object.assign(malformed.find(s=>s.source_id==='pilot001:qualified_big_quarantine_evidence')!,{freshness:null,provenance_ok:'false'});
    return {candidates:[],sources:malformed as unknown as SourceEvaluation[],conflicts:[],privacyExcluded:[],bracket:'STABLE',started_at:at,emitted_at:at};
  }};
  const repo=new PostgresTransitionProjectionRepository(new FakeSql(['A','A']),malformedDecoder,()=> '2026-09-28T00:00:00Z');
  const p=await repo.buildConsistentProjection();
  assert.equal(p.completeness_state,'UNKNOWN_COVERAGE');
  assert.notDeepEqual(p.coverage_gaps,[]);
  assert.deepEqual(p.justified_omissions,[]);
});

test('repository performs real stable end-bracket comparison',async()=>{
  const repo=new PostgresTransitionProjectionRepository(new FakeSql(['A','A']),decoder,()=> '2026-09-28T00:00:00Z');
  const p=await repo.buildConsistentProjection();
  assert.equal(p.snapshot.bracket_status,'STABLE');
  assert.equal(p.completeness_state,'COMPLETE_FOR_DECLARED_SCOPE');
});

test('repository discards drifted first snapshot and reruns once',async()=>{
  const repo=new PostgresTransitionProjectionRepository(new FakeSql(['A','B','B','B']),decoder,()=> '2026-09-28T00:00:00Z');
  const p=await repo.buildConsistentProjection();
  assert.equal(p.snapshot.bracket_status,'RERUN_STABLE');
  assert.equal(p.completeness_state,'COMPLETE_FOR_DECLARED_SCOPE');
});

test('repository fails UNKNOWN after second dependency instability',async()=>{
  const repo=new PostgresTransitionProjectionRepository(new FakeSql(['A','B','C','D']),decoder,()=> '2026-09-28T00:00:00Z');
  const p=await repo.buildConsistentProjection();
  assert.equal(p.snapshot.bracket_status,'UNSTABLE');
  assert.equal(p.completeness_state,'UNKNOWN_COVERAGE');
});
