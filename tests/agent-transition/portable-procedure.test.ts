import test from 'node:test';import assert from 'node:assert/strict';import {loadProcedure} from '../../src/agent-transition/portable-procedure.ts';
const p={procedure_id:'p',qualified:true,provider_compatibility:['A'],tool_refs:['t']};
test('T95 loading procedure grants no tool or authority access',()=>assert.deepEqual(loadProcedure(p,'A').tool_authority,[]));
test('T96 superseded/retired/unqualified procedure rejected',()=>assert.throws(()=>loadProcedure({...p,retired_at:'2026'},'A'),/NOT_QUALIFIED/));
test('T97 provider substitution preserves compatibility or fails',()=>assert.throws(()=>loadProcedure(p,'B'),/INCOMPATIBLE/));