# IRIS Pilot 001 — Standalone Replacement-E1 to Frozen-Candidate Execution Binding v1.1

Object: `IRIS_PILOT_001_STANDALONE_REPLACEMENT_E1_TO_FROZEN_CANDIDATE_EXECUTION_BINDING_V1_1`
Authority: NONE
Governing release: BIG-Navigator #703/5964996176
Disposition target: `STANDALONE_BINDING_READY / DEPENDENCY_MANIFEST_COMPLETE / 40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES / PREBUILD_INPUT_VECTOR_FROZEN / FRESH_INDEPENDENT_ACCEPTANCE_REQUIRED`

## 0. Standalone replacement and clean lineage

v1.1 is rooted directly at exact v0.6 documentary HEAD `9bd4355634935410c351c7814fb2b4b67bd06b36`. It is the sole normative execution-binding document for this package.

The prior v1.0 branch, the preliminary `iba/iris-pilot001-standalone-execution-binding-v1-1` branch, and BIG receipts #703/5965060281 and #703/5965107039 are superseded pre-review evidence only. Concurrent pre-review mutation exposed additional contradictions. This reconciled package is rooted directly at exact v0.6 and is the sole normative v1.1 object.

Historical v0.2-v0.6 files are provenance only. No historical binding document is a semantic dependency.

Frozen replacement E1:
- commit `849deca383add66773ab1ba0c8bc0ca852523c8f`
- tree `fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4`
- cases `40`
- population SHA-256 `32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f`.

Frozen candidate:
- HEAD `185dbd1be80bd54c6cf5dcc085f105a637fe7e44`
- tree `af4808dc6c6db17ed7dc5cdd923fe5b9697c006a`
- PR #4 remains DRAFT / OPEN / UNMERGED.

No candidate/source/test mutation, E1 regeneration, E2 relabel, candidate output, E3 score, provider access, continuity, admission, merge, or production authority is created here.

## 1. Independence and execution invariant

Permitted semantic dependencies are ONLY the exact objects in `IRIS-PILOT-001-STANDALONE-BINDING-v1.1-DEPENDENCY-MANIFEST.json`.

Hard deny before candidate import:
- E2 answer/reference artifacts;
- E3/scoring/metric artifacts;
- candidate outputs;
- score-derived config;
- prior review judgments;
- historical binding documents as normative input;
- any unexpected semantic CLI/env/config/test fixture.

Counters remain:
`labels_consumed=0 / candidate_outputs_consumed=0 / scoring=false`.

Per case, exact manifest order:
`one frozen case -> one external decoder -> one ProjectionInput -> exactly one frozen buildProjection call -> one unedited candidate output`.

Decoder terminates at ProjectionInput. It MUST NOT copy or reimplement classifier, coverage, intervention-ID, consolidation, omission, resolution, or projection logic.

## 2. Population, top-level grammar, and snapshot bracket

Load only the four pinned shards. Require exactly 40 unique case IDs in exact manifest order and exact recomputed population digest.

Every case has exactly these top-level fields:
`case_id, coverage_contract, domain, emission_time, impact_packets, principal_id, records, snapshot_reads, snapshot_time, source_envelopes, source_requirements`.

Dispositions:
- case_id: opaque identity; no semantic parsing.
- coverage_contract: exact `PILOT001_IRIS_PLUS_QUALIFIED_BIG_V0_1`, scope_version=1, exact eight required surfaces.
- domain: routing metadata only; NOT_MAPPED_BY_DESIGN to relevance/consequence/authority/coverage.
- emission_time: NOT_MAPPED_BY_DESIGN to candidate time.
- impact_packets: §10 hard deny except exact integrity/link validation.
- principal_id: exact AARON or HOLD.
- records: exact typed source inventory; duplicate IDs HOLD.
- snapshot_reads: sole bracket/version-selection control.
- snapshot_time: consistency metadata only; must equal first read_at and never override selected read.
- source_envelopes/source_requirements: exact eight-surface contracts.

Bracket:
- stable first pair -> selected first read / STABLE;
- first drift + stable second pair -> selected third read / RERUN_STABLE;
- second drift -> selected third read / UNSTABLE;
- malformed read count/shape -> HOLD.

