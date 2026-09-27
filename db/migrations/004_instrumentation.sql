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
