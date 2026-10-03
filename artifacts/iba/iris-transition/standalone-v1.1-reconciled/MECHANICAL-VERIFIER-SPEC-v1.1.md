# IRIS Pilot 001 — v1.1 Reconciled Mechanical Totality Verifier Specification

Authority: NONE.

This is the deterministic verifier specification for the reconciled v1.1 standalone binding. It does not invoke the frozen candidate and does not inspect candidate outputs.

## Inputs

Use only:
- the exact reconciled v1.1 standalone binding;
- exact reconciled v1.1 dependency manifest;
- exact reconciled v1.1 mapping-totality matrix;
- exact v1.1 pre-build input index;
- exact frozen dependencies named by the manifest.

No historical binding/review, preliminary v1.1 branch, E2/E3, candidate output, score, test fixture, or runtime semantic config is permitted.

## Mechanical algorithm

1. Re-read every dependency by exact repository/path/commit and verify exact Git blob, UTF-8 byte count, and SHA-256.
2. Load the four exact replacement-E1 shards in manifest order; recompute exact 40-case population digest and ordered IDs.
3. Validate exact 11-field case grammar, eight source requirements, eight source envelopes, unique record IDs, and exact ref resolution.
4. Resolve snapshot bracket mechanically:
   - stable first pair -> STABLE / first read;
   - first drift + stable second pair -> RERUN_STABLE / third read;
   - second drift -> UNSTABLE / third read;
   - malformed shape -> HOLD.
5. Verify the sole UNSTABLE case has only updated_at version drift with prior_semantic_values_retained=true; any semantic non-uniqueness -> UNSTABLE_RECORD_SELECTION_AMBIGUOUS.
6. Build exactly eight SourceEvaluation objects per case in frozen order/property order. Require PRESENT=318 / UNKNOWN=1 / UNAVAILABLE=1.
7. Parse candidate-owned anchor payloads only after full typed-ref joins; require objective=40 / obligation=42 / decision_requirement=40 / intent=2.
8. Build obligation roots in UTF-8 typed-ID order using the six frozen lifecycle/applicability classes.
9. Build decision roots in UTF-8 typed-ID order using the seven frozen decision classes.
10. Build the single unresolved-intent root only for the exact unresolved consequential intent/effect; missing exact intent applicability -> UNKNOWN.
11. Apply exact reserved-authority rules to the 10 permission cases:
    - candidate reserved roots=20;
    - holder AARON=18 / UNKNOWN=2;
    - valid_delegation false=18 / omitted=2 / true=0;
    - on the UNKNOWN-authority case, set applicability/freshness/source_identity UNKNOWN on the exact reserved obligation and decision roots.
12. Generate only the three demonstrated conflicts using exact class, anchor closure, and IDs from the binding/matrix.
13. Apply proven self-identity as no-conflict.
14. Create the one conflict-only root only for the objective-scoped current-state conflict.
15. Set escalation_required=true only on the incompatible-instructions obligation root whose exact governance names AARON escalation target.
16. Populate privacyExcluded with exactly source_packet:b8ac8fd78e794c25b476e145f4e6006b in its case and nothing in the other 39.
17. Construct PilotCandidate properties in exact v1.1 insertion order; conflict_id must be present on every conflict-bearing root; never supply why; omit nonapplicable optional properties.
18. Construct ProjectionInput properties exactly:
    candidates, sources, conflicts, privacyExcluded, bracket, started_at, emitted_at.
19. For each case compute SHA-256(JSON.stringify(ProjectionInput)).
20. Compare case_id / projection_input_sha256 / bytes against the exact pre-build input index.
21. Compute SHA-256(JSON.stringify(ordered vector)).

## Required exact results

- total candidate roots = 84
- candidate applicability = APPLICABLE 73 / UNKNOWN 5 / SATISFIED 4 / SUPERSEDED 2
- classifier-material-unknown roots = 6
- material_conflict=true roots = 4
- escalation_required=true roots = 1
- unresolved_effect=true roots = 1
- informational_only=true roots = 1
- conflict_id present roots = 4
- nonempty possible_duplicate_refs roots = 2
- reserved-authority roots = 20
- authority-holder fields = AARON 18 / UNKNOWN 2
- valid_delegation = false 18 / omitted 2 / true 0
- pre-build ProjectionInput vector SHA-256:
  b5875e63a681bbbff5b31b02323897d7548cf84caabb25beb94565c89df752e7

Any mismatch is:
BINDING_HOLD/PREBUILD_INPUT_VECTOR_MISMATCH

Successful result:
40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES / PREBUILD_INPUT_VECTOR_FROZEN

Counters:
candidate_invoked=false
buildProjection_invoked=false
labels_consumed=0
candidate_outputs_consumed=0
scoring=false
