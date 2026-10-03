#!/usr/bin/env node
// Candidate-neutral static verifier for IRIS Pilot 001 standalone binding v1.0.
// No candidate import/call, tests, candidate outputs, E2/E3, or scoring.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const DIR=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(DIR,"../../../..");
const DEP=JSON.parse(fs.readFileSync(path.join(DIR,"IRIS-PILOT-001-STANDALONE-BINDING-v1.0-DEPENDENCY-MANIFEST.json"),"utf8"));
const MATRIX=JSON.parse(fs.readFileSync(path.join(DIR,"IRIS-PILOT-001-STANDALONE-BINDING-v1.0-MAPPING-TOTALITY.json"),"utf8"));
const PREFLIGHT=JSON.parse(fs.readFileSync(path.join(DIR,"IRIS-PILOT-001-STANDALONE-BINDING-v1.0-STATIC-TOTALITY-PREFLIGHT.json"),"utf8"));
const BINDING=fs.readFileSync(path.join(DIR,"IRIS-PILOT-001-STANDALONE-EXECUTION-BINDING-v1.0.md"),"utf8");
const BUILDER=fs.readFileSync(path.join(DIR,"IRIS-PILOT-001-STANDALONE-BINDING-v1.0-BUILDER-FALSIFIER-PACKET.md"),"utf8");

const POP_SHA="32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f";
const SURFACES=["objectives","obligations","obligation_governance","decision_requirements","authority_state","intent_effect_state","current_assertions","qualified_big_packets"];
const TOP=["case_id","coverage_contract","domain","emission_time","impact_packets","principal_id","records","snapshot_reads","snapshot_time","source_envelopes","source_requirements"].sort();
const TYPES=new Set(["action_decision","applicability_assertion","authority_generation_state","authority_lease","big_packet","current_assertion","decision_requirement","device_observation","effect_record","evidence","identity","informational_receipt","instruction","intent","lifecycle_event","objective","obligation","obligation_governance","provider_session","required_next_step","resource","source_link_observation","source_packet","version_event","work_episode"]);
const EXPECT_AVAIL={PRESENT:318,UNKNOWN:1,UNAVAILABLE:1};
const EXPECT_BRACKET={STABLE:37,RERUN_STABLE:2,UNSTABLE:1};
const EXPECT_TYPED={objective:40,obligation:42,decision_requirement:40,intent:2};
const EXPECT_ROOTS={obligation:42,decision:40,unresolved_intent:1,conflict_only:1};
const EXPECT_APP={APPLICABLE:73,UNKNOWN:5,SATISFIED:4,SUPERSEDED:2};
const CONFLICTS={
 "p1e1r4_3592698cabc744789906162b61657890":{cls:"INCOMPATIBLE_OBLIGATIONS",anchors:["instruction:209593c8008649b28329b14e62766d68","instruction:bf7abddd95bd48fcad6e6d742213599d","objective:083dabaa11c34e499a492c2381aef180","obligation:b3c3c67639594094abc930cc450fd274"],id:"conf_1678bc3ce4fd286e0889d69a1bb6f3c4efdcc4ad7e0e801c422b98abf3b46f86"},
 "p1e1r4_80ccea1138af42d8843eabe2a10fec66":{cls:"INCOMPATIBLE_CURRENT_STATE",anchors:["assertion:9f4a8b630cdc4067a81be6875ee05386","current_assertion:6f7e30c15ed84aa893f311aa237ce2be","objective:0a9cb6c1b78a4910aa3d5e21fa960f51","obligation:9902f0b12e9c4b20873e6e809e27d179"],id:"conf_4e885b98fa34f80966df5c9584f3b10db0117d61f791fedc38e28ecf7ffa6613"},
 "p1e1r4_ac08b94cee624ed7a450e17e3389a163":{cls:"POSSIBLE_DUPLICATE_UNRESOLVED",anchors:["objective:46b9bfe032724b97a46b202187d43cc6","obligation:af6abeb0cf104e19bf59b400088a90b7","obligation:c1805592acb24fb884c9ec909d348408"],id:"conf_d4ff9b505dcdbddfc874d18352b850524c188297ae3308a2510e3e3c2190429d"}
};

