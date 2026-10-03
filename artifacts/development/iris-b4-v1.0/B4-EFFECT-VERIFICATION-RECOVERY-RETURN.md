# CDA-owned Builder — B4 Effect / Verification / Recovery source return

Governing release: BIG #703/5973672134; mirror IRIS #3/5973672899. The Builder independently read the canonical release and reconciled the preserved B3 acceptance, source return, earlier HOLDs and Batch-A constitutional contracts. The latest canonical readback retains B4_RELEASED. SOURCE_EVIDENCE_GOVERNS_ON_CONFLICT / DELTA_RECONCILIATION_NOT_ERASURE.

Base / sole executable parent: `1708dc0a999fae30aa479e94c6217e11c4735c69`, tree `39059a1b23725adba49b21933504329032eed4d5`. Local candidate branch: `builder/iris-b4-effect-verification-recovery-v1`. Exact candidate HEAD/tree, archive and complete per-file coordinates are supplied in the canonical return after immutable-object publication/readback. No remote ref, branch push or PR is needed for this immutable-object review.

Disposition: IRIS_B4_EFFECT_VERIFICATION_RECOVERY_SOURCE_CANDIDATE_READY / STRATA_8_6_9_EXACT_HEAD_ACCEPTANCE_REQUIRED / B4_GATE_OPEN / NO_SELF_ACCEPTANCE. B5 is not released by this return.

## Resulting behavior

A release receipt remains submission evidence. B4 probes a qualified readonly source, checks its exact configuration, principal, intent, occurrence, operation digest, privacy purpose, scope, observation time/version and receipt correspondence, and derives the effect disposition from actual returned scan entries. Provider success, a caller-supplied disposition label and an unequal value do not prove effect or absence. Conflicting or multiple entries, partial matching fields, unavailable readback and insufficient settlement remain distinct states.

Positive absence requires an exhaustive scan of the qualified exact occurrence scope with no matching entries, settlement through the verification cut and source-backed SETTLED submission finality. PENDING and UNKNOWN finality cannot prove absence. This is a qualified-source contract: adapters must actually implement occurrence scope and dispatch finality. The qualification fixture is synthetic; no external provider adapter, deployment or live empirical experience is claimed.

Each proof has its own typed verification identity and is persisted in the existing B3 journal. The corresponding B1 canonical EFFECT transition is appended in the same transaction. Verified terminal effect changes use explicit CORRECTION. Observation versions are monotonic and source/Current drift is rejected. Canonical declarations cannot replace or contradict the durable B4 proof in recovery, closure or retry.

Closure checks the exact Current contract, explicit criteria, all objective attempts, actual matching effect proofs, independent mandatory-obligation membership roster, mandatory resolution state, privacy and source qualifications, lifecycle versions and canonical recovery qualifications. All mandatory obligations and the objective transition atomically. A single effect does not imply objective closure. Terminal objects require explicit correction rather than mutation/reopening.

Retry needs the original immutable intent, positive absence, an explicit bounded Current policy, optional distinct independently verified compensation, and current A3 authority/lease/privacy plus continuation fence. The durable RETRY_SAFE_VERIFIED authorization is exact-version-bound, expiring and single-use. Policy and source record/version/digests are checked again at the B3 RELEASE linearization point. B4 has no submission permit or transport. Repeated calls and stale predecessors do not acquire another dispatch. A new release invalidates the old attempt-version effect proof; history is retained.

Recovery reconstructs the actual canonical/enforcement state, exact declared roots and Current dependencies, mandatory root coverage, authority/privacy/resource/revocation evidence, effect proof state and active continuation ownership. Required UNKNOWN/inactive semantics survive reconstruction and hold admission rather than being defaulted. The result is readonly recovery evidence, with continuity_ON=false and authority_effect=NONE; it is not IRIS admission or operational activation.

Qualified checkpoints bind workflow, step, payload digest, effect/replay classification, exact Current qualification and active continuation. Resume independently reconstructs persisted state, checks the current owner/successor fence, expiry and exact payload/source qualification, then rechecks the complete snapshot after the async Current lookup. Effectful steps never automatically replay. Provider session labels cannot manufacture a canonical checkpoint.

Verified projection is one operation over the pinned actual store snapshot. It records a distinct PROJECTION_RUN occurrence, as-of cut, full canonical/enforcement bracket, exact dependency versions and temporal availability, conserved root facts, source evaluations, output, content hash and completeness. Two identical contents remain two runs with one identical content hash. It is an internal, non-authoritative reconstruction projection, not a B6 Personal-Office classifier or E1 score. UNKNOWN meaning remains visible and incomplete.

Prospective prediction linkage is only an existing B2 typed record/version reference associated with the intent/work/causal episode, already present in the original preparation prefix and recorded before preparation. Late backdating fails. B4 defines no prediction ontology or ledger; upstream prediction meaning remains with its existing owner. Source classification separates qualification fixtures from live-source readback, carries no authority and does not count independent experience. A2 causal occurrence identity still governs that count.

## Ownership and protected boundaries

B1 semantic reducers and identity/time/epistemic constitution remain unchanged. B3 authority contracts, captured request/command boundaries, sole dispatch owner and permit model remain unchanged. Migrations 001–007, including B3_CANONICAL_CAPTURE_COUNT and append-only guards, retain exact bytes. B4 adds only migration 008's command-kind extension in the existing store; there is no new database or truth/Current/authority plane.

