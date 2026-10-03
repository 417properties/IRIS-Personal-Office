# IRIS Pilot 001 — Replacement-E1 Execution Builder Packet v0.6

Disposition: `BINDING_CORRECTION_READY / UNRESOLVED_INTENT_APPLICABILITY_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
Authority: NO EXECUTION UNTIL INDEPENDENT PASS + STRATA RELEASE

## 1. Governing delta
Consume binding v0.6. Preserve every v0.5 Builder requirement. Candidate and replacement-E1 pins unchanged.

## 2. Intent applicability implementation
For every unresolved-intent root:
- resolve exact intent/effect typed refs;
- inspect only exact intent/effect-scoped applicability/lifecycle evidence;
- if uniquely explicit, map exact supported applicability;
- if no exact scoped applicability evidence, set PilotCandidate.applicability=`UNKNOWN`;
- never inherit obligation/decision/objective applicability;
- never infer from consequential/unresolved status or impact packet;
- never omit applicability.

Cited case `p1e1r4_6f43027d04774acda0ac9dd58bc2f4af` MUST produce unresolved root applicability UNKNOWN.

## 3. Population audit
Before execution assert frozen population:
- intent count=2;
- linked effect count=2;
- exact intent-scoped applicability assertion count=0;
- one unresolved SUBMITTED_UNVERIFIED consequential intent/effect;
- one VERIFIED intent/effect that creates no unresolved root.

Unexpected unresolved-intent applicability shape => `BINDING_HOLD/UNMAPPED_INTENT_APPLICABILITY_SHAPE`.

## 4. Added falsification controls
Preserve F01-F84.

Add:
F85 cited unresolved intent has no exact scoped applicability assertion.
F86 linked obligation APPLICABLE assertion cannot set intent APPLICABLE.
F87 linked decision APPLICABLE assertion cannot set intent APPLICABLE.
F88 same objective cannot propagate applicability.
F89 same evidence source cannot propagate applicability.
F90 consequential=true cannot imply APPLICABLE.
F91 unresolved_effect=true cannot imply APPLICABLE.
F92 missing exact applicability yields candidate applicability UNKNOWN.
F93 applicability field omission is forbidden.
F94 frozen classifier with unresolved_effect=true + applicability UNKNOWN returns unknown=true/omittable=false.
F95 decoder does not copy/reimplement classifier to obtain F94.
F96 exact intent-scoped APPLICABLE fixture maps APPLICABLE.
F97 exact intent-scoped SATISFIED/SUPERSEDED/ABANDONED fixture maps exact representable value.
F98 conflicting/non-unique exact scoped applicability fails closed/UNKNOWN under existing conflict rule; no convenient selection.
F99 VERIFIED intent/effect creates no unresolved root.
F100 verified case's linked SATISFIED obligation/decision assertion is not treated as intent applicability evidence.
F101 impact packet/consequence mutation cannot change intent applicability.
F102 v0.3 self-identity controls unchanged.
F103 v0.4 UNAVAILABLE controls unchanged.
F104 v0.5 typed-ID controls unchanged.

No E2/E3/output data in fixtures.

## 5. Binding trace
For each intent root record:
- intent ID;
- effect ID;
- exact scoped applicability/lifecycle refs inspected;
- rejected cross-ref applicability refs;
- resulting candidate applicability;
- rule identifier.

Trace is evidence only, not candidate input.

## 6. Candidate immutability
No candidate modification. Existing source/tests byte-identical. Applicability UNKNOWN is already supported by frozen PilotCandidate/classifier.

## 7. Hard deny
`labels_consumed=0 / candidate_outputs_consumed=0 / scoring_performed=false`.
E2/E3/scoring paths denied.

## 8. Independent review first
No harness implementation/40-case execution until fresh independent v0.6 binding PASS + STRATA execution release.

## 9. Later execution unchanged
After release: exact 40/40, one decoder + one buildProjection/case, clean A/B, byte-identical immutable outputs/index, remote readback, labels=0, scoring=false, STOP before E3.

No merge/deploy/provider/continuity/IRIS admission/authority change.

Final:
`BINDING_CORRECTION_READY / UNRESOLVED_INTENT_APPLICABILITY_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
