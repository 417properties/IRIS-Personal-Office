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

Set `started_at=emitted_at=selected read_at`. Wall clock, file time, Git time, and publication time are prohibited. If UNSTABLE leaves a canonical record version non-unique: `BINDING_HOLD/UNSTABLE_RECORD_SELECTION_AMBIGUOUS`.

ProjectionInput property insertion order is exactly:
`candidates,sources,conflicts,privacyExcluded,bracket,started_at,emitted_at`.

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

### 7.4 Common candidate health and explicit field population

Every produced PilotCandidate is constructed by ordered assignment. Optional fields that are not semantically applicable are omitted; null is never substituted unless this binding explicitly says UNKNOWN. The following fields are not Builder choices:

- `principal_id="AARON"` for every admitted candidate.
- `escalation_required=false` for replacement-E1 v0.4. This population contains no dedicated independent escalation record type. Material Aaron escalation is represented only through exact `material_conflict`, `unresolved_effect`, or reserved-authority fields; governance `escalation_target_identity_id` alone does not create a second AR-4 signal.
- `unresolved_effect=true` only for §7.3 unresolved-intent roots; false for all other candidates.
- `material_conflict=true` only when an exact §9 conflict is attached to that candidate or the candidate is the deterministic conflict-only root; false otherwise.
- `informational_only` is the exact source boolean for obligation roots and false for decision/intent/conflict-only roots.
- `applicability` is always supplied. Obligation/decision/intent roots use their exact root rule. A conflict-only root uses exact conflict-source applicability; if that applicability cannot be uniquely established, use UNKNOWN or fail the named source-shape HOLD—never default APPLICABLE.
- `freshness` is always supplied from only the exact source envelopes/facts used by that candidate, reduced `UNKNOWN > STALE > CURRENT`.
- `source_identity` is always supplied from only the exact source evidence used by that candidate, reduced `CONFLICT > UNKNOWN > VERIFIED`.
- `provenance_refs` is always the UTF-8 byte-lexically sorted exact-deduped union of the original typed source_refs actually used to establish that candidate's fields. No binding/protocol/review URI may be invented as candidate provenance.
- `possible_duplicate_refs` is always an array. It is empty unless the exact §9 unresolved-duplicate rule applies; then each affected obligation candidate receives the exact typed other-ref(s), sorted/deduped, with no payload stripping.
- `why` is NEVER supplied by the decoder. The frozen candidate alone derives its fallback `why_aaron_required` from classification when needed.

Candidate health must not be improved by ignoring a used source with UNKNOWN/STALE/CONFLICT state. PARTIAL surface evidence may support a positively established item only when the item's exact used facts are sufficient; it cannot justify a false COMPLETE/omission claim.

### 7.5 Exact PilotCandidate property insertion order

Because the frozen candidate computes a load-bearing digest with `JSON.stringify`, every candidate MUST be constructed in this exact insertion order:

1. `id`
2. `principal_id`
3. `objective_id`, when applicable
4. `obligation_id`, when applicable
5. `decision_requirement_id`, when applicable
6. `intent_id`, when applicable
7. `conflict_id`, when applicable
8. `obligation_status`, when applicable
9. `obligation_owner`, when applicable
10. `concrete_action_remaining`, when applicable
11. `decision_status`, when applicable
12. `decision_maker_identity_id`, when applicable
13. `reserved_authority_class`, when nonnull/applicable
14. `authority_holder_identity_id`, when reserved-authority classification is applicable
15. `valid_delegation`, only when deterministically boolean
16. `escalation_required`, always boolean
17. `unresolved_effect`, always boolean
18. `material_conflict`, always boolean
19. `informational_only`, always boolean
20. `applicability`
21. `freshness`
22. `source_identity`
23. `provenance_refs`
24. `possible_duplicate_refs`, always an array

Any different property order, implicit omitted common field, inserted `why`, null-for-omitted substitution, or extra decoder-owned property fails `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE` before buildProjection.

## 7.4 Exact PilotCandidate object construction contract

Because the frozen candidate computes its load-bearing dependency digest with `JSON.stringify({sources,candidates,conflicts,privacyExcluded})`, PilotCandidate property presence and insertion order are evaluation-relevant and are normative.

