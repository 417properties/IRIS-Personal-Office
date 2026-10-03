# CDA-owned Builder — B1 Shared Semantic Kernel v1.0

Dispatch: BIG #703/5971539564; mirror IRIS #3/5971540575.
Governing acceptance: BIG #703/5971366932.
Constitution/base: dbde4cea846fa9c7c8a4ad7094f360db318eb292, tree 12f02f24323b66626c74b106f265bc719488097f.
Branch: builder/iris-b1-shared-semantic-kernel-v1.
Status: SOURCE_CANDIDATE / STRATA_RECONCILIATION_REQUIRED. Builder does not self-accept.

## Exact boundary

Only new src/semantic-kernel modules, focused tests and this B1 documentary return are added. No existing downstream caller, schema, repository, Pilot, E1, historical audit or accepted Batch-A file changes.
The constitution is semantic authority; historical green tests are regression observations only. B1 tests are implementation-authored conformance evidence, NOT Batch-C independent oracles, institutional acceptance or whole-stack assurance.

## Contract-to-implementation map

| Frozen contract | Shared implementation | Conformance boundary |
|---|---|---|
| 01 A1; 13 root conservation | epistemic.ts | Independent knowledge/applicability/freshness/coverage coordinates; explicit root dispositions; one fact list consumed for coverage and conservation. No positive state from missing/UNKNOWN; empty facts cannot claim complete. |
| 01 A2; 15 identity/resolution | identity.ts | Typed opaque IDs, explicit versioned principal/as-of/evidence relations, context distinct from resolution identity, no spelling/objective-derived equivalence. |
| 15 occurrence | identity.ts | Distinct experience keys from explicit occurrence IDs, immutable origin/digest/time guard; retries/replays/reconstruction representations cannot multiply one occurrence. |
| 15 continuation primitive | continuation.ts | Exact causal episode, owner incarnation, positive generation, fence token, admission evidence and validity; representation only, no atomic owner transfer/release implementation. |
| 07 temporal | temporal.ts | Separate effective/recorded/observed/requalification coordinates; exact as-of cut, expiry/revocation/supersession re-evaluation; effective truth and recorded knowledge remain separately visible. |
| 13 lifecycle; 01 A4 | lifecycle.ts | Exact target/principal/version pure reducer, evidence basis; decision lifecycle separate, closure reconciliation basis required, terminal correction/supersession explicit. |
| 16 effect | lifecycle.ts | Immutable intent/operation/occurrence bindings, proof-kind/evidence state, positive absence distinct from inequality/transport success, ambiguity blocks retry evidence. No release/authority grant. |
| 13 representation boundary | representation.ts | IRIS_B1_V1 owned strict decoder/envelope, exact JSON round-trip, explicit legacy maps, many-to-one source spelling retained for inverse maps; unsupported/ambiguous tokens reject. |

## Representation decisions (mechanics, not new policy)

- Canonical ISO UTC spelling accepts second precision or three-digit milliseconds; invalid/calendar-normalized/noncanonical timestamps reject. Callers must perform an explicit representation translation if a source uses offsets. No semantic case folding or defaults.
- Validity intervals are half-open: a fact is expired/revoked/superseded at its stated invalidation cut. Temporal truth and recorded-by-cut knowledge are separate; knownAsOf requires both, and rejects explicit future observations. Omitted immaterial observation time is UNKNOWN, not manufactured time.
- Coverage reduction is conservative with precedence CONFLICTED > INCOMPLETE > UNKNOWN > COMPLETE. All underlying coordinates remain in the returned fact list, so this aggregate never overwrites UNKNOWN/missing/unavailable/etc. Empty scope yields INCOMPLETE; any missing/duplicate/foreign root rejects rather than disappearing.
- Canonical effect spelling NO_EFFECT_VERIFIED means a source declaration of POSITIVE_ABSENCE with evidence, never verification inferred from an unequal value. Proof declarations and refs are validated structurally; actual source proof verification/reconciliation is B4, not a claim earned by this primitive.
- Lifecycle basis refs/evidence and CLOSURE_RECONCILIATION labels are structural obligations. Actual mandatory-obligation/effect/criteria reconciliation is B4. No arbitrary basis string is represented as independently proven closure.
- RetryEvidenceDisposition reports evidence sufficiency only. It grants no permission; B3 must additionally validate immutable intent semantics, allowed retry class, Current authority and continuation fence at the release boundary.
- Legacy obligation CLOSED and objective UNSATISFIED are not interpreted as a canonical terminal state. They reject as UNMAPPED_LEGACY_STATE. OPEN/IN_PROGRESS/WAITING/HOLD -> NONTERMINAL maps preserve exact source_token; terminal provenance must be supplied through a canonical event.
- Strict boundaries reject extra/unmapped coordinates, accessor/symbol/nonenumerable object fields, invalid enums, sparse proof arrays and unsafe versions. Decoded values are detached and recursively frozen.

