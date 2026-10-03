import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawnSync} from 'node:child_process';
import {setup,service,receipt,deferred,principal,T0,T1,T2,T3,claim,successor,worker,redigest,delegation,authorityDoc,currentDoc,time} from '../enforcement/fixtures.ts';
import {identity} from '../../src/semantic-kernel/identity.ts';
import {command,identityRow,value,reference} from '../canonical-repository/fixtures.ts';
import {digest,authorityPredicate} from '../../src/enforcement/contracts.ts';
import {MemoryEnforcementRepository,PostgresEnforcementRepository} from '../../src/enforcement/backends.ts';
import {engine} from '../canonical-repository/sql-fixture.ts';
const T4='2026-10-01T04:00:00.000Z',T5='2026-10-01T05:00:00.000Z';
async function second(s:Awaited<ReturnType<typeof setup>>){
 const a=identity('RELEASE_ATTEMPT','attempt:B'),c={...claim(successor),claim:identity('CONTINUATION','claim:B'),causal_episode:identity('CAUSAL_OCCURRENCE','cause:B')};
 const i=redigest({...s.i,intent:identity('INTENT','intent:B'),grantee:successor,incarnation:successor,causal_episode:c.causal_episode,work_episode:identity('WORK_EPISODE','work:B'),occurrence:identity('CAUSAL_OCCURRENCE','occurrence:B'),authority_domain:'domain:B',lease_id:'lease:B',idempotency_key:'key:B',delegation_digest:digest(delegation(successor))});
 for(const ref of [i.intent,i.causal_episode,i.work_episode,i.occurrence,c.claim])await s.repo.canonical.append(command(identityRow(ref)));
 const row=value('CONTINUATION',c,c.claim,'continuation:B');row.temporal=time();row.references=[reference(c.causal_episode),reference(c.owner_incarnation)];await s.repo.canonical.append(command(row));
 const doc=currentDoc(authorityDoc(i,a));doc.value.record_id='current:B';(doc.value.payload as any).predicate=authorityPredicate(i.authority_domain);await s.repo.canonical.append(command(doc.value));
 await s.repo.command({kind:'ADMIT_CONTINUATION',value:{claim:c}});await s.repo.command({kind:'ISSUE_LEASE',value:{intent:i,attempt:a,fence:c}});await s.repo.command({kind:'PREPARE',value:{intent:i,attempt:a,fence:c}});
 return {...s,i,a,c};
}
for(const mode of ['MEMORY','SQL'] as const){
 for(const mutation of ['replace','nested','retry','fence','intent','during-submit'] as const)test(`${mode} whole invocation pinned: ${mutation}`,async()=>{
  const s=await setup(mode);try{const b=await second(s),gate=deferred<void>(),entered=deferred<void>(),submitted:unknown[]=[];
   const f=service(s,{preflight:async()=>{entered.resolve();await gate.promise;return {ready:true};},submit:async(i,a)=>{submitted.push(a);if(mutation==='during-submit')f.request.attempt=b.a;return receipt(i,a);}});
   f.request=structuredClone(f.request);const pending=f.service.release(f.request);await entered.promise;
   if(mutation==='replace')f.request.attempt=b.a;if(mutation==='nested')f.request.attempt.id=b.a.id;if(mutation==='retry')f.request.retry=true;if(mutation==='fence')f.request.fence.owner_incarnation.id='foreign';if(mutation==='intent')f.request.intent=b.i;
   gate.resolve();const result=await pending;assert.equal(result.state,'RELEASED_SUBMITTED');assert.deepEqual(result.attempt,s.a);assert.deepEqual(submitted,[s.a]);assert.equal((await s.repo.getAttempt(b.a)).state,'PREPARED');
   const wrongActor=service(b,undefined,{principal:s.i.principal,grantee:s.i.grantee,incarnation:s.i.incarnation,configuration_digest:s.i.configuration_digest});await assert.rejects(()=>wrongActor.service.release(wrongActor.request),/ACTOR_BINDING/);assert.equal(wrongActor.calls(),0);
   const copy=new MemoryEnforcementRepository(()=>T5);await copy.importSnapshot(await s.repo.exportSnapshot());assert.deepEqual(await copy.inspect(),await s.repo.inspect());
  }finally{await s.close();}
 });
 for(const field of ['intent','attempt','fence','retry'])test(`${mode} rejects accessor invocation ${field} without reading getter`,async()=>{const s=await setup(mode);try{const f=service(s);let reads=0;Object.defineProperty(f.request,field,{enumerable:true,get(){reads++;return field==='retry'?false:(s as any)[field==='intent'?'i':field==='attempt'?'a':'c'];}});await assert.rejects(()=>f.service.release(f.request),/DATA_COORDINATES/);assert.equal(reads,0);assert.equal(f.calls(),0);}finally{await s.close();}});
 test(`${mode} command captured before queue and journal uses same deep command`,async()=>{const s=await setup(mode);try{const input={kind:'TRANSFER_CONTINUATION',value:{expected:structuredClone(s.c),successor:claim(successor,2)}},captured=structuredClone(input),pending=s.repo.command(input);input.value.successor.fence_token='caller-mutated';input.value.expected.owner_incarnation.id='foreign';const result=await pending;assert.deepEqual(result,captured.value.successor);const wire=await s.repo.exportSnapshot();assert.deepEqual(JSON.parse(wire).events.at(-1).command,captured);const copy=new MemoryEnforcementRepository(()=>T5);await copy.importSnapshot(wire);assert.deepEqual(await copy.inspect(),await s.repo.inspect());}finally{await s.close();}});
 test(`${mode} canonical and reconstruction queries capture before await`,async()=>{const s=await setup(mode);try{const row=structuredClone(command(identityRow(identity('INTENT','queued:identity')))),captured=structuredClone(row),pending=s.repo.canonical.append(row);row.value.object.id='changed';await pending;assert.deepEqual(JSON.parse(await s.repo.exportSnapshot()).canonical.commands.at(-1),captured);const query={schema_version:'IRIS_B2_V1' as const,principal:structuredClone(principal),as_of:T1},q=s.repo.canonical.history(query);query.principal.id='foreign';assert.ok((await q).length>0);const ref=structuredClone(s.a);await s.repo.command({kind:'PREPARE',value:{intent:s.i,attempt:s.a,fence:s.c}});const p=s.repo.getAttempt(ref);ref.id='foreign';assert.deepEqual((await p).attempt,s.a);const principalInput=structuredClone(principal),r=s.repo.reconstruct(principalInput,T1);principalInput.id='foreign';assert.deepEqual((await r).canonical.principal,principal);}finally{await s.close();}});
 for(const target of ['MEMORY','SQL'] as const)test(`${mode} -> fresh ${target}: interleaving, as-of cuts, Current tail, fencing, revoke, submitting and ambiguity`,async()=>{
  const dir=mkdtempSync(join(tmpdir(),'iris-b3-repair-')),path=join(dir,target==='SQL'?'database':'snapshot.json'),s=await setup(mode);let e:Awaited<ReturnType<typeof engine>>|null=null;try{
   await s.repo.command({kind:'PREPARE',value:{intent:s.i,attempt:s.a,fence:s.c}});
   s.setNow(T2);const b=await second(s); // canonical advancement after earlier enforcement
   await s.repo.command({kind:'RELEASE',value:{attempt:s.a,dispatch_id:'dispatch:A',retry:false}});
   await s.repo.command({kind:'RELEASE',value:{attempt:b.a,dispatch_id:'dispatch:B',retry:false}});
   s.setNow(T3);await s.repo.command({kind:'AMBIGUOUS',value:{attempt:b.a,dispatch_id:'dispatch:B',evidence_refs:['possible:submission']}});
   await s.repo.canonical.append(currentDoc({...authorityDoc(),permission:'DENY'},2,T3));
   await s.repo.command({kind:'TRANSFER_CONTINUATION',value:{expected:s.c,successor:claim(successor,2)}});
   s.setNow(T4);await s.repo.command({kind:'REVOKE',value:{principal,domain:s.i.authority_domain,expected_generation:1,evidence_refs:['source:revoke']}});
   await s.repo.canonical.append(currentDoc(authorityDoc(),3,T4)); // canonical-only tail
   await s.repo.canonical.append(command(identityRow(identity('INTENT','tail:identity'))));
   const wire=await s.repo.exportSnapshot(),original=JSON.parse(wire);assert.ok(new Set(original.events.map((e:any)=>e.canonical_count)).size>=3);assert.ok(original.events.some((e:any,n:number)=>n>0&&e.canonical_count===original.events[n-1].canonical_count));assert.ok(original.events.at(-1).canonical_count<original.canonical.commands.length);
   e=target==='SQL'?await engine(undefined,path):null;const copy=e?new PostgresEnforcementRepository(e.executor,()=>T5):new MemoryEnforcementRepository(()=>T5);await copy.importSnapshot(wire);
   assert.equal(await copy.exportSnapshot(),wire);assert.deepEqual(await copy.inspect(),await s.repo.inspect());for(const cut of [T0,T1,T2,T3,T4,T5])assert.deepEqual(await copy.reconstruct(principal,cut),await s.repo.reconstruct(principal,cut));
   assert.equal((await copy.getAttempt(s.a)).state,'SUBMITTING');assert.equal((await copy.getAttempt(b.a)).state,'AMBIGUOUS_SUBMISSION');assert.equal(await copy.nextSafeAction(s.a),'RECONCILIATION_REQUIRED');assert.equal(await copy.nextSafeAction(b.a),'RECONCILIATION_REQUIRED');
   const f=service({...s,repo:copy}),g=service({...b,repo:copy});assert.equal((await f.service.release(f.request)).state,'SUBMITTING');assert.equal((await g.service.release(g.request)).state,'AMBIGUOUS_SUBMISSION');assert.equal(f.calls()+g.calls(),0);assert.equal(await copy.exportSnapshot(),wire);
   const cuts=[T0,T1,T2,T3,T4,T5],expected=await Promise.all(cuts.map(at=>s.repo.reconstruct(principal,at))),expectedState=await s.repo.inspect();if(target==='MEMORY')writeFileSync(path,wire);await e?.db.close();e=null;const cutsFile=join(dir,'cuts.json');writeFileSync(cutsFile,JSON.stringify(cuts));const child=spawnSync(process.execPath,['--experimental-strip-types',new URL('./cold-reader.ts',import.meta.url).pathname,target,path,cutsFile],{encoding:'utf8',timeout:60000});assert.equal(child.status,0,child.stderr);const cold=JSON.parse(child.stdout);assert.equal(cold.wire,wire);assert.deepEqual(cold.cuts,expected);assert.deepEqual(cold.state,expectedState);
   for(const mutate of [(x:any)=>{x.events[0].canonical_count++;},(x:any)=>{x.events[0].canonical_digest=digest('wrong');},(x:any)=>{x.events[0].result.generation++;}]){const bad=JSON.parse(wire);mutate(bad);const db=target==='SQL'?await engine():null;try{const empty=db?new PostgresEnforcementRepository(db.executor,()=>T5):new MemoryEnforcementRepository(()=>T5),before=await empty.exportSnapshot();await assert.rejects(()=>empty.importSnapshot(JSON.stringify(bad)));assert.equal(await empty.exportSnapshot(),before);}finally{await db?.db.close();}}
  }finally{await e?.db.close();await s.close();rmSync(dir,{recursive:true,force:true});}
 });
}
