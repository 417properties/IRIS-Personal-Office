# IRIS Pilot 001 — v1.1 Mechanical Totality Verifier Specification

Authority: NONE.

This is a deterministic verifier specification for the v1.1 standalone binding. It does not invoke the frozen candidate and does not inspect candidate outputs.

## Inputs

Use only:
- the exact v1.1 standalone binding;
- exact v1.1 dependency manifest;
- exact v1.1 mapping-totality matrix;
- exact frozen dependencies named by the manifest.

No historical binding/review, E2/E3, candidate output, score, test fixture, or runtime config is permitted.

## Mechanical algorithm

1. Re-read every dependency by exact repository/path/commit.
2. Verify its exact Git blob, UTF-8 byte count, and SHA-256 against the dependency manifest.
3. Load the four exact replacement-E1 shards in manifest order.
4. Recompute the 40-case canonical population digest and exact ordered IDs.
5. Validate the exact 11-field case grammar, exact eight source requirements, and exact eight source envelopes.
6. Verify every record ID is unique inside its case and every source/envelope ref resolves exactly inside that case.
7. Resolve snapshot bracket mechanically:
   - stable first pair -> STABLE / first read;
   - first drift + stable second pair -> RERUN_STABLE / third read;
   - second drift -> UNSTABLE / third read;
   - malformed shape -> HOLD.
8. Verify the sole UNSTABLE case has only the exact nonsemantic updated_at version events with prior_semantic_values_retained=true. Any semantic non-uniqueness -> UNSTABLE_RECORD_SELECTION_AMBIGUOUS.
9. Build exactly eight SourceEvaluation objects per case in the frozen order and property order.
10. Require envelope census PRESENT=318 / UNKNOWN=1 / UNAVAILABLE=1.
11. Parse candidate-owned anchor payloads only after full typed-ref joins; require counts objective=40 / obligation=42 / decision_requirement=40 / intent=2.
12. Build obligation roots in UTF-8 typed-ID order using the six frozen lifecycle/applicability classes.
13. Build decision roots in UTF-8 typed-ID order using the seven frozen decision classes.
14. Build the single unresolved-intent root only for the exact unresolved consequential intent/effect; missing exact intent applicability -> UNKNOWN.
15. Apply the exact reserved-authority rules to the 10 permission cases:
    - candidate reserved roots=20;
    - holder AARON=18 / UNKNOWN=2;
    - valid_delegation false=18 / omitted=2 / true=0.
16. Generate only the three demonstrated conflicts using the exact class, anchor closure, and IDs published in the binding/matrix.
17. Apply proven self-identity as no-conflict.
18. Create the one conflict-only root only for the objective-scoped current-state conflict.
19. Set escalation_required=true only on the exact incompatible-instructions obligation root whose exact governance names AARON escalation target.
20. Populate privacyExcluded with exactly source_packet:b8ac8fd78e794c25b476e145f4e6006b in its exact case and nothing in the other 39.
21. Construct PilotCandidate properties in the exact v1.1 insertion order; never supply why; omit nonapplicable optional properties.
22. Construct ProjectionInput properties exactly:
    candidates, sources, conflicts, privacyExcluded, bracket, started_at, emitted_at.
23. For each case compute SHA-256(JSON.stringify(ProjectionInput)).
24. Build an ordered vector of:
    case_id, projection_input_sha256, bytes
    in exact manifest order.
25. Compute SHA-256(JSON.stringify(vector)).

## Required exact results

- total candidate roots = 84
- candidate applicability = APPLICABLE 75 / UNKNOWN 3 / SATISFIED 4 / SUPERSEDED 2
- classifier-material-unknown roots = 6
- material_conflict=true roots = 4
- escalation_required=true roots = 1
- unresolved_effect=true roots = 1
- informational_only=true roots = 1
- conflict_id present roots = 4
- nonempty possible_duplicate_refs roots = 2
- prebuild ProjectionInput vector SHA-256:
  78b721944b15128f916dd528d4f3d8f827ffdb4f675f13c7ed68a1b7bed324e5

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
