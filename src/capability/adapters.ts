import {CapabilityService} from './service.ts';
import {decodeRequest,type CapabilityRequest} from './qualification.ts';
import {same} from './context.ts';
import {ReleaseService,consumeSubmissionPermit,type EnforcementRepository,type SubmissionReceipt,type SubmissionPermit} from '../enforcement/repository.ts';
import {decodeIntent,type ReleaseIntent} from '../enforcement/contracts.ts';
import {decodeIdentity,type Identity} from '../semantic-kernel/identity.ts';
import {freeze,demand,record,text} from '../semantic-kernel/validation.ts';
export interface TrustedToolAdapter {
 readonly binding:{provider_id:string;tool_id:string;operation:string;configuration_digest:string;capability_id:string;qualification_id:string;credential_boundary:string};
 preflight(intent:Readonly<ReleaseIntent>):Promise<{ready:true}|{ready:false;evidence_refs:string[]}>;
 submit(intent:Readonly<ReleaseIntent>,attempt:Identity,permit:SubmissionPermit):Promise<SubmissionReceipt>;
}
export class QualifiedProviderAdapter implements TrustedToolAdapter {
 readonly binding:TrustedToolAdapter['binding'];#preflight:TrustedToolAdapter['preflight'];#submit:(intent:Readonly<ReleaseIntent>,attempt:Identity,dispatch_id:string)=>Promise<SubmissionReceipt>;
 constructor(binding:TrustedToolAdapter['binding'],callbacks:{preflight:TrustedToolAdapter['preflight'];submit:(intent:Readonly<ReleaseIntent>,attempt:Identity,dispatch_id:string)=>Promise<SubmissionReceipt>}){
  const r=record(binding,['provider_id','tool_id','operation','configuration_digest','capability_id','qualification_id','credential_boundary']);this.binding=freeze(Object.fromEntries(Object.entries(r).map(([k,v])=>[k,text(v)]))) as TrustedToolAdapter['binding'];this.#preflight=callbacks.preflight;this.#submit=callbacks.submit;Object.freeze(this);
 }
 preflight(intent:Readonly<ReleaseIntent>){return this.#preflight(decodeIntent(intent));}
 submit(intent:Readonly<ReleaseIntent>,attempt:Identity,permit:SubmissionPermit){const captured=decodeIntent(intent),a=decodeIdentity(attempt),dispatch=consumeSubmissionPermit(permit,captured,a);return this.#submit(captured,a,dispatch);}
}
// Adapter registration is execution wiring, not trust by name or credential
// possession. Both actual wiring and Current qualification must match; B3 still
// exclusively owns total A3 validation, fencing, durable one-time release/retry.
export function bindQualifiedRelease(repo:EnforcementRepository,capabilities:CapabilityService,subjectInput:Identity,request:CapabilityRequest,adapter:QualifiedProviderAdapter){
 demand(adapter instanceof QualifiedProviderAdapter,'B5_GUARDED_PROVIDER_ADAPTER_REQUIRED');demand(capabilities.repository===repo.canonical,'B5_ADAPTER_SAME_CANONICAL_OWNER');const subject=freeze(decodeIdentity(subjectInput)),req=decodeRequest(request),r=record(adapter.binding,['provider_id','tool_id','operation','configuration_digest','capability_id','qualification_id','credential_boundary']),binding=freeze(Object.fromEntries(Object.entries(r).map(([k,v])=>[k,text(v)]))) as TrustedToolAdapter['binding'];
 const preflight=adapter.preflight.bind(adapter),submit=adapter.submit.bind(adapter);
 async function qualify(i:Readonly<ReleaseIntent>){
  const q=await capabilities.qualify(subject,binding.qualification_id,req),config=q.configuration;demand(same(binding,adapter.binding),'B5_ADAPTER_WIRING_CHANGED');
  demand(config.provider_id===binding.provider_id&&q.configuration_digest===binding.configuration_digest&&q.capability_id===binding.capability_id&&q.qualification_id===binding.qualification_id&&config.tools.some(t=>t.tool_id===binding.tool_id&&t.operation===binding.operation&&t.credential_boundary===binding.credential_boundary),'B5_TRUSTED_ADAPTER_BINDING');
  demand(same(i.incarnation,subject)&&same(i.grantee,subject)&&same(i.privacy.recipient,config.provider_principal)&&i.configuration_digest===q.configuration_digest&&i.capability_id===q.capability_id&&i.qualification_id===q.qualification_id&&i.role===config.role&&i.tool_id===binding.tool_id&&i.operation===binding.operation,'B5_INTENT_CAPABILITY_BINDING');return q;
 }
 return new ReleaseService(repo,{binding:{tool_id:binding.tool_id,configuration_digest:binding.configuration_digest,capability_id:binding.capability_id,qualification_id:binding.qualification_id},preflight:async i=>{await qualify(i);return preflight(i);},submit:async(i,a,permit)=>{
  const captured=decodeIntent(i);await qualify(captured);return submit(captured,a,permit);
 }},{principal:capabilities.principal,grantee:subject,incarnation:subject,configuration_digest:binding.configuration_digest});
}
