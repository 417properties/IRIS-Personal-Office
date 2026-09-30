import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyAaron,interventionFor} from '../../src/agent-transition/pilot001-classifier.ts';
import {buildProjection} from '../../src/agent-transition/pilot001-projection.ts';
import {evaluateCoverage,REQUIRED_SOURCE_REQUIREMENT_IDS} from '../../src/agent-transition/pilot001-coverage.ts';
import type {PilotCandidate,SourceEvaluation} from '../../src/agent-transition/pilot001-types.ts';

const sources:SourceEvaluation[]=REQUIRED_SOURCE_REQUIREMENT_IDS.map(source_id=>({
  source_id,required:true,present:true,principal_match:true,identity:'VERIFIED',
  applicability:'APPLICABLE',freshness:'CURRENT',provenance_ok:true,partial:false
}));
const baseCandidate:Omit<PilotCandidate,'id'>={
  principal_id:'AARON',applicability:'APPLICABLE',freshness:'CURRENT',
  source_identity:'VERIFIED',provenance_refs:['fixture://evidence']
};
const projection=(candidates:PilotCandidate[],conflicts:string[]=[])=>buildProjection({
  candidates,sources,conflicts,privacyExcluded:[],bracket:'STABLE',started_at:'t',emitted_at:'t'
});

test('post-E3: contextual objective does not pollute a decision intervention identity',()=>{
  const c:PilotCandidate={...baseCandidate,id:'e1:x:decision:d1',objective_id:'obj',decision_requirement_id:'d1',decision_status:'OPEN',decision_maker_identity_id:'AARON'};
  const i=interventionFor(c,['AR-1']);
  assert.equal(i.resolution_kind,'DECIDE');
  assert.deepEqual(i.anchor_refs,['decision_requirement:d1']);
});

test('post-E3: exact duplicate obligation roots consolidate before intervention hashing',()=>{
  const mk=(raw:string):PilotCandidate=>({...baseCandidate,id:'e1:x:obligation:'+raw,objective_id:'obj',obligation_id:'shared_anchor',obligation_status:'OPEN',obligation_owner:'AARON',concrete_action_remaining:true});
  const p=projection([mk('obl_a'),mk('obl_b')]);
  assert.equal(p.known_aaron_required.length,1);
  assert.equal(p.known_aaron_required[0]!.resolution_kind,'ACT');
  assert.deepEqual(p.known_aaron_required[0]!.anchor_refs,['obligation:obl_a','obligation:obl_b']);
});

test('post-E3: material conflict does not erase the underlying Aaron action',()=>{
  const c:PilotCandidate={...baseCandidate,id:'e1:x:obligation:obl_a',objective_id:'obj',obligation_id:'obl_a',obligation_status:'OPEN',obligation_owner:'AARON',concrete_action_remaining:true,conflict_id:'conf_a',material_conflict:true};
  const p=projection([c],['conf_a']);
  assert.deepEqual(p.known_aaron_required.map(x=>[x.resolution_kind,x.anchor_refs]),[
    ['ACT',['obligation:obl_a']],
    ['RESOLVE_CONFLICT',['conflict:conf_a']]
  ]);
});

test('post-E3: unresolved effect selects RECONCILE_EFFECT and preserves conflict plus intent anchors',()=>{
  const c:PilotCandidate={...baseCandidate,id:'e1:x:intent:intent_a',objective_id:'obj',intent_id:'intent_a',conflict_id:'conf_a',unresolved_effect:true,material_conflict:true};
  const p=projection([c],['conf_a']);
  assert.equal(p.known_aaron_required.length,1);
  assert.equal(p.known_aaron_required[0]!.resolution_kind,'RECONCILE_EFFECT');
  assert.deepEqual(p.known_aaron_required[0]!.anchor_refs,['conflict:conf_a','intent:intent_a']);
});

test('post-E3: one reserved-authority intervention may consolidate obligation decision and authority conflict',()=>{
  const obligation:PilotCandidate={...baseCandidate,id:'e1:x:obligation:obl_a',objective_id:'obj',obligation_id:'obl_a',obligation_status:'OPEN',obligation_owner:'AARON',concrete_action_remaining:true,reserved_authority_class:'RESOURCE_COMMITMENT',authority_holder_identity_id:'AARON'};
  const decision:PilotCandidate={...baseCandidate,id:'e1:x:decision:dec_a',objective_id:'obj',decision_requirement_id:'dec_a',decision_status:'OPEN',decision_maker_identity_id:'AARON',reserved_authority_class:'RESOURCE_COMMITMENT',authority_holder_identity_id:'AARON'};
  const conflict:PilotCandidate={...baseCandidate,id:'e1:x:conflict:conf_a',objective_id:'obj',conflict_id:'conf_a',material_conflict:true};
  const p=projection([obligation,decision,conflict],['conf_a']);
  assert.equal(p.known_aaron_required.length,1);
  assert.equal(p.known_aaron_required[0]!.resolution_kind,'AUTHORIZE');
  assert.deepEqual(p.known_aaron_required[0]!.anchor_refs,['conflict:conf_a','decision_requirement:dec_a','obligation:obl_a']);
  assert.deepEqual(new Set(p.known_aaron_required[0]!.ar_classes),new Set(['AR-1','AR-2','AR-3','AR-4']));
});

test('post-E3: reserved authority with no proven valid delegation fails closed to Aaron-required authorization',()=>{
  const r=classifyAaron({...baseCandidate,id:'a',obligation_id:'o',reserved_authority_class:'RESOURCE_COMMITMENT',authority_holder_identity_id:'UNKNOWN'});
  assert.equal(r.unknown,false);
  assert.equal(r.omittable,false);
  assert.deepEqual(r.classes,['AR-3']);
});

test('post-E3: COMPLETE requires explicit non-partial evidence for every immutable required source',()=>{
  const malformed=sources.map(x=>({...x})) as SourceEvaluation[];
  delete (malformed[0] as Partial<SourceEvaluation>).partial;
  assert.equal(evaluateCoverage(malformed,[],[],'STABLE'),'UNKNOWN_COVERAGE');
  const partial=sources.map(x=>({...x}));
  partial[0]!.partial=true;
  assert.equal(evaluateCoverage(partial,[],[],'STABLE'),'INCOMPLETE_COVERAGE');
});
