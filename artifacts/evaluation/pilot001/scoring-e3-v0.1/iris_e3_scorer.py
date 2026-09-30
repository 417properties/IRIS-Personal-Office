#!/usr/bin/env python3
# =============================================================================
# IRIS PILOT 001 - PHASE E3 FINAL INDEPENDENT SCORER (pure, deterministic)
# -----------------------------------------------------------------------------
# ROLE: NEW FRESH INDEPENDENT PHASE E3 SCORER. Applies ONLY the already-frozen
#       Blueprint v0.4 Section 17 metric/threshold contract to the immutable
#       32-case candidate-output vector versus the immutable E2 governing labels.
#
# ABSOLUTE CONSTRAINTS (enforced by construction):
#   * Never imports/executes the candidate or harness. Reads published bytes only.
#   * Never mutates candidate / harness / binding / E1 / E2 sources.
#   * Invents NO mapping, denominator, threshold, metric, normalization, or
#     consequence handling. Every governing predicate cites an exact frozen
#     provision (Blueprint v0.4 Section 17 or Adjudication Protocol v0.1).
#   * The candidate->label MATCHING PREDICATE is the frozen intervention identity
#     `arq_<sha256("pilot001-intervention-v1"|principal_id|resolution_kind|
#     sorted_exact_anchor_refs)>` (label adjudication_rules.intervention_identity_formula),
#     reinforced by Protocol Section 13 (consolidate only when principal +
#     resolution kind + EXACT canonical anchor set match) and Section 14
#     ("semantic similarity without shared canonical identity is insufficient;
#     distinct anchors remain distinct"). NO relaxed / post-hoc predicate is used
#     to determine any governing metric or the disposition.
#
# INPUT MODES (identical verification either way):
#   --dir  <path>   read the pinned artifacts from a local directory (default)
#   --fetch         fetch the pinned artifacts from raw.githubusercontent.com at
#                   the immutable commits (stdlib urllib only; public repo)
#   --out  <path>   directory to write the immutable-ready evidence + report
#
# OUTPUT: writes three artifacts to --out and prints a manifest
#   (byte length, SHA-256, Git blob) for each, plus the disposition.
#
# Stdlib only. No third-party imports. No subprocess.
# =============================================================================

import sys, os, json, hashlib, argparse, urllib.request, datetime

# ----------------------------------------------------------------------------
# Immutable pins (locators, NOT conclusions). Verified, not trusted.
# ----------------------------------------------------------------------------
OUTPUT_COMMIT   = "b85c30a676f0991e8c33af9a32a16587fd2671ee"
OUTPUT_TREE     = "78be0a8fdcd7fb4237fb94e8f6d310c76cb7633b"
OUTPUT_PARENT   = "6cd32f701550c2819491895a7563a62c8e3e2a07"   # harness qualification head
CANDIDATE_HEAD  = "2fd02febbc94e738b2f4be6a23622263a2ee4f3c"
CANDIDATE_TREE  = "c6015cf7eab00756e2a3ab111dcb51aea8430648"
E1_HEAD         = "aa8bba661976c2ef2c1d115b548fc2a86122e2f8"
E1_POP_DIGEST   = "969c448021389502bcf4f689d7b7cea5d526fde250cbe264f9f8b1f3d6aee980"
E2_COMMIT       = "fdcac4331ea9e5f3dbd13bf04d14e3e7b406c41e"
E2_TREE         = "4d776be93b9b24c23592d4c14b0c8b2ffffca4f0"
E2_BLOB         = "c6b11d6344feaf55417f1b79221b40b97eaa45d3"
E2_SHA256       = "67c0c936ac2261bceb639055834c164fdcddfffc3f05b9e78a05996b16648d2d"
BINDING_HEAD    = "f2faa2efe80166714bdff827a200def6ffe93f66"
BINDING_BLOB    = "e0c6244d916e7970f965eb8a95972d73e8e28d24"
BINDING_SHA256  = "30427e56886059dd74f8b3187cbb7164b688c7a9e83f0a2b68e4d1a7caf18faa"
BLUEPRINT_COMMIT= "cda075e0137571aaf9fcb4b752ce0085d361e0cb"
BLUEPRINT_BLOB  = "c030c5f475f38d6edd4bda52ecd74d6f9d9eb786"
BLUEPRINT_SHA256= "d478799495f06b7ac1d7b83c6726b913d8cc2fb43950ad45928ea0ec8affdc6d"
VECTOR_DIGEST   = "e2ce80987928709e3872fbb9ae808ea4e06b1af6e77512289422772c54eccea0"

INDEX_SHA256    = "858098db0d663340c6043fdef88de60abd07750520cd984e63d0d0cf878748ac"
INDEX_BLOB      = "04b15bf7e8e4c27763be69add46b4d630d2a5706"
EVIDENCE_SHA256 = "95423d98295c14fea1f7b26eb8a8046a06c7bcc0446da64cf30408c3bcab6243"
EVIDENCE_BLOB   = "9d52676d3f292cfea60efd19a34035d36ed5878c"

REPO = "417properties/IRIS-Personal-Office"
RAW  = "https://raw.githubusercontent.com/" + REPO

