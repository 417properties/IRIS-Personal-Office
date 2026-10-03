# IRIS Pilot 001 — Replacement-E1 v0.4 to Frozen-Candidate Execution Binding v0.3

Object: `IRIS_PILOT_001_REPLACEMENT_E1_TO_FROZEN_CANDIDATE_EXECUTION_BINDING`
Authority effect: NONE
Disposition: `BINDING_CORRECTION_READY / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`

## 0. Scope

This is the immutable bounded correction to v0.2 authorized by STRATA #703/5964263197 and directly routed by Professor #703/5964339824.

Substantive independent falsifier:
`BINDING_HOLD/PROVEN_SELF_IDENTITY_MISCLASSIFIED_AS_UNRESOLVED_DUPLICATE`

Independent review evidence:
- ref `refs/heads/evidence/iris-binding-v02-independent-review-content-only-v3`
- commit `7fa6457e6349f4f12d0c75b1eb1fa634c4ba6a7c`
- tree `10f8eb1d32a03f0cdf99219b6d00b30204e6e33b`
- blob `2db2f52d74be4f69a805c1982f673d0e9a3f439c`
- SHA-256 `5fd9a9fa898e72fc47d744a3e0ac84a178b434f99104e75373b39ff1d8ffa2db`.

v0.2 remains historical:
- binding commit `849dcdee8ae1ff351b2c11da426ab1009bbe8ff4`
- blob `40b05a3b98ee4a25345310c0dcf89521c43a40c5`
- SHA-256 `cfc8a73114b46b34c7de1150a50a33aa5aef806b1e721b0718699b67a00cfc71`
- packet commit `3e95553bd4531e25f50e0e84858025b6df47a62c`
- blob `8cc34a5e199de92d34baf1b78853ffe269fd96db`.

All v0.2 §§0–10 and §§13–19 remain normative unchanged. Only §§11–12 duplicate/self-identity semantics are superseded below.

Frozen candidate remains:
`185dbd1be80bd54c6cf5dcc085f105a637fe7e44 / af4808dc6c6db17ed7dc5cdd923fe5b9697c006a`.

Replacement E1 remains:
`849deca383add66773ab1ba0c8bc0ca852523c8f / fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4 / 40 / 32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f`.

No E2/E3 label/answer/output/scoring input was consumed in this correction.

## 11. Conflict mapping — corrected duplicate precedence

All non-duplicate conflict rules from v0.2 remain unchanged.

For every `source_link_observation`, apply the following exact precedence BEFORE any possible-duplicate conflict rule:

### 11.1 Proven self-identity

If:
- `left_ref === right_ref`; AND
- `identity_proven === true`;

then the observation is `PROVEN_SELF_IDENTITY`.

Required result:
- no `POSSIBLE_DUPLICATE_UNRESOLVED`;
- no duplicate `conflict_id`;
- no `possible_duplicate_refs` edge;
- no conflict-only root;
- no consolidation/merge action is needed because both refs already identify the same exact record;
- `possible_same_underlying_request` is non-operative for duplicate conflict generation;
- absence of `authoritative_merge_ref` is non-operative for duplicate conflict generation.

This rule applies regardless of whether `possible_same_underlying_request` is true or false.

This exact rule closes case:
`p1e1r4_dd291386b74e4b568634d20c138457ea`
observation:
`source_link_observation:90e53de973cd4d2fa34b054a412c0bb0`
without using any E2 label or expected answer.

### 11.2 Same-ref but identity not proven

If `left_ref === right_ref` and `identity_proven !== true`:
- do not manufacture a duplicate conflict merely from self-reference;
- do not manufacture an authoritative merge;
- treat the observation as non-actionable identity evidence;
- if another exact source fact independently creates a conflict, that other rule governs.

Rationale: one exact ref cannot be a pair of distinct candidate objects solely because an observation repeats it.

### 11.3 Distinct refs with authoritative merge

