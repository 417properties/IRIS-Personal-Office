#!/usr/bin/env python3
"""Candidate-neutral static verifier for IRIS Pilot 001 standalone binding v1.0.

Reads only the v1.0 documentary package plus exact content-addressed semantic
dependencies. It does NOT import/call buildProjection, read tests, read candidate
outputs, consume E2/E3, or score anything.
"""
from __future__ import annotations
import hashlib, json, subprocess, sys
from pathlib import Path
from collections import Counter, defaultdict

ROOT = Path(__file__).resolve().parents[4]
PKG = Path(__file__).resolve().parent
DEP_MANIFEST = PKG / "IRIS-PILOT-001-STANDALONE-BINDING-v1.0-DEPENDENCY-MANIFEST.json"
MATRIX = PKG / "IRIS-PILOT-001-STANDALONE-BINDING-v1.0-MAPPING-TOTALITY.json"
PREFLIGHT = PKG / "IRIS-PILOT-001-STANDALONE-BINDING-v1.0-STATIC-TOTALITY-PREFLIGHT.json"
BINDING = PKG / "IRIS-PILOT-001-STANDALONE-EXECUTION-BINDING-v1.0.md"
BUILDER = PKG / "IRIS-PILOT-001-STANDALONE-BINDING-v1.0-BUILDER-FALSIFIER-PACKET.md"

E1_COMMIT = "849deca383add66773ab1ba0c8bc0ca852523c8f"
E1_DIR = "artifacts/evaluation/pilot001/replacement-e1-v0.4-08e89d578d95"
POP_SHA = "32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f"
CANDIDATE_COMMIT = "185dbd1be80bd54c6cf5dcc085f105a637fe7e44"
EXPECTED_SURFACES = [
    "objectives","obligations","obligation_governance","decision_requirements",
    "authority_state","intent_effect_state","current_assertions","qualified_big_packets"
]
EXPECTED_TOP = sorted([
    "case_id","coverage_contract","domain","emission_time","impact_packets","principal_id",
    "records","snapshot_reads","snapshot_time","source_envelopes","source_requirements"
])
EXPECTED_TYPES = {
    "action_decision","applicability_assertion","authority_generation_state","authority_lease",
    "big_packet","current_assertion","decision_requirement","device_observation","effect_record",
    "evidence","identity","informational_receipt","instruction","intent","lifecycle_event",
    "objective","obligation","obligation_governance","provider_session","required_next_step",
    "resource","source_link_observation","source_packet","version_event","work_episode"
}
EXPECTED_AVAIL = Counter({"PRESENT":318,"UNKNOWN":1,"UNAVAILABLE":1})
EXPECTED_BRACKETS = Counter({"STABLE":37,"RERUN_STABLE":2,"UNSTABLE":1})
EXPECTED_TYPED = Counter({"objective":40,"obligation":42,"decision_requirement":40,"intent":2})
EXPECTED_ROOTS = Counter({"obligation":42,"decision":40,"unresolved_intent":1,"conflict_only":1})
EXPECTED_APPLICABILITY = Counter({"APPLICABLE":73,"UNKNOWN":5,"SATISFIED":4,"SUPERSEDED":2})
EXPECTED_PRIVACY = ("p1e1r4_c09b0e9d61544bbf825d1aa9215879e8",
                    "source_packet:b8ac8fd78e794c25b476e145f4e6006b")
