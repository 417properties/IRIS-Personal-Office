# CDA-owned Builder — B2 Canonical Domain / Schema / Repository

Governing release BIG #703/5971825021, continued by Fresh Current #703/5972224426. Accepted IBA clarification #703/5971926463 is consumed as governing source; Batch-C is accepted/CLOSED. No sealed oracle artifacts were read. Accepted B1 parent/base/merge-base 9801ef637801d4d8f54dc854c4d80ea17b1dfe6e, tree 87a53eac3ba67a93d39f54056cedb25ca83c0bba. Batch-A constitution dbde4cea846fa9c7c8a4ad7094f360db318eb292 preserved.
Local branch builder/iris-b2-canonical-repository-v1. Exact candidate HEAD/tree and immutable publication/readback are recorded in canonical IRIS #3 / BIG #703 return receipts; this document does not embed its own enclosing commit hash.

B2_SOURCE_CANDIDATE_READY / STRATA_RECONCILIATION_REQUIRED / NO_SELF_ACCEPTANCE / NO_NEW_GATE_PROGRESS.

## Result and exact version boundary

src/state/repository.ts now defines the validated CanonicalRepository semantic interface. MemoryCanonicalRepository and PostgresCanonicalRepository consume the same command validator, B1 lifecycle/effect reducers, replay validation and principal/as-of reconstruction. Neither exposes Maps, a live SQL executor or mutable record references.

IRIS_B2_V1 owns persistence DTOs; IRIS_B1_V1 remains the semantic owner. Every record carries exact principal/object identities, contiguous version, immutable stream binding, event ref, evidence/provenance/privacy/authority refs, versioned relation refs, temporal coordinates, typed payload and retained source representations. No principal, proof, recording time, disposition or A1 state is inferred from a source token. A record/event ID is not an independent causal experience.

The previous mutable implementation is isolated in src/state/legacy-repository.ts as IRIS_LEGACY_V0, with LegacyRepository/LegacyMemoryRepository/exportLegacySnapshot/importLegacySnapshot names. Its clients receive ONLY mechanical import/type/function renames. Their historical algorithms and regression observations are retained, not admitted as B2 canonical state or requalified whole-stack behavior. Old domain DTOs have explicit V0 ownership comments. No V0 snapshot can enter the B2 importer.

This is an explicit boundary, not a claim that B3–B6 callers have adopted the new interface. They must migrate through the dependency owner; V0 shortcuts cannot serve as accepted canonical evidence. The candidate contains no live routing/deployment or automatic continuity admission.

## B1 consumption map

| B1 owner | B2 consumers | What B2 does not infer |
|---|---|---|
| validation.ts | canonical.ts, source-dto.ts, repository.ts | No case folding, default principal, missing coordinate erasure or implicit proof. New array/JSON guards also reject accessors, extra/symbol array keys and duplicate JSON coordinates. |
| identity.ts | record/command identities, explicit versioned record refs, relations/occurrences | No prefix parsing, shared-context equivalence or new experience from a representation. Metadata-only identity kinds are explicitly B2-owned, never passed off as a new B1 semantic kind. |
| epistemic.ts | epistemic, ItemFact, Current and entity payloads | All knowledge/applicability/freshness/coverage coordinates retained independently. Supplied disposition is validated by B1; B2 introduces no implementation-local scalar precedence rule. Accepted compound-reason representation is preserved under IRIS_ROOT_DISPOSITION_V2; B6 owns the qualified selector. |
| temporal.ts | decodeRecord, history/reconstruct/current | Recorded knowledge and effective validity remain separate. Half-open expiry/revocation/supersession and requalification are re-evaluated at the explicit cut. |
| lifecycle.ts | every revision of persisted LIFECYCLE/EFFECT | Result must exactly equal B1 reduction of prior state and explicit event. Labels/refs are structural proof declarations, not independent source verification or earned closure. |
| continuation.ts | persisted continuation representation | Exact owner, causal episode, generation/fence and admission refs retained. Updating continuation is held for B3; no atomic transfer or release authority is implemented. |
| representation.ts | source/domain mapping and kernel envelopes | Exact total admitted spellings preserved; many-to-one source spelling retained. CLOSED/UNSATISFIED cannot manufacture a terminal lifecycle. |

