import test from 'node:test';import assert from 'node:assert/strict';
import {prepared,readback,verifyInput,closeInput,principal,T1,T2} from '../recovery/fixtures.ts';
import {install,config,request,routeInput,worker} from '../capability-integration/fixtures.ts';
import {intent,receipt} from '../enforcement/fixtures.ts';
import {digest} from '../../src/enforcement/contracts.ts';
import {bindQualifiedRelease,QualifiedProviderAdapter} from '../../src/capability/adapters.ts';
import {PersonalOffice,candidateInterface} from '../../src/personal-office/office.ts';
import {installPilot} from './fixtures.ts';
for(const mode of ['MEMORY','SQL'] as const)test(mode+' Personal Office composes B5 route -> B3 one-time release -> B4 actual readback/closure -> B6 Pilot without admission',async()=>{
 const conf=config(),landed:unknown[]=[];let routed:any=null;
 const s=await prepared(mode,'RELEASED_SUBMITTED',{i:intent({configuration_digest:digest(conf)})},async base=>{
  await install(base.repo.canonical);const office=new PersonalOffice(base.repo,principal,()=>T1);routed=await office.route(routeInput());assert.equal(routed.state,'ROUTED');assert.equal(routed.authority_effect,'NONE');
  const adapter=new QualifiedProviderAdapter({provider_id:conf.provider_id,tool_id:base.i.tool_id,operation:base.i.operation,configuration_digest:base.i.configuration_digest,capability_id:base.i.capability_id,qualification_id:base.i.qualification_id,credential_boundary:conf.tools[0]!.credential_boundary},{preflight:async()=>({ready:true}),submit:async(i,a)=>{landed.push(structuredClone(i.expected_effect));return receipt(i,a);}}),release=bindQualifiedRelease(base.repo,office.capabilities,worker,request(),adapter),call={intent:base.i,attempt:base.a,fence:base.c,retry:false};
  await Promise.all([release.release(call),release.release(call)]);await release.release({...call,retry:true});assert.equal(landed.length,1);
 });
 try{
  assert.equal(s.release.calls(),0);s.setObservation(readback(s,landed));const proof=await s.verifier.verify(verifyInput(s));assert.equal(proof.disposition,'EFFECT_VERIFIED');await s.recovery.reconcileClosure(closeInput(s));
  const data=await installPilot(s),office=new PersonalOffice(s.repo,principal,()=>T2),output=await candidateInterface(office,{interface_version:'IRIS_CANONICAL_PILOT_B6_V1',operation:'GET_PERSONAL_ATTENTION',request:data.request});
  assert.equal(output.projection.roots[0]!.primary_visible_disposition,'TERMINAL_RETAINED');assert.equal(output.projection.roots[1]!.primary_visible_disposition,'TERMINAL_RETAINED');assert.equal(output.projection.completeness_state,'COMPLETE_FOR_DECLARED_SCOPE');assert.equal(output.projection.recovery_completeness,'COMPLETE_FOR_DECLARED_SCOPE');assert.equal(output.projection.work_routing[0]!.release_state,'RELEASED_SUBMITTED');assert.equal(output.continuity_ON,false);assert.equal(output.authority_effect,'NONE');assert.equal(output.admission,'NOT_ADJUDICATED');assert.equal(landed.length,1);assert.equal((await office.reconstruct(T2)).recovery.admission,'RECOVERY_EVIDENCE_PASS');
 }finally{await s.close();}
});
