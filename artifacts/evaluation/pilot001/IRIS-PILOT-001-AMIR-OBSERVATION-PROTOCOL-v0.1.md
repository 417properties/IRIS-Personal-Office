# IRIS Pilot 001 — Prospective AMIR Observation Protocol v0.1

**Status:** FROZEN BEFORE OBSERVATION / INDEPENDENT EVALUATOR / ZERO AUTHORITY  
**Governing documentary object:** `2fdadf9b73396d85623156fc766770db3cadfab8`  
**Metric:** Aaron Mechanical Intervention Rate (AMIR)  
**Observation start:** `2026-09-28T02:00:00Z` (`2026-09-27 21:00 America/Chicago`)  
**Evidence deadline:** `2026-10-12T02:00:00Z` (`2026-10-11 21:00 America/Chicago`)

## 1. Purpose and non-authority

Measure the pre-Pilot rate at which Aaron performs mechanical intervention in episodes that produce independently verifiable objective progress. This protocol does not implement or imitate Pilot 001, create labels, score a candidate, alter authority, or change operating behavior.

Preserve:

- `TASK_ACTIVITY != VERIFIED_OBJECTIVE_PROGRESS`
- `TASK_COMPLETION != OBJECTIVE_COMPLETION`
- `ZERO_AUTHORITY`
- `IRIS_PR1_UNCHANGED`
- `CONTINUITY_OFF`
- `NO_DEPLOYMENT`
- `BIG_ACTIVATION_NOT_AUTHORIZED`

## 2. Prospective sampling rule

The observation admits every eligible episode whose first qualifying evidence event occurs at or after the start instant and before the stop boundary. No episode may be selected because of its outcome or intervention count.

The sampling target is the first **12** episodes adjudicated as `VERIFIED_OBJECTIVE_PROGRESS_EPISODE` under this protocol. Observation ends when the twelfth qualifying episode is adjudicated. At that instant:

1. no new episode is admitted;
2. every already-admitted episode is retained;
3. still-open episodes are reported as nonqualifying/open-at-end unless later evidence already available at the boundary supports adjudication;
4. the population is frozen without extending or shortening the run based on observed AMIR.

If 12 qualifying episodes have not been adjudicated by the evidence deadline, return `AMIR_OBSERVATION_SAMPLE_INSUFFICIENT`. Do not extend the window.

Twelve qualifying episodes are sufficient only for a bounded Pilot baseline: the count reduces domination by a single episode while making no population-wide statistical claim. The baseline remains descriptive and must be recalibrated before broader operational use.

## 3. Observation surfaces and eligibility

Primary prospective surfaces:

- `417properties/IRIS-Personal-Office` Issue `#3`;
- `417properties/BIG-Navigator` Issue `#567`;
- `417properties/BIG-Navigator` Issue `#695`;
- authenticated conversation evidence for Aaron's active BIG/IRIS work when it can be captured with timestamp and content digest;
- immutable artifacts and provider-state evidence directly referenced by an admitted episode.

An episode is eligible when it is a bounded BIG/IRIS/Personal-Office work lineage that begins within the observation window and has an observable objective, blocker, gate, artifact, decision-state transition, or work-routing outcome. Episodes without Aaron intervention remain eligible. Pure social conversation, unrelated 417 Properties work, and activity without an identifiable objective lineage are excluded.

Cross-posts describing the same causal work episode are one episode, not multiple denominator units.

## 4. Immutable episode identity

Episode ID format:

`AMIR-E1-<first-16-hex-of-sha256("amir-observation-v1" | objective_or_work_lineage | first_evidence_ref)>`

The ID is assigned when the episode is first admitted and never reused. Later cross-posts become evidence aliases. Uncertain identity is not merged; it is marked `DUPLICATE_IDENTITY_UNKNOWN` pending adjudication.

## 5. Required episode record

Each admitted or nonadmitted observed episode records:

- episode ID and status;
- objective/work lineage;
- start and end instants;
- source systems and exact evidence references;
- admission rationale;
- progress claim and verification evidence;
- every observed Aaron interaction;
- intervention decomposition and primary class;
- conflicts, UNKNOWNs, and exclusions;
- evaluator disposition.

## 6. Verified objective progress

