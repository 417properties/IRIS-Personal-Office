# 13 — Canonical Domain / State-Machine Contract

## Canonical semantic envelope

Every canonical aggregate/event/claim has, where material:
schema_version; object_type; object_id; principal_id; version; explicit relation refs; A1 epistemic coordinates; temporal/as-of coordinates; evidence/provenance; privacy class; authority refs when applicable; causal_occurrence_id when applicable; supersession/correction refs; created/recorded identity.

External/source representations may use different spelling, but adapters must map total admitted domains into this semantic model with no implicit case folding/defaulting.

## Lifecycle classes

Canonical lifecycle meaning is represented independently from external enums.

Objective/Obligation lifecycle classes:
NONTERMINAL | SATISFIED | SUPERSEDED | ABANDONED | UNKNOWN.
Legacy OPEN/ACTIVE/IN_PROGRESS/WAITING/HOLD/CLOSED tokens require an explicit versioned translation table; no token is silently treated as another terminal meaning.

Decision requirement:
OPEN | RESOLVED | SUPERSEDED | ABANDONED | UNKNOWN.

Applicability is separate from lifecycle:
APPLICABLE | NOT_APPLICABLE_PROVEN | SATISFIED | SUPERSEDED | ABANDONED | UNKNOWN.

Effect/reconciliation states are owned by artifact 16.

## Transition rules

- transitions are validated commands/events, not direct map/row mutation;
- terminal lifecycle cannot be reopened except via explicit correction/supersession with evidence and new version;
- decision lifecycle is independent from linked obligation lifecycle unless an event explicitly scopes to both;
- applicability/lifecycle events affect exact object refs only;
- required-next-step/evidence rows do not become independent roots unless the constitution declares their own canonical object identity;
- UNKNOWN/missing/unavailable never choose a positive terminal state.

## Root/disposition conservation

Every admitted attention/action/root candidate must end in exactly one visible disposition:
KNOWN_REQUIRED; RELEVANCE_UNKNOWN; TERMINAL_RETAINED; JUSTIFIED_NOT_APPLICABLE; PRIVACY_EXCLUDED; DEFERRED/SUPPRESSED_WITH_REACTIVATION; CONFLICT_HOLD; INVALID_REJECTED.

No silent drop path exists.

## Versioned representation boundary

Batch B must publish explicit bidirectional maps among:
domain types <-> repository command/query DTOs <-> SQL schema <-> reconstruction DTOs <-> Pilot/transition adapters.

Round-trip tests cover every admitted enum/state/UNKNOWN/privacy/identity value. Unsupported legacy state fails closed; E1 is not rewritten to resemble runtime.

## State-machine ownership

One semantic transition library/kernel owns lifecycle and A1 reduction rules. Callers may request transitions but may not reimplement the state machine.

D03/D08/D09/D11/D12 recurrence control: every caller crosses the same validated state-machine boundary and representation adapters are conformance-tested.
