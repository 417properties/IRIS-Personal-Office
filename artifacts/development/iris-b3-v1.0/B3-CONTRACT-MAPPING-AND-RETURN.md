# CDA-owned Builder — B3 Authority / Continuation / One-Time Release

SOURCE_CANDIDATE / STRATA_RECONCILIATION_REQUIRED / NO_SELF_ACCEPTANCE.
Governing acceptance/release: BIG #703/5972622859.
Accepted B2 sole executable parent: d5f28f7eb5862d410e69751ddfbaab1035952c27; tree 390126041ac0f285035c33bdd8fa6a047e72f57a.
Local candidate branch: builder/iris-b3-authority-continuation-release-v1.
Delivery follows B2: immutable Git objects plus complete byte readback and canonical issue returns. No remote ref/PR, push, merge, CI/deployment trigger, or live effect is required.
Candidate HEAD/tree and complete including-manifest package identities are returned outside this file to avoid recursive self-hash/HEAD claims. DELTA-MANIFEST.json specifies every other changed file's Git blob, bytes and SHA-256; the canonical return also includes the manifest's own identity.

## Fresh Current / source consumption

BATCH_A_CLOSED / B1_CLOSED / B2_CLOSED / BATCH_C_CLOSED / B3_RELEASED.
Consumed accepted Batch-A artifacts 01, 07, 14, 15, 16, 18, 19, accepted B1/B2 contracts and caller inventories, and the B2 acceptance/B3 release. Accepted parents remain semantic owners; no accepted source snapshot is edited.
The governing IBA clarification BIG #703/5971926463 remains applicable to privacy-safe representations. B2 ROOT_DISPOSITION_V2 is unchanged. B3 has no consumer/root selector or locally computed Q-DISPOSITION precedence. A3 operational denial never manufactures epistemic absence; full canonical input remains captured for replay. Internal authority/attempt DTOs are privileged repository/executor surfaces, not a public disclosure projection; B5/B6 retain consumer/communication/interface integration.
No sealed Batch-C vector/proof/oracle package was read or executed. Public adjudication/release context is consumed. Implementation-authored tests are not independent oracle derivation, oracle execution, institutional acceptance, or new operational experience.

## Shared implementation ownership

- B1 unchanged: opaque typed identity; strict decoding; temporal algebra; ContinuationClaim representation; lifecycle/effect states.
- B2 unchanged: strict canonical records/commands, append/replay, immutable principal/as-of Current and reconstruction, source/DTO maps, compound reasons.
- B3: src/enforcement/contracts.ts, repository.ts, backends.ts and migration 007.
- Six inherited caller modules are changed only for release migration/retirement and the qualification fixture's enforced permit seam. state/migrations.ts adds the B3 extension; migrations 001–006 are byte-identical to accepted B2.
- Canonical ActionIntent/ReleaseAttempt are IRIS_B3_V1, distinct from historical V0 DTOs. V0 intent cannot supply missing dimensions or manufacture a digest/idempotency identity through a default upgrade.

## Total A3 validator field matrix

All positive lease issuance, prepare, and actual release revalidation call the same validateAuthority implementation. Positive lease issuance is durable and required before PREPARED. A previously returned snapshot cannot be passed to bypass repository Current, generation or continuation revalidation.

