import test from 'node:test';import assert from 'node:assert/strict';import {loadProcedure} from '../../src/agent-transition/portable-procedure.ts';
const p={procedure_id:'p',qualified:true,provider_compatibility:['A'],tool_refs:['t']};
test('T95 legacy procedure badge grants no tool or authority access',()=>assert.throws(()=>loadProcedure(p,'A'),/B5_CANONICAL_PROCEDURE_QUALIFICATION_REQUIRED/));
test('T96 superseded/retired/unqualified labels cannot bypass canonical qualification',()=>assert.throws(()=>loadProcedure({...p,retired_at:'2026'},'A'),/B5_CANONICAL_PROCEDURE_QUALIFICATION_REQUIRED/));
test('T97 provider substitution requires actual configuration compatibility',()=>assert.throws(()=>loadProcedure(p,'B'),/B5_CANONICAL_PROCEDURE_QUALIFICATION_REQUIRED/));