EXPECTED_CONFLICTS = {
 "p1e1r4_3592698cabc744789906162b61657890": {
   "class":"INCOMPATIBLE_OBLIGATIONS",
   "anchors":[
     "instruction:209593c8008649b28329b14e62766d68",
     "instruction:bf7abddd95bd48fcad6e6d742213599d",
     "objective:083dabaa11c34e499a492c2381aef180",
     "obligation:b3c3c67639594094abc930cc450fd274"],
   "id":"conf_1678bc3ce4fd286e0889d69a1bb6f3c4efdcc4ad7e0e801c422b98abf3b46f86"},
 "p1e1r4_80ccea1138af42d8843eabe2a10fec66": {
   "class":"INCOMPATIBLE_CURRENT_STATE",
   "anchors":[
     "assertion:9f4a8b630cdc4067a81be6875ee05386",
     "current_assertion:6f7e30c15ed84aa893f311aa237ce2be",
     "objective:0a9cb6c1b78a4910aa3d5e21fa960f51",
     "obligation:9902f0b12e9c4b20873e6e809e27d179"],
   "id":"conf_4e885b98fa34f80966df5c9584f3b10db0117d61f791fedc38e28ecf7ffa6613"},
 "p1e1r4_ac08b94cee624ed7a450e17e3389a163": {
   "class":"POSSIBLE_DUPLICATE_UNRESOLVED",
   "anchors":[
     "objective:46b9bfe032724b97a46b202187d43cc6",
     "obligation:af6abeb0cf104e19bf59b400088a90b7",
     "obligation:c1805592acb24fb884c9ec909d348408"],
   "id":"conf_d4ff9b505dcdbddfc874d18352b850524c188297ae3308a2510e3e3c2190429d"}
}

def fail(msg: str, failures: list[str]) -> None:
    failures.append(msg)

