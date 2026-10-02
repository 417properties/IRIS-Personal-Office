# IRIS Pilot 001 — Replacement-E1 Execution Builder Packet v0.2

Object: IRIS_PILOT_001_REPLACEMENT_E1_EXECUTION_BUILDER_PACKET
Authority: HARNESS IMPLEMENTATION ONLY AFTER STRATA RELEASE
Current disposition: FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED

## 1 Pins and prerequisites
Binding: artifacts/iba/iris-transition/IRIS-PILOT-001-REPLACEMENT-E1-TO-FROZEN-CANDIDATE-EXECUTION-BINDING-v0.2.md on IBA frozen ref.
Candidate executable parent MUST be exact HEAD 185dbd1be80bd54c6cf5dcc085f105a637fe7e44 / tree af4808dc6c6db17ed7dc5cdd923fe5b9697c006a.
Replacement E1 MUST be exact 849deca383add66773ab1ba0c8bc0ca852523c8f / fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4 / 40 / population 32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f / protocol 619b28d8cc6fdd8048bdaeff2807a10f438349f1a7249f3701b209a7e786d66b.
Do not begin until fresh independent exact-binding acceptance and STRATA execution release exist.

## 2 Branch and immutable candidate rule
Execution branch MUST be created directly from exact candidate HEAD 185dbd1....
Existing candidate source and tests MUST remain byte-identical to candidate HEAD.
Before work and before publication hash/compare all pre-existing tracked paths. Any modification to existing candidate source/tests => HOLD.
PR #4 remains DRAFT/OPEN/UNMERGED.

