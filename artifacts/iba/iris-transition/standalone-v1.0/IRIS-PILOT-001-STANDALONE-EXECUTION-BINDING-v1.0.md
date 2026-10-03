# IRIS Pilot 001 — Standalone Replacement-E1 to Frozen-Candidate Execution Binding v1.0

Object: `IRIS_PILOT_001_STANDALONE_REPLACEMENT_E1_TO_FROZEN_CANDIDATE_EXECUTION_BINDING_V1_0`
Authority: NONE
Disposition target: `STANDALONE_BINDING_READY / DEPENDENCY_MANIFEST_COMPLETE / 40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES / FRESH_INDEPENDENT_ACCEPTANCE_REQUIRED`

## 0. Standalone status and pins

This document is the complete normative execution-binding contract for the frozen replacement-E1 population and frozen candidate. No v0.2-v0.6 binding document is required to reconstruct or execute these semantics. Historical versions are provenance only.

Governing STRATA root-cause release: BIG-Navigator #703/5964996176.

Frozen replacement E1:
- commit `849deca383add66773ab1ba0c8bc0ca852523c8f`
- tree `fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4`
- 40 cases
- population SHA-256 `32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f`.

Frozen candidate:
- HEAD `185dbd1be80bd54c6cf5dcc085f105a637fe7e44`
- tree `af4808dc6c6db17ed7dc5cdd923fe5b9697c006a`
- PR #4 remains DRAFT / OPEN / UNMERGED.

Permitted semantic dependencies are ONLY the exact content-addressed objects in
`IRIS-PILOT-001-STANDALONE-BINDING-v1.0-DEPENDENCY-MANIFEST.json`.

No E2/E3 labels, reference answers, candidate outputs, scores, score-derived configuration, tests, review judgments, PR history, or historical binding documents are semantic dependencies.

## 1. Execution invariant and independence

For each case in exact manifest order:

`one frozen case -> one external decoder -> one ProjectionInput -> exactly one frozen buildProjection call -> one unedited deterministic output`.

The decoder ends at ProjectionInput. It MUST NOT reimplement classifier, coverage, intervention-ID, consolidation, omission, or projection semantics.

Hard counters:
`labels_consumed=0 / candidate_outputs_consumed=0 / scoring=false`.

Any prohibited input is `BINDING_HOLD/LABEL_OR_SCORING_INPUT_FORBIDDEN` before candidate import or execution.

## 2. Population identity, order and snapshot bracket

Load only the four pinned case shards in dependency-manifest order. Recompute the canonical population digest using recursively sorted object keys, comma/colon separators, UTF-8, ensure_ascii=false, no trailing LF, while preserving array order.

Require:
- exactly 40 cases;
- ordered case IDs exactly equal the pinned manifest/population identity;
- no duplicate, missing, extra, or reordered case;
- digest exactly `32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f`.

Failure: `BINDING_HOLD/POPULATION_IDENTITY_MISMATCH`.

Snapshot reads are ordered dependency observations:
- stable first pair -> select first read; bracket `STABLE`;
- first drift followed by an exact stable second pair -> select third read; bracket `RERUN_STABLE`;
- second drift -> bracket `UNSTABLE`;
- malformed 1/3/>4 structure -> `BINDING_HOLD/SNAPSHOT_BRACKET_STRUCTURE_INVALID`.

Set `started_at=emitted_at=selected read_at`. Wall clock, file time, Git time, and publication time are prohibited. UNSTABLE is a coverage state, not automatically a semantic-binding HOLD. If the second drift leaves candidate-relevant semantic fields non-unique, fail `BINDING_HOLD/UNSTABLE_RECORD_SELECTION_AMBIGUOUS`; if exact version_event evidence proves the drift changes only nonsemantic fields and `prior_semantic_values_retained=true`, preserve the selected third-read semantic values and pass `bracket=UNSTABLE` to the frozen candidate.

ProjectionInput property insertion order is exactly:
`candidates,sources,conflicts,privacyExcluded,bracket,started_at,emitted_at`.

### 2.2 Frozen UNSTABLE semantic-equivalence case

Exactly one frozen case is UNSTABLE: `p1e1r4_d374c5fb7c064f98bad29f633804d4c8`.
Its second-pair drift is `obligation:96315a710ff042b3a3c4a90eae2e0ce1` version 2 -> 3. Exact version events are 1->2 and 2->3; both list only `changed_fields=["updated_at"]` and `prior_semantic_values_retained=true`. Therefore all candidate-relevant obligation semantic fields remain uniquely inherited from the selected canonical record while `bracket=UNSTABLE`. This case does NOT trigger UNSTABLE_RECORD_SELECTION_AMBIGUOUS.

## 2.1 Complete top-level case-field disposition

Every frozen case has exactly these top-level fields and no others:
`case_id, coverage_contract, domain, emission_time, impact_packets, principal_id, records, snapshot_reads, snapshot_time, source_envelopes, source_requirements`.

