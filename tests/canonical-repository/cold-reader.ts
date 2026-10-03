import {readFileSync} from 'node:fs';
import {MemoryCanonicalRepository} from '../../src/state/repository.ts';
import {PostgresCanonicalRepository} from '../../src/state/postgres-repository.ts';
import {parseJSON} from '../../src/domain/json.ts';
const [mode,location,queryFile]=process.argv.slice(2);
const query=parseJSON(readFileSync(queryFile!,'utf8'));
let repo:any,db:any;
if(mode==='MEMORY'){repo=new MemoryCanonicalRepository();await repo.importSnapshot(readFileSync(location!,'utf8'));}
else {const m=await import(process.env.IRIS_B2_PGLITE_MODULE??'@electric-sql/pglite');db=new m.PGlite(location);repo=new PostgresCanonicalRepository({query:async(sql:string,args?:unknown[])=> (await db.query(sql,args)).rows,transaction:(work:any)=>db.transaction((tx:any)=>work({query:async(sql:string,args?:unknown[])=>(await tx.query(sql,args)).rows}))});}
try{process.stdout.write(JSON.stringify(await repo.reconstruct(query)));}finally{await db?.close();}
