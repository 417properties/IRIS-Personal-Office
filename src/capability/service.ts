import {B5,CapabilityContext,withCapabilityContext,same} from './context.ts';
import {decodeRequest,qualifyCapability,type CapabilityRequest,type QualifiedCapability} from './qualification.ts';
import {decodeDisclosure,filterPrivacy,type DisclosureRequest} from './privacy.ts';
import {decodeReference,type Reference} from '../domain/canonical.ts';
import {decodeIdentity,type Identity} from '../semantic-kernel/identity.ts';
import {demand,record,freeze,text,member,evidence} from '../semantic-kernel/validation.ts';
import {denseArray,jsonValue} from '../domain/json.ts';
import {digest} from '../enforcement/contracts.ts';
import type {CanonicalRepository} from '../state/repository.ts';
import {rankSufficientConfigurations} from '../instrumentation/personal-bire.ts';
export class CapabilityService {
 readonly repository:CanonicalRepository;readonly principal:Identity;#clock:()=>string;
 constructor(repository:CanonicalRepository,principal:Identity,clock:()=>string=()=>new Date().toISOString()){this.repository=repository;this.principal=freeze(decodeIdentity(principal));this.#clock=clock;}
 asOf(){return this.#clock();}
 qualify(subject:Identity,qualification_id:string,request:CapabilityRequest){const s=freeze(decodeIdentity(subject)),q=text(qualification_id),req=decodeRequest(request),at=this.#clock();return withCapabilityContext(this.repository,this.principal,at,c=>qualifyCapability(c,s,q,req));}
 async loadProcedure(input:unknown){const r=record(input,['subject','qualification_id','request','provider_id']),captured=freeze({subject:decodeIdentity(r.subject),qualification_id:text(r.qualification_id),request:decodeRequest(r.request),provider_id:text(r.provider_id)}),q=await this.qualify(captured.subject,captured.qualification_id,captured.request);demand(q.configuration.provider_id===captured.provider_id,'B5_PROCEDURE_PROVIDER_BINDING');return freeze({procedure_id:q.procedure_id,procedure_version:q.procedure_version,configuration_digest:q.configuration_digest,loaded:true,tool_authority:[],authority_effect:'NONE',qualification:q});}
 async route(input:unknown){
  const r=record(input,['request_id','request','candidates','mode']),captured=freeze({request_id:text(r.request_id),request:decodeRequest(r.request),candidates:denseArray(r.candidates).map(v=>{const x=record(v,['subject','qualification_id']);return {subject:decodeIdentity(x.subject),qualification_id:text(x.qualification_id)};}),mode:member(r.mode,['CONVERSATION','VOICE','TRIAGE','RESEARCH','DEEP_ANALYSIS','DECISION_PREPARATION','ORCHESTRATION','DETERMINISTIC','VERIFICATION','LEARNING','COLD_RECONSTRUCTION'])});
  demand(captured.candidates.length<=64&&new Set(captured.candidates.map(v=>JSON.stringify(v.subject))).size===captured.candidates.length,'B5_BOUNDED_DISTINCT_CANDIDATES');
  return withCapabilityContext(this.repository,this.principal,this.#clock(),async c=>{
   const eligible:QualifiedCapability[]=[],holds:{subject:Identity;code:string}[]=[];
   for(const candidate of captured.candidates){try{eligible.push(await qualifyCapability(c,candidate.subject,candidate.qualification_id,captured.request));}catch(error){holds.push({subject:candidate.subject,code:error instanceof Error?error.message:'B5_UNKNOWN_HOLD'});}}
   const ranked=rankSufficientConfigurations(eligible),selected=ranked[0]??null;
   return {schema_version:B5,state:selected?'ROUTED':'ROUTE_UNAVAILABLE',request_id:captured.request_id,mode:captured.mode,selected,holds,eligibility_before_ranking:true,metabolism:selected?{cost_minor:selected.configuration.cost_minor,latency_ms:selected.configuration.latency_ms,resource_units:selected.configuration.resource_units,attention_units:selected.configuration.attention_units,reliability_ppm:selected.configuration.reliability_ppm}:null,snapshot_digest:c.snapshot_digest,principal:c.principal,authority_effect:'NONE',continuity_ON:false};
  });
 }
 async perceive(input:unknown){const r=record(input,['subject','qualification_id','request','observation_ref','perception_class','privacy']),captured=freeze({subject:decodeIdentity(r.subject),qualification_id:text(r.qualification_id),request:decodeRequest(r.request),observation_ref:decodeReference(r.observation_ref),perception_class:member(r.perception_class,['EPHEMERAL_WORKING','EVIDENCE_CANDIDATE']),privacy:decodeDisclosure(r.privacy)});
  return withCapabilityContext(this.repository,this.principal,this.#clock(),async c=>{
   const qualification=await qualifyCapability(c,captured.subject,captured.qualification_id,captured.request),row=await c.reference(captured.observation_ref);demand(qualification.dependencies.some(ref=>same(ref,captured.observation_ref)),'B5_OBSERVATION_OUTSIDE_QUALIFICATION');
   const output=(record(row.payload,['subject','predicate','value','epistemic']).value as Record<string,unknown>).output;demand(same(captured.privacy.payload,{output})&&same(captured.privacy.source_refs,[captured.observation_ref]),'B5_PERCEPTION_PAYLOAD_BINDING');
   const ephemeral=captured.perception_class==='EPHEMERAL_WORKING';demand(!ephemeral||!captured.privacy.retain,'B5_EPHEMERAL_RETENTION_FORBIDDEN');await filterPrivacy(c,captured.privacy);
   return {schema_version:B5,observation_ref:captured.observation_ref,qualified_evidence:true,persist:!ephemeral&&captured.privacy.retain,evidence:!ephemeral,current:false,authority_effect:'NONE',continuity_ON:false,functional_state:{subject:captured.subject,configuration_digest:qualification.configuration_digest,claim:'DEMONSTRATED_CAPABILITY',dimensions:qualification.dimensions,evidence_refs:qualification.evidence_refs,applicability:captured.request,invalidators:qualification.dependencies,derived:true,rebuildable:true,authority_effect:'NONE'}};
  });
 }
 async qualifyWorkerResult(input:unknown){const r=record(input,['subject','qualification_id','request','result','privacy']),captured=freeze({subject:decodeIdentity(r.subject),qualification_id:text(r.qualification_id),request:decodeRequest(r.request),result:jsonValue(r.result),privacy:decodeDisclosure(r.privacy)});
  return withCapabilityContext(this.repository,this.principal,this.#clock(),async c=>{const q=await qualifyCapability(c,captured.subject,captured.qualification_id,captured.request);demand(same(captured.privacy.payload,captured.result),'B5_WORKER_PAYLOAD_BINDING');const p=await filterPrivacy(c,captured.privacy);return {schema_version:B5,qualification:q,result:p.payload,result_truth:'NOT_ADJUDICATED',evidence_candidate:true,canonical_current_mutation:false,external_effect_count:0,authority_effect:'NONE',continuity_ON:false};});
 }
}
// Optional zero-effect local/provider evaluator: actual outputs are compared to
// the Current population, not model-generated expectations. Return is evidence
// for the canonical owner, never automatic admission or persistence.
export interface PopulationEvaluator {readonly binding:{subject:Identity;configuration_digest:string};evaluate(input:unknown):Promise<unknown>}
export async function evaluatePopulation(c:CapabilityContext,subject:Identity,capabilityId:string,adapter:PopulationEvaluator){
 const binding=freeze(adapter.binding),evaluate=adapter.evaluate.bind(adapter),config=await c.current(subject,'CONFIGURATION');demand(same(binding.subject,subject)&&binding.configuration_digest===digest(config.value),'B5_EVALUATOR_BINDING');
 const pop=await c.current(c.principal,'POPULATION:'+text(capabilityId)),r=record(pop.value,['schema_version','population_id','capability_id','procedure_id','procedure_version','role','cases','evidence_refs']);evidence(denseArray(r.evidence_refs));
 const cases=denseArray(r.cases);demand(cases.length>0&&cases.length<=256,'B5_BOUNDED_EVALUATION');const outputs=[];for(const input of cases){const v=record(input,['case_id','dimension','kind','input','expected_output']),output=jsonValue(await evaluate(freeze(jsonValue(v.input))));demand(same(binding,adapter.binding),'B5_EVALUATOR_CONFIGURATION_CHANGED');outputs.push({case_id:text(v.case_id),case_digest:digest(v),output,pass:same(output,jsonValue(v.expected_output))});}
 return freeze({population_ref:c.ref(pop.row),population_digest:digest(r),configuration_digest:binding.configuration_digest,outputs,admission:'NOT_ADJUDICATED',authority_effect:'NONE'});
}
export type {DisclosureRequest,Reference};
