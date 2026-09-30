import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateCoverage,justifiedOmission,REQUIRED_SOURCE_REQUIREMENT_IDS} from '../../src/agent-transition/pilot001-coverage.ts';
import {buildProjection} from '../../src/agent-transition/pilot001-projection.ts';
import type {PilotCandidate,SourceEvaluation} from '../../src/agent-transition/pilot001-types.ts';

const src=(source_id:string,p:Partial<SourceEvaluation>={}):SourceEvaluation=>({
  source_id,required:true,present:true,principal_match:true,identity:'VERIFIED',
  applicability:'APPLICABLE',freshness:'CURRENT',provenance_ok:true,partial:false,...p
});
const allSources=(patchId?:string,patch:Partial<SourceEvaluation>={}):SourceEvaluation[] =>
  REQUIRED_SOURCE_REQUIREMENT_IDS.map(id=>src(id,id===patchId?patch:{}));
const item:PilotCandidate={
  id:'i',principal_id:'AARON',applicability:'APPLICABLE',freshness:'CURRENT',
  source_identity:'VERIFIED',provenance_refs:['pilot001:obligations']
};

test('T44/T45/T46 stale, partial, missing required source => INCOMPLETE and no omission',()=>{
  for(const patch of [{freshness:'STALE'} as const,{partial:true},{present:false}]){
    const c=evaluateCoverage(allSources('pilot001:obligations',patch),[item],[],'STABLE');
    assert.equal(c,'INCOMPLETE_COVERAGE');
    assert.equal(justifiedOmission(item,c),false);
  }
});

test('T47 unknown identity/applicability => UNKNOWN',()=>{
  assert.equal(evaluateCoverage(allSources('pilot001:obligations',{identity:'UNKNOWN'}),[item],[],'STABLE'),'UNKNOWN_COVERAGE');
  assert.equal(evaluateCoverage(allSources('pilot001:obligations',{applicability:'UNKNOWN'}),[item],[],'STABLE'),'UNKNOWN_COVERAGE');
});

test('T48 required source wrong principal fails closed',()=>{
  assert.equal(evaluateCoverage(allSources('pilot001:obligations',{principal_match:false}),[item],[],'STABLE'),'UNKNOWN_COVERAGE');
  assert.equal(justifiedOmission({...item,principal_id:'OTHER'},'COMPLETE_FOR_DECLARED_SCOPE'),false);
});

test('T42/T43/T49 material conflict prevents COMPLETE',()=>{
  assert.equal(evaluateCoverage(allSources(),[{...item,material_conflict:true}],['conflict'],'STABLE'),'CONFLICTED_COVERAGE');
});

test('T50 all qualified conditions => COMPLETE',()=>{
  assert.equal(evaluateCoverage(allSources(),[item],[],'STABLE'),'COMPLETE_FOR_DECLARED_SCOPE');
});

test('T51 unclassifiable Aaron candidate => UNKNOWN',()=>{
  assert.equal(evaluateCoverage(allSources(),[{...item,source_identity:'UNKNOWN'}],[],'STABLE'),'UNKNOWN_COVERAGE');
});

test('T52/T53 omission requires all material dimensions',()=>{
  assert.equal(justifiedOmission(item,'COMPLETE_FOR_DECLARED_SCOPE'),true);
  assert.equal(justifiedOmission({...item,freshness:'STALE'},'COMPLETE_FOR_DECLARED_SCOPE'),false);
});

test('T54 exact required source set cannot be silently narrowed away',()=>{
  assert.equal(evaluateCoverage([],[],[],'STABLE'),'INCOMPLETE_COVERAGE');
  const seven=allSources().slice(1);
  assert.equal(evaluateCoverage(seven,[item],[],'STABLE'),'INCOMPLETE_COVERAGE');
});

test('T54b caller required:false cannot narrow immutable required-source coverage',()=>{
  const bypassSources:SourceEvaluation[]=REQUIRED_SOURCE_REQUIREMENT_IDS.map(source_id=>({
    source_id,
    required:false,
    present:false,
    principal_match:false,
    identity:'UNKNOWN',
    applicability:'UNKNOWN',
    freshness:'UNKNOWN',
    provenance_ok:false
  }));
  const candidate:PilotCandidate={
    id:'c',
    principal_id:'AARON',
    applicability:'APPLICABLE',
    freshness:'CURRENT',
    source_identity:'VERIFIED',
    provenance_refs:['claimed']
  };

  const coverage=evaluateCoverage(bypassSources,[candidate],[],'STABLE');
  assert.notEqual(coverage,'COMPLETE_FOR_DECLARED_SCOPE');
  assert.equal(justifiedOmission(candidate,coverage),false);

  const projection=buildProjection({
    candidates:[candidate],
    sources:bypassSources,
    conflicts:[],
    privacyExcluded:[],
    bracket:'STABLE',
    started_at:'2026-09-29T00:00:00Z',
    emitted_at:'2026-09-29T00:00:00Z'
  });
  assert.notEqual(projection.completeness_state,'COMPLETE_FOR_DECLARED_SCOPE');
  assert.notDeepEqual(projection.coverage_gaps,[]);
  assert.deepEqual(projection.justified_omissions,[]);
});

