# B3 bounded repair — source candidate, independent acceptance required

Owner: CDA-owned Builder / BIG-OFFICE-DEVELOPMENT. Next owner: STRATA 8.6.9, exact-head B3 acceptance. B4 remains NOT_RELEASED. Builder qualification is not institutional acceptance.

Governing evidence: BIG #703/5972622859 (B2 acceptance/B3 release), #703/5973006096 and IRIS #3/5972989193 (held Builder return), BIG #703/5973134406 (mutable asynchronous invocation HOLD), and the user's direct STRATA 8.6.9 succession/causal-restoration repair dispatch. The fetched BIG bus still ended at #703/5973247903; the direct dispatch supplies the additional restoration requirement. No review ZIP was needed or consumed. #703/5973245955 explicitly leaves future learnability outside this repair.

Held HEAD: 3742bddbf4a48ab4a707b62df11cc241975b1ece. Held tree: 09ed49129fb620c951aa7a4d228e626bab120c4a. Its accepted B2 parent: d5f28f7eb5862d410e69751ddfbaab1035952c27. Repair is one new commit above that held B3 object, preserving its history and evidence.

## Correction and causal investigation

Only two runtime files change: src/enforcement/repository.ts and src/enforcement/backends.ts. New files are Builder-authored repair controls and documentary evidence. B1, B2, the A3 authority reducer/contract, all seven SQL migrations, all earlier tests, and all existing evidence/oracle artifacts retain held bytes.

### Mutable invocation / command boundary

L1: The actual held source fails whole-request replacement, nested attempt mutation, explicit retry mutation, accessor rejection, post-submit bookkeeping, and command mutation controls.
L2: A valid actor-A invocation can release independently prepared actor-B's attempt after an awaited preflight. A direct actor-A invocation of B rejects. Input accessor coordinates also evade the outer boundary because only intent was decoded.
L3: Repository command reduction and journal construction capture input at different times. A transfer changed inside the actual reducer's awaited history lookup can record command B with result A. The held full source fails both memory AtomicView and real SQL executor pause controls.
L4: The common defect is treating caller-owned invocation references as stable across queue/await boundaries. Capturing only intent, individual fields late, or only before reduction leaves related boundaries open.
L5: Capture and deeply detach the complete strictly decoded ReleaseRequest synchronously before any await. Reuse it for PREPARE, preflight, RELEASE, permit, submit, failure, ambiguity and COMPLETE. Verify returned prepared/claimed attempt, full intent/digest and fence match that invocation; actor/transport validation remains the same A3 boundary. Pin transport function references per invocation and recheck declared transport binding immediately before dispatch. Capture each command once before backend queue entry, then reduce and journal that same frozen value. Capture B3-exposed canonical commands/queries and attempt/reconstruction identities before backend work as well, without modifying B2 ownership.

Competing explanations: malformed B authority, transport mismatch, stale fencing, or journal replay error alone. Independently valid simultaneous A/B domains and direct actor mismatch controls discriminate against these alternatives. Earliest divergence is the public API boundary before its first asynchronous operation. Blast radius includes wrong-attempt dispatch and incoherent append-only replay. Falsification condition: any mutated caller object redirects submission/bookkeeping, any accessor executes, or command/result replay differs. Smallest discriminating controls: pause preflight with independently PREPARED A/B; pause a live reducer history lookup and mutate its original command. Action boundary: source correction plus offline qualification only; possibly submitted states still require reconciliation, never blind retry.

### Causal restoration / import

L1: Exact valid interleaved held snapshots restore to memory but fail fresh SQL with B3_CANONICAL_CAPTURE_COUNT.
L2: The SQL importer inserted every canonical command before inserting any enforcement event. Earlier events therefore encountered a later canonical prefix than their immutable recorded capture count.
L3: Replay validation itself correctly reconstructed each event against commands.slice(0, canonical_count), while import materialization discarded that cross-journal causal ordering.
L4: Two individually ordered journals do not authorize grouping one entire journal before the other. The event's count/digest is the explicit cross-journal relationship, including shared-prefix events and canonical-only tails.
L5: Within the existing connection-pinned lock transaction, insert canonical commands up to each event's original count, then insert that exact original event, then insert any remaining canonical tail. Existing snapshot validation, SQL triggers, historical counts/digests, command/result bytes and rollback discipline are unchanged. No enforcement event is regenerated.

Competing explanations: incorrect recorded counts/digests, malformed canonical histories, SQL serialization drift, or an overstrict capture trigger. Exact memory replay, SQL raw wrong-count rejection, and equality of complete original/restored snapshots discriminate against these explanations. Earliest divergence is inserting a canonical row beyond the first event's recorded prefix. Blast radius is valid cold restoration rejection, rather than permission to change history. Falsification condition: any original snapshot differs after restoration; any as-of cut, terminal safety state or prefix guard differs; any failed import leaves partial journals. Smallest discriminating control: valid historical event followed by canonical advancement imported into a fully migrated fresh SQL engine. Action boundary: preserve the guard and fix import ordering; rollback and HOLD on mismatch, not historical repair.

## Focused qualification

The same final 54 Builder-authored controls are run against an isolated, exact held source checkout and the repaired source. Held reproduction: 20 PASS / 34 FAIL / 0 cancelled / 0 skipped / 0 todo. Repair: 54 PASS / 0 FAIL / 0 cancelled / 0 skipped / 0 todo. This is a full-candidate counterexample/requalification, not a modeled excerpt or independent oracle.

