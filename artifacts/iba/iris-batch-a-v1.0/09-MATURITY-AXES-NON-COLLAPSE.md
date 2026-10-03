# 09 — Developmental vs Realization/Operational Maturity

Two independent coordinates are mandatory for capability/phase claims.

## Developmental axis

IRIS IEF phase/vector from artifact 08.

## Realization/evidence axis

CONCEPTUAL
-> SPECIFIED
-> ARCHITECTED
-> BLUEPRINTED
-> IMPLEMENTED
-> INTEGRATED
-> TESTED
-> DEPLOYED
-> OPERATED
-> CONTINUITY_PROVEN
-> INSTITUTIONAL_CURRENT.

No automatic promotion between states; each transition requires its own evidence/authority.

Non-collapse:
IEF_PHASE != IMPLEMENTATION_MATURITY.
IMPLEMENTED != EARNED_CAPABILITY.
TESTED != OPERATED.
DEPLOYED != CONTINUITY_PROVEN.
CONTINUITY_PROVEN != INSTITUTIONAL_CURRENT.
FORWARD_COMPATIBLE_ARCHITECTURE != PRESENT_CAPABILITY.

Every material capability status must be expressible as:
{developmental_position, realization_state, evidence_refs, as_of, invalidators}.

A deferred IEF-7 interface may be ARCHITECTED while operational capability remains unearned; this does not raise IRIS's declared phase.

Required:
IRIS_MATURITY_AXES_NON_COLLAPSE = FROZEN.
IEF_PHASE_AND_REALIZATION_STATE_DUAL_STATUS = REQUIRED.
NO_IMPLEMENTATION_OR_ARCHITECTURE_MATURITY_LAUNDERING = REQUIRED.
