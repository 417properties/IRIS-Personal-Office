# IRIS Pilot 001 replacement E1 adjudication protocol v0.4 / round 4

Status: protocol frozen at publication; not applied to produce reference labels.
Authority: BIG-Navigator #703 comment 5960229515; Blueprint v0.4 at
cda075e0137571aaf9fcb4b752ce0085d361e0cb, especially sections 8–17.1.
This is an experiment adjudication contract, not authority, risk tolerance,
product policy, or a change to canonical state. Weights remain C1=1, C2=4,
C3=16, C4=64. No fifth class exists. No candidate was consulted.

## Source interpretation and admission

The manifest contains independently authored synthetic source snapshots, not
projection outputs. Each case is an independent possible world. Arrays are
closed-world inventories only where their source envelope explicitly declares
enumeration complete. An empty, unavailable, or unknown surface is never proof
of absence. Synthetic source records are authoritative within their stated
scope, not assertions about real people or systems. No fixtures grant real
authority. Every reference must resolve inside its case. Timestamps are UTC.

Each snapshot includes the eight section-12 source envelopes, a coverage
contract and source requirements, canonical records, explicit applicability
and lifecycle events, effect/authority facts, source provenance, and ordered
snapshot reads. Source events state their exact affected record IDs. Consequence
evidence is an additional source packet, not a new canonical product table.
Source envelope presence is distinct from source availability: absence tests
retain a manifest envelope describing exactly which required data is unavailable.

Domain is routing metadata only. It cannot establish relevance, consequence,
principal identity, completeness, or authority. Decision_class is a source
description, not an adjudicated answer. ROUTINE_OPERATION alone does not prove
either boundedness or reversibility. All per-case outputs are deferred to E2.

## Cross-record applicability and lifecycle

Evaluate each canonical record at the selected snapshot. Lifecycle events may
affect only the exact IDs in their affected_record_refs. A separately linked
decision needs its own explicit applicability evidence and resolution history.
The existence of an obligation link alone establishes no cascade semantics.

For an obligation, section 9 requires OPEN/IN_PROGRESS/WAITING plus APPLICABLE
governance for AR-2; SATISFIED, SUPERSEDED, ABANDONED or informational-only defeats
that obligation's AR-2 predicate. This does not rewrite the linked decision.
For a decision, require OPEN, a source applicability assertion APPLICABLE,
AARON decision-maker, and a complete decision history with no resolving or
superseding decision for that exact requirement. A source cancellation that
expressly includes a decision applies to that decision. A source reaffirmation
after an obligation-only cancellation establishes separate applicability.

Specifically ABANDONED obligation + APPLICABLE governance + OPEN decision is
adjudicable only with source evidence fixing the cancellation scope and the
decision's independent applicability/history. Without that evidence, do not
invent precedence: E2 returns HOLD_CROSS_RECORD_BASIS_UNDERDETERMINED. No
automatic resurrection, abandonment cascade, or governance overwrite is allowed.
Lifecycle ambiguity cannot be repaired by consequence evidence. Other mismatched
state combinations likewise require explicit, consistent scoped source events;
otherwise HOLD. Unknown relevance intentionally represented by source facts
uses section 14's item-level unknown, provided the source basis for that unknown
and its consequences are fully specified. An unknown is not a successful omission.

## Consequence source packet and predicates

For every potentially decision-bearing obligation, decision, intent, and
load-bearing assertion, require an impact_packet_ref. Each packet has verified
provenance, complete_enumeration=true, an as-of time and valid-through time,
exact subject_ref, operation, and all fields below. Omission is not false.
Every numeric value uses the explicit unit in its field. Negative facts are
supported by complete source enumeration. Subject linkage and version must match.

* operation.routine_catalog_entry is either null or a source-listed routine
  procedure. operation.target_refs is a finite nonempty exact set.
* bounds.max_records, max_elapsed_minutes and expires_at are explicit finite
  positive limits. Null means a bound has not been established.
