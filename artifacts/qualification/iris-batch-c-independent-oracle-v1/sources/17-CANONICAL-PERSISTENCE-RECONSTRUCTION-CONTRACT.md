# 17 — Canonical Persistence / Reconstruction Contract

This expands A5.

## Repository API

CanonicalRepository is a semantic interface, not a storage container.

Queries:
principal-scoped; as-of aware; version/freshness aware; immutable return values; explicit evidence/coverage; no mutable live references.

Commands:
validated identity/principal/schema/version; expected prior version/fence; evidence/provenance; temporal validity; authorized transition; transactional append/update semantics.

Memory and Postgres implementations must pass the same repository conformance suite.

## Schema

All canonical tables/types declare schema_version or an equivalent explicit decoder version.
Database constraints enforce required keys/values including NULL/missing-key behavior.
Domain enum translations are explicit and total.
Snapshot import/export validates schema/domain and relation referential integrity.

## Current

Current is a derived as-of view over canonical history, not “row with no effective_to” or latest ingestion.
Correction/supersession/revocation/expiry are first-class.
Historical reconstruction excludes future-known facts.

## Reconstruction evidence

Cold successor with no predecessor conversation reconstructs, as applicable:
principal/identity; objective/purpose; Current and evidence basis; open and terminal obligations/resolutions; unresolved/ambiguous effects; authority and explicit non-authority; privacy restrictions/retention; revocations; continuation owner/fence; resource/budget conditions; waits/wakes; next safe action; A1 unknown/stale/conflict/coverage state.

Provider recovery/session memory/workflow hydration may supply evidence but cannot outrank canonical reconstruction.

## Continuity admission

Admission is a staged evidence decision over the reconstructed model, not a single unresolved-effect boolean.
Mandatory dimensions include principal, schema/Current validity, unresolved effects, continuation ownership, authority/privacy, temporal freshness, required obligations and evidence coverage.

Foundation and transition callers use the same reconstruction/admission reducer.

## Projection persistence

Verified projection operation persists:
run_id distinct from content_hash; exact as-of/snapshot bracket; load-bearing dependency identities/versions/expiry; all SourceEvaluation/item dispositions including unknown/terminal/privacy; audit/provenance; output content hash.

A pure renderer cannot self-assert completeness without the verified repository capability.

## Workflow durability

QualifiedCheckpoint binds workflow/step/payload identity, evidence/qualification refs, effect/replay class, continuation owner, supersession/expiry and digest.
Resume is a classification from the proof object; a label alone is insufficient.

## Recurrence proof

Common memory/SQL/cold-process assertions; malformed snapshot; expiry-only invalidation; identical concurrent projection runs; dependency-version change; unresolved verification; predecessor/successor overlap; stale/superseded checkpoint.
