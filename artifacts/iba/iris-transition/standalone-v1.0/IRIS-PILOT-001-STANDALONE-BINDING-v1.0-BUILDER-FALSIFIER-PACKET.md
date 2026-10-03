# IRIS Pilot 001 — Standalone Binding v1.0 Builder / Falsifier Packet

Authority: NONE
Governing release: BIG-Navigator #703/5964996176.
Target: standalone binding v1.0 plus exact dependency manifest, mapping-totality matrix, and static preflight in this directory.

This packet is for bounded mechanical implementation/pre-acceptance falsification only. It authorizes no candidate mutation, candidate execution, E2/E3 access, scoring, merge, deployment, provider access, IRIS admission, continuity change, or authority change.

## Required inputs
Read only:
1. standalone v1.0 binding;
2. v1.0 dependency manifest;
3. v1.0 mapping-totality matrix;
4. v1.0 static preflight;
5. exact semantic dependencies content-addressed in the manifest.

Historical v0.2-v0.6 documents are provenance only and MUST NOT be used to reconstruct missing semantics.

## Mechanical falsifier set

F001 exact 40-case count/order/digest.
F002 exactly eight required envelopes in every case.
F003 availability domain exhaustively PRESENT/UNKNOWN/UNAVAILABLE.
F004 PRESENT mapping deterministic.
F005 UNKNOWN mapping deterministic.
F006 UNAVAILABLE mapping deterministic and cannot become empty/UNKNOWN/INAPPLICABLE.
F007 every demonstrated record_type has exactly one totality row.
F008 every load-bearing demonstrated scalar/token used by a rule resolves deterministically or names a HOLD.
F009 source joins use typed refs before candidate-boundary conversion.
F010 objective candidate payload is raw exact objective namespace payload.
F011 obligation candidate payload is raw exact obligation namespace payload.
F012 decision candidate payload is raw exact decision_requirement namespace payload.
F013 intent candidate payload is raw exact intent namespace payload.
F014 conflict payload remains untyped conf_<sha>.
F015 no candidate-owned payload contains colon.
F016 no global prefix stripping/case-fold/trim/Unicode normalization.
F017 no doubled candidate output namespace can arise from decoder mapping.
F018 lifecycle_event scopes only exact affected_record_refs.
F019 applicability_assertion scopes only exact subject_refs.
F020 action_decision scopes only exact resolves/supersedes refs.
F021 obligation lifecycle cannot cascade to decision.
F022 decision lifecycle cannot cascade to obligation.
F023 intent applicability cannot inherit obligation/decision/objective applicability.
F024 unresolved intent with no exact scoped applicability -> UNKNOWN.
F025 consequential/unresolved flags cannot imply APPLICABLE.
F026 verified intent/effect creates no unresolved-intent root.
F027 current source-history non-uniqueness -> named HOLD.
F028 required_next_step never creates independent root.
F029 informational_receipt never creates independent root.
F030 device observation/provider session cannot grant authority/canonical admission.
F031 authority lease requires exact domain/generation/principal/scope/policy/worker/episode match.
F032 invalid/expired/replaced lease -> false; ambiguous load-bearing state -> UNKNOWN/fail closed.
F033 qualified BIG requires exact qualified packet contract and time/provenance.
F034 foreign/private packet payload cannot enter Aaron candidate plane.
F035 impact consequence fields cannot set any ProjectionInput semantic.
F036 self-ref + identity_proven=true -> no duplicate conflict.
F037 self-ref + identity not proven -> no duplicate conflict.
F038 distinct refs + authoritative merge -> exact canonical anchor only.
F039 distinct refs + identity_proven + no canonical anchor -> named HOLD.
F040 distinct refs + possible_same + no merge -> unresolved duplicate conflict.
F041 distinct refs neither proven nor possible -> no duplicate effect.
F042 one candidate needing >1 conflict_id -> named HOLD.
F043 conflict IDs deterministic from exact anchors/class.
F044 source arrays/candidate arrays deterministic order.
F045 generated refs exact-deduped UTF-8 lexical only.
F046 timestamps derive only from selected snapshot read.
F047 no wall clock/randomness.
F048 decoder does not reproduce classifier/coverage/intervention/projection semantics.
F049 buildProjection not invoked during static totality preflight.
F050 no candidate outputs consumed during binding/preflight.
F051 no E2/E3/reference answers or scoring inputs consumed.
F052 dependency manifest contains repository/path/commit/blob/SHA256 for every semantic dependency.
F053 no semantic dependency on historical v0.2-v0.6.
F054 reviewer needs no search/directory/commit-tree traversal to reconstruct normative meaning.
F055 review contract requests complete material falsifier set, not first-falsifier-only.
F056 any demonstrated shape outside matrix -> BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE.
F057 any future non-demonstrated shape -> same named HOLD.
F058 preflight failures array exactly empty before review.
F059 population remains frozen; no E1 regeneration.
F060 candidate remains frozen; no source/tests mutation.
F061 every case-level top-level field has an explicit v1.0 disposition; no unlisted top-level field/default.
F062 snapshot_time is consistency-only and cannot override the selected snapshot read.
F063 all envelope record_refs/source_refs and record source_refs resolve inside the exact case.
F064 every obligation has exactly one governance join and every intent exactly one effect join in the demonstrated population.
F065 all source applicability/lifecycle tokens that can reach PilotCandidate fit the frozen candidate domain or named HOLD.

## Success
All F001-F065 PASS and static preflight reports:
`40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES`.

Then return only to STRATA:
`STANDALONE_BINDING_READY / DEPENDENCY_MANIFEST_COMPLETE / 40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES / FRESH_INDEPENDENT_ACCEPTANCE_REQUIRED`.

Independent reviewer must review the whole standalone object and report the COMPLETE SET of material falsifiers in one pass unless clean-room contamination forces retirement.