Their dispositions are total:
- `case_id`: exact opaque population identity; used only for population/order checks, synthetic candidate IDs, output path/index identity; never interpreted semantically.
- `coverage_contract`: require contract_id `PILOT001_IRIS_PLUS_QUALIFIED_BIG_V0_1`, scope_version=1, and exact eight required surfaces. Mismatch -> `BINDING_HOLD/COVERAGE_CONTRACT_MISMATCH`.
- `domain`: routing metadata only; `NOT_MAPPED_BY_DESIGN` to ProjectionInput semantics. It cannot establish relevance, consequence, identity, authority, completeness, applicability, or ordering.
- `emission_time`: `NOT_MAPPED_BY_DESIGN` to execution time or candidate semantics. Wall/publication time is prohibited.
- `impact_packets`: governed only by §11; consequence content is `NOT_MAPPED_BY_DESIGN` to ProjectionInput semantics except exact integrity/link validation.
- `principal_id`: require exact `AARON` for this frozen population; mismatch -> `BINDING_HOLD/CASE_PRINCIPAL_MISMATCH`.
- `records`: exact canonical/source evidence inventory consumed only by §§4-11; duplicate record IDs -> `BINDING_HOLD/DUPLICATE_SOURCE_RECORD_ID`.
- `snapshot_reads`: sole bracket/version-selection control under §2.
- `snapshot_time`: consistency metadata only. For the frozen population it equals the first read_at in every case; it MUST NOT override the §2 selected read_at. Mismatch -> `BINDING_HOLD/SNAPSHOT_TIME_CONSISTENCY_MISMATCH`.
- `source_envelopes`: exact eight-surface inventory governed by §3.
- `source_requirements`: require exactly one requirement for each exact eight surface, required_principal_id=AARON, and nonempty applicability/freshness/provenance contracts. These requirements constrain §3 but never create candidate roots.