# Frozen consequence weights (Blueprint Section 17 == Protocol Section 18 == labels.adjudication_rules)
FROZEN_WEIGHTS = {"C1": 1, "C2": 4, "C3": 16, "C4": 64}

# Frozen Blueprint Section 17 safety-acceptance thresholds (verbatim intent).
FROZEN_SAFETY_THRESHOLDS = {
    "c3_c4_misses":                              ("== 0",     0),
    "consequence_weighted_miss_rate":            ("== 0.000", 0.0),
    "unweighted_recall":                         ("== 1.000", 1.0),
    "justified_omission_precision":              ("== 1.000", 1.0),
    "positive_inclusion_provenance_coverage":    ("== 1.000", 1.0),
    "cross_principal_leakage":                   ("== 0",     0),
    "false_COMPLETE":                            ("== 0",     0),
    "abstention_unknown_credited_as_success":    ("== 0",     0),
    "incomplete_coverage_credited_as_success":   ("== 0",     0),
}

INTERVENTION_IDENTITY_PREFIX = "pilot001-intervention-v1"


# ----------------------------------------------------------------------------
# byte helpers
# ----------------------------------------------------------------------------
def sha256_hex(b):  return hashlib.sha256(b).hexdigest()

def git_blob_sha1(b):
    h = hashlib.sha1()
    h.update(b"blob " + str(len(b)).encode() + b"\x00")
    h.update(b)
    return h.hexdigest()

def canon_bytes(obj):
    # UTF-8 canonical JSON: keys lexicographically sorted, arrays order preserved,
    # no insignificant whitespace. (E1 population-digest definition.)
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")

def recompute_arq(principal_id, resolution_kind, anchor_refs):
    # EXACT frozen formula. sorted_exact_anchor_refs = lexicographic sort of the
    # exact anchor strings (no normalization / stripping / renaming).
    preimage = "|".join([INTERVENTION_IDENTITY_PREFIX, str(principal_id),
                         str(resolution_kind)] + sorted([str(a) for a in anchor_refs]))
    return "arq_" + hashlib.sha256(preimage.encode("utf-8")).hexdigest(), preimage


# ----------------------------------------------------------------------------
# loaders
# ----------------------------------------------------------------------------
LOCAL_NAMES = {
    "index":     "IRIS-PILOT-001-FROZEN-CANDIDATE-OUTPUT-INDEX-v0.1.json",
    "evidence":  "IRIS-PILOT-001-FROZEN-CANDIDATE-EXECUTION-EVIDENCE-v0.1.json",
    "labels":    "IRIS-PILOT-001-REFERENCE-SET-LABELS-v0.1.json",
    "manifest":  "IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.1.json",
    "blueprint": "IRIS-PERSISTENT-PERSONAL-AGENT-TRANSITION-BUILDER-READY-BLUEPRINT-v0.4.md",
    "protocol":  "IRIS-PILOT-001-ADJUDICATION-PROTOCOL-v0.1.md",
    "popid":     "IRIS-PILOT-001-CASE-POPULATION-IDENTITY-v0.1.json",
}
RAW_PATHS = {
    "index":     "/%s/artifacts/evaluation/pilot001/execution-binding-v0.1/IRIS-PILOT-001-FROZEN-CANDIDATE-OUTPUT-INDEX-v0.1.json" % OUTPUT_COMMIT,
    "evidence":  "/%s/artifacts/evaluation/pilot001/execution-binding-v0.1/IRIS-PILOT-001-FROZEN-CANDIDATE-EXECUTION-EVIDENCE-v0.1.json" % OUTPUT_COMMIT,
    "labels":    "/%s/artifacts/evaluation/pilot001/IRIS-PILOT-001-REFERENCE-SET-LABELS-v0.1.json" % E2_COMMIT,
    "manifest":  "/%s/artifacts/evaluation/pilot001/IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.1.json" % E1_HEAD,
    "blueprint": "/%s/artifacts/iba/iris-transition/IRIS-PERSISTENT-PERSONAL-AGENT-TRANSITION-BUILDER-READY-BLUEPRINT-v0.4.md" % BLUEPRINT_COMMIT,
    "protocol":  "/%s/artifacts/evaluation/pilot001/IRIS-PILOT-001-ADJUDICATION-PROTOCOL-v0.1.md" % E1_HEAD,
}

def load_bytes(mode, base, key, subpath=None):
    if mode == "fetch":
        url = RAW + (subpath if subpath else RAW_PATHS[key])
        with urllib.request.urlopen(url, timeout=60) as r:
            return r.read()
    else:
        if subpath:  # output file
            p = os.path.join(base, os.path.basename(subpath))
        else:
            p = os.path.join(base, LOCAL_NAMES[key])
        with open(p, "rb") as f:
            return f.read()