Every candidate MUST be constructed by ordered assignment in exactly this order:

1. `id`
2. `principal_id`
3. `objective_id`, when semantically applicable
4. `obligation_id`, obligation roots only
5. `decision_requirement_id`, decision roots only
6. `intent_id`, intent roots only
7. `conflict_id`, when a deterministic material conflict is attached or for a conflict-only root
8. `obligation_status`, obligation roots only
9. `obligation_owner`, obligation roots only
10. `concrete_action_remaining`, obligation roots only
11. `decision_status`, decision roots only
12. `decision_maker_identity_id`, decision roots only
13. `reserved_authority_class`, only when exact nonnull reserved authority applies
14. `authority_holder_identity_id`, only when reserved authority is being classified and the field is exact/UNKNOWN under §8
15. `valid_delegation`, only when deterministically boolean under §8
16. `escalation_required`, ALWAYS boolean
17. `unresolved_effect`, ALWAYS boolean
18. `material_conflict`, ALWAYS boolean
19. `informational_only`, ALWAYS boolean
20. `applicability`
21. `freshness`
22. `source_identity`
23. `provenance_refs`
24. `possible_duplicate_refs`, ALWAYS an array

`why` is NEVER supplied by the decoder. The frozen candidate may derive its own fallback explanation from its classes. Arbitrary decoder prose is prohibited because it would change output bytes.

Optional properties that are not semantically applicable are OMITTED, not inserted as null/undefined. The only explicit UNKNOWN strings are those required by this binding. No Builder may add an otherwise legal optional property “for completeness.”

### Candidate field reduction common to every root

- `principal_id="AARON"` exactly.
- `freshness`: reduce only the exact source envelopes/records actually used to establish that candidate: UNKNOWN dominates STALE, which dominates CURRENT.
- `source_identity`: CONFLICT dominates UNKNOWN, which dominates VERIFIED, using only exact used source evidence.
- `provenance_refs`: exact-deduped UTF-8 byte-lexically sorted union of the source_refs from exact source records/envelopes actually used to establish candidate fields. Do not invent protocol/review/binding URIs.
- `possible_duplicate_refs=[]` unless exact unresolved distinct duplicate evidence applies; then it is the exact-deduped UTF-8 byte-lexically sorted set of the other typed source refs.
- `unresolved_effect=true` only on unresolved-intent roots; false on every other root.
- `material_conflict=true` only when the deterministic §9 conflict is attached to that root or it is the conflict-only root; false otherwise.
- `informational_only` is the exact obligation boolean on obligation roots; false on decision, intent, and conflict-only roots.
- `escalation_required` is true only when BOTH: (a) the exact root carries a material canonical conflict/authority/privacy condition independently supported by §§8–9, AND (b) exact canonical governance for that root has `escalation_target_identity_id="AARON"`. Otherwise false. Impact-packet escalation_blocks are forbidden inputs.
- application/lifecycle fields follow §§4, 7, and 8 only.

The frozen population demonstrates exactly two governance records with Aaron escalation target, both in the two material conflict cases. Under exact attachment rules:
- case `p1e1r4_3592698cabc744789906162b61657890`: incompatible instructions directly target the obligation carrying Aaron escalation governance, so that obligation root has `material_conflict=true / escalation_required=true`;
- case `p1e1r4_80ccea1138af42d8843eabe2a10fec66`: the incompatible current-state assertions are objective-scoped and produce the deterministic conflict-only root; the obligation's Aaron escalation target is not sprayed across that reverse link, so the conflict-only root has `material_conflict=true / escalation_required=false`.

No other root in the frozen population may have `escalation_required=true`.

## 8. Authority, permission and delegation

required_next_step never creates a root.

If exact OPEN/APPLICABLE permission evidence has `permission_needed=true` and links an exact subject obligation, decision_ref, and reserved_authority_class, copy the exact reserved class onto the corresponding roots. Mismatch with decision/governance reserved class:
`BINDING_HOLD/RESERVED_AUTHORITY_CLASS_MISMATCH`.

Authority holder comes only from exact governance when the authority envelope is usable.