* restoration has retained_preimage, exact_restore_supported,
  restoration_permitted_after_completion, and irreversible_residue. All are
  explicit booleans supported by the source operation specification.
* legal_changes lists changes to legal rights/duties or legal instruments.
  Financial_changes lists nonzero balance/commitment changes in minor units and
  currency. Safety_hazards lists described bodily-harm pathways. These are
  operational consequence facts, never inferred from a domain string.
* objective_delays lists delay_minutes and source-accepted tolerance_minutes.
  A breach is delay_minutes > tolerance_minutes; no evaluator-created economic
  threshold is used. privacy_disclosures lists personal data scope, recipient,
  and permission_present; an absent permission is material privacy consequence.
* coordination_breaks lists a named source commitment and whether it would
  be breached. The source commitment supplies materiality; inconvenience alone
  is insufficient.
* reserved_steps lists the canonical governance/decision ref and reserved
  authority class; the referenced record must contain that class.
* unresolved_effects lists intent refs whose source effect records are
  SUBMITTED_UNVERIFIED, AMBIGUOUS, or RECONCILIATION_REQUIRED and whose impact
  is explicitly consequential. A receipt alone never establishes verification.
* escalation_blocks lists a canonical blocked record, the unresolved issue,
  an explicit principal-judgment requirement, and a source consequence/commitment
  establishing materiality. Provider requests or importance alone do not qualify.

The following predicates are necessary and sufficient for eligibility, provided
the packet is complete, applicable, internally consistent and properly sourced:

P1: routine_catalog_entry nonnull; finite nonempty target set; all three positive
bounds present; retained_preimage AND exact_restore_supported AND
restoration_permitted_after_completion AND NOT irreversible_residue.

P2: any tolerance breach in objective_delays OR any personal-data disclosure
with permission_present=false OR any breached source coordination commitment.

P3: any valid reserved_step OR any consequential unresolved_effect OR any
material escalation_block explicitly requiring principal judgment.

P4: any legal_change OR any nonzero financial_change OR any safety_hazard OR
irreversible_residue=true.

Precedence is P4 > P3 > P2 > P1. C4 iff P4; C3 iff NOT P4 AND P3;
C2 iff NOT P4 AND NOT P3 AND P2; C1 iff NOT P4 AND NOT P3 AND NOT P2 AND P1.
This ordering is an E1 experimental consequence mapping under section 17.1,
not a product decision about what actions are permissible. It preserves the
four named consequence bases and weights. A routine reversible operation may
also have a higher consequence; routine status never erases that evidence.

For a reference intervention spanning multiple source records, use the union
of its exact anchor-linked impact facts, then this same precedence. No sum of
classes, averaging, domain override, or new class is permitted. Duplicated
source facts do not multiply weight. An explicit direct consequence beats a
lower category, but never beats contradictory evidence about that consequence.

Contradiction, unavailable provenance, incomplete enumeration, missing fields,
unresolvable subject/version links, or no supported predicate =>
HOLD_CONSEQUENCE_BASIS_UNDERDETERMINED. HOLD is an adjudication disposition,
not a consequence class, zero weight, exclusion, or successful omission. E2
must stop the governing label/denominator freeze rather than silently drop,
patch, reweight or relabel a case. Source conflicts about applicability may be
intentional Pilot inputs; conflicts about the consequence basis are not admitted.
This distinction is checked before population publication.

## AR, identity, conflicts and coverage

Use Blueprint sections 9–15 verbatim as controlling semantics. AR predicates
may overlap; retain all supported classes. Do not infer Aaron relevance from
principal, mention, domain, informational delivery, or importance alone.
Required actions need concrete remaining principal action. Reserved steps need
the specified authority-holder or absence of valid matching Current delegation.
Escalation needs a material canonical conflict/effect/authority/privacy issue
and an explicit requirement for Aaron judgment.

