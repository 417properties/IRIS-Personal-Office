# IRIS Pilot 001 Adjudication Protocol v0.1

Status: **FROZEN PRE-BUILDER / ZERO AUTHORITY**

Governing documentary object: `417properties/IRIS-Personal-Office@cda075e0137571aaf9fcb4b752ce0085d361e0cb`

This protocol governs Professor's post-candidate adjudication of the frozen input population. It creates no labels before the exact V0 candidate head is frozen. The adjudicator must remain blind to candidate outputs until the governing labels are published.

## 1. Fixed sequencing

`CASE_POPULATION_FROZEN_BEFORE_BUILD`

`V0_BUILD_AND_EXACT_HEAD_FREEZE`

`LABEL_ADJUDICATOR_BLIND_TO_CANDIDATE_OUTPUTS_UNTIL_LABEL_PUBLICATION`

`PROFESSOR_ADJUDICATES_FROZEN_INPUTS`

`LABELS_PUBLISH`

`INDEPENDENT_SCORING`

Builder implementation, reference-set adjudication, and final metric evaluation remain separate roles.

## 2. Evidence precedence and general rule

Adjudicate only from the frozen case input, its provenance references, and the already-frozen Pilot 001 semantics. Do not infer missing state from narrative plausibility. Authentication, provider completion, mention, principal identity, or importance is not equivalent to an Aaron-required intervention.

For every determination record: case ID, evaluated predicate, evidence fields, source/provenance references, uncertainty, and disposition.

## 3. Principal applicability

1. Verify the projection principal is exactly the declared principal.
2. Verify each candidate record's principal identity independently.
3. A record belonging to another principal is excluded from the Aaron projection unless an explicit bounded cross-principal packet authorizes the exact fields and purpose.
4. Privacy exclusion is recorded as privacy enforcement, never as successful relevance filtering.
5. Unknown or conflicting principal identity prevents justified omission and may prevent a complete projection.

## 4. Source identity and applicability

For every required source class, establish source ID, system, identity status, applicability, and provenance. A source is usable only if its identity is verified and its applicability is APPLICABLE or its inapplicability is proven. UNKNOWN identity or applicability is load-bearing uncertainty; it cannot be converted to absence.

## 5. Freshness

Apply the declared freshness rule to each applicable source at the fixture time. CURRENT evidence may support inclusion or omission. STALE or UNKNOWN freshness cannot justify exclusion. If a stale source is required, coverage is INCOMPLETE unless another qualified Current source supplies the same governed predicate.

## 6. Declared-scope sufficiency

Use the frozen declared scope, required source classes, identity boundary, included domains, and explicit exclusions. A source or domain may be omitted only through a recorded, supported exclusion or proven inapplicability. A runtime or evaluator may not narrow scope because data is missing, inconvenient, or unfavorable.

## 7. Projection Coverage Contract

Adjudicate exactly one projection completeness state:

- `COMPLETE_FOR_DECLARED_SCOPE`: all required sources are present or proven inapplicable; freshness, applicability, identity, and provenance are sufficient; required objective, obligation, authority, and effect surfaces are available; no material conflict or load-bearing UNKNOWN remains; and the dependency bracket is stable.
- `INCOMPLETE_COVERAGE`: a known required source or surface is missing, stale, inaccessible, or partially insufficient.
- `CONFLICTED_COVERAGE`: required state exists but a material unresolved conflict prevents a coherent projection.
- `UNKNOWN_COVERAGE`: coverage cannot be established because identity, applicability, freshness, or the dependency bracket remains unknown or repeatedly unstable.

`INCOMPLETE_COVERAGE => NO_COMPLETE_OMISSION_CLAIM`

`ABSENCE_FROM_AARON_REQUIRED_SET != PROVEN_IRRELEVANT`

## 8. Obligation owner

Determine owner from the canonical obligation input, not from who is mentioned, receives the packet, or is principal. Unknown or conflicting ownership is retained as UNKNOWN. Ownership alone is never a decision requirement or authority grant.

## 9. Decision-maker

A decision-maker is the identity explicitly bound to an open/applicable decision requirement. Aaron is not the decision-maker merely because he is principal, owner, recipient, or authority holder.

## 10. Authority holder and reserved authority

Determine the applicable authority holder, reserved-authority class, Current delegation/lease match, generation, and status. Provider/tool possession and past delegation do not establish Current authority. If holder, generation, or matching Current authority is UNKNOWN or conflicting, preserve uncertainty and fail closed for omission and consequential action.

## 11. Escalation requirement

An escalation exists only when an applicable open item has an explicit unresolved escalation target/state or a material conflict, consequential-effect uncertainty, or authority/privacy ambiguity whose governing semantics require principal judgment. Informational routing alone is not escalation.