| Dimension | Exact persisted fields / common check |
|---|---|
| Principal / sponsor | Typed intent.principal + sponsor; canonical Current principal/subject and registered identities; explicit delegation starts at sponsor. No provider/session/credential possession inference. |
| Grantee / incarnation | Typed grantee WORKER and distinct incarnation WORKER/SUBSTRATE; bound execution-service actor, ACTIVE worker status, valid observed worker temporal state; registered incarnation. |
| Work / causal context | Typed objective, obligation, Work Episode, causal episode and occurrence; exact Current binding and explicit identity registration; occurrence preserved across repeat/reconstruction. |
| Purpose / objects / resources | Exact purpose, object_refs and resource_refs; dense, unique, nonempty references. No prefix parsing, wildcard scopes, defaults, case folding, scope-string policy or implicit inheritance. |
| Capability / qualification | qualification_id, configuration_digest, role, capability_id and tool_id; QUALIFIED source declaration with evidence, bounded observed validity and review/requalification check. Qualification transfer/derivation remains B5; possession is not qualification. |
| Operation / effect | Exact operation, arguments and expected_effect; effect_class and consequence_class; SHA-256 canonical immutable full-intent binding. Digest mismatch or same-ID changed semantic bytes rejects. |
| Value / resource ceilings | Exact currency/amount_minor and resource units/cost_minor are nonnegative safe integers; explicit limits must match currency and bound all three quantities. DENY/UNKNOWN remain nonpermission even when keys match. |
| Authority / privacy policies | Exact authority_policy_id/version and privacy_policy_id/version; authority_domain/generation, monotonic observed generation/policy floor, canonical Current as-of release, explicit permission ALLOW, first-class DENY/UNKNOWN. |
| Lease | Exact lease_id/generation; durable validated issuance for the immutable intent; Current latest ACTIVE state, grant/lease issued_at, observed/effective/recorded/expiry/revocation/supersession coordinates. No future issuance or old-generation reuse. |
| Delegation | Exact delegation_digest over typed from/to chain, generation, permission, times and evidence; sponsor-to-grantee contiguous chain, no cycle, no implicit delegation. Each edge must be ALLOW, observed, bounded and valid at the decision cut. |
| Privacy / disclosure | Exact classification, recipient, purpose, retention_until, minimum_necessary_digest, egress, reuse and transfer restrictions. Separate retain/use/disclose/minimum_necessary ALLOW proof declarations with evidence and valid temporal bounds. Purpose must match; minimum-necessary digest must bind the exact argument payload. |
| Temporal / knowledge | B2 Current known/effective at decision cut; KNOWN/APPLICABLE/CURRENT_AS_OF/COMPLETE_FOR_DECLARED_SCOPE, no unresolved declared invalidator; all material authority/worker/lease/qualification/privacy/continuation times bounded and observed. Future observation/recording/occurrence and expiry/revocation/supersession hold. |
| Intent / release | Typed INTENT and RELEASE_ATTEMPT, exact immutable digest, explicit retry class and source idempotency key, evidence and provenance. Attempt target is bound by Current, never generated from a display ID. |
| Continuation | Exact principal/causal episode, owner incarnation, claim identity, generation and token; active claim and prepared fence compared at release. No successor authority inheritance. |
| Execution transport | Bound service actor and fixed tool/configuration/capability/qualification transport identity. Canonical fixture dispatch additionally consumes an unforgeable single-use process-local permit minted only after durable release ownership. No credentials in the permit. |

Structural permission/evidence declarations are validated at the canonical boundary. B3 does not independently prove a sponsor's external credentials, qualification population, underlying privacy judgment, or external effect. Those are source/qualification/integration obligations, not privileges invented by this implementation. Trusted repository assembly/authorized canonical writers and correctly bound executor/transport are required; this source candidate creates no unauthenticated HTTP route or provider service. An arbitrary hostile SQL/application writer can corrupt declared source facts; poisoned journals fail closed on canonical read/release, not self-repair.

## Complete consequential caller migration map

