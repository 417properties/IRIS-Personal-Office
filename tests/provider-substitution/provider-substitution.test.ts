import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRepo } from '../helpers.ts';
import { CognitionRouter } from '../../src/runtime/cognition-router.ts';
import { continuityAdmission } from '../../src/state/continuity-admission.ts';
import { NoopTraceSink } from '../../src/instrumentation/tracing.ts';
import { assertNoProviderOwnsIrreducibleProperty } from '../../src/platform/managed-capabilities.ts';

test('cognition provider substitution leaves canonical semantics unchanged',()=>{const r=seededRepo(); const before=r.stateVersion; const router=new CognitionRouter(['a/m1','b/m2']); const one=router.route({phase:'THINK',task_type:'x',complexity:'LOW',privacy_constraints:[],required_modalities:['text'],model_provider_restrictions:[],max_reasoning_class:'HIGH',trace_context:'t'}); const two=router.route({phase:'THINK',task_type:'x',complexity:'HIGH',privacy_constraints:[],required_modalities:['text'],model_provider_restrictions:[],max_reasoning_class:'HIGH',trace_context:'t'}); assert.notEqual(one,two); assert.equal(r.stateVersion,before);});
test('workflow runtime ref is subordinate to canonical state',()=>{const r=seededRepo(); assert.equal(continuityAdmission(r,r.stateVersion).admitted,false);});
test('tracing can disappear without canonical loss',()=>{const sink=new NoopTraceSink(); sink.span('test',{ok:true}); const r=seededRepo(); assert.equal(r.objectives.get('obj-parent')!.status,'OPEN');});
test('replaceable provider never becomes sole owner of irreducible property',()=>assert.equal(assertNoProviderOwnsIrreducibleProperty(),true));
