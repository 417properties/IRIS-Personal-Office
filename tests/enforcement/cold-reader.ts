import {readFileSync} from 'node:fs';
import {MemoryEnforcementRepository,PostgresEnforcementRepository} from '../../src/enforcement/backends.ts';
import {ReleaseService} from '../../src/enforcement/repository.ts';
import {T1,principal} from './fixtures.ts';
const [mode,path,requestFile]=process.argv.slice(2),request=JSON.parse(readFileSync(requestFile!,'utf8'));let repo,db:any;
if(mode==='MEMORY'){repo=new MemoryEnforcementRepository(()=>T1);await repo.importSnapshot(readFileSync(path!,'utf8'));}
else{const m=await import(process.env.IRIS_B2_PGLITE_MODULE??'@electric-sql/pglite');db=new m.PGlite(path);const adapt=(tx:any)=>({query:async(sql:string,args?:unknown[])=>(await tx.query(sql,args)).rows});repo=new PostgresEnforcementRepository({...adapt(db),transaction:(work:any)=>db.transaction((tx:any)=>work(adapt(tx)))},()=>T1);}
let calls=0;const service=new ReleaseService(repo,{binding:{tool_id:request.intent.tool_id,configuration_digest:request.intent.configuration_digest,capability_id:request.intent.capability_id,qualification_id:request.intent.qualification_id},preflight:async()=>({ready:true}),submit:async()=>{calls++;throw Error('COLD_SUBMISSION_FORBIDDEN');}},{principal:request.intent.principal,grantee:request.intent.grantee,incarnation:request.intent.incarnation,configuration_digest:request.intent.configuration_digest});
const before=await repo.reconstruct(principal,T1);let result;try{result=await service.release(request);}catch(e){result={error:(e as Error).message};}console.log(JSON.stringify({before,result,calls,next_safe_action:before.enforcement.attempts.length?await repo.nextSafeAction(request.attempt):'HOLD_NO_PREPARED_ATTEMPT'}));await db?.close();