`valid_delegation=true` only if a referenced authority_lease is ACTIVE at selected time and exact authority domain/generation, principal, operation_scope, privacy policy/scope, worker/episode, and authority policy match current authority_generation_state. Deterministically invalid mismatch/expiry/replaced worker -> false. Missing/ambiguous load-bearing state -> omit valid_delegation and degrade the relevant material dimension to UNKNOWN. Provider session/credential never grants delegation.

A permission-linked decision remains one authorization basis; decoder never manufactures an extra intervention.

### 8.1 Frozen delegation census

Exactly 10 replacement-E1 cases contain an OPEN/APPLICABLE required_next_step with reserved authority class `PRINCIPAL_PRIVATE_DISCLOSURE`. Their required-next-step, governance, and decision reserved classes agree exactly.

Apply the exact lease validation above. The candidate-neutral audit yields:
- `valid_delegation=true`: 0 cases;
- `valid_delegation=false`: 9 cases;
- authority source UNKNOWN -> omit `valid_delegation` while degrading the load-bearing candidate/source health to UNKNOWN: exactly case `p1e1r4_2ffd4e9ef2b1481c880a9acd16256f39`.

The nine false cases fail for exact source reasons including privacy-scope mismatch, predecessor/replaced-worker mismatch, non-ACTIVE lease state, no referenced lease, generation mismatch, or expiry. A false result is not an inference that delegation never exists generally; it is the deterministic reduction for these frozen cases.

### 8.1 Demonstrated reserved-authority / delegation table

The frozen population contains exactly 10 OPEN/APPLICABLE `required_next_step` records with `permission_needed=true` and `reserved_authority_class=PRINCIPAL_PRIVATE_DISCLOSURE`. For all 10, the exact step class equals the linked obligation-governance and decision reserved class; any mismatch is `BINDING_HOLD/RESERVED_AUTHORITY_CLASS_MISMATCH`.

The reserved class is copied onto the exact linked obligation and decision candidates. For usable authority envelopes, `authority_holder_identity_id` is copied from exact linked obligation_governance. For the one UNKNOWN authority envelope, positive holder evidence is not usable: set `authority_holder_identity_id="UNKNOWN"`, omit `valid_delegation`, and degrade item/source identity, freshness, and applicability to UNKNOWN as required by §7.4.

Current delegation is true only when a referenced lease is ACTIVE at selected time and exact authority-domain ref, authority generation, principal, operation scope, privacy policy/scope, authority policy, work-episode ref, active current worker ref, and active IRIS ref all match. Worker identity generation is NOT authority generation and is never numerically equated to it.

Exact demonstrated outcomes:
- `p1e1r4_13f14125911f4e4fafe0e128438a33ae`: false — privacy_scope mismatch.
- `p1e1r4_2746198707b748999b539d1723fd84a2`: false — lease names replaced predecessor/non-current worker, not the open episode worker.
- `p1e1r4_2ffd4e9ef2b1481c880a9acd16256f39`: UNKNOWN authority surface/current_generation; holder UNKNOWN; `valid_delegation` omitted; health UNKNOWN.
- `p1e1r4_593111b7f3bb4e32bd0a6456bba2942a`: false — lease state SUPERSEDED.
- `p1e1r4_a09424d46ca04ea3955094402e78966a`: false — lease is not ACTIVE under the selected current state.
- `p1e1r4_be72a0a686754345ac8bc70f34ea13f6`: false — no referenced lease.
- `p1e1r4_c76e7b9a4e964fa394b629cb008b3ee8`: false — lease authority generation does not equal current_generation.
- `p1e1r4_ced4056d128542acaa474e6fb85df018`: false — lease expired before selected read.
- `p1e1r4_d504e20ade654857a871565f2ae65fe0`: false — lease state REVOKED.
- `p1e1r4_e77d2a6a825a43f7af5b42afc5a94046`: false — no referenced lease.