def git_show(commit: str, path: str) -> bytes:
    p = subprocess.run(["git","-C",str(ROOT),"show",f"{commit}:{path}"],
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p.returncode:
        raise RuntimeError(f"git show failed {commit}:{path}: {p.stderr.decode(errors='replace')}")
    return p.stdout

def git_blob_sha(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()

def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def canon(v):
    if isinstance(v, list):
        return "[" + ",".join(canon(x) for x in v) + "]"
    if isinstance(v, dict):
        return "{" + ",".join(json.dumps(k,ensure_ascii=False)+":"+canon(v[k]) for k in sorted(v)) + "}"
    return json.dumps(v,ensure_ascii=False,separators=(",",":"))

def same_versions(a,b):
    def norm(x):
        return sorted((v["record_ref"],v["version"]) for v in x.get("dependency_versions",[]))
    return norm(a)==norm(b)

def selected_read(case, failures):
    reads=case.get("snapshot_reads",[])
    if len(reads)==2 and same_versions(reads[0],reads[1]):
        return reads[0],"STABLE"
    if len(reads)==4 and not same_versions(reads[0],reads[1]):
        if same_versions(reads[2],reads[3]):
            return reads[2],"RERUN_STABLE"
        return reads[2],"UNSTABLE"
    fail(f"{case.get('case_id')}: malformed snapshot bracket", failures)
    return None,"INVALID"

def exact_conflict(case, cls, anchors):
    anchors=sorted(set(anchors), key=lambda x:x.encode("utf-8"))
    pre="|".join(["AARON",*anchors,cls])
    return "conf_"+hashlib.sha256(pre.encode()).hexdigest(), anchors

def main():
    failures=[]
    dep=json.loads(DEP_MANIFEST.read_text(encoding="utf-8"))
    matrix=json.loads(MATRIX.read_text(encoding="utf-8"))
    published=json.loads(PREFLIGHT.read_text(encoding="utf-8"))
    binding=BINDING.read_text(encoding="utf-8")
    builder=BUILDER.read_text(encoding="utf-8")

    # Exact dependency bytes/content addresses.
    for d in dep["dependencies"]:
        if "v0.2" in d["path"] or "v0.3" in d["path"] or "v0.4.md" in d["path"] and "BLUEPRINT" not in d["path"] or "v0.5" in d["path"] or "v0.6" in d["path"]:
            fail(f"historical binding entered semantic dependency manifest: {d['path']}", failures)
        data=git_show(d["commit"],d["path"])
        if len(data)!=d["bytes"]: fail(f"{d['id']}: byte mismatch", failures)
        if sha256(data)!=d["sha256"]: fail(f"{d['id']}: SHA256 mismatch", failures)
        if git_blob_sha(data)!=d["blob"]: fail(f"{d['id']}: blob mismatch", failures)

    by_id={d["id"]:d for d in dep["dependencies"]}
    manifest=json.loads(git_show(by_id["e1-manifest"]["commit"],by_id["e1-manifest"]["path"]))
    cases=[]
    for sid in ("e1-shard-01","e1-shard-02","e1-shard-03","e1-shard-04"):
        cases.extend(json.loads(git_show(by_id[sid]["commit"],by_id[sid]["path"])))

    if len(cases)!=40: fail(f"case count {len(cases)}", failures)
    ids=[c["case_id"] for c in cases]
    if ids!=manifest["case_ids_ordered"]: fail("ordered case IDs mismatch", failures)
    calc=hashlib.sha256(canon(cases).encode("utf-8")).hexdigest()
    if calc!=POP_SHA or calc!=manifest["population_sha256"]: fail("population digest mismatch", failures)

    avail=Counter(); brackets=Counter(); rtypes=Counter(); typed=Counter()
    root_counts=Counter(); app_counts=Counter(); privacy=[]
    obligations=[]; decisions=[]
    intent_scoped=0
    material_conflict_roots=0; conflict_field_roots=0; dup_ref_roots=0
    escalation_true=0; informational_true=0
    reserved_root_count=0; holder=Counter(); delegation=Counter()

    for c in cases:
        cid=c["case_id"]; records=c["records"]; byref={r["id"]:r for r in records}
        if sorted(c)!=EXPECTED_TOP: fail(f"{cid}: top-level shape", failures)
        if c["principal_id"]!="AARON": fail(f"{cid}: principal", failures)
        cc=c["coverage_contract"]
        if cc["contract_id"]!="PILOT001_IRIS_PLUS_QUALIFIED_BIG_V0_1" or cc["scope_version"]!=1:
            fail(f"{cid}: coverage contract", failures)
        if sorted(cc["required_surfaces"])!=sorted(EXPECTED_SURFACES):
            fail(f"{cid}: coverage surface set", failures)
        reqs=c["source_requirements"]
        if len(reqs)!=8 or sorted(r["surface"] for r in reqs)!=sorted(EXPECTED_SURFACES):
            fail(f"{cid}: source requirements", failures)
        if any(r["required_principal_id"]!="AARON" for r in reqs):
            fail(f"{cid}: source principal requirement", failures)

        env=c["source_envelopes"]
        if sorted(env)!=sorted(EXPECTED_SURFACES): fail(f"{cid}: envelopes", failures)
        for surf,e in env.items():
            avail[e["availability"]]+=1
            for ref in e["record_refs"]:
                if ref not in byref: fail(f"{cid}:{surf}: unresolved record_ref {ref}", failures)
            for ref in e["source_refs"]:
                if ref not in byref: fail(f"{cid}:{surf}: unresolved source_ref {ref}", failures)

        sel,br=selected_read(c,failures); brackets[br]+=1
        if sel and c["snapshot_time"]!=c["snapshot_reads"][0]["read_at"]:
            fail(f"{cid}: snapshot_time != first read", failures)

        if len(byref)!=len(records): fail(f"{cid}: duplicate record id", failures)
        for r in records:
            rtypes[r["record_type"]]+=1
            for ref in r.get("source_refs",[]):
                if ref not in byref: fail(f"{cid}:{r['id']}: unresolved source_ref {ref}", failures)
            if r["record_type"] in ("objective","obligation","decision_requirement","intent"):
                prefix=r["record_type"]+":"
                payload=r["id"][len(prefix):] if r["id"].startswith(prefix) else ""
                if not payload or ":" in payload: fail(f"{cid}:{r['id']}: invalid anchor namespace", failures)
                else: typed[r["record_type"]]+=1

        obs=[r for r in records if r["record_type"]=="obligation"]
        gov=[r for r in records if r["record_type"]=="obligation_governance"]
        apps=[r for r in records if r["record_type"]=="applicability_assertion"]
        life=[r for r in records if r["record_type"]=="lifecycle_event"]
        acts=[r for r in records if r["record_type"]=="action_decision"]

        for o in obs:
            gs=[g for g in gov if g["obligation_ref"]==o["id"]]
            if len(gs)!=1: fail(f"{cid}:{o['id']}: governance join count {len(gs)}", failures)
            a=sorted(x["applicability"] for x in apps if o["id"] in x.get("subject_refs",[]))
            l=sorted(x["event_kind"] for x in life if o["id"] in x.get("affected_record_refs",[]))
            obligations.append((o["status"],tuple(g["applicability_state"] for g in gs),tuple(a),tuple(l)))
            root_counts["obligation"]+=1
            val=gs[0]["applicability_state"] if gs else "UNKNOWN"
            app_counts[val]+=1
            if o["informational_only"]: informational_true+=1

        for d in [r for r in records if r["record_type"]=="decision_requirement"]:
            a=sorted(x["applicability"] for x in apps if d["id"] in x.get("subject_refs",[]))
            l=sorted(x["event_kind"] for x in life if d["id"] in x.get("affected_record_refs",[]))
            ads=[]
            for x in acts:
                if x.get("subject_ref")==d["id"] or d["id"] in x.get("resolves_record_refs",[]) or d["id"] in x.get("supersedes_record_refs",[]):
                    ads.append((x["status"],d["id"] in x.get("resolves_record_refs",[]),d["id"] in x.get("supersedes_record_refs",[])))
            decisions.append((d["status"],d["decision_history_complete"],tuple(a),tuple(l),tuple(ads)))
            root_counts["decision"]+=1
            app_counts[a[0] if a else "UNKNOWN"]+=1

        intents=[r for r in records if r["record_type"]=="intent"]
        effects=[r for r in records if r["record_type"]=="effect_record"]
        for it in intents:
            intent_scoped += sum(it["id"] in x.get("subject_refs",[]) for x in apps)
            es=[e for e in effects if e["intent_ref"]==it["id"]]
            if len(es)!=1: fail(f"{cid}:{it['id']}: effect join count {len(es)}", failures)
            elif es[0]["state"] in ("SUBMITTED_UNVERIFIED","AMBIGUOUS","RECONCILIATION_REQUIRED") and es[0]["consequential"]:
                root_counts["unresolved_intent"]+=1; app_counts["UNKNOWN"]+=1

        # Privacy census.
        for r in records:
            if r["record_type"]=="source_packet" and r.get("source_principal_id") not in (None,"AARON"):
                privacy.append((cid,r["id"]))

        # Conflicts.
        current=[r for r in records if r["record_type"]=="current_assertion"]
        instructions=[r for r in records if r["record_type"]=="instruction"]
        source_links=[r for r in records if r["record_type"]=="source_link_observation"]
        generated=[]
        for i,a in enumerate(instructions):
            for b in instructions[i+1:]:
                if a["subject_ref"]==b["subject_ref"] and a["instruction"]!=b["instruction"]:
                    obl=byref[a["subject_ref"]]
                    anchors=[a["id"],b["id"],obl["objective_ref"],obl["id"]]
                    generated.append(("INCOMPATIBLE_OBLIGATIONS",*exact_conflict(c,"INCOMPATIBLE_OBLIGATIONS",anchors)))
                    material_conflict_roots+=1; conflict_field_roots+=1
        cur_conflict=False
        for i,a in enumerate(current):
            for b in current[i+1:]:
                overlap=set(a.get("subject_refs",[])) & set(b.get("subject_refs",[]))
                if a["predicate"]==b["predicate"] and a["value"]!=b["value"] and overlap:
                    objective=sorted(overlap)[0]
                    linked=[o["id"] for o in obs if o.get("objective_ref")==objective]
                    if len(linked)!=1: fail(f"{cid}: current-state objective link count {len(linked)}", failures)
                    anchors=[a["id"],b["id"],objective,*linked]
                    generated.append(("INCOMPATIBLE_CURRENT_STATE",*exact_conflict(c,"INCOMPATIBLE_CURRENT_STATE",anchors)))
                    cur_conflict=True
        if cur_conflict:
            root_counts["conflict_only"]+=1; app_counts["APPLICABLE"]+=1
            material_conflict_roots+=1; conflict_field_roots+=1
        for sl in source_links:
            if sl["left_ref"]==sl["right_ref"] and sl["identity_proven"] is True:
                continue
            if sl["left_ref"]!=sl["right_ref"] and sl["identity_proven"] is not True and sl["possible_same_underlying_request"] is True and not sl["authoritative_merge_ref"]:
                left,right=byref[sl["left_ref"]],byref[sl["right_ref"]]
                anchors=[left["id"],right["id"],left["objective_ref"],right["objective_ref"]]
                generated.append(("POSSIBLE_DUPLICATE_UNRESOLVED",*exact_conflict(c,"POSSIBLE_DUPLICATE_UNRESOLVED",anchors)))
                material_conflict_roots+=2; conflict_field_roots+=2; dup_ref_roots+=2

        if cid in EXPECTED_CONFLICTS:
            exp=EXPECTED_CONFLICTS[cid]
            found=[g for g in generated if g[0]==exp["class"]]
            if len(found)!=1 or found[0][1]!=exp["id"] or found[0][2]!=exp["anchors"]:
                fail(f"{cid}: exact conflict mismatch {found}", failures)
        elif generated:
            fail(f"{cid}: unexpected generated conflict", failures)

        # Reserved authority / delegation census at root granularity.
        nexts=[r for r in records if r["record_type"]=="required_next_step"]
        if nexts:
            authority_env=env["authority_state"]
            states=[r for r in records if r["record_type"]=="authority_generation_state"]
            state=states[0] if len(states)==1 else None
            for n in nexts:
                reserved_root_count += 2
                if authority_env["availability"]!="PRESENT" or not state:
                    holder["UNKNOWN"]+=2; delegation["OMITTED"]+=2; authority_unknown_roots+=2
                else:
                    gs=[g for g in gov if g["obligation_ref"]==n["subject_ref"]]
                    ah=gs[0].get("authority_holder_identity_id") if len(gs)==1 else None
                    holder[ah or "UNKNOWN"]+=2
                    leases=[r for r in records if r["record_type"]=="authority_lease" and r["id"] in state.get("authority_lease_refs",[])]
                    ok=False
                    for l in leases:
                        ep=next((e for e in records if e["record_type"]=="work_episode" and e["id"]==l["episode_ref"]),None)
                        t=sel["read_at"] if sel else ""
                        checks=[
                          l["state"]=="ACTIVE", (not l.get("expires_at") or l["expires_at"]>=t),
                          l["authority_domain_ref"]==state["id"], l["generation"]==state["current_generation"],
                          l["principal"]=="AARON", l["principal_id"]=="AARON",
                          l["operation_scope"]==state["operation_scope"],
                          l["privacy_policy_version"]==state["privacy_policy_version"],
                          l["privacy_scope"]==state["privacy_scope"],
                          l["authority_policy_version"]==state["authority_policy_version"],
                          ep is not None and ep["worker_ref"]==l["worker_ref"]
                        ]
                        if all(checks): ok=True
                    delegation["TRUE" if ok else "FALSE"]+=2

    if avail!=EXPECTED_AVAIL: fail(f"availability census {avail}", failures)
    if brackets!=EXPECTED_BRACKETS: fail(f"bracket census {brackets}", failures)
    if set(rtypes)!=EXPECTED_TYPES: fail(f"record type set {sorted(rtypes)}", failures)
    if typed!=EXPECTED_TYPED: fail(f"typed ID census {typed}", failures)
    if intent_scoped!=0: fail(f"intent-scoped applicability assertions {intent_scoped}", failures)
    if root_counts!=EXPECTED_ROOTS: fail(f"root census {root_counts}", failures)
    # Exact authority UNKNOWN is load-bearing on the two reserved roots.
    if authority_unknown_roots:
        app_counts["APPLICABLE"]-=authority_unknown_roots
        app_counts["UNKNOWN"]+=authority_unknown_roots
    if app_counts!=EXPECTED_APPLICABILITY: fail(f"candidate applicability census {app_counts}", failures)
    if privacy!=[EXPECTED_PRIVACY]: fail(f"privacy census {privacy}", failures)
    if material_conflict_roots!=4 or conflict_field_roots!=4 or dup_ref_roots!=2:
        fail(f"conflict root census {material_conflict_roots}/{conflict_field_roots}/{dup_ref_roots}", failures)
    if escalation_true!=0 or informational_true!=1:
        fail(f"boolean census escalation={escalation_true} informational={informational_true}", failures)
    if reserved_root_count!=20 or holder!=Counter({"AARON":18,"UNKNOWN":2}) or delegation!=Counter({"FALSE":18,"OMITTED":2}):
        fail(f"authority root census reserved={reserved_root_count} holder={holder} delegation={delegation}", failures)

    # Matrix/package cross-checks.
    structures={r["source_structure"] for r in matrix["rows"]}
    for required in EXPECTED_TOP:
        if required not in structures: fail(f"matrix missing top-level {required}", failures)
    for required in EXPECTED_TYPES:
        if required not in structures: fail(f"matrix missing record type {required}", failures)
    if "impact_packet" not in structures: fail("matrix missing impact_packet object row", failures)
    if matrix.get("candidate_root_census",{}).get("total")!=84: fail("matrix root census drift", failures)
    if matrix.get("privacy_exclusion_census",{}).get("total_excluded_records")!=1: fail("matrix privacy census drift", failures)
    if len(matrix.get("demonstrated_conflict_generation",{}).get("exact_identities",[]))!=3: fail("matrix conflict identity drift", failures)

    # Published preflight must itself claim no failures only when verifier agrees.
    if published.get("failures")!=[]: fail("published preflight contains failures", failures)
    if published.get("disposition")!="40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES":
        fail("published preflight disposition drift", failures)
    if published.get("candidate_invoked") is not False or published.get("buildProjection_invoked") is not False:
        fail("published preflight claims candidate invocation", failures)
    if published.get("labels_consumed")!=0 or published.get("candidate_outputs_consumed")!=0 or published.get("scoring") is not False:
        fail("published independence counters drift", failures)

    # Standalone/reviewer architecture guards.
    for bad in ("remain normative","normative unchanged","historical binding documents to reconstruct"):
        if bad in binding and "NOT required" not in binding:
            fail(f"possible inherited normative wording: {bad}", failures)
    for code in ("UNMAPPED_CANDIDATE_ANCHOR_NAMESPACE","UNMAPPED_INTENT_APPLICABILITY_SHAPE","UNMAPPED_REPLACEMENT_E1_STRUCTURE"):
        if code not in binding: fail(f"binding missing explicit guard {code}", failures)
    if "F108" not in builder: fail("builder falsifier packet incomplete", failures)

    result={
      "artifact":"IRIS-PILOT-001-STANDALONE-BINDING-v1.0-STATIC-VERIFIER-RESULT",
      "candidate_invoked":False,"buildProjection_invoked":False,
      "labels_consumed":0,"candidate_outputs_consumed":0,"scoring":False,
      "case_count":len(cases),"population_sha256":calc,
      "availability_census":dict(avail),"bracket_census":dict(brackets),
      "record_type_count":len(rtypes),"candidate_root_census":dict(root_counts),
      "candidate_applicability_census":dict(app_counts),
      "material_conflict_roots":material_conflict_roots,
      "privacy_exclusion_count":len(privacy),
      "reserved_authority_root_count":reserved_root_count,
      "authority_holder_census":dict(holder),"valid_delegation_census":dict(delegation),
      "failures":failures,
      "disposition":"40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES" if not failures else "BINDING_CORRECTION_HOLD / STATIC_TOTALITY_VERIFIER_FAILURE"
    }
    print(json.dumps(result,indent=2,sort_keys=True))
    return 0 if not failures else 1

if __name__=="__main__":
    sys.exit(main())
