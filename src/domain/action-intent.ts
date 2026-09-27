export type RetryClassification = 'IDEMPOTENT_BY_KEY' | 'READ_ONLY' | 'NON_IDEMPOTENT_RECONCILABLE' | 'NON_IDEMPOTENT_UNSAFE';
export interface ActionDecision {
  decision_id: string;
  principal_id: string;
  source_ref: string;
  scope: string;
  decided_at: string;
}
export interface ActionIntent {
  intent_id: string;
  decision_ref: string;
  work_episode_id: string;
  tool_id: string;
  operation: string;
  arguments_digest: string;
  expected_effect: string;
  authority_basis: string;
  privacy_basis: string;
  idempotency_key: string;
  verification_contract: string;
  retry_classification: RetryClassification;
  created_at: string;
}