| Control group | Count | Scope |
| --- | ---: | --- |
| Whole invocation mutation | 12 | Memory + SQL: attempt replacement, nested identity, retry, fence, intent, during-submit; independently valid A/B and direct actor mismatch |
| Outer accessor rejection | 8 | intent, attempt, fence, retry; getter never read; no submission |
| Command entry capture | 2 | Caller changes before queue work; exact command/result journal and memory replay |
| Actual reducer-await capture | 2 | Memory AtomicView with candidate reducer and real SQL paused history; exact journal and replay |
| Canonical/query/attempt/reconstruction capture | 2 | B3-exposed canonical append/history, getAttempt and reconstruct |
| Failure/ambiguity bookkeeping | 6 | Preflight failure, submit exception, bad receipt remain bound to original attempt |
| Strict malformed invocation rejection | 14 | Unmapped field, missing retry, null retry, array attempt, null fence, undefined intent, nested accessor; snapshot unchanged |
| Explicit proven-safe retry capture | 2 | NO_SUBMISSION_PROVEN retry true captured before caller changes; one submission only |
| Restoration direction matrix | 4 | Memory→Memory, Memory→fresh SQL, SQL→Memory, SQL→fresh SQL |
| Fresh SQL transaction/guard controls | 1 | Injected failure after earlier enforcement insertion rolls back both journals; nonempty import and raw wrong count rejected |
| Canonical-only history | 1 | No enforcement events; complete canonical tail imported unchanged |

Every restoration direction includes three distinct recorded canonical prefix lengths, shared-prefix enforcement events, later Current denial and correction, canonical-only tail, continuation transfer, revocation, simultaneous SUBMITTING and AMBIGUOUS_SUBMISSION attempts, full wire equality, six historical cuts (T0–T5), independent fresh-process reconstruction, and zero subsequent dispatch for possibly submitted attempts. Counts/digests/results are compared through exact wire equality; invalid counts/digests/results reject atomically. Repeated reconstruction is not a new independent operational occurrence.

The memory reducer pause uses the public candidate EnforcementBackend/AtomicView interface with the actual canonical repository, reducer and replay; it supplies only an awaited history gate and event storage, no modeled decision/expected result. SQL pause uses the actual PostgresEnforcementRepository and connection-pinned executor. All SQL restoration targets run all seven unmodified migrations in a fresh PGlite PostgreSQL 17.5 WASM engine. Cold SQL targets are closed and independently reopened by another Node process; cold memory targets import the exported snapshot in another process.

## Regression, toolchain and limits

Final full regression includes all 868 inherited held tests plus 54 new repair controls: 922 total, no replacement or deletion of earlier tests. Frozen logs and QUALIFICATION.json carry exact final results. Strict TypeScript 5.7.3 / @types/node 24.10.1 checks the B3 entrypoints and transitive source imports with noEmit, strict, noUnusedLocals and noUnusedParameters. Structural check covers 17 required tables only.

A preliminary repair qualification exposed two test-fixture errors: the reducer-await control tried to mutate a fixture-owned frozen successor identity. The control was corrected to deep-detach the entire caller command before mutating it. No runtime implementation change or expected-result weakening was made in response. The preliminary full-run log is preserved separately; only the final whole-suite result governs qualification.

Existing local dependency: @electric-sql/pglite 0.3.14; archive 6,803,270 bytes; SHA256 1e5a4ddec392f7edf604b5db8d679b822fab013c4004bbcb5ff58684d5712e38. Only the inherited pgcrypto extension-loading shim substitutes core sha256 for digest(text,sha256). Native extension loading, hosted provider durability, distributed multi-session locking and unbounded scale remain NOT_QUALIFIED. Builder tests are NOT an independent Batch-C oracle. No sealed oracle derivation or scoring is consumed.

Network qualification guard denies fetch/http/https/net/tls in parent and child processes. Zero attempts were logged. Consequential adapters are local fixtures. Qualification has zero live consequential/provider calls, deployments, Preview creation, credential generation, live Redis mutation, ACL/rotation, provider configuration, Production, continuity ON, IRIS admission, BIG activation, E1/Pilot scoring, merge or remote ref/PR mutation. Git immutable objects and canonical evidence comments are the authorized publication writes.

## Exact-object review route

The manifest records per-file Git blob/bytes/SHA256, runtime closure and protected-path checks. The external exact-head return records HEAD/tree/sole parent/merge-base, full delta including manifest, independent archive blob, and publication/readback verification. Digest algorithm: SHA256 over sorted UTF8 path + NUL + decimal byte count + NUL + file SHA256 + LF. The manifest excludes itself from its inner list to avoid recursive hashing; the external package includes it.

Maximum Builder disposition: IRIS_B3_REPAIR_SOURCE_CANDIDATE_READY / STRATA_8_6_9_EXACT_HEAD_ACCEPTANCE_REQUIRED / B3_GATE_OPEN / B4_NOT_RELEASED / NO_SELF_ACCEPTANCE.
SOURCE_EVIDENCE_GOVERNS_ON_CONFLICT / DELTA_RECONCILIATION_NOT_ERASURE / ACTIVITY_IS_NOT_PROGRESS.
