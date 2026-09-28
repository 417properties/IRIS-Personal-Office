# IRIS Persistent Personal Agent Transition — Builder-Ready Blueprint v0.3

**Institutional object:** `IRIS_PERSISTENT_PERSONAL_AGENT_TRANSITION_BLUEPRINT_V0_3`  
**Disposition:** `IRIS_PERSISTENT_PERSONAL_AGENT_TRANSITION_BLUEPRINT_READY / PILOT_001_WHAT_NEEDS_AARON_BUILDER_READY / ZERO_AUTHORITY`

## 0. Fresh Current / controlling architecture

Repository: `417properties/IRIS-Personal-Office`.

Inherited accepted implementation base:
- PR #1: DRAFT / OPEN / UNMERGED;
- base: `main@ef212a946cf9c373f30cbe65c5024527740828f7`;
- accepted C0–C3 head: `bee076c69290922bfe141b9603763ac943619dfe`;
- accepted tree: `d73329469bf2a4393414cfa6db75a5c8cdef1157`;
- Professor acceptance: Issue #2 comment `5858150256`;
- Persistent Continuity: NOT EARNED.

Controlling architecture:
- Issue #3 — IRIS Persistent Personal Agent Transition Architecture v0.1 — Candidate;
- architecture-review assignment: `5860720319`;
- Binding Architecture Amendment 001: `5860873211`;
- scoped Professor recheck: `5860876065`;
- Strata 8.1 acceptance/IBA release: `5860910437`;
- Architecture Extension Addendum 002: `5861060650`;
- scoped Addendum 002 review assignment: `5861063949`;
- IBA pre-freeze notice: `5861064207`;
- Strata 8.1 Addendum 002 acceptance consumption / final integration release: `5861106888`.

Accepted Addendum 002 disposition:
`IRIS_TRANSITION_ARCHITECTURE_ADDENDUM_002_ACCEPTED_FOR_BLUEPRINT_INTEGRATION / PILOT_001_SCOPE_REMAINS_BOUNDED / ZERO_AUTHORITY`.

v0.3 supersedes v0.2 only for Pilot 001 evaluation sequencing. v0.2 and v0.1 remain immutable documentary ancestry; all non-evaluation semantics remain unchanged.

Accepted architecture disposition:
`IRIS_PERSISTENT_PERSONAL_AGENT_TRANSITION_ARCHITECTURE_ACCEPTED_FOR_BLUEPRINTING / ZERO_AUTHORITY / PILOT_001_WHAT_NEEDS_AARON_FIRST`.

This Blueprint does not modify PR #1 and does not transfer PR #1 acceptance to a future child head.

Permanent boundaries:
`IRIS_IDENTITY != AARON_IDENTITY`
`WORKER_IDENTITY != IRIS_IDENTITY`
`PROVIDER_IDENTITY != IRIS_IDENTITY`
`DEVICE_TRUST != PRINCIPAL_IDENTITY`
`PROVIDER_SESSION != IRIS_CURRENT`
`PROVIDER_MEMORY != IRIS_MEMORY`
`PROVIDER_RECOVERY != IRIS_PERSISTENT_CONTINUITY`
`PROTOCOL_AUTHENTICATION != IRIS_AUTHORITY`
`PROVIDER_POSSESSION != INSTITUTIONAL_PERMISSION`
`CREDENTIAL_POSSESSION != CURRENT_AUTHORITY`
`AMBIENT_OBSERVATION_IS_NONCANONICAL`.

Authority ceiling:
`ZERO_AUTHORITY / IRIS_PR1_UNCHANGED / IRIS_NOT_OPERATIONALLY_PROMOTED / CONTINUITY_OFF / NO_EXTERNAL_EFFECT_AUTHORITY / NO_STANDING_AUTHORITY / NO_COMMERCE_AUTHORITY / NO_AMBIENT_CANONICALIZATION / NO_DEPLOYMENT / BIG_ACTIVATION_NOT_AUTHORIZED`.

## 1. Future implementation source boundary

Future Builder branch convention:
`candidate/iris-persistent-personal-agent-transition-v0-1`.

It MUST be created from exactly:
`bee076c69290922bfe141b9603763ac943619dfe`.

This IBA round does not create it.

Additive source delta only:
- `db/migrations/005_agent_transition_identity_authority.sql`
- `db/migrations/006_pilot001_projection.sql`
- `src/agent-transition/{identity,authority-lease,sentinel,persistent-objective-runtime,capabilities,transition-repository,pilot001-types,pilot001-coverage,pilot001-classifier,pilot001-projection,pilot001-metrics,ambient-ingress,research-worker,workflow-durability,capability-router,capability-qualification,portable-procedure,selective-perception}.ts`
- `tests/agent-transition/{identity,authority-lease,sentinel,persistent-objective-runtime,pilot001-classification,pilot001-coverage,pilot001-concurrency,pilot001-metrics,ambient,big-separation,research-worker,workflow-durability,capability-router,capability-qualification,portable-procedure,selective-perception}.test.ts`
- `evidence/IRIS-PERSISTENT-PERSONAL-AGENT-TRANSITION-LOCAL-BUILDER-RETURN.md`
- `evidence/PILOT001-TEST-SUMMARY.json`.

The five Addendum-002 files are bounded interface/pure-logic seams. They do not create a live durable-worker service, live provider router, production qualification platform, sensor runtime, or new authority path.

Migrations 001–004 and accepted C0–C3 source remain unchanged unless Builder returns `BLUEPRINT_RETURN_REQUIRED` with an exact falsifier.

## 2. Identity topology

Institutional IDs are opaque UUIDv7-backed IDs with diagnostic prefixes:
- principal: existing `AARON`;
- IRIS: `iris_<uuidv7>`;
- worker: `wrk_<uuidv7>`;
- provider/cognition: `prv_<uuidv7>`;
- device/interface: `dev_<uuidv7>`;
- protocol endpoint: `pro_<uuidv7>`.

### 2.1 agent_identity

Fields:
`identity_id PK, identity_kind, principal_id FK, stable_label, identity_generation, predecessor_identity_id nullable, issued_at, issuance_basis_ref, retired_at nullable, revocation_ref nullable, schema_version`.

Rules:
- identity IDs are never reused;
- `(identity_kind,stable_label,identity_generation)` unique;
- successor creates a new ID and predecessor reference;
- worker identity is issued by IRIS canonical logic and never inferred from provider session/account;
- retired/revoked identity cannot receive a new Authority Lease.

### 2.2 identity_binding

Fields:
`binding_id PK, institutional_identity_id FK, binding_kind(PROVIDER_SESSION|PROVIDER_ACCOUNT|DEVICE|PROTOCOL_ENDPOINT), external_identity_digest, provider_class nullable, issued_at, valid_to nullable, revoked_at nullable, evidence_refs, version`.

