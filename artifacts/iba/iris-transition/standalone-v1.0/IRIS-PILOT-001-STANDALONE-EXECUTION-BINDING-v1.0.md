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
- applicability derives only from exact scoped source applicability/lifecycle evidence;
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

## 8. Authority, permission and delegation

required_next_step never creates a root.

If exact OPEN/APPLICABLE permission evidence has `permission_needed=true` and links an exact subject obligation, decision_ref, and reserved_authority_class, copy the exact reserved class onto the corresponding roots. Mismatch with decision/governance reserved class:
`BINDING_HOLD/RESERVED_AUTHORITY_CLASS_MISMATCH`.

Authority holder comes only from exact governance when the authority envelope is usable.

`valid_delegation=true` only if a referenced authority_lease is ACTIVE at selected time and exact authority domain/generation, principal, operation_scope, privacy policy/scope, worker/episode, and authority policy match current authority_generation_state. Deterministically invalid mismatch/expiry/replaced worker -> false. Missing/ambiguous load-bearing state -> omit valid_delegation and degrade the relevant material dimension to UNKNOWN. Provider session/credential never grants delegation.

A permission-linked decision remains one authorization basis; decoder never manufactures an extra intervention.

## 9. Conflict and duplicate identity

Conflict facts arise only from explicit source facts, never from consequence classes.

Deterministic conflict classes are the frozen candidate enum. Conflict ID:
`conf_<sha256(AARON|sorted exact anchors|class)>`, UTF-8 byte sort, exact dedupe, no Unicode normalization.

Attach a conflict to every exactly referenced existing root. If none resolves, create one conflict-only root. If one PilotCandidate would require more than one distinct conflict_id:
`BINDING_HOLD/MULTIPLE_CONFLICT_IDS_UNENCODABLE`.

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
