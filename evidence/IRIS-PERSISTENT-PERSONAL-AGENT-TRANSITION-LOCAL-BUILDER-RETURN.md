# IRIS Pilot 001 — required-source flag bypass correction return

Prior held head: `9d396e00e4611bc87a329009f614e75d4d98e318`

Professor recheck HOLD: PR #4 comment `5881062954`.

## Bounded correction

The frozen v0.4 source contract owns the required-source set. Caller-supplied `SourceEvaluation.required` can no longer narrow that contract.

- immutable required identities derive from `REQUIRED_SOURCE_REQUIREMENT_IDS`;
- all eight required identities are evaluated unconditionally;
- `required:false` on a required identity fails closed;
- principal, identity, applicability, presence, freshness, partiality and provenance checks apply regardless of the caller's narrowing attempt;
- exact Professor negative control with all eight IDs present but `required:false` and invalid facts now fails COMPLETE and cannot produce justified omission.

## Proof

- Pilot suite: **86/86 PASS**
- Full repository: **165/165 PASS**
- Static/schema: **PASS**
- Strict TypeScript on candidate `src/agent-transition/**`: **PASS**
- PostgreSQL-WASM PGlite 0.5.8 + pgcrypto: migrations 001–006 **PASS**; 35 tables; all 18 required transition/Pilot tables present; required capability-procedure extensions present; default coverage contract exactly once.
- Frozen Phase E1 inputs: **32/32 executed**
- Population digest: `969c448021389502bcf4f689d7b7cea5d526fde250cbe264f9f8b1f3d6aee980`
- Governing labels consumed: **0**
- Governing labels created: **0**
- E1 scoring performed: **NO**

## Authority

`READ_ONLY / NONCONSEQUENTIAL / ZERO_EXTERNAL_EFFECT / ZERO_AUTHORITY`

No merge, deployment, credentials, Persistent Continuity activation, standing authority, commerce, representation, ambient canonicalization, or self-acceptance.

Next owner after publication: fresh independent exact-head safety/semantic acceptor.
