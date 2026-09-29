import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {buildProjection} from '../../../src/agent-transition/pilot001-projection.ts';
import {REQUIRED_SOURCE_IDS,assertAllowedRuntimePath,decodeFrozenE1Case,normalizeIdentity,validateManifestPopulation} from '../../../evaluation/pilot001/frozen-e1-binding-v0.1/adapter.mts';
import {canonicalBytes,sha256Canonical} from '../../../evaluation/pilot001/frozen-e1-binding-v0.1/canonical-json.mts';
import {PINS,parseArgs,verifyPins} from '../../../evaluation/pilot001/frozen-e1-binding-v0.1/run.mts';

const gitText=(ref:string,p:string)=>execFileSync('git',['show',ref+':'+p],{encoding:'utf8'});
const manifest=JSON.parse(gitText(PINS.e1Head,PINS.manifestPath));
const population=JSON.parse(gitText(PINS.e1Head,PINS.populationPath));
const byId=(id:string)=>manifest.cases.find((c:any)=>c.case_id===id);
const byMissing=(dim:string)=>manifest.cases.find((c:any)=>c.missing_dimensions.includes(dim));
const clone=<T>(value:T):T=>structuredClone(value);
const validArgs=[
  '--candidate-head',PINS.candidateHead,'--candidate-tree',PINS.candidateTree,'--e1-head',PINS.e1Head,
  '--population-digest',PINS.populationDigest,'--manifest',PINS.manifestPath,'--binding',PINS.bindingPath,'--out',PINS.canonicalOut
];

test('identity normalization is exact and never guessed',()=>{
  assert.equal(normalizeIdentity('principal_aaron'),'AARON');
  for(const value of ['PRINCIPAL_AARON','Aaron',' principal_aaron ','unknown_alias']) assert.equal(normalizeIdentity(value),value);
  assert.equal(normalizeIdentity(null),'UNKNOWN');
  assert.throws(()=>normalizeIdentity(42));
});

test('frozen population order/count/digest is exact; missing extra duplicate reorder fail',()=>{
  validateManifestPopulation(manifest,population,PINS.populationDigest,sha256Canonical);
  for(const mutate of [
    (m:any)=>m.cases.pop(),
    (m:any)=>m.cases.push(clone(m.cases[0])),
    (m:any)=>m.ordered_case_ids[1]=m.ordered_case_ids[0],
    (m:any)=>m.ordered_case_ids.reverse()
  ]){
    const m=clone(manifest); mutate(m);
    assert.throws(()=>validateManifestPopulation(m,population,PINS.populationDigest,sha256Canonical));
  }
});

test('required sources are exact ordered immutable eight and empty BIG surface is present',()=>{
  const c=clone(manifest.cases[0]); c.required=false;
  const {input}=decodeFrozenE1Case(c);
  assert.deepEqual(input.sources.map((s:any)=>s.source_id),[...REQUIRED_SOURCE_IDS]);
  assert.ok(input.sources.every((s:any)=>s.required===true));
  const big=input.sources.at(-1);
  assert.deepEqual(big,{source_id:'pilot001:qualified_big_quarantine_evidence',required:true,present:true,principal_match:true,identity:'VERIFIED',applicability:'APPLICABLE',freshness:'CURRENT',provenance_ok:true,partial:false});
});

test('missing stale unknown-applicability partial and qualified BIG freshness map fail-closed',()=>{
  const missing=decodeFrozenE1Case(byMissing('REQUIRED_OBLIGATION_SOURCE')).input.sources;
  assert.equal(missing.find((s:any)=>s.source_id==='pilot001:obligations').present,false);
  const stale=decodeFrozenE1Case(byMissing('CURRENT_OBJECTIVE_FRESHNESS')).input.sources;
  assert.equal(stale.find((s:any)=>s.source_id==='pilot001:objectives').freshness,'STALE');
  const unknown=decodeFrozenE1Case(byMissing('OBJECTIVE_SOURCE_APPLICABILITY')).input.sources;
  assert.equal(unknown.find((s:any)=>s.source_id==='pilot001:objectives').applicability,'UNKNOWN');
  const partial=decodeFrozenE1Case(byMissing('DUPLICATE_CANONICAL_IDENTITY')).input.sources;
  assert.equal(partial.find((s:any)=>s.source_id==='pilot001:obligations').partial,true);
  const bounded=decodeFrozenE1Case(byId('p1e1_a16d537c80b429ef')).input.sources.at(-1);
  assert.equal(bounded.freshness,'UNKNOWN');
});

