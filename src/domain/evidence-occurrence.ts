export type CoverageState = 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'UNKNOWN' | 'CONFLICT';
export interface EvidenceOccurrence {
  occurrence_id: string;
  principal_id: string;
  source_type: string;
  source_ref: string;
  source_event_id?: string;
  observed_at: string;
  ingested_at: string;
  payload_digest: string;
  content_ref: string;
  provenance: string;
  coverage_state: CoverageState;
  confidence_class: 'DIRECT' | 'DERIVED' | 'REPORTED' | 'UNKNOWN';
  privacy_class: string;
  work_episode_id?: string;
  causal_episode_id?: string;
  supersedes_occurrence_id?: string;
}
