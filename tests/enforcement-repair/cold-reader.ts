import {readFileSync} from 'node:fs';
import {MemoryEnforcementRepository,PostgresEnforcementRepository} from '../../src/enforcement/backends.ts';
import {principal} from '../enforcement/fixtures.ts';
const [mode,path,cutsFile]=process.argv.slice(2),cuts=JSON.parse(readFileSync(cutsFile!,'utf8'));let db:any,repo;
if(mode==='MEMORY'){repo=new MemoryEnforcementRepository(()=>cuts.at(-1));await repo.importSnapshot(readFileSync(path!,'utf8'));}
else{const m=await import(process.env.IRIS_B2_PGLITE_MODULE??'@electric-sql/pglite');db=new m.PGlite(path);const adapt=(tx:any)=>({query:async(sql:string,args?:unknown[])=>(await tx.query(sql,args)).rows});repo=new PostgresEnforcementRepository({...adapt(db),transaction:(work:any)=>db.transaction((tx:any)=>work(adapt(tx)))},()=>cuts.at(-1));}
console.log(JSON.stringify({wire:await repo.exportSnapshot(),cuts:await Promise.all(cuts.map((at:string)=>repo.reconstruct(principal,at))),state:await repo.inspect()}));await db?.close();