test('decision and obligation roots stay separate and candidate root order is frozen',()=>{
  const {input}=decodeFrozenE1Case(manifest.cases[0]);
  assert.equal(input.candidates[0].id,'e1:p1e1_7c9a4d12f6b38e01:obligation:obl_1');
  assert.equal(input.candidates[1].id,'e1:p1e1_7c9a4d12f6b38e01:decision:dr_01');
  assert.equal(input.candidates[0].decision_requirement_id,undefined);
  assert.equal(input.candidates[1].obligation_id,undefined);
});

test('missing source cannot be resurrected by embedded record values',()=>{
  const {input}=decodeFrozenE1Case(byMissing('REQUIRED_OBLIGATION_SOURCE'));
  assert.equal(input.candidates.length,0);
  assert.equal(input.sources.find((s:any)=>s.source_id==='pilot001:obligations').present,false);
  assert.notEqual(buildProjection(input).completeness_state,'COMPLETE_FOR_DECLARED_SCOPE');
});

test('owner decision-maker and authority holder remain distinct',()=>{
  const {input}=decodeFrozenE1Case(manifest.cases[0]);
  const obligation=input.candidates.find((c:any)=>c.obligation_id==='obl_1');
  const decision=input.candidates.find((c:any)=>c.decision_requirement_id==='dr_01');
  assert.equal(obligation.obligation_owner,'iris_office');
  assert.equal(decision.decision_maker_identity_id,'AARON');
  assert.equal(decision.authority_holder_identity_id,undefined);
});

test('duplicate identity follows only explicit canonical anchors',()=>{
  const exact=decodeFrozenE1Case(byId('p1e1_376db819a04fc25e')).input.candidates.filter((c:any)=>c.obligation_id);
  assert.equal(exact[0].obligation_id,exact[1].obligation_id);
  const textual=decodeFrozenE1Case(byId('p1e1_f0592c6b831a4d7e')).input.candidates.filter((c:any)=>c.obligation_id);
  assert.equal(textual[0].obligation_id,textual[1].obligation_id);
  const distinct=decodeFrozenE1Case(byId('p1e1_642e1fa9c37d805b')).input.candidates.filter((c:any)=>c.obligation_id);
  assert.notEqual(distinct[0].obligation_id,distinct[1].obligation_id);
  const uncertain=decodeFrozenE1Case(byId('p1e1_9d03b75e214ac86f')).input.candidates.filter((c:any)=>c.obligation_id);
  assert.deepEqual(uncertain.map((c:any)=>c.possible_duplicate_refs),[['obl_18b'],['obl_18a']]);
});

test('conflict overlays, receipt-to-intent relation and conflict-only fallback are deterministic',()=>{
  const pair=decodeFrozenE1Case(byId('p1e1_25fb84c0de71936a')).input;
  assert.equal(pair.candidates.filter((c:any)=>c.conflict_id==='conf_19').length,2);
  const effect=decodeFrozenE1Case(byId('p1e1_87be31d95a60c4f2')).input;
  assert.equal(effect.candidates.find((c:any)=>c.intent_id==='intent_22').conflict_id,'conf_22');
  const current=decodeFrozenE1Case(byId('p1e1_4c19a8e260d735bf')).input;
  assert.equal(current.candidates.filter((c:any)=>c.id.endsWith(':conflict:conf_21')).length,1);

  const ambiguous=clone(byId('p1e1_25fb84c0de71936a'));
  ambiguous.conflicts.push({conflict_id:'conf_extra',type:'INCOMPATIBLE_OBLIGATIONS',state:'UNRESOLVED',assertion_refs:['obl_19a']});
  assert.throws(()=>decodeFrozenE1Case(ambiguous),/more than one conflict_id/);
});

test('escalation attaches only through frozen relations or one deterministic root',()=>{
  const instruction=decodeFrozenE1Case(byId('p1e1_4bd762e90fa13c58')).input;
  assert.equal(instruction.candidates.find((c:any)=>c.conflict_id==='conf_04').escalation_required,true);
  const authority=decodeFrozenE1Case(byId('p1e1_d38a05f741c96b2e')).input;
  assert.equal(authority.candidates.find((c:any)=>c.conflict_id==='conf_05').escalation_required,true);
  const single=decodeFrozenE1Case(byId('p1e1_8a35d0c27fe4619b')).input;
  assert.equal(single.candidates.filter((c:any)=>c.escalation_required).length,1);

  const ambiguous=clone(byId('p1e1_8a35d0c27fe4619b'));
  ambiguous.obligations.push({...clone(ambiguous.obligations[0]),obligation_id:'obl_14b'});
  assert.throws(()=>decodeFrozenE1Case(ambiguous),/no deterministic single target root/);
});