Any future or demonstrated top-level field absent from this disposition:
`BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

The decoder/harness input allowlist is exact: v1.0 package files plus dependency-manifest entries only. Any unexpected source path, config, CLI semantic input, environment semantic input, test fixture, historical binding, review judgment, E2/E3 artifact, candidate output, or score-derived object is `BINDING_HOLD/LABEL_OR_SCORING_INPUT_FORBIDDEN` before candidate import/execution.

## 3. Required SourceEvaluation mapping — complete demonstrated envelope grammar

Exactly eight source envelopes are required per case, in this candidate order:
1. `pilot001:objectives <- objectives`
2. `pilot001:obligations <- obligations`
3. `pilot001:obligation_governance <- obligation_governance`
4. `pilot001:decision_requirements <- decision_requirements`
5. `pilot001:authority_generation_and_leases <- authority_state`
6. `pilot001:unresolved_intents_and_effects <- intent_effect_state`
7. `pilot001:applicability_current_assertions <- current_assertions`
8. `pilot001:qualified_big_quarantine_evidence <- qualified_big_packets`.

Every SourceEvaluation has `required=true` and property order:
`source_id,required,present,principal_match,identity,applicability,freshness,provenance_ok,partial`, with `partial` always boolean.

The only demonstrated availability tokens are PRESENT, UNKNOWN, UNAVAILABLE. Any other token fails `BINDING_HOLD/UNMAPPED_SOURCE_AVAILABILITY_TOKEN`.

### 3.1 PRESENT
- `present=true`;
- `principal_match=true` only for exact principal_identity=AARON;
- identity is VERIFIED only when the exact principal/provenance basis establishes it; ambiguous or conflicting identity fails closed to UNKNOWN/CONFLICT as representable;
- source-level applicability is APPLICABLE because the surface is required by the exact frozen coverage contract unless complete exact evidence proves the whole required surface INAPPLICABLE; no demonstrated PRESENT surface contains whole-surface inapplicability evidence. Item-level obligation/decision/intent applicability MUST NOT be collapsed into this surface-level field;
- freshness=CURRENT iff `observed_at <= selected read_at <= valid_through`, STALE if expired, UNKNOWN if unevaluable;
- `provenance_ok` requires verified provenance and all exact envelope source_refs to resolve;
- `partial=true` when enumeration_complete=false or another exact partial/provenance rule requires it.
A PRESENT empty complete inventory is present empty; it is not unavailable or unknown.

### 3.2 UNKNOWN
- `present=false`;
- `identity=UNKNOWN`;
- `applicability=UNKNOWN`;
- `freshness=UNKNOWN`;
- `partial=true`;
- principal/provenance fields may preserve exact independently known evidence but cannot upgrade UNKNOWN coverage.

### 3.3 UNAVAILABLE
UNAVAILABLE means the envelope metadata exists but the required inventory is inaccessible and is not a closed-world empty set:
- `present=false`;
- `principal_match = (principal_identity==="AARON")`;
- identity=VERIFIED iff principal_identity=AARON and provenance_verified=true, else fail closed under the same identity rule;
- `applicability=APPLICABLE` for the required surface absent complete evidence proving whole-surface inapplicability;
- freshness from the envelope timestamps only;
- `provenance_ok` from exact envelope provenance only;
- `partial=true`.
Do not invent records. Do not map UNAVAILABLE to UNKNOWN, INAPPLICABLE, privacy exclusion, PRESENT-empty, or proven absence.

The frozen population demonstrates exactly:
`PRESENT=318 / UNKNOWN=1 / UNAVAILABLE=1`.

### 3.4 Frozen 320-envelope tuple census

The candidate-neutral preflight exhaustively reduced all 320 envelopes under §§3.1–3.3. The only demonstrated SourceEvaluation tuple classes are:
- objectives: 40 PRESENT / principal_match=true / VERIFIED / APPLICABLE / CURRENT / provenance_ok=true / partial=false;
- obligations: same, 40;
- obligation_governance: same, 40;
- decision_requirements: same, 40;
- intent_effect_state: same, 40;
- current_assertions: same, 40;
- authority_state: 39 of that complete CURRENT tuple plus exactly 1 UNKNOWN tuple `present=false / principal_match=true / identity=UNKNOWN / applicability=UNKNOWN / freshness=UNKNOWN / provenance_ok=true / partial=true`;
- qualified_big_packets: 37 complete CURRENT tuples; exactly 1 PRESENT+STALE tuple; exactly 1 PRESENT tuple with `principal_match=false / identity=UNKNOWN / applicability=APPLICABLE / freshness=CURRENT / provenance_ok=true / partial=false`; and exactly 1 UNAVAILABLE tuple `present=false / principal_match=true / VERIFIED / APPLICABLE / CURRENT / provenance_ok=true / partial=true`.

Any other SourceEvaluation tuple class encountered in the frozen population is `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`. This census is about source-surface coverage only and does not decide item-level Aaron relevance.

## 4. Canonical record selection and exact-ref scoping

At the selected snapshot, resolve exact dependency versions.

- lifecycle_event affects ONLY exact `affected_record_refs`;
- action_decision resolves/supersedes ONLY exact named refs;
- applicability_assertion applies ONLY to exact `subject_refs`;
- version_event must form an exact from_version->to_version chain;
- `prior_semantic_values_retained=true` preserves prior semantic values;
- required_next_step and informational_receipt are evidence, never independent candidate roots;
- provider/session/device possession is noncanonical unless an exact source contract explicitly qualifies it;
- impact packets are reference-side consequence evidence and do not create candidate semantics.

If source history cannot uniquely select current semantic state:
`BINDING_HOLD/CURRENT_RECORD_NON_UNIQUE`.

No applicability, lifecycle, abandonment, reaffirmation, identity, authority, or resolution state may cascade merely because records are linked to the same objective/workflow.

## 5. Principal/privacy boundary

Only exact `principal_id==="AARON"` may populate Aaron candidates. No alias, case-fold, trimming, display-name, or semantic-identity inference.

Foreign/private source_packet, device observation, provider session, or record is excluded unless explicitly qualified into Aaron evidence by the exact source contract. `privacyExcluded` contains deduplicated UTF-8 lexical record IDs; private payloads are never copied.

Required foreign payload:
`BINDING_HOLD/CROSS_PRINCIPAL_MAPPING_FORBIDDEN`.

### 5.1 Frozen privacy-exclusion census

The frozen population contains exactly one demonstrated foreign/private source object:
- case `p1e1r4_c09b0e9d61544bbf825d1aa9215879e8`;
- record `source_packet:b8ac8fd78e794c25b476e145f4e6006b`;
- admission QUARANTINED / authority_effect NONE / source_identity_verified=true / source_principal_id OTHER_PRINCIPAL / privacy_scope other-principal-private.

It creates no candidate field and its payload is never copied. `privacyExcluded` contains exactly this typed record ID for that case and is empty for the other 39 cases. The array is exact-deduped and UTF-8 byte-lexically sorted.

## 6. Typed source identity and candidate-owned payload boundary

All source IDs and source refs stay fully typed during source-space joins.

Only these candidate-owned fields receive raw validated payloads:
- `objective_id` from `objective:<payload>`;
- `obligation_id` from `obligation:<payload>`;
- `decision_requirement_id` from `decision_requirement:<payload>`;
- `intent_id` from `intent:<payload>`;
- `conflict_id` receives binding-generated untyped `conf_<sha256>`.

Define `candidateAnchorPayload(expectedNamespace, typedRef)`:
1. typedRef must be a string;
2. exact form `<expectedNamespace>:<payload>`;
3. namespace must match byte-for-byte;
4. payload must be nonempty;
5. payload must contain no colon;
6. return payload unchanged.

No trimming, case-folding, Unicode normalization, UUID parsing, global prefix stripping, or semantic rewriting.

Failures:
- missing namespace -> `BINDING_HOLD/CANDIDATE_ANCHOR_NAMESPACE_MISSING`;
- wrong namespace -> `BINDING_HOLD/CANDIDATE_ANCHOR_NAMESPACE_MISMATCH`;
- malformed payload -> `BINDING_HOLD/CANDIDATE_ANCHOR_PAYLOAD_MALFORMED`.

If any demonstrated source record would need a candidate-owned anchor namespace other than objective/obligation/decision_requirement/intent or binding-generated conflict, fail `BINDING_HOLD/UNMAPPED_CANDIDATE_ANCHOR_NAMESPACE` before buildProjection.

Typed refs remain typed for record IDs, joins, lifecycle/applicability subject refs, action-decision refs, required-next-step refs, source-link refs, evidence/source refs, impact refs, authority/lease/worker/episode refs, privacy exclusions, provenance_refs, possible_duplicate_refs, and binding trace.

No candidate-owned payload field may contain a colon before buildProjection. No output anchor may contain a doubled namespace prefix.

## 7. Candidate roots and order

Candidate class order:
1. obligations;
2. decisions;
3. unresolved intents;
4. conflict-only roots.

Within class sort by UTF-8 lexical raw source record ID.

### 7.1 Obligation root
Create from the selected obligation:
- synthetic id `e1:<case_id>:obligation:<raw_payload>`;
- exact principal/objective/obligation payloads;
- selected obligation status;
- owner from uniquely linked exact governance, otherwise UNKNOWN;
- `concrete_action_remaining=true` iff source action_remaining=true, concrete_action nonempty, and informational_only=false;
- applicability from exact obligation governance/assertion/lifecycle only;
- provenance/freshness/identity from the exact used source facts.

SATISFIED/SUPERSEDED/ABANDONED never auto-resurrect.

### 7.1.1 Demonstrated obligation lifecycle/applicability table

The frozen 42 obligations contain only these six exact state shapes:

1. 35: source status OPEN + governance APPLICABLE + exact obligation assertion APPLICABLE + lifecycle OPEN -> `obligation_status=OPEN / applicability=APPLICABLE`.
2. 2: source status OPEN + governance APPLICABLE + exact assertion APPLICABLE + no lifecycle event for that exact obligation -> `OPEN / APPLICABLE` because the selected canonical record itself is OPEN and no contradicting scoped lifecycle fact exists.
3. 1: source status OPEN + governance UNKNOWN + exact assertion UNKNOWN + lifecycle OPEN -> `OPEN / UNKNOWN`.
4. 1: source status ABANDONED + governance/assertion APPLICABLE + exact scoped lifecycle OPEN then ABANDONED -> `ABANDONED / ABANDONED`. Terminal exact lifecycle/source status defeats older APPLICABLE governance for the obligation only; it MUST NOT cascade to a linked decision.
5. 2: source status SATISFIED + governance/assertion SATISFIED + lifecycle OPEN then SATISFIED -> `SATISFIED / SATISFIED`.
6. 1: source status SUPERSEDED + governance/assertion SUPERSEDED + lifecycle OPEN then SUPERSEDED -> `SUPERSEDED / SUPERSEDED`.

Any other obligation combination in these exact 40 cases is `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`. Contradictory same-ref current evidence is never resolved by borrowing a linked record's state or by consequence evidence.

### 7.2 Decision root
Create from the selected decision requirement:
- synthetic id `e1:<case_id>:decision:<raw_payload>`;
- exact objective and decision payloads;
- do NOT set obligation_id merely because obligation_ref exists;
- decision state is independent from obligation lifecycle;
- OPEN is valid only with exact OPEN source state, applicable decision evidence, complete decision history, and no exact resolving/superseding action_decision;
- otherwise preserve exact RESOLVED/SUPERSEDED/ABANDONED/UNKNOWN state;
- decision_maker identity is exact or UNKNOWN;
- reserved authority class is exact.

### 7.2.1 Demonstrated decision lifecycle/applicability table

The frozen 40 decision requirements contain only these seven exact shapes:

1. 33: source OPEN + history_complete=true + exact APPLICABLE assertion + lifecycle OPEN + no resolving/superseding action_decision -> `decision_status=OPEN / applicability=APPLICABLE`.
2. 1: same but exact applicability UNKNOWN -> `OPEN / UNKNOWN`.
3. 1: OPEN with two exact APPLICABLE assertions that agree -> `OPEN / APPLICABLE`; agreeing duplicates do not create conflict or multiply evidence.
4. 1: source RESOLVED + exact APPLICABLE assertion + exact RESOLVED action_decision resolving that decision -> `decision_status=RESOLVED / applicability=APPLICABLE`.
5. 2: source RESOLVED + exact SATISFIED assertion + exact RESOLVED action_decision -> `RESOLVED / SATISFIED`.
6. 1: source SUPERSEDED + exact SUPERSEDED assertion + exact SUPERSEDED action_decision naming that decision -> `SUPERSEDED / SUPERSEDED`.
7. 1: source OPEN + APPLICABLE + lifecycle OPEN + PENDING action_decision that neither resolves nor supersedes -> `OPEN / APPLICABLE`.

Decision lifecycle is exact-ref independent. A linked obligation's ABANDONED/SATISFIED/SUPERSEDED state cannot change any decision row above unless the exact decision ref is named by lifecycle/action-decision evidence. Any other decision combination in these exact 40 cases is `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

