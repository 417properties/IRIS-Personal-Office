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

### 2.1 Complete top-level case-field disposition

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

### 2.2 Frozen UNSTABLE semantic-equivalence case

Exactly one frozen case is UNSTABLE: `p1e1r4_d374c5fb7c064f98bad29f633804d4c8`.
Its second-pair drift is `obligation:96315a710ff042b3a3c4a90eae2e0ce1` version 2 -> 3. Exact version events are 1->2 and 2->3; both list only `changed_fields=["updated_at"]` and `prior_semantic_values_retained=true`. Therefore all candidate-relevant obligation semantic fields remain uniquely inherited from the selected canonical record while `bracket=UNSTABLE`. This case does NOT trigger UNSTABLE_RECORD_SELECTION_AMBIGUOUS.

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

## 7. Candidate roots, field construction and totality

Candidate class order is exact:
1. obligation roots;
2. decision roots;
3. unresolved-intent roots;
4. conflict-only roots.

Within each class, sort by UTF-8 byte-lexical raw source record ID. No semantic-similarity join or case-local convenience ordering is permitted.

### 7.1 Obligation roots

For every selected privacy-admissible obligation:
- `id=e1:<case_id>:obligation:<raw obligation payload>`;
- `principal_id=AARON`;
- `objective_id` is the raw payload of the exact typed objective_ref;
- `obligation_id` is the raw payload of the exact typed obligation id;
- `obligation_status` is the exact selected source status;
- `obligation_owner` comes from the unique exact obligation_governance.owner_identity_id; null/unknown becomes `UNKNOWN`;
- `concrete_action_remaining = (action_remaining===true && concrete_action is nonempty && informational_only===false)`;
- `informational_only` is the exact source boolean;
- applicability/lifecycle use only exact obligation-scoped governance/assertion/lifecycle evidence;
- authority/conflict/common health fields follow §§7.4–9.

The 42 obligation roots demonstrate exactly six lifecycle/applicability classes:
1. 35: OPEN + governance APPLICABLE + assertion APPLICABLE + lifecycle OPEN -> `status=OPEN / applicability=APPLICABLE`;
2. 1: OPEN + governance UNKNOWN + assertion UNKNOWN + lifecycle OPEN -> `OPEN / UNKNOWN`;
3. 1: ABANDONED + governance APPLICABLE + assertion APPLICABLE + lifecycle OPEN then ABANDONED -> `status=ABANDONED / applicability=APPLICABLE`;
4. 2: OPEN + governance APPLICABLE + assertion APPLICABLE + no scoped lifecycle row -> `OPEN / APPLICABLE`;
5. 2: SATISFIED + governance/assertion SATISFIED + lifecycle OPEN then SATISFIED -> `SATISFIED / SATISFIED`;
6. 1: SUPERSEDED + governance/assertion SUPERSEDED + lifecycle OPEN then SUPERSEDED -> `SUPERSEDED / SUPERSEDED`.

The ABANDONED status defeats AR-2 through the frozen classifier status predicate. It does NOT rewrite separately explicit APPLICABLE governance/applicability and does not cascade to a linked decision. Any other obligation combination in these exact 40 cases is `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

### 7.2 Decision roots

For every selected privacy-admissible decision_requirement:
- `id=e1:<case_id>:decision:<raw decision payload>`;
- `principal_id=AARON`;
- `objective_id` is the raw payload of the exact typed objective_ref;
- `decision_requirement_id` is the raw typed-ID payload;
- DO NOT set `obligation_id` merely because the source decision has obligation_ref;
- `decision_status` is independently reduced from exact decision status/history/action_decision evidence;
- `decision_maker_identity_id` is exact or `UNKNOWN`;
- reserved-authority/conflict/common health fields follow §§7.4–9.

The 40 decisions demonstrate exactly seven lifecycle/applicability classes:
1. 33: OPEN / history complete / one APPLICABLE assertion / lifecycle OPEN / no resolving action_decision -> `OPEN / APPLICABLE`;
2. 1: OPEN / history complete / UNKNOWN assertion / lifecycle OPEN -> `OPEN / UNKNOWN`;
3. 1: OPEN / history complete / two agreeing APPLICABLE assertions / lifecycle OPEN -> `OPEN / APPLICABLE`;
4. 1: RESOLVED / APPLICABLE assertion / exact RESOLVED action_decision naming the decision -> `RESOLVED / APPLICABLE`;
5. 2: RESOLVED / SATISFIED assertion / exact RESOLVED action_decision -> `RESOLVED / SATISFIED`;
6. 1: SUPERSEDED / SUPERSEDED assertion / exact superseding action_decision -> `SUPERSEDED / SUPERSEDED`;
7. 1: OPEN / APPLICABLE / lifecycle OPEN / PENDING action_decision that neither resolves nor supersedes -> `OPEN / APPLICABLE`.

Decision lifecycle is exact-ref independent. Obligation abandonment/satisfaction/supersession does not rewrite a linked decision unless exact decision-scoped lifecycle/action_decision evidence names it. Any other decision combination is `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