test('privacy exclusion imports zero private candidates and bounded packet cannot leak fields',()=>{
  const excluded=decodeFrozenE1Case(byId('p1e1_39c08fa672e1bd54')).input;
  assert.equal(excluded.candidates.length,0);
  assert.deepEqual(excluded.privacyExcluded,['objective:obj_30']);
  assert.deepEqual(buildProjection(excluded).justified_omissions,[]);

  const bounded=decodeFrozenE1Case(byId('p1e1_a16d537c80b429ef')).input;
  assert.equal(bounded.candidates.length,1);
  assert.equal(bounded.candidates[0].decision_requirement_id,'dr_31');
  assert.equal(bounded.candidates[0].objective_id,undefined);
  assert.equal(bounded.candidates[0].decision_status,undefined);
  assert.equal(bounded.candidates[0].decision_maker_identity_id,undefined);
  assert.equal(bounded.candidates[0].applicability,'UNKNOWN');
});

test('dependency bracket maps mechanically',()=>{
  assert.equal(decodeFrozenE1Case(manifest.cases[0]).input.bracket,'STABLE');
  const one=clone(manifest.cases[0]); one.coverage_inputs.dependency_bracket={initial_digest:'a',final_digest:'b',rerun_count:1};
  assert.equal(decodeFrozenE1Case(one).input.bracket,'RERUN_STABLE');
  assert.equal(decodeFrozenE1Case(byId('p1e1_6b4f29e8d105ca73')).input.bracket,'UNSTABLE');
});

test('candidate and source insertion order matches accepted binding',()=>{
  const {input}=decodeFrozenE1Case(manifest.cases[0]);
  assert.deepEqual(Object.keys(input.sources[0]),['source_id','required','present','principal_match','identity','applicability','freshness','provenance_ok','partial']);
  assert.deepEqual(Object.keys(input.candidates[0]),['id','principal_id','objective_id','obligation_id','obligation_status','obligation_owner','concrete_action_remaining','escalation_required','unresolved_effect','material_conflict','informational_only','applicability','freshness','source_identity','provenance_refs','possible_duplicate_refs']);
  assert.deepEqual(Object.keys(input),['candidates','sources','conflicts','privacyExcluded','bracket','started_at','emitted_at']);
});

test('canonical JSON is deterministic and rejects undefined/nonfinite values',()=>{
  assert.equal(canonicalBytes({b:1,a:[2,{z:true,y:'x'}]}).toString(),'{"a":[2,{"y":"x","z":true}],"b":1}');
  assert.throws(()=>canonicalBytes({a:undefined}));
  assert.throws(()=>canonicalBytes({a:Infinity}));
  assert.deepEqual(canonicalBytes({x:1}),canonicalBytes({x:1}));
});

test('label path is denied and subset/case-filter CLI surface does not exist',()=>{
  assert.throws(()=>assertAllowedRuntimePath('artifacts/evaluation/pilot001/IRIS-PILOT-001-REFERENCE-SET-LABELS-v0.1.json'));
  assert.throws(()=>parseArgs([...validArgs,'--case','p1e1_7c9a4d12f6b38e01']));
});

test('frozen pin verification passes and candidate blobs are byte-identical',()=>{
  const args=parseArgs(validArgs);
  verifyPins(args);
  for(const [file,blob] of Object.entries(PINS.candidateBlobs)){
    const actual=execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();
    assert.equal(actual,blob);
  }
});

test('harness source imports frozen candidate and does not copy classification/coverage logic',()=>{
  const adapter=fs.readFileSync('evaluation/pilot001/frozen-e1-binding-v0.1/adapter.mts','utf8');
  const run=fs.readFileSync('evaluation/pilot001/frozen-e1-binding-v0.1/run.mts','utf8');
  assert.match(run,/from '\.\.\/\.\.\/\.\.\/src\/agent-transition\/pilot001-projection\.ts'/);
  for(const banned of ['classifyAaron','evaluateCoverage','interventionFor','pilot001-intervention-v1']) {
    assert.equal(adapter.includes(banned),false);
    assert.equal(run.includes(banned),false);
  }
  const harness=adapter+run+fs.readFileSync('evaluation/pilot001/frozen-e1-binding-v0.1/canonical-json.mts','utf8');
  for(const banned of ['REFERENCE-SET-LABELS','fdcac4331ea9e5f3dbd13bf04d14e3e7b406c41e','PHASE-E3-FINAL-SCORING']) assert.equal(harness.includes(banned),false);
});