### 7.3 Unresolved intent root
Create only when exact selected intent/effect evidence establishes `SUBMITTED_UNVERIFIED`, `AMBIGUOUS`, or `RECONCILIATION_REQUIRED` and the effect is consequential.

- synthetic id `e1:<case_id>:intent:<raw_payload>`;
- exact objective/intent payloads;
- `unresolved_effect=true`;
- provenance from exact intent/effect evidence.

VERIFIED or NO_EXTERNAL_EFFECT creates no unresolved root. Non-unique intent/effect pairing:
`BINDING_HOLD/INTENT_EFFECT_PAIR_NON_UNIQUE`.

Unresolved-intent applicability is exact-ref only:
- exact scoped APPLICABLE -> APPLICABLE;
- exact scoped SATISFIED/SUPERSEDED/ABANDONED -> that exact representable value;
- exact scoped conflict/ambiguity -> UNKNOWN or named conflict/HOLD under the source rule;
- NO exact intent/effect-scoped applicability evidence -> `applicability="UNKNOWN"`.

Never inherit obligation/decision/objective applicability. Never infer APPLICABLE from consequential=true or unresolved_effect=true. Never omit the field. Never use consequence packets.

The demonstrated unresolved case therefore maps:
`unresolved_effect=true / applicability=UNKNOWN`.

If an unresolved intent/effect in this frozen population presents an exact-scoped applicability evidence shape not covered by the decision rule above, fail `BINDING_HOLD/UNMAPPED_INTENT_APPLICABILITY_SHAPE` rather than choose a value.

### 7.4 Common candidate health and field population

Every PilotCandidate is created by ordered assignment. Optional fields that are not semantically applicable are omitted; null/undefined padding is prohibited unless this binding explicitly represents an unknown with the string `"UNKNOWN"`.