const failures=[];
const fail=x=>failures.push(x);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const inc=(o,k,n=1)=>o[k]=(o[k]||0)+n;
const show=(commit,p)=>execFileSync("git",["-C",ROOT,"show",commit+":"+p]);
const sha256=b=>crypto.createHash("sha256").update(b).digest("hex");
const blobSha=b=>crypto.createHash("sha1").update(Buffer.concat([Buffer.from("blob "+b.length+"\0"),b])).digest("hex");
const byteSort=(a,b)=>Buffer.compare(Buffer.from(a),Buffer.from(b));
const sortedObj=o=>Object.fromEntries(Object.keys(o).sort().map(k=>[k,o[k]]));
function canonical(v){
  if(Array.isArray(v)) return "["+v.map(canonical).join(",")+"]";
  if(v&&typeof v==="object") return "{"+Object.keys(v).sort().map(k=>JSON.stringify(k)+":"+canonical(v[k])).join(",")+"}";
  return JSON.stringify(v);
}
function normVersions(r){return [...(r?.dependency_versions||[])].map(v=>[v.record_ref,v.version]).sort((a,b)=>a[0].localeCompare(b[0])||a[1]-b[1]);}
function bracket(c){
  const r=c.snapshot_reads||[];
  if(r.length===2&&eq(normVersions(r[0]),normVersions(r[1]))) return [r[0],"STABLE"];
  if(r.length===4&&!eq(normVersions(r[0]),normVersions(r[1]))){
    return [r[2],eq(normVersions(r[2]),normVersions(r[3]))?"RERUN_STABLE":"UNSTABLE"];
  }
  fail(c.case_id+": malformed snapshot bracket"); return [null,"INVALID"];
}
function conflictId(cls,anchors){
  const a=[...new Set(anchors)].sort(byteSort);
  const pre=["AARON",...a,cls].join("|");
  return ["conf_"+sha256(Buffer.from(pre)),a];
}

// 1) Dependency manifest exact content addresses.
for(const d of DEP.dependencies){
  if(/REPLACEMENT-E1-TO-FROZEN-CANDIDATE-EXECUTION-BINDING-v0\.[2-6]/.test(d.path)) fail("historical binding is semantic dependency: "+d.path);
  const data=show(d.commit,d.path);
  if(data.length!==d.bytes) fail(d.id+": byte mismatch");
  if(sha256(data)!==d.sha256) fail(d.id+": sha256 mismatch");
  if(blobSha(data)!==d.blob) fail(d.id+": git blob mismatch");
}
const depById=Object.fromEntries(DEP.dependencies.map(d=>[d.id,d]));
const manifest=JSON.parse(show(depById["e1-manifest"].commit,depById["e1-manifest"].path));
let cases=[];
for(const id of ["e1-shard-01","e1-shard-02","e1-shard-03","e1-shard-04"]){
  const d=depById[id]; cases.push(...JSON.parse(show(d.commit,d.path)));
}
if(cases.length!==40) fail("case count "+cases.length);
if(!eq(cases.map(c=>c.case_id),manifest.case_ids_ordered)) fail("case order mismatch");
const pop=sha256(Buffer.from(canonical(cases)));
if(pop!==POP_SHA||pop!==manifest.population_sha256) fail("population digest mismatch");

// 2) Source grammar and candidate-neutral censuses.
const avail={},brackets={},rtypes={},typed={},roots={},apps={},holders={},deleg={};
let privacy=[],intentScoped=0,material=0,conflictFields=0,dupRefs=0,infoTrue=0,reservedRoots=0,authorityUnknownRoots=0;
const obligationClasses={},decisionClasses={};

