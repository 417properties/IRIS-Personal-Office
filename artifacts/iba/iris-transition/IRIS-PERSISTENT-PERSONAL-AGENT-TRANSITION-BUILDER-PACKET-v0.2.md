# IRIS Persistent Personal Agent Transition — Builder Packet v0.2

**Parent:** `IRIS-PERSISTENT-PERSONAL-AGENT-TRANSITION-BUILDER-READY-BLUEPRINT-v0.2.md`  
**Source baseline:** `bee076c69290922bfe141b9603763ac943619dfe`  
**Status:** DOCUMENTARY BUILDER PACKET ONLY / NO IMPLEMENTATION AUTHORITY  
**Target:** `PILOT_001_WHAT_NEEDS_AARON / ZERO_AUTHORITY`

## 1. Future implementation identity

If separately released by Strata 8.1, create:
`candidate/iris-persistent-personal-agent-transition-v0-1`
from exactly `bee076c69290922bfe141b9603763ac943619dfe`.

Do not modify PR #1.

## 2. Exact source delta

Create:
- migrations `005_agent_transition_identity_authority.sql`, `006_pilot001_projection.sql`;
- `src/agent-transition/identity.ts`, `authority-lease.ts`, `sentinel.ts`, `persistent-objective-runtime.ts`, `capabilities.ts`, `transition-repository.ts`, `pilot001-types.ts`, `pilot001-coverage.ts`, `pilot001-classifier.ts`, `pilot001-projection.ts`, `pilot001-metrics.ts`, `ambient-ingress.ts`, `research-worker.ts`;
- Addendum-002 bounded seams: `workflow-durability.ts`, `capability-router.ts`, `capability-qualification.ts`, `portable-procedure.ts`, `selective-perception.ts`;
- corresponding `tests/agent-transition/**` for identity, authority, sentinel, runtime, classification, coverage, concurrency, metrics, ambient, BIG separation, research worker, workflow durability, capability routing/qualification, portable procedures and selective perception;
- local Builder return and T01–T101 test summary in `evidence/`.

The Addendum seams are types/pure logic/local fixtures only in Pilot 001. Do not create a live durable-worker service, live provider router, continuous evaluation platform or sensor runtime.

Do not edit migrations 001–004.

## 3. Migration 005

Create tables:
`agent_identity, identity_binding, worker_identity_profile, worker_assignment, obligation_governance, decision_requirement, authority_generation_state, authority_generation_event, authority_lease, authority_lease_state, sentinel_release_attempt, capability_candidate, capability_qualification`.

Add nullable/version-safe columns to existing `capability_procedure`:
`context_requirements, evidence_expectations, compatibility_constraints, provenance_refs, supersedes_capability_id, retired_at`.

Implement exact fields/relationships/constraints from parent Blueprint §§2–4, §8 and §§27–30:
identity non-reuse; governed worker sponsor/purpose/capability/privacy/credential-boundary metadata; explicit provider/device/protocol bindings; worker replacement; one Current authority generation per deterministic domain; immutable generation history; immutable lease issuance; append/version lease state; one release attempt per intent; no credential-value column; role-specific capability qualification; no automatic authority from qualification/procedure loading.

## 4. Migration 006

Create:
`projection_coverage_contract, projection_source_requirement, pilot001_projection_run, pilot001_source_evaluation, pilot001_projection_item`.

Seed only:
`PILOT001_IRIS_PLUS_QUALIFIED_BIG_V0_1`
with parent Blueprint required surfaces, freshness rules and exclusions. Seed no credentials or live provider IDs.

## 5. Identity

Implement issuance/replacement/retirement for AARON/IRIS/WORKER/PROVIDER/DEVICE/PROTOCOL identities.

For workers also implement `worker_identity_profile` validation:
sponsor, purpose, worker/capability class, authority/privacy envelope, credential-boundary reference, provider binding, audit lineage, activation/expiry, revocation generation and predecessor/successor lineage.

Reject ID reuse, provider/model/session inference as worker identity, wrong principal, expired/revoked worker assignment, retired identity lease issuance, successor reuse of predecessor identity, and any inferred authority from worker identity/profile.

No provider calls.

## 6. Authority Lease

Implement:
`issueLease`, `readCurrentGeneration`, `validateLease`, `revokeAuthorityDomain`, `reauthorizeAuthorityDomain`, `replaceWorker`.

Lease validation binds principal, IRIS, worker, work+causal episode, capability, tool, operation, privacy, policy IDs/versions, generation, lease state, expiry, basis refs and unresolved-effect state.

