import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const packageDir = process.argv[2] ? path.resolve(process.argv[2]) : here;
const fail = [];
const check = (cond, code, detail='') => { if (!cond) fail.push(detail ? `${code}:${detail}` : code); };
const eq = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const sorted = a => [...a].sort((x,y)=>Buffer.from(String(x)).compare(Buffer.from(String(y))));
const uniqSorted = a => sorted([...new Set(a)]);
const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');
const gitBlob = b => crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex');
const canonical = v => Array.isArray(v) ? `[${v.map(canonical).join(',')}]` : (v && typeof v === 'object') ? `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}` : JSON.stringify(v);
const readPackage = name => fs.readFileSync(path.join(packageDir,name));
const manifest = JSON.parse(readPackage('IRIS-PILOT-001-STANDALONE-BINDING-v1.0-DEPENDENCY-MANIFEST.json'));
const totality = JSON.parse(readPackage('IRIS-PILOT-001-STANDALONE-BINDING-v1.0-MAPPING-TOTALITY.json'));

function gitShow(commit, repoPath) {
  try { return execFileSync('git',['show',`${commit}:${repoPath}`],{encoding:null,maxBuffer:32*1024*1024}); }
  catch (e) { fail.push(`DEPENDENCY_FETCH:${commit}:${repoPath}`); return Buffer.alloc(0); }
}
const depBytes = new Map();
for (const d of manifest.dependencies) {
  const b = gitShow(d.commit,d.path);
  depBytes.set(d.id,b);
  check(b.length===d.bytes,'DEPENDENCY_BYTES',d.id);
  check(sha256(b)===d.sha256,'DEPENDENCY_SHA256',d.id);
  check(gitBlob(b)===d.blob,'DEPENDENCY_BLOB',d.id);
}
const depJson = id => JSON.parse(depBytes.get(id).toString('utf8'));
const e1Manifest = depJson('e1-manifest');
const cases = ['e1-shard-01','e1-shard-02','e1-shard-03','e1-shard-04'].flatMap(depJson);
check(cases.length===40,'CASE_COUNT',String(cases.length));
check(eq(cases.map(c=>c.case_id),e1Manifest.case_ids_ordered),'CASE_ORDER');
const popDigest = sha256(Buffer.from(canonical(cases),'utf8'));
check(popDigest===e1Manifest.population_sha256,'POPULATION_DIGEST',popDigest);

const topFields = ['case_id','coverage_contract','domain','emission_time','impact_packets','principal_id','records','snapshot_reads','snapshot_time','source_envelopes','source_requirements'].sort();
const surfaces = ['objectives','obligations','obligation_governance','decision_requirements','authority_state','intent_effect_state','current_assertions','qualified_big_packets'];
const availability = {PRESENT:0,UNKNOWN:0,UNAVAILABLE:0};
const recordCounts = {};
const bracketCounts = {STABLE:0,RERUN_STABLE:0,UNSTABLE:0};
const typedCounts = {objective:0,obligation:0,decision_requirement:0,intent:0};
let govJoins=0, intentJoins=0, privacyExcluded=0;
const reservedCases=[];
const escalationTargets=[];
const unresolvedIntentCases=[];
const conflictCases=[];