Set `started_at=emitted_at=selected read_at`. Wall clock/file/Git/publication time is prohibited.

Frozen bracket census:
`STABLE=37 / RERUN_STABLE=2 / UNSTABLE=1`.

The sole UNSTABLE case is `p1e1r4_d374c5fb7c064f98bad29f633804d4c8`. Both drifts are obligation version-only `updated_at` changes with exact version_event chains and `prior_semantic_values_retained=true`; selected third-read semantics are unique. Bracket remains UNSTABLE. Any semantic non-uniqueness -> `BINDING_HOLD/UNSTABLE_RECORD_SELECTION_AMBIGUOUS`.

## 3. Exact eight SourceEvaluation mappings

Candidate source order:
1. `pilot001:objectives <- objectives`
2. `pilot001:obligations <- obligations`
3. `pilot001:obligation_governance <- obligation_governance`
4. `pilot001:decision_requirements <- decision_requirements`
5. `pilot001:authority_generation_and_leases <- authority_state`
6. `pilot001:unresolved_intents_and_effects <- intent_effect_state`
7. `pilot001:applicability_current_assertions <- current_assertions`
8. `pilot001:qualified_big_quarantine_evidence <- qualified_big_packets`.

Every SourceEvaluation property order is:
`source_id,required,present,principal_match,identity,applicability,freshness,provenance_ok,partial`.
`required=true`; `partial` is always boolean.

Only availability tokens PRESENT / UNKNOWN / UNAVAILABLE are admitted.

PRESENT:
- present=true;
- principal_match iff principal_identity=AARON;
- identity=VERIFIED iff principal_match and exact provenance resolves; otherwise UNKNOWN/CONFLICT as exact evidence requires;
- surface-level applicability=APPLICABLE because this is an exact required contract surface and no frozen PRESENT envelope proves whole-surface inapplicability;
- freshness=CURRENT iff observed_at <= selected read_at <= valid_through; expired=STALE; unevaluable=UNKNOWN;
- provenance_ok iff provenance_verified=true and every envelope source_ref resolves;
- partial iff enumeration_complete!=true or exact provenance/partial rule requires it.

UNKNOWN:
`present=false / identity=UNKNOWN / applicability=UNKNOWN / freshness=UNKNOWN / partial=true`, preserving exact principal/provenance booleans where independently known.

UNAVAILABLE:
`present=false`; exact principal/provenance/clock facts preserved; `applicability=APPLICABLE`; `partial=true`; never PRESENT-empty, UNKNOWN, INAPPLICABLE, privacy exclusion, or proven absence.

Frozen envelope census:
`PRESENT=318 / UNKNOWN=1 / UNAVAILABLE=1`.

Frozen SourceEvaluation tuple census:
- objectives 40 complete CURRENT VERIFIED APPLICABLE tuples;
- obligations 40 same;
- obligation_governance 40 same;
- decision_requirements 40 same;
- intent_effect_state 40 same;
- current_assertions 40 same;
- authority_state: 39 complete tuples + 1 UNKNOWN tuple;
- qualified_big_packets: 37 complete tuples + 1 PRESENT/STALE + 1 PRESENT principal_match=false identity=UNKNOWN + 1 UNAVAILABLE partial tuple.

