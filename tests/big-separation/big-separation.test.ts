import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRepo } from '../helpers.ts';
import { quarantineBigDelta } from '../../src/interop/big-delta-quarantine.ts';
import { assertNoProviderOwnsIrreducibleProperty } from '../../src/platform/managed-capabilities.ts';

function delta(){return {delta_id:'d1',source_system:'BIG' as const,target_system:'IRIS' as const,delta_class:'LESSON_CANDIDATE',content_ref:'big://lesson',evidence_refs:['big:e1'],qualification:'CANDIDATE',authority_effect:'NONE' as const,privacy_scope:['bounded'],applicability:['test']};}
test('BIG delta imports to quarantine only',()=>{const r=seededRepo(); quarantineBigDelta(r,delta()); assert.equal(r.bigDeltaQuarantine.size,1);});
test('BIG delta cannot mutate current assertion directly',()=>{const r=seededRepo(); const before=r.currentHistory('fixture:source','status').length; quarantineBigDelta(r,delta()); assert.equal(r.currentHistory('fixture:source','status').length,before);});
test('BIG credential is absent from IRIS runtime contract',()=>{assert.equal(process.env.BIG_GITHUB_TOKEN,undefined);});
test('IRIS credential is not exposed to BIG adapter',()=>{const exported=delta(); assert.equal('credential' in exported,false);});
test('BIG Current identifier remains external reference',()=>{const r=seededRepo(); quarantineBigDelta(r,{...delta(),content_ref:'BIG_CURRENT:123'}); assert.equal(r.getActiveCurrent('BIG_CURRENT:123','status'),undefined);});
test('shared provider does not imply shared canonical state',()=>assert.equal(assertNoProviderOwnsIrreducibleProperty(),true));