## Domain / DTO / SQL / reconstruction matrix

| Domain representation | Command/query DTO | SQL representation | Reconstruction / inverse map |
|---|---|---|---|
| Every B1 IDENTITY, EPISTEMIC, ITEM_FACT, RELATION, CAUSAL_OCCURRENCE, CONTINUATION, TEMPORAL, LIFECYCLE, EFFECT | IRIS_B2_V1 CanonicalRecord, AppendCommand, AsOfQuery, ReconstructionDTO | iris_b2_journal.command exact JSONB plus identity/version columns; required-key/type/enum/time/evidence/payload-binding predicates | Strict replay + detached frozen views/history; domainToDTO/dtoToDomain validate without dropping coordinates. |
| Current | B1 epistemic + typed opaque subject/predicate/value, explicit ASSERT/CORRECTION/SUPERSESSION/REVOCATION/EXPIRY event | Same append-only journal; single stream per principal/subject/predicate and explicit event identity | Select recorded/effective version at cut, then evaluate validity; expired/revoked/future-observed replacement does not resurrect predecessor. RECORDED_AS_OF is not a KNOWN/verified/complete/authorized label. |
| Principal, Orientation, EvidenceOccurrence, ActionDecision, ActionIntent, ActionReceipt, AuthorityPolicy, PrivacyPolicy, CapabilityProcedure, LearningRecord, WorkEpisode | IRIS_B2_ENTITY_V1 explicit source descriptor + supplied B1 epistemic context | Strict descriptor shape/enums/required/NULL checks; entity/principal/object/version mirrors | Original source fields/spelling preserved as metadata, never promoted to capability admission, authority, effect proof or closure. |
| Objective, Obligation | B1 LIFECYCLE plus exact retained OBJECTIVE_V0 / OBLIGATION_V0 source | Source/domain semantic-state and identity/version consistency | Explicit B1 legacy maps and reverse source preservation; ambiguous legacy state HOLD. |
| EffectVerification | B1 EFFECT plus retained EFFECTVERIFICATION_V0 source | Exact disposition/proof-kind/source map checks | Intent/operation/occurrence conserved; verification labels remain source declarations pending B4. |
| CurrentAssertion | Explicit Current + retained CURRENTASSERTION_V0 fields | Predicate/subject/value must match retained source | V0 VERIFIED/QUALIFIED/FRESH/COMPLETE is retained metadata; no implicit positive A1 conversion. |
| Compound-reason disposition | IRIS_ROOT_DISPOSITION_V2 preserves root/principal/cut/boundary/consumer, full B1 epistemic/lifecycle/holder state, purpose/recipient/disclosure declaration, typed reason_set, primary visible claim, safe visible subset and invalidator/reactivation/provenance | Strict new payload shape/reason types/evidence and coordinate binding; prohibited disclosure forbids a private secondary reason in the visible subset | All internal reasons survive export/import/SQL/fresh process. projection_qualification is always NOT_ADJUDICATED; B6 still owns qualified precedence/selection. |
| Source relations | Exact record_id + typed object + version refs | Append-time same-principal/record/version/recording-cut integrity | Domain source relation catalog conserves objective/episode/intent/receipt/causal refs. Missing, foreign, future or undeclared ref HOLD. |

All 15 inherited DTO descriptors are declared in source-dto.ts. Legacy/source maps are explicit and bidirectional where admitted; absent B1 coordinates must be supplied as canonical context. Unsupported conversions HOLD. The seven B2 metadata identity kinds cover orientation/evidence/capability/learning/authority-policy/privacy-policy/action-decision records; they add no release or qualification semantics.

