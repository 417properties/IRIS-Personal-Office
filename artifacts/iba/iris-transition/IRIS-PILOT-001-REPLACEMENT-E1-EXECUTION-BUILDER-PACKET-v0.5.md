# IRIS Pilot 001 — Replacement-E1 Execution Builder Packet v0.5

Disposition: `BINDING_CORRECTION_READY / TYPED_IDENTIFIER_BOUNDARY_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
Authority: NO EXECUTION UNTIL INDEPENDENT PASS + STRATA RELEASE

## 1. Governing delta

Consume binding v0.5.
All v0.4 Builder requirements remain unchanged except candidate-owned identifier representation is superseded by the v0.5 boundary rule.

Candidate remains exact:
`185dbd1be80bd54c6cf5dcc085f105a637fe7e44 / af4808dc6c6db17ed7dc5cdd923fe5b9697c006a`.

Replacement E1 remains exact:
`849deca383add66773ab1ba0c8bc0ca852523c8f / fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4`.

## 2. Required helper

Implement external harness helper:
`candidateAnchorPayload(expectedNamespace, typedRef)`.

Require exact `namespace:payload`, expected namespace exact, nonempty payload, no nested colon. Return payload unchanged.

No global stripping, trim, case-fold, normalization, UUID coercion or semantic rewrite.

## 3. Exact candidate-boundary conversion

Convert only:
- objective:<p> -> candidate.objective_id=<p>
- obligation:<p> -> candidate.obligation_id=<p>
- decision_requirement:<p> -> candidate.decision_requirement_id=<p>
- intent:<p> -> candidate.intent_id=<p>.

Synthetic candidate IDs use raw payload suffixes.

Binding-generated conflict_id remains untyped conf_<sha>.

All source-space joins/provenance/privacy/source-link/impact/authority refs remain typed.

## 4. Mandatory audit/falsification additions

Preserve all v0.4 controls including F25a-h and F47-F60.

Add:

F61 all 40 objective record IDs parse exact objective namespace.
F62 all 42 obligation record IDs parse exact obligation namespace.
F63 all 40 decision_requirement record IDs parse exact decision_requirement namespace.
F64 both intent record IDs parse exact intent namespace.
F65 cited case decision_requirement:5304c81075b94529b3da9f2e81083444 enters candidate field as 5304c81075b94529b3da9f2e81083444.
F66 candidate anchor from F65 is exactly decision_requirement:5304c81075b94529b3da9f2e81083444, never double-prefixed.
F67 obligation candidate ID suffix is raw payload and candidate ACT/AUTHORIZE anchor has exactly one obligation prefix.
F68 objective fallback anchor exactly one objective prefix.
F69 intent reconciliation anchor exactly one intent prefix.
F70 conflict payload remains conf_<sha> and candidate anchor exactly one conflict prefix.
F71 wrong namespace supplied to candidate field => CANDIDATE_ANCHOR_NAMESPACE_MISMATCH.
F72 missing namespace => CANDIDATE_ANCHOR_NAMESPACE_MISSING.
F73 empty/nested payload => CANDIDATE_ANCHOR_PAYLOAD_MALFORMED.
F74 source join occurs on full typed refs before conversion.
F75 objective:abc cannot match obligation:abc.
F76 provenance_refs remain typed unchanged.
F77 privacyExcluded source IDs remain typed unchanged.
F78 source_link left/right/merge refs remain typed for v0.3 identity logic.
F79 possible_duplicate_refs that denote source records remain typed.
F80 no PilotCandidate anchor payload field contains colon before buildProjection.
F81 scan produced intervention anchor_refs: none contain duplicated namespace prefix.
F82 v0.3 self-identity controls unchanged.
F83 v0.4 UNAVAILABLE controls unchanged.
F84 typed-ID mapping cannot consult impact consequence/E2/E3/candidate-output data.

These are representation/integrity controls, not scoring.

## 5. Complete pre-execution trace

Before first candidate invocation, harness writes/holds in memory deterministic binding trace for every candidate-owned conversion:
- case_id
- source typed ref
- expected namespace
- candidate field
- raw payload.

Validate full trace before execution. Any unexpected namespace aborts all 40 execution.

Do not publish candidate outputs from a partially validated population.

## 6. Candidate immutability

Execution branch still roots directly at exact candidate HEAD. Existing candidate source/tests byte-identical. No candidate code fix is permitted for double-prefix behavior; representation is external decoder responsibility.

## 7. Hard deny/counters

Unchanged:
`labels_consumed=0`
`candidate_outputs_consumed=0` during binding qualification
`scoring_performed=false`.

E2/E3/scoring paths denied before candidate execution.

## 8. Independent review first

No harness implementation or 40-case execution until fresh independent exact-binding PASS and STRATA execution release.

Reviewer must reproduce F61-F84 source-level/candidate-interface reasoning without E2 labels or candidate outputs.

## 9. Later execution unchanged

After release:
exact 40/40 -> one decoder + one buildProjection/case -> clean A/B -> byte-identical outputs/index -> immutable publication/readback -> labels=0 -> scoring=false -> STOP before E3.

No candidate edit, merge, deploy, provider access, continuity admission or authority change.

Final:
`BINDING_CORRECTION_READY / TYPED_IDENTIFIER_BOUNDARY_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
