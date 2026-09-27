import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAuthority } from '../../src/domain/authority.ts';
import { evaluatePrivacy } from '../../src/domain/privacy.ts';
import { wrapMcpTool } from '../../src/tools/mcp-adapter.ts';
import { seededRepo, NOW, fixtureIntent } from '../helpers.ts';
import { runBoundedCircuit } from "../../src/runtime/iris-workflow.ts";
import { act } from "../../src/runtime/act.ts";
import { exportCanonicalSnapshot } from "../../src/state/repository.ts";
import { ActionFixtureAdapter } from "../../src/tools/action-fixture-adapter.ts";
import type { ToolContract } from "../../src/tools/tool-contract.ts";

test('predicted preference only cannot authorize',()=>{const p=[{policy_id:'p',principal_id:'aaron',basis_type:'PREDICTED_PREFERENCE' as const,scopes:['buy'],valid_from:'2026-01-01T00:00:00.000Z',source_ref:'prediction',version:1}]; assert.equal(evaluateAuthority(p,'buy',NOW),'REQUIRES_EXPLICIT_AARON_DECISION');});
test('standing authorization outside scope blocked',()=>{const r=seededRepo(); assert.equal(evaluateAuthority([...r.authorityPolicies.values()],'other',NOW),'UNKNOWN');});
test('expired standing authorization blocked',()=>{const r=seededRepo(); const p=r.authorityPolicies.get('auth-1')!; p.valid_to='2026-09-01T00:00:00.000Z'; assert.equal(evaluateAuthority([p],'fixture.write',NOW),'UNKNOWN');});
test('explicit current Aaron decision in scope allowed',()=>{assert.equal(evaluateAuthority([],'fixture.write',NOW,['fixture.write']),'AUTHORIZED_WITHIN_STANDING_SCOPE');});
test('authority UNKNOWN blocks consequential action',()=>{assert.equal(evaluateAuthority([],'legal.contract',NOW),'UNKNOWN');});
test('privacy UNKNOWN blocks disclosure',()=>{assert.equal(evaluatePrivacy([],'sensitive.external',NOW),'UNKNOWN');});
test('MCP tool presence creates no authority',()=>{const t=wrapMcpTool({name:'send-message'},'message.send','private'); assert.equal(t.authority_scope,'message.send'); assert.equal(t.external,true);});
test('prior success does not create standing authority',()=>{const r=seededRepo(); r.receipts.set('old',{receipt_id:'old',intent_id:'old-i',provider_call_id:'c',request_digest:'d',completion_class:'SUCCESS',returned_payload_digest:'x',tool_reported_status:'SUCCESS',received_at:NOW}); assert.equal(evaluateAuthority([...r.authorityPolicies.values()],'new.scope',NOW),'UNKNOWN');});



const fixtureContract:ToolContract={tool_id:"fixture.action",authority_scope:"fixture.write",privacy_scope:"fixture.non_sensitive",retry_classification:"IDEMPOTENT_BY_KEY",external:true};
const mismatches:[string,Partial<ToolContract>][]=[
  ["authority scope",{authority_scope:"legal.contract"}],
  ["privacy scope",{privacy_scope:"sensitive.external"}],
  ["retry class",{retry_classification:"NON_IDEMPOTENT_UNSAFE"}],
  ["tool identity",{tool_id:"different.tool"}],
  ["combined Professor falsifier",{authority_scope:"legal.contract",privacy_scope:"sensitive.external",retry_classification:"NON_IDEMPOTENT_UNSAFE"}]
];
for (const [name,override] of mismatches) {
  test(`circuit ${name} mismatch blocks before persistence and execution`,async()=>{
    const repo=seededRepo();
    const before=exportCanonicalSnapshot(repo);
    const fixture=new ActionFixtureAdapter({status:"READY"},true);
    let calls=0;
    const out=await runBoundedCircuit({repo,principalId:"aaron",objectiveId:"obj-parent",obligationId:"obl-1",episodeId:"episode-1",subjectRef:"fixture:source",predicate:"status",actionScope:"fixture.write",privacyScope:"fixture.non_sensitive",intent:fixtureIntent(),contract:{...fixtureContract,...override},executor:{execute:async intent=>{calls++;return fixture.execute(intent);}},fixtureRead:()=>fixture.read(),expectedEffect:{status:"COMPLETE"},now:NOW});
    assert.equal(calls,0);
    assert.equal(out.status,"HOLD_TOOL_CONTRACT_MISMATCH");
    assert.equal(repo.intents.size,0);
    assert.equal(repo.receipts.size,0);
    assert.equal(repo.verifications.size,0);
    assert.equal(repo.objectives.get("obj-parent")!.status,"OPEN");
    assert.equal(repo.obligations.get("obl-1")!.status,"OPEN");
    assert.deepEqual(fixture.read(),{status:"READY"});
    assert.equal(exportCanonicalSnapshot(repo),before);
  });
  test(`act ${name} mismatch independently blocks executor invocation`,async()=>{
    let calls=0;
    const fixture=new ActionFixtureAdapter({status:"READY"},true);
    await assert.rejects(()=>act(fixtureIntent(),{...fixtureContract,...override},{execute:async intent=>{calls++;return fixture.execute(intent);}},"fixture.write","fixture.non_sensitive"),/TOOL_CONTRACT_MISMATCH/);
    assert.equal(calls,0);
    assert.deepEqual(fixture.read(),{status:"READY"});
  });
}
for (const scope of ["authority","privacy"] as const) {
  test(`matching but UNKNOWN contract ${scope} scope still fails closed`,async()=>{
    const repo=seededRepo();
    const before=exportCanonicalSnapshot(repo);
    const contract={...fixtureContract,...(scope==="authority"?{authority_scope:"legal.contract"}:{privacy_scope:"sensitive.external"})};
    const fixture=new ActionFixtureAdapter({status:"READY"},true);
    let calls=0;
    const out=await runBoundedCircuit({repo,principalId:"aaron",objectiveId:"obj-parent",obligationId:"obl-1",episodeId:"episode-1",subjectRef:"fixture:source",predicate:"status",actionScope:contract.authority_scope,privacyScope:contract.privacy_scope,intent:fixtureIntent(),contract,executor:{execute:async intent=>{calls++;return fixture.execute(intent);}},fixtureRead:()=>fixture.read(),expectedEffect:{status:"COMPLETE"},now:NOW});
    assert.equal(out.status,scope==="authority"?"HOLD_AUTHORITY":"HOLD_PRIVACY");
    assert.equal(calls,0);
    assert.equal(exportCanonicalSnapshot(repo),before);
  });
}
