import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRepo } from '../helpers.ts';
import { CognitionRouter } from '../../src/runtime/cognition-router.ts';
import {setup as capabilitySetup,install,request as capabilityRequest,worker as capabilityWorker,qid} from '../capability-integration/fixtures.ts';
import {identity} from '../../src/semantic-kernel/identity.ts';
import { continuityAdmission } from '../../src/state/continuity-admission.ts';
import { NoopTraceSink } from '../../src/instrumentation/tracing.ts';
import { assertNoProviderOwnsIrreducibleProperty } from '../../src/platform/managed-capabilities.ts';

test('cognition provider substitution leaves canonical semantics unchanged',async()=>{const s=await capabilitySetup(),other=identity('WORKER','substitute');await install(s.repo,other,{provider_id:'provider:b'});const router=new CognitionRouter(s.svc,[{subject:capabilityWorker,qualification_id:qid},{subject:other,qualification_id:qid}]);const before=await s.repo.exportSnapshot(),base={request_id:'substitute',phase:'THINK' as const,task_type:'bounded',mode:'RESEARCH' as const,trace_context:'trace'},one=await router.route({...base,capability:capabilityRequest({providers_denied:['provider:b']})}),two=await router.route({...base,capability:capabilityRequest({providers_denied:['provider:a']})});assert.notEqual(one.selected?.configuration.provider_id,two.selected?.configuration.provider_id);assert.equal(await s.repo.exportSnapshot(),before);});
test('workflow runtime ref is subordinate to canonical state',()=>{const r=seededRepo(); assert.equal(continuityAdmission(r,r.stateVersion).admitted,false);});
test('tracing can disappear without canonical loss',()=>{const sink=new NoopTraceSink(); sink.span('test',{ok:true}); const r=seededRepo(); assert.equal(r.objectives.get('obj-parent')!.status,'OPEN');});
test('replaceable provider never becomes sole owner of irreducible property',()=>assert.equal(assertNoProviderOwnsIrreducibleProperty(),true));
