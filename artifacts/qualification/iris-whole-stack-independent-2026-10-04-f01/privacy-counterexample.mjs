import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fixture,updateRoot,compound,principal,T2} from '../candidate/tests/personal-office/fixtures.ts';
import {PersonalOffice,candidateInterface} from '../candidate/src/personal-office/office.ts';
import {MemoryEnforcementRepository,PostgresEnforcementRepository} from '../candidate/src/enforcement/backends.ts';
import {engine} from '../candidate/tests/canonical-repository/sql-fixture.ts';
const mode=process.argv[2]??'MEMORY';
const marker='PRIVATE_EVIDENCE_REF:independent-synthetic-confidential-marker';
const s=await fixture(mode);
let sqlEngine=null;
try {
 const baseline=await candidateInterface(new PersonalOffice(s.repo,principal,()=>T2),{interface_version:'IRIS_CANONICAL_PILOT_B6_V1',operation:'GET_PERSONAL_ATTENTION',request:s.request});
 assert.equal(baseline.projection.roots[0].primary_visible_disposition,'KNOWN_REQUIRED');
 const nextRun={...s.request.run,id:'independent:privacy:run'};
 await updateRoot(s,0,q=>{
  q.provenance_refs.push(marker);
  q.privacy={...q.privacy,disclosure_result:'PROHIBITED'};
  const result=compound(q.root_ref,q);
  result.reason_set.find(r=>r.reason_type==='DISCLOSURE').evidence_refs=[marker];
  return result;
 });
 // Qualify the synthetic private reference for INTERNAL use/retention only.
 // Disclosure remains DENY in the canonical policy installed by updateRoot.
 const snap=JSON.parse(await s.repo.exportSnapshot());
 const command=snap.canonical.commands.findLast(c=>c.value.record_id===s.roots[0].record_id);
 command.value.provenance_refs.push(marker);
 snap.canonical.records=snap.canonical.commands.map(c=>c.value);
 sqlEngine=mode==='SQL'?await engine():null;
 const isolated=sqlEngine?new PostgresEnforcementRepository(sqlEngine.executor,()=>T2):new MemoryEnforcementRepository(()=>T2);await isolated.importSnapshot(JSON.stringify(snap));
 const request={...s.request,run:nextRun};
 const output=await candidateInterface(new PersonalOffice(isolated,principal,()=>T2),{interface_version:'IRIS_CANONICAL_PILOT_B6_V1',operation:'GET_PERSONAL_ATTENTION',request});
 const wire=await isolated.exportSnapshot(),restored=new MemoryEnforcementRepository(()=>T2);await restored.importSnapshot(wire);
 const replay=await candidateInterface(new PersonalOffice(restored,principal,()=>T2),{interface_version:'IRIS_CANONICAL_PILOT_B6_V1',operation:'GET_PERSONAL_ATTENTION',request});
 const audit=JSON.parse(wire).canonical.records.findLast(r=>r.payload?.value?.state==='COMPLETE').payload.value.data;
 const snapshotPath=new URL('./privacy-snapshot-'+mode+'.json',import.meta.url);writeFileSync(snapshotPath,wire);
 const cold=spawnSync(process.execPath,['--require',new URL('../candidate/scripts/qualification/network-guard.cjs',import.meta.url).pathname,new URL('./privacy-cold-reader.mjs',import.meta.url).pathname,snapshotPath.pathname,JSON.stringify(request)],{encoding:'utf8',env:process.env});
 assert.equal(cold.status,0,cold.stderr);const coldOutput=JSON.parse(cold.stdout);
 const result={mode,evidence_class:'TESTED_SYNTHETIC',oracle_vectors:['QD-PRIVACY-ALL','QD-PRIVATE-SECONDARY-NEGATIVE','QD-ROUNDTRIP-COLD'],baseline_primary:baseline.projection.roots[0].primary_visible_disposition,prohibited_primary:output.projection.roots[0].primary_visible_disposition,private_marker:marker,marker_in_external_projection:JSON.stringify(output.projection).includes(marker),marker_after_reconstruction:JSON.stringify(replay.projection).includes(marker),marker_in_cold_process:JSON.stringify(coldOutput.projection).includes(marker),same_cold_content:output.content_hash===coldOutput.content_hash,same_replay_content:output.content_hash===replay.content_hash,internal_reason_preserved:JSON.stringify(audit.compound_audit).includes(marker),continuity_ON:output.continuity_ON,authority_effect:output.authority_effect,admission:output.admission,output,replay};
 writeFileSync(new URL('./privacy-counterexample-result-'+mode+'.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({...result,output:undefined,replay:undefined},null,2));
 assert.equal(result.prohibited_primary,'PRIVACY_EXCLUDED');
 assert.equal(result.internal_reason_preserved,true);
 assert.equal(result.marker_in_external_projection,false,'ORACLE_FALSIFIED: prohibited-recipient projection leaked private evidence reference');
} finally {await s.close();await sqlEngine?.db.close();}