| Accepted-B2 surface | B3 disposition |
|---|---|
| runtime/act.ts act -> executor.execute | V0 act checks contract mismatch then rejects CANONICAL_RELEASE_REQUIRED. New releaseAction takes the shared ReleaseService. No string bag can release. |
| runtime/iris-workflow.ts runBoundedCircuit | Retired before any persistence, dispatch, verification or objective/obligation mutation. Matching old scopes return HOLD_CANONICAL_RELEASE_REQUIRED. New runConsequentialCircuit uses ReleaseService and returns release state only; B4 owns verification/closure. |
| agent-transition/sentinel.ts prepareReleaseAttempt/validateAndRelease | Migrated to EnforcementRepository PREPARE and ReleaseService; synthetic rel_/op_/idem_ generation removed. Repeated invocation reads persisted state. Recovery reads actual state, not a knownReceipt boolean. |
| agent-transition/authority-lease.ts validateLease/issueLease | Incomplete V0 lease shapes fail closed. issueCanonicalLease uses the common total validator and durable journal. Legacy generation copies remain explicitly advisory; revokeCanonicalAuthority uses the same transaction lock as release. |
| runtime/episode-controller.ts claimContinuation | V0 mutable episode claim retired without writing; transferContinuation uses the shared atomic compare-and-transfer. |
| tools/action-fixture-adapter.ts execute | Raw V0 execution retired. New canonical fixture submit requires exact binding and one-use process-local permit. Forged, replayed or serialized permits reject before effect. |
| tools/tool-contract.ts ToolExecutor/toolContractMatches | Historical representation/contract comparison remains advisory; no reachable release invokes execute from it. The raw fixture implementation rejects execute. |
| domain/authority.ts evaluateAuthority / domain/privacy.ts evaluatePrivacy | Historical policy evaluators remain for V0 analysis/regression; no source release caller consumes them. They cannot create canonical permission or issuance. |
| tools/mcp-adapter.ts wrapMcpTool / tool-registry.ts | Descriptors/registration only; no consequential dispatch implementation. Presence carries no authority. A future transport must bind the canonical service and consume its permit. |
| agent-transition capability/router/research-worker seams | No consequential dispatch. Their authority_effect remains NONE; B5 owns qualification/routing/perception/ICCP adoption. |

CALLER-BOUNDARY.txt records the complete post-migration source search. Every release-capable source path is migrated or retired. There is no positive V0 compatibility fallback.

## Continuation transfer / fencing state machine

1. ADMIT_CONTINUATION consumes the exact known/effective initial B2 ContinuationClaim and its admission-evidence declaration. It does not award B4 continuity/recovery admission. Initial generation may be any accepted positive generation; no artificial reset to one.
2. TRANSFER_CONTINUATION compares the complete active claim, including principal/causal episode/owner/generation/token. The successor has a distinct registered incarnation and claim identity, next generation and distinct token, bounded validity and admission evidence.
3. Compare-and-transfer persists one new owner atomically. Competing transfers using the same predecessor produce one winner and one stale compare failure; one active claim remains.
4. Prepared predecessor releases compare their stored claim against the current claim and are fenced after successor-first transfer. Successor cannot reuse predecessor intent/lease/actor. Its own new intent/Current/lease must validate; it gains no authority by ownership alone.
5. Release-first may finish its already-linearized submission after a later transfer. Transfer cannot rewrite that occurrence or receipt into non-submission.
6. Expiry does not resurrect a predecessor. Current owner expiry blocks release; an explicit source-backed transfer can establish the next owner. B4 owns recovery admission and independent successor reconstruction beyond this enforcement state.

## Durable ReleaseAttempt state machine