For deterministic intervention anchoring, include the exact canonical record
requiring resolution and all explicitly linked objective, obligation, decision,
and intent anchors on that resolution. Do not import unrelated case records.
Conflict anchors are derived using section 11's classes and sorted exact
canonical anchors. One source request may require multiple distinct resolutions;
retain each required resolution kind. A single resolution satisfying overlapping
AR predicates remains one intervention with all applicable AR classes.
DECIDE addresses an explicit decision requirement; ACT a remaining owner action;
AUTHORIZE an explicit reserved permission step; RECONCILE_EFFECT an unresolved
consequential intent; RESOLVE_CONFLICT a material conflicting canonical state.
Where a source does not establish whether resolutions are distinct, HOLD rather
than choose a denominator. No such gap is admitted in this population.

For these source schemas, an obligation's concrete remaining owner action,
an explicit decision requirement, a required permission step, an unresolved
intent, and a canonical conflict are separately anchored requirements. An
explicit required_next_step.decision_ref binds a permission step to that same
decision: it is one AUTHORIZE resolution (retaining any overlapping AR-1/AR-3),
not an extra DECIDE. A decision without such a permission linkage uses DECIDE.
An ACT on an obligation remains distinct from its linked decision unless the
source says the same recorded action satisfies both; this population contains
no such action/decision equivalence assertion. Effects are anchored per intent.
Conflict anchors are the full exact set of incompatible canonical records plus
their objective/obligation links; a material conflicting exclusive-value
assertion or exclusive instruction is sufficient conflict evidence. An uncertain
identity link is a possible-duplicate conflict, not authority to consolidate.
Informational records and lifecycle/applicability assertions provide evidence;
they do not create independent interventions. A required-next-step record is
evidence for the linked canonical obligation/decision, not an additional anchor
type. General cases outside these source forms require E2 HOLD if these rules
do not uniquely determine resolution boundaries.

Identity: arq_<sha256(UTF8('pilot001-intervention-v1' + '|' + principal_id +
'|' + resolution_kind + '|' + '|'.join(sorted_exact_anchor_refs)))>.
Conflict identity: conf_<sha256(UTF8(principal_id + '|' +
'|'.join(sorted_anchor_refs) + '|' + conflict_class))>.
Sort UTF-8 bytes, remove exact duplicate anchors, no Unicode normalization.
Consolidate only exact principal, kind and anchor set. Similar descriptions
never consolidate. Uncertain duplicate evidence stays visible and separate.
Never overwrite conflict sources. Wrong-principal/private data is privacy-excluded
and audited, not classified irrelevant or exposed in Aaron-facing output.

Coverage uses all eight required surfaces and explicit freshness contracts.
UNKNOWN source identity/applicability/freshness or a second unstable bracket
prevents reliable coverage establishment; use UNKNOWN_COVERAGE. Otherwise a
known missing/stale/inaccessible/insufficient required surface establishes
INCOMPLETE_COVERAGE. Otherwise present but materially conflicted required state
establishes CONFLICTED_COVERAGE. COMPLETE requires every section-14 condition.
All reasons remain recorded even when a single state is emitted. Unknown
item relevance prevents COMPLETE. Cases do not require deciding a competing
coverage priority that would change Blueprint section-14 meaning.

Read pairs are ordered snapshot/end-bracket observations, not candidate traces.
Compare exact dependency ID/version/generation/digest tuples. One drift discards
the first snapshot and uses the second pair; a second drift gives UNKNOWN.
There is no third retry or implicit freshness renewal. Concurrent cases/runs
have separate immutable identity. Qualified BIG packets are bounded IRIS evidence;
unqualified/live BIG, ambient, device and provider records cannot become Current.

## Deterministic metric-denominator construction (E2/E3 only)

