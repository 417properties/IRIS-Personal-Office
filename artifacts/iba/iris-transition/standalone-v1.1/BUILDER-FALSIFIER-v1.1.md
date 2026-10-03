# IRIS Pilot 001 — Standalone Binding v1.1 Builder / Whole-Object Falsifier Contract

Authority: NONE. No candidate execution until fresh independent acceptance + STRATA release.
Governing release: BIG #703/5964996176.
Target: exact v1.1 package only. v1.0 and v0.2-v0.6 are provenance-only.

The mechanical verifier must pass before independent review. It may inspect only the v1.1 package plus dependency-manifest objects. It must not invoke buildProjection, inspect candidate outputs, consume E2/E3, or score.

F001 exact 40 case count/order/population digest.
F002 exact one top-level grammar / 11 fields.
F003 exact eight source requirements and envelopes per case.
F004 all envelope and record source refs resolve.
F005 record-type census exact 25 types.
F006 availability census 318 PRESENT / 1 UNKNOWN / 1 UNAVAILABLE.
F007 bracket census 37 STABLE / 2 RERUN_STABLE / 1 UNSTABLE.
F008 sole UNSTABLE drift is nonsemantic updated_at with prior_semantic_values_retained=true.
F009 SourceEvaluation property order exact; required=true; partial always boolean.
F010 PRESENT surface reduction exact.
F011 UNKNOWN surface reduction exact.
F012 UNAVAILABLE reduction exact; not UNKNOWN/empty/INAPPLICABLE.
F013 typed source joins occur before candidate payload conversion.
F014 typed anchors 40 objective / 42 obligation / 40 decision / 2 intent.
F015 no global prefix stripping, normalization, or double namespace.
F016 exact-ref lifecycle/applicability only; no cross-ref cascade.
F017 all 42 obligations hit exactly one frozen lifecycle/applicability row.
F018 ABANDONED obligation remains status ABANDONED with independent applicability APPLICABLE.
F019 all 40 decisions hit exactly one frozen decision row.
F020 PENDING action_decision is nonresolving.
F021 decision lifecycle never inherits obligation lifecycle.
F022 unresolved intent count=1; verified intent creates no root.
F023 missing exact unresolved-intent applicability -> UNKNOWN.
F024 no consequence/impact field may change ProjectionInput.
F025 root count exactly 84.
F026 exact PilotCandidate property insertion order.
F027 decoder never supplies why.
F028 nonapplicable optional fields omitted; common booleans explicit.
F029 applicability census 75 APPLICABLE / 3 UNKNOWN / 4 SATISFIED / 2 SUPERSEDED.
F030 classifier-material-unknown root count exactly 6.
F031 OPEN decision-maker UNKNOWN root count exactly 1.
F032 reserved-authority roots exactly 20.
F033 authority holders exactly 18 AARON / 2 UNKNOWN.
F034 valid_delegation exactly 18 false / 2 omitted / 0 true.
F035 provider session/credential cannot grant delegation.
F036 material_conflict=true exactly 4 roots.
F037 escalation_required=true exactly one exact instruction-conflict obligation root.
F038 reverse-link escalation to objective conflict-only root forbidden.
F039 unresolved_effect=true exactly 1.
F040 informational_only=true exactly 1.
F041 exact three conflict IDs/anchor closures/classes.
F042 instruction conflict attaches only exact obligation root.
F043 current-state conflict creates one conflict-only root.
F044 possible duplicate attaches two exact obligation roots and exact typed other refs.
F045 proven self-identity creates no conflict.
F046 no undemonstrated conflict class generator allowed in frozen population.
F047 input.conflicts exact IDs only, sorted/deduped.
F048 privacyExcluded exact one typed source_packet in exact case; payload never copied.
F049 qualified BIG uses only admitted packet surface; no live BIG/provider read.
F050 candidate source_identity/freshness/provenance derive only exact primary root evidence.
F051 authority UNKNOWN represented by holder UNKNOWN + delegation omission, not unrelated evidence erasure.
F052 dependency repository/path/commit/blob/bytes/SHA256 all reverify.
F053 historical binding/review normative dependency count=0.
F054 prohibited-input allowlist fails before candidate import.
F055 candidate_invoked=false / buildProjection_invoked=false / labels=0 / outputs=0 / scoring=false.
F056 every case ProjectionInput is deterministic under v1.1.
F057 ordered prebuild vector digest exactly 78b721944b15128f916dd528d4f3d8f827ffdb4f675f13c7ed68a1b7bed324e5.
F058 any vector mismatch -> BINDING_HOLD/PREBUILD_INPUT_VECTOR_MISMATCH.
F059 candidate/E1/source/tests byte-identical to frozen pins.
F060 v1.1 lineage rooted directly at exact v0.6 HEAD; no v1.0 ancestry.
F061 whole-object independent review returns complete material falsifier set, not first-falsifier-only.
F062 no candidate execution/scoring/admission/continuity/authority change.

Success:
STANDALONE_BINDING_READY / DEPENDENCY_MANIFEST_COMPLETE / 40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES / PREBUILD_INPUT_VECTOR_FROZEN / FRESH_INDEPENDENT_ACCEPTANCE_REQUIRED

Then STOP for STRATA reconciliation.
