# IRIS Pilot 001 — Replacement-E1 Execution Builder Packet v0.3

Object: `IRIS_PILOT_001_REPLACEMENT_E1_EXECUTION_BUILDER_PACKET`
Authority: HARNESS IMPLEMENTATION ONLY AFTER INDEPENDENT BINDING PASS + STRATA RELEASE
Disposition: `BINDING_CORRECTION_READY / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`

## 1. Governing binding

Consume:
`artifacts/iba/iris-transition/IRIS-PILOT-001-REPLACEMENT-E1-TO-FROZEN-CANDIDATE-EXECUTION-BINDING-v0.3.md`

v0.2 packet remains historical. All v0.2 Builder requirements remain unchanged except duplicate/source-link falsification is superseded by Section 4 below.

Execution parent remains exact candidate:
`185dbd1be80bd54c6cf5dcc085f105a637fe7e44 / af4808dc6c6db17ed7dc5cdd923fe5b9697c006a`.

Replacement E1 remains exact:
`849deca383add66773ab1ba0c8bc0ca852523c8f / fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4 / 40 / 32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f`.

Do not implement or execute until fresh independent exact-binding acceptance and STRATA execution release.

## 2. Candidate immutability and paths

Execution branch must root directly at exact candidate HEAD.

Existing candidate source/tests remain byte-identical.

Permitted additions remain only:
- `evaluation/replacement-e1-v0.4/harness/**`
- `evaluation/replacement-e1-v0.4/tests/**`
- `evidence/pilot001/replacement-e1-v0.4/execution/**`
- `evidence/pilot001/replacement-e1-v0.4/outputs/**`.

No edit to `src/**`, existing tests, candidate config, E1 evidence, or PR #4 candidate.

## 3. All v0.2 controls preserved

Preserve v0.2:
- whole-population validation;
- one decoder + one buildProjection per case;
- exact eight-envelope mapping;
- lifecycle/history/applicability/authority/privacy/bracket rules;
- consequence-packet deny boundary;
- label/scoring hard deny;
- F01-F24 and F26-F46 controls;
- two clean deterministic executions;
- immutable output/index/evidence publication;
- labels_consumed=0;
- scoring_performed=false.

## 4. Corrected source-link/duplicate falsification

Replace old F25 with the following exact controls.

### F25a — proven self-identity, possible=true, no merge
Input:
- left_ref == right_ref;
- identity_proven=true;
- possible_same_underlying_request=true;
- authoritative_merge_ref absent.

Require:
- no POSSIBLE_DUPLICATE_UNRESOLVED;
- no duplicate conflict;
- no possible_duplicate_refs;
- no conflict-only root;
- no merge/consolidation operation.

Use the exact source shape represented by case `p1e1r4_dd291386b74e4b568634d20c138457ea`, without consulting E2 labels.

### F25b — proven self-identity, possible=false
Same-ref + identity_proven=true + possible=false also produces no duplicate effect.

### F25c — same-ref identity not proven
Same-ref + identity_proven=false/absent must not create a duplicate conflict solely from possible_same=true.

### F25d — distinct refs + valid authoritative merge
Must use exact canonical anchor and must not create unresolved duplicate solely from possible_same=true.

### F25e — distinct refs + identity_proven=true + no authoritative merge
Must fail exactly:
`BINDING_HOLD/PROVEN_DISTINCT_REF_IDENTITY_WITHOUT_CANONICAL_ANCHOR`.

No implicit survivor/canonical record choice.

### F25f — distinct refs + possible_same=true + identity not proven + no merge
Must preserve existing unresolved duplicate:
- no consolidation;
- possible_duplicate_refs exact;
- deterministic POSSIBLE_DUPLICATE_UNRESOLVED conflict.

### F25g — distinct refs + neither proven nor possible + no merge
No duplicate mapping/conflict.

### F25h — malformed/non-resolving authoritative merge
Fail closed before candidate execution.

These controls must prove precedence. In particular, the harness MUST evaluate same-ref/proven identity before the possible_same/no-merge rule.

## 5. Label-leakage boundary

F25a-h are source-structure tests only.

No test fixture may import:
- governing E2 labels;
- reference intervention;
- consequence class/weight;
- E3 score/metric;
- candidate output.

Impact packet changes must not determine duplicate result.

Forbidden-input tests remain fail-before-candidate-execution.

## 6. Independent acceptance before implementation

The corrected binding/packet must first receive fresh independent exact-binding acceptance.

The reviewer receives no candidate outputs/tests, E2 answers, E3 results or score data.

Only after STRATA consumes independent PASS and issues execution release may the authorized harness/execution owner implement this packet.

## 7. Later execution return — unchanged

After authorized 40-case execution:
- exact 40/40;
- clean run A/B;
- byte-identical outputs/index;
- immutable per-case outputs;
- immutable index/evidence;
- remote readback;
- exact bytes/SHA256/blobs;
- labels_consumed=0;
- scoring_performed=false;
- STOP before E3.

Required later execution disposition remains:
`IRIS_PILOT_001_REPLACEMENT_E1_CANDIDATE_NEUTRAL_EXECUTION_OUTPUT_VECTOR_FROZEN / STRATA_RECONCILIATION_REQUIRED`.

## 8. Authority

This packet authorizes no current execution.

No candidate edit, E2 inspection, E3 scoring, merge, deploy, provider access, continuity admission or authority expansion.

Next owner after IBA publication:
**STRATA consumes corrected object, then Professor 1.2 orchestrates a NEW fresh independent exact-binding reviewer only after STRATA clean-review release.**

Final current disposition:
`BINDING_CORRECTION_READY / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