Load-bearing UNKNOWN => invalid/HOLD.

No real standing authority in Pilot 001.

## 7. Sentinel

Implement local deterministic:
`prepareReleaseAttempt`
`validateAndRelease(prepared,fakeEffectAdapter)`
`recoverPreparedAttempt`.

Algorithm:
1. durable PREPARED;
2. begin transaction and lock exact authority-generation row;
3. revalidate Current generation/lease/worker/episode/policies/privacy/tool/intent/effect state;
4. invalid/UNKNOWN => no adapter call;
5. while lock held invoke deterministic fake adapter;
6. adapter request submission is linearization point;
7. release lock after bounded submission classification, not eventual effect completion;
8. known submit => RELEASED_SUBMITTED;
9. ambiguity/crash/timeout => RECONCILIATION_REQUIRED;
10. no blind retry.

No live broker, credential or consequential provider adapter.

## 8. Persistent Objective Runtime

Reuse accepted C0–C3 Objective/Obligation/Work Episode/evidence/intent/receipt/effect semantics.
Worker output is evidence only, never Current.
Replacement/restart preserves obligations and unresolved effects.
Provider recovery != Persistent Continuity.

## 9. Capability surface

Implement internal read/projection:
`get_objectives`, `get_open_obligations`, `get_aaron_required_items`.

Do not implement live BIG access. Read already-qualified `big_delta_quarantine`/evidence only.

Interface/documentary only:
`query_big_navigator`, `submit_evidence`, `prepare_action`, `request_authority`, `verify_effect`.

No MCP server required. Any protocol adapter grants zero IRIS authority.

## 10. Pilot AR classifier

AR-1: open applicable Aaron decision requirement not already resolved/superseded.
AR-2: open applicable Aaron-owned concrete action obligation.
AR-3: open applicable reserved-authority need with Aaron authority/no valid exact Current delegation.
AR-4: open applicable material conflict/unresolved effect/reserved ambiguity/incompatible instruction requiring Aaron judgment.

One intervention may contain multiple classes.

Never classify solely from Aaron mention/principal/importance/informational recipient.

## 11. Intervention identity / conflict

`arq_<sha256("pilot001-intervention-v1"|principal_id|resolution_kind|sorted_exact_anchor_refs)>`.

Allowed anchors: objective, obligation, decision_requirement, intent, deterministic conflict.

Consolidate only exact same principal + resolution_kind + exact anchor set.
Uncertain duplicate remains distinct/marked.
Conflicts never overwrite and material conflict prevents COMPLETE.

## 12. Coverage engine

PostgreSQL `REPEATABLE READ`.

Default required surfaces:
objectives; obligations; obligation governance; decision requirements; authority generation/lease state; unresolved intents/effects; relevant Current Assertions; qualified BIG quarantine/evidence.

External packets require evaluable freshness/applicability; missing freshness contract blocks COMPLETE.

Completeness enum exactly:
`COMPLETE_FOR_DECLARED_SCOPE | INCOMPLETE_COVERAGE | CONFLICTED_COVERAGE | UNKNOWN_COVERAGE`.

`AARON_RELEVANCE_UNKNOWN` is item-level.

End-bracket load-bearing IDs/versions/generations/digests. One change => rerun once. Second instability => UNKNOWN_COVERAGE.

## 13. Output

Implement all parent Blueprint §15 fields. Presentation/tests may not suppress declared scope, completeness, exclusions, required items/classes/refs/reasons/provenance/freshness/uncertainty, coverage gaps, conflicts, privacy exclusions, justified omissions or AARON_RELEVANCE_UNKNOWN.

## 14. Metrics

Weights: C1=1, C2=4, C3=16, C4=64.

Safety: C3/C4 misses 0; weighted miss 0.000; recall 1.000; justified-omission precision 1.000; positive provenance 1.000; cross-principal leakage 0; false COMPLETE 0; abstention credited as omission 0; incomplete credited as success/compression 0.

Utility only after safety: excess interruption <=0.25; AMIR <=0.80× independent baseline; compression >=2.0 on COMPLETE runs.

Reference set must be independently supplied.

## 15. Ambient / research worker

Ambient: types + pure validation only. Trusted device proves provenance only; no Aaron identity, truth, authority or Current; no live adapters.

Research worker: types/local fixture only; `external_effect_count=0`; result evidence only; no Current mutation.


## 16. Addendum 002 bounded implementation seams

