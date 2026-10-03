# 01 — A1-A5 Constitutional Contracts

These five contracts form one semantic kernel. Implementations may factor code differently, but may not split meaning.

## A1 — Epistemic State Contract

Every material claim has independent coordinates:
- knowledge_state: KNOWN | UNKNOWN | MISSING | UNAVAILABLE | CONFLICTED | INVALID | REJECTED;
- applicability_state: APPLICABLE | NOT_APPLICABLE_PROVEN | SATISFIED | SUPERSEDED | ABANDONED | UNKNOWN;
- freshness_state: CURRENT_AS_OF | STALE | UNKNOWN;
- coverage_state: COMPLETE_FOR_DECLARED_SCOPE | INCOMPLETE | CONFLICTED | UNKNOWN;
- evidence_refs and as_of;
- invalidators/revalidation conditions where material.

Rules:
- fail-closed operational disposition does not convert UNKNOWN into FALSE, absent, or known-invalid;
- missing != unavailable != unknown != stale != conflict;
- terminal lifecycle does not erase historical truth;
- NOT_APPLICABLE requires proof, never mere absence;
- every admitted root/object has an explicit destination/disposition; silent disappearance is prohibited;
- coverage consumes the same item facts used by classification/decision, not a separately authored unknown predicate.

A1 closes the class behind D02, D03 and portions of D07/D09/D12/D15/D18.

## A2 — Identity / Resolution / Causal-Occurrence Contract

IDs are opaque, typed, stable and never semantically parsed.
Relationships are explicit edges, not reconstructed from string spelling, shared objective, proximity or convenient fields.

Required identities:
principal, objective, obligation, decision requirement, intent, release attempt, receipt, effect, verification, conflict, resolution object, Work Episode, continuation generation, worker/substrate incarnation, causal occurrence, projection run, communication event.

Resolution identity:
- every requested human/system resolution has an explicit resolution_id or source-proven resolution-equivalence relation;
- context_refs are distinct from identity anchors;
- consolidation requires exact proven equivalence; shared objective/class/holder does not suffice.

Causal occurrence:
- live execution, retry, replay, reconstruction and duplicate representations preserve one occurrence_id unless evidence proves a new independent occurrence;
- representation/event IDs never count as independent experience by themselves.

Continuation:
- one active continuation owner per causal episode;
- transfer is atomic compare-and-transfer with fencing generation/token;
- admitted successor makes predecessor unable to release new work.

A2 closes D01, D04, D10, D19 and identity portions of D06/D14/D15/D16.

## A3 — Authority / Capability / Privacy Contract

Capability, authority and privacy are independent.

CapabilityQualification binds exact subject/configuration, role, capability/procedure, population/evidence, validity and limitations.

AuthorityGrant/Lease binds:
principal/sponsor; subject/worker; purpose; object/scope; capability/tool/effect; consequence/value bounds; temporal validity; generation; delegation chain; revocation; privacy/disclosure class; resource bounds where material; evidence lineage; release/fencing identity.

Rules:
- cognition may propose capability; cognition cannot release capability;
- technical possession, credential possession, provider access, model intelligence, prior success, device permission, predicted preference, continuity or role do not create authority;
- denial/value/time/principal are first-class, not inferred from matching scope strings;
- all release checks are against one canonical validated authority snapshot at decision/release time;
- unknown authority is represented as unknown, never known absence;
- privacy has separate purpose, recipient, minimum-necessary, retention and egress authorization;
- qualified evidence does not imply permission to persist or disclose.

A3 closes D05, D13, authority aspects of D14/D17/D18 and temporal authority defects.

## A4 — Action / Effect / Lifecycle Contract

Permanent chain:
DECISION != INTENT != RELEASE_ATTEMPT != RECEIPT != EFFECT != VERIFICATION != RECONCILIATION.

Minimum effect states:
NO_SUBMISSION_PROVEN; SUBMISSION_KNOWN; EFFECT_VERIFIED; NO_EFFECT_VERIFIED; PARTIAL_EFFECT; AMBIGUOUS_EFFECT; CONFLICTED_EFFECT; RECONCILIATION_REQUIRED; UNKNOWN.

Rules:
- intent identity includes immutable operation/effect digest;
- exactly one durable release owner/attempt controls consequential submission;
- same intent ID with changed digest is invalid;
- ambiguous possible submission/effect forbids blind retry;
- retry is permitted only from source-backed retry class plus verified state;
- tool/provider success does not prove objective success;
- verification requires evidence appropriate to the claimed disposition; inequality cannot prove no effect;
- objective/obligation closure requires explicit closure criteria, relationship validity and reconciliation of all mandatory obligations/effects;
- terminal states may be corrected only by explicit correction/supersession event, never direct mutation.

A4 closes D06-D08, effect portions of D09/D14/D16 and supports D02/D03 conservation.

## A5 — Canonical State / Persistence / Reconstruction Contract

One canonical institutional truth contract spans domain types, schema, repository, runtime, projections, reconstruction and continuity admission.

Rules:
- canonical reads are immutable snapshots; no live mutable references;
- canonical writes are validated commands/events with principal, evidence, version and temporal checks;
- memory and SQL adapters implement the same conformance contract;
- every canonical type/schema carries explicit versioning/decoder ownership;
- Current is derived as-of a decision time from effective/supersession/revocation semantics, not from “latest row” or absent end-time;
- imported snapshots are schema/domain validated;
- projections are derived evidence-bearing artifacts, never Current;
- cold successor reconstruction must recover identity, objective, Current/evidence basis, obligations, terminal steps, unresolved effects, authority/non-authority, privacy restrictions, revocations, continuation owner/fence, resource conditions, next safe action and A1 states;
- continuity admission consumes reconstructed canonical evidence, not provider/session recovery.

A5 closes D09-D12, D15-D16 and persistence aspects of D06/D10/D14.

## Shared temporal binding

All A1-A5 apply artifact 07. “Current” and “valid” always mean current/valid AS OF an explicit cut.

## Shared conservation invariant

For every semantic object crossing a boundary:
source object -> exact identity -> qualified state -> explicit destination OR named HOLD.
No root, claim, authority fact, effect ambiguity or privacy restriction may disappear because a downstream type lacks a field.