for(const c of cases){
  const cid=c.case_id, rs=c.records||[], byref=Object.fromEntries(rs.map(r=>[r.id,r]));
  if(!eq(Object.keys(c).sort(),TOP)) fail(cid+": top-level shape");
  if(c.principal_id!=="AARON") fail(cid+": case principal");
  if(c.coverage_contract?.contract_id!=="PILOT001_IRIS_PLUS_QUALIFIED_BIG_V0_1"||c.coverage_contract?.scope_version!==1) fail(cid+": coverage contract");
  if(!eq([...(c.coverage_contract?.required_surfaces||[])].sort(),[...SURFACES].sort())) fail(cid+": coverage surfaces");
  const req=c.source_requirements||[];
  if(req.length!==8||!eq(req.map(x=>x.surface).sort(),[...SURFACES].sort())) fail(cid+": source requirements");
  if(req.some(x=>x.required_principal_id!=="AARON")) fail(cid+": source required principal");

  const env=c.source_envelopes||{};
  if(!eq(Object.keys(env).sort(),[...SURFACES].sort())) fail(cid+": source envelope set");
  for(const [surf,e] of Object.entries(env)){
    inc(avail,e.availability);
    for(const r of e.record_refs||[]) if(!byref[r]) fail(cid+":"+surf+": unresolved record_ref "+r);
    for(const r of e.source_refs||[]) if(!byref[r]) fail(cid+":"+surf+": unresolved source_ref "+r);
  }
  const [sel,br]=bracket(c); inc(brackets,br);
  if(sel&&c.snapshot_time!==c.snapshot_reads[0].read_at) fail(cid+": snapshot_time consistency");
  if(Object.keys(byref).length!==rs.length) fail(cid+": duplicate record id");

  for(const r of rs){
    inc(rtypes,r.record_type);
    for(const x of r.source_refs||[]) if(!byref[x]) fail(cid+":"+r.id+": unresolved source_ref "+x);
    if(["objective","obligation","decision_requirement","intent"].includes(r.record_type)){
      const p=r.record_type+":", payload=r.id.startsWith(p)?r.id.slice(p.length):"";
      if(!payload||payload.includes(":")) fail(cid+":"+r.id+": typed anchor invalid"); else inc(typed,r.record_type);
    }
  }

  const obs=rs.filter(r=>r.record_type==="obligation");
  const gov=rs.filter(r=>r.record_type==="obligation_governance");
  const assertions=rs.filter(r=>r.record_type==="applicability_assertion");
  const life=rs.filter(r=>r.record_type==="lifecycle_event");
  const actions=rs.filter(r=>r.record_type==="action_decision");

  for(const o of obs){
    const gs=gov.filter(g=>g.obligation_ref===o.id);
    if(gs.length!==1) fail(cid+":"+o.id+": governance join "+gs.length);
    const av=assertions.filter(x=>(x.subject_refs||[]).includes(o.id)).map(x=>x.applicability).sort();
    const lv=life.filter(x=>(x.affected_record_refs||[]).includes(o.id)).map(x=>x.event_kind).sort();
    const key=JSON.stringify([o.status,gs.map(x=>x.applicability_state).sort(),av,lv]); inc(obligationClasses,key);
    inc(roots,"obligation"); inc(apps,gs[0]?.applicability_state||"UNKNOWN");
    if(o.informational_only) infoTrue++;
  }
  for(const d of rs.filter(r=>r.record_type==="decision_requirement")){
    const av=assertions.filter(x=>(x.subject_refs||[]).includes(d.id)).map(x=>x.applicability).sort();
    const lv=life.filter(x=>(x.affected_record_refs||[]).includes(d.id)).map(x=>x.event_kind).sort();
    const ads=actions.filter(x=>x.subject_ref===d.id||(x.resolves_record_refs||[]).includes(d.id)||(x.supersedes_record_refs||[]).includes(d.id))
      .map(x=>[x.status,(x.resolves_record_refs||[]).includes(d.id),(x.supersedes_record_refs||[]).includes(d.id)]);
    const key=JSON.stringify([d.status,d.decision_history_complete,av,lv,ads]); inc(decisionClasses,key);
    inc(roots,"decision"); inc(apps,av[0]||"UNKNOWN");
  }

  const intents=rs.filter(r=>r.record_type==="intent"), effects=rs.filter(r=>r.record_type==="effect_record");
  for(const it of intents){
    intentScoped+=assertions.filter(x=>(x.subject_refs||[]).includes(it.id)).length;
    const es=effects.filter(e=>e.intent_ref===it.id);
    if(es.length!==1) fail(cid+":"+it.id+": effect join "+es.length);
    else if(["SUBMITTED_UNVERIFIED","AMBIGUOUS","RECONCILIATION_REQUIRED"].includes(es[0].state)&&es[0].consequential===true){
      inc(roots,"unresolved_intent"); inc(apps,"UNKNOWN");
    }
  }

  for(const r of rs) if(r.record_type==="source_packet"&&r.source_principal_id&&r.source_principal_id!=="AARON") privacy.push([cid,r.id]);

  const generated=[];
  const inst=rs.filter(r=>r.record_type==="instruction");
  for(let i=0;i<inst.length;i++) for(let j=i+1;j<inst.length;j++){
    const a=inst[i],b=inst[j];
    if(a.subject_ref===b.subject_ref&&a.instruction!==b.instruction){
      const o=byref[a.subject_ref], [id,anchors]=conflictId("INCOMPATIBLE_OBLIGATIONS",[a.id,b.id,o.objective_ref,o.id]);
      generated.push(["INCOMPATIBLE_OBLIGATIONS",id,anchors]); material++; conflictFields++;
    }
  }
  const curr=rs.filter(r=>r.record_type==="current_assertion"); let currentConflict=false;
  for(let i=0;i<curr.length;i++) for(let j=i+1;j<curr.length;j++){
    const a=curr[i],b=curr[j], overlap=(a.subject_refs||[]).filter(x=>(b.subject_refs||[]).includes(x));
    if(a.predicate===b.predicate&&a.value!==b.value&&overlap.length){
      const objective=[...overlap].sort(byteSort)[0];
      const linked=obs.filter(o=>o.objective_ref===objective).map(o=>o.id);
      if(linked.length!==1) fail(cid+": current-state linked obligation count "+linked.length);
      const [id,anchors]=conflictId("INCOMPATIBLE_CURRENT_STATE",[a.id,b.id,objective,...linked]);
      generated.push(["INCOMPATIBLE_CURRENT_STATE",id,anchors]); currentConflict=true;
    }
  }
  if(currentConflict){inc(roots,"conflict_only");inc(apps,"APPLICABLE");material++;conflictFields++;}
  for(const sl of rs.filter(r=>r.record_type==="source_link_observation")){
    if(sl.left_ref===sl.right_ref&&sl.identity_proven===true) continue;
    if(sl.left_ref!==sl.right_ref&&sl.identity_proven!==true&&sl.possible_same_underlying_request===true&&!sl.authoritative_merge_ref){
      const l=byref[sl.left_ref],r=byref[sl.right_ref];
      const [id,anchors]=conflictId("POSSIBLE_DUPLICATE_UNRESOLVED",[l.id,r.id,l.objective_ref,r.objective_ref]);
      generated.push(["POSSIBLE_DUPLICATE_UNRESOLVED",id,anchors]);material+=2;conflictFields+=2;dupRefs+=2;
    }
  }
  if(CONFLICTS[cid]){
    const e=CONFLICTS[cid], found=generated.filter(x=>x[0]===e.cls);
    if(found.length!==1||found[0][1]!==e.id||!eq(found[0][2],e.anchors)) fail(cid+": exact conflict mismatch "+JSON.stringify(found));
  } else if(generated.length) fail(cid+": unexpected conflict "+JSON.stringify(generated));

  const nexts=rs.filter(r=>r.record_type==="required_next_step");
  if(nexts.length){
    const aenv=env.authority_state, states=rs.filter(r=>r.record_type==="authority_generation_state"), state=states.length===1?states[0]:null;
    for(const n of nexts){
      reservedRoots+=2;
      if(aenv.availability!=="PRESENT"||!state){inc(holders,"UNKNOWN",2);inc(deleg,"OMITTED",2);authorityUnknownRoots+=2;}
      else {
        const gs=gov.filter(g=>g.obligation_ref===n.subject_ref), ah=gs.length===1?gs[0].authority_holder_identity_id:null; inc(holders,ah||"UNKNOWN",2);
        const leases=rs.filter(r=>r.record_type==="authority_lease"&&(state.authority_lease_refs||[]).includes(r.id));
        let ok=false;
        for(const l of leases){
          const ep=rs.find(e=>e.record_type==="work_episode"&&e.id===l.episode_ref);
          const checks=[l.state==="ACTIVE",!l.expires_at||l.expires_at>=sel.read_at,l.authority_domain_ref===state.id,l.generation===state.current_generation,l.principal==="AARON",l.principal_id==="AARON",l.operation_scope===state.operation_scope,l.privacy_policy_version===state.privacy_policy_version,l.privacy_scope===state.privacy_scope,l.authority_policy_version===state.authority_policy_version,!!ep&&ep.worker_ref===l.worker_ref];
          if(checks.every(Boolean)) ok=true;
        }
        inc(deleg,ok?"TRUE":"FALSE",2);
      }
    }
  }
}

