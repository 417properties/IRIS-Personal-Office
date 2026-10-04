import {CapabilityService} from '../capability/service.ts';
import {B5,same,withCapabilityContext} from '../capability/context.ts';
import {decodeConfiguration,decodeRequest,qualifyCapability} from '../capability/qualification.ts';
import {decodeReference} from '../domain/canonical.ts';
import {digest} from '../enforcement/contracts.ts';
import {IccpService,type Wire} from '../interop/iccp.ts';
import {decodeIdentity,type Identity} from '../semantic-kernel/identity.ts';
import {freeze,demand,record,text,member,evidence} from '../semantic-kernel/validation.ts';
import {jsonValue,denseArray} from '../domain/json.ts';
// N1/N2 observations circulate through ICCP filtration. N3 is rebuilt from B2
// qualifications. N4 control is deliberately absent: an observation callback
// cannot instantiate, resume, release, revoke, or change canonical state.
export class PersonalNervousSystem {
 readonly capabilities:CapabilityService;readonly communication:IccpService;
 constructor(capabilities:CapabilityService,communication:IccpService){demand(capabilities.repository===communication.repository&&same(capabilities.principal,communication.principal),'B5_NERVOUS_CANONICAL_OWNER');this.capabilities=capabilities;this.communication=communication;}
 async observe(input:unknown){
  const r=record(input,['envelope','signal']),signal=record(r.signal,['type','subject','configuration_digest','values']),captured=freeze({type:member(signal.type,['HEALTH','LATENCY','RESOURCE_USE','FAILURE','WAIT_WAKE','CONTEXT_FAILURE','VERIFICATION_SIGNAL','MODE_PROVIDER_SWITCH']),subject:decodeIdentity(signal.subject),configuration_digest:text(signal.configuration_digest),values:jsonValue(signal.values)}),received=await this.communication.receive(r.envelope);
  demand(received.meaning.transition==='NO_DELTA'&&received.meaning.consequence==='OBSERVATION_ONLY','B5_OBSERVATION_CONTROL_SEPARATION');
  demand(same(received.meaning.optional_extensions.N1,captured)&&received.meaning.required_extensions.includes('N1'),'B5_NERVOUS_SIGNAL_BINDING');
  return withCapabilityContext(this.capabilities.repository,this.capabilities.principal,received.as_of,async c=>{demand(c.snapshot_digest===received.snapshot_digest,'B5_NERVOUS_RECEIPT_STATE_CHANGED');const config=decodeConfiguration((await c.current(captured.subject,'CONFIGURATION')).value);demand(same(received.meaning.actor,captured.subject)&&digest(config)===captured.configuration_digest,'B5_NERVOUS_CONFIGURATION_BINDING');return {schema_version:B5,signal:captured,occurrence_key:received.occurrence_key,delivery_attempt:received.delivery_attempt,qualified_functional_claim:false,diagnosis:'NOT_ADJUDICATED',control:false,authority_effect:'NONE',current_mutation:false};});
 }
 async substrate(input:unknown){const r=record(input,['subject','qualification_id','request']),captured=freeze({subject:decodeIdentity(r.subject),qualification_id:text(r.qualification_id),request:decodeRequest(r.request)});return withCapabilityContext(this.capabilities.repository,this.capabilities.principal,this.capabilities.asOf(),async c=>{
  const q=await qualifyCapability(c,captured.subject,captured.qualification_id,captured.request),source=await c.current(q.subject,'SUBSTRATE'),s=record(source.value,['schema_version','subject','configuration_digest','sponsor','purpose','return_destination','work_refs','obligation_refs','authority_refs','privacy_refs','recovery_refs','evidence_refs']);demand(s.schema_version===B5&&same(s.subject,q.subject)&&s.configuration_digest===q.configuration_digest,'B5_SUBSTRATE_BINDING');text(s.purpose);const sponsor=decodeIdentity(s.sponsor),destination=decodeIdentity(s.return_destination);demand(sponsor.kind==='PRINCIPAL'&&destination.kind==='PRINCIPAL','B5_SUBSTRATE_SPONSOR_RETURN');await c.registered(sponsor);await c.registered(destination);evidence(denseArray(s.evidence_refs));
  for(const name of ['work_refs','obligation_refs','authority_refs','privacy_refs','recovery_refs'])for(const ref of denseArray(s[name]).map(decodeReference))await c.reference(ref);
  return {schema_version:B5,subject:q.subject,role:q.configuration.role,configuration:q.configuration,qualification:q,substrate:s,health:'NOT_INFERRED_FROM_CAPABILITY',continuation:'RECONSTRUCT_WITH_B3_B4',authority:'VALIDATE_WITH_B3',derived:true,rebuildable:true,authority_effect:'NONE',continuity_ON:false};
 });}
}
// Group transport attempts without manufacturing new independent experience.
// Durable consequential dedup remains B3; this derived grouping is not dispatch.
export function groupCirculation(input:readonly {occurrence_key:string;delivery_attempt:number}[]){const groups=new Map<string,number[]>();for(const v of denseArray(input)){const r=record(v,['occurrence_key','delivery_attempt']),key=text(r.occurrence_key);demand(Number.isSafeInteger(r.delivery_attempt)&&(r.delivery_attempt as number)>0,'B5_DELIVERY_ATTEMPT');groups.set(key,[...(groups.get(key)??[]),r.delivery_attempt as number]);}return freeze([...groups].map(([occurrence_key,attempts])=>({occurrence_key,attempts,experience_count:1,authority_effect:'NONE'})));}
export type {Wire,Identity};