Bindings provide provenance/routing only; they confer neither institutional identity nor authority.

### 2.3 governed worker identity profile

`worker_identity_profile` extends, but does not replace, `agent_identity`.

Fields:
`worker_identity_id PK/FK agent_identity, sponsor_identity_id FK agent_identity, declared_purpose, worker_class, capability_class, authority_envelope, privacy_envelope, credential_boundary_ref, provider_binding_id nullable FK identity_binding, audit_lineage, activated_at, expires_at nullable, revocation_generation, status(ACTIVE|EXPIRED|REVOKED|REPLACED), predecessor_worker_identity_id nullable, successor_worker_identity_id nullable, version`.

Rules:
- `MODEL_IDENTITY != WORKER_IDENTITY`;
- `PROVIDER_ACCOUNT != WORKER_IDENTITY`;
- `WORKER_IDENTITY != AUTHORITY`;
- expiry/revocation fails closed for new assignment/lease validation;
- sponsor/purpose/capability class are accountability metadata, not authority;
- credential boundary is a reference to a brokered boundary, never a credential value;
- replacement receives a new worker identity/profile; predecessor authority does not transfer.

### 2.4 worker_assignment

Fields:
`assignment_id PK, worker_identity_id FK, objective_id FK, obligation_id nullable, work_episode_id FK, causal_episode_id, workflow_id nullable, assignment_generation, evidence_scope, effect_authority_class(ZERO_EXTERNAL_EFFECT|CONSEQUENTIAL_LEASE_REQUIRED), status, predecessor_assignment_id nullable, created_at, ended_at nullable, version`.

Replacement receives a new worker identity/assignment. No predecessor lease transfers.

## 3. Generation-bound Authority Lease

### 3.1 authority_generation_state

One mutable canonical Current row per authority domain:
`authority_domain_id PK, principal_id, capability_id, operation_scope, privacy_scope_digest, current_generation, authority_policy_id/version, privacy_policy_id/version, updated_at, version`.

Deterministic domain identity:
`authdom_<sha256(principal_id|capability_id|operation_scope|privacy_scope_digest)>`.

### 3.2 authority_generation_event

Immutable history:
`event_id PK, authority_domain_id FK, generation_before, generation_after, event_class(ISSUE_BASELINE|REVOKE|REAUTHORIZE|POLICY_CHANGE|PRIVACY_CHANGE), basis_ref, occurred_at, actor_identity_id`.

Generation advance + event append are one transaction.

### 3.3 authority_lease

Immutable issuance:
`lease_id PK, lease_version, principal_id, iris_identity_id, worker_identity_id, work_episode_id, causal_episode_id, authority_domain_id, capability_id, tool_id, operation_scope, privacy_scope, authority_policy_id/version, authority_generation, basis_type, basis_refs, issued_at, expires_at nullable, bounded_validity, source_refs`.

Pilot 001 MUST NOT create standing delegation. Its local fixtures may use explicit test-only leases.

### 3.4 authority_lease_state

Append/version history:
`lease_state_id PK, lease_id FK, state(ACTIVE|REVOKED|EXPIRED|SUPERSEDED), state_version, basis_ref, effective_at`.

### 3.5 Lease validation

Valid only when principal/IRIS/worker/work+causal episode/capability/tool/operation/privacy/policy versions/generation/expiry/latest lease state/Action Intent/unresolved-effect state all match Current canonical state.

Any UNKNOWN, stale, conflicting, unavailable, or unverifiable load-bearing authority state => invalid/HOLD.

### 3.6 Revocation

Transaction:
1. `SELECT authority_generation_state ... FOR UPDATE`;
2. append REVOKE generation event;
3. increment current_generation exactly once;
4. optionally append REVOKED lease-state rows;
5. commit.

The durable generation commit is revocation’s institutional effective point.

## 4. Sentinel check/release linearization

Chosen mechanism:
**Sentinel-owned broker-side compare-and-release under the same authority-generation row lock, with a durable one-time release-attempt record.**

No bearer capability handed to cognition/worker may bypass Current-generation validation.

### 4.1 sentinel_release_attempt

Fields:
`release_attempt_id PK, intent_id UNIQUE FK, lease_id FK, worker_identity_id, work_episode_id, authority_domain_id, authority_generation, tool_id, operation_digest, idempotency_key, status(PREPARED|RELEASED_SUBMITTED|RECONCILIATION_REQUIRED|DENIED), prepared_at, submitted_at nullable, provider_call_id nullable, receipt_ref nullable, denial_reason nullable, version`.

`PREPARED` is durable but is not authority.

### 4.2 Release algorithm

1. persist PREPARED before provider call;
2. begin DB transaction;
3. lock exact `authority_generation_state FOR UPDATE`;
4. lock/re-read lease, worker/episode identity, Current authority/privacy policy versions;
5. validate generation, revocation, expiry, worker, episode, tool contract, Action Intent, retry class and unresolved prior effects;
6. any UNKNOWN/stale/conflict/unavailable => DENIED/HOLD and no provider call;
7. while the same generation lock is held, Sentinel uses its server-side scoped credential to submit the exact provider request;
8. **request submission** is the external-effect linearization point;
9. lock is held only through bounded submission/transport classification, not through eventual business-effect completion;
10. accepted/known submission => `RELEASED_SUBMITTED`;
11. timeout/crash/transport ambiguity after possible submission => `RECONCILIATION_REQUIRED`;
12. commit and release lock.

Revocation takes the same row lock. Therefore either:
- revocation commits first and stale generation cannot release; or
- submission linearizes first and revocation commits afterward.

There is no interleaving in which revocation commits between final validation and submission while stale permission escapes.

Ambiguous submission never authorizes blind retry; Decision → Intent → Receipt → Effect → Verification remains controlling.

Pilot 001 Builder scope may implement schema, pure validation/state machine and a deterministic fake effect adapter only. No live credential or consequential provider call.

## 5. Revocation required outcomes

Revoke before effect / while thinking / while queued / before delayed execution / before retry / during recovery all prevent new old-generation effect release.
Stale generation => DENIED/HOLD.
Replacement worker cannot use predecessor lease.
Live provider session or retained credential grants no institutional permission.
Submitted-before-revocation but unverified => `EFFECT_RECONCILIATION_REQUIRED`.
Unavailable/stale/conflicting authority state => no release.
Reauthorization advances generation and requires a new lease; stale intent/lease cannot be reused.

## 6. Persistent Objective Runtime

Reuse accepted C0–C3 `objective`, `obligation`, `work_episode`, evidence, intent, receipt, verification and continuity-admission semantics.

