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

-- B2: historical source tables have an explicit V0 decoder owner.
alter table principal add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table orientation_state add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table evidence_occurrence add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table current_assertion add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table objective add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table obligation add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table capability_procedure add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table learning_record add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table principal add check(schema_version>0);
alter table orientation_state add check(version>0);
alter table orientation_state add check(source_basis_refs is null or jsonb_typeof(source_basis_refs)='array');
alter table orientation_state add check(standing_preferences is null or jsonb_typeof(standing_preferences)='array');
alter table orientation_state add check(explicit_current_decisions is null or jsonb_typeof(explicit_current_decisions)='array');
alter table orientation_state add check(predicted_preferences is null or jsonb_typeof(predicted_preferences)='array');
alter table orientation_state add check(privacy_constraints is null or jsonb_typeof(privacy_constraints)='array');
alter table orientation_state add check(authority_constraints is null or jsonb_typeof(authority_constraints)='array');
alter table current_assertion add check(version>0);
alter table current_assertion add check(value is null or jsonb_typeof(value)='array');
alter table current_assertion add check(source_occurrence_refs is null or jsonb_typeof(source_occurrence_refs)='array');
alter table current_assertion add check(uncertainty is null or jsonb_typeof(uncertainty)='array');
alter table current_assertion add check(invalidated_by_refs is null or jsonb_typeof(invalidated_by_refs)='array');
alter table objective add check(version>0);
alter table objective add check(success_criteria is null or jsonb_typeof(success_criteria)='array');
alter table objective add check(authority_scope is null or jsonb_typeof(authority_scope)='array');
alter table objective add check(privacy_scope is null or jsonb_typeof(privacy_scope)='array');
alter table objective add check(closure_evidence_refs is null or jsonb_typeof(closure_evidence_refs)='array');
alter table obligation add check(version>0);
alter table obligation add check(closure_criteria is null or jsonb_typeof(closure_criteria)='array');
alter table obligation add check(authority_requirement is null or jsonb_typeof(authority_requirement)='array');
alter table obligation add check(privacy_requirement is null or jsonb_typeof(privacy_requirement)='array');
alter table obligation add check(source_refs is null or jsonb_typeof(source_refs)='array');
alter table capability_procedure add check(version>0);
alter table capability_procedure add check(tool_requirements is null or jsonb_typeof(tool_requirements)='array');
alter table capability_procedure add check(authority_envelope is null or jsonb_typeof(authority_envelope)='array');
alter table capability_procedure add check(privacy_envelope is null or jsonb_typeof(privacy_envelope)='array');
alter table capability_procedure add check(evidence_refs is null or jsonb_typeof(evidence_refs)='array');
alter table capability_procedure add check(failure_conditions is null or jsonb_typeof(failure_conditions)='array');
alter table learning_record add check(version>0);
alter table learning_record add check(source_episode_refs is null or jsonb_typeof(source_episode_refs)='array');
alter table learning_record add check(causal_basis is null or jsonb_typeof(causal_basis)='array');
alter table learning_record add check(alternative_explanations is null or jsonb_typeof(alternative_explanations)='array');
alter table learning_record add check(evidence_refs is null or jsonb_typeof(evidence_refs)='array');
alter table learning_record add check(applicability is null or jsonb_typeof(applicability)='array');
alter table learning_record add check(invalidators is null or jsonb_typeof(invalidators)='array');
alter table principal add check(status in ('ACTIVE','INACTIVE'));
alter table evidence_occurrence add check(coverage_state in ('COMPLETE','PARTIAL','MISSING','UNKNOWN','CONFLICT'));
alter table evidence_occurrence add check(confidence_class in ('DIRECT','DERIVED','REPORTED','UNKNOWN'));
alter table current_assertion add check(qualification in ('VERIFIED','QUALIFIED','CONFLICT','UNKNOWN','INAPPLICABLE'));
alter table current_assertion add check(freshness in ('FRESH','STALE','UNKNOWN'));
alter table current_assertion add check(coverage in ('COMPLETE','PARTIAL','MISSING','UNKNOWN','CONFLICT'));
alter table objective add check(status in ('OPEN','SATISFIED','UNSATISFIED','HOLD','ABANDONED'));
alter table obligation add check(status in ('OPEN','IN_PROGRESS','WAITING','HOLD','CLOSED','UNKNOWN'));
alter table obligation add check(owner in ('IRIS','AARON','EXTERNAL'));
alter table capability_procedure add check(qualification_state in ('CANDIDATE','QUALIFIED','REJECTED','UNKNOWN'));
alter table learning_record add check(qualification_state in ('CANDIDATE','QUALIFIED','REJECTED','UNKNOWN'));

-- Canonical B2 storage: append-only command journal, distinct from V0 sources.
create function iris_b2_shape(v jsonb, required text[], optional text[] default '{}') returns boolean language sql immutable as $$
 select coalesce(jsonb_typeof(v)='object' and v ?& required and not exists(select 1 from jsonb_object_keys(v) k where not(k=any(required||optional))),false)
