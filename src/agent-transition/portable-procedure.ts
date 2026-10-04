export interface PortableProcedure{procedure_id:string;qualified:boolean;retired_at?:string;supersedes_capability_id?:string;provider_compatibility:string[];tool_refs:string[];}
export function loadProcedure(_p:PortableProcedure,_provider:string):never{throw new Error('B5_CANONICAL_PROCEDURE_QUALIFICATION_REQUIRED');}