Provider session/memory are noncanonical.
Worker output returns as evidence only and never calls `publishCurrent()`.
Restart/replacement reconstructs canonical objective/obligation/episode/assignment/authority/unresolved-effect state.
Unresolved effect blocks continuation as `RECONCILIATION_REQUIRED`.
Provider recovery does not equal Persistent Continuity admission.

## 7. Governed capability surface

Pilot 001 required:
- `get_objectives`
- `get_open_obligations`
- `get_aaron_required_items`

Future/read-only:
- `query_big_navigator` — NOT live in Pilot 001; Pilot reads already-qualified BIG delta/quarantine/evidence.

Future/nonconsequential:
- `submit_evidence` — future qualified evidence/quarantine append only.

Documentary/interface only in Pilot 001:
- `prepare_action`
- `request_authority`
- `verify_effect`

No direct DB mutation primitive. No MCP server required for Pilot 001. Any later protocol authentication proves protocol identity only:
`PROTOCOL_AUTHENTICATION != IRIS_AUTHORITY`.

## 8. Pilot 001 governance inputs

Add `obligation_governance`:
`obligation_id PK/FK, owner_identity_id, decision_maker_identity_id nullable, authority_holder_identity_id nullable, reserved_authority_class nullable, escalation_target_identity_id nullable, applicability_state(APPLICABLE|SATISFIED|SUPERSEDED|ABANDONED|UNKNOWN), source_refs, version, updated_at`.

Add `decision_requirement`:
`decision_requirement_id PK, principal_id FK, objective_id FK, obligation_id nullable FK, decision_maker_identity_id, decision_class, reserved_authority_class nullable, status(OPEN|RESOLVED|SUPERSEDED|ABANDONED|UNKNOWN), source_refs, version, created_at, resolved_at nullable`.

These normalize owner / decision-maker / authority-holder / reserved-authority / escalation-target distinctions without replacing existing canonical Objective/Obligation/ActionDecision truth.

## 9. Pilot 001 AR classification

One intervention may have overlapping classes:

**AR-1 EXPLICIT_AARON_DECISION_REQUIRED**
OPEN/APPLICABLE decision_requirement; decision-maker AARON; no resolving/superseding decision.

**AR-2 AARON_OWNED_ACTION_REQUIRED**
Open/in-progress/waiting applicable obligation; Aaron owner; concrete principal action remains; not satisfied/superseded/abandoned/informational-only.

**AR-3 RESERVED_AUTHORITY_REQUIRED**
Applicable/open required next step has reserved-authority class and Aaron is authority holder or no valid matching Current delegation/lease exists.

**AR-4 AARON_ESCALATION_REQUIRED**
Applicable/open item blocked by material canonical conflict, unresolved consequential effect, reserved privacy/authority ambiguity, or incompatible instruction requiring Aaron judgment.

Principal=AARON, mention of Aaron, importance, informational receipt, or provider request alone are insufficient.

## 10. Canonical intervention identity / duplicates

Allowed anchors:
`objective:<id>`, `obligation:<id>`, `decision_requirement:<id>`, `intent:<id>`, `conflict:<deterministic_conflict_id>`.

`intervention_id = arq_<sha256("pilot001-intervention-v1"|principal_id|resolution_kind|sorted_exact_anchor_refs)>`.

resolution_kind:
`DECIDE|ACT|AUTHORIZE|RECONCILE_EFFECT|RESOLVE_CONFLICT`.

Consolidate only exact principal + resolution_kind + exact anchor set. Semantic similarity is insufficient. Possible but uncertain duplicates remain separate and visibly marked.

## 11. Conflicts

Deterministic:
`conf_<sha256(principal_id|sorted_anchor_refs|conflict_class)>`.

Classes:
`INCOMPATIBLE_OBLIGATIONS|INCOMPATIBLE_CURRENT_STATE|AUTHORITY_CONFLICT|EFFECT_REALITY_CONFLICT|SOURCE_IDENTITY_CONFLICT|POSSIBLE_DUPLICATE_UNRESOLVED`.

Never overwrite. Aaron-judgment conflicts receive AR-4 / `CONFLICT_REQUIRES_REVIEW`. Material unresolved conflict prevents COMPLETE.

## 12. Projection Coverage Contract

### 12.1 Durable tables

`projection_coverage_contract(contract_id PK, principal_id, scope_name, scope_version, declared_scope, required_surfaces, known_exclusions, created_at, supersedes_contract_id nullable)`.

`projection_source_requirement(source_requirement_id PK, contract_id FK, source_system, source_class, required_principal_id, freshness_rule, provenance_requirements, required_state_surfaces, applicability_rule)`.

### 12.2 Default Pilot contract

ID: `PILOT001_IRIS_PLUS_QUALIFIED_BIG_V0_1`.

Required surfaces:
1. IRIS canonical objectives;
2. obligations;
3. obligation governance;
4. decision requirements;
5. Current authority-generation/applicable lease state;
6. unresolved intent/effect state;
7. Current Assertions needed for applicability;
8. qualified BIG deltas already admitted to IRIS quarantine/evidence.

Known exclusions:
live Gmail/calendar/phone/device not qualified into IRIS evidence; ambient observations; live unqualified BIG Current; other principals/private planes; commerce/payment/representation; sources without explicit bounded applicability packet.

Completeness applies only to declared scope, never Aaron’s whole life.

Freshness: canonical IRIS rows are read at projection snapshot. External/qualified packets must carry observed/qualified basis plus explicit valid-through or source-declared max-age/applicability. Missing evaluable freshness contract prevents COMPLETE.

## 13. Snapshot / concurrency

Run Pilot 001 at PostgreSQL `REPEATABLE READ`.

Read exact contract/version + required canonical/qualified state. Write only immutable projection/audit artifacts, never canonical Objective/Obligation/Current/Authority/BIG state.

Before completeness-bearing emission:
1. capture exact load-bearing IDs + versions/generations/digests;
2. end snapshot;
3. re-read those dependencies;
4. one change => discard/rerun once;
5. second instability => `UNKNOWN_COVERAGE`.

Concurrent projections are independent immutable runs.

Authority-generation drift, objective/obligation change, source freshness change or coverage drift is load-bearing and triggers this bracket rule.

## 14. Coverage states

Every response has exactly one:

**COMPLETE_FOR_DECLARED_SCOPE** iff all required sources are present/proven inapplicable, freshness/applicability satisfied, principal/source identity and provenance verified, required objective/obligation/authority/effect state available, no material conflict or load-bearing AARON_RELEVANCE_UNKNOWN, and end bracket stable.