## 12. AR predicate adjudication

Evaluate each predicate independently and retain all predicates that apply:

- `AR-1 — EXPLICIT_AARON_DECISION_REQUIRED`: an open/applicable decision requirement exists; Aaron is the decision-maker; and no resolving or superseding decision exists.
- `AR-2 — AARON_OWNED_ACTION_REQUIRED`: an open, in-progress, or waiting applicable obligation is owned by Aaron; a concrete principal action remains; and the obligation is not satisfied, superseded, abandoned, or informational-only.
- `AR-3 — RESERVED_AUTHORITY_REQUIRED`: an applicable/open required next step has a reserved-authority class with Aaron as authority holder, or no valid matching Current delegation/lease exists.
- `AR-4 — AARON_ESCALATION_REQUIRED`: an applicable/open item is blocked by a material canonical conflict, unresolved consequential effect, reserved privacy/authority ambiguity, or incompatible instruction requiring Aaron judgment.

Aaron mention, Aaron-as-principal, informational receipt, importance, provider request, or general relevance is insufficient.

## 13. Overlapping predicates and canonical intervention

Multiple AR predicates may describe one canonical intervention. Preserve every predicate, then consolidate only when principal, resolution kind, and exact canonical anchor set match. Do not suppress risk or provenance during consolidation.

## 14. Duplicate identity

Use deterministic anchors only: canonical objective, obligation, decision-requirement, intent, or conflict identity. Exact anchor identity may consolidate records. Different expression with the same anchor may consolidate. Semantic similarity without shared canonical identity is insufficient. Distinct anchors remain distinct. Uncertain duplicate identity remains explicit and unmerged.

## 15. Conflict treatment

Recognized material conflict classes include `INCOMPATIBLE_OBLIGATIONS`, `INCOMPATIBLE_CURRENT_STATE`, `AUTHORITY_CONFLICT`, `EFFECT_REALITY_CONFLICT`, `SOURCE_IDENTITY_CONFLICT`, and `POSSIBLE_DUPLICATE_UNRESOLVED`. Never overwrite or choose silently. Material unresolved conflict prevents complete coverage and cannot justify omission; where Aaron judgment is required, evaluate AR-4.

## 16. UNKNOWN and partial evidence

A known item whose Aaron relevance cannot be determined is labeled `AARON_RELEVANCE_UNKNOWN`; it does not disappear. Partial evidence may support positive inclusion when the predicate is fully supported, but cannot support exclusion unless every missing dimension is proven irrelevant. UNKNOWN is not a negative label, success, or omission.

## 17. Justified omission

Omission is justified only when principal applicability, source identity/applicability, freshness, ownership, decision-maker, authority, escalation, effect/reconciliation state, duplicates, conflicts, provenance, and declared-scope coverage are sufficient to establish that no AR predicate applies. Stale, partial, missing, conflicting, or UNKNOWN load-bearing state cannot justify omission.

## 18. Consequence classification

Assign one consequence class from evidence, after AR/omission adjudication:

- `C1`, weight 1: routine, bounded, reversible.
- `C2`, weight 4: material objective-delay, privacy, or coordination consequence.
- `C3`, weight 16: reserved authority, unresolved consequential effect, or material escalation.
- `C4`, weight 64: legal, financial, safety, or irreversible classification supported by explicit evidence.

Use the highest supported class. Do not infer C4 from importance language, and do not lower a class because evidence is inconvenient. If the class is material but unsupported, abstain/HOLD rather than fabricate.

## 19. Provenance requirements

Every positive predicate, omission, coverage state, duplicate decision, conflict disposition, and consequence class must cite exact frozen input fields and provenance references. Unattributed narrative is insufficient. A qualified BIG-derived packet is evidence only within its explicit field and purpose boundary.

## 20. Evaluator abstention and HOLD

Abstain on an item when a required predicate cannot be resolved without inventing evidence. Return a population-level HOLD when missing, conflicting, or UNKNOWN evidence would prevent immutable, auditable governing labels; when frozen inputs are malformed or not self-contained; when the population identity fails; or when evaluator blindness has been breached. Never tune labels to candidate behavior.

## 21. Dependency-bracket rule

Record the initial dependency digest. If the bracket changes once, rerun adjudication once using the same frozen rules. If it changes again or cannot be stabilized, adjudicate `UNKNOWN_COVERAGE`; do not silently narrow scope.

## 22. Authority ceiling

This protocol grants no implementation, merge, deployment, provider, credential, external-effect, standing-authority, continuity, commerce, operational-promotion, or BIG Activation authority. PR #1 remains unchanged.