One necessary B2 representation correction is disclosed: restored MemoryCanonicalRepository owns a private appendable journal array while keeping each imported command immutable. The prior implementation froze the container itself and could reconstruct but not continue writing. This is an implementation correction required by B4's restored-write path, not a semantic gate reopening. The exact accepted parent counterexample is preserved in HELD-RESTORED-MEMORY-APPEND.log.

Legacy label-only verification/retry/recovery/checkpoint paths are fail-closed. All 922 inherited test observations remain present. Fourteen legacy observations now require canonical B4 proof instead of granting admission/retry from labels; 908 inherited expectations are unchanged. The 54 accepted B3 repair controls remain unchanged. Frozen Batch-A/Batch-C contracts, oracle vectors/proofs/source snapshots and earlier evidence remain unchanged. No Builder-authored expectation is represented as an independent oracle.

## Causal investigation — L1 -> L2 -> L3 -> L4 -> L5

### Restored memory continuation

L1: Cold readback can pass while the next canonical write fails. L2: Exact accepted-parent import followed by append reproduces a non-extensible-array TypeError. L3: Import froze the journal container, not merely its records. L4: This affects every subsequent canonical append after memory restoration, including B4 atomic materialization. L5: Event immutability must coexist with private append ownership. Competing causes were SQL guards, B4 enum shape and lifecycle payload validation; the pure accepted-parent memory probe excludes them. Earliest divergence is importEmpty container assignment. Reversal/falsification: imported elements remain mutable or restored append still fails. Smallest test: import then append. Action: retain frozen elements inside a new private array and qualify restored continuation in all four backend directions.

### Proof/canonical atomic causality

L1: A persisted proof must not survive without its canonical transition. L2: The SQL fault control fails the canonical insert after enforcement append and observes complete rollback. L3: Proof and materialization share the connection-pinned lock/transaction; memory validates all changes in a private working repository before commit. L4: Import/replay require the proof's exact historical prefix and its exact immediately following canonical materialization; the next event cannot capture a prefix before that materialization. L5: One governed causal occurrence is represented across two existing journals without a second truth owner. Competing cause: mere final-wire equality could conceal reordered history; multiple historical cuts and cold reconstruction discriminate. Boundary: local qualification SQL, not hosted durability. Falsifier: altered/missing materialization, prefix drift or a partial commit. Smallest test: injected second-journal failure plus exact before/after wire; action is atomic rollback and unchanged historical capture guards.

### Empty readback versus safe retry

L1: Empty current readback may precede a later landing. L2: PENDING/UNKNOWN finality yields UNKNOWN even with an exhaustive empty scan. L3: A temporal scan alone does not settle the dispatch. L4: Inferring absence could admit a second consequential release. L5: Positive absence requires qualified settlement, explicit expiring bounded policy and A3/fence validation at the sole durable release boundary. Competing cause: idempotency labels alone; fixture dispatch counters distinguish actual release from policy labels. Boundary: adapter settlement semantics are qualified-source obligations; synthetic tests are not provider observations. Falsifier: pending, stale, revoked, transferred or changed-policy/source evidence still dispatches. Smallest tests: pending scan and mutation between authorization/release. Action: reconcile; no blind retry.

### Persisted UNKNOWN versus qualified recovery

L1: A stored root can exist with UNKNOWN meaning. L2: Its exact epistemic payload survives a verified projection but completeness is INCOMPLETE and recovery/closure hold. L3: Temporal persistence is not epistemic qualification. L4: Incorrect PASS would contaminate checkpoint/resume and closure. L5: Required scope and A1 meaning govern all B4 admissions without a new classification plane. Competing cause: lost data versus false qualification; retained payload plus HOLD discriminates. Boundary: required canonical roots and exact Current dependencies, not universal knowledge. Falsifier: omitted mandatory root or UNKNOWN/inactive required meaning disappears or becomes PASS. Smallest test: append one required-root UNKNOWN fact. Action: preserve and requalify, never default away.

## Qualification and evidence boundary

QUALIFICATION.json provides final exact counts, commands, environment/dependency identities, zero-mutation accounting and protected-path checks. FOCUSED.log and FULL-REGRESSION.log preserve every final result; there are no excluded tests or success counted from cancelled/skipped controls. Four restoration directions include original shared-prefix events, proof-generated canonical advancement, later Current changes, canonical-only tails, succession, revocation, SUBMITTING/AMBIGUOUS and multiple as-of cuts with fresh-process readback. Restoration supports continued writes after import.

Preliminary qualification exposed malformed new fixture coordinates and a helper-edit TypeScript error. They were corrected and do not earn PASS. PRELIMINARY-QUALIFICATION.json reconciles those runs. The earlier complete 1082/1082 run covers the narrower intermediate source, not the final 186-control B4 candidate; only the final frozen-source focused/regression logs govern this return.

Execution is OFFLINE_ONLY: Node/PGlite fixtures and local source checks. No external consequential calls, deployment/Preview, credentials, live Redis/store mutation/ACL/rotation, provider configuration, Production, continuity ON, IRIS admission, BIG Activation, E1 mutation/scoring, remote ref/push/merge/PR or CI invocation. Authorized immutable Git objects and canonical evidence/acceptance-routing comments are source publication writes and are separately accounted for.

Preserve CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED.

NEXT OWNER = STRATA 8.6.9. NEXT ACTION = fresh independent exact-head B4 acceptance. NEXT GATE PROGRESS = B4 ACCEPTANCE. Aaron is not the technical courier. Builder does not self-accept or release a later gate.