**INCOMPLETE_COVERAGE** when known required source/surface is missing, stale, inaccessible or partially insufficient.

**CONFLICTED_COVERAGE** when required state exists but material unresolved conflict prevents a coherent completeness claim.

**UNKNOWN_COVERAGE** when coverage itself cannot be reliably established: identity/applicability/freshness unknown or repeated bracket instability.

`AARON_RELEVANCE_UNKNOWN` is item-level. Known candidate with undecidable AR class must appear there.

Stale/partial/conflicting evidence cannot justify omission. Wrong-principal/private records are privacy-excluded, not relevance-excluded, and audited separately.

Preserve:
`ABSENCE_FROM_AARON_REQUIRED_SET != PROVEN_IRRELEVANT`
`JUSTIFIED_OMISSION_REQUIRES_SUFFICIENT_CLASSIFICATION_EVIDENCE`
`INCOMPLETE_COVERAGE => NO_COMPLETE_OMISSION_CLAIM`.

## 15. Pilot 001 output contract

Required top-level fields:
- projection_id / principal_id=AARON;
- coverage contract ID/scope/version/declared scope/known exclusions;
- completeness_state;
- snapshot started/emitted/dependency digest/bracket status;
- known_aaron_required[];
- aaron_relevance_unknown[];
- unresolved_conflicts[];
- coverage_gaps[];
- privacy_exclusions[];
- justified_omissions[].

Each required item carries intervention_id, all AR classes, resolution_kind, canonical objective/obligation/decision/effect refs, why Aaron is required, provenance, freshness, uncertainty and possible_duplicate_refs.

Presentation may not suppress completeness, gaps, unknowns or conflicts.

## 16. Pilot audit persistence

Migration 006 creates immutable audit/evaluation:
- `pilot001_projection_run`;
- `pilot001_source_evaluation`;
- `pilot001_projection_item`.

Projection rows are not Current.

## 17. Metrics / thresholds

These are experiment evaluation weights, not authority, legal/financial policy or risk tolerance.

Consequence weights:
- C1 routine bounded reversible = 1;
- C2 material objective-delay/privacy/coordination = 4;
- C3 reserved authority/unresolved consequential effect/material escalation = 16;
- C4 legal/financial/safety/irreversible classification evidence only = 64.

Required metrics:
weighted miss rate; unweighted recall; excess-notification rate; abstention; incomplete coverage; conflict; justified-omission precision; Aaron Mechanical Intervention Rate; institutional-change→Aaron-decision compression; freshness latency; provenance coverage.

Reference set is independently adjudicated and immutable from classifier perspective.

### 17.1 Binding evaluation sequencing amendment

The governing intent of `independently adjudicated and immutable from classifier perspective` does **not** require answer labels to exist before Builder construction. It requires that the classifier cannot select, change, influence, or adapt the governing ground truth used for final evaluation.

Therefore Pilot 001 evaluation is sequenced as follows.

**Phase E1 — PRE-BUILDER FREEZE**

Before any Builder resumption, Professor / independent evaluator MUST independently create and freeze:

- public case-input manifest at `artifacts/evaluation/pilot001/IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.1.json`;
- immutable case population count and population digest bound in that manifest;
- adjudication protocol at `artifacts/evaluation/pilot001/IRIS-PILOT-001-ADJUDICATION-PROTOCOL-v0.1.md`;
- consequence-classification protocol within that adjudication protocol;
- independent AMIR baseline at `artifacts/evaluation/pilot001/IRIS-PILOT-001-AMIR-BASELINE-v0.1.json`, including frozen evidence population and final numerical baseline;
- independence certification identifying evaluator role and confirming V0/Builder did not author the governing population, protocol, labels or baseline.

Each E1 object MUST have immutable path/version plus post-publication byte count, SHA-256 and Git blob/equivalent identity before Builder release.

At E1, **no governing answer-label artifact exists**. Builder may inspect the frozen case inputs and public protocol. Builder may not change case membership, case IDs, population digest, adjudication protocol, consequence-classification rules, AMIR baseline or metric thresholds.

Preserve:
`CASE_POPULATION_FROZEN_BEFORE_BUILD`
`AMIR_BASELINE_FROZEN_BEFORE_BUILD`.

**Phase E2 — EXACT CANDIDATE FREEZE, THEN LABEL ADJUDICATION**

V0 may construct only after all E1 requirements are frozen and a separate Builder release is issued. V0 then MUST durably freeze and report the exact candidate branch, head, tree, source delta identity and test/evidence identity, and STOP. No source/test/evidence mutation affecting the candidate is permitted after this freeze for the governing evaluation.

Only after that exact candidate freeze may Professor / independent evaluator adjudicate the already-frozen case population.

Before governing labels are completed and published, the adjudicator MUST NOT inspect classifier outputs, candidate evaluation outputs, candidate pass/fail results, model predictions, V0 self-scoring, or any other candidate-derived answer signal.

Preserve:
`LABEL_ADJUDICATOR_BLIND_TO_CANDIDATE_OUTPUTS_UNTIL_LABEL_PUBLICATION`.

Labels MUST be generated only from the frozen case inputs, accepted architecture/Blueprint semantics, source evidence necessary to determine ground truth, and the precommitted adjudication protocol. The governing label artifact path is:
`artifacts/evaluation/pilot001/IRIS-PILOT-001-REFERENCE-SET-LABELS-v0.1.json`.

On publication, that artifact MUST bind byte count, SHA-256, Git blob/equivalent identity, case-population digest and adjudication certification.

Because the case population/protocol are immutable before build, the candidate is immutable before label creation, and the adjudicator is blind to candidate outputs until publication, the reference set is independently adjudicated and immutable from classifier perspective even though governing labels are created post-freeze.

**Phase E3 — FINAL INDEPENDENT SCORING**

Final metric scoring MUST NOT begin until both:
1. exact candidate identity is frozen; and
2. governing labels are immutable and published.

The scorer evaluates the frozen candidate against the frozen labels and the pre-Builder AMIR baseline. Builder/V0 does not create the governing labels, measure the governing AMIR baseline, or grade itself.

Preserve:
`BUILDER_IMPLEMENTATION != REFERENCE_SET_ADJUDICATION != FINAL_METRIC_EVALUATION`.

Builder resumption is therefore CONDITIONAL on completed E1 artifacts and a separate release.

Safety acceptance thresholds:
- C3/C4 misses = 0;
- consequence-weighted miss rate = 0.000;
- unweighted recall = 1.000;
- justified-omission precision = 1.000;
- positive-inclusion provenance coverage = 1.000;
- cross-principal leakage = 0;
- false COMPLETE = 0;
- abstention/UNKNOWN credited as successful omission = 0;
- incomplete coverage credited as omission/compression success = 0.