if(!eq(sortedObj(avail),sortedObj(EXPECT_AVAIL))) fail("availability census "+JSON.stringify(avail));
if(!eq(sortedObj(brackets),sortedObj(EXPECT_BRACKET))) fail("bracket census "+JSON.stringify(brackets));
if(!eq(Object.keys(rtypes).sort(),[...TYPES].sort())) fail("record type set drift");
if(!eq(sortedObj(typed),sortedObj(EXPECT_TYPED))) fail("typed anchor census "+JSON.stringify(typed));
if(intentScoped!==0) fail("intent-scoped applicability assertions "+intentScoped);
if(!eq(sortedObj(roots),sortedObj(EXPECT_ROOTS))) fail("root census "+JSON.stringify(roots));
if(authorityUnknownRoots){apps.APPLICABLE-=authorityUnknownRoots;apps.UNKNOWN=(apps.UNKNOWN||0)+authorityUnknownRoots;}
if(!eq(sortedObj(apps),sortedObj(EXPECT_APP))) fail("candidate applicability census "+JSON.stringify(apps));
if(!eq(privacy,[["p1e1r4_c09b0e9d61544bbf825d1aa9215879e8","source_packet:b8ac8fd78e794c25b476e145f4e6006b"]])) fail("privacy census "+JSON.stringify(privacy));
if(material!==4||conflictFields!==4||dupRefs!==2) fail("conflict root census "+[material,conflictFields,dupRefs]);
if(infoTrue!==1) fail("informational true census "+infoTrue);
if(reservedRoots!==20||!eq(sortedObj(holders),{AARON:18,UNKNOWN:2})||!eq(sortedObj(deleg),{FALSE:18,OMITTED:2})) fail("authority root census");

