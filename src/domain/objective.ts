export type ObjectiveStatus = 'OPEN' | 'SATISFIED' | 'UNSATISFIED' | 'HOLD' | 'ABANDONED';
export interface Objective {
  objective_id: string;
  principal_id: string;
  parent_objective_id?: string;
  description: string;
  desired_outcome: string;
  success_criteria: string[];
  status: ObjectiveStatus;
  authority_scope: string[];
  privacy_scope: string[];
  created_from: string;
  created_at: string;
  closed_at?: string;
  closure_evidence_refs: string[];
  version: number;
}
