export type LearningQualification = 'CANDIDATE' | 'QUALIFIED' | 'REJECTED' | 'UNKNOWN';
export interface LearningRecord {
  learning_id: string;
  source_episode_refs: string[];
  candidate_lesson: string;
  causal_basis: string[];
  alternative_explanations: string[];
  qualification_state: LearningQualification;
  evidence_refs: string[];
  applicability: string[];
  invalidators: string[];
  created_at: string;
  qualified_at?: string;
  version: number;
}
