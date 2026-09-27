export interface CapabilityProcedure {
  capability_id: string;
  name: string;
  version: number;
  capability_class: string;
  procedure_ref: string;
  tool_requirements: string[];
  authority_envelope: string[];
  privacy_envelope: string[];
  qualification_state: 'CANDIDATE' | 'QUALIFIED' | 'REJECTED' | 'UNKNOWN';
  evidence_refs: string[];
  failure_conditions: string[];
  recovery_contract: string;
  provider_dependency?: string;
}
