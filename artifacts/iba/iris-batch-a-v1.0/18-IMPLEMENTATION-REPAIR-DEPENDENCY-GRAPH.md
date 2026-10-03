# 18 — Implementation Repair Dependency Graph

Goal: repair the causal classes once, in dependency order, without reopening 20 serial patches.

## Batch B minimum coherent implementation batches

### B1 — Shared Semantic Kernel
Implements only shared A1/A2/A4 state algebra, exact relation/identity primitives, temporal/as-of primitives and semantic validators.
Outputs: versioned domain types, runtime validation, transition reducers, explicit representation maps.
Closes prerequisites for D01-D04/D07/D12/D19.

### B2 — Canonical Domain / Schema / Repository
Depends B1.
Align migrations 001–006, domain DTOs, memory repository and Postgres repository with A5 and artifact 13.
Outputs: immutable principal/as-of queries, validated commands, schema/domain round-trip, canonical reconstruction API.
Closes D11/D12 and enables D09/D15/D16.

### B3 — Authority / Continuation / One-Time Effect Enforcement
Depends B1+B2.
Implements A3, continuation compare-and-transfer fence, ActionIntent/ReleaseAttempt state machine and total lease validator.
All consequential callers route through the same release seam.
Closes D05/D06/D10/D13/D14.

### B4 — Verification / Reconciliation / Recovery / Projection
Depends B2+B3.
Implements effect disposition proof, objective reconciler, shared reconstruction/admission reducer, qualified workflow checkpoint, verified projection operation with snapshot/run audit.
Closes D07-D09/D15/D16.

### B5 — Capability / Perception / Routing / Communication Seams
Depends B1+B2 and consumes B3 authority boundary.
Unifies capability/procedure qualification, Functional Perception, selective observation/retention policy, Cognition Router eligibility-before-ranking, Nervous-System event envelope and minimum ICCP Canonical/Dense/Wire internal seams.
Closes D17/D18 and prevents second capability truth ontology.

### B6 — Pilot 001 / Personal-Office Integration Candidate
Depends B1-B5.
Rebuilds Pilot/transition adapter and candidate interface on the shared semantic kernel; root/disposition conservation; explicit resolution objects; no ID parsing/overconsolidation; coverage from the same A1 facts; exact snapshot proof.
Frozen replacement E1 remains unchanged unless a new source falsifier is separately adjudicated.
Closes D01-D04/D15 at the evaluation lane and integrates all repaired foundations.

## Batch C — Independent oracle / proof derivation

Runs in parallel after Batch-A freeze and before/alongside B implementation, but remains institutionally independent.
It derives expected behavior from this constitution and permitted source evidence, not candidate outputs/tests.
Produces legacy-proof dispositions and the whole-stack qualification oracle.

## Batch D — Consolidated whole-stack requalification

One coherent requalification across semantic kernel, repositories, effect path, recovery, routing/perception, Pilot and reconstruction. No narrow PASS can substitute for the whole-stack disposition.

## Batch E — Fresh independent acceptance

One newly admitted independent acceptance owner reviews the complete object after D. Historical audit is repair evidence, not clean-room acceptance.

## Dependency rule

No downstream batch may duplicate an upstream semantic reducer. If a downstream caller needs a new semantic choice, it routes back to the owning Batch-A contract instead of installing a local default.

## Rollback / preservation

Historical candidate, replacement E1, sealed audit and earned narrow evidence remain immutable lineage. Implementation occurs on new candidate baseline/branch. No merge/deploy/admission/continuity follows automatically.
