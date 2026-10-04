# Sealed independent IRIS whole-stack implementation-conformance return

`IRIS_WHOLE_STACK_INDEPENDENT_CONFORMANCE_HOLD / B6_PRIVACY_PROJECTION_DISCLOSURE_BYPASS / STRATA_RECONCILIATION_REQUIRED`

Governing release: [BIG #703/5976372734](https://github.com/417properties/BIG-Navigator/issues/703#issuecomment-5976372734). Next owner: STRATA 8.6.9. This return stops implementation acceptance. It grants no IRIS admission, continuity ON, production authorization, office activation, or BIG Activation. Accepted architecture is not reopened.

## Admission and identity

`WHOLE_STACK_STARTING_CONTEXT_CHECK = PASS`

Admission was explicitly recorded before reading candidate source/results or prior acceptance discussions. Starting context contained the assignment, exact object identities, architectural/gate requirements, and the attached BIG Integrated DEEP Investigation + Predictive Metacognition v2 method. It contained no candidate predictions, Builder/STRATA individual-vector conclusions, prior candidate scores, E2/E3 labels/answers, prior case handling, or hidden score-derived configuration. This evaluator is not Builder, STRATA, IBA, oracle author, E2 evaluator, E3 scorer, or a prior candidate executor. No agents were delegated and no prior personal context was retrieved.

| Object | Exact commit | Exact tree |
|---|---|---|
| Implementation candidate | c8118a013c926aa74c44dacc2469498dc24d78f2 | 24ee3ee13ac9a3859376bb94161e58da09dccf5c |
| Accepted Batch-C oracle | 16afe73531c1227963b403cd63b97f6a5afbc8fe | 35aaad21bff6ca401fe86640e425b8d1e643062a |
| Frozen replacement E1 | 849deca383add66773ab1ba0c8bc0ca852523c8f | fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4 |

Candidate sole parent: `9e10e3ab6aaf21dea0c327945e5780070cea0193`. Oracle sole parent: `889341d0abb17d896701726448b62d2d2891149f`. Git API metadata matches the release. Oracle manifest blob: `cb976069776c9ce1ee191fb4148956afd12711f1`. All 67 payload byte counts, SHA-256 hashes and Git blob identities verify. Its aggregate seal is exactly `a52111862f7878c0d77eb63364d6100aa1d8f2576c467e572f0a3dd643f07e72`.

145 candidate source/schema/script/test blobs and all 68 oracle blobs, including the manifest, were materialized at exact immutable refs. Local patch transport added one newline; it was removed only where removal restored the exact expected Git blob hash. This was serialization correction before qualification, not implementation repair. All 213 materialized blobs remain byte-identical after execution. Source inventory and hashes are sealed separately.

E1 commit/tree metadata verifies. The release's population identity remains 40 cases / digest `32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f`. No E1 payload was materialized, regenerated, relabeled, scored, or reinterpreted. This does not claim an independent rehash of the unconsumed E1 population. E2/E3 label assets and prior Builder acceptance logs were excluded.

## Execution and bounded results

Observation window: this fresh evaluator session, 2026-10-04 UTC. Fixtures use the candidate's explicit synthetic as-of cut, not live operational time. Runtime: Node 24.19.0. SQL engine: PGlite 0.3.14, ephemeral PostgreSQL/WASM. The candidate SQL fixture applies the exact migration roster with its declared historical pgcrypto digest shim; native/hosted PostgreSQL is unqualified. Dependency installation occurred outside the candidate snapshot. Qualification processes and cold readers ran with the exact candidate network-denial preload; no production/provider traffic was exercised.

The candidate's semantic-kernel and selector regressions were independently executed: 201 pass, 0 fail. Those are Builder-authored regression assertions, not 201 independent oracle qualifications. The independently chosen privacy negative subsequently fails. Green regression results therefore do not establish whole-stack health.

The counterexample uses candidate fixture construction helpers for syntactically valid canonical state, never as the source of expected behavior. Expected behavior was fixed by the accepted independent oracle and IBA clarification before the synthetic output was observed. A unique synthetic private evidence reference was placed in a retained compound's disclosure reason and internal provenance. The exact canonical privacy policy remains `disclose = DENY`; use and retention are allowed. An isolated snapshot import qualifies the internal reference basis without changing candidate code. A new projection run is requested through `candidateInterface -> PersonalOffice.attention -> CanonicalPilotService.project/read`.

| Observable | Memory | SQL/WASM |
|---|---|---|
| Authorized baseline primary | KNOWN_REQUIRED | KNOWN_REQUIRED |
| Prohibited-boundary primary | PRIVACY_EXCLUDED | PRIVACY_EXCLUDED |
| Private reference in returned external projection | TRUE — failure | TRUE — failure |
| Private reference after snapshot reconstruction/replay | TRUE — failure persists | TRUE — failure persists |
| Private reference in fresh-process Memory successor | TRUE — failure persists | TRUE — failure persists |
| Internal compound reason/evidence retained | TRUE | TRUE |
| Replay and cold content hash equal original | TRUE | TRUE |
| Continuity / authority / admission | OFF / NONE / NOT_ADJUDICATED | OFF / NONE / NOT_ADJUDICATED |

Both counterexample programs exit 1 at the intended independent non-leak assertion, after recording complete results. This is an oracle falsifier, not a runner/setup failure. The two final snapshots are byte-identical: SHA-256 `d2c2629f1c27890b49bcb45d6416a1ef36138bd9d8db11f5ce543e610ac70e50`. Projection content hash in both: `991c913a4b444ab6dd9f6159b173eef49d77b82cdc1811348de822bb645b72b7`. This stable hash certifies equality of the unsafe projection, not its privacy admissibility.

The returned prohibited root contains:

```json
{"primary_visible_disposition":"PRIVACY_EXCLUDED","reason_set":[{"reason_id":"reason:DISCLOSURE","reason_type":"DISCLOSURE","canonical_code":"PROHIBITED","evidence_refs":["PRIVATE_EVIDENCE_REF:independent-synthetic-confidential-marker"]}]}
```

No real private data or real evidence reference was used. No live disclosure is claimed. The observed failure is the candidate interface returning unauthorized synthetic content in a declared external projection.

## F01 — material defect register and DEEP analysis

Identity: `F01 / B6_PRIVACY_PROJECTION_DISCLOSURE_BYPASS`. Candidate state: CANDIDATE. Source architecture/oracle: accepted CURRENT qualification requirements. Evidence: OBSERVED immutable code/identity reads; TESTED_SYNTHETIC execution; INFERRED structural consequences; UNVERIFIED live deployment exposure. Severity: material qualification falsifier at the exact recipient/purpose projection boundary.

**L1 — surface symptom.** The prohibited-boundary projection selects the right primary but returns the disclosure reason's raw private evidence reference. Internal history remains intact. Memory, actual SQL/WASM, export/import replay, and fresh-process readback reproduce the same failure. Counterexample: ordinary authorized baseline works; continuity remains OFF. Thus neither general fixture failure nor wrong primary is the observed defect.

**L2 — direct mechanism.** In `src/personal-office/pilot.ts`, compile calls B5 `filterPrivacy` with `retain:true, disclose:false`. That helper correctly conditions disclosure enforcement on the requested operation. B6 then filters reasons only by `reason_type === 'DISCLOSURE'`, copies the entire reason objects including arbitrary `evidence_refs` into `visible`, builds `public_output`, persists it, recomputes it on read, and returns it through the candidate interface. No final disclosure qualification of that outgoing representation occurs. Exact code anchors are lines 35, 39–40, 51–52 and 83–88 at the frozen candidate. `src/capability/privacy.ts` lines 13–18 show the operation-sensitive guard. The B5 helper does not by itself establish safety for the later B6 return.

**L3 — enabling systemic defect.** A reason's category is treated as sufficient to make its complete serialized body privacy-safe. Internal truth/retention qualification is composed into an external projection without qualifying the actual fields/references returned for the exact purpose and recipient. The schema admits opaque reason/evidence strings, and B6 does not make a separate content-sensitive disclosure proof mandatory at that return seam. This is a compositional implementation defect under the existing A3 and Q-DISPOSITION contracts.

**L4 — integrated institutional pain.** B1 primary selection, B2 persistence, B4 pinned-prefix verification, and B6 reconstruction can all preserve the same unauthorized payload. A consumer receives stable proof hashes and `SOURCE_QUALIFIED_PINNED_AS_OF` while the privacy invariant remains false. Durable correctness amplifies reproducibility of the privacy error. The independent qualification gate catches the mismatch; the observed green helper regressions would not have caught it alone. Broader organizational incentives or ownership history have not been established.

**L5 — conditional structural risk.** If new records can put sensitive or resolvable references in retained disclosure reasons and the same outbound path is used, future attention/readback calls can repeatedly expose those references. If a downstream resolver has independent access, reference leakage may expand to private content. More recipients, adapters and durable replays can broaden the blast radius without changing the primary label. These are conditional forecasts, not observed production incidents. The earliest potentially irreversible point is a real unauthorized recipient obtaining the returned reference; that point was not crossed by this synthetic offline qualification.

**One-layer-deeper challenge.** What would have to be true for the apparent raw-reason-copy root itself to be another symptom? A deeper implementation assumption could classify all DISCLOSURE reasons as intrinsically safe, or an unobserved external delivery guard could be responsible for sanitization. Discriminating evidence: the decoder admits the marker, the exact privacy policy denies disclosure, compile requests internal use/retention, and the public candidate interface returns the marker. The marker also survives cold reconstruction, so storage drift is disconfirmed. A mandatory downstream sanitizer could reduce a particular hosted blast radius but would not satisfy this admitted interface's oracle requirement. Source contains the actual unguarded public return. Organizational origin and all external delivery adapters remain `DEEPER_CAUSE_UNRESOLVED / DATA_LINKAGE_GAP`. No circular recursion or inferred architecture redesign follows.

**Competing hypotheses and discriminators.** (1) Candidate/oracle identity mismatch: disconfirmed by commit/tree/blob/package seals. (2) Invalid synthetic input: disconfirmed within the candidate contract by successful canonical import, exact policy/reference binding, projection compilation and durable readback; the reference is permitted internally, disclosure remains DENY. (3) Different storage semantics: disconfirmed in the exercised domain by byte-identical Memory/SQL snapshots and same fresh-process output. (4) Authorized generic disclosure reason: disconfirmed by raw marker copying under an explicit DENY policy without a separate authorization to disclose that reference. (5) A hosted wrapper sanitizes: UNVERIFIED and immaterial to the local candidate interface failure; an exact downstream payload readback would discriminate operational exposure.

**Confidence triplet.** Outcome confidence: high for this bounded falsifier, repeated through both engines and fresh-process readback. Causal model confidence: high for the code-level bypass, limited for organizational/deployed consequences. Evidence sufficiency: sufficient for HOLD, insufficient for whole-stack PASS or claims about production. Forecast method reliability: UNCALIBRATED; no matched empirical calibration history or numerical probabilities are claimed.

**Action boundary / value of information.** Acceptance is stopped. STRATA owns reconciliation and any subsequent Builder dispatch. Evaluator performed no repair. The cheapest next discriminating qualification is the same opaque-reference negative against a separately identified repaired candidate, requiring retention of the full internal reason set while the outgoing representation is redacted/rejected. Additional engine permutations have low immediate decision value once this required invariant is falsified.

## Proof-to-semantics traceability

Accepted clarification: BIG #703/5971926463; accepted oracle receipt: BIG #703/5972224426. The governing oracle's `QD-PRIVACY-ALL / P-QD-PRIVACY-ALL` requires only privacy-safe external reasons and forbids unauthorized values/resolvable references. `QD-PRIVATE-SECONDARY-NEGATIVE / P-QD-PRIVATE-SECONDARY-NEGATIVE` specifically rejects/redacts unauthorized detail/reference embedded in a visible projection; primary selection alone is insufficient. `QD-ROUNDTRIP-COLD / P-QD-ROUNDTRIP-COLD` requires safe prohibited-boundary views after reconstruction. Those privacy constraints are falsified in the exercised reference-leak class; this does not claim exhaustive execution of every case in those vectors.

`WS-TERMINAL-PRIVATE-INAPPLICABLE / P-WS-TERMINAL-PRIVATE-INAPPLICABLE` carries the integrated no-private-egress invariant; its private-root subconstraint is falsified, while the exact terminal overlap variants were not independently executed here. `WS-WHOLE-CALLER-CLOSURE / P-WS-WHOLE-CALLER-CLOSURE` requires actual reachable callers to reach the invariant seam. The concrete candidate-interface return bypass is mapped; the complete transitive inventory of every other consumer is unqualified.

The trace is: source A3/Q-DISPOSITION -> accepted oracle constraints -> exact compound/policy/reference fixtures -> B5 internal-use filter -> B6 raw disclosure-reason renderer -> B4 pinned-prefix proof/B2 journal -> read reconstruction -> Personal Office candidate-interface return -> independent non-leak assertion. No expectation was derived from candidate behavior. The vector disposition ledger preserves all 419 vectors as either bounded falsified constraints or UNQUALIFIED; none is silently converted to PASS.

## Release scope disposition

| Required scope | Result / boundary |
|---|---|
| 1. Identity/integrity | Verified exact candidate/oracle metadata and materialized blobs; complete oracle seal |
| 2. B1 kernel | 201 combined kernel/selector regression assertions pass; independent universal conformance UNQUALIFIED |
| 3. B2 domain/schema/reconstruction | Actual Memory/SQL import/projection/export and cold Memory successor exercised for F01; broader state/schema matrix UNQUALIFIED |
| 4. B3 authority/continuation/effect release | Existing fixture enforcement state consumed; all independent mutation/race schedules UNQUALIFIED |
| 5. B4 verification/recovery/closure/retry/checkpoint/projection | Pinned projection proof/readback exercised; hashes stable; wider obligations UNQUALIFIED |
| 6. B5 capability/perception/BIRE/ICCP/Nervous System/adapters | Exact B5 privacy binding consumed; B5-to-B6 disclosure composition falsified; other families UNQUALIFIED |
| 7. B6 Q/root/coverage/Personal Office/Pilot/interface | Material privacy failure through public interface; correct primary does not close conformance |
| 8. Cross-layer counterexamples | Internal use/retention versus outbound disclosure, durable unsafe projection, Memory/SQL/cold replay exercised |
| 9. D01–D20 recurrence | Separate register records bounded falsifiers and all unqualified classes |
| 10. LIVE/persistence/REPLAY/RETRY/reconstruction identity | Kernel regression covers causal identity; tested projection replay keeps run/content identity; complete empirical occurrence chain UNQUALIFIED |
| 11. No experience inflation | No fixture result promoted to empirical experience; exhaustive candidate telemetry/IEF count proof UNQUALIFIED |
| 12. No authority expansion | Tested outputs consistently NONE/OFF/NOT_ADJUDICATED; all other authority-bearing callers UNQUALIFIED |
| 13. Memory/SQL and historical as-of parity | Same explicit fixture cut, equal final snapshots/hashes and cold successor output; all historical cuts/native SQL UNQUALIFIED |
| 14. Proof-to-semantics | F01 maps to exact source, oracle proof IDs and reachable caller execution |
| 15. Recovery/continuity boundary | Tested pinned evidence stays evidence; no ON/admission/activation attempted; broader recovery matrix UNQUALIFIED |
| 16. Personal Office/Pilot | Independently falsified external privacy constraint; judgment/optionality/legacy caller completeness UNQUALIFIED |
| 17. E1/hidden-label discipline | E1 immutable metadata only; no E1/E2/E3 payload/scoring access or mutation |
| 18. Sufficient regression/negative coverage | Sufficient decisive negative for HOLD; insufficient to support acceptance; stop rule invoked |

## D01–D20 recurrence disposition

| Class | Independent disposition |
|---|---|
| D01 identity totality | UNQUALIFIED; typed identity regression evidence only |
| D02 uncertainty disappearance | UNQUALIFIED globally; bounded kernel/selector regressions pass |
| D03 compound/destination totality | BOUNDED_FALSIFIED: private reason reference survives correct visible primary |
| D04 resolution overconsolidation | UNQUALIFIED; kernel equivalence negatives are regression evidence only |
| D05 authority/privacy binding | BOUNDED_FALSIFIED_ADJACENT_RECURRENCE: exact DENY policy is bound internally but bypassed by outbound projection |
| D06 persisted retry/reconciliation | UNQUALIFIED independent schedules |
| D07 nonmatch/no-effect confusion | UNQUALIFIED globally; kernel effect-state regressions pass |
| D08 arbitrary objective closure | UNQUALIFIED independent closure matrix |
| D09 recovery/admission divergence | UNQUALIFIED globally; tested outputs keep continuity OFF and no admission |
| D10 exclusive continuation | UNQUALIFIED independent schedules |
| D11 repository weakness | UNQUALIFIED globally; actual Memory/SQL/cold parity holds for F01, preserving the defect |
| D12 domain/schema divergence | UNQUALIFIED complete enum/schema/typecheck matrix |
| D13 lease validation | UNQUALIFIED independent dimension mutation matrix |
| D14 one-time sentinel release | UNQUALIFIED independent interleavings |
| D15 projection proof/run identity | UNQUALIFIED globally; tested run/content/prefix stability observed, without privacy sufficiency |
| D16 workflow resume badge | UNQUALIFIED independent proof/replay cross-product |
| D17 capability eligibility | UNQUALIFIED independent config/adapters/routing matrix |
| D18 perception/retention collapse | UNQUALIFIED; F01 demonstrates adjacent outbound disclosure composition, not a tested perception-retention recurrence |
| D19 independent experience | UNQUALIFIED empirical learning count/phase claims; no synthetic result counted as empirical experience |
| D20 qualification overstatement | BOUNDED_FALSIFIED helper-sufficiency proposition: 201 green regressions coexist with a required integrated privacy failure; this evaluator returns HOLD |

UNQUALIFIED means neither PASS nor a newly asserted defect. Stopping after F01 follows the governing release; additional gate conclusions are not manufactured.

## Predictive ledger and reconciliation

Prediction `F01-P1`, as of sealed return; horizon: next equivalent projection/readback on an unchanged candidate. Base future: raw private evidence refs in disclosure reasons continue to be returned despite `PRIVACY_EXCLUDED`. Competing future: upstream content constraints happen to sanitize a particular record; that does not establish this arbitrary-reference class. Adverse future: a disclosed reference resolves to private downstream data. Discontinuous future: STRATA governs a separately identified candidate with a mandatory outgoing-payload privacy proof/redaction boundary. Indicators: reference in the returned payload, mismatch between internal retention and outbound permission, stable unsafe content hashes. Reversal: identical negative rejects/redacts the marker while internal canonical evidence survives; broader repaired acceptance still requires all release obligations. Earliest divergence is the actual returned representation, before relying on its primary or qualification tag. Outcome/model/evidence confidence and UNCALIBRATED status are as above. Outcome remains PENDING for future candidate/delivery. No calendar probability, calibrated threshold, or historical prediction success is claimed.

Reconciliation `F01-R1`: one synthetic counterexample specification, two storage realizations and replay/cold representations. They are repeated validation of one causal class, not independent operational experiences. Original occurrence order is retained in the snapshots; no hindsight rewriting or experience-count promotion occurred. Error class exposed: architecture composition / disclosure measurement sufficiency. Method update recommendation: independently probe outgoing fields and references, not primary labels alone. Institutional adoption/calibration change requires its owner. `AUDITOR_CAPACITY_DRIFT`: not observed; unmet proof breadth is explicitly retained.

## Zero-mutation ledger and limits

Candidate code/tests/schema: zero semantic changes; post-execution exact hashes verified. Oracle: read-only, complete seal verified. E1: metadata-only reads; zero changes/scoring. E2/E3 labels: no access. Production/provider stores, Redis, continuity state, credentials, authority, deployments/Preview, office activation: zero reads requiring operational execution and zero writes. No provider calls or hosted experience claims. Fixtures: ephemeral synthetic Memory/PGlite stores, intentionally varied only to exercise the negative. Remote Desktop Commander: device metadata and read-only runtime diagnostics; no remote repository/store mutations. Dependency download: one isolated PGlite installation with lifecycle scripts disabled. Publication: only new independent documentary evidence objects/branch and the authorized BIG #703 / IRIS #3 return comments; no protected refs are moved. No implementation repair, merge or PR acceptance is performed.

Limits: 419 oracle vectors / 482 proof schemas / 504 coordinate rows / 25 legacy dispositions are oracle inventory, not all executed implementation PASS claims. No full legacy empirical retest, all-caller closure, all distributed schedules, all historical cuts, executive judgment/IEF maturity, provider/hosted readiness, empirical-learning yield, or operational privacy blast-radius claim is qualified. Private-reference resolvability and downstream enforcement are `DATA_LINKAGE_GAP`. Deeper organizational origin is `DEEPER_CAUSE_UNRESOLVED`.

Next owner: **STRATA 8.6.9**. Reconcile F01 and govern the next candidate/evaluator sequence. Aaron is not assigned courier, API, relay, or scheduling work.

`SOURCE_EVIDENCE_GOVERNS_ON_CONFLICT / DELTA_RECONCILIATION_NOT_ERASURE / ACTIVITY_IS_NOT_PROGRESS`
