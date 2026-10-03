-- IRIS_B3_V1 enforcement extension. Source qualification only, no hosted migration.
-- B2's singleton is the common linearization lock for Current and enforcement.
create table iris_b3_enforcement_journal (
 sequence bigint primary key check(sequence > 0),
 event jsonb not null,
 check(jsonb_typeof(event) = 'object'),
 check(event ?& array['schema_version','sequence','at','canonical_count','canonical_digest','command','result']),

 check(event->>'schema_version' = 'IRIS_B3_V1'),
 check((event->>'sequence')::bigint = sequence),
 check(jsonb_typeof(event->'sequence') = 'number'),
 check(jsonb_typeof(event->'at') = 'string'),
 check(jsonb_typeof(event->'canonical_count') = 'number'),
 check((event->>'canonical_count')::bigint >= 0),
 check(jsonb_typeof(event->'canonical_digest') = 'string'),
 check(event->>'canonical_digest' ~ '^[0-9a-f]{64}$'),
 check(jsonb_typeof(event->'command') = 'object'),
 check(jsonb_typeof(event->'result') = 'object'),
 check(event->'command' ?& array['kind','value']),
 check(jsonb_typeof(event->'command'->'value') = 'object'),
 check(event->'command'->>'kind' in ('ADMIT_CONTINUATION','TRANSFER_CONTINUATION','REVOKE','ISSUE_LEASE','PREPARE','RELEASE','PRE_SUBMISSION_FAILURE','COMPLETE','AMBIGUOUS'))
);
create function iris_b3_append_integrity() returns trigger language plpgsql as $$
declare prior jsonb; canonical_count bigint;
begin
 perform singleton from iris_b2_repository_lock where singleton=true for update;
 if exists(select 1 from jsonb_each(new.event) where value='null'::jsonb) then raise exception 'B3_NULL_COORDINATE'; end if;
 if jsonb_typeof(new.event->'command'->'kind') is distinct from 'string' then raise exception 'B3_COMMAND_KIND_REQUIRED'; end if;
 select event into prior from iris_b3_enforcement_journal order by sequence desc limit 1;
 if new.sequence <> coalesce((prior->>'sequence')::bigint,0)+1 then raise exception 'B3_NONCONTIGUOUS_EVENT'; end if;
 select count(*) into canonical_count from iris_b2_journal;
 if (new.event->>'canonical_count')::bigint <> canonical_count then raise exception 'B3_CANONICAL_CAPTURE_COUNT'; end if;
 if prior is not null and (new.event->>'at')::timestamptz < (prior->>'at')::timestamptz then raise exception 'B3_TIME_REGRESSION'; end if;
 if (select count(*) from jsonb_object_keys(new.event)) <> 7 then raise exception 'B3_UNMAPPED_EVENT_COORDINATE'; end if;
 if (select count(*) from jsonb_object_keys(new.event->'command')) <> 2 then raise exception 'B3_UNMAPPED_COMMAND_COORDINATE'; end if;
 return new;
end $$;
create trigger iris_b3_append_integrity before insert on iris_b3_enforcement_journal for each row execute function iris_b3_append_integrity();
create function iris_b3_append_only() returns trigger language plpgsql as $$ begin raise exception 'B3_APPEND_ONLY'; end $$;
create trigger iris_b3_no_mutation before update or delete on iris_b3_enforcement_journal for each row execute function iris_b3_append_only();
create trigger iris_b3_no_truncate before truncate on iris_b3_enforcement_journal for each statement execute function iris_b3_append_only();
