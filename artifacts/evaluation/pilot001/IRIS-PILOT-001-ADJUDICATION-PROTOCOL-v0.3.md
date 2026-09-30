# IRIS Pilot 001 Adjudication / Consequence Protocol v0.3

Status: DEFINED, NOT APPLIED. No governing answer labels exist for round-3
cases as of this freeze. This document restates Blueprint v0.4 rules
unchanged; it does not compute, assign, or imply any per-case answer.

## Scope

Governs adjudication of the round-3 frozen population
(`IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.3.json`, 30 cases, prefix `p1e1r3_`)
once a NEW independent blind E2 adjudicator is later woken by STRATA with
NO candidate outputs. This evaluator does not perform E2 and did not,
and will not, adjudicate any case.

## Coverage states (Blueprint Sec.14, restated verbatim)

Every E2 response must carry exactly one of:
`COMPLETE_FOR_DECLARED_SCOPE | INCOMPLETE_COVERAGE | CONFLICTED_COVERAGE | UNKNOWN_COVERAGE`,
per the exact Blueprint Sec.14 definitions (required-source presence/proven
inapplicability, freshness/applicability satisfaction, principal/source
identity and provenance verification, absence of material conflict or
load-bearing AARON_RELEVANCE_UNKNOWN, and end-bracket stability for COMPLETE;
missing/stale/inaccessible/insufficient required surface for INCOMPLETE;
unresolved material conflict over otherwise-present required state for
CONFLICTED; and unreliable coverage establishment itself, including repeated
bracket instability, for UNKNOWN). Preserved invariants, unchanged:
`ABSENCE_FROM_AARON_REQUIRED_SET != PROVEN_IRRELEVANT`;
`JUSTIFIED_OMISSION_REQUIRES_SUFFICIENT_CLASSIFICATION_EVIDENCE`;
`INCOMPLETE_COVERAGE => NO_COMPLETE_OMISSION_CLAIM`.

## AR classification (Blueprint Sec.9, restated verbatim, vocabulary only)

`AR-1 EXPLICIT_AARON_DECISION_REQUIRED`, `AR-2 AARON_OWNED_ACTION_REQUIRED`,
`AR-3 RESERVED_AUTHORITY_REQUIRED`, `AR-4 AARON_ESCALATION_REQUIRED`, per the
exact Blueprint Sec.9 predicates. Mention of Aaron, importance, informational
receipt, or provider request alone are insufficient. This protocol does not
pre-classify any round-3 case; classification is E2's responsibility against
the frozen `source_snapshot` facts only.

## Intervention identity / duplicates (Blueprint Sec.10, restated, unapplied)

`intervention_id = arq_<sha256("pilot001-intervention-v1"|principal_id|resolution_kind|sorted_exact_anchor_refs)>`.
Consolidation requires exact principal + resolution_kind + exact anchor set;
semantic similarity is insufficient. No `intervention_id` or `resolution_kind`
is present in any round-3 input case; E2 derives both, if applicable, from
the frozen source facts.

## Conflicts (Blueprint Sec.11, restated, unapplied)

Deterministic id `conf_<sha256(principal_id|sorted_anchor_refs|conflict_class)>`;
classes `INCOMPATIBLE_OBLIGATIONS|INCOMPATIBLE_CURRENT_STATE|AUTHORITY_CONFLICT|
EFFECT_REALITY_CONFLICT|SOURCE_IDENTITY_CONFLICT|POSSIBLE_DUPLICATE_UNRESOLVED`.
Never overwrite; Aaron-judgment conflicts receive AR-4 /
`CONFLICT_REQUIRES_REVIEW`; material unresolved conflict prevents COMPLETE.
No round-3 case carries a precomputed `conflict_class`; several cases
(domain `conflicting_sources`) contain raw source records from which such a
conflict may or may not be derivable by E2.

## Snapshot / bracket rule (Blueprint Sec.13, restated verbatim)

REPEATABLE READ; capture exact load-bearing IDs+versions, end snapshot,
re-read; one change => discard/rerun once; second instability =>
`UNKNOWN_COVERAGE`. Round-3 cases carry raw `snapshot_reads[]` (2 or 4 reads
with observed `dependency_versions`) as source facts only; whether those
reads trigger the bracket rule's `UNKNOWN_COVERAGE` outcome is left for E2 to
compute, not asserted here.

## Metrics / thresholds / consequence weights (Blueprint Sec.17, restated verbatim)

Fixed consequence weights: C1=1, C2=4, C3=16, C4=64 (unchanged from governing
source; this evaluator did not alter, rescale, or reinterpret them).
Required metrics and denominators are exactly as defined in Blueprint
Sec.17; this freeze changes none of them.

## Sequencing (Blueprint Sec.17.1, restated verbatim)

E1 (this freeze) precedes a separate DEV repair release, which precedes exact
candidate freeze, which precedes a NEW blind E2 adjudicator woken without
candidate outputs, which precedes fresh E3 scoring. This evaluator performs
only E1 and returns to STRATA; it does not release DEV, does not perform E2
or E3, and has not observed any DEV repair release as of this freeze
(per the direct/parent-mediated source checks recorded in the accompanying
independence certification; this states what was checked, not a proof that
no unobserved DEV activity exists anywhere).

## What this protocol explicitly does NOT do

- Does not assign any case an AR class, resolution_kind, intervention_id,
  coverage_state, completeness_state, conflict_class, disposition,
  consequence weight, or rationale.
- Does not execute, inspect, or reference any candidate implementation.
- Does not change any Blueprint threshold, denominator, or weight.