function versionMap(read){ return sorted((read?.dependency_versions??[]).map(v=>`${v.record_ref}\u0000${v.version}`)); }
function selectedRead(c){
  const r=c.snapshot_reads??[];
  if(r.length===2 && eq(versionMap(r[0]),versionMap(r[1]))) { bracketCounts.STABLE++; return r[0]; }
  if(r.length===4 && !eq(versionMap(r[0]),versionMap(r[1])) && eq(versionMap(r[2]),versionMap(r[3]))) { bracketCounts.RERUN_STABLE++; return r[2]; }
  if(r.length===4 && !eq(versionMap(r[0]),versionMap(r[1])) && !eq(versionMap(r[2]),versionMap(r[3]))) { bracketCounts.UNSTABLE++; return r[2]; }
  fail.push(`SNAPSHOT_BRACKET:${c.case_id}`); return r[0]??{read_at:c.snapshot_time};
}
function payload(ns,id){
  check(typeof id==='string', 'ANCHOR_TYPE', `${ns}:${id}`);
  const p=`${ns}:`; check(id?.startsWith(p),'ANCHOR_NAMESPACE',`${ns}:${id}`);
  const raw=id?.slice(p.length)??''; check(raw.length>0&&!raw.includes(':'),'ANCHOR_PAYLOAD',`${ns}:${id}`); return raw;
}
function sourceEval(c,surf,sel){
  const e=c.source_envelopes[surf];
  const sourceIds={objectives:'pilot001:objectives',obligations:'pilot001:obligations',obligation_governance:'pilot001:obligation_governance',decision_requirements:'pilot001:decision_requirements',authority_state:'pilot001:authority_generation_and_leases',intent_effect_state:'pilot001:unresolved_intents_and_effects',current_assertions:'pilot001:applicability_current_assertions',qualified_big_packets:'pilot001:qualified_big_quarantine_evidence'};
  const ids=new Set(c.records.map(r=>r.id));
  const provenance_ok=e.provenance_verified===true && (e.source_refs??[]).every(x=>ids.has(x));
  const principal_match=e.principal_identity==='AARON';
  const t=Date.parse(sel.read_at), obs=Date.parse(e.observed_at), vt=Date.parse(e.valid_through);
  const freshness=Number.isFinite(t)&&Number.isFinite(obs)&&Number.isFinite(vt) ? (obs<=t&&t<=vt?'CURRENT':vt<t?'STALE':'UNKNOWN') : 'UNKNOWN';
  if(e.availability==='PRESENT') return {source_id:sourceIds[surf],required:true,present:true,principal_match,identity:principal_match&&provenance_ok?'VERIFIED':'UNKNOWN',applicability:'APPLICABLE',freshness,provenance_ok,partial:e.enumeration_complete!==true||!provenance_ok};
  if(e.availability==='UNKNOWN') return {source_id:sourceIds[surf],required:true,present:false,principal_match,identity:'UNKNOWN',applicability:'UNKNOWN',freshness:'UNKNOWN',provenance_ok,partial:true};
  if(e.availability==='UNAVAILABLE') return {source_id:sourceIds[surf],required:true,present:false,principal_match,identity:principal_match&&provenance_ok?'VERIFIED':'UNKNOWN',applicability:'APPLICABLE',freshness,provenance_ok,partial:true};
  fail.push(`AVAILABILITY_TOKEN:${c.case_id}:${surf}:${e.availability}`); return null;
}
const tupleCensus={};
for(const c of cases){
  check(eq(Object.keys(c).sort(),topFields),'TOP_LEVEL_FIELDS',c.case_id);
  check(c.principal_id==='AARON','CASE_PRINCIPAL',c.case_id);
  check(c.coverage_contract?.contract_id==='PILOT001_IRIS_PLUS_QUALIFIED_BIG_V0_1'&&c.coverage_contract?.scope_version===1,'COVERAGE_CONTRACT',c.case_id);
  check(eq(sorted(c.coverage_contract?.required_surfaces??[]),sorted(surfaces)),'COVERAGE_SURFACES',c.case_id);
  check(eq(sorted((c.source_requirements??[]).map(x=>x.surface)),sorted(surfaces)),'SOURCE_REQUIREMENTS',c.case_id);
  check(eq(sorted(Object.keys(c.source_envelopes??{})),sorted(surfaces)),'SOURCE_ENVELOPES',c.case_id);
  const ids=new Set(c.records.map(r=>r.id));
  check(ids.size===c.records.length,'DUPLICATE_RECORD_ID',c.case_id);
  const sel=selectedRead(c);
  check(c.snapshot_time===c.snapshot_reads?.[0]?.read_at,'SNAPSHOT_TIME_CONSISTENCY',c.case_id);
  for(const surf of surfaces){
    const e=c.source_envelopes[surf];
    check(['PRESENT','UNKNOWN','UNAVAILABLE'].includes(e.availability),'AVAILABILITY_DOMAIN',`${c.case_id}:${surf}`);
    availability[e.availability]=(availability[e.availability]??0)+1;
    for(const ref of e.record_refs??[]) check(ids.has(ref),'ENVELOPE_RECORD_REF',`${c.case_id}:${surf}:${ref}`);
    for(const ref of e.source_refs??[]) check(ids.has(ref),'ENVELOPE_SOURCE_REF',`${c.case_id}:${surf}:${ref}`);
    const t=sourceEval(c,surf,sel); const key=JSON.stringify(t); tupleCensus[key]=(tupleCensus[key]??0)+1;
  }
  for(const r of c.records){
    recordCounts[r.record_type]=(recordCounts[r.record_type]??0)+1;
    for(const ref of r.source_refs??[]) check(ids.has(ref),'RECORD_SOURCE_REF',`${c.case_id}:${r.id}:${ref}`);
    if(['objective','obligation','decision_requirement','intent'].includes(r.record_type)){ payload(r.record_type,r.id); typedCounts[r.record_type]++; }
  }
  const obligations=c.records.filter(r=>r.record_type==='obligation');
  const govs=c.records.filter(r=>r.record_type==='obligation_governance');
  for(const o of obligations){ const m=govs.filter(g=>g.obligation_ref===o.id); check(m.length===1,'OBLIGATION_GOVERNANCE_JOIN',`${c.case_id}:${o.id}:${m.length}`); if(m.length===1)govJoins++; }
  const intents=c.records.filter(r=>r.record_type==='intent');
  const effects=c.records.filter(r=>r.record_type==='effect_record');
  for(const i of intents){ const m=effects.filter(e=>e.intent_ref===i.id); check(m.length===1,'INTENT_EFFECT_JOIN',`${c.case_id}:${i.id}:${m.length}`); if(m.length===1){intentJoins++; if(['SUBMITTED_UNVERIFIED','AMBIGUOUS','RECONCILIATION_REQUIRED'].includes(m[0].state)&&m[0].consequential===true) unresolvedIntentCases.push(c.case_id);} }
  const rns=c.records.filter(r=>r.record_type==='required_next_step'&&r.status==='OPEN'&&r.applicability==='APPLICABLE'&&r.permission_needed===true);
  if(rns.length) reservedCases.push(c.case_id);
  for(const g of govs) if(g.escalation_target_identity_id==='AARON') escalationTargets.push({case_id:c.case_id,obligation_ref:g.obligation_ref});
  const foreign=c.records.filter(r=>r.record_type==='source_packet'&&r.source_principal_id!=='AARON'); privacyExcluded+=foreign.length;

  const instructions=c.records.filter(r=>r.record_type==='instruction');
  for(let i=0;i<instructions.length;i++)for(let j=i+1;j<instructions.length;j++) if(instructions[i].subject_ref===instructions[j].subject_ref&&instructions[i].instruction!==instructions[j].instruction) conflictCases.push({case_id:c.case_id,kind:'INCOMPATIBLE_OBLIGATIONS'});
  const ca=c.records.filter(r=>r.record_type==='current_assertion');
  for(let i=0;i<ca.length;i++)for(let j=i+1;j<ca.length;j++) if(ca[i].predicate===ca[j].predicate&&ca[i].value!==ca[j].value&&(ca[i].subject_refs??[]).some(x=>(ca[j].subject_refs??[]).includes(x))) conflictCases.push({case_id:c.case_id,kind:'INCOMPATIBLE_CURRENT_STATE'});
  for(const s of c.records.filter(r=>r.record_type==='source_link_observation')) if(s.left_ref!==s.right_ref&&s.identity_proven!==true&&s.possible_same_underlying_request===true&&!s.authoritative_merge_ref) conflictCases.push({case_id:c.case_id,kind:'POSSIBLE_DUPLICATE_UNRESOLVED'});
}
check(eq(availability,{PRESENT:318,UNKNOWN:1,UNAVAILABLE:1}),'AVAILABILITY_CENSUS',JSON.stringify(availability));
check(eq(bracketCounts,{STABLE:37,RERUN_STABLE:2,UNSTABLE:1}),'BRACKET_CENSUS',JSON.stringify(bracketCounts));
check(eq(typedCounts,{objective:40,obligation:42,decision_requirement:40,intent:2}),'TYPED_ANCHOR_CENSUS',JSON.stringify(typedCounts));
check(govJoins===42,'GOV_JOIN_CENSUS',String(govJoins));
check(intentJoins===2,'INTENT_JOIN_CENSUS',String(intentJoins));
check(new Set(reservedCases).size===10,'RESERVED_CASE_CENSUS',String(new Set(reservedCases).size));
check(escalationTargets.length===2,'ESCALATION_TARGET_CENSUS',String(escalationTargets.length));
check(unresolvedIntentCases.length===1&&unresolvedIntentCases[0]==='p1e1r4_6f43027d04774acda0ac9dd58bc2f4af','UNRESOLVED_INTENT_CENSUS',JSON.stringify(unresolvedIntentCases));
check(privacyExcluded===1,'PRIVACY_EXCLUSION_CENSUS',String(privacyExcluded));
check(conflictCases.length===3,'CONFLICT_CENSUS',JSON.stringify(conflictCases));
check(eq(conflictCases.map(x=>x.case_id).sort(),['p1e1r4_3592698cabc744789906162b61657890','p1e1r4_80ccea1138af42d8843eabe2a10fec66','p1e1r4_ac08b94cee624ed7a450e17e3389a163'].sort()),'CONFLICT_CASE_SET');

