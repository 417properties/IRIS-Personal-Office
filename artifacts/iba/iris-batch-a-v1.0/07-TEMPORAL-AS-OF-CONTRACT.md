# 07 — Temporal / As-Of Semantics Contract

A1-A5 share one temporal algebra. No object must carry fields it does not need, but materially different meanings may not collapse.

Coordinates where material:
occurrence/event time; observed time; recorded/ingested time; effective/valid-from; valid-until/expiry; decision/as-of time; supersession/revocation time; review/requalification time.

Invariants:
RECORDED_LATER != EFFECTIVE_LATER.
LATEST_RECORD != CURRENT_AS_OF_DECISION.
HISTORICAL_TRUTH != PRESENT_APPLICABILITY.
FRESH_EVIDENCE != FRESH_AUTHORITY.
FRESH_AUTHORITY != FRESH_CONTEXT.
EXPIRY_CHANGE_CAN_BE_MATERIAL_WITHOUT_PAYLOAD_CHANGE.
RECONSTRUCTABLE_HISTORY != CURRENT_VALIDITY.

## Decision-time revalidation

Before any consequential release, routing that relies on qualification, continuity admission or Current-dependent judgment, re-evaluate all mandatory temporal predicates against the explicit decision/as-of cut.

Expiry/revocation can invalidate without payload mutation and therefore must participate in dependency/invalidation proofs.

## Historical reconstruction

A cold/historical reconstruction distinguishes:
- what was true as of T;
- what IRIS had observed/recorded by T;
- what became known later;
- what is currently applicable.

Future-known evidence cannot silently leak into historical-as-of output.

Required:
IRIS_TEMPORAL_SEMANTICS_CONTRACT = FROZEN.
AS_OF_RECONSTRUCTION_SEMANTICS = FROZEN.
DECISION_TIME_REVALIDATION = REQUIRED.