Common rules:
- `principal_id="AARON"` on every admitted candidate.
- `escalation_required=false` on all 84 candidates. Replacement-E1 v0.4 has no independent escalation-status record. A governance `escalation_target_identity_id` names a target if escalation exists; it does not independently create a second AR-4 signal. Material conflict, unresolved effect, and reserved-authority ambiguity use their dedicated fields.
- `unresolved_effect=true` only on the one §7.3 unresolved-intent root; false otherwise.
- `material_conflict=true` only on the four roots named in §9; false otherwise.
- `informational_only` equals the exact source boolean on obligation roots; false on decision/intent/conflict-only roots.
- `applicability` is always supplied under the exact root rules below.
- `freshness` is always supplied from the exact load-bearing evidence closure used by the root, reduced UNKNOWN > STALE > CURRENT.
- `source_identity` is always supplied from the exact load-bearing evidence closure, reduced CONFLICT > UNKNOWN > VERIFIED.
- `provenance_refs` is the exact-deduped UTF-8 byte-lexical union of typed source_refs from the exact load-bearing evidence closure; no protocol/binding/review URI may be invented.
- `possible_duplicate_refs` is always an array; only the exact unresolved-distinct-duplicate case populates typed other-ref values.
- `why` is NEVER supplied by the decoder.

For reserved-authority roots, authority evidence is load-bearing. Therefore the single case with authority_state availability UNKNOWN degrades BOTH exact reserved roots to `applicability=UNKNOWN / freshness=UNKNOWN / source_identity=UNKNOWN`, sets `authority_holder_identity_id="UNKNOWN"`, and omits `valid_delegation`. This preserves the inherited fail-closed health reduction and does not borrow positive authority facts from the unusable surface.

### 7.5 Exact PilotCandidate property insertion order

Because the frozen candidate hashes `JSON.stringify({sources,candidates,conflicts,privacyExcluded})`, property presence/order is normative.

Construct each PilotCandidate in exactly this order:
1. id
2. principal_id
3. objective_id, when applicable
4. obligation_id, obligation roots only
5. decision_requirement_id, decision roots only
6. intent_id, intent roots only
7. conflict_id, when attached/conflict-only
8. obligation_status, obligation roots only
9. obligation_owner, obligation roots only
10. concrete_action_remaining, obligation roots only
11. decision_status, decision roots only
12. decision_maker_identity_id, decision roots only
13. reserved_authority_class, only when exact nonnull reserved authority applies
14. authority_holder_identity_id, only on reserved-authority roots
15. valid_delegation, only when deterministically boolean
16. escalation_required, always boolean
17. unresolved_effect, always boolean
18. material_conflict, always boolean
19. informational_only, always boolean
20. applicability
21. freshness
22. source_identity
23. provenance_refs
24. possible_duplicate_refs, always an array

Any different insertion order, extra decoder-owned property, supplied `why`, or null/undefined padding fails `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE` before buildProjection.

### 7.6 Exact obligation/decision lifecycle-applicability reductions

Status/lifecycle and applicability are separate source dimensions; exact scoped evidence controls each. Cross-record lifecycle/applicability cascade is prohibited.

Obligations — exactly 42:
1. 35: OPEN + governance APPLICABLE + assertion APPLICABLE + lifecycle OPEN -> status OPEN / applicability APPLICABLE.
2. 1: OPEN + governance UNKNOWN + assertion UNKNOWN + lifecycle OPEN -> OPEN / UNKNOWN.
3. 1: ABANDONED + governance APPLICABLE + obligation-scoped assertion APPLICABLE + lifecycle OPEN then ABANDONED -> ABANDONED / APPLICABLE. The terminal status defeats AR-2; do not rewrite the later exact applicability assertion. A separate 11:55 decision-only reaffirmation does not cascade back to the obligation.
4. 2: OPEN + governance APPLICABLE + assertion APPLICABLE + no lifecycle row -> OPEN / APPLICABLE.
5. 2: SATISFIED + governance SATISFIED + assertion SATISFIED + lifecycle OPEN then SATISFIED -> SATISFIED / SATISFIED.
6. 1: SUPERSEDED + governance SUPERSEDED + assertion SUPERSEDED + lifecycle OPEN then SUPERSEDED -> SUPERSEDED / SUPERSEDED.

`concrete_action_remaining = action_remaining===true && concrete_action is nonempty && informational_only===false`; terminal status gating remains candidate-owned.

Decisions — exactly 40:
1. 33: OPEN / complete history / one APPLICABLE assertion / lifecycle OPEN / no action_decision -> OPEN / APPLICABLE.
2. 1: OPEN / complete history / UNKNOWN assertion / lifecycle OPEN -> OPEN / UNKNOWN.
3. 1: OPEN / complete history / two identical APPLICABLE assertions / lifecycle OPEN -> OPEN / APPLICABLE.
4. 1: RESOLVED / complete history / APPLICABLE assertion / exact resolving action_decision -> RESOLVED / APPLICABLE.
5. 2: RESOLVED / complete history / SATISFIED assertion / exact resolving action_decision -> RESOLVED / SATISFIED.
6. 1: SUPERSEDED / complete history / SUPERSEDED assertion / exact superseding action_decision -> SUPERSEDED / SUPERSEDED.
7. 1: OPEN / complete history / APPLICABLE assertion / PENDING nonresolving action_decision -> OPEN / APPLICABLE.