Utility gates only after all safety gates pass:
- excess-notification rate <= 0.25;
- AMIR <= 0.80 × independently measured baseline;
- compression ratio >= 2.0 on COMPLETE runs.

Incomplete/conflict rates are reported, never optimized away. No threshold grants authority.

## 18. Ambient contract

Interface/specification only.

`AmbientObservationEnvelope`: observation ID, device/protocol identity, modality(VOICE|CAMERA|EMOTION_INFERENCE|LOCATION|WEARABLE|VEHICLE|SCREENLESS_HARDWARE|OTHER), observed_at, payload/provenance refs, claimed principal optional, device trust state, `canonicalization_authority=NONE`.

Device trust proves transport/device provenance only; not Aaron identity, claim truth, authority or Current. Ambient ingress creates evidence/quarantine only. No live ambient adapter in Pilot 001.

## 19. Future zero-effect worker

Documentary/interface only unless separately released.

`IRIS objective → worker identity → explicit evidence scope → ZERO external-effect authority → provider execution → evidence/artifact return → IRIS qualification`.

Worker output never directly mutates Current. Replacement preserves canonical objective/obligation/effect uncertainty.

## 20. Future effects

Documentary plus local deterministic Sentinel tests only:
`Decision != Intent != Receipt != Effect != Verification`.

No live effect adapter/credential/provider release. Representation, negotiation, commerce, payments and standing authority remain deferred.

## 21. Persistence / migration order

Migration 005 creates:
`agent_identity, identity_binding, worker_identity_profile, worker_assignment, obligation_governance, decision_requirement, authority_generation_state, authority_generation_event, authority_lease, authority_lease_state, sentinel_release_attempt, capability_candidate, capability_qualification`.

Migration 005 also additively extends existing `capability_procedure` with nullable/version-safe fields:
`context_requirements, evidence_expectations, compatibility_constraints, provenance_refs, supersedes_capability_id, retired_at`.

`capability_candidate` fields:
`capability_candidate_id PK, role_scope, provider_identity_id nullable, model_identity_digest nullable, worker_class nullable, toolset_digest, procedure_refs, reasoning_profile, runtime_placement, privacy_profile_digest, evidence_contract_digest, candidate_version, created_at`.

`capability_qualification` fields:
`qualification_id PK, capability_candidate_id FK, role_scope, evaluation_population_ref, comparator_qualification_ref nullable, dimensions, evidence_refs, falsifier_refs, evaluation_result(PASS|FAIL|UNKNOWN), admission_state(CANDIDATE|ADMITTED|REJECTED|DEMOTED|EXPIRED), qualified_at nullable, valid_until nullable, supersedes_qualification_id nullable, version`.

Qualification is role/scope-specific. `ADMITTED` means routing-eligible for that role only; it grants no tool or effect authority.

Migration 006 creates:
`projection_coverage_contract, projection_source_requirement, pilot001_projection_run, pilot001_source_evaluation, pilot001_projection_item` and seeds only the deterministic default coverage contract; no credentials/provider IDs.

No workflow-durability table is created in Pilot 001. The exact future workflow schema is frozen in §26 but remains a documentary extension until a zero-effect durable-worker implementation is separately released.

Order: inherited 001–004 unchanged → 005 → 006.

Nonproduction rollback: 006 then 005 only after retained evidence is reconciled. Never rewrite 001–004.

## 22. Deterministic proof matrix

Every proof records ID, invariant, fixture/input, expected, observed, status, exact source head and evidence ref.

Identity:
T01 worker != IRIS; T02 IRIS != Aaron; T03 provider cannot become worker by inference; T04 device trust != principal/truth/authority/Current; T05 replacement creates new identity/generation; T06 retired identity cannot receive lease.

Authority/revocation:
T07 full lease binding; T08 revoke-before-effect; T09 revoke-while-thinking; T10 queued; T11 delayed; T12 before ambiguous retry; T13 restart; T14 stale generation; T15 replacement worker; T16 live provider session; T17 retained credential; T18 submitted/unverified reconciliation; T19 authority UNKNOWN; T20 reauthorization new lease; T21 check/release race serialized; T22 crash/ambiguity after PREPARED; T23 cognition has no master broker credential.

Persistent Objective Runtime:
T24 provider session != Current; T25 worker evidence only; T26 replacement preserves semantics; T27 restart reconstructs assignment/authority/unresolved effect; T28 provider recovery != Persistent Continuity.

Pilot AR:
T29 AR-1; T30 AR-2; T31 AR-3; T32 AR-4; T33 overlap one intervention; T34 informational mention negative; T35 principal-only negative; T36 satisfied/superseded Aaron-owned negative; T37 IRIS-owned+Aaron-authority positive; T38 external-owned+Aaron-escalation positive.

Duplicate/conflict:
T39 exact identity consolidation; T40 semantic similarity not enough; T41 uncertain duplicate marked; T42 incompatible obligations explicit conflict; T43 material conflict prevents COMPLETE.

Coverage/omission:
T44 stale required source => INCOMPLETE; T45 partial may include but not omit; T46 missing source => INCOMPLETE; T47 unknown identity/applicability => UNKNOWN; T48 wrong principal privacy-excluded/audited; T49 conflict => CONFLICTED; T50 all conditions => COMPLETE; T51 unclassifiable candidate => AARON_RELEVANCE_UNKNOWN; T52 justified omission requires all material dimensions; T53 unjustified omission rejected; T54 no silent scope narrowing; T55 one dependency drift reruns; T56 repeated instability => UNKNOWN.

Metrics:
T57 consequential miss fails; T58 abstention not omission success; T59 incomplete not compression success; T60 weights exactly 1/4/16/64; T61 trivial exclusions cannot offset C3/C4 miss; T62 false COMPLETE fails; T63 independent reference set.

Capability/ambient:
T64 no unrestricted DB mutation; T65 protocol auth no IRIS authority; T66 trusted device no authority/truth/Current; T67 ambient evidence/quarantine only.

BIG separation:
T68 bounded BIG packet/quarantine required; T69 wrong principal excluded; T70 IRIS cannot mutate BIG Current; T71 BIG delta authority_effect=NONE.

Future worker:
T72 provider result evidence only; T73 external_effect_count=0; T74 replacement preserves semantics.

Source/deferral:
T75 PR #1 unchanged; T76 future child descends exact bee076 head; T77 no live credentials/provider/deployment mutation; T78 no Persistent Continuity activation; T79 no standing authority/commerce/representation; T80 no C4–C6/ambient canonicalization.

## 23. Future Builder commands / return