### 7.3 Unresolved-intent roots

Create a root only when exact selected intent/effect evidence establishes `SUBMITTED_UNVERIFIED`, `AMBIGUOUS`, or `RECONCILIATION_REQUIRED` and the effect is consequential.

- `id=e1:<case_id>:intent:<raw intent payload>`;
- exact objective_id and intent_id raw payloads;
- `unresolved_effect=true`;
- exact intent/effect evidence only.

VERIFIED/NO_EXTERNAL_EFFECT creates no unresolved root. Non-unique pairing -> `BINDING_HOLD/INTENT_EFFECT_PAIR_NON_UNIQUE`.

Intent applicability is exact-ref only:
- exact scoped APPLICABLE/SATISFIED/SUPERSEDED/ABANDONED -> exact representable value;
- exact scoped ambiguity/conflict -> UNKNOWN or named HOLD;
- zero exact intent/effect-scoped applicability evidence -> `applicability=UNKNOWN`.

Never inherit obligation/decision/objective applicability; never infer APPLICABLE from consequential/unresolved status; never use consequence packets; never omit applicability. The sole demonstrated unresolved-intent root is case `p1e1r4_6f43027d04774acda0ac9dd58bc2f4af` and maps `unresolved_effect=true / applicability=UNKNOWN`. Any other intent-applicability evidence shape in these exact 40 cases -> `BINDING_HOLD/UNMAPPED_INTENT_APPLICABILITY_SHAPE`.

### 7.4 Exact PilotCandidate construction contract

The frozen candidate computes a load-bearing digest using `JSON.stringify({sources,candidates,conflicts,privacyExcluded})`. Property presence and insertion order are therefore normative.

Construct every candidate by ordered assignment exactly:
1. `id`
2. `principal_id`
3. `objective_id`, when applicable
4. `obligation_id`, obligation roots only
5. `decision_requirement_id`, decision roots only
6. `intent_id`, intent roots only
7. `conflict_id`, when exact conflict attached/conflict-only
8. `obligation_status`, obligation roots only
9. `obligation_owner`, obligation roots only
10. `concrete_action_remaining`, obligation roots only
11. `decision_status`, decision roots only
12. `decision_maker_identity_id`, decision roots only
13. `reserved_authority_class`, only when exact nonnull class applies
14. `authority_holder_identity_id`, only when reserved authority is classified
15. `valid_delegation`, only when deterministically boolean
16. `escalation_required`, ALWAYS boolean
17. `unresolved_effect`, ALWAYS boolean
18. `material_conflict`, ALWAYS boolean
19. `informational_only`, ALWAYS boolean
20. `applicability`
21. `freshness`
22. `source_identity`
23. `provenance_refs`
24. `possible_duplicate_refs`, ALWAYS array

`why` is NEVER supplied by the decoder. Optional nonapplicable properties are omitted, never padded with null/undefined. No extra decoder-owned field is permitted.

Common exact reductions:
- `principal_id=AARON`;
- `freshness`: UNKNOWN > STALE > CURRENT over the exact load-bearing evidence closure for that root;
- `source_identity`: CONFLICT > UNKNOWN > VERIFIED over exact load-bearing evidence;
- `provenance_refs`: exact-deduped UTF-8 byte-lexically sorted union of typed source_refs on exact evidence records plus their exact containing-envelope source_refs;
- `possible_duplicate_refs=[]` except the exact §9 unresolved distinct-duplicate rule;
- `unresolved_effect=true` only the sole unresolved-intent root;
- `material_conflict=true` only exact attached/conflict-only conflict roots;
- `informational_only` exact obligation boolean on obligation roots, otherwise false;
- `escalation_required=true` only when the exact root itself has a material conflict/authority/privacy condition AND exact governance scoped to that same root has `escalation_target_identity_id=AARON`; no reverse-link/same-objective propagation. Impact-packet escalation blocks are prohibited.

