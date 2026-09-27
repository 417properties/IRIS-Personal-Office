import type { LearningRecord } from '../domain/learning-record.ts';
export function recordCandidateLearning(workEpisodeId:string, evidenceRefs:string[], lesson:string): LearningRecord {
  return {
    learning_id:`learning:${workEpisodeId}`,
    source_episode_refs:[workEpisodeId],
    candidate_lesson:lesson,
    causal_basis:[],
    alternative_explanations:['SUCCESS_MAY_BE_FIXTURE_SPECIFIC','OUTCOME_DOES_NOT_ESTABLISH_GENERAL_MASTERY'],
    qualification_state:'CANDIDATE',
    evidence_refs:evidenceRefs,
    applicability:['BOUNDED_FIXTURE_ONLY'],
    invalidators:['FAILED_REPLICATION','CONTRADICTORY_EVIDENCE'],
    created_at:new Date().toISOString(),
    version:1
  };
}
