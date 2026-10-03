import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { seededRepo, NOW, fixtureIntent } from '../helpers.ts';
import { exportLegacySnapshot } from '../../src/state/legacy-repository.ts';

function runCase(caseName:string,mutate?:(repo:ReturnType<typeof seededRepo>)=>number|void) {
  const repo=seededRepo();
  const prior=repo.stateVersion;
  const maybe=mutate?.(repo);
  const priorStateVersion=typeof maybe==='number'?maybe:prior;
  const path=join(tmpdir(),`iris-${randomUUID()}.json`);
  writeFileSync(path,JSON.stringify({snapshot:exportLegacySnapshot(repo),priorStateVersion}));
  try {
    const r=spawnSync(process.execPath,['--experimental-strip-types','scripts/fresh-runtime-probe.ts',path,caseName],{encoding:'utf8'});
    assert.equal(r.status,0,`${caseName}: ${r.stderr} ${r.stdout}`);
    const out=JSON.parse(r.stdout);
    assert.equal(out.passed,true);
    return out;
  } finally { unlinkSync(path); }
}
test('fresh process R1_CLEAN_CONTINUATION',()=>runCase('R1_CLEAN_CONTINUATION'));
test('fresh process R2_CURRENT_CHANGED_AFTER_INTERRUPTION',()=>runCase('R2_CURRENT_CHANGED_AFTER_INTERRUPTION',repo=>{const before=repo.stateVersion; repo.publishCurrent({assertion_id:'a2',subject_ref:'fixture:source',predicate:'status',value:'UPDATED',effective_from:'2026-09-27T12:01:00.000Z',source_occurrence_refs:['ev-1'],qualification:'VERIFIED',freshness:'FRESH',coverage:'COMPLETE',uncertainty:[],version:2,invalidated_by_refs:[]}); return before;}));
test('fresh process R3_CONFLICTING_EVIDENCE',()=>runCase('R3_CONFLICTING_EVIDENCE',repo=>{repo.publishCurrent({assertion_id:'a2',subject_ref:'fixture:source',predicate:'status',value:'UNKNOWN',effective_from:'2026-09-27T12:01:00.000Z',source_occurrence_refs:['ev-1'],qualification:'CONFLICT',freshness:'FRESH',coverage:'CONFLICT',uncertainty:['conflict'],version:2,invalidated_by_refs:[]});}));
test('fresh process R4_MISSING_SOURCE',()=>runCase('R4_MISSING_SOURCE'));
test('fresh process R5_AMBIGUOUS_EXTERNAL_EFFECT',()=>runCase('R5_AMBIGUOUS_EXTERNAL_EFFECT',repo=>{repo.verifications.set('v1',{verification_id:'v1',intent_id:'i1',disposition:'AMBIGUOUS_EFFECT',evidence_refs:[],verified_at:NOW,notes:[]});}));
test('fresh process R6_OPEN_OBLIGATION_NO_CONVERSATION',()=>runCase('R6_OPEN_OBLIGATION_NO_CONVERSATION'));
test('fresh process R7_PRESERVED_AUTHORITY_STATE',()=>runCase('R7_PRESERVED_AUTHORITY_STATE'));
test('fresh process R8_HISTORY_SURVIVES_NEW_CURRENT',()=>runCase('R8_HISTORY_SURVIVES_NEW_CURRENT',repo=>{repo.publishCurrent({assertion_id:'a2',subject_ref:'fixture:source',predicate:'status',value:'DONE',effective_from:'2026-09-27T12:01:00.000Z',source_occurrence_refs:['ev-1'],qualification:'VERIFIED',freshness:'FRESH',coverage:'COMPLETE',uncertainty:[],version:2,invalidated_by_refs:[]});}));

for (const caseName of ["R9_INTENT_ONLY","R10_RECEIPT_WITHOUT_VERIFICATION"]) {
  test(`fresh process ${caseName}`,()=>{
    const out=runCase(caseName,repo=>{
      const intent=fixtureIntent();
      repo.intents.set(intent.intent_id,intent);
      if (caseName==="R10_RECEIPT_WITHOUT_VERIFICATION") repo.receipts.set("receipt-1",{receipt_id:"receipt-1",intent_id:intent.intent_id,provider_call_id:"call-1",request_digest:"d",completion_class:"SUCCESS",returned_payload_digest:"x",tool_reported_status:"SUCCESS",received_at:NOW});
      return repo.bump();
    });
    assert.equal(out.detail.admitted,false);
    assert.equal(out.detail.reason,"RECONCILIATION_REQUIRED");
    assert.deepEqual(out.detail.unresolved_effect_intent_ids,["intent-1"]);
  });
}
