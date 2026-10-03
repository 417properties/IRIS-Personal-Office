# 16 — Canonical Action / Effect / Lifecycle Contract

This expands A4.

## State chain

DecisionRecord -> ActionIntent -> ReleaseAttempt(PREPARED) -> authority/fence validation -> RELEASED_SUBMITTED or DENIED/AMBIGUOUS_SUBMISSION -> Receipt -> EffectObservation -> Verification -> Reconciliation -> Objective/Obligation transition.

Each step has its own immutable identity and evidence. No later step is inferred solely from an earlier success signal.

## Intent

ActionIntent binds principal, objective/obligation, operation/tool, target refs, expected effect contract/digest, privacy/authority requirements, retry class, idempotency key where applicable, causal occurrence, validity and evidence.

Existing intent ID + different digest => INVALID/HOLD.

## One-time release

Exactly one durable ReleaseAttempt owns consequential submission for an intent/idempotency class.
PREPARED is durable but not authority.
Release checks A3 snapshot and A2 continuation fence at the release boundary.

Repeated caller invocation reads the persisted attempt and returns/reconciles; it does not submit again merely because the function was called again.

## Transport/exception classification

Before known submission: NO_SUBMISSION_PROVEN only with evidence.
Known accepted submission: SUBMISSION_KNOWN.
Timeout/crash/transport uncertainty after possible submission: AMBIGUOUS_SUBMISSION / RECONCILIATION_REQUIRED, never blind retry.

## Effect verification

Allowed epistemic dispositions include:
EFFECT_VERIFIED; NO_EFFECT_VERIFIED; PARTIAL_EFFECT; AMBIGUOUS_EFFECT; CONFLICTED_EFFECT; UNAVAILABLE_READBACK; UNKNOWN.

NO_EFFECT_VERIFIED needs positive proof of absence appropriate to the effect contract. A mismatched value is not enough.

Expected effect/readback is bound to persisted intent/receipt identity.

## Retry

Retry requires:
same immutable intent/effect semantics; allowed retry class; validated Current authority/continuation; and a verification/reconciliation state proving retry safe.

Ambiguous/partial/conflicted landed state blocks retry pending reconciliation unless an explicit compensation/retry policy independently proves safety.

## Objective/obligation closure

Tool success and effect verification are evidence inputs, not objective closure.
ObjectiveReconciliation checks explicit success/closure criteria, all mandatory obligations/resolutions, conflicts/effects, applicability, authority/privacy effects and as-of state.

Terminal transition is canonical event/version. Failure does not reopen a terminal objective by mutation.

## Reserved Aaron judgment

A3/A1 determine whether a reserved decision/authorization remains KNOWN required or RELEVANCE_UNKNOWN. Conservative operational denial must not be mislabeled epistemic certainty.

## Recurrence proof

Batch C models duplicate call, same-ID changed payload, crash before/after submission, revoke-first/submit-first, partial effect, wrong effect, unavailable readback, multiple obligations, unrelated objective, mid-flight policy change and cold reconstruction.
