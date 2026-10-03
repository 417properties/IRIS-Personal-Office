-- Bounded nonproduction schema only. No credential values, live routing, or workflow tables.
create table agent_identity (
  identity_id text primary key,
  identity_kind text not null check(identity_kind in ('IRIS','WORKER','PROVIDER','DEVICE','PROTOCOL')),
  principal_id text not null references principal(principal_id), stable_label text not null,
  identity_generation integer not null check(identity_generation > 0),
  predecessor_identity_id text references agent_identity(identity_id), issued_at timestamptz not null,
  issuance_basis_ref text not null, retired_at timestamptz, revocation_ref text, schema_version integer not null,
  unique(identity_kind,stable_label,identity_generation),
  check(identity_id ~ '^(iris|wrk|prv|dev|pro)_[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'),
  check(split_part(identity_id,'_',1) = case identity_kind when 'IRIS' then 'iris' when 'WORKER' then 'wrk' when 'PROVIDER' then 'prv' when 'DEVICE' then 'dev' else 'pro' end),
  check(predecessor_identity_id is null or predecessor_identity_id <> identity_id)
);
create table identity_binding (
  binding_id text primary key, institutional_identity_id text not null references agent_identity(identity_id),
  binding_kind text not null check(binding_kind in ('PROVIDER_SESSION','PROVIDER_ACCOUNT','DEVICE','PROTOCOL_ENDPOINT')),
  external_identity_digest text not null, provider_class text, issued_at timestamptz not null, valid_to timestamptz, revoked_at timestamptz,
  evidence_refs jsonb not null check(jsonb_array_length(evidence_refs)>0), version integer not null check(version>0),
  check(valid_to is null or valid_to>issued_at)
);
create table worker_identity_profile (
  worker_identity_id text primary key references agent_identity(identity_id), sponsor_identity_id text not null references agent_identity(identity_id),
  declared_purpose text not null, worker_class text not null, capability_class text not null, authority_envelope jsonb not null,
  privacy_envelope jsonb not null, credential_boundary_ref text not null check(credential_boundary_ref like 'boundary:%'),
  provider_binding_id text references identity_binding(binding_id), audit_lineage jsonb not null,
  activated_at timestamptz not null, expires_at timestamptz, revocation_generation integer not null check(revocation_generation>=0),
  status text not null check(status in ('ACTIVE','EXPIRED','REVOKED','REPLACED')),
  predecessor_worker_identity_id text references agent_identity(identity_id), successor_worker_identity_id text references agent_identity(identity_id), version integer not null check(version>0),
  check(worker_identity_id<>sponsor_identity_id), check(expires_at is null or expires_at>activated_at),
  check(predecessor_worker_identity_id is null or predecessor_worker_identity_id<>worker_identity_id),
  check(successor_worker_identity_id is null or successor_worker_identity_id<>worker_identity_id)
);
create table worker_assignment (
  assignment_id text primary key, worker_identity_id text not null references worker_identity_profile(worker_identity_id),
  objective_id text not null references objective(objective_id), obligation_id text references obligation(obligation_id),
  work_episode_id text not null references work_episode(work_episode_id), causal_episode_id text not null, workflow_id text,
  assignment_generation integer not null check(assignment_generation>0), evidence_scope jsonb not null check(jsonb_array_length(evidence_scope)>0),
  effect_authority_class text not null check(effect_authority_class in ('ZERO_EXTERNAL_EFFECT','CONSEQUENTIAL_LEASE_REQUIRED')),
  status text not null check(status in ('ACTIVE','ENDED')), predecessor_assignment_id text references worker_assignment(assignment_id),
  created_at timestamptz not null, ended_at timestamptz, version integer not null check(version>0)
);
create table obligation_governance (
  obligation_id text primary key references obligation(obligation_id), owner_identity_id text not null, decision_maker_identity_id text,
  authority_holder_identity_id text, reserved_authority_class text, escalation_target_identity_id text,
  applicability_state text not null check(applicability_state in ('APPLICABLE','SATISFIED','SUPERSEDED','ABANDONED','UNKNOWN')),
  source_refs jsonb not null, version integer not null check(version>0), updated_at timestamptz not null
);
create table decision_requirement (
  decision_requirement_id text primary key, principal_id text not null references principal(principal_id), objective_id text not null references objective(objective_id),
  obligation_id text references obligation(obligation_id), decision_maker_identity_id text not null, decision_class text not null, reserved_authority_class text,
  status text not null check(status in ('OPEN','RESOLVED','SUPERSEDED','ABANDONED','UNKNOWN')),
  source_refs jsonb not null, version integer not null check(version>0), created_at timestamptz not null, resolved_at timestamptz
);
create table authority_generation_state (
  authority_domain_id text primary key, principal_id text not null references principal(principal_id), capability_id text not null,
  operation_scope text not null, privacy_scope_digest text not null, current_generation integer not null check(current_generation>0),
  authority_policy_id text not null references authority_policy(policy_id), authority_policy_version integer not null,
  privacy_policy_id text not null references privacy_policy(policy_id), privacy_policy_version integer not null,
  updated_at timestamptz not null, version integer not null check(version>0), unique(principal_id,capability_id,operation_scope,privacy_scope_digest),
  check(authority_domain_id='authdom_'||encode(digest(principal_id||'|'||capability_id||'|'||operation_scope||'|'||privacy_scope_digest,'sha256'),'hex'))
);
create table authority_generation_event (
  event_id text primary key, authority_domain_id text not null references authority_generation_state(authority_domain_id),
  generation_before integer not null, generation_after integer not null,
  event_class text not null check(event_class in ('ISSUE_BASELINE','REVOKE','REAUTHORIZE','POLICY_CHANGE','PRIVACY_CHANGE')),
  basis_ref text not null, occurred_at timestamptz not null, actor_identity_id text not null,
  check(generation_after=generation_before+1), unique(authority_domain_id,generation_after)
);
create table authority_lease (
  lease_id text primary key, lease_version integer not null check(lease_version>0), principal_id text not null references principal(principal_id),
  iris_identity_id text not null references agent_identity(identity_id), worker_identity_id text not null references worker_identity_profile(worker_identity_id),
  work_episode_id text not null references work_episode(work_episode_id), causal_episode_id text not null,
  authority_domain_id text not null references authority_generation_state(authority_domain_id), capability_id text not null, tool_id text not null,
  operation_scope text not null, privacy_scope jsonb not null, authority_policy_id text not null references authority_policy(policy_id), authority_policy_version integer not null,
  privacy_policy_id text not null references privacy_policy(policy_id), privacy_policy_version integer not null,
  authority_generation integer not null check(authority_generation>0), basis_type text not null check(basis_type='EXPLICIT_TEST_ONLY'),
  basis_refs jsonb not null check(jsonb_array_length(basis_refs)>0), issued_at timestamptz not null, expires_at timestamptz,
  bounded_validity jsonb not null, source_refs jsonb not null check(jsonb_array_length(source_refs)>0),
  check(expires_at is not null and expires_at>issued_at), check(iris_identity_id<>worker_identity_id),
  check(bounded_validity->>'max_submissions'='1' and length(bounded_validity->>'intent_id')>0)
);
create table authority_lease_state (
  lease_state_id text primary key, lease_id text not null references authority_lease(lease_id),
  state text not null check(state in ('ACTIVE','REVOKED','EXPIRED','SUPERSEDED')), state_version integer not null check(state_version>0),
  basis_ref text not null, effective_at timestamptz not null, unique(lease_id,state_version)
);
create table sentinel_release_attempt (
  release_attempt_id text primary key, intent_id text not null unique references action_intent(intent_id), lease_id text not null references authority_lease(lease_id),
  worker_identity_id text not null references worker_identity_profile(worker_identity_id), work_episode_id text not null references work_episode(work_episode_id),
  authority_domain_id text not null references authority_generation_state(authority_domain_id), authority_generation integer not null,
  tool_id text not null, operation_digest text not null, idempotency_key text not null unique,
  status text not null check(status in ('PREPARED','RELEASED_SUBMITTED','RECONCILIATION_REQUIRED','DENIED')),
  prepared_at timestamptz not null, submitted_at timestamptz, provider_call_id text, receipt_ref text, denial_reason text, version integer not null check(version>0)
);
create table capability_candidate (
  capability_candidate_id text primary key, role_scope text not null, provider_identity_id text references agent_identity(identity_id), model_identity_digest text,
  worker_class text, toolset_digest text not null, procedure_refs jsonb not null, reasoning_profile text not null, runtime_placement text not null,
  privacy_profile_digest text not null, evidence_contract_digest text not null, candidate_version integer not null check(candidate_version>0), created_at timestamptz not null,
  unique(capability_candidate_id,role_scope)
);
create table capability_qualification (
  qualification_id text primary key, capability_candidate_id text not null, role_scope text not null,
  evaluation_population_ref text not null, comparator_qualification_ref text references capability_qualification(qualification_id), dimensions jsonb not null,
  evidence_refs jsonb not null, falsifier_refs jsonb not null, evaluation_result text not null check(evaluation_result in ('PASS','FAIL','UNKNOWN')),
  admission_state text not null check(admission_state in ('CANDIDATE','ADMITTED','REJECTED','DEMOTED','EXPIRED')),
  qualified_at timestamptz, valid_until timestamptz, supersedes_qualification_id text references capability_qualification(qualification_id), version integer not null check(version>0),
  foreign key(capability_candidate_id,role_scope) references capability_candidate(capability_candidate_id,role_scope),
  check(admission_state<>'ADMITTED' or (evaluation_result='PASS' and qualified_at is not null and valid_until>qualified_at and jsonb_array_length(evidence_refs)>0 and jsonb_array_length(falsifier_refs)>0))
);
alter table capability_procedure add column context_requirements jsonb, add column evidence_expectations jsonb,
  add column compatibility_constraints jsonb, add column provenance_refs jsonb, add column supersedes_capability_id text references capability_procedure(capability_id), add column retired_at timestamptz;

