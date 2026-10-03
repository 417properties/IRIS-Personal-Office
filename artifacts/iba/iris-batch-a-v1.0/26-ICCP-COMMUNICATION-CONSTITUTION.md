# 26 — IRIS ICCP Communication Constitution

IRIS uses ICCP as a semantic communication profile compatible with appropriate open transports. Shared protocol grammar never imports BIG state.

## Permanent separation

ICCP Canonical = durable institutional meaning.
ICCP Dense = compact AI-facing representation.
ICCP Wire = serialization/transport event.
Authority/Provider Profile = constraints on assertion/effect/promotion/recovery rights.

MEANING != REPRESENTATION != TRANSPORT != AUTHORITY.
DENSE_CANNOT_CREATE_MEANING.
WIRE_CANNOT_CREATE_AUTHORITY.
DELIVERY != UNDERSTANDING.
WIRE_INTEGRITY != SEMANTIC_TRUTH.
SEMANTIC_TRUTH != AUTHORIZATION.
AUTHORIZATION != PROMOTION.
IRIS_ICCP_PROFILE_IS_DISTINCT_FROM_BIG_STATE.

## Canonical communication object

Where material:
profile_id/version; vocabulary/schema version; message/event identity; causal_occurrence_id; actor/role/substrate; principal/sponsor; object/ref; base/prior state; transition or legitimate NO_DELTA; A1 epistemic state; evidence/provenance refs; A3 privacy/authority refs; parent/thread/trace relations; temporal/as-of coordinates; consequence/materiality; unresolved/communication debt; required continuation/return destination; assurance required/achieved; compression/translation loss; expiry/revalidation/invalidators.

Canonical meaning references A1-A5 objects; it does not duplicate their truth.

## Dense contract

Dense is permitted only when deterministically expandable to the same required Canonical meaning for the receiving profile.

Dense may omit bytes, not required semantics. It must preserve or resolvably reference:
authority/privacy; evidence/provenance; relation direction; epistemic state; temporal applicability; causal identity; unresolved debt; next transition; material loss.

If the receiver lacks a required vocabulary/extension/reference, reconstruction fails closed or falls back to a higher-fidelity representation.

DENSE_CANONICAL_ROUNDTRIP_FIDELITY = REQUIRED.

## Wire/event contract

Wire carries/resolves:
profile/vocabulary/schema versions; event/message ID; source/destination; object/base refs; parent/trace/span; occurrence and recorded time; encoding; Canonical/Dense ref or payload; semantic/integrity hashes; required extensions; loss declaration; expiry/revalidation; retry/attempt/idempotency identity; queue telemetry; assurance; failure/debt code.

Exactly-once is not assumed.
Repeated delivery of one occurrence may create multiple delivery attempts, never multiple causal experiences or consequential releases.

WIRE_EVENT != QUALIFIED_OBSERVATION.
WIRE_EVENT != FUNCTIONAL_TRUTH.
WIRE_EVENT != CURRENT.
WIRE_EVENT != AUTHORITY.

## Negotiation

Sender/receiver negotiate supported profile/version/vocabulary/required extensions and maximum qualified representation.
Unknown optional vocabulary may be preserved as declared extension/loss.
Unknown required vocabulary or unresolvable required reference => HOLD/fallback, never silent drop.

## Round-trip / loss

Canonical -> Dense -> Canonical must reproduce all fields required by the negotiated profile or declare material loss.
Canonical/Dense -> Wire -> receive -> reconstruct must preserve occurrence identity, relation direction and all required guards.
Translation/compression loss is first-class and may force requalification.

TRANSLATION_SUCCESS != SEMANTIC_EQUIVALENCE.

## Filtration and privacy

Before egress:
qualify referent/base; purpose/recipient; privacy/disclosure; minimum necessary projection; provenance; as-of validity; loss.

After receipt:
verify profile/schema/version/integrity; resolve refs; reconstruct meaning; apply A1/A3/currentness/privacy filters; only then route/promote/act.

COMMUNICATION_EFFICIENCY_CANNOT_OVERRIDE_PRIVACY.
SHARED_PROTOCOL != SHARED_DISCLOSURE_RIGHT.

Private evidence content may remain internal with authorized immutable references or bounded projection.

## Nervous System / Functional Perception

N2 uses Wire-compatible circulation; N3 Functional State Assertions may use Canonical/Dense.
Transport never creates the claim. Functional Perception supplies configuration-qualified claim identity/evidence/applicability/freshness/uncertainty/invalidators.

## External interoperability

Use the lightest appropriate mechanics:
- A2A: horizontal agent/task/message/artifact collaboration;
- MCP: tools/resources/context access;
- CloudEvents-compatible envelopes: asynchronous event transport where useful;
- OpenTelemetry/Trace Context: observability/causal trace;
- transparent JSON baseline; compact codec only after measured need/conformance proof.

EXTERNAL_PROTOCOL_MECHANICS != IRIS_SEMANTICS.
MCP_TOOL_ACCESS != A2A_AGENT_COLLABORATION.
A2A_AGENT_IDENTITY != IRIS_AUTHORITY.

External counterpart without ICCP uses an adapter into supported structured/human-readable form; canonical IRIS meaning remains internal and translation loss is declared.

## Personal BIRE communication economics

Measure correctly reconstructed/applied meaning per total communication metabolism: tokens/context, bytes/commands, reconstruction latency, clarification cycles, model calls, failure, translation loss, debt age, retry burden, Aaron courier burden and useful applied delta.

Dense/Wire are justified only when they lower burden without semantic/privacy loss.

## IEF

ICCP capability can mature across IEF phases but ICCP_MATURITY != IRIS_IEF_PHASE.

## Required invariants

IRIS_ICCP_COMMUNICATION_CONSTITUTION = FROZEN.
MEANING_REPRESENTATION_TRANSPORT_AUTHORITY_NON_COLLAPSE = FROZEN.
IRIS_ICCP_PROFILE_BIG_STATE_SEPARATION = FROZEN.
DENSE_CANONICAL_ROUNDTRIP_FIDELITY = REQUIRED.
WIRE_NERVOUS_SYSTEM_BINDING = FROZEN.
ICCP_FUNCTIONAL_PERCEPTION_BINDING = FROZEN.
EXTERNAL_AI_INTEROPERABILITY_PROFILE = FROZEN.
ICCP_PRIVACY_MINIMUM_DISCLOSURE = REQUIRED.
TRANSLATION_LOSS_DECLARATION = REQUIRED.