- ISSUE_LEASE: validates full A3 + continuation against canonical Current, durably records the exact intent/lease binding.
- PREPARE: validates the immutable intent, exact attempt, current authority and continuation; requires the durable lease. Produces durable PREPARED with the full validated authority snapshot, source Current identity/digest/version and prepared fence. PREPARED is not submission and not a reusable permission.
- Exactly one intent owns one attempt. Exactly one principal/tool/idempotency-key class and one principal/occurrence own a consequential attempt. New IDs cannot evade digest/idempotency/occurrence conservation. Same intent or attempt with changed payload rejects.
- Preflight is explicitly nonconsequential. Only while PREPARED, a proven local pre-dispatch failure records NO_SUBMISSION_PROVEN with evidence. A positive probe is not permission.
- RELEASE re-reads and validates Current, latest lease/generation/revocation and exact continuation inside the shared transaction. Revoked/fenced/expired/unknown/denied state produces operational DENIED; it does not convert UNKNOWN into epistemic FALSE or erase captured source evidence.
- The winning transition durably reserves SUBMITTING with exactly one dispatch identity. SUBMITTING means possible submission / reconciliation required, even if the process dies before the callback. No later process recreates the permit or re-dispatches it.
- Only the winning live service invocation receives a one-use in-process permit. Canonical fixture consumes it before its effect; it is deleted after consumption/return/exception and never appears in snapshots. Future adapters are required to consume the same seam.
- A correctly bound accepted receipt produces RELEASED_SUBMITTED / SUBMISSION_KNOWN. It is not EFFECT_VERIFIED, objective success or closure; effect remains NOT_ADJUDICATED.
- Any exception, timeout, malformed/wrong receipt or uncertainty after ownership becomes AMBIGUOUS_SUBMISSION / RECONCILIATION_REQUIRED. Caller error.no_submission_proven flags cannot reverse that boundary.
- Completion persistence failure propagates, preserving SUBMITTING. The next invocation reads it and holds for reconciliation; no callback repeat. Unknown reservation-commit response is also inspected before any retry.
- Retry after NO_SUBMISSION_PROVEN is explicit and requires an allowed source retry class, unchanged digest/intent/occurrence and fresh authority/fence. NON_IDEMPOTENT_UNSAFE remains blocked. No-effect or effect/compensation retry belongs to B4; ambiguity cannot be cleared here.
- Repeated PREPARE/lease/release reads that make no state change do not append duplicate documentary events. There is no experience-count inflation from caller retries or snapshots.

## Revocation / release linearization and persistence

Memory canonical mutation and enforcement share one serialized critical section. SQL uses the accepted B2 connection-pinned transaction callback and singleton SELECT ... FOR UPDATE for BOTH canonical Current updates and enforcement. No pool BEGIN/COMMIT emulation is introduced.

REVOKE performs an exact generation compare against canonical Current and records monotonic generation invalidation under that lock. Revoke-first blocks release; release-first records a reservation before subsequent revocation, so later revocation cannot erase the recorded history.

Migration 007 adds an append-only enforcement journal. Its SQL guards reject NULL/unmapped top-level coordinates, unsupported command kinds, sequence gaps, canonical capture-count mismatch, timestamp regression, update/delete/truncate. Shared command/replay validation owns deeper semantic invariants under the same lock; arbitrary raw semantic inserts are not treated as trusted truth and poison replay/release into HOLD. Hosted grants/ACL configuration is not modified.

Each event captures the exact B2 command-prefix count and SHA-256 at its linearization point. Replay re-derives the recorded result against THAT prefix, rather than validating past releases against a future policy or revocation. Composite snapshot import validates both journals before atomic import into an empty store. A transactional import failure rolls back completely.

Immutable principal/as-of B3 reconstruction retains canonical history, selected continuation at the cut with its temporal validity, issued lease bindings, attempts/receipts/ambiguity and revocations known at that cut. It returns admission=NOT_ADJUDICATED and effect_verification=NOT_ADJUDICATED. nextSafeAction returns RECONCILIATION_REQUIRED for SUBMITTING/AMBIGUOUS and B4_EFFECT_VERIFICATION_REQUIRED for submitted attempts.

## Qualification and exact proof boundary

Frozen counts, tools, commands and output identities: QUALIFICATION.json and focused/full/structural/typecheck logs in this directory.

