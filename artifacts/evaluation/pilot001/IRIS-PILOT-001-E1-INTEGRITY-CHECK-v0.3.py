#!/usr/bin/env python3
"""
Reproducible, non-adjudicating integrity checker for the IRIS Pilot 001
post-fail E1 holdout freeze, round 3 (v0.3).

Run from the directory containing the 4 artifact files:
  python3 IRIS-PILOT-001-E1-INTEGRITY-CHECK-v0.3.py

This script:
  - recomputes byte length / SHA-256 / git blob id for each leaf file
  - confirms case count, case_id uniqueness, and case_id prefix disjointness
  - recursively scans every case object for prohibited answer-label fields
  - recomputes the population digest

It does NOT: adjudicate any case, compute any AR class / resolution_kind /
coverage_state, or execute any candidate code.
"""
import hashlib, json, subprocess, sys, os

FORBIDDEN_KEYS = {
    "ar_class", "ar_classes", "resolution_kind", "intervention_id",
    "coverage_state", "completeness_state", "conflict_class", "conflict_id",
    "disposition", "consequence_weight", "consequence_class", "consequence",
    "expected_action", "expected_disposition", "rationale",
    "aaron_relevance_unknown", "known_aaron_required", "justified_omissions",
    "possible_duplicate_refs", "why_aaron_is_required", "answer", "label",
    "ground_truth", "gold", "coverage_gaps", "unresolved_conflicts",
    "privacy_exclusions",
}

def canon(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=True)

def sha256_file(path):
    return hashlib.sha256(open(path, "rb").read()).hexdigest()

def git_blob_id(path):
    try:
        return subprocess.check_output(["git", "hash-object", path]).decode().strip()
    except Exception as e:
        return f"UNAVAILABLE({e})"

def scan_forbidden(obj, path=""):
    hits = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k.lower() in FORBIDDEN_KEYS:
                hits.append(f"{path}/{k}")
            hits += scan_forbidden(v, f"{path}/{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            hits += scan_forbidden(v, f"{path}[{i}]")
    return hits

def main():
    here = os.path.dirname(os.path.abspath(__file__))
    manifest_path = os.path.join(here, "IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.3.json")
    protocol_path = os.path.join(here, "IRIS-PILOT-001-ADJUDICATION-PROTOCOL-v0.3.md")
    popid_path = os.path.join(here, "IRIS-PILOT-001-CASE-POPULATION-IDENTITY-v0.3.json")
    cert_path = os.path.join(here, "IRIS-PILOT-001-PREBUILDER-INDEPENDENCE-CERTIFICATION-v0.3.json")

    ok = True
    for label, p in [("manifest", manifest_path), ("protocol", protocol_path),
                      ("population_identity", popid_path), ("certification", cert_path)]:
        if not os.path.exists(p):
            print(f"MISSING {label}: {p}")
            ok = False

    if not ok:
        sys.exit(1)

    print("=== byte length / SHA-256 / git blob id ===")
    for p in [manifest_path, protocol_path, popid_path, cert_path]:
        print(os.path.basename(p), os.path.getsize(p), sha256_file(p), git_blob_id(p))

    manifest = json.load(open(manifest_path))
    cases = manifest["cases"]
    print("\n=== case count ===")
    print(len(cases))
    ids = [c["case_id"] for c in cases]
    print("unique:", len(ids) == len(set(ids)))
    print("count == 30:", len(cases) == 30)
    print("prefix disjoint vs p1e1_ / p1e1r2_:",
          all(not cid.startswith("p1e1_") and not cid.startswith("p1e1r2_") for cid in ids)
          and all(cid.startswith("p1e1r3_") for cid in ids))

    print("\n=== prohibited-label scan ===")
    hits = []
    for c in cases:
        hits += scan_forbidden(c, c["case_id"])
    print("hits:", hits if hits else "NONE")

    print("\n=== population digest recomputation ===")
    ids_sorted = sorted(ids)
    manifest_sha256 = sha256_file(manifest_path)
    population_digest = hashlib.sha256(canon({
        "case_ids_sorted": ids_sorted,
        "manifest_sha256": manifest_sha256,
        "case_count": 30,
    }).encode("utf-8")).hexdigest()
    print("population_digest_sha256:", population_digest)

    print("\nNOTE: this run did not adjudicate any case and did not execute any candidate code.")

if __name__ == "__main__":
    main()