## Migrations 001–006

These are bootstrap schema source changes only. No deployed database migration was performed; no existing production-upgrade claim is made.

| Migration | Alignment |
|---|---|
| 001 | Existing foundational tables gain explicit IRIS_LEGACY_V0 decoder ownership, positive-version, JSON container and source-enum checks. Adds IRIS_B2_V1 journal/lock and strict required/NULL/shape/state/evidence/time/source/identity/ref constraints. Append-only update/delete/truncate guards. |
| 002 | Work Episode V0 ownership, version/generation and JSON constraints; causal/continuation representation lives in canonical journal. No ownership transfer enforcement. |
| 003 | Action/effect/policy V0 ownership and source enums/versions/JSON constraints. Canonical journal preserves separate intent/receipt/effect/verification identities. No live verification/retry/authority grant. |
| 004 | Instrumentation/quarantine V0 ownership and structural JSON/version constraints. No telemetry dispatch. |
| 005 | All transition tables gain explicit V0 ownership and structural constraints. Missing bounded-validity JSON keys and ADMITTED with NULL expiry now fail closed via explicit coalesce/nonnull checks. Existing authority algorithms/triggers are not claimed as B3 repair. |
| 006 | Projection tables gain explicit V0 ownership and structural constraints; immutable source seed retained. No Pilot classifier, projection computation, scoring or E1 rewrite. |

migrationFiles now enumerates all six in order. A single qualified journal is the B2 persistence representation; legacy relational rows cannot bypass its importer or masquerade as B2 truth. Old source table domains are preserved as versioned source spelling, not silently replaced with canonical meanings.

## API and transaction/reconstruction semantics

Append validates schema, principal/object registration, exact prior version, immutable stream binding, monotonic recording knowledge, evidence/provenance, source/domain mirroring and explicit same-principal/versioned refs. Every persisted command is revalidated during read/reconstruction/import. Any malformed stored history holds rather than falling back to a latest row.

SQL requires a connection-pinned TransactionalSqlExecutor.transaction callback; pool-level BEGIN/COMMIT emulation is not accepted. Append/import lock a durable singleton, revalidate inside the transaction and commit one journal append or the complete validated empty-store import. SQL uniqueness and append-time integrity guard gaps, duplicate identities/occurrences, Current streams and dangling/foreign/future refs. Memory repeats validation at its atomic append/import boundary. Imported state cannot replace an existing store.

Snapshot wire declares schema, records and replayable commands. Duplicate JSON coordinates, unknown/missing/NULL fields, sparse/accessor/symbol arrays, journal/record disagreement, duplicate events, version gaps and invalid relations reject before mutation. SQL rollback after an injected third-insert failure is observed against the actual engine, not a canned executor.

Reconstruction carries history plus selected views and temporal predicates, original A1 uncertainty, lifecycle/effects, entity/policy metadata, explicit relations, continuation owner/fence and evidence refs. It always returns admission=NOT_ADJUDICATED. Policy/closure/qualification refs are preserved evidence, not admission permission. B4 owns next-safe-action/admission/qualified-checkpoint/projection judgments after B3.

## Qualification and proof limits

Final results: 337/337 inherited + B1; 153/153 focused B2; 490/490 full, zero fail/skip/cancel/todo. Strict TypeScript and structural check PASS. See QUALIFICATION.json and exact focused/full logs. All tests are Builder-authored conformance or inherited historical regression; no independent oracle or gate-closure credit is asserted.

The SQL engine is @electric-sql/pglite 0.3.14, PostgreSQL 17.5 WASM. All six migration SQL bodies execute locally. ONLY the historical create-extension pgcrypto statement is replaced in the qualification harness with digest(text,'sha256') implemented using PostgreSQL's core sha256(convert_to(...,'UTF8')). Production migration source retains pgcrypto. This does not qualify native extension loading, hosted/provider durability, multi-connection/distributed locking, performance at unbounded scale or operational experience. Native packaged PostgreSQL was explored but could not run under the root-only UID namespace; no system user was created and no privilege escalation was used.

