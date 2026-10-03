// IRIS_LEGACY_V0 source representation. Explicit decoders/maps are in
// source-dto.ts / legacy-maps.ts; qualified canonical records use canonical.ts.
export type EpisodeStatus =
  | 'RECEIVED' | 'ORIENTING' | 'PERCEIVING' | 'THINKING' | 'AUTHORITY_CHECK'
  | 'INTENT_READY' | 'EXECUTING' | 'RECEIPT_CAPTURED' | 'VERIFYING' | 'EFFECT_VERIFIED'
  | 'OBLIGATION_RECONCILE' | 'OBJECTIVE_RECONCILE' | 'LEARNING_RECORD' | 'EPISODE_CLOSED'
  | 'WAITING_FOR_AARON' | 'WAITING_FOR_SOURCE' | 'HOLD_AUTHORITY_UNKNOWN'
  | 'HOLD_PRIVACY_UNKNOWN' | 'HOLD_CONFLICTING_EVIDENCE' | 'EFFECT_AMBIGUOUS'
  | 'RECONCILIATION_REQUIRED' | 'FAILED_RETRY_SAFE' | 'FAILED_RETRY_UNSAFE' | 'ABORTED';

export interface WorkEpisode {
  work_episode_id: string;
  principal_id: string;
  objective_id: string;
  obligation_id?: string;
  episode_generation: number;
  continuation_of_episode_id?: string;
  causal_episode_id: string;
  state_version_at_start: number;
  orientation_version_at_start: number;
  authority_snapshot_digest: string;
  privacy_snapshot_digest: string;
  toolset_digest: string;
  cognition_profile: string;
  workflow_runtime_ref?: string;
  status: EpisodeStatus;
  started_at: string;
  last_checkpoint_at: string;
  ended_at?: string;
}