const expectedRecordCounts={evidence:40,resource:40,objective:40,obligation:42,obligation_governance:42,decision_requirement:40,applicability_assertion:43,lifecycle_event:44,authority_generation_state:40,identity:81,work_episode:40,current_assertion:41,big_packet:39,required_next_step:10,authority_lease:8,instruction:2,device_observation:1,intent:2,effect_record:2,informational_receipt:1,action_decision:5,version_event:4,source_link_observation:2,source_packet:1,provider_session:1};
check(eq(recordCounts,expectedRecordCounts),'RECORD_TYPE_CENSUS',JSON.stringify(recordCounts));
const matrixStructures=new Set(totality.rows.map(r=>r.source_structure));
for(const x of [...topFields,...Object.keys(expectedRecordCounts),'source_envelope:PRESENT','source_envelope:UNKNOWN','source_envelope:UNAVAILABLE']) check(matrixStructures.has(x),'TOTALITY_MATRIX_MISSING',x);
check(totality.pilot_candidate_construction?.why==='NEVER_SUPPLIED','WHY_POLICY');
check(eq(totality.candidate_root_census,{...totality.candidate_root_census,total_roots:84})&&totality.candidate_root_census.total_roots===84,'ROOT_CENSUS_MATRIX');
check(totality.privacy_exclusion_census?.total_records===1,'PRIVACY_MATRIX');
check(totality.delegation_census?.valid_delegation_true===0&&totality.delegation_census?.valid_delegation_false===9&&totality.delegation_census?.valid_delegation_omitted_due_authority_unknown===1,'DELEGATION_MATRIX');

const result={
 artifact:'IRIS-PILOT-001-STANDALONE-BINDING-v1.0-MECHANICAL-PREFLIGHT',
 authority:'NONE',candidate_invoked:false,buildProjection_invoked:false,labels_consumed:0,candidate_outputs_consumed:0,scoring:false,
 population:{count:cases.length,sha256:popDigest},
 census:{availability,brackets:bracketCounts,record_types:recordCounts,typed_anchors:typedCounts,obligation_governance_joins:govJoins,intent_effect_joins:intentJoins,reserved_authority_cases:new Set(reservedCases).size,escalation_targets:escalationTargets.length,unresolved_intent_roots:unresolvedIntentCases.length,privacy_exclusions:privacyExcluded,generated_conflicts:conflictCases.length,source_evaluation_tuple_classes:Object.keys(tupleCensus).length},
 failures:fail,
 disposition:fail.length===0?'40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES':'BINDING_CORRECTION_HOLD / STATIC_TOTALITY_PREFLIGHT_FAILURE'
};
process.stdout.write(JSON.stringify(result,null,2)+'\n');
process.exitCode=fail.length?1:0;
