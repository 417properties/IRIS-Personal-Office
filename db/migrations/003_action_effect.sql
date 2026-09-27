create table action_decision (
  decision_id text primary key,
  principal_id text not null references principal(principal_id),
  source_ref text not null,
  scope text not null,
  decided_at timestamptz not null
);
create table action_intent (
  intent_id text primary key,
  decision_ref text not null references action_decision(decision_id),
  work_episode_id text not null references work_episode(work_episode_id),
  tool_id text not null,
  operation text not null,
  arguments_digest text not null,
  expected_effect jsonb not null,
  authority_basis text not null,
  privacy_basis text not null,
  idempotency_key text not null unique,
  verification_contract text not null,
  retry_classification text not null,
  created_at timestamptz not null
);
create table action_receipt (
  receipt_id text primary key,
  intent_id text not null references action_intent(intent_id),
  provider_call_id text not null,
  request_digest text not null,
  completion_class text not null,
  returned_payload_digest text not null,
  tool_reported_status text not null,
  error_class text,
  received_at timestamptz not null
);
create table effect_verification (
  verification_id text primary key,
  intent_id text not null references action_intent(intent_id),
  receipt_id text references action_receipt(receipt_id),
  disposition text not null,
  evidence_refs jsonb not null,
  verified_at timestamptz not null,
  notes jsonb not null
);
create table authority_policy (
  policy_id text primary key,
  principal_id text not null references principal(principal_id),
  basis_type text not null,
  scopes jsonb not null,
  valid_from timestamptz not null,
  valid_to timestamptz,
  source_ref text not null,
  version integer not null
);
create table privacy_policy (
  policy_id text primary key,
  principal_id text not null references principal(principal_id),
  scopes jsonb not null,
  disclosure text not null,
  valid_from timestamptz not null,
  valid_to timestamptz,
  source_ref text not null,
  version integer not null
);