### 16.1 Workflow durability
Implement types + pure validation only from parent §26.
No workflow tables in Pilot 001. No long-running worker service.
Required local rules: only QUALIFIED_WORKFLOW checkpoint resumable; TENTATIVE_PROVIDER state not qualified; replacement worker uses new identity; unresolved effect => RECONCILIATION_REQUIRED; effectful step never automatically replayed.

### 16.2 Capability Router
Implement pure deterministic candidate filtering/selection over fixture candidates.
Inputs/outputs exactly parent §28. No live model/provider invocation.
Only ADMITTED exact-role candidate eligible; privacy/risk/runtime constraints dominate price/latency; no candidate => ROUTE_UNAVAILABLE; authority_effect always NONE.

### 16.3 Capability Qualification
Implement schema/types/local fixtures only. No continuous production evaluator.
External benchmark alone cannot ADMIT. Qualification is role-specific, expiring/demotable and evidence-linked.

### 16.4 Portable procedure
Implement adapter/validator over existing CapabilityProcedure plus migration-005 extension fields.
Loading/availability never grants tools or authority.

### 16.5 Selective perception
Implement types/pure validation only. No live sensors.
Sensor availability does not persist. EPHEMERAL_WORKING expires. Only EVIDENCE_CANDIDATE may enter existing evidence qualification, and never Current directly.

### 16.6 Batch-3 human-end-state seams
Do not implement Aaron State engine, anticipation engine, attention arbiter, resource optimizer, opportunity/threat radar, relationship engine or graduated-autonomy runtime.

Preserve the governing product target:
- Aaron can live his life rather than administer it.
- Aaron gets freer, not busier.

Preserve:
`INFERENCE != FACT`
`PREDICTED_DESIRE != CURRENT_DECISION`
`SENSED_NEED != AUTHORITY`
`AWARENESS != SURVEILLANCE`
`AVAILABLE_ATTENTION != PERMISSION_TO_INTERRUPT`
`RELATIONSHIP_MODEL != TRUTH_ABOUT_ANOTHER_PERSON`
`OPPORTUNITY_DETECTED != OPPORTUNITY_QUALIFIED`
`PREPARED_ACTION != AUTHORIZED_ACTION`
`REPEATED_SUCCESS != UNLIMITED_AUTHORITY`.

Pilot 001 remains exactly `What needs Aaron?`. These are documentary extension seams only; no operational tests or runtime implementation are required in Pilot 001.

## 17. Proof matrix

Implement parent T01–T101 without renumbering. Every proof emits:
`proof_id, invariant, fixture, expected, observed, status, source_head, evidence_ref`.

T01–T80 preserve the existing matrix. T81–T101 cover workflow durability, governed worker identity, Capability Router, Capability Qualification, portable procedures and selective perception exactly as parent §33.

No operational tests are required for documentary-only human-end-state extension points.

## 18. Commands

`npm test`
`npm run check`
`node --experimental-strip-types --test tests/agent-transition/*.test.ts`
`git diff --check bee076c69290922bfe141b9603763ac943619dfe..<HEAD>`
`git diff --name-only bee076c69290922bfe141b9603763ac943619dfe..<HEAD>`.

Emit `evidence/PILOT001-TEST-SUMMARY.json`.

## 19. Required zero-effect return

PR #1 modified=NO.
Provider credentials bound=0.
Live external-effect calls=0.
BIG mutations=0.
Deployment mutations=0.
Persistent Continuity activation=0.
Standing authority grants=0.
Commerce/payment/representation effects=0.
Ambient canonicalizations=0.

Any nonzero value is outside scope.

## 20. Builder disposition

Exactly one:
`IRIS_PERSISTENT_PERSONAL_AGENT_TRANSITION_CANDIDATE_CONSTRUCTED_AND_LOCALLY_VERIFIED / INDEPENDENT_ACCEPTANCE_REQUIRED`
or `BUILDER_HOLD_<EXACT_FALSIFIER>`
or `BLUEPRINT_RETURN_REQUIRED_<EXACT_MISSING_DECISION>`.

No self-promotion.

## 21. Authority ceiling

This packet does not release Builder execution by itself.

Preserve:
`ZERO_AUTHORITY / IRIS_PR1_UNCHANGED / IRIS_NOT_OPERATIONALLY_PROMOTED / CONTINUITY_OFF / NO_EXTERNAL_EFFECT_AUTHORITY / NO_STANDING_AUTHORITY / NO_COMMERCE_AUTHORITY / NO_AMBIENT_CANONICALIZATION / NO_DEPLOYMENT / BIG_ACTIVATION_NOT_AUTHORIZED`.
