import {CapabilityService} from '../capability/service.ts';
import {decodeRequest,type CapabilityRequest} from '../capability/qualification.ts';
import {decodeIdentity,type Identity} from '../semantic-kernel/identity.ts';
import {freeze,demand} from '../semantic-kernel/validation.ts';
export interface CognitionRequest {
 request_id:string;phase:'ORIENT'|'PERCEIVE'|'THINK'|'ACT'|'LEARN';task_type:string;mode:'CONVERSATION'|'VOICE'|'TRIAGE'|'RESEARCH'|'DEEP_ANALYSIS'|'DECISION_PREPARATION'|'ORCHESTRATION'|'DETERMINISTIC'|'VERIFICATION'|'LEARNING'|'COLD_RECONSTRUCTION';
 capability:CapabilityRequest;trace_context:string;
}
export class CognitionRouter {
 #service:CapabilityService;#candidates:readonly {subject:Identity;qualification_id:string}[];
 constructor(service:CapabilityService,candidates:{subject:Identity;qualification_id:string}[]){demand(service instanceof CapabilityService,'B5_CANONICAL_COGNITION_SERVICE_REQUIRED');this.#service=service;this.#candidates=freeze(candidates.map(c=>({subject:decodeIdentity(c.subject),qualification_id:c.qualification_id})));}
 async route(request:CognitionRequest){const captured=freeze(request),capability=decodeRequest(captured.capability);demand(['ORIENT','PERCEIVE','THINK','ACT','LEARN'].includes(captured.phase)&&captured.task_type.length>0&&captured.trace_context.length>0,'B5_COGNITION_TASK_CONTEXT');const route=await this.#service.route({request_id:captured.request_id,request:capability,candidates:this.#candidates,mode:captured.mode});return freeze({...route,phase:captured.phase,task_type:captured.task_type,trace_context:captured.trace_context,identity_effect:'NONE',personality_effect:'NONE',usage:'UNKNOWN_UNTIL_ACTUAL_CALL'});}
}
