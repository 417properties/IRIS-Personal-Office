# IRIS Persistent Personal Agent Transition — Builder-Ready Blueprint v0.1

**Institutional object:** `IRIS_PERSISTENT_PERSONAL_AGENT_TRANSITION_BLUEPRINT_V0_1`  
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
- Strata 8.1 acceptance/IBA release: `5860910437`.

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
- `src/agent-transition/{identity,authority-lease,sentinel,persistent-objective-runtime,capabilities,transition-repository,pilot001-types,pilot001-coverage,pilot001-classifier,pilot001-projection,pilot001-metrics,ambient-ingress,research-worker}.ts`
- `tests/agent-transition/{identity,authority-lease,sentinel,persistent-objective-runtime,pilot001-classification,pilot001-coverage,pilot001-concurrency,pilot001-metrics,ambient,big-separation,research-worker}.test.ts`
- `evidence/IRIS-PERSISTENT-PERSONAL-AGENT-TRANSITION-LOCAL-BUILDER-RETURN.md`
- `evidence/PILOT001-TEST-SUMMARY.json`.

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

### 2.3 worker_assignment

Fields:
`assignment_id PK, worker_identity_id FK, objective_id FK, obligation_id nullable, work_episode_id FK, causal_episode_id, assignment_generation, evidence_scope, effect_authority_class(ZERO_EXTERNAL_EFFECT|CONSEQUENTIAL_LEASE_REQUIRED), status, predecessor_assignment_id nullable, created_at, ended_at nullable, version`.

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
`agent_identity, identity_binding, worker_assignment, obligation_governance, decision_requirement, authority_generation_state, authority_generation_event, authority_lease, authority_lease_state, sentinel_release_attempt`.

Migration 006 creates:
`projection_coverage_contract, projection_source_requirement, pilot001_projection_run, pilot001_source_evaluation, pilot001_projection_item` and seeds only the deterministic default coverage contract; no credentials/provider IDs.

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

## 25. Final maturity

A competent Builder can implement Pilot 001 plus local zero-effect identity/Authority-Lease/Sentinel proofs without inventing consequential semantics.

Final IBA disposition:
`IRIS_PERSISTENT_PERSONAL_AGENT_TRANSITION_BLUEPRINT_READY / PILOT_001_WHAT_NEEDS_AARON_BUILDER_READY / ZERO_AUTHORITY`