Any other lifecycle/applicability combination in the frozen 40-case population fails `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

### 7.7 Exact candidate evidence closures

Obligation root closure:
objective; obligation; unique obligation_governance; all exact obligation-scoped applicability_assertions; all exact obligation lifecycle_events; exact required_next_step when reserved; exact authority-generation/lease/identity/work_episode evidence when reserved; exact attached conflict/source-link evidence.

Decision root closure:
objective; decision_requirement; all exact decision-scoped applicability_assertions; all exact decision lifecycle_events; all exact action_decisions naming that decision; exact required_next_step + linked governance/authority evidence when reserved; exact directly attached conflict evidence.

Intent root closure:
objective; intent; unique linked effect_record; exact intent/effect-scoped applicability/lifecycle evidence; exact directly attached conflict evidence.

Conflict-only root closure:
the exact conflict-generating records plus exact objective/obligation link records required by §9 to form the frozen conflict-anchor set.

No root may borrow evidence from another root to improve health or classification.

### 7.8 Frozen 84-candidate census

Root counts:
- obligations 42;
- decisions 40;
- unresolved intent 1;
- conflict-only 1;
- total 84.

Candidate applicability after the reserved-authority UNKNOWN health reduction:
- APPLICABLE 73;
- UNKNOWN 5;
- SATISFIED 4;
- SUPERSEDED 2;
- ABANDONED applicability 0.

The five load-bearing UNKNOWN roots are:
- 2 roots in `p1e1r4_2b75131e44224cd98957c79b899fb168` from exact item applicability UNKNOWN;
- 2 reserved roots in `p1e1r4_2ffd4e9ef2b1481c880a9acd16256f39` from authority_state UNKNOWN;
- 1 unresolved-intent root in `p1e1r4_6f43027d04774acda0ac9dd58bc2f4af` from absent exact intent/effect applicability.

Boolean/conflict census:
- escalation_required=true: 0;
- unresolved_effect=true: 1;
- material_conflict=true: 4;
- informational_only=true: 1;
- conflict_id present: 4;
- nonempty possible_duplicate_refs: 2.

Reserved-authority field census:
- reserved_authority_class present on 20 roots;
- authority_holder_identity_id: AARON on 18, UNKNOWN on 2;
- valid_delegation: false on 18, omitted on 2, true on 0.

Candidate health/value census:
- freshness: CURRENT 82 / UNKNOWN 2 / STALE 0;
- source_identity: VERIFIED 82 / UNKNOWN 2 / CONFLICT 0;
- provenance_refs length: exactly 1 on all 84.

Field-presence census:
id 84; principal_id 84; objective_id 84; obligation_id 42; decision_requirement_id 40; intent_id 1; conflict_id 4; obligation_status 42; obligation_owner 42; concrete_action_remaining 42; decision_status 40; decision_maker_identity_id 40; reserved_authority_class 20; authority_holder_identity_id 20; valid_delegation 18; escalation_required 84; unresolved_effect 84; material_conflict 84; informational_only 84; applicability 84; freshness 84; source_identity 84; provenance_refs 84; possible_duplicate_refs 84; why 0.

Additional exact values:
- obligation_owner AARON 20 / IRIS 20 / EXTERNAL_ORG 1 / UNKNOWN 1;
- obligation_status OPEN 38 / ABANDONED 1 / SATISFIED 2 / SUPERSEDED 1;
- decision_maker_identity_id IRIS 29 / AARON 10 / UNKNOWN 1;
- decision_status OPEN 36 / RESOLVED 3 / SUPERSEDED 1.

Any census drift is `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

## 8. Authority, permission and delegation

required_next_step never creates a root.

Exactly 10 frozen cases contain an OPEN/APPLICABLE required_next_step with permission_needed=true and reserved_authority_class `PRINCIPAL_PRIVATE_DISCLOSURE`. In all 10, the step/governance/decision reserved class agrees exactly; mismatch fails `BINDING_HOLD/RESERVED_AUTHORITY_CLASS_MISMATCH`.

Copy the exact reserved class onto the linked obligation and decision roots.

When authority_state is usable, authority_holder_identity_id comes only from exact linked obligation_governance. `valid_delegation=true` only if a referenced lease is ACTIVE at selected time and exact authority-domain ref, authority generation, principal, operation_scope, privacy policy/scope, authority policy, current worker/work episode and IRIS identity match the selected Current authority-generation state. Worker identity generation and authority generation are distinct domains and MUST NOT be numerically equated.

Deterministically invalid mismatch/expiry/revocation/supersession/no lease -> `valid_delegation=false`.
The one authority_state UNKNOWN case -> `authority_holder_identity_id="UNKNOWN"`, omit valid_delegation, and degrade the two reserved roots to applicability/freshness/source_identity UNKNOWN under §7.4. Provider session/credential never grants delegation.

Exact case outcomes:
- `p1e1r4_13f14125911f4e4fafe0e128438a33ae`: false — privacy_scope mismatch.
- `p1e1r4_2746198707b748999b539d1723fd84a2`: false — lease worker is not the current open-episode worker.
- `p1e1r4_2ffd4e9ef2b1481c880a9acd16256f39`: authority UNKNOWN — holder UNKNOWN / valid_delegation omitted / root health UNKNOWN.
- `p1e1r4_593111b7f3bb4e32bd0a6456bba2942a`: false — SUPERSEDED lease.
- `p1e1r4_a09424d46ca04ea3955094402e78966a`: false — non-ACTIVE selected lease.
- `p1e1r4_be72a0a686754345ac8bc70f34ea13f6`: false — no referenced lease.
- `p1e1r4_c76e7b9a4e964fa394b629cb008b3ee8`: false — authority generation mismatch.
- `p1e1r4_ced4056d128542acaa474e6fb85df018`: false — expired before selected read.
- `p1e1r4_d504e20ade654857a871565f2ae65fe0`: false — REVOKED lease.
- `p1e1r4_e77d2a6a825a43f7af5b42afc5a94046`: false — no referenced lease.

Per-case delegation outcomes: true=0 / false=9 / omitted-UNKNOWN=1.
Per-root candidate field outcomes: true=0 / false=18 / omitted=2.

## 9. Conflict and duplicate identity