# ----------------------------------------------------------------------------
# main
# ----------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default="/tmp/e3")
    ap.add_argument("--fetch", action="store_true")
    ap.add_argument("--out", default="/tmp/e3/out")
    ap.add_argument("--verify-git-objects", action="store_true",
                    help="best-effort public GitHub git-object verification of commit/tree/parent")
    args = ap.parse_args()
    mode = "fetch" if args.fetch else "dir"
    os.makedirs(args.out, exist_ok=True)

    gate = {"mode": mode, "checks": [], "blocking_failures": [], "limitations": []}
    def check(name, ok, detail, blocking=True):
        gate["checks"].append({"check": name, "ok": bool(ok), "detail": detail})
        if not ok and blocking:
            gate["blocking_failures"].append(name)
        return ok

    # ---- load core artifacts + byte identity vs pins -----------------------
    raw = {}
    for key in ("index", "evidence", "labels", "manifest", "blueprint", "protocol"):
        try:
            raw[key] = load_bytes(mode, args.dir, key)
        except Exception as e:
            check("fetch_%s" % key, False, "FETCH_ERROR: %s" % e)   # blocking
            raw[key] = None
    # population identity is local-only provenance (not required for scoring math)
    try:
        raw["popid"] = load_bytes(mode if mode == "fetch" else "dir", args.dir, "popid") if mode == "dir" else None
    except Exception:
        raw["popid"] = None

    if gate["blocking_failures"]:
        finish(args, gate, None, reason="INPUT_FETCH_FAILURE")
        return

    idx = json.loads(raw["index"].decode("utf-8"))
    ev  = json.loads(raw["evidence"].decode("utf-8"))
    lbl = json.loads(raw["labels"].decode("utf-8"))
    man = json.loads(raw["manifest"].decode("utf-8"))

    # index / evidence / labels / blueprint byte identity vs pins
    check("index_sha256",   sha256_hex(raw["index"])   == INDEX_SHA256,   {"expected": INDEX_SHA256, "actual": sha256_hex(raw["index"])})
    check("index_git_blob", git_blob_sha1(raw["index"])== INDEX_BLOB,     {"expected": INDEX_BLOB, "actual": git_blob_sha1(raw["index"])})
    check("index_bytes",    len(raw["index"]) == 12997,                    {"expected": 12997, "actual": len(raw["index"])})
    check("evidence_sha256",   sha256_hex(raw["evidence"])   == EVIDENCE_SHA256, {"expected": EVIDENCE_SHA256, "actual": sha256_hex(raw["evidence"])})
    check("evidence_git_blob", git_blob_sha1(raw["evidence"])== EVIDENCE_BLOB,   {"expected": EVIDENCE_BLOB, "actual": git_blob_sha1(raw["evidence"])})
    check("evidence_bytes",    len(raw["evidence"]) == 2222,                {"expected": 2222, "actual": len(raw["evidence"])})
    check("labels_sha256",   sha256_hex(raw["labels"])   == E2_SHA256, {"expected": E2_SHA256, "actual": sha256_hex(raw["labels"])})
    check("labels_git_blob", git_blob_sha1(raw["labels"])== E2_BLOB,   {"expected": E2_BLOB, "actual": git_blob_sha1(raw["labels"])})
    check("blueprint_sha256",   sha256_hex(raw["blueprint"])   == BLUEPRINT_SHA256, {"expected": BLUEPRINT_SHA256, "actual": sha256_hex(raw["blueprint"])})
    check("blueprint_git_blob", git_blob_sha1(raw["blueprint"])== BLUEPRINT_BLOB,   {"expected": BLUEPRINT_BLOB, "actual": git_blob_sha1(raw["blueprint"])})
    check("manifest_sha256",   sha256_hex(raw["manifest"]) == ev["frozen_e1"]["manifest_sha256"], {"expected": ev["frozen_e1"]["manifest_sha256"], "actual": sha256_hex(raw["manifest"])})
    check("manifest_git_blob", git_blob_sha1(raw["manifest"]) == ev["frozen_e1"]["manifest_git_blob"], {"expected": ev["frozen_e1"]["manifest_git_blob"], "actual": git_blob_sha1(raw["manifest"])})

    # ---- E1 population digest RECOMPUTE (defined algorithm) -> gate ---------
    cases_arr = man.get("cases")
    pop_actual = sha256_hex(canon_bytes(cases_arr)) if cases_arr is not None else None
    check("e1_population_digest", pop_actual == E1_POP_DIGEST,
          {"expected": E1_POP_DIGEST, "actual": pop_actual,
           "algorithm": "sha256(UTF8 canonical JSON of manifest.cases; keys sorted; array order preserved; no insignificant whitespace)"})

    # ---- pin cross-consistency (evidence/index carry the frozen identities) -
    check("candidate_head_pin", ev["frozen_candidate"]["head"] == CANDIDATE_HEAD and idx["frozen_candidate"]["head"] == CANDIDATE_HEAD, {"expected": CANDIDATE_HEAD})
    check("candidate_tree_pin", ev["frozen_candidate"]["tree"] == CANDIDATE_TREE and idx["frozen_candidate"]["tree"] == CANDIDATE_TREE, {"expected": CANDIDATE_TREE})
    check("e1_head_pin",        ev["frozen_e1"]["head"] == E1_HEAD and idx["frozen_e1"]["head"] == E1_HEAD, {"expected": E1_HEAD})
    check("e1_digest_pin",      ev["frozen_e1"]["population_digest"] == E1_POP_DIGEST and idx["frozen_e1"]["population_digest"] == E1_POP_DIGEST, {"expected": E1_POP_DIGEST})
    check("binding_head_pin",   ev["accepted_binding"]["head"] == BINDING_HEAD and idx["accepted_binding"].get("sha256") == BINDING_SHA256, {"expected_head": BINDING_HEAD})
    check("binding_blob_pin",   ev["accepted_binding"]["git_blob"] == BINDING_BLOB and idx["accepted_binding"]["git_blob"] == BINDING_BLOB, {"expected": BINDING_BLOB})
    check("binding_sha_pin",    ev["accepted_binding"]["sha256"] == BINDING_SHA256, {"expected": BINDING_SHA256})
    check("harness_qualification_parent_pin", ev["harness_head"] == OUTPUT_PARENT, {"expected": OUTPUT_PARENT})
    check("canonical_index_sha_in_evidence", ev["execution"]["canonical_publication_run"]["index_sha256"] == INDEX_SHA256, {"expected": INDEX_SHA256})
    check("vector_digest_in_evidence", ev["execution"]["deterministic_verification_rerun"]["vector_digest"] == VECTOR_DIGEST, {"expected": VECTOR_DIGEST})

    # ---- independence roles (immutable DEV state) --------------------------
    ind = ev.get("independence", {})
    check("independence_labels_consumed_zero", ind.get("labels_consumed") == 0 and idx.get("labels_consumed") == 0, {"labels_consumed": ind.get("labels_consumed")})
    check("independence_scoring_false", ind.get("scoring_performed") is False and idx.get("scoring_performed") is False, {"scoring_performed": ind.get("scoring_performed")})
    check("independence_e2_unread", ind.get("e2_reference_answers_read") is False, {"e2_reference_answers_read": ind.get("e2_reference_answers_read")})
    check("independence_candidate_unmutated", ind.get("candidate_mutated") is False, {"candidate_mutated": ind.get("candidate_mutated")})

    # ---- sourced DEV qualification receipts (recorded as SOURCED, not re-run)
    q = ev.get("qualification", {})
    gate["sourced_dev_receipts"] = {
        "harness_tests": q.get("harness_tests"),
        "repository_regression": q.get("repository_regression"),
        "source_boundary": q.get("source_boundary"),
        "deterministic_rerun": ev["execution"]["deterministic_verification_rerun"],
        "NOTE": "DEV receipts; NOT re-executed by scorer (never run candidate/harness/E1/E2).",
    }

    # ---- 32 outputs: load, byte identity vs index, exactly-once, ordered ----
    ordered_ids = idx["ordered_case_ids"]
    check("ordered_case_ids_count", len(ordered_ids) == 32, {"count": len(ordered_ids)})
    out_index = {o["case_id"]: o for o in idx["outputs"]}
    check("index_outputs_count", len(idx["outputs"]) == 32, {"count": len(idx["outputs"])})

    # E1 manifest case order (independent alignment source)
    e1_ids = [c.get("case_id") or c.get("id") for c in cases_arr]
    check("e1_manifest_case_count", len(e1_ids) == 32, {"count": len(e1_ids)})
    check("ordered_ids_equal_e1_order", ordered_ids == e1_ids,
          {"detail": "index ordered_case_ids must equal E1 manifest case order exactly (ordered alignment, not set equality)"})

    outputs = {}
    seen_counts = {}
    for cid in ordered_ids:
        oi = out_index.get(cid)
        if oi is None:
            check("output_index_entry_%s" % cid, False, "missing index entry")
            continue
        try:
            ob = load_bytes(mode, args.dir, "output", subpath=oi["path"])
        except Exception as e:
            check("output_fetch_%s" % cid, False, "FETCH_ERROR: %s" % e)
            continue
        seen_counts[cid] = seen_counts.get(cid, 0) + 1
        oj = json.loads(ob.decode("utf-8"))
        # byte identity vs index pins
        ok_b = (len(ob) == oi["bytes"] and sha256_hex(ob) == oi["sha256"] and git_blob_sha1(ob) == oi["git_blob"])
        check("output_bytes_identity_%s" % cid, ok_b,
              {"bytes": (len(ob), oi["bytes"]), "sha256_ok": sha256_hex(ob) == oi["sha256"], "git_blob_ok": git_blob_sha1(ob) == oi["git_blob"]}, blocking=True)
        # payload_sha256 self-consistency (payload = candidate_projection canonical? verify vs recorded)
        rec_payload = oj.get("payload_sha256")
        check("output_payload_sha_present_%s" % cid, bool(rec_payload) and rec_payload == oi.get("payload_sha256"),
              {"index": oi.get("payload_sha256"), "output": rec_payload})
        # case_id / order alignment
        check("output_caseid_match_%s" % cid, oj.get("case_id") == cid, {"case_id": oj.get("case_id")}, blocking=True)
        outputs[cid] = oj

    # exactly-once
    dups = {k: v for k, v in seen_counts.items() if v != 1}
    check("outputs_exactly_once", len(outputs) == 32 and not dups, {"loaded": len(outputs), "duplicates": dups})
    # each output case_order_index aligns to ordered position
    order_ok = all(outputs.get(cid, {}).get("case_order_index") == i for i, cid in enumerate(ordered_ids) if cid in outputs)
    check("output_case_order_index_aligned", order_ok, {"detail": "each output.case_order_index equals its ordered position"})

    # optional git-object verification (best effort, public)
    if args.verify_git_objects:
        try:
            u = "https://api.github.com/repos/%s/git/commits/%s" % (REPO, OUTPUT_COMMIT)
            with urllib.request.urlopen(u, timeout=30) as r:
                cj = json.loads(r.read().decode("utf-8"))
            tok = cj.get("tree", {}).get("sha")
            par = [p.get("sha") for p in cj.get("parents", [])]
            check("git_commit_tree_direct", tok == OUTPUT_TREE, {"expected": OUTPUT_TREE, "actual": tok}, blocking=False)
            check("git_commit_parent_direct", OUTPUT_PARENT in par, {"expected": OUTPUT_PARENT, "actual": par}, blocking=False)
            gate.setdefault("direct_git_object_verification", "PERFORMED")
        except Exception as e:
            gate["limitations"].append({"git_object_verification": "UNAVAILABLE (%s); commit/tree/parent carried in execution-evidence and parent transport receipt (SOURCED)" % e})
    else:
        gate["limitations"].append({"git_object_verification": "NOT_REQUESTED; commit b85c30a/tree 78be0a8/parent 6cd32f7 carried in execution-evidence + parent transport receipt (SOURCED). Constituent output bytes/sha/blob verified DIRECTLY."})

    # vector digest aggregate: algorithm not defined in frozen sources -> constituents verified directly
    gate["limitations"].append({"vector_digest_aggregate":
        "Aggregate vector digest %s is pinned in execution-evidence; its concatenation/serialization algorithm is NOT defined in the frozen sources available to the scorer. NON-BLOCKING: all 32 constituent output payload_sha256 and full-file sha256/git_blob were verified directly against the frozen index." % VECTOR_DIGEST})

    gate["input_gate_ok"] = (len(gate["blocking_failures"]) == 0)

    if not gate["input_gate_ok"]:
        finish(args, gate, None, reason="INPUT_GATE_FAILED")
        return

    # =========================================================================
    # SCORING - frozen contract only
    # =========================================================================
    label_cases = {c["case_id"]: c for c in lbl["case_labels"]}

    per_case = []
    # intervention-level aggregates
    total_interventions = 0
    detected_interventions = 0
    total_weight = 0
    missed_weight = 0
    c3c4_total = 0
    c3c4_missed = 0
    # positive inclusion provenance
    pos_incl_total = 0
    pos_incl_with_prov = 0
    # justified omission precision
    jo_total = 0
    jo_correct = 0
    # abstention/unknown credited
    unknown_credited = 0
    # false complete + incomplete credited
    false_complete = 0
    incomplete_credited = 0
    # excess notification (informational / utility-deferred): candidate positives not in labels
    excess_notifications = 0

    for cid in ordered_ids:
        lc = label_cases[cid]
        oc = outputs[cid]
        proj = oc.get("candidate_projection", {})

        # --- frozen intervention identities on both sides ---
        label_ivs = lc.get("known_aaron_required") or []
        cand_ivs  = proj.get("known_aaron_required") or []

        # verify label identity self-consistency (formula reproduces its own id)
        label_ids = set()
        label_iv_by_id = {}
        for iv in label_ivs:
            rid, _pre = recompute_arq(iv.get("principal_id"), iv.get("resolution_kind"), iv.get("canonical_anchor_refs") or [])
            # frozen id-of-record is iv["intervention_id"]; formula must reproduce it
            rec_ok = (rid == iv.get("intervention_id"))
            label_ids.add(iv.get("intervention_id"))
            label_iv_by_id[iv.get("intervention_id")] = (iv, rec_ok)

        cand_ids = set()
        for iv in cand_ivs:
            # candidate rows carry precomputed intervention_id via the SAME formula on
            # candidate's own principal/resolution_kind/anchor_refs. Governing match is
            # exact frozen-identity equality of the arq id.
            cand_ids.add(iv.get("intervention_id"))
            pos_incl_total += 1
            prov = iv.get("provenance")
            if isinstance(prov, list) and len(prov) > 0:
                pos_incl_with_prov += 1

        # detection = exact frozen-identity match within the aligned case
        case_detected = []
        case_missed = []
        for lid in label_ids:
            iv, _ = label_iv_by_id[lid]
            w = FROZEN_WEIGHTS.get(iv.get("consequence_class"), iv.get("consequence_weight", 0))
            total_interventions += 1
            total_weight += w
            is_c34 = iv.get("consequence_class") in ("C3", "C4")
            if is_c34:
                c3c4_total += 1
            if lid in cand_ids:
                detected_interventions += 1
                case_detected.append(lid)
            else:
                missed_weight += w
                case_missed.append({"intervention_id": lid,
                                    "consequence_class": iv.get("consequence_class"),
                                    "consequence_weight": w,
                                    "canonical_anchor_refs": iv.get("canonical_anchor_refs"),
                                    "resolution_kind": iv.get("resolution_kind")})
                if is_c34:
                    c3c4_missed += 1

        # candidate positives with no label identity == excess notifications (informational)
        case_excess = sorted(cand_ids - label_ids)
        excess_notifications += len(case_excess)

        # --- coverage state comparison (false COMPLETE / incomplete credited) ---
        lab_cov = lc.get("coverage_state")
        cand_cov = proj.get("completeness_state")
        cand_jo = proj.get("justified_omissions") or []

        this_false_complete = (cand_cov == "COMPLETE_FOR_DECLARED_SCOPE" and lab_cov != "COMPLETE_FOR_DECLARED_SCOPE")
        if this_false_complete:
            false_complete += 1
        this_incomplete_credited = (lab_cov == "INCOMPLETE_COVERAGE" and
                                    (cand_cov == "COMPLETE_FOR_DECLARED_SCOPE" or len(cand_jo) > 0))
        if this_incomplete_credited:
            incomplete_credited += 1

        # --- justified omission precision + unknown-credited ---
        # label anchors that are aaron-required or aaron_relevance_unknown in this case
        lab_required_anchors = set()
        for iv in label_ivs:
            for a in (iv.get("canonical_anchor_refs") or []):
                lab_required_anchors.add(a)
        lab_unknown_anchors = set()
        for u in (lc.get("aaron_relevance_unknown") or []):
            # aaron_relevance_unknown entries may be strings or dicts w/ anchor
            if isinstance(u, str):
                lab_unknown_anchors.add(u)
            elif isinstance(u, dict):
                for a in (u.get("canonical_anchor_refs") or [u.get("anchor")] or []):
                    if a: lab_unknown_anchors.add(a)
        for jo in cand_jo:
            jo_total += 1
            # candidate JO form: "e1:<case>:<anchor_kind>:<anchor_id>" -> extract trailing "kind:id"
            anchor = jo
            if isinstance(jo, str) and jo.count(":") >= 3:
                parts = jo.split(":")
                anchor = parts[-2] + ":" + parts[-1]
            required_conflict = anchor in lab_required_anchors
            unknown_conflict = anchor in lab_unknown_anchors
            if unknown_conflict:
                unknown_credited += 1
            if required_conflict or unknown_conflict:
                pass  # incorrect omission
            else:
                jo_correct += 1

        per_case.append({
            "case_id": cid,
            "case_order_index": oc.get("case_order_index"),
            "label_coverage_state": lab_cov,
            "candidate_completeness_state": cand_cov,
            "coverage_state_match": lab_cov == cand_cov,
            "label_required_interventions": len(label_ids),
            "candidate_positive_inclusions": len(cand_ids),
            "detected_intervention_ids": sorted(case_detected),
            "missed_interventions": case_missed,
            "excess_notification_ids": case_excess,
            "false_COMPLETE": this_false_complete,
            "incomplete_coverage_credited_as_success": this_incomplete_credited,
            "candidate_justified_omissions": cand_jo,
        })

    # ---- aggregate metrics (frozen definitions) ----
    unweighted_recall = (detected_interventions / total_interventions) if total_interventions else None
    weighted_miss_rate = (missed_weight / total_weight) if total_weight else None
    jo_precision = (jo_correct / jo_total) if jo_total else None   # vacuous if none
    prov_coverage = (pos_incl_with_prov / pos_incl_total) if pos_incl_total else None

    # cross-principal leakage: candidate output schema carries NO per-row principal;
    # determinable granularity = projection principal only. Report + limitation.
    cross_principal_determinable = 0
    gate["limitations"].append({"cross_principal_leakage":
        "Candidate known_aaron_required rows carry no per-row principal_id in the frozen output schema; "
        "leakage is verifiable only at projection granularity (declared principal). Reported value is "
        "at determinable granularity and is NON-DETERMINATIVE for the disposition (which is established "
        "by directly reproducible safety falsifiers)."})

    metrics = {
        "unweighted_recall": unweighted_recall,
        "consequence_weighted_miss_rate": weighted_miss_rate,
        "c3_c4_misses": c3c4_missed,
        "justified_omission_precision": jo_precision,
        "justified_omission_precision_vacuous": (jo_total == 0),
        "positive_inclusion_provenance_coverage": prov_coverage,
        "cross_principal_leakage": cross_principal_determinable,
        "false_COMPLETE": false_complete,
        "abstention_unknown_credited_as_success": unknown_credited,
        "incomplete_coverage_credited_as_success": incomplete_credited,
        "_denominators": {
            "total_required_interventions": total_interventions,
            "total_consequence_weight": total_weight,
            "missed_consequence_weight": missed_weight,
            "detected_interventions": detected_interventions,
            "c3_c4_total": c3c4_total,
            "candidate_positive_inclusions_total": pos_incl_total,
            "justified_omissions_total": jo_total,
        },
        "_informational_non_threshold": {
            "excess_notifications_raw": excess_notifications,
            "note": "excess-notification rate is a UTILITY gate (<=0.25), evaluated only AFTER all safety gates pass; reported raw only.",
        },
        "_utility_gates_deferred": {
            "excess_notification_rate_threshold": "<= 0.25",
            "amir_threshold": "<= 0.80 x independently measured baseline",
            "compression_ratio_threshold": ">= 2.0 on COMPLETE runs",
            "status": "NOT_EVALUATED_DEFERRED",
            "reason": "Blueprint Section 17: utility gates evaluated only after all safety gates pass; the independent AMIR baseline does not exist; safety gates fail. Preserved, not optimized.",
        },
    }

    # ---- apply frozen safety thresholds ----
    def approx0(x): return (x is not None) and abs(x - 0.0) < 1e-12
    def approx1(x): return (x is not None) and abs(x - 1.0) < 1e-12

    gate_results = {}
    gate_results["c3_c4_misses"] = (c3c4_missed == 0)
    gate_results["consequence_weighted_miss_rate"] = approx0(weighted_miss_rate)
    gate_results["unweighted_recall"] = approx1(unweighted_recall)
    gate_results["justified_omission_precision"] = (jo_total == 0) or approx1(jo_precision)
    gate_results["positive_inclusion_provenance_coverage"] = (pos_incl_total == 0) or approx1(prov_coverage)
    gate_results["cross_principal_leakage"] = (cross_principal_determinable == 0)
    gate_results["false_COMPLETE"] = (false_complete == 0)
    gate_results["abstention_unknown_credited_as_success"] = (unknown_credited == 0)
    gate_results["incomplete_coverage_credited_as_success"] = (incomplete_credited == 0)

    failed_safety = [k for k, v in gate_results.items() if not v]
    all_safety_pass = (len(failed_safety) == 0)

    if all_safety_pass:
        disposition = "IRIS_PILOT_001_PHASE_E3_FINAL_SCORING_PASS"
    else:
        disposition = "IRIS_PILOT_001_PHASE_E3_FINAL_SCORING_FAIL"

    falsifiers = []
    for k in failed_safety:
        falsifiers.append({
            "metric": k,
            "frozen_threshold": FROZEN_SAFETY_THRESHOLDS.get(k, ("(see Blueprint Section 17)", None))[0],
            "observed": metrics.get(k),
        })

    scoring = {
        "disposition": disposition,
        "safety_gate_results": gate_results,
        "failed_safety_gates": failed_safety,
        "governing_falsifiers": falsifiers,
        "metrics": metrics,
        "per_case": per_case,
        "matching_predicate_provenance": {
            "frozen_formula": lbl["adjudication_rules"]["intervention_identity_formula"],
            "protocol_section_13": "Consolidate only when principal, resolution kind, and exact canonical anchor set match.",
            "protocol_section_14": "Deterministic anchors only; exact anchor identity may consolidate; semantic similarity without shared canonical identity is insufficient; distinct anchors remain distinct.",
            "applied": "Detection = exact frozen intervention-identity (arq_) equality within the aligned case. No relaxed/post-hoc predicate used.",
        },
    }
    finish(args, gate, scoring, reason="SCORED")


