create table big_delta_quarantine (
  delta_id text primary key,
  source_system text not null check(source_system='BIG'),
  target_system text not null check(target_system='IRIS'),
  delta_class text not null,
  content_ref text not null,
  evidence_refs jsonb not null,
  qualification text not null,
  authority_effect text not null check(authority_effect='NONE'),
  privacy_scope jsonb not null,
  applicability jsonb not null,
  expires_at timestamptz
);
create table instrumentation_event (
  event_id text primary key,
  event_type text not null,
  work_episode_id text,
  payload jsonb not null,
  occurred_at timestamptz not null
);

-- B2: historical source tables have an explicit V0 decoder owner.
alter table big_delta_quarantine add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table instrumentation_event add column decoder_version text not null default 'IRIS_LEGACY_V0' check(decoder_version='IRIS_LEGACY_V0');
alter table big_delta_quarantine add check(evidence_refs is null or jsonb_typeof(evidence_refs)='array');
alter table big_delta_quarantine add check(privacy_scope is null or jsonb_typeof(privacy_scope)='array');
alter table big_delta_quarantine add check(applicability is null or jsonb_typeof(applicability)='array');
alter table instrumentation_event add check(payload is null or jsonb_typeof(payload)='object');
