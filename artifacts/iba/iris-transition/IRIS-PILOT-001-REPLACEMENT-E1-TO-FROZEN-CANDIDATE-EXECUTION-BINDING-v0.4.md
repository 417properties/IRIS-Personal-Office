# IRIS Pilot 001 — Replacement-E1 to Frozen-Candidate Execution Binding v0.4

Disposition: `BINDING_CORRECTION_READY / UNAVAILABLE_REQUIRED_SURFACE_MAPPING_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
Authority: NONE

## 0. Bounded correction

Authorized by STRATA #703/5964454367 after independent v0.3 HOLD:
`BINDING_HOLD/PINNED_UNAVAILABLE_REQUIRED_SURFACE_REJECTED_BY_INHERITED_MAPPING`.

v0.3 self-identity correction remains fully normative. All v0.2/v0.3 semantics remain unchanged except the source-envelope availability reduction in v0.2 §5, superseded below.

Frozen candidate:
`185dbd1be80bd54c6cf5dcc085f105a637fe7e44 / af4808dc6c6db17ed7dc5cdd923fe5b9697c006a`.

Frozen replacement E1:
`849deca383add66773ab1ba0c8bc0ca852523c8f / fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4 / 40 / 32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f`.
Protocol SHA-256:
`619b28d8cc6fdd8048bdaeff2807a10f438349f1a7249f3701b209a7e786d66b`.

No E2 labels, candidate outputs, E3 results or scores were consumed.

## 1. Complete demonstrated availability-token audit

All 40 replacement cases / 320 required source envelopes were audited from the four pinned case shards.

Exact token counts:
- `PRESENT = 318`
- `UNKNOWN = 1`
- `UNAVAILABLE = 1`

The only UNAVAILABLE envelope is:
- case `p1e1r4_9f4b83c6c71644fd88451639fdf88db8`
- surface `qualified_big_packets`
- required by frozen eight-surface contract
- availability `UNAVAILABLE`
- enumeration_complete `false`
- principal_identity `AARON`
- provenance_verified `true`
- record_refs `[]`
- observed_at `2026-10-01T12:00:00Z`
- valid_through `2026-10-01T13:00:00Z`
- source_refs contains exact provenance source.

No broader availability token class is demonstrated.

## 2. Protocol semantics

Pinned protocol states:
- every snapshot contains the eight source envelopes;
- envelope presence is distinct from source availability;
- an absence test retains an envelope describing exactly which required data is unavailable;
- an empty, unavailable, or unknown surface is never proof of absence;
- closed-world inventory applies only when enumeration_complete=true;
- coverage: UNKNOWN source identity/applicability/freshness or second unstable bracket => UNKNOWN_COVERAGE;
- otherwise a known missing/stale/inaccessible/insufficient required surface => INCOMPLETE_COVERAGE.

Therefore UNAVAILABLE is not UNKNOWN and not PRESENT-empty.

## 3. Candidate-compatible deterministic reduction

For every required source envelope, first require the envelope itself to exist exactly once.

### PRESENT
Preserve v0.2 rule:
- present=true;
- principal/identity/provenance/freshness/applicability derived under unchanged v0.2 rules;
- partial=true iff enumeration incomplete or other exact partial/provenance rule requires it.

### UNKNOWN
Preserve v0.2 rule:
- present=false;
- identity=UNKNOWN;
- applicability=UNKNOWN;
- freshness=UNKNOWN;
- partial=true;
- provenance/principal fields still reflect exact envelope evidence where independently known, but UNKNOWN coverage cannot be upgraded by those fields.

### UNAVAILABLE — new frozen rule
UNAVAILABLE means: the required envelope is present as metadata, but the required source record inventory is inaccessible/unavailable and therefore cannot be treated as enumerated empty.

Map deterministically:
- `present=false`
- `principal_match = (principal_identity === "AARON")`
- `identity = VERIFIED` iff principal_identity=AARON AND provenance_verified=true; otherwise preserve the existing identity fail-closed reduction
- `applicability = APPLICABLE`
- `freshness` from the envelope's own observed_at/valid_through against selected snapshot time:
  - CURRENT iff observed_at <= selected read_at <= valid_through
  - STALE iff valid_through < selected read_at
  - UNKNOWN if time contract cannot be evaluated
- `provenance_ok = provenance_verified && every envelope source_ref resolves through the existing provenance rule`
- `partial=true`.

Why APPLICABLE is fixed: this is an immutable **required** source surface and UNAVAILABLE supplies no closed-world record inventory capable of proving the entire required surface inapplicable. Treating it INAPPLICABLE would invent a successful omission; treating it UNKNOWN would erase the protocol's explicit distinction between known inaccessible and unknown.

With exact demonstrated UNAVAILABLE envelope facts, the resulting SourceEvaluation is:
- source_id `pilot001:qualified_big_quarantine_evidence`
- required=true
- present=false
- principal_match=true
- identity=VERIFIED
- applicability=APPLICABLE
- freshness=CURRENT at the case's selected read
- provenance_ok=true
- partial=true.

The frozen candidate coverage evaluator therefore reaches `INCOMPLETE_COVERAGE` through its existing required-source rules. No candidate code changes.

### Any other availability token
Fail:
`BINDING_HOLD/UNMAPPED_SOURCE_AVAILABILITY_TOKEN`.

## 4. Distinctions that MUST survive

UNAVAILABLE MUST NOT be transformed into:
- PRESENT empty: present remains false and partial true;
- UNKNOWN: known principal/provenance/time facts remain represented and applicability is APPLICABLE;
- privacy exclusion: no unavailable record payload exists to expose/exclude; privacy rules still apply independently to any exact record/source facts;
- INAPPLICABLE: unavailable is not evidence the required surface is irrelevant;
- proven absence: enumeration_complete=false forbids closed-world absence;
- a candidate root or synthetic qualified-BIG record;
- an E2 consequence/omission fact.

No record is invented to fill the unavailable surface.

## 5. Score-changing-choice falsification closure

Potential discretionary choices are closed:
- unavailable vs unknown -> protocol distinguishes known inaccessible from unknown;
- unavailable vs empty -> enumeration incomplete + protocol says unavailable not proof of absence;
- applicability -> required surface remains APPLICABLE absent complete evidence proving whole-surface inapplicability;
- freshness -> exact envelope timestamps only;
- identity/provenance -> exact envelope principal/provenance only;
- coverage -> frozen candidate evaluator, not decoder policy;
- qualified-BIG candidate data -> none invented because record inventory unavailable.

Any future UNAVAILABLE envelope with malformed/ambiguous principal, provenance or time follows the same fail-closed field reduction; no score-derived choice is permitted.

## 6. Independence

This correction consumed only:
- pinned replacement-E1 envelopes/protocol;
- exact frozen candidate SourceEvaluation/coverage semantics;
- independent review falsifier;
- prior binding text.

Counters:
`labels_consumed=0`
`candidate_outputs_consumed=0`
`scoring=false`.

No E2 answer/reference/consequence class or E3 score informed the mapping.

## 7. Acceptance

Fresh independent exact-binding review must verify:
1. 320-envelope audit and exact token counts;
2. only one demonstrated UNAVAILABLE instance;
3. protocol distinction between unavailable/unknown/empty;
4. exact SourceEvaluation tuple for the demonstrated case;
5. frozen candidate yields INCOMPLETE_COVERAGE from that tuple without candidate modification;
6. no record/data invented;
7. v0.3 self-identity correction unchanged;
8. all unrelated binding semantics unchanged;
9. labels/output/scoring counters remain zero.

Required PASS:
`IRIS_PILOT_001_REPLACEMENT_E1_EXECUTION_BINDING_INDEPENDENT_ACCEPTANCE_PASS`
or one exact HOLD.

No execution release is granted.

Preserve:
`REPLACEMENT_E1_FROZEN / POST_REPLACEMENT_E1_CANDIDATE_REFREEZE_CLOSED / REPLACEMENT_E1_BLIND_E2_CLOSED / ROUND3_E2_HOLD_VALID_AS_HISTORICAL_EVIDENCE / IRIS_NOT_OPERATIONALLY_PROMOTED / CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_CONTINUITY_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED`.

Final:
`BINDING_CORRECTION_READY / UNAVAILABLE_REQUIRED_SURFACE_MAPPING_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