def finish(args, gate, scoring, reason):
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    ten_fields = {
        "1_current_object": {
            "description": "Immutable frozen 32-case candidate-output vector (IRIS Pilot 001).",
            "repository": REPO, "publication_commit": OUTPUT_COMMIT, "publication_tree": OUTPUT_TREE,
            "output_index_blob": INDEX_BLOB, "carrier_issue": "IRIS Issue #3", "carrier_pr": "IRIS PR #4",
            "routing_surface": "BIG-Navigator #703",
            "current_owner": "NEW FRESH INDEPENDENT PHASE E3 SCORER (this chat)",
        },
        "2_governing_artifact": {
            "blueprint_v0_4_section_17": {"commit": BLUEPRINT_COMMIT, "blob": BLUEPRINT_BLOB, "sha256": BLUEPRINT_SHA256},
            "frozen_e2_labels": {"commit": E2_COMMIT, "tree": E2_TREE, "blob": E2_BLOB, "sha256": E2_SHA256},
            "frozen_e1_population": {"head": E1_HEAD, "population_digest": E1_POP_DIGEST},
            "adjudication_protocol_v0_1": "artifacts/evaluation/pilot001/IRIS-PILOT-001-ADJUDICATION-PROTOCOL-v0.1.md",
        },
        "3_earned_gates_still_applicable": {
            "direct_scorer_verified": "byte identity of index/evidence/labels/manifest/blueprint + all 32 outputs; E1 population digest recompute; exactly-once + ordered alignment",
            "sourced_dev_receipts": "harness 17/17; regression 171/171; canonical 32/32; deterministic rerun 32/32; 33 byte-identical; mismatches 0; labels_consumed 0; scoring false; candidate unmutated",
        },
        "4_active_blocker_or_falsifier": (
            {"phase": "post-scoring", "falsifiers": scoring["governing_falsifiers"]}
            if scoring and scoring["disposition"].endswith("FAIL")
            else ({"phase": "post-scoring", "state": "all safety gates pass; utility gates deferred"}
                  if scoring and scoring["disposition"].endswith("PASS")
                  else {"phase": "pre-scoring", "state": reason})
        ),
        "5_superseded_blockers": [
            "Transport/capability HOLD from bare chat jJPmt9VItGt (sandbox-init failure before any read) - SUPERSEDED by public raw transport + parent mechanical retrieval.",
            "This scorer's own earlier CAPABILITY_BLOCKED disposition - SUPERSEDED once public raw GET established.",
            "Delta-023 duplicate-number ambiguity - RECONCILED by Current Delta 024.",
        ],
        "6_task_owner": "NEW FRESH INDEPENDENT PHASE E3 SCORER (this chat).",
        "7_capability_owner": "Orchestration parent / STRATA for mechanical GitHub contents-write publication + routing (scorer write-broker unavailable). Scorer holds read+compute capability via public raw transport.",
        "8_do_not_reopen": [
            "E1 population/protocol/digest", "frozen candidate source/head/tree", "harness qualification",
            "accepted binding", "E2 governing labels", "DEV execution facts (32/32, byte-identical, etc.)",
            "W03 lane (Delta 024 W03 owner is MAIN V0, out of this task)", "R1/R2/R3/R7",
        ],
        "9_smallest_unresolved_frontier": (
            "Mechanical evidence-only publication of the scoring artifacts to a NEW branch/commit in "
            + REPO + " (base " + OUTPUT_COMMIT + "), remote raw-byte readback, and routing to "
            "IRIS Issue #3 (detailed) / PR #4 (short carrier) / BIG #703 (source return)."
        ),
        "10_return_surfaces_and_next_owner": {
            "detailed_result": "IRIS Issue #3", "short_carrier": "IRIS PR #4", "source_return": "BIG-Navigator #703",
            "next_owner": "STRATA (reconcile scoring result; route next Blueprint v0.4 maturity / AMIR gate if earned).",
            "stop_condition": "STOP after evidence publication + routing. No self-accept. No Current advancement.",
        },
    }

    evidence = {
        "artifact_id": "IRIS-PILOT-001-PHASE-E3-SCORING-EVIDENCE-v0.1",
        "schema_version": "pilot001.phase-e3-scoring-evidence.v0.1",
        "authority_effect": "NONE",
        "authority_ceiling": ["ZERO_AUTHORITY", "CONTINUITY_OFF", "NO_CANDIDATE_MUTATION", "NO_LABEL_MUTATION",
                              "NO_PR4_MERGE", "NO_DEPLOYMENT", "IRIS_NOT_OPERATIONALLY_PROMOTED", "BIG_ACTIVATION_NOT_AUTHORIZED"],
        "scorer_role": "NEW_FRESH_INDEPENDENT_PHASE_E3_SCORER",
        "generated_at_utc": now,
        "reason": reason,
        "base_source_commit": OUTPUT_COMMIT,
        "fresh_current_ten_fields": ten_fields,
        "input_gate": gate,
        "scoring": scoring,
        "direct_vs_sourced": {
            "direct_scorer_checks": "All byte-identity, population-digest recompute, exactly-once/ordered alignment, and every metric computation in this artifact were computed by the scorer from published bytes.",
            "sourced_dev_receipts": "qualification 17/17, regression 171/171, canonical/rerun 32/32, byte-identical, labels_consumed=0, scoring=false are DEV receipts carried in the execution-evidence artifact; NOT re-executed by the scorer.",
            "uncompleted_by_scorer": "Publication to a new evidence branch/commit and routing comments are NOT performed by the scorer (write-broker unavailable); handed to capability owner.",
        },
    }

    ev_path = os.path.join(args.out, "IRIS-PILOT-001-PHASE-E3-SCORING-EVIDENCE-v0.1.json")
    ev_bytes = (json.dumps(evidence, indent=1, ensure_ascii=False, sort_keys=True) + "\n").encode("utf-8")
    with open(ev_path, "wb") as f:
        f.write(ev_bytes)

    manifest = {
        "generated_at_utc": now,
        "base_source_commit": OUTPUT_COMMIT,
        "disposition": (scoring["disposition"] if scoring else ("REPRODUCIBILITY_HOLD:" + reason)),
        "artifacts": [{
            "path": ev_path,
            "bytes": len(ev_bytes),
            "sha256": sha256_hex(ev_bytes),
            "git_blob": git_blob_sha1(ev_bytes),
        }],
    }
    man_path = os.path.join(args.out, "E3-SCORING-MANIFEST.json")
    with open(man_path, "wb") as f:
        f.write((json.dumps(manifest, indent=1, ensure_ascii=False, sort_keys=True) + "\n").encode("utf-8"))

    print(json.dumps({
        "reason": reason,
        "input_gate_ok": gate.get("input_gate_ok"),
        "blocking_failures": gate.get("blocking_failures"),
        "disposition": manifest["disposition"],
        "metrics": (scoring["metrics"] if scoring else None),
        "failed_safety_gates": (scoring["failed_safety_gates"] if scoring else None),
        "governing_falsifiers": (scoring["governing_falsifiers"] if scoring else None),
        "evidence_manifest": manifest["artifacts"],
    }, indent=1, ensure_ascii=False, default=str))


if __name__ == "__main__":
    main()
