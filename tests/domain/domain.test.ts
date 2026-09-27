import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRepo } from '../helpers.ts';
import { projectAaronCurrent } from '../../src/state/projections.ts';
import { recordCandidateLearning } from '../../src/runtime/learn.ts';

test('evidence occurrences are immutable',()=>{const r=seededRepo(); assert.throws(()=>r.appendEvidence(r.evidence.get('ev-1')!),/IMMUTABLE/);});
test('current advances without overwriting history',()=>{const r=seededRepo(); r.publishCurrent({assertion_id:'assert-2',subject_ref:'fixture:source',predicate:'status',value:'COMPLETE',effective_from:'2026-09-27T12:01:00.000Z',source_occurrence_refs:['ev-1'],qualification:'VERIFIED',freshness:'FRESH',coverage:'COMPLETE',uncertainty:[],version:2,invalidated_by_refs:[]}); const h=r.currentHistory('fixture:source','status'); assert.equal(h.length,2); assert.equal(h[0]!.value,'READY'); assert.equal(r.getActiveCurrent('fixture:source','status')!.value,'COMPLETE');});
test('derived projection is explicitly noncanonical',()=>{const p=projectAaronCurrent(seededRepo()); assert.equal(p.noncanonical,true);});
test('one experience produces only candidate learning',()=>{const l=recordCandidateLearning('e1',['v1'],'lesson'); assert.equal(l.qualification_state,'CANDIDATE'); assert.ok(l.alternative_explanations.length>0);});