Thus demonstrated delegation counts are `true=0 / false=9 / omitted-UNKNOWN=1`. Any different authority/delegation shape in these exact 40 cases is `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

## 9. Conflict and duplicate identity

Conflict facts arise only from explicit source facts, never from consequence classes.

Deterministic conflict classes are the frozen candidate enum. Conflict ID:
`conf_<sha256(AARON|sorted exact anchors|class)>`, UTF-8 byte sort, exact dedupe, no Unicode normalization.

Attach a conflict to every exactly referenced existing root. If none resolves, create one conflict-only root. If one PilotCandidate would require more than one distinct conflict_id:
`BINDING_HOLD/MULTIPLE_CONFLICT_IDS_UNENCODABLE`.

`input.conflicts` is the exact set of deterministic conflict IDs generated by these rules, exact-deduped and UTF-8 byte-lexically sorted. No source description, conflict class label, anchor ref, or consequence token may be placed in `input.conflicts`.

### 9.1 Source-fact to conflict-class mapping

Conflict class selection is source-fact deterministic:
- mutually exclusive instructions applying to the same canonical obligation -> `INCOMPATIBLE_OBLIGATIONS`;
- materially incompatible exact Current/current_assertion values for the same exact canonical subject/predicate -> `INCOMPATIBLE_CURRENT_STATE`;
- incompatible exact current authority facts -> `AUTHORITY_CONFLICT`;
- unresolved contradictory exact effect records for the same intent/effect reality -> `EFFECT_REALITY_CONFLICT`;
- exact source-identity contradiction -> `SOURCE_IDENTITY_CONFLICT`;
- distinct-ref unresolved possible duplicate under the six-way identity table -> `POSSIBLE_DUPLICATE_UNRESOLVED`.

Conflict anchors are the full exact set of incompatible canonical/source records plus their exact objective/obligation links required by the source relation. Do not import unrelated case records. If the source shape does not uniquely determine conflict class or anchor set, fail `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE` rather than choose a class.

The frozen 40-case population demonstrates exactly:
- `p1e1r4_3592698cabc744789906162b61657890`: two mutually exclusive instructions on `obligation:b3c3c67639594094abc930cc450fd274` -> `INCOMPATIBLE_OBLIGATIONS`;
- `p1e1r4_80ccea1138af42d8843eabe2a10fec66`: contradictory `exclusive_index_owner` current assertions `TEAM_X` vs `TEAM_Y` on `objective:0a9cb6c1b78a4910aa3d5e21fa960f51` -> `INCOMPATIBLE_CURRENT_STATE`;
- `p1e1r4_ac08b94cee624ed7a450e17e3389a163`: distinct obligations with `possible_same_underlying_request=true`, `identity_proven=false`, and no authoritative merge -> `POSSIBLE_DUPLICATE_UNRESOLVED`;
- `p1e1r4_dd291386b74e4b568634d20c138457ea`: same-ref + `identity_proven=true` -> PROVEN_SELF_IDENTITY / no conflict.

No `AUTHORITY_CONFLICT`, `EFFECT_REALITY_CONFLICT`, or `SOURCE_IDENTITY_CONFLICT` generating shape is demonstrated in this frozen population. Encountering one during execution of these exact 40 cases is `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

### 9.2 Duplicate/source-link identity table

Duplicate/source-link decision order is total:

1. same ref + identity_proven=true -> PROVEN_SELF_IDENTITY; no duplicate conflict, no possible_duplicate_refs, no merge;
2. same ref + identity not proven -> no duplicate effect;
3. distinct refs + valid authoritative_merge_ref -> require exact resolving admissible canonical anchor; use it;
4. distinct refs + identity_proven=true + no canonical anchor -> `BINDING_HOLD/PROVEN_DISTINCT_REF_IDENTITY_WITHOUT_CANONICAL_ANCHOR`;
5. distinct refs + identity not proven + possible_same_underlying_request=true + no authoritative merge -> POSSIBLE_DUPLICATE_UNRESOLVED; do not consolidate; retain exact other refs and deterministic conflict;
6. otherwise -> no duplicate effect.

No semantic similarity or inferred identity equivalence.

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

## 14. Review package and acceptance

A fresh independent reviewer receives ONLY:
- this standalone binding;
- the exact immutable dependency manifest;
- the exact totality matrix;
- the exact static preflight evidence;
- the v1.0 Builder/falsifier packet;
- exact content-addressed semantic dependencies from the manifest.

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
