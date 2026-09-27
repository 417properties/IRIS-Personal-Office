create table work_episode (
  work_episode_id text primary key,
  principal_id text not null references principal(principal_id),
  objective_id text not null references objective(objective_id),
  obligation_id text references obligation(obligation_id),
  episode_generation integer not null,
  continuation_of_episode_id text,
  causal_episode_id text not null,
  state_version_at_start integer not null,
  orientation_version_at_start integer not null,
  authority_snapshot_digest text not null,
  privacy_snapshot_digest text not null,
  toolset_digest text not null,
  cognition_profile text not null,
  workflow_runtime_ref text,
  status text not null,
  started_at timestamptz not null,
  last_checkpoint_at timestamptz not null,
  ended_at timestamptz
);
create unique index work_episode_active_generation
  on work_episode(causal_episode_id,episode_generation)
  where ended_at is null;