The focused suite covers common memory/SQL commands, immutable reads, concurrency/version collision, historical Current/expiry/revocation/supersession/observed/recorded knowledge, terminal correction guards, malformed/UNKNOWN/NULL/unknown-schema negatives, exact DTO/source/state representations, relation integrity, atomic snapshot import/rollback and fresh-process memory + file-backed SQL reconstruction. 504 epistemic coordinate inputs are checked: 432 admitted and 72 rejected by B1, with SQL agreement. All 5 lifecycle, 5 decision and 10 effect states/proof kinds; all 18 B1 plus 7 metadata identity kinds; all 8 supplied dispositions; all temporal coordinates; all 15 source DTOs and inherited enum tokens are represented without a new precedence or semantic reducer.

Dependency retrieval is recorded separately from qualification. Qualification denies fetch/http/https/net/tls dispatch, including child readers, and records zero attempts. No provider/environment/custody/credentials are consumed by tests.

Reproduction: npm ci --ignore-scripts --prefix scripts/qualification, then npm run qualify --prefix scripts/qualification. This installs only the locked qualification dependency, not application provider dependencies. IRIS_B2_PGLITE_MODULE may identify an already-downloaded exact package. Strict TypeScript uses 5.7.3 with noEmit/strict/noUnusedLocals/noUnusedParameters/ES2022/nodenext/allowImportingTsExtensions on the new canonical domain/map/repository entrypoints (imports include the remaining new modules and B1). The inherited static table check is recorded as structural only.

## Residual dependency owners and blockers

| Owner | Still required; not earned by B2 |
|---|---|
| B3 | Total live authority/privacy/lease checks, consequential caller migration, immutable intent/release-attempt enforcement, atomic continuation compare-and-transfer/fencing, one-time release. |
| B4 | Qualified compound-reason selector/projection adoption remains B6; actual evidence verification, mandatory obligation/effect closure reconciliation, next-safe-action and shared admission reducer, qualified workflow checkpoints, verified projection snapshot/run operation; adoption of canonical reconstruction instead of V0 admission logic. |
| B5 | Qualification/routing/perception/retention/communication caller adoption and ICCP seams; original ranking/classification algorithms unchanged. |
| B6 | Pilot/interface adaptation, complete root/destination/coverage consumption and integrated qualification; E1 frozen. |
| STRATA / Professor | Exact B2 reconciliation; independent Batch-C and subsequent consolidated/independent gates. Historical green tests and this source candidate do not satisfy these gates. |

There is no named B2 semantic choice requiring Founder redesign. The journal is a bounded source candidate, not a merge/deployment/provider or whole-stack readiness decision. Native/provider/multi-session/distributed operational proof remains outside this offline qualification. V0 clients are explicit residual migration dependencies; their PASS observations are historical only.

## Source/independence ledger

Consumed exact accepted Batch-A artifacts 01,07,13,17,18,19 and B1 plan/caller inventory. Accepted semantic-kernel and constitution bytes remain unchanged. Sealed audit, historical qualification, replacement E1 and Pilot evaluation inputs are unchanged.

During canonical navigator reconstruction, the comments connector also returned the public Professor status comment #703/5971862432, including its routing question. No sealed Batch-C artifact, vector or proof package was opened or used to derive these tests. Later canonical readback disclosed STRATA acceptance #703/5972224426; its governing source clarification #703/5971926463 was then read and applied to B2 representation work. The public adjudication contains rule/inventory summaries; no hidden package/answer vectors were inspected. Source-derived compound-reason tests are from IBA clarification, not oracle vectors. This incidental public receipt exposure is disclosed; Builder authored tests from accepted Batch-A/B1 only, introduced no local scalar-disposition precedence and awards no independent-oracle credit. The independent oracle author remains a separate institutional lane; this Builder return is not routed to it as expected truth.