- Tests are Builder-authored conformance plus the complete inherited suite. They do not consume or score the accepted Batch-C oracle.
- Every bound intent dimension is mutated independently; DENY/UNKNOWN, foreign principal/worker/purpose/object/recipient/tool/config/episode/policy/intent/digest/generation and material temporal changes fail before dispatch.
- Memory/SQL schedules exercise revoke-first/release-first, successor-first/release-first, duplicate calls, competing transfers, stale actor/lease/token, expiry without payload mutation and Current privacy change between preflight and release.
- Controls include repeated invocation, same-ID changed semantics, idempotency collision, explicit preflight retry, retry after revocation, unsafe retry denial, timeout/crash before/after callback, malformed receipt, injected reservation rollback, unknown commit response, completion persistence failure, snapshot drift/NULL/version/schema/gap/sequence, raw SQL poison, fresh-process reconstruction and two independent SQL repository wrappers.
- New source has strict TypeScript 5.7.3 validation (noEmit/strict/noUnusedLocals/noUnusedParameters); structural table check is structural only.
- SQL qualification uses pinned @electric-sql/pglite 0.3.14 / PostgreSQL 17.5 WASM, all seven source migrations. Only inherited pgcrypto extension loading is shimmed in the test harness by core sha256, as accepted for B2.
- SQL wrapper races use one local PGlite engine, not independent native connections. Hosted/native durability, extension loading, multi-session/distributed scheduling, authenticated provider route binding and unbounded-scale performance are NOT qualified. Fresh SQL-process checks reopen a local file-backed WASM store, not a hosted provider.
- Clock injection is a deterministic qualification seam; production clock/trusted runtime assembly is not provisioned. Timestamp regression holds; distributed clock behavior is not earned.
- Transport preflight is a nonconsequential adapter contract. No external adapter/network effect is qualified here. The canonical local fixture consumes the enforcement permit; fake callback schedules test orchestration/state boundaries.
- Qualification denies fetch/http/https/net/tls in parent and child Node processes. Frozen evidence records zero attempts/provider dispatches. GitHub source/evidence publication occurs outside that offline execution boundary.

## Historical proof disposition

The complete inherited 490-test suite is retained and re-run. Eleven historical expected behaviors across lease, sentinel, circuit, continuation and scope-only circuit tests are replaced with the governing canonical/retirement behavior: one lease-positive expectation; five sentinel tests; two raw circuit closure tests; one mutable continuation test; two matching-but-UNKNOWN circuit statuses. The five sentinel tests now target real canonical issuance/prepare/release/ambiguity/reconstruction. The others prove retired paths make zero mutation/dispatch. The remaining inherited observations remain unchanged.

Historical raw-tool closure/volatile-release green behavior is explicitly not grandfathered as B3 or B4 assurance. No independent oracle expected result is edited, repaired, imported or replaced. B4 must reestablish effect/closure semantics through its canonical implementation; a retired V0 circuit does not earn them.

## Material findings — DEEP v2 / predictive metacognition

### Total authority/caller divergence
L1: inherited matching scope strings and lease keys could call an executor. L2: issuance and release used different partial checks, omitting denial/value/principal/lease-time and intent/fence dimensions. L3: a nominal shared helper could leave a second release owner in a reachable caller. L4: volatile sentinels and mutable episode claims compounded that bypass with races. L5 conditional blast radius: automated retries/recovery would repeatedly exercise stale authority and duplicate effects.
Competing explanations: spelling/fixture drift versus semantic-owner fragmentation. Evidence boundary: source inventory plus bounded deterministic controls, not live effects. Earliest divergence: a consequential caller deriving permission locally or dispatching before durable ownership. Falsifier: any field-mutation or legacy caller produces a dispatch; any release path avoids common validation. Smallest safe test: one-bound-coordinate mutation with a counted fake/fixture adapter and exact pre/post state. Action: migrate/retire all inventoried callers; wait for STRATA acceptance and later qualified integration before operational use.