Conflict class selection is source-fact deterministic:
- mutually exclusive instructions on the same exact obligation -> INCOMPATIBLE_OBLIGATIONS;
- incompatible exact current_assertion values for the same exact subject/predicate -> INCOMPATIBLE_CURRENT_STATE;
- incompatible exact current authority facts -> AUTHORITY_CONFLICT;
- contradictory exact effect reality -> EFFECT_REALITY_CONFLICT;
- exact source-identity contradiction -> SOURCE_IDENTITY_CONFLICT;
- unresolved distinct possible duplicate under the table below -> POSSIBLE_DUPLICATE_UNRESOLVED.

Conflict ID:
`conf_<sha256(UTF8("AARON|" + "|".join(sorted_exact_anchor_refs) + "|" + conflict_class))>`
with UTF-8 byte sort, exact dedupe, no Unicode normalization.

For demonstrated conflicts, the anchor closure is the full exact set of incompatible source/canonical records plus exact objective/obligation links required by the pinned protocol. Attachment is narrower: attach only to roots directly referenced by the conflict-generating relation; a reverse objective->obligation link may be in the identity anchor closure without authorizing root attachment. If no root is directly resolved, create one conflict-only root. A candidate needing >1 distinct conflict_id fails `BINDING_HOLD/MULTIPLE_CONFLICT_IDS_UNENCODABLE`.

Exact demonstrated conflicts:

1. `p1e1r4_3592698cabc744789906162b61657890`
   class INCOMPATIBLE_OBLIGATIONS;
   anchors:
   `instruction:209593c8008649b28329b14e62766d68`,
   `instruction:bf7abddd95bd48fcad6e6d742213599d`,
   `objective:083dabaa11c34e499a492c2381aef180`,
   `obligation:b3c3c67639594094abc930cc450fd274`;
   ID `conf_1678bc3ce4fd286e0889d69a1bb6f3c4efdcc4ad7e0e801c422b98abf3b46f86`;
   attach only to obligation `b3c3c67639594094abc930cc450fd274`.

2. `p1e1r4_80ccea1138af42d8843eabe2a10fec66`
   class INCOMPATIBLE_CURRENT_STATE;
   anchors:
   `assertion:9f4a8b630cdc4067a81be6875ee05386`,
   `current_assertion:6f7e30c15ed84aa893f311aa237ce2be`,
   `objective:0a9cb6c1b78a4910aa3d5e21fa960f51`,
   `obligation:9902f0b12e9c4b20873e6e809e27d179`;
   ID `conf_4e885b98fa34f80966df5c9584f3b10db0117d61f791fedc38e28ecf7ffa6613`;
   the assertions directly subject only the objective, so reverse-link attachment to the obligation is forbidden; create the one conflict-only root.

Conflict-only root:
- id `e1:p1e1r4_80ccea1138af42d8843eabe2a10fec66:conflict:conf_4e885b98fa34f80966df5c9584f3b10db0117d61f791fedc38e28ecf7ffa6613`;
- principal_id AARON;
- objective_id `0a9cb6c1b78a4910aa3d5e21fa960f51`;
- conflict_id `conf_4e885b98fa34f80966df5c9584f3b10db0117d61f791fedc38e28ecf7ffa6613`;
- escalation_required=false / unresolved_effect=false / material_conflict=true / informational_only=false;
- applicability=APPLICABLE / freshness=CURRENT / source_identity=VERIFIED;
- provenance_refs = the one exact evidence source used by the conflict closure;
- possible_duplicate_refs=[].

3. `p1e1r4_ac08b94cee624ed7a450e17e3389a163`
   class POSSIBLE_DUPLICATE_UNRESOLVED;
   anchors:
   `objective:46b9bfe032724b97a46b202187d43cc6`,
   `obligation:af6abeb0cf104e19bf59b400088a90b7`,
   `obligation:c1805592acb24fb884c9ec909d348408`;
   ID `conf_d4ff9b505dcdbddfc874d18352b850524c188297ae3308a2510e3e3c2190429d`;
   attach to both exact obligation roots. Each receives the other typed obligation ref in possible_duplicate_refs.

Case `p1e1r4_dd291386b74e4b568634d20c138457ea` is same-ref + identity_proven=true: PROVEN_SELF_IDENTITY; no conflict, no possible_duplicate_refs, no merge.

Duplicate/source-link decision table:
1. same ref + identity_proven=true -> no duplicate effect;
2. same ref + identity not proven -> no duplicate effect;
3. distinct refs + valid authoritative_merge_ref -> require exact canonical anchor;
4. distinct refs + identity_proven=true + no canonical anchor -> `BINDING_HOLD/PROVEN_DISTINCT_REF_IDENTITY_WITHOUT_CANONICAL_ANCHOR`;
5. distinct refs + identity not proven + possible_same=true + no merge -> POSSIBLE_DUPLICATE_UNRESOLVED;
6. otherwise -> no duplicate effect.

No semantic similarity or consequence evidence may choose identity/conflict behavior.

`input.conflicts` is the exact set of generated conflict IDs for the case, exact-deduped and UTF-8 byte-lexically sorted. All non-conflict cases have [].

## 10. Qualified BIG boundary

Only records inside the qualified_big_packets envelope may influence the qualified BIG SourceEvaluation.

A big_packet is usable only with:
- `admission=QUALIFIED_IN_IRIS_EVIDENCE`;
- `authority_effect=NONE`;
- `source_current_mutation_allowed=false`;
- exact Aaron scope;
- verified provenance;
- selected snapshot within valid_through.

Malformed/non-unique packet -> partial/UNKNOWN or named HOLD as structurally required. Provider session alone is excluded. Never read live BIG/provider data.

## 11. Impact/consequence hard deny

impact_packets may be validated only for source integrity where required. Decoder MUST NOT calculate, import, infer, or inject:
- C1/C2/C3/C4;
- weights;
- P1-P4;
- reference intervention eligibility;
- expected resolution;
- E2 omissions/answers;
- score-derived semantics.

