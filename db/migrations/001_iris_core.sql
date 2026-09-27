create extension if not exists pgcrypto;

create table principal (
  principal_id text primary key,
  principal_type text not null check (principal_type='AARON'),
  status text not null,
  created_at timestamptz not null,
  schema_version integer not null
);

create table orientation_state (
  orientation_id text primary key,
  principal_id text not null references principal(principal_id),
  effective_from timestamptz not null,
  effective_to timestamptz,
  source_basis_refs jsonb not null,
  standing_preferences jsonb not null,
  explicit_current_decisions jsonb not null,
  predicted_preferences jsonb not null,
  privacy_constraints jsonb not null,
  authority_constraints jsonb not null,
  version integer not null,
  supersedes_orientation_id text
);

create table evidence_occurrence (
  occurrence_id text primary key,
  principal_id text not null references principal(principal_id),
  source_type text not null,
  source_ref text not null,
  source_event_id text,
  observed_at timestamptz not null,
  ingested_at timestamptz not null,
  payload_digest text not null,
  content_ref text not null,
  provenance text not null,
  coverage_state text not null,
  confidence_class text not null,
  privacy_class text not null,
  work_episode_id text,
  causal_episode_id text,
  supersedes_occurrence_id text
);

create table current_assertion (
  assertion_id text primary key,
  subject_ref text not null,
  predicate text not null,
  value jsonb not null,
  effective_from timestamptz not null,
  effective_to timestamptz,
  source_occurrence_refs jsonb not null,
  qualification text not null,
  freshness text not null,
  coverage text not null,
  uncertainty jsonb not null,
  version integer not null,
  supersedes_assertion_id text,
  invalidated_by_refs jsonb not null
);
create unique index current_assertion_one_active on current_assertion(subject_ref,predicate) where effective_to is null;

create table objective (
  objective_id text primary key,
  principal_id text not null references principal(principal_id),
  parent_objective_id text references objective(objective_id),
  description text not null,
  desired_outcome text not null,
  success_criteria jsonb not null,
  status text not null,
  authority_scope jsonb not null,
  privacy_scope jsonb not null,
  created_from text not null,
  created_at timestamptz not null,
  closed_at timestamptz,
  closure_evidence_refs jsonb not null,
  version integer not null
);

create table obligation (
  obligation_id text primary key,
  objective_id text not null references objective(objective_id),
  owner text not null,
  description text not null,
  status text not null,
  due_at timestamptz,
  closure_criteria jsonb not null,
  authority_requirement jsonb not null,
  privacy_requirement jsonb not null,
  source_refs jsonb not null,
  last_episode_id text,
  version integer not null
);

create table capability_procedure (
  capability_id text primary key,
  name text not null,
  version integer not null,
  capability_class text not null,
  procedure_ref text not null,
  tool_requirements jsonb not null,
  authority_envelope jsonb not null,
  privacy_envelope jsonb not null,
  qualification_state text not null,
  evidence_refs jsonb not null,
  failure_conditions jsonb not null,
  recovery_contract text not null,
  provider_dependency text
);

create table learning_record (
  learning_id text primary key,
  source_episode_refs jsonb not null,
  candidate_lesson text not null,
  causal_basis jsonb not null,
  alternative_explanations jsonb not null,
  qualification_state text not null,
  evidence_refs jsonb not null,
  applicability jsonb not null,
  invalidators jsonb not null,
  created_at timestamptz not null,
  qualified_at timestamptz,
  version integer not null
);