## DEEP v2 findings / predictive reconciliation

L1: the inherited repository returned mutable maps and imported unvalidated JSON; SQL used effective_to-is-null without principal/cut. L2: memory/SQL/source adapters encoded incompatible Current and enum meanings. L3: the root is multiple unchecked semantic owners plus missing versioned persistence boundaries. L4: authority/recovery/projection could consume contradictory states despite local green tests. L5 conditional blast radius: continuing caller adoption without an owned seam could amplify unsafe release, lost obligations or overstated institutional truth.

One layer deeper: adding another helper alone would retain the defect. B2 therefore makes the canonical interface the validated entrypoint and explicitly quarantines V0 clients, rather than interpreting their existing green tests as canonical repair. A second deeper challenge: SQL CHECK's UNKNOWN truth value and missing JSON keys can defeat a seemingly complete schema; explicit NULL/required checks and actual PostgreSQL-engine controls discriminate this.

Competing causal explanations: harmless spelling differences versus loss of state/principal/time/evidence meaning; storage-only immutability versus caller bypass; parser error versus SQL descriptor variable/column collision. Earliest divergences are entrypoint selection, DTO decode and record/current selection. Evidence boundary is exact source plus local tests, not independent oracle or live/provider experience. Blast radius is the canonical boundary and every later caller still using V0. Reversal/falsifier: a lossy source map, SQL/Memory disagreement, future-known fact in historical view, mutable returned ref, invalid import partial write or a later caller claiming V0 as accepted canonical evidence.

Smallest discriminating tests: identical adapter commands/cuts; real SQL source/record validation; malformed snapshot import with before/after identity; actual mid-transaction rollback; child process reopening persisted SQL with only a query descriptor. These caught and corrected the SQL descriptor variable collision; qualification expectations were not weakened. Action boundary: freeze candidate, read back exact object and route to STRATA. Wait boundary: no B3/merge/deploy/admission follows without the governing release. Test boundary: native extension loading, multi-session/provider operation and whole-stack semantics are not represented as proven.

Prediction B2-P1: later B3–B6 adoption will use this versioned boundary and B1 reducers, without a second Current/enum/transition owner. Reconcile at consolidated qualification; a V0 bypass or lost coordinate falsifies it. Prediction B2-P2: native PostgreSQL should agree on the B2 SQL domains and transactions; native pgcrypto loading/multi-session operation remain uncalibrated, not assumed passed. Synthetic repetition/cold subprocesses of one fixture do not mint independent operational experience.

## Preserved posture

BATCH_A_CLOSED / B1_GATE_CLOSED / BATCH_C_GATE_CLOSED / FIRST_TWO_OFFICES_STAGE_B_CLOSED / CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED.
Zero provider writes/deployments/Previews/credentials/live Redis/ACL/config changes, no continuity ON, merge, Pilot scoring or E1 mutation. Publication is immutable source/evidence objects plus authorized canonical comments, with local branch only. Aaron is not the technical courier.

## Fresh-Current delta reconciliation

While B2 was active, Batch-C closed under STRATA #703/5972224426, and the IBA source clarification requires a versioned compound-reason record for B2/B6. This candidate incorporates that required representation without reopening accepted B1, altering the frozen oracle, or inventing a selector. The serializer validates supplied coordinates, typed reason/evidence bindings and safe visible subsets. It never awards projection qualification or computes B6 selection/eligibility; the full source-qualified selector and governed oracle conformance remain later owners. Both adapters and fresh-process reconstruction preserve the new complete reason population. Earlier test counts are superseded by final QUALIFICATION.json/logs, with no erasure of historical scope.

B1 ItemFact remains a version-owned kernel/input fact, not a qualified consumer-specific compound-reason projection. IRIS_ROOT_DISPOSITION_V2 is the required boundary representation; neither a persisted scalar fact nor its original helper validation substitutes for the B6 source-qualified selector.
