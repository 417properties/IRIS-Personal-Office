import {type CapabilityQualification} from './capability-qualification.ts';
export interface RouteCandidate{candidate_id:string;qualification:CapabilityQualification;privacy_profile:string[];risk_profile:string[];runtime_placement:string;latency:number;cost:number;provider_ref?:string;worker_class?:string;}
export interface RouteRequest{route_request_id:string;role_scope:string;privacy_requirements:string[];risk_constraints:string[];allowed_runtime_placements:string[];now:string;}
// Legacy labels cannot route. Use CapabilityService.route.
export function routeCapability(_req:RouteRequest,_candidates:RouteCandidate[]){return {state:'ROUTE_UNAVAILABLE',authority_effect:'NONE' as const,reason:'B5_CANONICAL_QUALIFICATION_REQUIRED'};}
