# IRIS Pilot 001 — Replacement-E1 to Frozen-Candidate Execution Binding v0.6

Disposition: `BINDING_CORRECTION_READY / UNRESOLVED_INTENT_APPLICABILITY_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
Authority: NONE

## 0. Bounded correction

Authorized by STRATA #703/5964813612 after independent v0.5 HOLD:
`BINDING_HOLD/UNRESOLVED_INTENT_APPLICABILITY_REDUCTION_UNFROZEN`.

v0.3 self-identity, v0.4 UNAVAILABLE and v0.5 typed-identifier corrections remain normative unchanged. All unrelated binding semantics remain unchanged.

Candidate:
`185dbd1be80bd54c6cf5dcc085f105a637fe7e44 / af4808dc6c6db17ed7dc5cdd923fe5b9697c006a`.

Replacement E1:
`849deca383add66773ab1ba0c8bc0ca852523c8f / fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4 / 40 / 32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f`.

No E2/E3 labels, candidate outputs or scores consumed.

## 1. Complete 40-case intent/effect audit

Across all four pinned replacement-E1 shards:
- intent records = 2;
- effect_record records linked to those intents = 2;
- exact applicability_assertion records whose subject_refs include either intent ID = 0.

Demonstrated classes:

### A. unresolved consequential intent
Case:
`p1e1r4_6f43027d04774acda0ac9dd58bc2f4af`

Intent:
- id `intent:d250c2cf94104b61abafbfffcbb842fe`
- status `SUBMITTED_UNVERIFIED`
- consequential=true
- principal=AARON
- objective_ref and obligation_ref present.

Effect:
- state `SUBMITTED_UNVERIFIED`
- consequential=true
- receipt_present=true
- verification_present=false
- retry_permission=false.

Exact intent-scoped applicability assertions: 0.

The case has an APPLICABLE applicability_assertion for the linked obligation and decision only. Its subject_refs do NOT include the intent/effect.

### B. verified effect
Case:
`p1e1r4_deb7781d201d4be2b56dd9351cf7fe2b`

Intent/effect state VERIFIED; verification_present=true.
Exact intent-scoped applicability assertions: 0.
This class creates no unresolved-intent candidate root under existing v0.2 semantics, so no candidate applicability value is required for an unresolved root.

No other unresolved-intent root shape exists in the frozen 40-case population.

## 2. Governing source semantics

Pinned protocol requires:
- lifecycle events affect only exact IDs in affected_record_refs;
- separately linked records require their own explicit applicability/history evidence;
- existence of an obligation link establishes no cascade semantics;
- no automatic applicability/abandonment/reaffirmation cascade across refs;
- where source facts intentionally leave item relevance unknown, represent item-level unknown; unknown is not a successful omission;
- unresolved consequential effect is an explicit resolution type, but that does not manufacture applicability.

Blueprint/candidate interface:
- PilotCandidate.applicability supports `UNKNOWN`;
- classifier returns `unknown=true, omittable=false` when applicability=UNKNOWN;
- AR-4 from unresolved_effect is evaluated only after unknown-material-dimension check.

Therefore absence of exact intent-scoped applicability evidence is a represented unknown, not permission to borrow obligation applicability.

## 3. Frozen unresolved-intent applicability rule

For every unresolved-intent root created by the existing v0.2 intent/effect rule:

1. resolve intent/effect state using exact typed refs under v0.5 boundary;
2. collect applicability assertions/lifecycle facts whose exact scoped subject/affected refs include the intent ID (or exact effect ID only where frozen source semantics explicitly make effect applicability control the intent);
3. if exact current scoped evidence uniquely establishes APPLICABLE, set candidate.applicability=APPLICABLE;
4. if exact current scoped evidence uniquely establishes SATISFIED/SUPERSEDED/ABANDONED, set that exact candidate applicability value where representable;
5. if exact current scoped evidence explicitly establishes conflicting applicability, use existing conflict/UNKNOWN rules as applicable;
6. if NO exact intent/effect-scoped applicability evidence exists, set:
`candidate.applicability = "UNKNOWN"`.

Do NOT:
- inherit obligation applicability;
- inherit decision applicability;
- infer applicability from objective;
- infer applicability from consequential=true;
- infer applicability from unresolved effect status;
- infer applicability from impact/consequence packets;
- omit the field;
- default APPLICABLE.

For the cited unresolved case the exact frozen value is:
`applicability="UNKNOWN"`.

## 4. Provenance of UNKNOWN

The UNKNOWN is source-grounded, not invented.

Binding trace must record:
- intent typed ID;
- linked effect typed ID;
- exact search scope for intent/effect applicability evidence;
- exact result: zero scoped applicability assertions/lifecycle applicability facts;
- linked obligation/decision applicability assertions found but rejected as cross-ref/noncontrolling;
- rule `NO_EXACT_INTENT_APPLICABILITY_EVIDENCE -> UNKNOWN`.

Candidate provenance_refs remain the exact intent/effect source evidence already required by v0.2. No synthetic E2/protocol provenance URI is inserted into candidate provenance.

## 5. Classifier-boundary behavior

For the cited unresolved root:
- unresolved_effect=true;
- applicability=UNKNOWN;
- source_identity/freshness/provenance remain derived under existing rules.

Frozen candidate classifier therefore:
- returns unknown=true;
- does not classify AR-4 from unresolved_effect while applicability remains UNKNOWN;
- does not mark the item omittable;
- preserves it in Aaron relevance unknown under existing projection semantics.

This behavior is candidate-owned. Decoder does not reproduce classifier logic; tests may assert interface consequences against the frozen candidate.

## 6. Cross-ref leakage prohibition

A linked record's applicability may control an intent only if frozen source semantics contain an explicit exact-scoped relation that says so.

The following are insufficient:
- intent.obligation_ref;
- intent.objective_ref;
- same evidence source;
- same principal;
- same impact packet family;
- same case;
- obligation/decision applicability assertion that omits the intent ID.

Thus the cited obligation APPLICABLE assertion cannot upgrade the unresolved intent.

Likewise SATISFIED obligation/decision evidence in the VERIFIED-effect case cannot be treated as intent applicability evidence.

## 7. Future demonstrated shapes

For this frozen population only the two classes in §1 are admitted.

If execution encounters an unresolved intent whose exact scoped applicability evidence shape is not covered by §3, fail:
`BINDING_HOLD/UNMAPPED_INTENT_APPLICABILITY_SHAPE`
rather than choose a score-changing value.

## 8. One-layer-deeper falsification closure

Frozen choices:
- applicability absent -> UNKNOWN;
- obligation/decision/objective cascade -> prohibited;
- consequential/unresolved status -> cannot imply applicability;
- field omission -> prohibited;
- APPLICABLE default -> prohibited;
- consequence packet -> prohibited;
- exact intent-scoped evidence -> only controlling evidence;
- verified effect -> no unresolved root under existing rule.

No runtime discretion remains.

## 9. Independence

Inputs:
- frozen replacement-E1 intent/effect/applicability records;
- pinned protocol;
- Blueprint v0.4;
- frozen candidate interface/classifier;
- independent falsifier;
- prior binding.

Not consumed:
E2 labels/answers/reference interventions/consequence classes; candidate output vectors; E3 scores/results; score-derived config.

`labels_consumed=0 / candidate_outputs_consumed=0 / scoring=false`.

## 10. Acceptance

Fresh independent exact-binding reviewer must verify:
1. exact 2-intent/2-effect/0-intent-scoped-assertion audit;
2. cited unresolved shape;
3. linked obligation applicability does not scope to intent;
4. absence of exact intent applicability -> UNKNOWN;
5. no applicability field omission/default APPLICABLE;
6. frozen candidate boundary behavior is deterministic;
7. verified-effect class creates no unresolved root;
8. v0.3-v0.5 corrections unchanged;
9. no label/output/score leakage.

Required PASS:
`IRIS_PILOT_001_REPLACEMENT_E1_EXECUTION_BINDING_INDEPENDENT_ACCEPTANCE_PASS`
or one exact HOLD.

No execution release.

Preserve all earned gates / `IRIS_NOT_OPERATIONALLY_PROMOTED / CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_CONTINUITY_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED`.

Final:
`BINDING_CORRECTION_READY / UNRESOLVED_INTENT_APPLICABILITY_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