## 3 Permitted paths
Add only external evaluation paths under:
- evaluation/replacement-e1-v0.4/harness/**
- evaluation/replacement-e1-v0.4/tests/**
- evidence/pilot001/replacement-e1-v0.4/execution/**
- evidence/pilot001/replacement-e1-v0.4/outputs/**
No edit to src/**, db/**, existing tests/**, migrations, candidate config, or E1 immutable evidence refs.
Harness imports frozen candidate buildProjection from existing source; it does not copy candidate logic.

## 4 Required harness
Implement exact binding v0.2 literally:
- whole-population validator;
- ReplacementE1V04ProjectionDecoder;
- exact path/ref deny guard;
- deterministic serializer/index/evidence writer.
Exactly one decoder call and exactly one buildProjection call per case.
No candidate output editing.

## 5 Mandatory harness falsification
Tests must independently cover at least:
F01 missing case; F02 extra; F03 duplicate; F04 reorder; F05 population digest mismatch.
F06 malformed snapshot reads; F07 first drift + stable rerun; F08 second drift; F09 ambiguous selected version.
F10 UNKNOWN envelope; F11 stale envelope; F12 incomplete enumeration; F13 broken provenance.
F14 lifecycle affects wrong ref; F15 obligation abandonment cannot cascade to decision; F16 incomplete decision history.
F17 invalid/expired authority lease; F18 generation mismatch; F19 privacy-scope mismatch; F20 provider session cannot grant delegation.
F21 foreign principal payload; F22 private foreign source packet; F23 qualified BIG invalid admission; F24 qualified BIG expired.
F25 source-link possible duplicate without authoritative merge; F26 non-unique conflict attachment; F27 multiple conflict IDs unencodable.
F28 unresolved effect exact mapping; F29 verified effect creates no unresolved root.
F30 impact consequence class/weight cannot enter ProjectionInput; F31 impact packet mutation that changes only consequence fields leaves ProjectionInput bytes identical; F32 any attempted consequence-derived mapping throws REFERENCE_SIDE_CONSEQUENCE_DEPENDENCY.
F33 unknown record type; F34 structurally non-unique mapping.
F35 label path CLI; F36 label path env/config; F37 replacement blind-E2 ref/path; F38 Round-3 E2 path; F39 E3/scoring path; F40 score-derived config.
F41 candidate buildProjection call count !=1; F42 decoder call count !=1; F43 candidate output post-edit attempt.
F44 locale/order perturbation; F45 wall-clock perturbation; F46 second clean run differs.
All forbidden-input controls fail before candidate execution.

## 6 Label leakage allowlist
Harness input allowlist contains only:
- exact replacement-E1 v0.4 pinned paths;
- exact binding artifact;
- exact candidate source imported from execution branch;
- Blueprint identity only if needed for evidence verification.
No directory glob broad enough to include E2/E3 artifacts.
Open/read instrumentation records every consumed file/ref. Evidence MUST prove no path/ref outside allowlist.
Required counters:
labels_consumed=0
e2_reference_files_opened=0
e3_scoring_files_opened=0
scoring_performed=false.

## 7 Qualification before evaluation
Run harness unit/falsification tests without executing the 40 candidate cases.
Run existing candidate tests from exact branch; results must match frozen candidate behavior. Existing candidate files byte-identical.
Then STOP for the STRATA execution release if the institutional sequence requires qualification separation. The final execution described below is authorized only by STRATA, not this packet alone.

## 8 Exact 40-case execution after release
Validate all pins/population first.
Clean run A:
- exactly 40 decoder calls;
- exactly 40 buildProjection calls;
- output one immutable file per case in exact order.
Clean run B:
- separate process and clean output temp root;
- same inputs/pins;
- exactly 40+40 calls independently.
Compare each per-case byte stream A vs B before publication. Any mismatch => HOLD/DETERMINISM_FAILURE.
No third run to choose preferred output.

## 9 Output files
Final output path:
evidence/pilot001/replacement-e1-v0.4/outputs/<case_id>.json
Each file is exact JSON.stringify(candidate_output)+"\n"; no semantic edit, pretty print, key sorting or annotation.

Output index:
evidence/pilot001/replacement-e1-v0.4/outputs/index.json
Fields in exact manifest order:
case_id,path,bytes,sha256.
Index also includes pinned population/candidate/binding identities and total_count=40, but no labels/scores.

Execution evidence:
evidence/pilot001/replacement-e1-v0.4/execution/execution-evidence.json
Must include branch/head/tree/parent, candidate pins, E1 pins, binding pins, harness/test identities, run-A/run-B call counts, byte comparison PASS, labels/scoring counters, forbidden-input audit, existing-candidate byte identity proof, and no candidate modification.

## 10 Immutable publication
Commit harness/tests/evidence/40 outputs/index only on execution branch.
Fetch remote commit/tree and every new artifact after publication.
Return exact:
- branch/ref;
- HEAD/tree/sole parent chain;
- changed file list;
- bytes/SHA256/Git blob for harness, tests, evidence, index and every 40 output;
- population/candidate/binding pins;
- test totals;
- run counts;
- deterministic comparison result;
- labels_consumed=0;
- scoring_performed=false.
Any remote mismatch=>HOLD.

## 11 Negative authority boundary
Executor MUST NOT:
- modify candidate source/tests;
- inspect E2 answers;
- score outputs;
- calculate E3 metrics;
- merge PR#4;
- deploy IRIS;
- access provider/Production;
- change continuity;
- admit IRIS;
- create authority.
No output interpretation beyond integrity/determinism.

## 12 Required return and stop
After immutable publication return:
IRIS_PILOT_001_REPLACEMENT_E1_CANDIDATE_NEUTRAL_EXECUTION_OUTPUT_VECTOR_FROZEN / STRATA_RECONCILIATION_REQUIRED
Then STOP. Do not self-score or wake E3.

Institutional sequence remains:
IBA binding frozen -> fresh independent exact-binding acceptance -> STRATA execution release -> harness/execution owner -> immutable output vector -> STRATA -> fresh E3.

Preserve IRIS_NOT_OPERATIONALLY_PROMOTED / CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_CONTINUITY_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED.
