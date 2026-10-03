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
F066 any candidate-owned source namespace outside objective/obligation/decision_requirement/intent/conflict fails UNMAPPED_CANDIDATE_ANCHOR_NAMESPACE.
F067 any unresolved-intent applicability evidence shape outside the frozen decision table fails UNMAPPED_INTENT_APPLICABILITY_SHAPE.
F068 semantic input allowlist is exact; unexpected config/CLI/env/test/history/review/E2/E3/output/score input fails before candidate import.
F069 PRESENT required-surface applicability is frozen at surface level: APPLICABLE absent complete exact whole-surface inapplicability evidence; item applicability cannot leak into SourceEvaluation.
F070 all 320 SourceEvaluation tuples reduce to the exact published tuple census; zero extra tuple classes.
F071 `input.conflicts` contains only exact deterministic conflict IDs, exact-deduped UTF-8 byte-lexically sorted.
F072 every demonstrated load-bearing scalar/token value belongs to the published token domain; any other value is UNMAPPED_REPLACEMENT_E1_STRUCTURE.
F073 mutually exclusive exact instructions on one obligation map to INCOMPATIBLE_OBLIGATIONS.
F074 incompatible exact current_assertion values for one exact subject/predicate map to INCOMPATIBLE_CURRENT_STATE.
F075 demonstrated unresolved distinct possible duplicate maps to POSSIBLE_DUPLICATE_UNRESOLVED; proven self-identity maps to no conflict.
F076 no AUTHORITY_CONFLICT/EFFECT_REALITY_CONFLICT/SOURCE_IDENTITY_CONFLICT generator may appear in these frozen 40 cases; appearance is UNMAPPED_REPLACEMENT_E1_STRUCTURE.
F077 conflict class and exact anchor set may never be selected by semantic similarity, consequence evidence, or Builder discretion.
F078 every PilotCandidate is constructed in the exact 24-position insertion order frozen by v1.0.
F079 decoder never supplies candidate.why.
F080 escalation_required is exact-root deterministic: exactly one true candidate (p1e1r4_359... obligation root with attached incompatible-instruction conflict + same-root Aaron escalation governance); all other 83 false; no reverse-link/same-objective propagation.
F081 unresolved_effect/material_conflict/informational_only are explicit booleans under exact root rules.
F082 applicability/freshness/source_identity/provenance_refs/possible_duplicate_refs are always supplied under exact health-reduction rules.
F083 provenance_refs contain only exact typed source refs actually used; no protocol/review/binding URI injection.
F084 possible_duplicate_refs is always an array; only unresolved distinct duplicate evidence populates exact typed other refs.
F085 optional nonapplicable candidate fields are omitted, never null-filled; any extra decoder-owned property is a HOLD.
F086 all 42 obligations match one of the six published lifecycle/applicability reductions.
F087 exact ABANDONED obligation lifecycle yields obligation_status=ABANDONED while independent scoped applicability remains APPLICABLE; status blocks AR-2, no resurrection and no linked-decision cascade.
F088 all 40 decisions match one of the seven published decision reductions.
F089 obligation lifecycle never cascades to linked decision; decision changes only from exact decision-scoped evidence.
F090 PENDING action_decision neither resolves nor supersedes; agreeing duplicate applicability assertions do not create conflict or multiply semantics.
F091 all 10 permission steps have exact matching reserved class across step/governance/decision.
F092 delegation validator compares authority generation only to authority current_generation; worker identity generation is a separate domain.
F093 exact delegation outcomes are true=0 / false=9 / omitted-UNKNOWN=1 with the published failure reasons.
F094 UNKNOWN authority surface cannot supply positive authority holder/delegation; holder becomes UNKNOWN, valid_delegation omitted, health degraded UNKNOWN.
F095 provider session/credential or predecessor worker evidence never upgrades delegation.
F096 the sole UNSTABLE case has only nonsemantic updated_at version drift with prior_semantic_values_retained=true; selected third-read semantics are unique and bracket remains UNSTABLE.
F097 semantic ambiguity under UNSTABLE still triggers UNSTABLE_RECORD_SELECTION_AMBIGUOUS; version-number drift alone does not.
F098 pre-build root counts are exactly 42 obligation + 40 decision + 1 unresolved intent + 1 conflict-only = 84 candidates.
F099 demonstrated conflict attachment counts are exact: 1 instruction-conflict obligation root, 1 current-state conflict-only root, 2 duplicate-conflict obligation roots.
F100 conflict-only candidate fields and property order match §9.3; current-state conflict-only health is APPLICABLE/CURRENT/VERIFIED.
F101 reserved-authority candidate roots =20 and multiple-conflict-id candidate count=0.
F102 current-state conflict anchor closure includes both incompatible assertion records, exact objective, and linked obligation; exact ID is conf_4e885b98fa34f80966df5c9584f3b10db0117d61f791fedc38e28ecf7ffa6613; conf_5936... is forbidden stale identity.
F103 authority UNKNOWN preserves independently source-known item applicability/freshness/source_identity; uncertainty is represented by authority_holder_identity_id=UNKNOWN + omitted valid_delegation.
F104 stale/superseded rule blocks must not coexist with canonical v1.0 rule blocks in binding/matrix/preflight.

## Success
All F001-F104 PASS and static preflight reports:
`40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES`.

Then return only to STRATA:
`STANDALONE_BINDING_READY / DEPENDENCY_MANIFEST_COMPLETE / 40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES / FRESH_INDEPENDENT_ACCEPTANCE_REQUIRED`.

Independent reviewer must review the whole standalone object and report the COMPLETE SET of material falsifiers in one pass unless clean-room contamination forces retirement.