Any additional tuple in these exact 40 cases -> `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

## 4. Exact-ref canonical semantics and privacy

All joins happen on full typed refs. Lifecycle affects ONLY exact affected_record_refs. Applicability applies ONLY exact subject_refs. action_decision resolves/supersedes ONLY exact named decision refs. version_event must form exact chains; `prior_semantic_values_retained=true` preserves semantic values.

No obligation/decision/objective/intent applicability or lifecycle cascades merely because records are linked.

Only exact AARON records enter Aaron candidates. No alias/case/trim/name inference.

Frozen privacy case:
`p1e1r4_c09b0e9d61544bbf825d1aa9215879e8` contains quarantined `source_packet:b8ac8fd78e794c25b476e145f4e6006b` with source_principal_id OTHER_PRINCIPAL. Its payload never enters candidates. `privacyExcluded` contains exactly that typed record ID in that case and is empty in the other 39.

## 5. Typed source identity -> candidate payload boundary

Source refs remain typed for joins/provenance/lifecycle/applicability/privacy/duplicate reasoning.

Only candidate-owned anchor fields receive raw validated payload:
- objective_id <- `objective:<payload>`
- obligation_id <- `obligation:<payload>`
- decision_requirement_id <- `decision_requirement:<payload>`
- intent_id <- `intent:<payload>`
- conflict_id <- binding-generated untyped `conf_<sha256>`.

Parser requires exactly one expected namespace, nonempty payload, no colon, no normalization.

Failures:
`CANDIDATE_ANCHOR_NAMESPACE_MISSING / _MISMATCH / _PAYLOAD_MALFORMED / UNMAPPED_CANDIDATE_ANCHOR_NAMESPACE`.

Frozen typed source counts:
`objective=40 / obligation=42 / decision_requirement=40 / intent=2`.

## 6. Candidate roots, fields, lifecycle, and object bytes

Per case candidate class order:
obligations -> decisions -> unresolved intents -> conflict-only; within class UTF-8 byte lexical typed source ID.

Frozen root census:
`42 obligation + 40 decision + 1 unresolved intent + 1 conflict-only = 84`.

### 6.1 Obligation

Candidate fields derive only from exact objective + obligation + unique governance + exact obligation-scoped applicability/lifecycle + optional reserved-authority/conflict evidence.

`obligation_status` preserves exact source status.
`obligation_owner` is exact governance owner or UNKNOWN.
`concrete_action_remaining = action_remaining===true && concrete_action nonempty && informational_only===false`.

Applicability/status classes:
- 35 OPEN/APPLICABLE with OPEN lifecycle;
- 2 OPEN/APPLICABLE with no exact lifecycle row;
- 1 OPEN/UNKNOWN;
- 1 ABANDONED status while independent exact governance/assertion applicability remains APPLICABLE;
- 2 SATISFIED/SATISFIED;
- 1 SUPERSEDED/SUPERSEDED.

Terminal status is not rewritten from applicability and does not cascade to a linked decision.

### 6.2 Decision

Decision root never receives obligation_id merely because obligation_ref exists.

`decision_status` preserves exact selected decision status/action-decision resolution.
`decision_maker_identity_id` exact or UNKNOWN.
`applicability` comes only from exact decision-scoped applicability assertions.

Frozen classes:
- 33 OPEN/APPLICABLE;
- 1 OPEN/UNKNOWN;
- 1 OPEN/APPLICABLE with duplicate agreeing APPLICABLE assertions;
- 1 RESOLVED/APPLICABLE;
- 2 RESOLVED/SATISFIED;
- 1 SUPERSEDED/SUPERSEDED;
- 1 OPEN/APPLICABLE with PENDING nonresolving action_decision.

Exactly one OPEN decision has decision_maker_identity_id=UNKNOWN:
case `p1e1r4_40cad8d6ee7440a5bd0fe22d674f9db7`.

### 6.3 Unresolved intent

Create only when exact intent/effect state is SUBMITTED_UNVERIFIED / AMBIGUOUS / RECONCILIATION_REQUIRED and consequential.

Frozen population: one unresolved root in case `p1e1r4_6f43027d04774acda0ac9dd58bc2f4af`; one VERIFIED intent/effect creates no root.

Intent applicability uses only exact intent/effect-scoped evidence. No exact scoped applicability evidence exists in the population, so the unresolved root is:
`unresolved_effect=true / applicability=UNKNOWN`.

Never inherit obligation/decision/objective applicability. Any other exact intent applicability shape in these frozen cases -> `BINDING_HOLD/UNMAPPED_INTENT_APPLICABILITY_SHAPE`.

### 6.4 Exact PilotCandidate construction

The candidate hashes `JSON.stringify({sources,candidates,conflicts,privacyExcluded})`; property presence/order is normative.

Ordered assignment:
1 id
2 principal_id
3 objective_id when applicable
4 obligation_id when applicable
5 decision_requirement_id when applicable
6 intent_id when applicable
7 conflict_id when applicable
8 obligation_status when applicable
9 obligation_owner when applicable
10 concrete_action_remaining when applicable
11 decision_status when applicable
12 decision_maker_identity_id when applicable
13 reserved_authority_class when applicable
14 authority_holder_identity_id when applicable
15 valid_delegation only when deterministically boolean
16 escalation_required ALWAYS
17 unresolved_effect ALWAYS
18 material_conflict ALWAYS
19 informational_only ALWAYS
20 applicability
21 freshness
22 source_identity
23 provenance_refs
24 possible_duplicate_refs ALWAYS array.

`why` is NEVER supplied by the decoder.
Nonapplicable optional properties are omitted, never null/undefined padded.

Common:
- principal_id=AARON.
- freshness: UNKNOWN > STALE > CURRENT over exact primary root evidence.
- source_identity: CONFLICT > UNKNOWN > VERIFIED over exact primary root evidence.
- provenance_refs: exact-deduped UTF-8 byte-lexical union of source_refs actually used plus exact primary envelope source_refs.
- possible_duplicate_refs=[] except exact unresolved distinct duplicate evidence.
- unresolved_effect true only unresolved-intent root.
- material_conflict true only exact attached/conflict-only roots.
- informational_only exact obligation boolean; false on other root classes.
- escalation_required true only when the exact candidate root has a material canonical conflict/authority/privacy condition AND exact governance on that root names AARON as escalation target. Impact-packet escalation_blocks are forbidden.

Frozen boolean/field census:
- unresolved_effect=true: 1;
- material_conflict=true: 4;
- escalation_required=true: 1;
- informational_only=true: 1;
- conflict_id present: 4;
- possible_duplicate_refs nonempty: 2;
- reserved_authority_class present: 20 roots;
- authority_holder_identity_id: 18 AARON / 2 UNKNOWN;
- valid_delegation: 18 false / 2 omitted / 0 true.

Frozen candidate applicability census:
`APPLICABLE=73 / UNKNOWN=5 / SATISFIED=4 / SUPERSEDED=2 / ABANDONED=0`.

Frozen classifier-material-unknown root count is exactly 6:
- 2 roots with direct item applicability UNKNOWN;
- 2 reserved-authority roots whose Current authority surface is UNKNOWN and therefore have applicability/freshness/source_identity UNKNOWN;
- 1 unresolved-intent root with applicability UNKNOWN;
- 1 separate OPEN decision whose decision-maker identity is UNKNOWN.

## 7. Authority, permission, delegation

required_next_step never creates a root.

Exactly 10 OPEN/APPLICABLE permission steps have permission_needed=true and reserved class `PRINCIPAL_PRIVATE_DISCLOSURE`; each exact step class matches linked governance and decision class. Copy class to the exact obligation and decision roots.

For usable authority envelopes, holder comes only from exact governance.
For the one UNKNOWN authority envelope (case `p1e1r4_2ffd4e9ef2b1481c880a9acd16256f39`), set holder UNKNOWN, omit valid_delegation, and set candidate applicability/freshness/source_identity to UNKNOWN on the exact reserved obligation and decision roots. UNKNOWN Current authority is not proof that no valid matching delegation exists; this prevents the frozen AR-3 predicate from converting unavailable authority state into a known Aaron requirement.

valid_delegation=true requires exact ACTIVE lease + unexpired time + matching authority domain/current generation/principal/operation scope/privacy policy+scope/authority policy/current worker/open episode/current IRIS. Provider session/credential never grants delegation.

Frozen reserved-case outcomes:
0 true / 9 false / 1 UNKNOWN-omit at case level; therefore 0 true / 18 false / 2 omitted candidate fields.

## 8. Conflicts and duplicates

Conflict ID:
`conf_<sha256("AARON"|UTF8-byte-sorted exact anchors|conflict_class)>`.

Demonstrated conflict identities are exactly:

1. `p1e1r4_3592698cabc744789906162b61657890`
INCOMPATIBLE_OBLIGATIONS, anchors:
`instruction:209593c8008649b28329b14e62766d68`,
`instruction:bf7abddd95bd48fcad6e6d742213599d`,
`objective:083dabaa11c34e499a492c2381aef180`,
`obligation:b3c3c67639594094abc930cc450fd274`.
ID `conf_1678bc3ce4fd286e0889d69a1bb6f3c4efdcc4ad7e0e801c422b98abf3b46f86`.
Attach only to exact obligation root. That root also has escalation_required=true because its exact governance names AARON escalation target.

2. `p1e1r4_80ccea1138af42d8843eabe2a10fec66`
INCOMPATIBLE_CURRENT_STATE, anchors:
`assertion:9f4a8b630cdc4067a81be6875ee05386`,
`current_assertion:6f7e30c15ed84aa893f311aa237ce2be`,
`objective:0a9cb6c1b78a4910aa3d5e21fa960f51`,
`obligation:9902f0b12e9c4b20873e6e809e27d179`.
ID `conf_4e885b98fa34f80966df5c9584f3b10db0117d61f791fedc38e28ecf7ffa6613`.
The protocol requires incompatible records plus their exact objective/obligation links in the conflict anchor closure. The conflicting assertions directly subject the objective, not an obligation/decision/intent root, so create exactly one conflict-only root; the linked obligation participates in conflict identity only and does not authorize reverse-link attachment. Conflict-only health is APPLICABLE/CURRENT/VERIFIED; escalation_required=false.

3. `p1e1r4_ac08b94cee624ed7a450e17e3389a163`
POSSIBLE_DUPLICATE_UNRESOLVED, anchors:
`objective:46b9bfe032724b97a46b202187d43cc6`,
`obligation:af6abeb0cf104e19bf59b400088a90b7`,
`obligation:c1805592acb24fb884c9ec909d348408`.
ID `conf_d4ff9b505dcdbddfc874d18352b850524c188297ae3308a2510e3e3c2190429d`.
Attach to both obligation roots; each possible_duplicate_refs contains the other typed obligation ref.

Proven self-identity case `p1e1r4_dd291386b74e4b568634d20c138457ea`: same ref + identity_proven=true => no conflict, no possible_duplicate_refs.

Six-way duplicate precedence:
same proven self -> no effect;
same unproven -> no effect;
distinct + authoritative merge -> exact canonical anchor;
distinct + proven + no canonical anchor -> HOLD;
distinct + possible_same + no merge -> unresolved duplicate;
otherwise no effect.

No AUTHORITY_CONFLICT / EFFECT_REALITY_CONFLICT / SOURCE_IDENTITY_CONFLICT generator is demonstrated in these 40 cases; appearance during this frozen execution -> unmapped-structure HOLD.

`input.conflicts` is exact generated IDs only, exact-deduped UTF-8 byte-lexical.

### 8.1 Exact conflict-only candidate ID grammar

When an exact material conflict resolves to no obligation/decision/intent root, create exactly one conflict-only PilotCandidate with:
- `id = "e1:" + case_id + ":conflict:" + conflict_id` where `conflict_id` is the untyped binding-generated `conf_<sha256>` payload;
- `principal_id="AARON"`;
- `objective_id` = raw payload of the exact typed objective anchor;
- `conflict_id` = the same untyped `conf_<sha256>` value;
- no obligation_id, decision_requirement_id, or intent_id;
- common booleans/health/provenance in the exact §6.4 insertion order.

For the sole demonstrated conflict-only root in `p1e1r4_80ccea1138af42d8843eabe2a10fec66`, the exact candidate id is:
`e1:p1e1r4_80ccea1138af42d8843eabe2a10fec66:conflict:conf_4e885b98fa34f80966df5c9584f3b10db0117d61f791fedc38e28ecf7ffa6613`.

Any other conflict-only id derivation is `BINDING_HOLD/PREBUILD_INPUT_VECTOR_MISMATCH`.

## 9. Qualified BIG

Only qualified_big_packets envelope can affect qualified BIG SourceEvaluation.
Usable big_packet requires admission=QUALIFIED_IN_IRIS_EVIDENCE, authority_effect=NONE, source_current_mutation_allowed=false, exact Aaron scope, verified provenance, selected time <= valid_through.
Never read live BIG/provider data. Provider session is noncanonical.

## 10. Impact/consequence deny

impact_packets are reference-side evidence. Decoder MUST NOT calculate/import/inject C1-C4, weights, P1-P4, expected interventions/resolutions, consequence-derived applicability/conflict/escalation/unresolved_effect/omission/coverage/order, or E2/E3 semantics.

If mapping would require a consequence predicate:
`BINDING_HOLD/REFERENCE_SIDE_CONSEQUENCE_DEPENDENCY`.

## 11. Frozen pre-build ProjectionInput vector

Before any buildProjection call, the v1.1 mechanical verifier MUST construct all 40 ProjectionInput objects under §§2-10 without importing candidate execution and prove:

- root count = 84;
- classifier-material-unknown root count = 6;
- applicability census = 73/5/4/2;
- booleans and authority/conflict/privacy censuses above;
- exact SourceEvaluation census;
- exact population/order/digest;
- no prohibited input.

Per-case byte identity is `SHA256(JSON.stringify(ProjectionInput))`.

The ordered vector digest is:
`SHA256(JSON.stringify([{case_id,projection_input_sha256,bytes}, ...manifest order]))`

and MUST equal:

`8edeb6ebd1aa058e70ad32aed319627158ec460f95795c47073dde0c012d3f35`.

Any mismatch is `BINDING_HOLD/PREBUILD_INPUT_VECTOR_MISMATCH`.

This proof invokes neither `buildProjection` nor candidate outputs.

## 11.1 Candidate-path composition totality

The package includes `IRIS-PILOT-001-STANDALONE-BINDING-v1.1-CANDIDATE-PATH-TOTALITY.json`. It exhausts all 84 demonstrated PilotCandidate roots before candidate invocation. For every root it freezes: root class; exact source root ref; exact candidate id and id grammar; exact ordered field presence/value tuple; source/binding derivation class for every field; unknown-trigger predicates; and the expected static `classifyAaron` entry route (`UNKNOWN_ITEM` or `KNOWN_CLASSIFICATION`).

The static path proof composes the binding representation with the frozen candidate branch conditions without calling `classifyAaron` or `buildProjection`. Required results:
- 84/84 roots have exact ID grammar + complete field derivation proof;
- Builder/falsifier section references resolve to an existing v1.1 section/artifact;
- `UNKNOWN_ITEM=6`, `KNOWN_CLASSIFICATION=78`;
- the two reserved roots in `p1e1r4_2ffd4e9ef2b1481c880a9acd16256f39` trigger UNKNOWN through applicability/freshness/source_identity before the AR-3 branch;
- the unresolved intent UNKNOWN and direct applicability UNKNOWN roots likewise cannot reach known classification;
- the OPEN decision-maker UNKNOWN root triggers the candidate's missing-decision-maker unknown path;
- no omitted `valid_delegation` shape reaches known AR-3 when Current authority is UNKNOWN.

Any candidate tuple whose static route differs from the path-totality artifact is `BINDING_HOLD/CANDIDATE_CLASSIFIER_PATH_MISMATCH`.

## 12. Determinism and later execution

After independent acceptance + STRATA execution release only:
- validate entire population before first candidate call;
- exactly one decoder + one buildProjection per case;
- preserve returned object unedited;
- output `JSON.stringify(output)+"\n"`;
- run A/B in separate clean processes;
- all 40 output byte streams and index must match;
- no third run to choose preferred output.

## 13. Totality artifacts and review contract

Package includes:
- standalone binding v1.1;
- immutable dependency manifest;
- mapping-totality matrix;
- candidate-neutral preflight receipt with vector digest;
- exact 40-case pre-build input index;
- mechanical verifier specification;
- 84-root candidate-path totality matrix;
- whole-object Builder/falsifier packet;
- final package index.

Every demonstrated top-level field, envelope token, record type, load-bearing scalar state, candidate field, conflict shape, authority shape, and privacy shape has one exact derivation/disposition or named HOLD.

Next independent reviewer must receive only the self-contained package + exact manifest dependencies, review the WHOLE object, and return the COMPLETE SET of material falsifiers found in that pass. First-falsifier-only review is superseded for this binding gate, except clean-room contamination retirement.

## 14. Authority boundary

No execution release is granted.

Preserve:
`IRIS_NOT_OPERATIONALLY_PROMOTED / CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_CONTINUITY_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED`.

Success before review:
`STANDALONE_BINDING_READY / DEPENDENCY_MANIFEST_COMPLETE / 40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES / PREBUILD_INPUT_VECTOR_FROZEN / FRESH_INDEPENDENT_ACCEPTANCE_REQUIRED`.
