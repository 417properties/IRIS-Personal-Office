import test from 'node:test';import assert from 'node:assert/strict';import {qualifyResearchWorkerResult} from '../../src/agent-transition/research-worker.ts';
const x={worker_identity_id:'wrk1',provider_ref:'provider',evidence_refs:['e'],artifact_ref:'a',external_effect_count:0 as const,authority_effect:'NONE' as const};
test('T72/T73 legacy provider result cannot self-qualify or mutate Current',()=>assert.throws(()=>qualifyResearchWorkerResult(x),/B5_CANONICAL_WORKER_QUALIFICATION_REQUIRED/));
test('T74 replacement worker label cannot inherit prior qualification',()=>assert.throws(()=>qualifyResearchWorkerResult({...x,worker_identity_id:'wrk2'}),/B5_CANONICAL_WORKER_QUALIFICATION_REQUIRED/));