### Transport/crash ownership
L1: old attempts were local objects. L2: submit preceded any durable reservation; a missing return erased the distinction between no submission and possible submission. L3: retry/reconstruction could manufacture a second owner. L4: a later authority check alone cannot prevent double effect once the transport boundary has been crossed. L5 conditional blast radius: duplicate consequential submissions under repeated calls or cold recovery.
Competing explanations: provider idempotency versus institutional ownership; provider keys alone cannot prove safe retry after uncertainty. Evidence boundary: local callbacks, persistence fault injection and fresh-process readback. Earliest divergence: transport possibility before durable ownership. Reversal/falsifier: >1 counted dispatch for one immutable attempt/class, or reconstruction recreates a permit. Smallest safe test: pause/revoke/transfer or crash at reservation/callback/completion and inspect persisted state before re-invocation. Action: reserve once, preserve ambiguity, require B4 reconciliation; no blind retry/wait for a timeout alone.

### Temporal knowledge and replay
L1: optional B1 timestamps are valid representation coordinates. L2: omitting observation or allowing future issuance is unsafe when those fields are material to A3. L3: using present Current to replay past release would erase release-first history after revocation. L4: both live authorization and immutable historical meaning require separate time/knowledge cuts. L5 conditional blast radius: future-known or unobserved facts grant stale authority while later corrections rewrite occurrence evidence.
Competing explanations: immaterial optional representation fields versus material release evidence. Evidence boundary: qualified source declarations and explicit synthetic clocks; no live clock/durability claims. Earliest divergence: omitted observed/issued coordinates at A3, or replay against a later source prefix. Falsifier: unobserved/future-issued authority releases, or later policy changes alter a frozen prior result. Smallest safe test: mutate each temporal coordinate, preserve payload, cross expiry, and cold-replay the captured prefix. Action: require material observation/issuance, capture source prefix, fail on time regression; do not change B1's optional general-purpose semantics.

Predictions B3-P1/P2/P3: all release-capable callers share one validator; one possible-submission owner survives retry/restart; revocation/transfer ordering preserves one causal history. Horizon: STRATA B3 review and later consolidated/independent qualification. Calibration UNCALIBRATED. Synthetic schedules, model agreement, documentary repetitions and multiple process views of one occurrence do not add operational experience.

## Exact residual owners / blockers

- B4: actual source/effect proof verification; positive absence/readback/partial/conflict/reconciliation; objective/mandatory-obligation closure; no-effect/compensation retry; recovery/continuity admission; qualified checkpoints and verified projection snapshot/run proof. SUBMITTING/AMBIGUOUS remain held here.
- B5: actual capability/population/configuration qualification, eligibility routing/perception/retention and ICCP/communication integration; trusted tool/provider adapter/runtime binding at operational integration. Descriptor possession remains nonauthority.
- B6: source-qualified compound-reason selector, Personal Office/Pilot/root/coverage/candidate-interface integration. No E1 mutation or Pilot evaluation/scoring.
- STRATA: independent exact-head B3 reconciliation/acceptance, residual scope/proof accounting, next release. No new constitutional decision requested from Aaron/IBA.
- Operational/whole-stack qualification is not earned by this source return. Native hosted persistence, multiple native sessions, actual authenticated provider routes and scale remain explicitly outside this bounded qualification.
- No implementation blocker identified for the bounded B3 source candidate. B3 acceptance remains OPEN until STRATA adjudicates it; no self-awarded gate closure.

## Zero-mutation / preserved posture

Only local code, local SQL/WASM qualification and authorized GitHub immutable source/evidence/issue publication changed. No live consequential provider call, merge, deployment, Preview, credential generation, live Redis, provider configuration, authority expansion, Production, continuity ON, IRIS admission, BIG Activation, replacement E1 or Pilot scoring. Accepted Batch-A/B1/B2 artifacts and semantic owners remain exact.
CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED.
SOURCE_EVIDENCE_GOVERNS_ON_CONFLICT / DELTA_RECONCILIATION_NOT_ERASURE / ACTIVITY_IS_NOT_PROGRESS.
