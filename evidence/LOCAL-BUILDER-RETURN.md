# IRIS C0-C3 Local Builder Return

Status: bounded nonproduction candidate evidence only.

## Construction
- Canonical IRIS domain/state kernel implemented.
- Work Episode identity and continuity admission implemented.
- Authority/privacy fail-closed gate implemented.
- Decision -> Intent -> Receipt -> Effect -> Verification separation implemented.
- Objective/obligation reconciliation implemented.
- BIG delta quarantine and separation implemented.
- Cognition router interface implemented without authority effect.
- Personal BIRE and IEF instrumentation hooks implemented.
- C4-C6 limited to interfaces/seams.

## Local evidence
- Full behavioral suite: 56/56 PASS.
- C2 fresh-process reconstruction: R1-R8 PASS in separate child processes with no predecessor session state.
- C3 positive circuit: PASS.
- C3 false-success negative control: PASS.
- Authority/privacy negatives: 8/8 PASS.
- Effect/retry fixtures: 6/6 PASS.
- Continuity/failure fixtures: 10/10 PASS.
- BIG separation: 6/6 PASS.
- Provider substitution: 4/4 PASS.
- Domain: 4/4 PASS.
- Schema static check: PASS, 17 required tables, four migrations.

## Resource/burden
- External model calls in tests: 0.
- Real external tool calls in tests: 0; C3 uses deterministic fixture adapter.
- Aaron mechanical interventions in tests: 0.
- Custom irreducible component classes: 8 (canonical state; Work Episode; authority/privacy; effect verification/reconciliation; objective/obligation; continuity admission; BIG delta quarantine; restrained learning).
- Managed/reused capability classes: durable workflow; model routing; typed tools/MCP; tracing; Postgres provider binding.

## Explicit UNKNOWN / unproven boundaries
- Live Neon provider adapter and provider-specific concurrency/recovery are not executed.
- Live Vercel Workflow/WorkflowAgent restart behavior is not executed.
- Live AI Gateway inference/fallback is not executed.
- Live MCP transport/auth against an external server is not executed.
- Real consequential external-effect verification is not executed.
- Production credential/security topology is not established.
- Production deployment does not exist.
- Persistent Continuity remains OFF.
- C4-C6 remain developmental seams only.

## Authority
IRIS_NOT_OPERATIONALLY_PROMOTED
CONTINUITY_OFF
BIG_ACTIVATION_NOT_AUTHORIZED