test('T54c required applicable UNKNOWN freshness cannot produce COMPLETE or omission',()=>{
  const coverage=evaluateCoverage(allSources('pilot001:qualified_big_quarantine_evidence',{freshness:'UNKNOWN'}),[item],[],'STABLE');
  assert.equal(coverage,'UNKNOWN_COVERAGE');
  assert.equal(justifiedOmission(item,coverage),false);
});

test('T54d unsupported required-source inapplicability fails closed',()=>{
  const coverage=evaluateCoverage(allSources('pilot001:qualified_big_quarantine_evidence',{applicability:'INAPPLICABLE',present:false,freshness:'UNKNOWN',provenance_ok:false}),[item],[],'STABLE');
  assert.equal(coverage,'UNKNOWN_COVERAGE');
  assert.equal(justifiedOmission(item,coverage),false);
});

test('T54e stale required-source inapplicability cannot produce COMPLETE or omission',()=>{
  const sources=allSources('pilot001:qualified_big_quarantine_evidence',{applicability:'INAPPLICABLE',present:false,freshness:'STALE',provenance_ok:true});
  const projection=buildProjection({candidates:[item],sources,conflicts:[],privacyExcluded:[],bracket:'STABLE',started_at:'2026-09-29T00:00:00Z',emitted_at:'2026-09-29T00:00:00Z'});
  assert.equal(projection.completeness_state,'INCOMPLETE_COVERAGE');
  assert.notDeepEqual(projection.coverage_gaps,[]);
  assert.deepEqual(projection.justified_omissions,[]);
});

test('T54f partial required-source inapplicability cannot produce COMPLETE or omission',()=>{
  const sources=allSources('pilot001:qualified_big_quarantine_evidence',{applicability:'INAPPLICABLE',present:false,freshness:'CURRENT',provenance_ok:true,partial:true});
  const projection=buildProjection({candidates:[item],sources,conflicts:[],privacyExcluded:[],bracket:'STABLE',started_at:'2026-09-29T00:00:00Z',emitted_at:'2026-09-29T00:00:00Z'});
  assert.equal(projection.completeness_state,'INCOMPLETE_COVERAGE');
  assert.notDeepEqual(projection.coverage_gaps,[]);
  assert.deepEqual(projection.justified_omissions,[]);
});

test('T54g malformed runtime required-source shapes fail closed before completeness',()=>{
  const malformed:Array<Record<string,unknown>>=[
    {applicability:null},
    {freshness:null},
    {identity:'UNVERIFIED'},
    {applicability:'NOT_EVALUATED'},
    {freshness:'NOT_EVALUATED'},
    {required:'true'},
    {present:'true'},
    {principal_match:1},
    {provenance_ok:'false'},
    {partial:'false'}
  ];
  for(const patch of malformed){
    const sources=allSources();
    Object.assign(sources.find(s=>s.source_id==='pilot001:qualified_big_quarantine_evidence')!,patch);
    const projection=buildProjection({candidates:[item],sources,conflicts:[],privacyExcluded:[],bracket:'STABLE',started_at:'2026-09-29T00:00:00Z',emitted_at:'2026-09-29T00:00:00Z'});
    assert.equal(projection.completeness_state,'UNKNOWN_COVERAGE');
    assert.notDeepEqual(projection.coverage_gaps,[]);
    assert.deepEqual(projection.justified_omissions,[]);
  }
});

test('T55 one stabilized rerun may proceed; T56 repeated instability UNKNOWN',()=>{
  assert.equal(evaluateCoverage(allSources(),[item],[],'RERUN_STABLE'),'COMPLETE_FOR_DECLARED_SCOPE');
  assert.equal(evaluateCoverage(allSources(),[item],[],'UNSTABLE'),'UNKNOWN_COVERAGE');
});
