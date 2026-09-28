create table projection_coverage_contract (
  contract_id text primary key, principal_id text not null, scope_name text not null, scope_version integer not null check(scope_version>0),
  declared_scope jsonb not null, required_surfaces jsonb not null, known_exclusions jsonb not null, created_at timestamptz not null,
  supersedes_contract_id text references projection_coverage_contract(contract_id)
);
create table projection_source_requirement (
  source_requirement_id text primary key, contract_id text not null references projection_coverage_contract(contract_id), source_system text not null,
  source_class text not null, required_principal_id text not null, freshness_rule jsonb not null, provenance_requirements jsonb not null,
  required_state_surfaces jsonb not null, applicability_rule jsonb not null
);
create table pilot001_projection_run (
  projection_id text primary key, principal_id text not null check(principal_id='AARON'), contract_id text not null references projection_coverage_contract(contract_id),
  scope_version integer not null, completeness_state text not null check(completeness_state in ('COMPLETE_FOR_DECLARED_SCOPE','INCOMPLETE_COVERAGE','CONFLICTED_COVERAGE','UNKNOWN_COVERAGE')),
  snapshot_started_at timestamptz not null, emitted_at timestamptz not null, dependency_digest text not null,
  bracket_status text not null check(bracket_status in ('STABLE','RERUN_STABLE','UNSTABLE')), output jsonb not null,
  check(completeness_state<>'COMPLETE_FOR_DECLARED_SCOPE' or bracket_status<>'UNSTABLE')
);
create table pilot001_source_evaluation (
  projection_id text not null references pilot001_projection_run(projection_id), source_id text not null, surface text not null,
  evaluation jsonb not null, primary key(projection_id,source_id,surface)
);
create table pilot001_projection_item (
  projection_id text not null references pilot001_projection_run(projection_id), item_id text not null,
  disposition text not null check(disposition in ('AARON_REQUIRED','AARON_RELEVANCE_UNKNOWN','JUSTIFIED_OMISSION','PRIVACY_EXCLUDED','UNRESOLVED_CONFLICT')),
  payload jsonb not null, primary key(projection_id,item_id,disposition)
);
create trigger coverage_contract_immutable before update or delete on projection_coverage_contract for each row execute function transition_immutable();
create trigger source_requirement_immutable before update or delete on projection_source_requirement for each row execute function transition_immutable();
create trigger projection_run_immutable before update or delete on pilot001_projection_run for each row execute function transition_immutable();
create trigger source_evaluation_immutable before update or delete on pilot001_source_evaluation for each row execute function transition_immutable();
create trigger projection_item_immutable before update or delete on pilot001_projection_item for each row execute function transition_immutable();

insert into projection_coverage_contract values (
  'PILOT001_IRIS_PLUS_QUALIFIED_BIG_V0_1','AARON','IRIS plus qualified BIG',1,
  '["IRIS canonical personal-office state","already-qualified BIG quarantine/evidence"]',
  '["objectives","obligations","obligation_governance","decision_requirements","authority_generation_and_leases","unresolved_intents_and_effects","applicability_current_assertions","qualified_big_quarantine_evidence"]',
  '["unqualified live Gmail/calendar/phone/device","ambient observations","live unqualified BIG Current","other principals/private planes","commerce/payment/representation","sources without explicit bounded applicability packet"]',
  '2026-09-28T00:00:00Z',null
);
insert into projection_source_requirement
select 'pilot001:'||surface,'PILOT001_IRIS_PLUS_QUALIFIED_BIG_V0_1',case when surface='qualified_big_quarantine_evidence' then 'QUALIFIED_BIG_IN_IRIS' else 'IRIS_CANONICAL' end,
  surface,'AARON',case when surface='qualified_big_quarantine_evidence' then '{"observed_and_qualified_required":true,"valid_through_or_source_max_age_required":true}'::jsonb else '{"read_at_projection_snapshot":true}'::jsonb end,
  '["verified_source_identity","evidence_refs","verified_principal"]'::jsonb,jsonb_build_array(surface),'{"explicit_applicability_or_proven_inapplicability_required":true}'::jsonb
from jsonb_array_elements_text('["objectives","obligations","obligation_governance","decision_requirements","authority_generation_and_leases","unresolved_intents_and_effects","applicability_current_assertions","qualified_big_quarantine_evidence"]') as surfaces(surface);
