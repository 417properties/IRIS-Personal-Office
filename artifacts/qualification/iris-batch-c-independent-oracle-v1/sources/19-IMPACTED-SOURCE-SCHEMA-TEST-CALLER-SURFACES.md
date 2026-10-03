# 19 — Exact Impacted Source / Schema / Test / Caller Surfaces

Audit source identity is the sealed report commit ef7fea887729f9e2a1864990eaa2fb1da15135ce. Paths below are candidate paths recorded in the sealed SOURCE-INVENTORY.

## Schema
- candidate/db/migrations/001_iris_core.sql
- 002_work_episode.sql
- 003_action_effect.sql
- 004_instrumentation.sql
- 005_agent_transition_identity_authority.sql
- 006_pilot001_projection.sql

## Canonical state / runtime
- candidate/src/state/repository.ts
- candidate/src/state/postgres-repository.ts
- candidate/src/state/continuity-admission.ts
- candidate/src/state/migrations.ts
- candidate/src/runtime/episode-controller.ts
- candidate/src/runtime/cognition-router.ts
- foundational orient/policy/runBoundedCircuit callers identified by D05-D08
- candidate/src/tools/verification.ts

## Transition / Pilot
- candidate/src/agent-transition/pilot001-types.ts
- pilot001-classifier.ts
- pilot001-coverage.ts
- pilot001-projection.ts
- transition-repository.ts
- persistent-objective-runtime.ts
- authority-lease.ts
- sentinel.ts
- workflow-durability.ts
- selective-perception.ts
- capabilities.ts
- portable-procedure.ts
- candidate/src/domain/capability-procedure.ts
- candidate/src/domain/effect-verification.ts
- candidate/src/platform/managed-capabilities.ts

## Required caller inventory for Batch B

Before modification, enumerate every import/call of:
Current reads/publishCurrent; authority/policy evaluation; runBoundedCircuit/executor; retryDisposition; verifyFixtureEffect/effect verification; continuation claim; lease issue/validation; sentinel release; reconstruction/continuity admission; buildProjection/evaluateCoverage/classifyAaron; workflow resume; capability routing/admission; selective perception/persistence.

A helper is not repaired until every reachable caller either uses the common semantic seam or is retired.

## Named tests/proofs requiring revalidation

Audit explicitly identifies:
- candidate/tests/agent-transition/authority-lease.test.ts
- persistent-objective-runtime.test.ts
- pilot001-coverage.test.ts
- pilot001-repository-bracket.test.ts
- portable-procedure.test.ts
- selective-perception.test.ts
- sentinel.test.ts
- workflow-durability.test.ts
- post-E3 classification/consolidation tests cited in D02/D04
- foundational T08–T17, T21, T26/T27, T69–T71, T75–T80, T86, T91, T101
- schema/table-name/README structural checks
- historical Builder count summaries and narrow acceptance receipts.

## Surface ownership

IBA owns semantic mapping only.
DEV/Builder owns implementation changes.
Independent oracle owner owns expected behavior/proof.
Professor/STRATA owns assurance scope and acceptance.

No existing test expectation is grandfathered where it conflicts with Batch-A semantics.