If `left_ref !== right_ref` and a nonempty `authoritative_merge_ref` is present:
- require the merge ref to resolve exactly and provenance to be admissible;
- use that exact canonical anchor under the existing v0.2 duplicate rule;
- do not create POSSIBLE_DUPLICATE_UNRESOLVED solely from `possible_same_underlying_request=true`.

Malformed/non-resolving authoritative merge => binding HOLD.

### 11.4 Distinct refs, identity_proven=true, no authoritative merge

If:
- `left_ref !== right_ref`;
- `identity_proven === true`;
- no authoritative merge ref;

then the decoder MUST NOT invent which record ID survives.

Result:
`BINDING_HOLD/PROVEN_DISTINCT_REF_IDENTITY_WITHOUT_CANONICAL_ANCHOR`.

This adjacent rule prevents the v0.3 correction from turning proven identity between distinct refs into a discretionary implicit merge.

### 11.5 Distinct refs, unresolved possible duplicate

Only when:
- `left_ref !== right_ref`;
- `identity_proven !== true`;
- `possible_same_underlying_request === true`;
- no authoritative merge ref;

may the existing v0.2 `POSSIBLE_DUPLICATE_UNRESOLVED` rule apply.

Then:
- never consolidate;
- add exact other-ref values to `possible_duplicate_refs`;
- generate the deterministic duplicate conflict under the unchanged v0.2 conflict-ID formula;
- attach only to exactly referenced existing roots, otherwise one conflict-only root;
- preserve the existing multiple-conflict fail-closed rule.

### 11.6 Neither proven nor possible

If distinct refs have:
- no authoritative merge;
- `identity_proven !== true`;
- `possible_same_underlying_request !== true`;

then the source-link observation creates no duplicate mapping or conflict.

## 12. Duplicate identity — corrected decision table

The decoder MUST evaluate source-link identity in this order:

1. same ref + identity_proven=true -> PROVEN_SELF_IDENTITY / no duplicate effect;
2. same ref + identity not proven -> no duplicate effect;
3. distinct refs + valid authoritative_merge_ref -> exact canonical anchor;
4. distinct refs + identity_proven=true + no canonical anchor -> named HOLD;
5. distinct refs + possible_same=true + no authoritative merge -> unresolved duplicate;
6. otherwise -> no duplicate effect.

No semantic similarity.
No score-derived choice.
No consequence-packet choice.
No E2/E3 input.
No candidate-output inspection.

The v0.2 one-layer-deeper falsification register is updated only for duplicate identity:
- self-identity cannot create an unsupported duplicate conflict;
- distinct proven identity cannot silently choose a canonical record;
- unresolved distinct possible identity remains visible;
- every branch is deterministic or HOLD.

## 13. Independence and delta certification

Delta from v0.2 is exactly:
- replace duplicate/self-identity portions of §§11–12 with §§11–12 above;
- no other mapping rule changes.

This correction was selected from exact replacement-E1 source structure plus independent review falsifier, not from candidate performance.

Prohibited and not consumed:
- replacement-E1 E2 governing labels;
- Round-3 E2 answers;
- candidate output vectors;
- E3 results/scores;
- score-derived configuration.

Required runtime counters remain:
`labels_consumed=0`
`scoring_performed=false`.

## 14. Acceptance

Fresh independent exact-binding reviewer must specifically falsify the six-way decision table above in addition to unchanged v0.2 contract.

Required accepted disposition remains:
`IRIS_PILOT_001_REPLACEMENT_E1_EXECUTION_BINDING_INDEPENDENT_ACCEPTANCE_PASS`

or one exact material HOLD.

No DEV/40-case execution is authorized by this document.

Preserve:
`REPLACEMENT_E1_FROZEN / POST_REPLACEMENT_E1_CANDIDATE_REFREEZE_CLOSED / REPLACEMENT_E1_BLIND_E2_CLOSED / ROUND3_E2_HOLD_VALID_AS_HISTORICAL_EVIDENCE / IRIS_NOT_OPERATIONALLY_PROMOTED / CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_CONTINUITY_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED`.

Final disposition:
`BINDING_CORRECTION_READY / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
