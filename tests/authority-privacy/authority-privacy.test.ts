import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAuthority } from '../../src/domain/authority.ts';
import { evaluatePrivacy } from '../../src/domain/privacy.ts';
import { wrapMcpTool } from '../../src/tools/mcp-adapter.ts';
import { seededRepo, NOW } from '../helpers.ts';

test('predicted preference only cannot authorize',()=>{const p=[{policy_id:'p',principal_id:'aaron',basis_type:'PREDICTED_PREFERENCE' as const,scopes:['buy'],valid_from:'2026-01-01T00:00:00.000Z',source_ref:'prediction',version:1}]; assert.equal(evaluateAuthority(p,'buy',NOW),'REQUIRES_EXPLICIT_AARON_DECISION');});
test('standing authorization outside scope blocked',()=>{const r=seededRepo(); assert.equal(evaluateAuthority([...r.authorityPolicies.values()],'other',NOW),'UNKNOWN');});
test('expired standing authorization blocked',()=>{const r=seededRepo(); const p=r.authorityPolicies.get('auth-1')!; p.valid_to='2026-09-01T00:00:00.000Z'; assert.equal(evaluateAuthority([p],'fixture.write',NOW),'UNKNOWN');});
test('explicit current Aaron decision in scope allowed',()=>{assert.equal(evaluateAuthority([],'fixture.write',NOW,['fixture.write']),'AUTHORIZED_WITHIN_STANDING_SCOPE');});
test('authority UNKNOWN blocks consequential action',()=>{assert.equal(evaluateAuthority([],'legal.contract',NOW),'UNKNOWN');});
test('privacy UNKNOWN blocks disclosure',()=>{assert.equal(evaluatePrivacy([],'sensitive.external',NOW),'UNKNOWN');});
test('MCP tool presence creates no authority',()=>{const t=wrapMcpTool({name:'send-message'},'message.send','private'); assert.equal(t.authority_scope,'message.send'); assert.equal(t.external,true);});
test('prior success does not create standing authority',()=>{const r=seededRepo(); r.receipts.set('old',{receipt_id:'old',intent_id:'old-i',provider_call_id:'c',request_digest:'d',completion_class:'SUCCESS',returned_payload_digest:'x',tool_reported_status:'SUCCESS',received_at:NOW}); assert.equal(evaluateAuthority([...r.authorityPolicies.values()],'new.scope',NOW),'UNKNOWN');});