create function transition_immutable() returns trigger language plpgsql as $$
begin raise exception 'TRANSITION_APPEND_ONLY'; end;
$$;
create trigger generation_event_immutable before update or delete on authority_generation_event for each row execute function transition_immutable();
create trigger lease_immutable before update or delete on authority_lease for each row execute function transition_immutable();
create trigger lease_state_immutable before update or delete on authority_lease_state for each row execute function transition_immutable();
create trigger qualification_immutable before update or delete on capability_qualification for each row execute function transition_immutable();
create trigger candidate_immutable before update or delete on capability_candidate for each row execute function transition_immutable();
create trigger identity_no_delete before delete on agent_identity for each row execute function transition_immutable();
create function transition_identity_update() returns trigger language plpgsql as $$
begin
  if (to_jsonb(new)-'retired_at'-'revocation_ref') is distinct from (to_jsonb(old)-'retired_at'-'revocation_ref') or old.retired_at is not null or old.revocation_ref is not null then
    raise exception 'IDENTITY_NONREUSE';
  end if;
  return new;
end;
$$;
create trigger identity_retirement_only before update on agent_identity for each row execute function transition_identity_update();
create function transition_lease_identity_check() returns trigger language plpgsql as $$
declare w agent_identity; i agent_identity; p worker_identity_profile;
begin
  select * into w from agent_identity where identity_id=new.worker_identity_id for share;
  select * into i from agent_identity where identity_id=new.iris_identity_id for share;
  select * into p from worker_identity_profile where worker_identity_id=new.worker_identity_id for share;
  if w.identity_kind<>'WORKER' or i.identity_kind<>'IRIS' or w.principal_id<>new.principal_id or i.principal_id<>new.principal_id or w.retired_at is not null or i.retired_at is not null or w.revocation_ref is not null or i.revocation_ref is not null or p.status<>'ACTIVE' or (p.expires_at is not null and p.expires_at<=new.issued_at) then raise exception 'LEASE_IDENTITY_HOLD'; end if;
  return new;
