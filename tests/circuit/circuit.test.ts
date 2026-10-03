import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRepo, fixtureIntent, NOW } from '../helpers.ts';
import { ActionFixtureAdapter } from '../../src/tools/action-fixture-adapter.ts';
import { runBoundedCircuit } from '../../src/runtime/iris-workflow.ts';

const contract={tool_id:'fixture.action',authority_scope:'fixture.write',privacy_scope:'fixture.non_sensitive',retry_classification:'IDEMPOTENT_BY_KEY' as const,external:true};

for(const applyEffect of [true,false])test(`V0 circuit is retired before release/closure (fixture effect ${applyEffect})`,async()=>{
 const r=seededRepo(),f=new ActionFixtureAdapter({status:'READY'},applyEffect),before=r.stateVersion;
 const out=await runBoundedCircuit({repo:r,principalId:'aaron',objectiveId:'obj-parent',obligationId:'obl-1',episodeId:'episode-1',subjectRef:'fixture:source',predicate:'status',actionScope:'fixture.write',privacyScope:'fixture.non_sensitive',intent:fixtureIntent(),contract,executor:f,fixtureRead:()=>f.read(),expectedEffect:{status:'COMPLETE'},now:NOW});
 assert.equal(out.status,'HOLD_CANONICAL_RELEASE_REQUIRED');assert.equal(f.calls.length,0);assert.deepEqual(f.read(),{status:'READY'});assert.equal(r.stateVersion,before);assert.equal(r.objectives.get('obj-parent')!.status,'OPEN');assert.equal(r.obligations.get('obl-1')!.status,'OPEN');
});