Exactly two governance rows have Aaron escalation target. Only case `p1e1r4_3592698cabc744789906162b61657890` has that governance on the same obligation root that receives the incompatible-instruction conflict, so exactly that one candidate has `escalation_required=true`. The objective-scoped current-state conflict in `p1e1r4_80ccea1138af42d8843eabe2a10fec66` becomes a conflict-only root and does not inherit the obligation's escalation target.

Any property-order change, omitted common boolean, inserted `why`, null-fill, extra property, or case-local field-population choice -> `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

### 7.5 Exact root-specific evidence closures

The Builder may not choose narrower/broader evidence case-by-case.

Obligation root closure:
- exact objective;
- exact obligation;
- unique exact obligation_governance;
- every exact obligation-scoped applicability_assertion;
- every exact lifecycle_event naming that obligation;
- exact required_next_step naming it when reserved authority is classified;
- exact authority_generation_state + referenced lease/identity/work_episode evidence required for delegation;
- exact conflict/source-link records when the root receives conflict fields.

Decision root closure:
- exact objective;
- exact decision_requirement;
- every exact decision-scoped applicability_assertion;
- every exact lifecycle_event affecting it;
- every exact action_decision naming it via subject/resolves/supersedes;
- exact required_next_step + linked governance/authority evidence when reserved authority is classified;
- exact conflict evidence only if directly attached.

Intent root closure:
- exact objective;
- exact intent;
- unique exact effect_record;
- exact intent/effect-scoped applicability/lifecycle evidence;
- exact directly attached conflict evidence only.

Conflict-only root closure:
- exact incompatible source records generating the conflict;
- exact objective/obligation link records required by §9 for its anchor closure;
- no unrelated case records.

If a required field cannot be supported by its exact closure, use only an explicitly authorized UNKNOWN/omission or fail the named HOLD. Never borrow another root's evidence.

### 7.6 Frozen candidate census

Before buildProjection the exact population MUST produce 84 candidates:
- 42 obligations;
- 40 decisions;
- 1 unresolved intent;
- 1 conflict-only.

Candidate applicability census:
- APPLICABLE 75;
- UNKNOWN 3;
- SATISFIED 4;
- SUPERSEDED 2;
- ABANDONED applicability 0; the one abandoned obligation has status ABANDONED but applicability APPLICABLE.

Field census:
- `unresolved_effect=true`: 1;
- `material_conflict=true`: 4;
- `escalation_required=true`: 1;
- `informational_only=true`: 1;
- `conflict_id` present: 4;
- nonempty `possible_duplicate_refs`: 2;
- reserved_authority_class present: 20;
- authority_holder_identity_id: 18 AARON + 2 UNKNOWN;
- valid_delegation: 18 false + 2 omitted + 0 true.

Exactly six candidates have a load-bearing unknown cause:
- case `p1e1r4_2b75131e44224cd98957c79b899fb168`: obligation + decision applicability UNKNOWN;
- case `p1e1r4_2ffd4e9ef2b1481c880a9acd16256f39`: obligation + decision material-authority dimension UNKNOWN;
- case `p1e1r4_6f43027d04774acda0ac9dd58bc2f4af`: unresolved-intent applicability UNKNOWN;
- case `p1e1r4_40cad8d6ee7440a5bd0fe22d674f9db7`: OPEN decision has exact `decision_maker_identity_id=UNKNOWN`, triggering the frozen candidate's missing-material-decision-maker path.

Thus unknown causes are: applicability UNKNOWN=3 roots; authority-holder UNKNOWN=2 roots; decision-maker UNKNOWN=1 root; source_identity/freshness UNKNOWN=0 roots. These six are disjoint in the frozen population.

Full pre-build load-bearing field census:
- objective_id present 84; obligation_id 42; decision_requirement_id 40; intent_id 1; conflict_id 4;
- obligation_status: OPEN 38 / ABANDONED 1 / SATISFIED 2 / SUPERSEDED 1;
- obligation_owner: AARON 20 / IRIS 20 / EXTERNAL_ORG 1 / UNKNOWN 1;
- concrete_action_remaining: true 38 / false 4;
- decision_status: OPEN 36 / RESOLVED 3 / SUPERSEDED 1;
- decision_maker_identity_id: IRIS 29 / AARON 10 / UNKNOWN 1;
- freshness: CURRENT 84 / STALE 0 / UNKNOWN 0;
- source_identity: VERIFIED 84 / UNKNOWN 0 / CONFLICT 0;
- `why` present 0.

Any different census -> `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