end;
$$;
create trigger lease_identity before insert on authority_lease for each row execute function transition_lease_identity_check();

-- B2: historical source tables have an explicit V0 decoder owner.
alter table agent_identity add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table identity_binding add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table worker_identity_profile add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table worker_assignment add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table obligation_governance add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table decision_requirement add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table authority_generation_state add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table authority_generation_event add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table authority_lease add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table authority_lease_state add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table sentinel_release_attempt add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table capability_candidate add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table capability_qualification add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table agent_identity add check(identity_generation>0);
alter table agent_identity add check(schema_version>0);
alter table identity_binding add check(version>0);
alter table identity_binding add check(evidence_refs is null or jsonb_typeof(evidence_refs)='array');
alter table worker_identity_profile add check(revocation_generation>=0);
alter table worker_identity_profile add check(version>0);
alter table worker_identity_profile add check(authority_envelope is null or jsonb_typeof(authority_envelope)='array');
alter table worker_identity_profile add check(privacy_envelope is null or jsonb_typeof(privacy_envelope)='array');
alter table worker_identity_profile add check(audit_lineage is null or jsonb_typeof(audit_lineage)='array');
alter table worker_assignment add check(assignment_generation>0);
alter table worker_assignment add check(version>0);
alter table worker_assignment add check(evidence_scope is null or jsonb_typeof(evidence_scope)='array');
alter table obligation_governance add check(version>0);
alter table obligation_governance add check(source_refs is null or jsonb_typeof(source_refs)='array');
alter table decision_requirement add check(version>0);
alter table decision_requirement add check(source_refs is null or jsonb_typeof(source_refs)='array');
alter table authority_generation_state add check(current_generation>0);
alter table authority_generation_state add check(authority_policy_version>0);
alter table authority_generation_state add check(privacy_policy_version>0);
alter table authority_generation_state add check(version>0);
alter table authority_generation_event add check(generation_before>=0);
alter table authority_generation_event add check(generation_after>0);
alter table authority_lease add check(lease_version>0);
alter table authority_lease add check(authority_policy_version>0);
alter table authority_lease add check(privacy_policy_version>0);
alter table authority_lease add check(authority_generation>0);
alter table authority_lease add check(privacy_scope is null or jsonb_typeof(privacy_scope)='array');
alter table authority_lease add check(basis_refs is null or jsonb_typeof(basis_refs)='array');
alter table authority_lease add check(bounded_validity is null or jsonb_typeof(bounded_validity)='object');
alter table authority_lease add check(source_refs is null or jsonb_typeof(source_refs)='array');
alter table authority_lease_state add check(state_version>0);
alter table sentinel_release_attempt add check(authority_generation>0);
alter table sentinel_release_attempt add check(version>0);
alter table capability_candidate add check(candidate_version>0);
alter table capability_candidate add check(procedure_refs is null or jsonb_typeof(procedure_refs)='array');
alter table capability_qualification add check(version>0);
alter table capability_qualification add check(dimensions is null or jsonb_typeof(dimensions)='object');
alter table capability_qualification add check(evidence_refs is null or jsonb_typeof(evidence_refs)='array');
alter table capability_qualification add check(falsifier_refs is null or jsonb_typeof(falsifier_refs)='array');

-- Required missing JSON keys and SQL UNKNOWN must fail, not pass CHECK.
alter table authority_lease add check(coalesce(jsonb_typeof(bounded_validity)='object' and bounded_validity ? 'max_submissions' and bounded_validity ? 'intent_id' and bounded_validity->>'max_submissions'='1' and length(bounded_validity->>'intent_id')>0,false));
alter table capability_qualification add check(coalesce(admission_state<>'ADMITTED' or (evaluation_result='PASS' and qualified_at is not null and valid_until is not null and valid_until>qualified_at and jsonb_typeof(evidence_refs)='array' and jsonb_array_length(evidence_refs)>0 and jsonb_typeof(falsifier_refs)='array' and jsonb_array_length(falsifier_refs)>0),false));