## B2 type/schema/repository representation plan — not implemented

1. Use these versioned semantic types as the single owner. Migrations 001–006 and domain DTOs need explicit enum/version/evidence/temporal/identity mapping. Preserve legacy source spelling when a translation is many-to-one; unsupported state remains a named HOLD.
2. Add validated canonical command/query DTOs and immutable memory/SQL snapshots. Repository validation must not use casts/defaults to bypass these decoders. Wire/schema maps must preserve every admitted coordinate; unknown fields cannot vanish.
3. Represent identity edges and resolution objects explicitly; context cannot stand in for anchors. Preserve causal occurrence IDs separately from episode/message/projection-run IDs and content hashes.
4. Add principal/as-of queries with explicit recorded/effective/revocation/supersession knowledge semantics. No latest-row or mutable map references. Each correction is a new event/version; imported snapshots pass the version-owned decoders.
5. Publish bidirectional maps domain <-> command/query DTO <-> SQL <-> reconstruction. Pilot maps and caller migration follow dependency order; schema/domain round-trip covers all admitted enums, uncertainty, privacy restrictions, opaque identities, relation/version and temporal values.
6. Memory and SQL adapter conformance must use Batch-C independently derived oracles when available. This implementation's tests are never promoted into independent expected truth.

## Caller inventory and residual boundary

CALLER-INVENTORY.txt enumerates source references before modification. The legacy modules remain unchanged: repository Current publication, runtime orientation/circuit, tool verification/retry, continuation claim, authority lease/sentinel, reconstruction/admission, capability/router/perception and Pilot classifier/coverage/projection. Their local semantics are historical and NOT repaired by adding this kernel.

B2 owns schema/repository adoption; B3 owns durable atomic continuation/one-time release/A3 enforcement; B4 owns effect verification/closure/reconstruction; B5 owns capability/perception/router/communication seams; B6 owns Pilot integration. Every later caller must consume these reducers or be retired; a second semantic reducer is a conformance defect. B1 requires no downstream source mutation to expose its public seam.

Residual blockers to WHOLE-STACK acceptance: B2–B6 unimplemented, Batch-C independent oracle/legacy-proof package pending, Batch-D consolidated qualification and Batch-E independent acceptance pending. These do not justify expanding B1 or reopening Batch A. No named constitutional ambiguity requiring Founder or IBA decision was found in B1.

## DEEP v2 material finding and falsification

L1: inherited green fixtures coexist with audit-falsified behavior. L2: separate old callers independently encode UNKNOWN, root identity, effect and closure. L3: a second semantic owner can survive even after a shared helper exists. L4: that permits classification/coverage/reconstruction and evidence/authority to diverge across adapters. L5 conditional risk: migrating only some callers recreates inconsistent institutional truth as the office grows.

One-layer-deeper challenge: the helper alone is another symptom if caller adoption and schema conformance are omitted. Competing explanations are only enum spelling differences versus true semantic owner fragmentation. Exact pre-edit caller inventory and source inspection show local reducers; pure kernel tests discriminate the new seam but do not demonstrate caller repair. Earliest divergence is a caller bypassing the shared decoder/reducer; blast radius remains those reachable legacy callers. Reversal/falsifier: a downstream source caller independently derives a constitutional state or loses an unmapped coordinate. Smallest safe test is strict state/representation/conservation/temporal negatives plus exact unchanged legacy-tree comparison, not Pilot or provider execution.

Prediction IRIS-B1-P1: after B2–B6 adoption, every admitted coordinate crosses one versioned seam; a second reducer or lossy adapter falsifies the prediction. Horizon: downstream consolidated qualification. Outcome calibration UNCALIBRATED; synthetic conformance is not operational experience. Action now: freeze B1 candidate for STRATA reconciliation. Wait for B1 acceptance before B2 implementation; independent oracle author remains blind to implementation-authored expectations.

## Preserved posture

BATCH_A_CLOSED / FIRST_TWO_OFFICES_STAGE_B_CLOSED / CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED.
No provider mutation, credential generation, deployment, live state command, merge, Pilot evaluation/scoring or replacement-E1 mutation.