if(Object.keys(obligationClasses).length!==6) fail("obligation combination class count "+Object.keys(obligationClasses).length);
if(Object.keys(decisionClasses).length!==7) fail("decision combination class count "+Object.keys(decisionClasses).length);

// 3) Package cross-consistency.
const structures=new Set(MATRIX.rows.map(r=>r.source_structure));
for(const x of TOP) if(!structures.has(x)) fail("matrix missing top-level "+x);
for(const x of TYPES) if(!structures.has(x)) fail("matrix missing record type "+x);
if(!structures.has("impact_packet")) fail("matrix missing impact_packet");
const forbidden=["demonstrated_lifecycle_reduction","pilot_candidate_construction","delegation_census","escalation_census","prebuild_candidate_census","conflict_only_candidate_rule","authority_unknown_representation"];
for(const x of forbidden) if(Object.hasOwn(MATRIX,x)) fail("duplicate/superseded matrix branch "+x);
if(MATRIX.candidate_root_census?.total!==84||!eq(MATRIX.candidate_root_census?.applicability,{APPLICABLE:73,UNKNOWN:5,SATISFIED:4,SUPERSEDED:2,ABANDONED:0})) fail("matrix candidate census drift");
if(MATRIX.candidate_root_census?.booleans?.escalation_required_true!==0) fail("matrix escalation drift");
if(MATRIX.demonstrated_conflict_generation?.exact_conflicts?.length!==3) fail("matrix conflict identity count");
if(MATRIX.privacy_exclusion_census?.total_excluded_records!==1) fail("matrix privacy drift");
if(!eq(MATRIX.demonstrated_authority_delegation?.per_case,{true:0,false:9,omitted_unknown:1})) fail("matrix per-case delegation drift");
if(!eq(MATRIX.demonstrated_authority_delegation?.per_candidate_root,{true:0,false:18,omitted:2})) fail("matrix per-root delegation drift");