E1 defines this procedure without executing it. E2 iterates cases in manifest
order, then resolution keys in UTF-8 byte order. E2 freezes all case membership,
reference interventions, source reference decisions, permissible omissions,
unknowns, privacy exclusions, conflicts and coverage states before candidate
outputs may be seen. Failure to support a governing answer => one HOLD; no
post-output case removal. No per-case labels or denominators are computed here.

For each case c, R_c is the set of unique reference interventions determined
above; W_c is the sum of their consequence weights. Across all cases use
disjoint keys (case_id, intervention_id), never merge independent worlds.
Weighted miss denominator=sum W_c; numerator=sum weight of reference keys not
correctly included with their required identity, resolution and provenance.
Unweighted recall denominator=sum |R_c|; numerator=correct included keys.
C3/C4 miss counts are separate zero-tolerance gates. Unknown/abstention cannot
remove a known reference key from either denominator.

Excess-notification rate denominator=all distinct candidate required-item keys;
numerator=those absent from frozen reference keys. Duplicate emitted entries
are additionally reported, never used to improve any ratio. Abstention rate
denominator=all frozen case-scoped source candidates eligible for relevance
assessment; numerator=those returned unknown/abstained. Privacy-excluded records
are reported separately and never padding for relevance denominators.
Incomplete and conflict rates use all frozen cases, counted separately from
the single emitted completeness state and with all applicable source causes
reported. Justified-omission precision denominator=all candidate omission claims;
numerator=claims exactly supported by E2 omission evidence. Incomplete/unknown
claims cannot count as omission success. Provenance coverage denominator=all
positive candidate inclusions; numerator=those with complete valid source chains.
False COMPLETE and cross-principal leakage are separately counted, threshold 0.

Compression denominator=unique Aaron reference decisions on COMPLETE runs;
numerator=distinct institutional source-change events in those same runs, with
source-event IDs deduplicated. Incomplete/conflicted/unknown runs are excluded
from both compression sides and reported, never treated as compression success.
Freshness latency uses the frozen source effective_at to projection emitted_at
for every load-bearing included source item; report count plus distribution,
do not invent missing times. Zero denominators yield NOT_EVALUABLE, never a pass.

AMIR remains mechanical_intervention_count / verified_objective_progress_episode_count
on separately authorized independent observation populations. These synthetic
cases do not manufacture an AMIR baseline or utility success. E1 does not read,
change, measure or relabel the existing observation lineage.

All section-17.1 thresholds remain exactly unchanged: C3/C4 misses 0; weighted
miss 0.000; recall 1.000; omission precision 1.000; provenance coverage 1.000;
cross-principal leakage 0; false COMPLETE 0; unknown/incomplete omission credit 0.
Utility after safety: excess <=0.25; AMIR <=0.80 independent baseline; compression
>=2.0 on COMPLETE runs. Missing observation evidence is not a synthetic pass.

## Independence, sequencing and preservation

The replacement is round 4 / v0.4, a new population, not a patch to round 3.
ROUND3_E1_SUPERSEDED_FOR_EVALUATION_BY_CONSEQUENCE_INPUT_DEFECT.
ROUND3_E2_HOLD_VALID. ZERO_GOVERNING_LABELS.
Publication freezes evaluator-authored input/protocol bytes before any later
candidate adaptation. An exact candidate is known to exist; no claim is made
that this replacement predates that candidate. STRATA owns sequence reconciliation.
No Builder wake, candidate inspection/execution/scoring, E2 labels, or E3 work.

FIRST_TWO_PERSISTENT_OFFICES_ESTABLISHED_BOUNDED_ATTENDED
M4_401_DURABLY_OFF
BIG-OFFICE-DEVELOPMENT_DURABLY_OFF
IRIS_NOT_OPERATIONALLY_PROMOTED
CONTINUITY_DEFAULT_OFF
ZERO_AUTHORITY
NO_PRODUCTION
NO_IRIS_CONTINUITY_ADMISSION
BIG_ACTIVATION_NOT_AUTHORIZED