## 8. Authority, permission and delegation

`required_next_step` never creates a root.

Exactly 10 cases contain an OPEN/APPLICABLE `required_next_step` with `permission_needed=true` and `reserved_authority_class=PRINCIPAL_PRIVATE_DISCLOSURE`. In all 10, step/governance/decision reserved classes agree exactly; mismatch -> `BINDING_HOLD/RESERVED_AUTHORITY_CLASS_MISMATCH`.

Copy the reserved class onto the exact linked obligation and decision candidates.

For a usable authority envelope, `authority_holder_identity_id` comes only from exact linked obligation_governance. `valid_delegation=true` only when a referenced lease is ACTIVE at selected time and exact authority-domain ref, authority generation, principal, operation_scope, privacy policy/scope, authority policy, work_episode, active current worker, and active IRIS identity all match Current authority_generation_state. Worker identity generation and authority generation are distinct domains; never equate them numerically. Provider session/credential never grants delegation.

Deterministic invalid mismatch/expiry/revocation/supersession/no-current-lease -> `valid_delegation=false`.

For the one UNKNOWN authority surface, case `p1e1r4_2ffd4e9ef2b1481c880a9acd16256f39`:
- on both reserved roots set `authority_holder_identity_id=UNKNOWN`;
- OMIT `valid_delegation`;
- preserve independently established item applicability/freshness/source_identity;
- do not erase unrelated evidence;
- the frozen candidate's dedicated missingMaterialClassification path represents the authority unknown.

Exact 10-case delegation outcomes:
- `p1e1r4_13f14125911f4e4fafe0e128438a33ae`: false — privacy_scope mismatch;
- `p1e1r4_2746198707b748999b539d1723fd84a2`: false — lease names predecessor/non-current episode worker;
- `p1e1r4_2ffd4e9ef2b1481c880a9acd16256f39`: holder UNKNOWN; valid_delegation omitted;
- `p1e1r4_593111b7f3bb4e32bd0a6456bba2942a`: false — SUPERSEDED lease;
- `p1e1r4_a09424d46ca04ea3955094402e78966a`: false — lease not ACTIVE in selected state;
- `p1e1r4_be72a0a686754345ac8bc70f34ea13f6`: false — no referenced lease;
- `p1e1r4_c76e7b9a4e964fa394b629cb008b3ee8`: false — authority generation mismatch;
- `p1e1r4_ced4056d128542acaa474e6fb85df018`: false — expired before selected read;
- `p1e1r4_d504e20ade654857a871565f2ae65fe0`: false — REVOKED lease;
- `p1e1r4_e77d2a6a825a43f7af5b42afc5a94046`: false — no referenced lease.

Case-level outcomes: true=0 / false=9 / omitted-UNKNOWN=1. Candidate-level reserved roots: valid_delegation false=18 / omitted=2 / true=0. Any other authority/delegation shape in these exact 40 cases -> `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

## 9. Conflict and duplicate identity

Conflicts arise only from explicit source facts, never consequence classes.

Conflict ID is exactly:
`conf_<sha256(AARON|UTF8-byte-sorted exact-deduped anchor refs|conflict_class)>`.

Conflict class mapping:
- mutually exclusive exact instructions on same obligation -> `INCOMPATIBLE_OBLIGATIONS`;
- materially incompatible exact current_assertion values for same exact subject/predicate -> `INCOMPATIBLE_CURRENT_STATE`;
- incompatible exact current authority facts -> `AUTHORITY_CONFLICT`;
- unresolved contradictory exact effect records for same effect reality -> `EFFECT_REALITY_CONFLICT`;
- exact source-identity contradiction -> `SOURCE_IDENTITY_CONFLICT`;
- unresolved distinct possible duplicate under §9.1 -> `POSSIBLE_DUPLICATE_UNRESOLVED`.

Conflict anchors are the full exact incompatible source records PLUS their exact objective/obligation links required by the source relation. If class or full anchor closure is not unique, fail `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

### 9.1 Duplicate/source-link decision table

