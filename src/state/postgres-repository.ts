import { decodeCommand, validateAppend, ValidatedRepository, type Journal, type AppendCommand } from './repository.ts';
import { demand } from '../semantic-kernel/validation.ts';
export interface SqlExecutor { query<T=Record<string,unknown>>(text:string,params?:unknown[]):Promise<T[]> }
export interface TransactionalSqlExecutor extends SqlExecutor {
  transaction<T>(work:(tx:SqlExecutor)=>Promise<T>):Promise<T>;
}
// A connection-pinned transaction is mandatory. Never emulate with pool.query
// BEGIN/COMMIT or expose a live executor as repository state.
export class PostgresCanonicalRepository extends ValidatedRepository {
  constructor(sql:TransactionalSqlExecutor){
    const read=async(tx:SqlExecutor)=>{
      const rows=await tx.query<{command:unknown}>('select command from iris_b2_journal order by sequence');
      return rows.map(x=>decodeCommand(x.command));
    };
    const locked=async<T>(work:(tx:SqlExecutor)=>Promise<T>)=>sql.transaction(async tx=>{
      const rows=await tx.query<{singleton:boolean}>('select singleton from iris_b2_repository_lock where singleton=true for update');demand(rows.length===1&&rows[0]!.singleton===true,'REPOSITORY_LOCK_UNAVAILABLE');return work(tx);
    });
    const insert=async(tx:SqlExecutor,c:AppendCommand)=>{
      await tx.query('insert into iris_b2_journal(principal_id,record_id,version,command) values($1,$2,$3,$4::jsonb)',[c.value.principal.id,c.value.record_id,c.value.version,JSON.stringify(c)]);
    };
    const journal:Journal={read:()=>read(sql),append:c=>locked(async tx=>{
      const prior=await read(tx);validateAppend(prior.map(x=>x.value),c);await insert(tx,c);
    }),importEmpty:commands=>locked(async tx=>{
      demand((await read(tx)).length===0,'IMPORT_REQUIRES_EMPTY_STORE');
      const prior:AppendCommand[]=[];
      for(const c of commands){validateAppend(prior.map(x=>x.value),c);await insert(tx,c);prior.push(c);}
    })};
    super(journal);
  }
}
