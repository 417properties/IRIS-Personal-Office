import {EnforcementRepository,decodeEnforcementSnapshot,type EnforcementBackend,type EnforcementEvent,type AtomicView} from './repository.ts';
import {ENFORCEMENT_SCHEMA} from './contracts.ts';
import {MemoryCanonicalRepository,canonicalJSON,type CanonicalRepository,type AppendCommand} from '../state/repository.ts';
import {PostgresCanonicalRepository,type TransactionalSqlExecutor,type SqlExecutor} from '../state/postgres-repository.ts';
import {parseJSON} from '../domain/json.ts';
import {demand,freeze} from '../semantic-kernel/validation.ts';
const defaultClock=()=>new Date().toISOString();
function serialize<T>(queue:{tail:Promise<unknown>},work:()=>Promise<T>):Promise<T>{const p=queue.tail.then(work);queue.tail=p.catch(()=>{});return p;}
export class MemoryEnforcementRepository extends EnforcementRepository {
 constructor(clock:()=>string=defaultClock){
  const inner=new MemoryCanonicalRepository(),queue={tail:Promise.resolve() as Promise<unknown>};let events:EnforcementEvent[]=[];
  const guarded=<T>(work:()=>Promise<T>)=>serialize(queue,work);
  const canonical:CanonicalRepository={append:c=>guarded(()=>inner.append(c)),history:q=>guarded(()=>inner.history(q)),current:q=>guarded(()=>inner.current(q)),reconstruct:q=>guarded(()=>inner.reconstruct(q)),exportSnapshot:()=>guarded(()=>inner.exportSnapshot()),importSnapshot:wire=>guarded(async()=>{demand(events.length===0,'B3_HISTORY_REQUIRES_COMPOSITE_IMPORT');await inner.importSnapshot(wire);})};
  const capture=async()=>parseJSON(await inner.exportSnapshot()) as {commands:AppendCommand[];records:unknown[];schema_version:string};
  const backend:EnforcementBackend={canonical,clock,atomic:work=>guarded(async()=>{
   const c=await capture();let pending:EnforcementEvent|null=null;
   const result=await work({canonical:inner,canonical_commands:c.commands,events:freeze(events),append:async e=>{demand(pending===null,'ONE_ENFORCEMENT_EVENT_PER_TRANSACTION');pending=freeze(e);}});
   if(pending!==null)events.push(pending);return result;
  }),exportSnapshot:()=>guarded(async()=>canonicalJSON({schema_version:ENFORCEMENT_SCHEMA,canonical:await capture(),events})),importSnapshot:wire=>guarded(async()=>{
   demand(events.length===0&&(await capture()).commands.length===0,'IMPORT_REQUIRES_EMPTY_STORE');const decoded=await decodeEnforcementSnapshot(wire);await inner.importSnapshot(canonicalJSON(decoded.canonical));events=structuredClone(decoded.events);
  })};super(backend);
 }
}
export class PostgresEnforcementRepository extends EnforcementRepository {
 constructor(sql:TransactionalSqlExecutor,clock:()=>string=defaultClock){
  const canonical=new PostgresCanonicalRepository(sql);
  const locked=<T>(work:(tx:SqlExecutor)=>Promise<T>)=>sql.transaction(async tx=>{const rows=await tx.query<{singleton:boolean}>('select singleton from iris_b2_repository_lock where singleton=true for update');demand(rows.length===1&&rows[0]!.singleton===true,'REPOSITORY_LOCK_UNAVAILABLE');return work(tx);});
  const read=async(tx:SqlExecutor)=>{
   const commands=(await tx.query<{command:AppendCommand}>('select command from iris_b2_journal order by sequence')).map(r=>r.command);
   const events=(await tx.query<{event:EnforcementEvent}>('select event from iris_b3_enforcement_journal order by sequence')).map(r=>r.event);return {commands,events};
  };
  const backend:EnforcementBackend={canonical,clock,atomic:work=>locked(async tx=>{
   const {commands,events}=await read(tx);const pinned:TransactionalSqlExecutor={query:tx.query.bind(tx),transaction:async()=>{throw new Error('NESTED_TRANSACTION_FORBIDDEN');}};
   const view:AtomicView={canonical:new PostgresCanonicalRepository(pinned),canonical_commands:commands,events,append:async event=>{await tx.query('insert into iris_b3_enforcement_journal(sequence,event) values($1,$2::jsonb)',[event.sequence,JSON.stringify(event)]);}};return work(view);
  }),exportSnapshot:()=>locked(async tx=>{
   const {commands,events}=await read(tx);const wire=canonicalJSON({schema_version:ENFORCEMENT_SCHEMA,canonical:{schema_version:'IRIS_B2_V1',commands,records:commands.map(c=>c.value)},events});await decodeEnforcementSnapshot(wire);return wire;
  }),importSnapshot:async wire=>{const d=await decodeEnforcementSnapshot(wire);await locked(async tx=>{
   const before=await read(tx);demand(before.commands.length===0&&before.events.length===0,'IMPORT_REQUIRES_EMPTY_STORE');
   for(const c of d.commands)await tx.query('insert into iris_b2_journal(principal_id,record_id,version,command) values($1,$2,$3,$4::jsonb)',[c.value.principal.id,c.value.record_id,c.value.version,JSON.stringify(c)]);
   for(const e of d.events)await tx.query('insert into iris_b3_enforcement_journal(sequence,event) values($1,$2::jsonb)',[e.sequence,JSON.stringify(e)]);
  });}};super(backend);
 }
}