An episode enters the denominator only when evidence independently supports a bounded transition to a demonstrably more complete objective state, including a truthfully closed gate, verified artifact completion, resolved blocker, qualified decision-state advance, or equivalent objective progress.

The following are insufficient alone: activity, message transmission, claimed completion, provider success, artifact existence without acceptance/effect evidence, or a task marked done without objective-state evidence.

One causal progress transition is one denominator episode. Unrelated transitions may not be merged; one transition may not be split to improve AMIR.

## 7. Aaron intervention classes

Every observed Aaron action receives exactly one primary class:

- `MECHANICAL` — counts in the numerator; required only because the operating system failed to carry, reconstruct, route, reconcile, retrieve, follow up, or mechanically coordinate in-scope information/state.
- `RESERVED_PRINCIPAL_DECISION` — excluded from numerator.
- `PREFERENCE_JUDGMENT` — excluded.
- `AUTHORITY_DECISION` — excluded.
- `SIGNATURE_OR_ATTENDANCE` — excluded when intrinsically personal/legal/physical.
- `PRINCIPAL_ONLY_SUBSTANTIVE_ACT` — excluded.
- `OTHER_NONCOUNTED` — excluded with explicit rationale.
- `INTERVENTION_CLASSIFICATION_UNKNOWN` — neither counted nor treated as nonmechanical until resolved.

Speed, message length, or the fact that Aaron performed the action does not determine classification.

## 8. Mixed interventions

When evidence supports decomposition, separate mechanical context/routing/reconciliation work from a substantive or reserved decision within the same interaction. Each component receives its own evidence-bound intervention ID. If decomposition is not supportable, mark the interaction `INTERVENTION_CLASSIFICATION_UNKNOWN`; do not force a favorable classification.

## 9. Evidence requirements

Every numerator event and denominator event requires at least one exact evidence reference and a short causal explanation. Acceptable references include GitHub comment/commit/blob identities, immutable artifact identities, work-routing records, qualified provider-state evidence, or captured conversation evidence with timestamp plus SHA-256 of the preserved excerpt.

Inference from apparent inconvenience is not evidence of an Aaron intervention.

## 10. Conflict, UNKNOWN, and no-progress treatment

- No-progress, blocked, abandoned, conflicting, incomplete, and UNKNOWN episodes remain in the observed population report.
- Only verified-progress episodes enter the denominator.
- `INTERVENTION_CLASSIFICATION_UNKNOWN` is reported separately and cannot improve AMIR.
- Material UNKNOWNs that could change the numerator or denominator cause `AMIR_INTERVENTION_CLASSIFICATION_UNRESOLVED` or `VERIFIED_PROGRESS_EVIDENCE_INSUFFICIENT` rather than a forced baseline.
- Abstention is not success.

## 11. Anti-selection and stopping controls

- Do not admit only clean or successful episodes.
- Do not remove episodes because they increase AMIR.
- Do not add episodes because they decrease AMIR.
- Do not change the sample target, deadline, surfaces, definitions, or classification rules after observation starts.
- Do not compute or publish interim AMIR.
- Observation stops only under the precommitted target or deadline rule.

## 12. Independent adjudication

Professor/evaluator adjudicates episode identity, progress, and intervention class from the frozen rules and evidence, independently of Builder/V0. Builder does not select the population, classify interventions, or measure the baseline. Ambiguity is recorded rather than resolved by reference to any future candidate behavior.

## 13. Final aggregation

After the stop boundary:

`AMIR = count(MECHANICAL interventions) / count(VERIFIED_OBJECTIVE_PROGRESS_EPISODEs)`

The final artifact must report all observed episodes, qualifying/nonqualifying counts, every intervention class count, UNKNOWNs, evidence refs, population digest, and integrity identities.

## 14. Frozen certifications

- `BASELINE_PROTOCOL_FROZEN_BEFORE_OBSERVATION`
- `SAMPLE_RULE_NOT_CHANGED_AFTER_RESULT_OBSERVATION`
- `BUILDER_DID_NOT_MEASURE_GOVERNING_AMIR_BASELINE`
- `PILOT_001_NOT_USED_TO_REDUCE_BASELINE`
- `RESERVED_AARON_DECISIONS_EXCLUDED_FROM_MECHANICAL_NUMERATOR`
- `NUMERATOR_AND_DENOMINATOR_EVIDENCE_BOUND`