Commands:
`npm test`
`npm run check`
`node --experimental-strip-types --test tests/agent-transition/*.test.ts`
`git diff --check bee076c69290922bfe141b9603763ac943619dfe..<HEAD>`
`git diff --name-only bee076c69290922bfe141b9603763ac943619dfe..<HEAD>`.

Builder emits `evidence/PILOT001-TEST-SUMMARY.json` mapping T01–T80.

Required zero-effect return fields:
PR #1 modified=NO; credentials bound=0; live external-effect calls=0; BIG mutations=0; deployment mutations=0; Persistent Continuity activation=0; standing authority grants=0; commerce/payment/representation effects=0; ambient canonicalizations=0.

Allowed Builder disposition:
`IRIS_PERSISTENT_PERSONAL_AGENT_TRANSITION_CANDIDATE_CONSTRUCTED_AND_LOCALLY_VERIFIED / INDEPENDENT_ACCEPTANCE_REQUIRED`
or exact `BUILDER_HOLD_<FALSIFIER>`
or exact `BLUEPRINT_RETURN_REQUIRED_<MISSING_DECISION>`.

## 24. Operational deferrals

NOT AUTHORIZED:
Persistent Continuity; production/live credentials; consequential external execution; live Sentinel release; standing authority; payments; commerce; representation; negotiation; ambient canonicalization; production deployment; merge; operational promotion; C4–C6 maturity; BIG Activation.


## 25. Addendum 002 integration classification

| Addendum 002 concept | Classification | Reconciliation |
|---|---|---|
| Three-way durability distinction / Workflow Durability | `NEW_BLUEPRINT_PRIMITIVE_REQUIRED` | New bounded workflow/checkpoint contract; never Current; Pilot 001 gets interface/pure-logic seam only |
| Governed durable worker identity | `EXTEND_EXISTING_PRIMITIVE` | Extend `agent_identity` + `worker_assignment` with `worker_identity_profile`; Authority Lease remains separate |
| CognitionRouter → Capability Router | `EXTEND_EXISTING_PRIMITIVE` | Routing abstraction expands; no planner/Current/authority semantics |
| Continuous Capability Qualification | `EXTEND_EXISTING_PRIMITIVE` | Extend CapabilityProcedure + IEF/Personal-BIRE evidence with candidate/qualification records; no production evaluation platform |
| Portable Skills / Procedures | `EXTEND_EXISTING_PRIMITIVE` | Extend existing `capability_procedure`; no parallel Skill Current |
| Selective Perception / Presence Without Surveillance | `EXTEND_EXISTING_PRIMITIVE` | Extend Ambient Interface; no live sensor runtime or default persistence |
| Aaron State Model | `DOCUMENTARY_EXTENSION_POINT_ONLY` | Future derived projection over OrientationState/Aaron Current/objectives; never a second Current |
| Need / Intent Anticipation | `DOCUMENTARY_EXTENSION_POINT_ONLY` | Future inference/evidence candidate only; prediction creates no decision/authority |
| Attention & Interruption Intelligence | `DOCUMENTARY_EXTENSION_POINT_ONLY` | Future presentation/arbitration seam after Pilot inclusion; cannot suppress required items or create permission to interrupt |
| Objective Stewardship | `ALREADY_SATISFIED` | Existing Objective/Obligation + task≠objective semantics are canonical; future detectors emit evidence/candidates only |
| Personal Resource Arbitration | `DOCUMENTARY_EXTENSION_POINT_ONLY` | Future recommendation seam only; no optimizer authority |
| Opportunity / Threat Radar | `DOCUMENTARY_EXTENSION_POINT_ONLY` | Future sense→investigate→qualify→compare→prepare seam; no alert brain |
| Social / Relationship Intelligence | `DOCUMENTARY_EXTENSION_POINT_ONLY` | Future evidence-bounded projection; inference never truth about another person |
| Graduated / Earned Autonomy | `DOCUMENTARY_EXTENSION_POINT_ONLY` | Future admission progression reuses Authority Lease/Sentinel; performance never auto-grants authority |

No Addendum concept creates a second Current, observer brain, planner brain, relationship truth store, or autonomy authority layer.

## 26. Three-way durability / Workflow Durability

Binding distinction:

`IRIS_PERSISTENT_CONTINUITY != WORKER_SESSION_CONTINUITY != WORKFLOW_DURABILITY`

- **IRIS Persistent Continuity:** canonical IRIS recovery; operationally deferred and NOT EARNED.
- **Worker Session Continuity:** provider/session cognition/context convenience; noncanonical.
- **Workflow Durability:** explicit bounded work progress/checkpoints that allow restart/replacement without reconstructing all work.

Preserve:
`WORKFLOW_CHECKPOINT != IRIS_CURRENT`
`PROVIDER_SESSION_LOSS != WORKFLOW_LOSS`
`WORKFLOW_DURABILITY != EFFECT_REPLAY_AUTHORITY`

### 26.1 Exact future workflow records

Reserved future durable records, NOT created by Pilot 001 migrations:

`workflow_instance`:
`workflow_id PK, objective_id FK, obligation_id nullable, causal_episode_id, purpose, workflow_generation, status(ACTIVE|WAITING|HOLD|CLOSED|ABORTED), current_step_id nullable, created_at, updated_at, version`.

`workflow_step`:
`step_id PK, workflow_id FK, step_key, procedure_ref nullable, worker_assignment_id nullable, effect_class(ZERO_EFFECT|EFFECTFUL), replay_class(READ_ONLY_SAFE|ZERO_EFFECT_SAFE|RECONCILE_BEFORE_REPLAY|NO_AUTOMATIC_REPLAY), state(TENTATIVE|QUALIFIED_COMPLETED|WAITING|FAILED|RECONCILIATION_REQUIRED), authority_snapshot_ref nullable, unresolved_effect_ref nullable, predecessor_step_id nullable, created_at, updated_at, version`.

`workflow_checkpoint`:
`checkpoint_id PK, workflow_id FK, step_id FK, checkpoint_version, checkpoint_class(TENTATIVE_PROVIDER|QUALIFIED_WORKFLOW), payload_ref, payload_digest, evidence_refs, qualification_refs, worker_identity_id, predecessor_worker_identity_id nullable, successor_worker_identity_id nullable, provider_session_ref nullable, authority_snapshot_ref nullable, unresolved_effect_refs, resumable, supersedes_checkpoint_id nullable, created_at, expires_at nullable`.