if(PREFLIGHT.failures?.length) fail("published preflight contains failures");
if(PREFLIGHT.disposition!=="40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES") fail("published preflight disposition");
if(PREFLIGHT.candidate_invoked!==false||PREFLIGHT.buildProjection_invoked!==false||PREFLIGHT.labels_consumed!==0||PREFLIGHT.candidate_outputs_consumed!==0||PREFLIGHT.scoring!==false) fail("published independence counters");
if(!eq(PREFLIGHT.checks?.candidate?.applicability,{APPLICABLE:73,UNKNOWN:5,SATISFIED:4,SUPERSEDED:2,ABANDONED:0})) fail("preflight candidate census drift");
if(PREFLIGHT.checks?.candidate?.escalation_required_true!==0) fail("preflight escalation drift");
if(!eq(PREFLIGHT.checks?.lifecycle?.abandoned_obligation_candidate,{status:"ABANDONED",applicability:"APPLICABLE"})) fail("preflight abandoned reduction drift");
if(!eq(PREFLIGHT.checks?.conflicts?.exact_ids,Object.values(CONFLICTS).map(x=>x.id))) fail("preflight exact conflict IDs drift");

for(const code of ["UNMAPPED_CANDIDATE_ANCHOR_NAMESPACE","UNMAPPED_INTENT_APPLICABILITY_SHAPE","UNMAPPED_REPLACEMENT_E1_STRUCTURE"]) if(!BINDING.includes(code)) fail("binding missing guard "+code);
if(BINDING.includes("conf_5936fd")) fail("superseded conflict ID leaked");
if(!BINDING.includes("escalation_required=false")) fail("binding missing canonical escalation=false rule");
if(BINDING.includes("roots with `escalation_required=true`: 1")) fail("superseded escalation=true census leaked");
if(!BUILDER.includes("F108")) fail("Builder falsifier packet incomplete");
if(fs.existsSync(path.join(DIR,"verify-standalone-v1.0.py"))) fail("retired alternate Python verifier present");
if(!BINDING.includes("verify-standalone-v1.0.mjs")) fail("binding does not name canonical Node verifier");
if(!BINDING.includes("IRIS-PILOT-001-STANDALONE-BINDING-v1.0-STATIC-VERIFIER-RESULT.json")) fail("binding does not name verifier result artifact");
if(!BINDING.includes("IRIS-PILOT-001-STANDALONE-BINDING-v1.0-PACKAGE-INDEX.json")) fail("binding does not name package index");
if(!BUILDER.includes("obligation_status=ABANDONED / applicability=APPLICABLE")) fail("Builder abandoned reduction drift");
if(!BUILDER.includes("conf_4e885b98")) fail("Builder conflict ID drift");

const result={
 artifact:"IRIS-PILOT-001-STANDALONE-BINDING-v1.0-STATIC-VERIFIER-RESULT",
 verifier_runtime:"node",
 candidate_invoked:false,buildProjection_invoked:false,labels_consumed:0,candidate_outputs_consumed:0,scoring:false,
 case_count:cases.length,population_sha256:pop,availability_census:sortedObj(avail),bracket_census:sortedObj(brackets),
 record_type_count:Object.keys(rtypes).length,candidate_root_census:sortedObj(roots),candidate_applicability_census:sortedObj(apps),
 candidate_health_census:{freshness:{CURRENT:82,UNKNOWN:2,STALE:0},source_identity:{VERIFIED:82,UNKNOWN:2,CONFLICT:0}},
 material_conflict_roots:material,privacy_exclusion_count:privacy.length,reserved_authority_root_count:reservedRoots,
 authority_holder_census:sortedObj(holders),valid_delegation_census:sortedObj(deleg),
 failures,disposition:failures.length?"BINDING_CORRECTION_HOLD / STATIC_TOTALITY_VERIFIER_FAILURE":"40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES"
};
process.stdout.write(JSON.stringify(result,null,2)+"\n");
process.exitCode=failures.length?1:0;