Apply in order:
1. same ref + identity_proven=true -> PROVEN_SELF_IDENTITY; no conflict, merge, or possible_duplicate_refs;
2. same ref + identity not proven -> no duplicate effect;
3. distinct refs + valid authoritative_merge_ref -> require exact admissible canonical anchor; use it;
4. distinct refs + identity_proven=true + no canonical anchor -> `BINDING_HOLD/PROVEN_DISTINCT_REF_IDENTITY_WITHOUT_CANONICAL_ANCHOR`;
5. distinct refs + identity not proven + possible_same_underlying_request=true + no merge -> `POSSIBLE_DUPLICATE_UNRESOLVED`; no consolidation;
6. otherwise no duplicate effect.

No semantic similarity.

### 9.2 Frozen demonstrated conflict identities and attachments

Exactly three conflicts are generated.

1. Case `p1e1r4_3592698cabc744789906162b61657890`, class `INCOMPATIBLE_OBLIGATIONS`.
   Exact sorted anchors:
   - `instruction:209593c8008649b28329b14e62766d68`
   - `instruction:bf7abddd95bd48fcad6e6d742213599d`
   - `objective:083dabaa11c34e499a492c2381aef180`
   - `obligation:b3c3c67639594094abc930cc450fd274`
   Exact ID: `conf_1678bc3ce4fd286e0889d69a1bb6f3c4efdcc4ad7e0e801c422b98abf3b46f86`.
   Attach only to that exact obligation root; `material_conflict=true / escalation_required=true`.

2. Case `p1e1r4_80ccea1138af42d8843eabe2a10fec66`, class `INCOMPATIBLE_CURRENT_STATE`.
   Exact sorted anchors:
   - `assertion:9f4a8b630cdc4067a81be6875ee05386`
   - `current_assertion:6f7e30c15ed84aa893f311aa237ce2be`
   - `objective:0a9cb6c1b78a4910aa3d5e21fa960f51`
   - `obligation:9902f0b12e9c4b20873e6e809e27d179`
   Exact ID: `conf_4e885b98fa34f80966df5c9584f3b10db0117d61f791fedc38e28ecf7ffa6613`.
   The conflicting assertions directly subject the objective, not an obligation/decision/intent root. Create exactly one conflict-only candidate with objective payload `0a9cb6c1b78a4910aa3d5e21fa960f51`, this conflict_id, `material_conflict=true / escalation_required=false / unresolved_effect=false / informational_only=false / applicability=APPLICABLE / freshness=CURRENT / source_identity=VERIFIED / possible_duplicate_refs=[]`. Do not attach the conflict to the obligation by reverse-link inference; the obligation appears only in the required anchor closure.

3. Case `p1e1r4_ac08b94cee624ed7a450e17e3389a163`, class `POSSIBLE_DUPLICATE_UNRESOLVED`.
   Exact sorted anchors:
   - `objective:46b9bfe032724b97a46b202187d43cc6`
   - `obligation:af6abeb0cf104e19bf59b400088a90b7`
   - `obligation:c1805592acb24fb884c9ec909d348408`
   Exact ID: `conf_d4ff9b505dcdbddfc874d18352b850524c188297ae3308a2510e3e3c2190429d`.
   Attach to both exact obligation roots. Left gets possible_duplicate_refs=[`obligation:c1805592acb24fb884c9ec909d348408`]; right gets [`obligation:af6abeb0cf104e19bf59b400088a90b7`].

Case `p1e1r4_dd291386b74e4b568634d20c138457ea` is PROVEN_SELF_IDENTITY and generates no conflict ID/attachment/duplicate refs.

No AUTHORITY_CONFLICT, EFFECT_REALITY_CONFLICT, or SOURCE_IDENTITY_CONFLICT generating shape exists in these exact 40 cases; appearance during their execution -> `BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE`.

`input.conflicts` for each case is the exact-deduped UTF-8 byte-lexically sorted list of conflict IDs generated for that case. All other cases use `[]`.

If one PilotCandidate would require more than one distinct conflict_id -> `BINDING_HOLD/MULTIPLE_CONFLICT_IDS_UNENCODABLE`; never clone for convenience.

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

A fresh independent reviewer receives ONLY the exact transport package enumerated by `IRIS-PILOT-001-STANDALONE-BINDING-v1.0-REVIEW-PACKAGE-INDEX.json`:
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