### 26.2 Admission / resume rules
- provider/session state begins as `TENTATIVE_PROVIDER`;
- only `QUALIFIED_WORKFLOW` checkpoint may be used as authoritative workflow-resume input;
- qualification requires exact workflow/step identity, payload digest, evidence refs and zero unresolved contradiction;
- provider session loss does not delete a qualified workflow checkpoint;
- replacement worker uses a new worker identity/assignment and may consume only a qualified checkpoint;
- checkpoint supersession is append/versioned; history is not overwritten;
- `EFFECTFUL` step with unresolved effect always resumes as `RECONCILIATION_REQUIRED`;
- no effectful step may be replayed solely from workflow durability;
- authority is revalidated independently through Authority Lease/Sentinel at any future consequential release.

Pilot 001 Builder implements only the typed contract, validation functions and deterministic local tests. It does not create workflow tables or a long-running worker runtime.

## 27. Governed durable Worker Identity

§2 is controlling. The Addendum fields are mechanically bound through `worker_identity_profile`.

Identity and authority remain separate:
`MODEL_IDENTITY != WORKER_IDENTITY`
`PROVIDER_ACCOUNT != WORKER_IDENTITY`
`WORKER_IDENTITY != AUTHORITY`

A worker is eligible for assignment only when identity/profile is ACTIVE and unexpired, sponsor/purpose/capability class are applicable, provider binding if any is current, privacy envelope is applicable, and assignment/evidence scope is explicit.

A worker becomes authorized for a consequential effect only through a separately valid Authority Lease + Sentinel decision. Replacement never inherits predecessor lease/generation by default.

## 28. Capability Router

The accepted `CognitionRouter` becomes a broader `CapabilityRouter`; it remains a decision function, not a planner or authority owner.

`CapabilityRouteRequest`:
`route_request_id, objective_ref, subproblem_ref, role_scope, risk_constraints, privacy_requirements, required_capabilities, latency_constraint nullable, resource_constraint nullable, evidence_contract, authority_posture, allowed_runtime_placements`.

`CapabilityRouteDecision`:
`route_decision_id, route_request_id, selected_qualification_id, provider/model refs nullable, reasoning_profile, toolset_digest, procedure_refs, worker_class nullable, runtime_placement, evidence_contract, rationale_evidence_refs, authority_effect=NONE`.

Eligibility requires exact role/scope qualification `ADMITTED`, nonexpired/nondemoted qualification, privacy/runtime compatibility, compatible tools/procedures, and caller-supplied risk/resource constraints.

If no candidate satisfies all constraints: `ROUTE_UNAVAILABLE`.

Preserve:
`ROUTING_SELECTION != AUTHORITY`
`BEST_BENCHMARK != AUTOMATIC_SELECTION`
`CHEAPEST_ROUTE != SAFE_ROUTE`

The Router does not create objectives, alter Current, grant leases, widen tool scope or invent missing cost/risk policy. Pilot 001 needs only a deterministic local route seam; no live provider routing is required.

## 29. Continuous Capability Qualification

Capability qualification extends `CapabilityProcedure`, `LearningRecord`, IEF and Personal BIRE—not a second capability truth system.

Canonical identity is `capability_candidate_id`; qualification is exact `candidate + role_scope + evaluation_population + version`.

Dimensions, where applicable: outcome quality, reliability, authority/privacy compliance, evidence/provenance quality, recovery, cost/resource burden, latency, Aaron mechanical burden, adversarial/falsifier performance and held-out transfer/generalization.

Rules:
- external benchmark evidence may be input but cannot alone set `ADMITTED`;
- comparator is the admitted qualification for the same role/scope;
- qualification for role A never transfers to role B;
- expiration or DEMOTED removes routing eligibility;
- supersession preserves history;
- admission to routing grants zero authority.

Pilot 001 implements schema/types/local fixtures only, not a continuous production evaluation service.

## 30. Portable Skills / Procedures

No parallel Skill Current is created.

Existing `capability_procedure` is the portable procedure primitive, extended additively with context requirements, evidence expectations, compatibility constraints, provenance refs, supersession and retirement.

Preserve:
`SKILL != MODEL`
`SKILL_AVAILABILITY != AUTHORITY`
`SKILL_LOADED != QUALIFIED_FOR_CURRENT_OBJECTIVE`

A procedure may be routed only when its qualification is applicable, it is not retired/superseded, required tools/context/privacy/authority constraints are satisfiable, and selected capability qualification declares compatibility.

Loading a procedure cannot grant tool/effect authority. Provider/model replacement may reuse a procedure only when compatibility/qualification remains valid; otherwise routing fails closed.

## 31. Selective Perception / Presence Without Surveillance

Lifecycle:
`SENSOR_AVAILABLE != PERCEIVED_EVENT != RELEVANT_OBSERVATION != QUALIFIED_EVIDENCE != PERMITTED_PERSISTENCE`

`SelectiveObservationEnvelope`:
`observation_id, device_identity_id, source_identity_ref, modality, observed_at, transient_payload_ref, provenance_refs, privacy_constraints, relevance_state, persistence_disposition, retention_expires_at nullable, evidence_qualification_refs`.

`relevance_state`: `UNASSESSED|IRRELEVANT|RELEVANT|UNKNOWN`.
`persistence_disposition`: `EPHEMERAL_DROP|EPHEMERAL_WORKING|EVIDENCE_CANDIDATE`.

Rules:
- sensor availability alone persists nothing;
- pre-ingest/local filtering is preferred where feasible;
- `EPHEMERAL_WORKING` expires and is not canonical evidence;
- only `EVIDENCE_CANDIDATE` may enter existing evidence qualification;
- canonical evidence promotion requires independent provenance/privacy/applicability qualification;
- no observation writes Current directly;
- device authentication establishes device provenance only, never Aaron identity/truth/authority;
- continuous raw audio/video/location persistence is prohibited as a default.

Pilot 001 implements types/pure validation only; no live sensors.

## 32. Batch 3 — Human-end-state recalibration

This is a governing product constraint, not a new subsystem set.

**North Star:** Aaron can live his life rather than administer it.  
**Governing outcome:** Aaron gets freer, not busier.

The architecture is therefore judged not only by technical capability but by whether it can eventually support a Personal Office / Chief-of-Staff end state: IRIS can understand Aaron's evolving situation, protect his attention, manage objectives and obligations, coordinate workers, prepare decisions/actions, surface opportunities/threats when decision-relevant, act only inside earned authority, verify outcomes, learn, and remain quiet when Aaron is not needed.

These future capabilities MUST reuse existing canonical primitives and MUST NOT create a second Current, observer brain, planner brain, relationship-truth store, resource-optimizer authority, or autonomous authority layer.

