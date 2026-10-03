import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawnSync} from 'node:child_process';
import {setup,service,principal,T1,claim,successor} from './fixtures.ts';
for(const mode of ['MEMORY','SQL'] as const)for(const phase of ['PREPARED','SUBMITTING','RELEASED_SUBMITTED','AMBIGUOUS_SUBMISSION','FENCED','REVOKED'] as const)test(`${mode} fresh-process ${phase} reconstruction has no inherited execution custody`,async()=>{
 const dir=mkdtempSync(join(tmpdir(),'iris-b3-cold-')),path=join(dir,mode==='SQL'?'database':'snapshot.json'),s=await setup(mode,{dataDir:mode==='SQL'?path:undefined}),f=service(s);let closed=false;
 try{
  await s.repo.command({kind:'PREPARE',value:{intent:s.i,attempt:s.a,fence:s.c}});
  if(phase==='SUBMITTING')await s.repo.command({kind:'RELEASE',value:{attempt:s.a,dispatch_id:'lost-process',retry:false}});
  if(phase==='RELEASED_SUBMITTED')await f.service.release(f.request);
  if(phase==='AMBIGUOUS_SUBMISSION'){await s.repo.command({kind:'RELEASE',value:{attempt:s.a,dispatch_id:'lost-process',retry:false}});await s.repo.command({kind:'AMBIGUOUS',value:{attempt:s.a,dispatch_id:'lost-process',evidence_refs:['source:unavailable-completion']}});}
  if(phase==='FENCED')await s.repo.command({kind:'TRANSFER_CONTINUATION',value:{expected:s.c,successor:claim(successor,2)}});
  if(phase==='REVOKED')await s.repo.command({kind:'REVOKE',value:{principal,domain:s.i.authority_domain,expected_generation:1,evidence_refs:['source:revocation']}});
  const expected=await s.repo.reconstruct(principal,T1),wire=await s.repo.exportSnapshot();if(mode==='MEMORY')writeFileSync(path,wire);await s.close();closed=true;
  const request=join(dir,'request.json');writeFileSync(request,JSON.stringify(f.request));const child=spawnSync(process.execPath,['--experimental-strip-types',new URL('./cold-reader.ts',import.meta.url).pathname,mode,path,request],{encoding:'utf8',timeout:30000});assert.equal(child.status,0,child.stderr);const out=JSON.parse(child.stdout);assert.deepEqual(out.before,expected);assert.equal(out.before.admission,'NOT_ADJUDICATED');assert.equal(out.before.effect_verification,'NOT_ADJUDICATED');
  if(['SUBMITTING','AMBIGUOUS_SUBMISSION','RELEASED_SUBMITTED','FENCED','REVOKED'].includes(phase))assert.equal(out.calls,0);else{assert.equal(out.calls,1);assert.equal(out.result.state,'AMBIGUOUS_SUBMISSION');}
 }finally{if(!closed)await s.close();rmSync(dir,{recursive:true,force:true});}
});