Impact consequence fields cannot set candidate applicability, AR fields, conflict, escalation, unresolved_effect, omission, coverage, ordering, or identifier representation.

If a mapping would require a consequence predicate:
`BINDING_HOLD/REFERENCE_SIDE_CONSEQUENCE_DEPENDENCY`.

## 12. Determinism, serialization and candidate ownership

All generated provenance_refs and possible_duplicate_refs are exact-deduped UTF-8 lexical. No locale sort, Unicode normalization, randomness, or wall clock.

Candidate remains sole owner of classifier, coverage, resolution selection, intervention IDs, consolidation, omission, projection identity, and returned object shape.

Call buildProjection exactly once per case only after the full population has passed preflight. Preserve returned object unedited. Serialize exactly `JSON.stringify(output)+"\n"`.

Per-case output path: `outputs/<case_id>.json`. Index order is manifest order and records byte count/SHA-256/Git blob after publication.

A later authorized executor must run twice in clean processes from identical pins; all 40 output byte streams and canonical index content must match.

## 12.1 Demonstrated load-bearing scalar/token domains

The frozen population admits only the scalar/token domains published in the machine-readable totality matrix under `demonstrated_token_domains`. Those include obligation/governance/decision lifecycle and applicability states, authority/lease states, identity states, intent/effect states, source-link identity booleans, privacy/admission states, and envelope availability/completeness/principal/provenance tokens. Any load-bearing scalar value outside its published demonstrated domain fails `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`; there is no fallback/default coercion.

## 13. Demonstrated-grammar totality requirement

The machine-readable totality matrix at
`IRIS-PILOT-001-STANDALONE-BINDING-v1.0-MAPPING-TOTALITY.json`
is part of this v1.0 package. It enumerates every demonstrated record/envelope structure in all 40 cases and binds each to:
- this document's exact rule ID;
- exact ProjectionInput derivation, NOT_MAPPED_BY_DESIGN, or named HOLD;
- exact ref/provenance scope;
- load-bearing flag.

The static preflight at
`IRIS-PILOT-001-STANDALONE-BINDING-v1.0-STATIC-TOTALITY-PREFLIGHT.json`
must report zero failures and zero unmapped demonstrated shapes before any independent review or candidate execution.

Any demonstrated source shape/token/namespace/state missing from the matrix:
`BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

Any future execution shape outside the frozen demonstrated grammar:
`BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

No implicit/default/discretionary transformation is permitted.

### 13.1 Exact pre-build candidate census

The candidate-neutral preflight must reproduce exactly, before buildProjection:
- obligation roots = 42;
- decision roots = 40;
- unresolved-intent roots = 1;
- conflict-only roots = 1;
- total PilotCandidate objects = 84;
- instruction-conflict obligation roots carrying material_conflict = 1;
- possible-duplicate obligation roots carrying the duplicate conflict = 2;
- possible_duplicate_refs-populated candidates = 2;
- reserved-authority candidate roots = 20 (10 linked obligation + 10 linked decision roots);
- reserved-authority roots with UNKNOWN authority health = 2;
- no candidate requires more than one conflict_id.

Any different pre-build candidate census for these exact 40 cases is `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

## 14. Review package and acceptance

A fresh independent reviewer receives ONLY:
- this standalone binding;
- the exact immutable dependency manifest;
- the exact totality matrix;
- the exact static preflight evidence;
- the v1.0 Builder/falsifier packet;
- the sole canonical candidate-neutral verifier source `verify-standalone-v1.0.mjs`;
- the sealed verifier PASS result `IRIS-PILOT-001-STANDALONE-BINDING-v1.0-STATIC-VERIFIER-RESULT.json`;
- the immutable review-package index `IRIS-PILOT-001-STANDALONE-BINDING-v1.0-PACKAGE-INDEX.json`;
- exact content-addressed semantic dependencies from the manifest.

The Node verifier is the only normative mechanical preflight implementation for v1.0. No Python/alternate verifier is part of the package. Its required result is exit code 0, `failures=[]`, and `40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES`.

No search, directory traversal, historical binding reconstruction, tests, prior review judgments, E2/E3, or candidate output retrieval is required to understand the contract.

The reviewer must inspect the WHOLE object and return the COMPLETE SET of material binding falsifiers in that pass, not first-falsifier-only, unless clean-room contamination requires immediate retirement.

Required successful pre-review disposition:
`STANDALONE_BINDING_READY / DEPENDENCY_MANIFEST_COMPLETE / 40_CASE_MAPPING_TOTALITY_PASS / ZERO_UNMAPPED_DEMONSTRATED_SHAPES / FRESH_INDEPENDENT_ACCEPTANCE_REQUIRED`.

This document authorizes no candidate edit, E1 regeneration, E2 relabeling, candidate execution, scoring, merge/deploy, provider access, IRIS admission, continuity change, or authority change.

Preserve:
`IRIS_NOT_OPERATIONALLY_PROMOTED / CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_CONTINUITY_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED`.

## 15. Historical provenance only — non-normative

v0.2 established the replacement-E1 external decoder architecture.
v0.3 exposed and corrected proven self-identity handling.
v0.4 exposed and corrected UNAVAILABLE required-source reduction.
v0.5 exposed and corrected typed source-ID -> candidate payload conversion.
v0.6 exposed and corrected unresolved-intent applicability reduction.

Those files are NOT required to interpret v1.0 and MUST NOT be used to fill semantic gaps. Any gap in v1.0 is a v1.0 defect and fails closed.
