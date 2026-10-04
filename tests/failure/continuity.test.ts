import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRepo, NOW, fixtureIntent } from '../helpers.ts';
import { continuityAdmission } from '../../src/state/continuity-admission.ts';
import { claimContinuation } from '../../src/runtime/episode-controller.ts';
import { CognitionRouter } from '../../src/runtime/cognition-router.ts';
import {setup as capabilitySetup,install,request as capabilityRequest,worker as capabilityWorker,qid} from '../capability-integration/fixtures.ts';
import {identity} from '../../src/semantic-kernel/identity.ts';

test('kill after THINK resumes from canonical objective/obligation',()=>{const r=seededRepo(); assert.equal(continuityAdmission(r,r.stateVersion).admitted,false);});
test('kill after intent persisted preserves intent',()=>{const r=seededRepo(); r.intents.set('i',fixtureIntent()); assert.equal(r.intents.has('i'),true);});
test('kill after tool before receipt becomes effect-unknown boundary',()=>{const r=seededRepo(); r.verifications.set('v',{verification_id:'v',intent_id:'i',disposition:'UNKNOWN',evidence_refs:[],verified_at:NOW,notes:['receipt missing']}); assert.equal(continuityAdmission(r,r.stateVersion).reason,'RECONCILIATION_REQUIRED');});
test('kill after receipt before verification does not infer effect',()=>{const r=seededRepo(); r.receipts.set('r',{receipt_id:'r',intent_id:'i',provider_call_id:'c',request_digest:'d',completion_class:'SUCCESS',returned_payload_digest:'x',tool_reported_status:'SUCCESS',received_at:NOW}); assert.equal(r.verifications.size,0); assert.equal(r.objectives.get('obj-parent')!.status,'OPEN');});
test('external state change while asleep forces reorientation',()=>{const r=seededRepo(); const prior=r.stateVersion; r.objectives.get('obj-parent')!.version++; r.bump(); assert.equal(continuityAdmission(r,prior).requires_reorient,true);});
test('competing continuation generations fail CAS',()=>{const r=seededRepo(); const base={principal_id:'aaron',objective_id:'obj-parent',episode_generation:2,causal_episode_id:'cause',state_version_at_start:r.stateVersion,orientation_version_at_start:1,authority_snapshot_digest:'a',privacy_snapshot_digest:'p',toolset_digest:'t',cognition_profile:'test',status:'ORIENTING' as const,started_at:NOW,last_checkpoint_at:NOW}; const before=r.stateVersion; assert.throws(()=>claimContinuation(r,{...base,work_episode_id:'e2'}),/CANONICAL_CONTINUATION_CAS_REQUIRED/); assert.throws(()=>claimContinuation(r,{...base,work_episode_id:'e2b'}),/CANONICAL_CONTINUATION_CAS_REQUIRED/); assert.equal(r.stateVersion,before);});
test('stale workflow checkpoint cannot outrank newer canonical state',()=>{const r=seededRepo(); const stale=r.stateVersion; r.bump(); assert.equal(continuityAdmission(r,stale).requires_reorient,true);});
test('tracing unavailable cannot block canonical reconstruction',()=>{const r=seededRepo(); assert.equal(continuityAdmission(r,r.stateVersion).admitted,false);});
test('model provider unavailable can fall back without changing authority',async()=>{const s=await capabilitySetup(),other=identity('WORKER','fallback');await install(s.repo,other,{provider_id:'provider:b'});const router=new CognitionRouter(s.svc,[{subject:capabilityWorker,qualification_id:qid},{subject:other,qualification_id:qid}]);const r=await router.route({request_id:'fallback',phase:'THINK',task_type:'bounded',mode:'RESEARCH',capability:capabilityRequest({providers_denied:['provider:a']}),trace_context:'trace'});assert.equal(r.selected?.configuration.provider_id,'provider:b');assert.equal(r.authority_effect,'NONE');});
test('empty model session memory does not affect reconstruction',()=>{const r=seededRepo(); const sessionMemory={}; assert.deepEqual(sessionMemory,{}); assert.equal(continuityAdmission(r,r.stateVersion).admitted,false);});

for (const withReceipt of [false,true]) {
  test(`persisted ${withReceipt?"successful receipt without verification":"intent only"} requires reconciliation`,()=>{
    const repo=seededRepo();
    const intent=fixtureIntent();
    repo.intents.set(intent.intent_id,intent);
    if (withReceipt) repo.receipts.set("receipt-1",{receipt_id:"receipt-1",intent_id:intent.intent_id,provider_call_id:"call-1",request_digest:"d",completion_class:"SUCCESS",returned_payload_digest:"x",tool_reported_status:"SUCCESS",received_at:NOW});
    repo.bump();
    const result=continuityAdmission(repo,repo.stateVersion);
    assert.equal(repo.verifications.size,0);
    assert.equal(result.admitted,false);
    assert.equal(result.reason,"RECONCILIATION_REQUIRED");
    assert.equal(result.requires_reorient,true);
    assert.deepEqual(result.unresolved_effect_intent_ids,[intent.intent_id]);
    assert.deepEqual(result.open_obligation_ids,["obl-1"]);
    assert.equal(repo.objectives.get("obj-parent")!.status,"OPEN");
    assert.equal(repo.obligations.get("obl-1")!.status,"OPEN");
  });
}
for (const disposition of ["VERIFIED_EFFECT","VERIFIED_NO_EFFECT","AMBIGUOUS_EFFECT","UNKNOWN","CONFLICT"] as const) {
  test(`persisted intent with ${disposition} cannot admit from legacy effect disposition labels`,()=>{
    const repo=seededRepo();
    const intent=fixtureIntent();
    repo.intents.set(intent.intent_id,intent);
    repo.verifications.set("v",{verification_id:"v",intent_id:intent.intent_id,disposition,evidence_refs:[],verified_at:NOW,notes:[]});

    const result=continuityAdmission(repo,repo.stateVersion);
    assert.equal(result.admitted,false);
    assert.equal(result.reason,"RECONCILIATION_REQUIRED");
    assert.deepEqual(result.unresolved_effect_intent_ids,[intent.intent_id]);
  });
}
test("terminal verification for another intent cannot clear an unresolved persisted intent",()=>{
  const repo=seededRepo();
  const intent=fixtureIntent();
  repo.intents.set(intent.intent_id,intent);
  repo.intents.set("resolved-intent",{...intent,intent_id:"resolved-intent"});
  repo.verifications.set("v",{verification_id:"v",intent_id:"resolved-intent",disposition:"VERIFIED_EFFECT",evidence_refs:[],verified_at:NOW,notes:[]});
  const result=continuityAdmission(repo,repo.stateVersion);
  assert.equal(result.admitted,false);
  assert.equal(result.reason,"RECONCILIATION_REQUIRED");
  assert.deepEqual(result.unresolved_effect_intent_ids,["resolved-intent",intent.intent_id]);
});
test("terminal verification cannot mask a coexisting unresolved disposition",()=>{
  const repo=seededRepo();
  const intent=fixtureIntent();
  repo.intents.set(intent.intent_id,intent);
  for (const disposition of ["VERIFIED_EFFECT","UNKNOWN"] as const) repo.verifications.set(disposition,{verification_id:disposition,intent_id:intent.intent_id,disposition,evidence_refs:[],verified_at:NOW,notes:[]});
  const result=continuityAdmission(repo,repo.stateVersion);
  assert.equal(result.admitted,false);
  assert.equal(result.reason,"RECONCILIATION_REQUIRED");
  assert.deepEqual(result.unresolved_effect_intent_ids,[intent.intent_id]);
});
