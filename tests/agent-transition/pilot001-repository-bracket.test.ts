import test from 'node:test';
import assert from 'node:assert/strict';
import {PostgresTransitionProjectionRepository} from '../../src/agent-transition/transition-repository.ts';
for(const name of ['stable','one drift','repeated drift','malformed decoder','forged completeness'])test('legacy SQL '+name+' fails before SQL or decoder invocation',()=>{let sqlCalls=0,decoderCalls=0;assert.throws(()=>new PostgresTransitionProjectionRepository({query:async()=>{sqlCalls++;return [];}},{decode:()=>{decoderCalls++;throw new Error('DECODER_MUST_NOT_RUN');}},()=> '2026-10-01T02:00:00.000Z'),/^Error: B6_CANONICAL_PILOT_REQUIRED$/);assert.equal(sqlCalls,0);assert.equal(decoderCalls,0);});
