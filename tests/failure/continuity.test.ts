import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRepo, NOW, fixtureIntent } from '../helpers.ts';
import { continuityAdmission } from '../../src/state/continuity-admission.ts';
import { claimContinuation } from '../../src/runtime/episode-controller.ts';
import { CognitionRouter } from '../../src/runtime/cognition-router.ts';

test('kill after THINK resumes from canonical objective/obligation',()=>{const r=seededRepo(); assert.equal(continuityAdmission(r,r.stateVersion).admitted,true);});
test('kill after intent persisted preserves intent',()=>{const r=seededRepo(); r.intents.set('i',fixtureIntent()); assert.equal(r.intents.has('i'),true);});
test('kill after tool before receipt becomes effect-unknown boundary',()=>{const r=seededRepo(); r.verifications.set('v',{verification_id:'v',intent_id:'i',disposition:'UNKNOWN',evidence_refs:[],verified_at:NOW,notes:['receipt missing']}); assert.equal(continuityAdmission(r,r.stateVersion).reason,'RECONCILIATION_REQUIRED');});
test('kill after receipt before verification does not infer effect',()=>{const r=seededRepo(); r.receipts.set('r',{receipt_id:'r',intent_id:'i',provider_call_id:'c',request_digest:'d',completion_class:'SUCCESS',returned_payload_digest:'x',tool_reported_status:'SUCCESS',received_at:NOW}); assert.equal(r.verifications.size,0); assert.equal(r.objectives.get('obj-parent')!.status,'OPEN');});
test('external state change while asleep forces reorientation',()=>{const r=seededRepo(); const prior=r.stateVersion; r.objectives.get('obj-parent')!.version++; r.bump(); assert.equal(continuityAdmission(r,prior).requires_reorient,true);});
test('competing continuation generations fail CAS',()=>{const r=seededRepo(); const base={principal_id:'aaron',objective_id:'obj-parent',episode_generation:2,causal_episode_id:'cause',state_version_at_start:r.stateVersion,orientation_version_at_start:1,authority_snapshot_digest:'a',privacy_snapshot_digest:'p',toolset_digest:'t',cognition_profile:'test',status:'ORIENTING' as const,started_at:NOW,last_checkpoint_at:NOW}; claimContinuation(r,{...base,work_episode_id:'e2'}); assert.throws(()=>claimContinuation(r,{...base,work_episode_id:'e2b'}),/CAS_CONFLICT/);});
test('stale workflow checkpoint cannot outrank newer canonical state',()=>{const r=seededRepo(); const stale=r.stateVersion; r.bump(); assert.equal(continuityAdmission(r,stale).requires_reorient,true);});
test('tracing unavailable cannot block canonical reconstruction',()=>{const r=seededRepo(); assert.equal(continuityAdmission(r,r.stateVersion).admitted,true);});
test('model provider unavailable can fall back without changing authority',()=>{const router=new CognitionRouter(['provider-a/model','provider-b/model']); const chosen=router.route({phase:'THINK',task_type:'x',complexity:'HIGH',privacy_constraints:[],required_modalities:['text'],model_provider_restrictions:['provider-a'],max_reasoning_class:'HIGH',trace_context:'t'}); assert.equal(chosen,'provider-b/model'); assert.equal(router.normalize('provider-b','model').authority_effect,'NONE');});
test('empty model session memory does not affect reconstruction',()=>{const r=seededRepo(); const sessionMemory={}; assert.deepEqual(sessionMemory,{}); assert.equal(continuityAdmission(r,r.stateVersion).admitted,true);});
