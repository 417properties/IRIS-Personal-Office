import { readFileSync } from 'node:fs';
import { migrationFiles } from '../../src/state/migrations.ts';
import type { SqlExecutor, TransactionalSqlExecutor } from '../../src/state/postgres-repository.ts';
export const HISTORICAL_PGCRYPTO_SHIM = `create function digest(input text, algorithm text) returns bytea language plpgsql immutable as $$ begin if algorithm <> 'sha256' then raise exception 'unsupported qualification algorithm'; end if; return sha256(convert_to(input,'UTF8')); end $$;`;
export async function engine(path?:string,dataDir?:string){
 const module=await import(path??process.env.IRIS_B2_PGLITE_MODULE??'@electric-sql/pglite');
 const db=new module.PGlite(dataDir);
 const applied:string[]=[];
 for(const file of migrationFiles){const sql=readFileSync(new URL('../../'+file,import.meta.url),'utf8').replace('create extension if not exists pgcrypto;',()=>HISTORICAL_PGCRYPTO_SHIM);await db.exec(sql);applied.push(file);}
 const adapt=(client:any):SqlExecutor=>({query:async<T>(sql:string,args?:unknown[])=> (await client.query(sql,args)).rows as T[]});
 const executor:TransactionalSqlExecutor={...adapt(db),transaction:work=>db.transaction((tx:any)=>work(adapt(tx)))};
 return {db,executor,applied};
}