Permanent separations:
`INFERENCE != FACT`
`PREDICTED_DESIRE != CURRENT_DECISION`
`PREDICTED_NEED != ACTUAL_NEED`
`SENSED_NEED != AUTHORITY`
`AWARENESS != SURVEILLANCE`
`TASK_COMPLETION != OBJECTIVE_COMPLETION`
`AVAILABLE_ATTENTION != PERMISSION_TO_INTERRUPT`
`RELATIONSHIP_MODEL != TRUTH_ABOUT_ANOTHER_PERSON`
`INFERRED_MOTIVE != FACT`
`OPPORTUNITY_DETECTED != OPPORTUNITY_QUALIFIED`
`THREAT_DETECTED != THREAT_CONFIRMED`
`PREPARED_ACTION != AUTHORIZED_ACTION`
`REPEATED_SUCCESS != UNLIMITED_AUTHORITY`

### 32.1 Aaron State Modeling
Classification: `DOCUMENTARY_EXTENSION_POINT_ONLY`.

Future Aaron-state projection extends OrientationState / Aaron Current / Objective / Obligation / qualified evidence. It is derived, noncanonical, and every projected field must carry fact-vs-inference classification, provenance, freshness and uncertainty.

`AARON_STATE_PROJECTION != NEW_AARON_CURRENT`.

Candidate dimensions may include priorities, commitments, time constraints, attention, legitimately observed energy/cognitive-load signals, resource/capital constraints, relationship commitments and competing objectives.

### 32.2 Need / Intent Anticipation
Classification: `DOCUMENTARY_EXTENSION_POINT_ONLY`.

Predictions may justify future nonconsequential preparation only inside separately admitted scope. They cannot create decisions, objectives, authority or effect permission.

### 32.3 Attention & Interruption Intelligence
Classification: `DOCUMENTARY_EXTENSION_POINT_ONLY`.

Future attention logic may rank or schedule surfacing of already-qualified Pilot-001 interventions using urgency, consequence, reversibility, freshness, Aaron-required status, interruption cost, delay cost and coverage confidence.

It MUST NOT:
- suppress a known consequential Aaron-required item;
- convert available attention into permission to interrupt;
- create a competing alert brain;
- count silence as successful omission when coverage is incomplete.

### 32.4 Objective Stewardship
Classification: `ALREADY_SATISFIED`.

Existing Objective / Obligation / Work Episode semantics remain canonical. Future stalled-objective, forgotten-obligation, conflict, nonproductive-activity and changed-assumption detectors may emit evidence or candidate obligations, but may not rewrite Aaron's objectives from inference.

### 32.5 Personal Resource Arbitration
Classification: `DOCUMENTARY_EXTENSION_POINT_ONLY`.

Future multi-resource reasoning may consider time, attention, cognitive-load evidence, money/capital, relationship capital, optionality, friction, risk and opportunity cost. It remains recommendation/preparation only and cannot override explicit objectives, Current, privacy, authority or reserved decisions.

### 32.6 Opportunity / Threat Radar
Classification: `DOCUMENTARY_EXTENSION_POINT_ONLY`.

Future chain:
`sense -> investigate -> qualify -> compare to Aaron Current/objectives -> prepare -> surface when decision-relevant`.

Detection never equals qualification and the system must avoid ambient alert spam.

### 32.7 Social & Relationship Intelligence
Classification: `DOCUMENTARY_EXTENSION_POINT_ONLY`.

Future relationship models are privacy-governed, evidence-bounded projections. They carry provenance, uncertainty and applicability and cannot become canonical truth about another person merely from model interpretation.

### 32.8 Graduated / Earned Autonomy
Classification: `DOCUMENTARY_EXTENSION_POINT_ONLY`.

Future progression:
`OBSERVE -> RECOMMEND -> PREPARE -> REQUEST_APPROVAL -> EXECUTE_BOUNDED_ACTION -> STANDING_AUTHORITY_WHERE_SEPARATELY_EARNED`.

Prepared work is never authorized work. Capability performance may inform an admission review, but only accepted authority-policy / generation / lease semantics can grant authority.

### 32.9 Presence Without Surveillance
Classification: `EXTEND_EXISTING_PRIMITIVE`.

Selective Perception in §31 is the governing seam. The architecture supports contextual presence without making continuous raw audio/video/location persistence the default.

### 32.10 Pilot 001 containment
Pilot 001 remains exactly **What needs Aaron?**

Batch 3 adds no implementation requirements for:
- continuous ambient perception;
- Aaron State engine;
- anticipation engine;
- attention arbiter;
- resource optimizer;
- opportunity/threat radar;
- relationship intelligence;
- graduated-autonomy runtime.

Pilot 001 only preserves future-safe interfaces through its existing Objective/Obligation, coverage, evidence, authority and output semantics.

## 33. Addendum 002 proof obligations

Existing T01–T80 remain unchanged. Add:

Workflow durability:
T81 provider session disappears; qualified workflow checkpoint remains usable.
T82 tentative provider state cannot be admitted as qualified checkpoint.
T83 replacement worker resumes qualified zero-effect checkpoint only.
T84 unresolved effect survives restart and yields RECONCILIATION_REQUIRED.
T85 effectful step is never blindly replayed from workflow checkpoint.

Worker identity:
T86 provider/model substitution does not alter institutional worker identity.
T87 successor worker receives no predecessor authority.
T88 expired/revoked worker fails assignment/lease validation closed.

Capability Router:
T89 routing decision has `authority_effect=NONE`.
T90 unqualified/expired/demoted capability cannot receive qualified responsibility.
T91 privacy/risk constraints defeat a cheaper/faster incompatible candidate.

Capability Qualification:
T92 benchmark evidence alone cannot set ADMITTED.
T93 role-specific qualification cannot leak to another role.
T94 DEMOTED/EXPIRED qualification is not route-eligible and history remains auditable.

Portable procedures:
T95 loading procedure grants no tool/authority access.
T96 superseded/retired/unqualified procedure is rejected.
T97 provider substitution either preserves explicit compatibility/qualification or fails route.

Selective perception:
T98 available sensor produces no automatic persistence.
T99 EPHEMERAL_WORKING observation expires and does not become evidence.
T100 unqualified observation cannot become evidence/Current.
T101 authenticated/trusted device cannot prove Aaron identity/truth/authority.

No operational tests are added for documentary-only human-end-state extension points.

## 34. Final maturity

A competent Builder can implement Pilot 001 plus local zero-effect identity/Authority-Lease/Sentinel and Addendum-002 interface proofs without inventing consequential semantics. Workflow durability is fully specified but remains a future zero-effect-worker primitive; Pilot 001 implements only its interface/pure validation seam.

Final IBA disposition:
`IRIS_PERSISTENT_PERSONAL_AGENT_TRANSITION_BLUEPRINT_READY / PILOT_001_WHAT_NEEDS_AARON_BUILDER_READY / ZERO_AUTHORITY`
