export interface CapabilityQualification{qualification_id:string;capability_candidate_id:string;role_scope:string;evaluation_population_ref:string;comparator_qualification_ref?:string;dimensions:string[];evidence_refs:string[];falsifier_refs:string[];evaluation_result:'PASS'|'FAIL'|'UNKNOWN';admission_state:'CANDIDATE'|'ADMITTED'|'REJECTED'|'DEMOTED'|'EXPIRED';qualified_at?:string;valid_until?:string;version:number;benchmark_only?:boolean;}

// Legacy string-bag admission is retired. Use CapabilityService/B2 Current.
export function isRouteEligible(_q:CapabilityQualification,_role:string,_now:string){return false;}
export function admitQualification(q:CapabilityQualification):never{if(q.benchmark_only)throw new Error('BENCHMARK_ALONE_CANNOT_ADMIT');throw new Error('B5_CANONICAL_QUALIFICATION_REQUIRED');}
