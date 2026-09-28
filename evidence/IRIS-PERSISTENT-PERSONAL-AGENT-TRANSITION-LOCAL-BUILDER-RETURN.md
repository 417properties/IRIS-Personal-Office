# IRIS Pilot 001 — bounded Professor HOLD correction return

Prior reviewed head: `cca5f6bc5262ee4e0d6e9900a4b07f5666e2564a`

Professor HOLD: PR #4 comment `5880539944`.

## Bounded corrections
1. Required source coverage is now bound to all eight immutable `projection_source_requirement` identities from migration 006; omitted rows cannot yield COMPLETE and required principal mismatch fails closed.
2. Open Aaron-relevant decision requirements with unresolved decision-maker, and reserved-authority items with unresolved holder/delegation, classify as relevance UNKNOWN and cannot become justified omissions.
3. `PostgresTransitionProjectionRepository.buildConsistentProjection()` now performs the actual snapshot/end-bracket dependency comparison, discards and reruns once on drift, and returns UNKNOWN coverage after second instability. Projection dependency digest now includes all load-bearing sources/candidates/conflicts/privacy exclusions.
4. Exact canonical duplicate interventions are consolidated before persistence, preventing duplicate item identities.

## Proof
- Pilot suite: **85/85 PASS**
- Full repository: **164/164 PASS**
- Static/schema: **PASS**
- Strict TypeScript on candidate `src/agent-transition/**`: **PASS**
- PostgreSQL-WASM PGlite 0.5.8 + pgcrypto: migrations 001–006 **PASS**; 35 tables; all 18 required transition/Pilot tables present; required capability-procedure extensions present; default coverage contract exactly once.
- Frozen Phase E1 inputs: **32/32 executed**, population digest `969c448021389502bcf4f689d7b7cea5d526fde250cbe264f9f8b1f3d6aee980`.
- Governing labels consumed: **0**
- Governing labels created: **0**
- E1 scoring performed: **NO**

## Authority
`READ_ONLY / NONCONSEQUENTIAL / ZERO_EXTERNAL_EFFECT / ZERO_AUTHORITY`

No merge, deployment, credentials, Persistent Continuity activation, standing authority, commerce, representation, ambient canonicalization, or self-acceptance.

A fresh independent exact-head acceptor is required. The prior Professor reviewer is excluded from later blind governing-label adjudication because that reviewer inspected candidate behavior.