$$;
create function iris_b2_text(v jsonb) returns boolean language sql immutable as $$
 select coalesce(jsonb_typeof(v)='string' and length(v#>>'{}')>0 and btrim(v#>>'{}')=v#>>'{}',false)
$$;
create function iris_b2_strings(v jsonb, nonempty boolean default false) returns boolean language plpgsql immutable as $$
begin
 if jsonb_typeof(v) is distinct from 'array' then return false; end if;
 return (not nonempty or jsonb_array_length(v)>0) and not exists(select 1 from jsonb_array_elements(v) x where not iris_b2_text(x));
end $$;
create function iris_b2_version(v jsonb, minimum integer default 1) returns boolean language plpgsql immutable as $$
begin return coalesce(jsonb_typeof(v)='number' and (v#>>'{}')::numeric between minimum and 9007199254740991 and trunc((v#>>'{}')::numeric)=(v#>>'{}')::numeric,false); exception when others then return false; end $$;
create function iris_b2_instant(v jsonb) returns boolean language plpgsql immutable as $$
declare s text;
begin
 if not iris_b2_text(v) then return false; end if; s=v#>>'{}';
 if s !~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$' then return false; end if;
 return to_char(s::timestamptz at time zone 'UTC',case when position('.' in s)>0 then 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"' else 'YYYY-MM-DD"T"HH24:MI:SS"Z"' end)=s;
exception when others then return false; end $$;
create function iris_b2_identity(v jsonb) returns boolean language sql immutable as $$
 select iris_b2_shape(v,array['kind','id']) and iris_b2_text(v->'id') and coalesce(v->>'kind' in ('PRINCIPAL','OBJECTIVE','OBLIGATION','DECISION_REQUIREMENT','INTENT','RELEASE_ATTEMPT','RECEIPT','EFFECT','VERIFICATION','CONFLICT','RESOLUTION','WORK_EPISODE','CONTINUATION','WORKER','SUBSTRATE','CAUSAL_OCCURRENCE','PROJECTION_RUN','COMMUNICATION_EVENT'),false)
$$;
create function iris_b2_temporal(v jsonb) returns boolean language plpgsql immutable as $$
declare k text; ending text;
begin
 if not iris_b2_shape(v,array['recorded_at','effective_from'],array['observed_at','occurred_at','valid_until','superseded_at','revoked_at','requalification_at']) then return false; end if;
 for k in select jsonb_object_keys(v) loop if not iris_b2_instant(v->k) then return false; end if; end loop;
 if v ? 'valid_until' and (v->>'valid_until')::timestamptz <= (v->>'effective_from')::timestamptz then return false; end if;
 return true;
exception when others then return false; end $$;
create function iris_b2_epistemic(v jsonb) returns boolean language sql immutable as $$
 select coalesce(iris_b2_shape(v,array['knowledge_state','applicability_state','freshness_state','coverage_state','as_of','evidence_refs','invalidators'])
 and v->>'knowledge_state' in ('KNOWN','UNKNOWN','MISSING','UNAVAILABLE','CONFLICTED','INVALID','REJECTED')
 and v->>'applicability_state' in ('APPLICABLE','NOT_APPLICABLE_PROVEN','SATISFIED','SUPERSEDED','ABANDONED','UNKNOWN')
 and v->>'freshness_state' in ('CURRENT_AS_OF','STALE','UNKNOWN') and v->>'coverage_state' in ('COMPLETE_FOR_DECLARED_SCOPE','INCOMPLETE','CONFLICTED','UNKNOWN')
 and iris_b2_instant(v->'as_of') and iris_b2_strings(v->'evidence_refs',v->>'knowledge_state'='KNOWN' or v->>'applicability_state'='NOT_APPLICABLE_PROVEN')
 and iris_b2_strings(v->'invalidators') and (v->>'applicability_state'<>'NOT_APPLICABLE_PROVEN' or v->>'knowledge_state'='KNOWN'),false)
$$;

create function iris_b2_repo_identity(v jsonb) returns boolean language sql immutable as $$
 select iris_b2_identity(v) or (iris_b2_shape(v,array['kind','id']) and iris_b2_text(v->'id') and coalesce(v->>'kind' in ('ORIENTATION','EVIDENCE','CAPABILITY','LEARNING','AUTHORITY_POLICY','PRIVACY_POLICY','ACTION_DECISION'),false))
$$;
create function iris_b2_source(v jsonb) returns boolean language plpgsql immutable as $$
declare schemas jsonb := $descriptor${"PRINCIPAL_V0":{"id_field":"principal_id","fields":{"principal_id":{"optional":false,"codec":"text"},"principal_type":{"optional":false,"codec":["AARON"]},"status":{"optional":false,"codec":["ACTIVE","INACTIVE"]},"created_at":{"optional":false,"codec":"instant"},"schema_version":{"optional":false,"codec":"version"}}},"ORIENTATIONSTATE_V0":{"id_field":"orientation_id","fields":{"orientation_id":{"optional":false,"codec":"text"},"principal_id":{"optional":false,"codec":"text"},"effective_from":{"optional":false,"codec":"instant"},"effective_to":{"optional":true,"codec":"instant"},"source_basis_refs":{"optional":false,"codec":"strings"},"standing_preferences":{"optional":false,"codec":"preferences"},"explicit_current_decisions":{"optional":false,"codec":"preferences"},"predicted_preferences":{"optional":false,"codec":"preferences"},"privacy_constraints":{"optional":false,"codec":"strings"},"authority_constraints":{"optional":false,"codec":"strings"},"version":{"optional":false,"codec":"version"},"supersedes_orientation_id":{"optional":true,"codec":"text"}}},"EVIDENCEOCCURRENCE_V0":{"id_field":"occurrence_id","fields":{"occurrence_id":{"optional":false,"codec":"text"},"principal_id":{"optional":false,"codec":"text"},"source_type":{"optional":false,"codec":"text"},"source_ref":{"optional":false,"codec":"text"},"source_event_id":{"optional":true,"codec":"text"},"observed_at":{"optional":false,"codec":"instant"},"ingested_at":{"optional":false,"codec":"instant"},"payload_digest":{"optional":false,"codec":"text"},"content_ref":{"optional":false,"codec":"text"},"provenance":{"optional":false,"codec":"text"},"coverage_state":{"optional":false,"codec":["COMPLETE","PARTIAL","MISSING","UNKNOWN","CONFLICT"]},"confidence_class":{"optional":false,"codec":["DIRECT","DERIVED","REPORTED","UNKNOWN"]},"privacy_class":{"optional":false,"codec":"text"},"work_episode_id":{"optional":true,"codec":"text"},"causal_episode_id":{"optional":true,"codec":"text"},"supersedes_occurrence_id":{"optional":true,"codec":"text"}}},"CURRENTASSERTION_V0":{"id_field":"assertion_id","fields":{"assertion_id":{"optional":false,"codec":"text"},"subject_ref":{"optional":false,"codec":"text"},"predicate":{"optional":false,"codec":"text"},"value":{"optional":false,"codec":"json"},"effective_from":{"optional":false,"codec":"instant"},"effective_to":{"optional":true,"codec":"instant"},"source_occurrence_refs":{"optional":false,"codec":"strings"},"qualification":{"optional":false,"codec":["VERIFIED","QUALIFIED","CONFLICT","UNKNOWN","INAPPLICABLE"]},"freshness":{"optional":false,"codec":["FRESH","STALE","UNKNOWN"]},"coverage":{"optional":false,"codec":["COMPLETE","PARTIAL","MISSING","UNKNOWN","CONFLICT"]},"uncertainty":{"optional":false,"codec":"strings"},"version":{"optional":false,"codec":"version"},"supersedes_assertion_id":{"optional":true,"codec":"text"},"invalidated_by_refs":{"optional":false,"codec":"strings"}}},"OBJECTIVE_V0":{"id_field":"objective_id","fields":{"objective_id":{"optional":false,"codec":"text"},"principal_id":{"optional":false,"codec":"text"},"parent_objective_id":{"optional":true,"codec":"text"},"description":{"optional":false,"codec":"text"},"desired_outcome":{"optional":false,"codec":"text"},"success_criteria":{"optional":false,"codec":"strings"},"status":{"optional":false,"codec":["OPEN","SATISFIED","UNSATISFIED","HOLD","ABANDONED"]},"authority_scope":{"optional":false,"codec":"strings"},"privacy_scope":{"optional":false,"codec":"strings"},"created_from":{"optional":false,"codec":"text"},"created_at":{"optional":false,"codec":"instant"},"closed_at":{"optional":true,"codec":"instant"},"closure_evidence_refs":{"optional":false,"codec":"strings"},"version":{"optional":false,"codec":"version"}}},"OBLIGATION_V0":{"id_field":"obligation_id","fields":{"obligation_id":{"optional":false,"codec":"text"},"objective_id":{"optional":false,"codec":"text"},"owner":{"optional":false,"codec":["IRIS","AARON","EXTERNAL"]},"description":{"optional":false,"codec":"text"},"status":{"optional":false,"codec":["OPEN","IN_PROGRESS","WAITING","HOLD","CLOSED","UNKNOWN"]},"due_at":{"optional":true,"codec":"instant"},"closure_criteria":{"optional":false,"codec":"strings"},"authority_requirement":{"optional":false,"codec":"strings"},"privacy_requirement":{"optional":false,"codec":"strings"},"source_refs":{"optional":false,"codec":"strings"},"last_episode_id":{"optional":true,"codec":"text"},"version":{"optional":false,"codec":"version"}}},"ACTIONINTENT_V0":{"id_field":"intent_id","fields":{"intent_id":{"optional":false,"codec":"text"},"decision_ref":{"optional":false,"codec":"text"},"work_episode_id":{"optional":false,"codec":"text"},"tool_id":{"optional":false,"codec":"text"},"operation":{"optional":false,"codec":"text"},"arguments_digest":{"optional":false,"codec":"text"},"expected_effect":{"optional":false,"codec":"text"},"authority_basis":{"optional":false,"codec":"text"},"privacy_basis":{"optional":false,"codec":"text"},"idempotency_key":{"optional":false,"codec":"text"},"verification_contract":{"optional":false,"codec":"text"},"retry_classification":{"optional":false,"codec":["IDEMPOTENT_BY_KEY","READ_ONLY","NON_IDEMPOTENT_RECONCILABLE","NON_IDEMPOTENT_UNSAFE"]},"created_at":{"optional":false,"codec":"instant"}}},"ACTIONRECEIPT_V0":{"id_field":"receipt_id","fields":{"receipt_id":{"optional":false,"codec":"text"},"intent_id":{"optional":false,"codec":"text"},"provider_call_id":{"optional":false,"codec":"text"},"request_digest":{"optional":false,"codec":"text"},"completion_class":{"optional":false,"codec":["SUCCESS","ERROR","TIMEOUT","UNKNOWN"]},"returned_payload_digest":{"optional":false,"codec":"text"},"tool_reported_status":{"optional":false,"codec":"text"},"error_class":{"optional":true,"codec":"text"},"received_at":{"optional":false,"codec":"instant"}}},"EFFECTVERIFICATION_V0":{"id_field":"verification_id","fields":{"verification_id":{"optional":false,"codec":"text"},"intent_id":{"optional":false,"codec":"text"},"receipt_id":{"optional":true,"codec":"text"},"disposition":{"optional":false,"codec":["VERIFIED_EFFECT","VERIFIED_NO_EFFECT","AMBIGUOUS_EFFECT","CONFLICT","UNKNOWN"]},"evidence_refs":{"optional":false,"codec":"strings"},"verified_at":{"optional":false,"codec":"instant"},"notes":{"optional":false,"codec":"strings"}}},"AUTHORITYPOLICY_V0":{"id_field":"policy_id","fields":{"policy_id":{"optional":false,"codec":"text"},"principal_id":{"optional":false,"codec":"text"},"basis_type":{"optional":false,"codec":["EXPLICIT_CURRENT_DECISION","STANDING_AUTHORIZATION","INTERNAL_NONCONSEQUENTIAL","PREDICTED_PREFERENCE"]},"scopes":{"optional":false,"codec":"strings"},"valid_from":{"optional":false,"codec":"instant"},"valid_to":{"optional":true,"codec":"instant"},"source_ref":{"optional":false,"codec":"text"},"version":{"optional":false,"codec":"version"}}},"PRIVACYPOLICY_V0":{"id_field":"policy_id","fields":{"policy_id":{"optional":false,"codec":"text"},"principal_id":{"optional":false,"codec":"text"},"scopes":{"optional":false,"codec":"strings"},"disclosure":{"optional":false,"codec":["ALLOW","DENY"]},"valid_from":{"optional":false,"codec":"instant"},"valid_to":{"optional":true,"codec":"instant"},"source_ref":{"optional":false,"codec":"text"},"version":{"optional":false,"codec":"version"}}},"CAPABILITYPROCEDURE_V0":{"id_field":"capability_id","fields":{"capability_id":{"optional":false,"codec":"text"},"name":{"optional":false,"codec":"text"},"version":{"optional":false,"codec":"version"},"capability_class":{"optional":false,"codec":"text"},"procedure_ref":{"optional":false,"codec":"text"},"tool_requirements":{"optional":false,"codec":"strings"},"authority_envelope":{"optional":false,"codec":"strings"},"privacy_envelope":{"optional":false,"codec":"strings"},"qualification_state":{"optional":false,"codec":["CANDIDATE","QUALIFIED","REJECTED","UNKNOWN"]},"evidence_refs":{"optional":false,"codec":"strings"},"failure_conditions":{"optional":false,"codec":"strings"},"recovery_contract":{"optional":false,"codec":"text"},"provider_dependency":{"optional":true,"codec":"text"}}},"LEARNINGRECORD_V0":{"id_field":"learning_id","fields":{"learning_id":{"optional":false,"codec":"text"},"source_episode_refs":{"optional":false,"codec":"strings"},"candidate_lesson":{"optional":false,"codec":"text"},"causal_basis":{"optional":false,"codec":"strings"},"alternative_explanations":{"optional":false,"codec":"strings"},"qualification_state":{"optional":false,"codec":["CANDIDATE","QUALIFIED","REJECTED","UNKNOWN"]},"evidence_refs":{"optional":false,"codec":"strings"},"applicability":{"optional":false,"codec":"strings"},"invalidators":{"optional":false,"codec":"strings"},"created_at":{"optional":false,"codec":"instant"},"qualified_at":{"optional":true,"codec":"instant"},"version":{"optional":false,"codec":"version"}}},"WORKEPISODE_V0":{"id_field":"work_episode_id","fields":{"work_episode_id":{"optional":false,"codec":"text"},"principal_id":{"optional":false,"codec":"text"},"objective_id":{"optional":false,"codec":"text"},"obligation_id":{"optional":true,"codec":"text"},"episode_generation":{"optional":false,"codec":"version"},"continuation_of_episode_id":{"optional":true,"codec":"text"},"causal_episode_id":{"optional":false,"codec":"text"},"state_version_at_start":{"optional":false,"codec":"version"},"orientation_version_at_start":{"optional":false,"codec":"version"},"authority_snapshot_digest":{"optional":false,"codec":"text"},"privacy_snapshot_digest":{"optional":false,"codec":"text"},"toolset_digest":{"optional":false,"codec":"text"},"cognition_profile":{"optional":false,"codec":"text"},"workflow_runtime_ref":{"optional":true,"codec":"text"},"status":{"optional":false,"codec":["RECEIVED","ORIENTING","PERCEIVING","THINKING","AUTHORITY_CHECK","INTENT_READY","EXECUTING","RECEIPT_CAPTURED","VERIFYING","EFFECT_VERIFIED","OBLIGATION_RECONCILE","OBJECTIVE_RECONCILE","LEARNING_RECORD","EPISODE_CLOSED","WAITING_FOR_AARON","WAITING_FOR_SOURCE","HOLD_AUTHORITY_UNKNOWN","HOLD_PRIVACY_UNKNOWN","HOLD_CONFLICTING_EVIDENCE","EFFECT_AMBIGUOUS","RECONCILIATION_REQUIRED","FAILED_RETRY_SAFE","FAILED_RETRY_UNSAFE","ABORTED"]},"started_at":{"optional":false,"codec":"instant"},"last_checkpoint_at":{"optional":false,"codec":"instant"},"ended_at":{"optional":true,"codec":"instant"}}},"ACTIONDECISION_V0":{"id_field":"decision_id","fields":{"decision_id":{"optional":false,"codec":"text"},"principal_id":{"optional":false,"codec":"text"},"source_ref":{"optional":false,"codec":"text"},"scope":{"optional":false,"codec":"text"},"decided_at":{"optional":false,"codec":"instant"}}}}$descriptor$::jsonb; descriptor jsonb; item record; codec jsonb; fields jsonb; field_value jsonb; required text[]; allowed text[];
begin
 if not iris_b2_shape(v,array['representation_version','source']) then return false; end if;
 descriptor=schemas->(v->>'representation_version'); if descriptor is null then return false; end if;
 fields=v->'source'; required=array(select key from jsonb_each(descriptor->'fields') where value->>'optional'='false'); allowed=array(select key from jsonb_each(descriptor->'fields'));
 if not iris_b2_shape(fields,required,allowed) then return false; end if;
 for item in select * from jsonb_each(fields) loop
  codec=descriptor->'fields'->item.key->'codec'; field_value=item.value;
  if jsonb_typeof(codec)='array' then if not codec @> jsonb_build_array(field_value) then return false; end if;
  elsif codec#>>'{}'='version' then if not iris_b2_version(field_value,case when item.key='state_version_at_start' then 0 else 1 end) then return false; end if;
  elsif codec#>>'{}'='instant' then if not iris_b2_instant(field_value) then return false; end if;
  elsif codec#>>'{}'='strings' then if not iris_b2_strings(field_value) then return false; end if;
  elsif codec#>>'{}'='preferences' then
   if jsonb_typeof(field_value) is distinct from 'array' then return false; end if;
   if exists(select 1 from jsonb_array_elements(field_value) x where not coalesce(iris_b2_shape(x,array['key','value','source_ref','effective_from'],array['effective_to']) and iris_b2_text(x->'key') and iris_b2_text(x->'source_ref') and iris_b2_instant(x->'effective_from') and (not(x ? 'effective_to') or iris_b2_instant(x->'effective_to')),false)) then return false; end if;
  elsif codec#>>'{}'='json' then null;
  else if not iris_b2_text(field_value) then return false; end if;
  end if;
 end loop;
 return true;
exception when others then return false; end $$;
create function iris_b2_root_disposition(v jsonb) returns boolean language plpgsql immutable as $$
declare reason jsonb; privacy jsonb; code text; type text; reasons jsonb; id text; expected text;
begin
 if not coalesce(iris_b2_shape(v,array['schema_version','root_ref','principal_ref','version','as_of','boundary_id','consumer_class','epistemic','lifecycle','requirement','holder_knowledge_state','holder_ref','privacy','primary_visible_disposition','reason_set','visible_reason_projection','reactivation_refs','invalidator_refs','provenance_refs','projection_qualification'])
 and v->>'schema_version'='IRIS_ROOT_DISPOSITION_V2' and v->>'projection_qualification'='NOT_ADJUDICATED' and iris_b2_identity(v->'root_ref') and iris_b2_identity(v->'principal_ref') and v->'principal_ref'->>'kind'='PRINCIPAL' and iris_b2_version(v->'version') and iris_b2_instant(v->'as_of') and iris_b2_text(v->'boundary_id') and iris_b2_text(v->'consumer_class') and iris_b2_epistemic(v->'epistemic') and v->>'as_of'=v->'epistemic'->>'as_of'
 and v->>'requirement' in ('REQUIRED','NOT_REQUIRED_PROVEN','UNKNOWN') and v->>'holder_knowledge_state' in ('KNOWN','UNKNOWN','MISSING','UNAVAILABLE','CONFLICTED','INVALID','REJECTED') and (v->'holder_ref'='null'::jsonb or iris_b2_identity(v->'holder_ref')) and (v->>'holder_knowledge_state'<>'KNOWN' or v->'holder_ref'<>'null'::jsonb)
 and v->>'primary_visible_disposition' in ('KNOWN_REQUIRED','RELEVANCE_UNKNOWN','TERMINAL_RETAINED','JUSTIFIED_NOT_APPLICABLE','PRIVACY_EXCLUDED','DEFERRED_SUPPRESSED_WITH_REACTIVATION','CONFLICT_HOLD','INVALID_REJECTED') and iris_b2_strings(v->'visible_reason_projection') and iris_b2_strings(v->'reactivation_refs') and iris_b2_strings(v->'invalidator_refs') and iris_b2_strings(v->'provenance_refs',true),false) then return false; end if;
 if v->'lifecycle'='null'::jsonb then if v->'root_ref'->>'kind' in ('OBJECTIVE','OBLIGATION','DECISION_REQUIREMENT') then return false; end if;
 else if not iris_b2_payload('LIFECYCLE',v->'lifecycle') or v->'lifecycle'->'object'<>v->'root_ref' or v->'lifecycle'->'principal'<>v->'principal_ref' then return false; end if; end if;
 privacy=v->'privacy';
 if not coalesce(iris_b2_shape(privacy,array['recipient_ref','purpose_ref','disclosure_result','evidence_refs']) and iris_b2_identity(privacy->'recipient_ref') and iris_b2_text(privacy->'purpose_ref') and privacy->>'disclosure_result' in ('PERMITTED','PROHIBITED','UNKNOWN') and iris_b2_strings(privacy->'evidence_refs',true),false) then return false; end if;
 reasons=v->'reason_set';if jsonb_typeof(reasons) is distinct from 'array' or jsonb_array_length(reasons)=0 then return false; end if;
 if (select count(*)<>count(distinct x->>'reason_id') from jsonb_array_elements(reasons) x) then return false; end if;
 for reason in select jsonb_array_elements(reasons) loop
  if not (iris_b2_shape(reason,array['reason_id','reason_type','canonical_code','evidence_refs']) and iris_b2_text(reason->'reason_id') and iris_b2_strings(reason->'evidence_refs',true)) then return false; end if;
  type=reason->>'reason_type';code=reason->>'canonical_code';expected=case type when 'KNOWLEDGE' then v->'epistemic'->>'knowledge_state' when 'APPLICABILITY' then v->'epistemic'->>'applicability_state' when 'FRESHNESS' then v->'epistemic'->>'freshness_state' when 'COVERAGE' then v->'epistemic'->>'coverage_state' when 'LIFECYCLE' then v->'lifecycle'->>'state' when 'REQUIREMENT' then v->>'requirement' when 'HOLDER' then v->>'holder_knowledge_state' when 'DISCLOSURE' then privacy->>'disclosure_result' end;
  if type in ('KNOWLEDGE','APPLICABILITY','FRESHNESS','COVERAGE','LIFECYCLE','REQUIREMENT','HOLDER','DISCLOSURE') then if code is distinct from expected or code is null then return false; end if;
  elsif type='REACTIVATION' then if code is distinct from 'REACTIVATION_RECORDED' or jsonb_array_length(v->'reactivation_refs')=0 then return false; end if;
  elsif type='INVALIDATOR' then if code is distinct from 'INVALIDATION_RECORDED' or jsonb_array_length(v->'invalidator_refs')=0 then return false; end if;
  else return false; end if;
 end loop;
 if (select count(*)<>count(distinct x) from jsonb_array_elements(v->'visible_reason_projection') x) then return false; end if;
 for id in select jsonb_array_elements_text(v->'visible_reason_projection') loop
  if not exists(select 1 from jsonb_array_elements(reasons) r where r->>'reason_id'=id) then return false; end if;
  if privacy->>'disclosure_result'='PROHIBITED' and not exists(select 1 from jsonb_array_elements(reasons) r where r->>'reason_id'=id and r->>'reason_type'='DISCLOSURE' and r->>'canonical_code'='PROHIBITED') then return false; end if;
 end loop;
 if privacy->>'disclosure_result'='PROHIBITED' and v->>'primary_visible_disposition'<>'PRIVACY_EXCLUDED' then return false; end if;
 return true;
exception when others then return false; end $$;
create function iris_b2_payload(kind text,v jsonb) returns boolean language plpgsql immutable as $$
declare state text; proof text; known boolean;
begin
 case kind
 when 'IDENTITY' then return iris_b2_repo_identity(v);
 when 'EPISTEMIC' then return iris_b2_epistemic(v);
 when 'TEMPORAL' then return iris_b2_temporal(v);
 when 'ROOT_DISPOSITION' then return iris_b2_root_disposition(v);
 when 'ENTITY' then return iris_b2_shape(v,array['entity_version','source','epistemic']) and coalesce(v->>'entity_version'='IRIS_B2_ENTITY_V1',false) and iris_b2_source(v->'source') and iris_b2_epistemic(v->'epistemic');
 when 'CURRENT' then return iris_b2_shape(v,array['subject','predicate','value','epistemic']) and iris_b2_identity(v->'subject') and iris_b2_text(v->'predicate') and iris_b2_epistemic(v->'epistemic');
 when 'LIFECYCLE' then
  return coalesce(iris_b2_shape(v,array['object','principal','version','state','last_event_ref','evidence_refs','basis_ref']) and iris_b2_identity(v->'object') and iris_b2_identity(v->'principal') and v->'principal'->>'kind'='PRINCIPAL' and iris_b2_version(v->'version') and iris_b2_text(v->'last_event_ref') and iris_b2_text(v->'basis_ref') and iris_b2_strings(v->'evidence_refs',true) and
  ((v->'object'->>'kind' in ('OBJECTIVE','OBLIGATION') and v->>'state' in ('NONTERMINAL','SATISFIED','SUPERSEDED','ABANDONED','UNKNOWN')) or (v->'object'->>'kind'='DECISION_REQUIREMENT' and v->>'state' in ('OPEN','RESOLVED','SUPERSEDED','ABANDONED','UNKNOWN'))),false);
 when 'EFFECT' then
  state=v->>'disposition'; proof=case state when 'NO_SUBMISSION_PROVEN' then 'POSITIVE_ABSENCE' when 'SUBMISSION_KNOWN' then 'SUBMISSION_ACCEPTED' when 'EFFECT_VERIFIED' then 'MATCHING_EFFECT' when 'NO_EFFECT_VERIFIED' then 'POSITIVE_ABSENCE' when 'PARTIAL_EFFECT' then 'PARTIAL_MATCH' when 'AMBIGUOUS_EFFECT' then 'AMBIGUOUS' when 'CONFLICTED_EFFECT' then 'CONFLICT' when 'RECONCILIATION_REQUIRED' then 'NONE' when 'UNAVAILABLE_READBACK' then 'UNAVAILABLE' when 'UNKNOWN' then 'NONE' end;
  return coalesce(iris_b2_shape(v,array['intent','operation_digest','occurrence','version','disposition','last_event_ref','proof','evidence_refs']) and iris_b2_identity(v->'intent') and v->'intent'->>'kind'='INTENT' and iris_b2_identity(v->'occurrence') and v->'occurrence'->>'kind'='CAUSAL_OCCURRENCE' and iris_b2_version(v->'version') and iris_b2_text(v->'operation_digest') and iris_b2_text(v->'last_event_ref') and iris_b2_strings(v->'evidence_refs',true) and v->>'proof'=proof,false);
 when 'RELATION' then
  return coalesce(iris_b2_shape(v,array['relation_id','principal','source','target','kind','version','temporal','evidence_refs']) and iris_b2_text(v->'relation_id') and iris_b2_identity(v->'principal') and v->'principal'->>'kind'='PRINCIPAL' and iris_b2_identity(v->'source') and iris_b2_identity(v->'target') and iris_b2_version(v->'version') and iris_b2_temporal(v->'temporal') and iris_b2_strings(v->'evidence_refs',true) and v->>'kind' in ('RESOLUTION_EQUIVALENCE','CONTEXT','PARENT_OCCURRENCE','REPRESENTATION_OF')
  and (v->>'kind'<>'RESOLUTION_EQUIVALENCE' or (v->'source'->>'kind'='RESOLUTION' and v->'target'->>'kind'='RESOLUTION')) and (v->>'kind'<>'PARENT_OCCURRENCE' or (v->'source'->>'kind'='CAUSAL_OCCURRENCE' and v->'target'->>'kind'='CAUSAL_OCCURRENCE' and v->'source'<>v->'target')) and (v->>'kind'<>'REPRESENTATION_OF' or v->'target'->>'kind'='CAUSAL_OCCURRENCE'),false);
 when 'CAUSAL_OCCURRENCE' then return coalesce(iris_b2_shape(v,array['occurrence','originating_ref','first_occurred_at','operation_digest','evidence_refs']) and iris_b2_identity(v->'occurrence') and v->'occurrence'->>'kind'='CAUSAL_OCCURRENCE' and iris_b2_identity(v->'originating_ref') and iris_b2_instant(v->'first_occurred_at') and iris_b2_text(v->'operation_digest') and iris_b2_strings(v->'evidence_refs',true),false);
 when 'CONTINUATION' then return coalesce(iris_b2_shape(v,array['claim','principal','causal_episode','owner_incarnation','generation','fence_token','temporal','admission_evidence_refs']) and iris_b2_identity(v->'claim') and v->'claim'->>'kind'='CONTINUATION' and iris_b2_identity(v->'principal') and v->'principal'->>'kind'='PRINCIPAL' and iris_b2_identity(v->'causal_episode') and v->'causal_episode'->>'kind'='CAUSAL_OCCURRENCE' and iris_b2_identity(v->'owner_incarnation') and v->'owner_incarnation'->>'kind' in ('WORKER','SUBSTRATE') and iris_b2_version(v->'generation') and iris_b2_text(v->'fence_token') and iris_b2_temporal(v->'temporal') and iris_b2_strings(v->'admission_evidence_refs',true),false);
 when 'ITEM_FACT' then
  known=v->'epistemic'->>'knowledge_state'='KNOWN' and v->'epistemic'->>'freshness_state'='CURRENT_AS_OF';
  if not coalesce(iris_b2_shape(v,array['root','principal','epistemic','requirement','disposition','disposition_evidence','reactivation_refs']) and iris_b2_identity(v->'root') and iris_b2_identity(v->'principal') and v->'principal'->>'kind'='PRINCIPAL' and iris_b2_epistemic(v->'epistemic') and v->>'requirement' in ('REQUIRED','NOT_REQUIRED_PROVEN','UNKNOWN') and v->>'disposition' in ('KNOWN_REQUIRED','RELEVANCE_UNKNOWN','TERMINAL_RETAINED','JUSTIFIED_NOT_APPLICABLE','PRIVACY_EXCLUDED','DEFERRED_SUPPRESSED_WITH_REACTIVATION','CONFLICT_HOLD','INVALID_REJECTED') and iris_b2_strings(v->'disposition_evidence') and iris_b2_strings(v->'reactivation_refs'),false) then return false; end if;
  if v->>'requirement'<>'UNKNOWN' and not (known and v->'epistemic'->>'applicability_state'<>'UNKNOWN') then return false; end if;
  case v->>'disposition'
   when 'KNOWN_REQUIRED' then return known and v->>'requirement'='REQUIRED' and v->'epistemic'->>'applicability_state'='APPLICABLE';
   when 'TERMINAL_RETAINED' then return known and v->'epistemic'->>'applicability_state' in ('SATISFIED','SUPERSEDED','ABANDONED');
   when 'JUSTIFIED_NOT_APPLICABLE' then return known and v->>'requirement'='NOT_REQUIRED_PROVEN' and v->'epistemic'->>'applicability_state'='NOT_APPLICABLE_PROVEN';
   when 'PRIVACY_EXCLUDED' then return iris_b2_strings(v->'disposition_evidence',true);
   when 'DEFERRED_SUPPRESSED_WITH_REACTIVATION' then return iris_b2_strings(v->'disposition_evidence',true) and iris_b2_strings(v->'reactivation_refs',true);
   when 'CONFLICT_HOLD' then return v->'epistemic'->>'knowledge_state'='CONFLICTED' or v->'epistemic'->>'coverage_state'='CONFLICTED';
   when 'INVALID_REJECTED' then return v->'epistemic'->>'knowledge_state' in ('INVALID','REJECTED');
   else return true;
  end case;
 else return false;
 end case;
exception when others then return false; end $$;
create function iris_b2_source_matches(src jsonb, v jsonb) returns boolean language plpgsql immutable as $$
declare fields jsonb; repr text; payload jsonb; token text; semantic text; id_field text;
begin
 if not iris_b2_source(src) then return false; end if;
 fields=src->'source';repr=src->>'representation_version';payload=v->'payload';
 if fields ? 'principal_id' and fields->>'principal_id'<>v->'principal'->>'id' then return false; end if;
 if fields ? 'version' and fields->'version'<>v->'version' then return false; end if;
 if repr in ('OBJECTIVE_V0','OBLIGATION_V0') then
  token=fields->>'status';semantic=case token when 'OPEN' then 'NONTERMINAL' when 'IN_PROGRESS' then 'NONTERMINAL' when 'WAITING' then 'NONTERMINAL' when 'HOLD' then 'NONTERMINAL' when 'UNKNOWN' then 'UNKNOWN' when 'SATISFIED' then 'SATISFIED' when 'ABANDONED' then 'ABANDONED' else null end;
  return coalesce(v->>'object_type'='LIFECYCLE' and payload->>'state'=semantic and v->'object'->>'kind'=case repr when 'OBJECTIVE_V0' then 'OBJECTIVE' else 'OBLIGATION' end and v->'object'->>'id'=fields->>case repr when 'OBJECTIVE_V0' then 'objective_id' else 'obligation_id' end,false);
 elsif repr='EFFECTVERIFICATION_V0' then
  semantic=case fields->>'disposition' when 'VERIFIED_EFFECT' then 'EFFECT_VERIFIED' when 'VERIFIED_NO_EFFECT' then 'NO_EFFECT_VERIFIED' when 'AMBIGUOUS_EFFECT' then 'AMBIGUOUS_EFFECT' when 'CONFLICT' then 'CONFLICTED_EFFECT' when 'UNKNOWN' then 'UNKNOWN' end;
  return coalesce(v->>'object_type'='EFFECT' and v->'object'->>'id'=fields->>'intent_id' and payload->>'disposition'=semantic,false);
 elsif repr='CURRENTASSERTION_V0' then
  return coalesce(v->>'object_type'='CURRENT' and payload->'subject'->>'id'=fields->>'subject_ref' and payload->>'predicate'=fields->>'predicate' and payload->'value'=fields->'value',false);
 end if;
 id_field=case repr when 'ACTIONDECISION_V0' then 'decision_id' when 'PRINCIPAL_V0' then 'principal_id' when 'ORIENTATIONSTATE_V0' then 'orientation_id' when 'EVIDENCEOCCURRENCE_V0' then 'occurrence_id' when 'ACTIONINTENT_V0' then 'intent_id' when 'ACTIONRECEIPT_V0' then 'receipt_id' when 'AUTHORITYPOLICY_V0' then 'policy_id' when 'PRIVACYPOLICY_V0' then 'policy_id' when 'CAPABILITYPROCEDURE_V0' then 'capability_id' when 'LEARNINGRECORD_V0' then 'learning_id' when 'WORKEPISODE_V0' then 'work_episode_id' end;
 return coalesce(v->>'object_type'='ENTITY' and payload->'source'=src and v->'object'->>'id'=fields->>id_field,false);
exception when others then return false; end $$;
create function iris_b2_record(v jsonb) returns boolean language plpgsql immutable as $$
declare ref jsonb; p jsonb; target jsonb; kind text;
begin
 if not iris_b2_shape(v,array['schema_version','record_id','event_ref','object_type','object','principal','version','temporal','evidence_refs','provenance_refs','privacy_refs','authority_refs','references','source_representations','payload']) then return false; end if;
 kind=v->>'object_type';p=v->'payload';
 if not coalesce(v->>'schema_version'='IRIS_B2_V1' and iris_b2_text(v->'record_id') and iris_b2_text(v->'event_ref') and iris_b2_repo_identity(v->'object') and iris_b2_identity(v->'principal') and v->'principal'->>'kind'='PRINCIPAL' and iris_b2_version(v->'version') and iris_b2_temporal(v->'temporal') and iris_b2_strings(v->'evidence_refs',true) and iris_b2_strings(v->'provenance_refs',true) and iris_b2_strings(v->'privacy_refs') and iris_b2_strings(v->'authority_refs') and jsonb_typeof(v->'references')='array' and jsonb_typeof(v->'source_representations')='array' and not exists(select 1 from jsonb_array_elements(v->'source_representations') x where not iris_b2_source(x)) and iris_b2_payload(kind,p),false) then return false; end if;
 for ref in select jsonb_array_elements(v->'references') loop if not(iris_b2_shape(ref,array['record_id','object','version']) and iris_b2_text(ref->'record_id') and iris_b2_repo_identity(ref->'object') and iris_b2_version(ref->'version')) then return false; end if; end loop;
 if (select count(*)<>count(distinct x) from jsonb_array_elements(v->'references') x) then return false; end if;
 target=case kind when 'IDENTITY' then p when 'LIFECYCLE' then p->'object' when 'ITEM_FACT' then p->'root' when 'CONTINUATION' then p->'claim' when 'CAUSAL_OCCURRENCE' then p->'occurrence' when 'EFFECT' then p->'intent' when 'CURRENT' then p->'subject' end;
 if target is not null and target<>v->'object' then return false; end if;
 if p ? 'principal' and p->'principal'<>v->'principal' then return false; end if;
 if p ? 'last_event_ref' and p->>'last_event_ref'<>v->>'event_ref' then return false; end if;
 if p ? 'version' and p->'version'<>v->'version' then return false; end if;
 if p ? 'temporal' and p->'temporal'<>v->'temporal' then return false; end if;
 if kind='TEMPORAL' and p<>v->'temporal' then return false; end if;
 if kind='ROOT_DISPOSITION' and (p->'root_ref'<>v->'object' or p->'principal_ref'<>v->'principal' or p->>'as_of'<>v->'temporal'->>'recorded_at') then return false; end if;
 if kind='ENTITY' then
  if not iris_b2_source_matches(p->'source',v) then return false; end if;
  if v->'object'->>'kind' is distinct from (case p->'source'->>'representation_version' when 'ACTIONDECISION_V0' then 'ACTION_DECISION' when 'PRINCIPAL_V0' then 'PRINCIPAL' when 'ORIENTATIONSTATE_V0' then 'ORIENTATION' when 'EVIDENCEOCCURRENCE_V0' then 'EVIDENCE' when 'ACTIONINTENT_V0' then 'INTENT' when 'ACTIONRECEIPT_V0' then 'RECEIPT' when 'AUTHORITYPOLICY_V0' then 'AUTHORITY_POLICY' when 'PRIVACYPOLICY_V0' then 'PRIVACY_POLICY' when 'CAPABILITYPROCEDURE_V0' then 'CAPABILITY' when 'LEARNINGRECORD_V0' then 'LEARNING' when 'WORKEPISODE_V0' then 'WORK_EPISODE' else null end) then return false; end if;
  if p->'source'->'source' ? 'principal_id' and p->'source'->'source'->>'principal_id'<>v->'principal'->>'id' then return false; end if;
  if p->'source'->'source' ? 'version' and p->'source'->'source'->'version'<>v->'version' then return false; end if;
 end if;

 for ref in select jsonb_array_elements(v->'source_representations') loop if not iris_b2_source_matches(ref,v) then return false; end if; end loop;
 if kind='EPISTEMIC' and p->>'as_of'<>v->'temporal'->>'recorded_at' then return false; end if;
 if kind in ('CURRENT','ITEM_FACT','ENTITY') and p->'epistemic'->>'as_of'<>v->'temporal'->>'recorded_at' then return false; end if;
 return true;
exception when others then return false; end $$;
create table iris_b2_repository_lock(singleton boolean primary key check(singleton));
insert into iris_b2_repository_lock values(true);
create table iris_b2_journal (
 sequence bigint generated always as identity primary key,
 principal_id text not null check(length(principal_id)>0), record_id text not null check(length(record_id)>0),
 event_ref text generated always as (command->'value'->>'event_ref') stored not null,
 version bigint not null check(version between 1 and 9007199254740991), command jsonb not null,
 decoder_version text not null default 'IRIS_B2_V1' check(decoder_version='IRIS_B2_V1'),
 unique(principal_id,record_id,version), unique(principal_id,record_id,event_ref),
 check(coalesce(iris_b2_shape(command,array['schema_version','expected_version','transition','value']) and command->>'schema_version'='IRIS_B2_V1' and iris_b2_version(command->'expected_version',0) and iris_b2_record(command->'value') and principal_id=command->'value'->'principal'->>'id' and record_id=command->'value'->>'record_id' and version=(command->'value'->>'version')::bigint and version=(command->>'expected_version')::bigint+1,false))
);
create function iris_b2_immutable() returns trigger language plpgsql as $$ begin raise exception 'CANONICAL_APPEND_ONLY'; end $$;
create trigger iris_b2_journal_immutable before update or delete on iris_b2_journal for each row execute function iris_b2_immutable();
create trigger iris_b2_journal_no_truncate before truncate on iris_b2_journal for each statement execute function iris_b2_immutable();
create function iris_b2_insert_integrity() returns trigger language plpgsql as $$
declare v jsonb; ref jsonb; prior iris_b2_journal; target jsonb; targets jsonb[]; principal jsonb;
begin
 perform singleton from iris_b2_repository_lock where singleton=true for update;
 if not found then raise exception 'REPOSITORY_LOCK_UNAVAILABLE'; end if;
 v=new.command->'value';principal=v->'principal';
 if v->>'object_type' in ('LIFECYCLE','EFFECT','CONTINUATION','ENTITY') and exists(select 1 from iris_b2_journal where principal_id=new.principal_id and record_id<>new.record_id and command->'value'->'object'=v->'object' and command->'value'->>'object_type'=v->>'object_type') then raise exception 'DUPLICATE_SEMANTIC_STREAM'; end if;
 if v->>'object_type'='RELATION' and exists(select 1 from iris_b2_journal where principal_id=new.principal_id and record_id<>new.record_id and command->'value'->>'object_type'='RELATION' and command->'value'->'payload'->>'relation_id'=v->'payload'->>'relation_id') then raise exception 'DUPLICATE_RELATION_ID'; end if;
 select * into prior from iris_b2_journal where principal_id=new.principal_id and record_id=new.record_id order by version desc limit 1;
 if new.version<>coalesce(prior.version,0)+1 then raise exception 'STALE_REPOSITORY_VERSION'; end if;
 if prior.sequence is not null and (prior.command->'value'->'object'<>v->'object' or prior.command->'value'->>'object_type'<>v->>'object_type' or (prior.command->'value'->'temporal'->>'recorded_at')::timestamptz>(v->'temporal'->>'recorded_at')::timestamptz) then raise exception 'IMMUTABLE_RECORD_BINDING_OR_RECORDING_REGRESSION'; end if;
 if not(v->>'object_type'='IDENTITY' and v->'object'=principal) and not exists(select 1 from iris_b2_journal where principal_id=new.principal_id and command->'value'->>'object_type'='IDENTITY' and command->'value'->'object'=principal and (command->'value'->'temporal'->>'recorded_at')::timestamptz <= (v->'temporal'->>'recorded_at')::timestamptz) then raise exception 'UNREGISTERED_PRINCIPAL'; end if;
 if v->>'object_type'<>'IDENTITY' and not exists(select 1 from iris_b2_journal where principal_id=new.principal_id and command->'value'->>'object_type'='IDENTITY' and command->'value'->'object'=v->'object' and (command->'value'->'temporal'->>'recorded_at')::timestamptz <= (v->'temporal'->>'recorded_at')::timestamptz) then raise exception 'UNREGISTERED_OBJECT'; end if;
 if v->>'object_type' in ('IDENTITY','CAUSAL_OCCURRENCE') and exists(select 1 from iris_b2_journal where principal_id=new.principal_id and command->'value'->>'object_type'=v->>'object_type' and command->'value'->'object'=v->'object') then raise exception 'DUPLICATE_IDENTITY_OR_OCCURRENCE'; end if;
 for ref in select jsonb_array_elements(v->'references') loop
  if not exists(select 1 from iris_b2_journal where principal_id=new.principal_id and record_id=ref->>'record_id' and version=(ref->>'version')::bigint and command->'value'->'object'=ref->'object' and (command->'value'->'temporal'->>'recorded_at')::timestamptz <= (v->'temporal'->>'recorded_at')::timestamptz) then raise exception 'DANGLING_OR_FUTURE_REFERENCE'; end if;
 end loop;
 targets=case v->>'object_type' when 'ROOT_DISPOSITION' then case when v->'payload'->'holder_ref'='null'::jsonb then array[v->'payload'->'privacy'->'recipient_ref'] else array[v->'payload'->'privacy'->'recipient_ref',v->'payload'->'holder_ref'] end when 'RELATION' then array[v->'payload'->'source',v->'payload'->'target'] when 'CAUSAL_OCCURRENCE' then array[v->'payload'->'originating_ref'] when 'CONTINUATION' then array[v->'payload'->'causal_episode',v->'payload'->'owner_incarnation'] when 'EFFECT' then array[v->'payload'->'occurrence'] else '{}'::jsonb[] end;
 foreach target in array targets loop if not exists(select 1 from jsonb_array_elements(v->'references') r where r->'object'=target) then raise exception 'PAYLOAD_REFERENCE_NOT_DECLARED'; end if; end loop;
 if v->>'object_type'='CURRENT' then
  if not coalesce(iris_b2_shape(new.command->'transition',array['event_id','kind','at','evidence_refs']) and new.command->'transition'->>'event_id'=v->>'event_ref' and new.command->'transition'->>'at'=v->'temporal'->>'recorded_at' and iris_b2_strings(new.command->'transition'->'evidence_refs',true) and new.command->'transition'->>'kind' in ('ASSERT','CORRECTION','SUPERSESSION','REVOCATION','EXPIRY') and (case when prior.sequence is null then new.command->'transition'->>'kind'='ASSERT' else new.command->'transition'->>'kind'<>'ASSERT' end),false) then raise exception 'CURRENT_EVENT_HOLD'; end if;
  if prior.sequence is not null and prior.command->'value'->'payload'->>'predicate'<>v->'payload'->>'predicate' then raise exception 'CURRENT_BINDING_DRIFT'; end if;
  if exists(select 1 from iris_b2_journal where principal_id=new.principal_id and record_id<>new.record_id and command->'value'->>'object_type'='CURRENT' and command->'value'->'object'=v->'object' and command->'value'->'payload'->>'predicate'=v->'payload'->>'predicate') then raise exception 'DUPLICATE_CURRENT_STREAM'; end if;
 end if;
 return new;
end $$;
create trigger iris_b2_journal_integrity before insert on iris_b2_journal for each row execute function iris_b2_insert_integrity();
create trigger iris_b2_lock_no_delete before delete on iris_b2_repository_lock for each row execute function iris_b2_immutable();
create trigger iris_b2_lock_no_truncate before truncate on iris_b2_repository_lock for each statement execute function iris_b2_immutable();
