-- B4 extends the existing enforcement journal in the existing store. B3's
-- immutable migrations, canonical capture guard and append-only trigger remain.
do $$ declare constraint_name text; begin
 for constraint_name in select conname from pg_constraint where conrelid='iris_b3_enforcement_journal'::regclass and contype='c' and pg_get_constraintdef(oid) like '%ADMIT_CONTINUATION%' loop
  execute format('alter table iris_b3_enforcement_journal drop constraint %I',constraint_name);
 end loop;
end $$;
alter table iris_b3_enforcement_journal add constraint iris_b4_command_kind check (
 event->'command'->>'kind' in ('ADMIT_CONTINUATION','TRANSFER_CONTINUATION','REVOKE','ISSUE_LEASE','PREPARE','RELEASE','PRE_SUBMISSION_FAILURE','COMPLETE','AMBIGUOUS','VERIFY_EFFECT','RECONCILE_CLOSURE','AUTHORIZE_VERIFIED_RETRY','QUALIFY_CHECKPOINT','VERIFY_PROJECTION')
);
