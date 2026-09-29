# IRIS Pilot 001 — E1 to Frozen-Candidate Execution Binding v0.1

Institutional object: IRIS_PILOT_001_E1_TO_FROZEN_CANDIDATE_EXECUTION_BINDING
Disposition: IRIS_PILOT_001_E1_TO_FROZEN_CANDIDATE_EXECUTION_BINDING_READY / FRESH_INDEPENDENT_ACCEPTANCE_REQUIRED
Authority effect: NONE

## 0. Scope and frozen identities

This document freezes only the evaluation translation from the already-frozen Phase-E1 fixtures to one invocation per case of the already-frozen Pilot-001 candidate.

Governing Blueprint:
- path: artifacts/iba/iris-transition/IRIS-PERSISTENT-PERSONAL-AGENT-TRANSITION-BUILDER-READY-BLUEPRINT-v0.4.md
- commit: cda075e0137571aaf9fcb4b752ce0085d361e0cb
- Blueprint Git blob: c030c5f475f38d6edd4bda52ecd74d6f9d9eb786
- Blueprint SHA-256: d478799495f06b7ac1d7b83c6726b913d8cc2fb43950ad45928ea0ec8affdc6d

Frozen E1:
- head: aa8bba661976c2ef2c1d115b548fc2a86122e2f8
- tree: 05ea622e0210425d60ed017b857772e7499a21a8
- manifest: artifacts/evaluation/pilot001/IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.1.json
- manifest bytes: 157380
- manifest SHA-256: fde99bb1b1aa82a5b98f1d17eae1b42d790afabb0d9b74a2804f0ab9e6ff31df
- manifest Git blob: cac80fce950924af8140a8689953bef35a2217f6
- adjudication protocol: artifacts/evaluation/pilot001/IRIS-PILOT-001-ADJUDICATION-PROTOCOL-v0.1.md
- adjudication protocol SHA-256: 93679dae74274f03e7f564ea52be2ef7c0e70c9d06efb3343ded49fcf12574b7
- adjudication protocol Git blob: 62ddbc5189a6fde6fe0697ac8e1ed933dc606363
- cases: 32
- population digest: 969c448021389502bcf4f689d7b7cea5d526fde250cbe264f9f8b1f3d6aee980

Frozen candidate:
- repository: 417properties/IRIS-Personal-Office
- PR: #4, DRAFT / OPEN / UNMERGED
- HEAD: 2fd02febbc94e738b2f4be6a23622263a2ee4f3c
- tree: c6015cf7eab00756e2a3ab111dcb51aea8430648
- pilot001-types.ts blob: c8c7aa257b1f319b5fe518f8cebaf9ff55ea6301
- pilot001-coverage.ts blob: 836a0b0eeb6cddd66b5ef7356aef68ee70fd6157
- pilot001-classifier.ts blob: 6809f0aad783b8c5ddc8e7ef9e55feb87e4a026a
- pilot001-projection.ts blob: 31bcebf6bfac23551059c69a82ca22828e315db4
- transition-repository.ts blob: d9a2f376f02cc31b213c54597c4efb3f5a5bb925
- migration 006 blob: 21d5f2f7fdded66e3c10c700c547c8e601ade6cd

The candidate HEAD/tree is not changed by this binding. The binding is external evaluation architecture.

## 1. Independence boundary

This binding is derived only from:
1. frozen Blueprint v0.4 and its pre-existing accepted architecture;
2. frozen E1 manifest, population identity and adjudication protocol;
3. exact frozen candidate source/API/interface semantics;
4. the abstract E3 HOLD cause that an immutable E1-to-ProjectionInput binding was absent.

Per-case E2 governing answers are prohibited inputs. E3 metric numerators/results are prohibited transformation inputs. No transformation may be selected because it improves or worsens candidate performance.

Any implementation of this binding MUST reject any runtime dependency on a reference-label artifact, E3 scoring artifact, or score-derived configuration.

## 2. Normative execution model

For each E1 case, in the exact frozen population order:

one frozen E1 case -> one FrozenE1ProjectionDecoder operation -> one ProjectionInput -> exactly one call to frozen candidate buildProjection -> one deterministic serialized output.

No case may be split into multiple candidate invocations. No two cases may be aggregated into one invocation. Internal ProjectionInput.candidates may contain multiple explicit item candidates because a single E1 case can contain multiple obligations, decisions, effects or conflicts.

The external decoder terminates at ProjectionInput. It does not modify candidate source and does not reinterpret candidate output.

EXTERNAL_EVALUATION_HARNESS != CANDIDATE_MODIFICATION.

The frozen transition-repository SnapshotDecoder establishes that decoding is an injected boundary whose output is ProjectionInput. The E1 manifest is not a PostgreSQL CanonicalRows snapshot, so the evaluation harness MUST NOT invent fake database rows. It shall implement an external FrozenE1ProjectionDecoder whose output is exactly the same frozen ProjectionInput contract and shall invoke the exported frozen buildProjection directly. This is the concrete evaluation adapter at the decoder boundary.

## 3. Case and time identity

case_id is copied byte-for-byte and is never normalized.

case order is the ordered_case_ids sequence frozen in the E1 population identity. Any missing, extra, duplicate or reordered case aborts the run before candidate execution.

fixture_time is the only evaluation time. ProjectionInput.started_at = fixture_time and ProjectionInput.emitted_at = fixture_time. Wall-clock execution time, filesystem mtime and publication time MUST NOT enter ProjectionInput or the canonical per-case output.

case_version must equal the frozen manifest value. Unknown versions fail closed.

## 4. Principal and identity normalization

The only principal alias admitted by this binding is exact, case-sensitive:
principal_aaron -> AARON.

Rules:
- no trimming;
- no case folding;
- no substring match;
- no human-name guessing;
- no inferred aliases.
- the E1 declared_scope.principal_id and principal_identity.principal_id MUST both equal exact principal_aaron and principal_identity.identity_status MUST be VERIFIED; otherwise the case is structurally unbindable and execution stops.
- record-level exact principal_aaron becomes AARON.
- any other nonempty record identity string is preserved byte-for-byte as a non-AARON identity.
- a null identity stays unknown; it is never guessed.
- a non-string, non-null identity is malformed and fails binding validation.

owner, decision-maker, authority-holder, reserved-authority holder and escalation target remain distinct fields. Normalizing an identity never converts one role into another.

## 5. Eight required source evaluations

The candidate immutable required-source order is exactly:

1. pilot001:objectives
2. pilot001:obligations
3. pilot001:obligation_governance
4. pilot001:decision_requirements
5. pilot001:authority_generation_and_leases
6. pilot001:unresolved_intents_and_effects
7. pilot001:applicability_current_assertions
8. pilot001:qualified_big_quarantine_evidence

Every SourceEvaluation has required=true. Caller-supplied narrowing is forbidden.

### 5.1 Fixed E1-to-target mapping

pilot001:objectives
- E1 data: objective
- E1 source envelope: src_objective / OBJECTIVE_STATE

pilot001:obligations
- E1 data: obligations[]
- E1 source envelope: src_obligation / OBLIGATION_STATE

pilot001:obligation_governance
- E1 data: obligation owner/applicability fields, decision_requirements[], authority_state, escalation
- E1 source envelopes: src_obligation plus src_authority

pilot001:decision_requirements
- E1 data: decision_requirements[]
- E1 source envelope: src_obligation

pilot001:authority_generation_and_leases
- E1 data: authority_state
- E1 source envelope: src_authority / AUTHORITY_STATE

pilot001:unresolved_intents_and_effects
- E1 data: effect_state
- E1 source envelope: src_effect / EFFECT_STATE

pilot001:applicability_current_assertions
- E1 data: current_assertions[] plus explicit objective/obligation applicability facts
- E1 source envelopes: src_objective plus src_obligation

pilot001:qualified_big_quarantine_evidence
- E1 data: qualified_big_inputs[]
- this is an explicit E1 case field representing the qualified-BIG-in-IRIS surface; it is not fabricated from one of the four source envelopes.

The four E1 source classes therefore fan into the eight candidate surfaces only through this fixed table. No implementation may choose a different fan-out case-by-case.

### 5.2 Source-envelope reduction

For targets backed by one or more E1 source envelopes:

present:
- false if any fixed parent source envelope is MISSING;
- true for PRESENT or PARTIAL, subject to structural validation.
- an empty row array with a PRESENT source is a present empty surface, not a missing source.

identity:
- CONFLICT if any fixed parent identity_status is CONFLICT;
- otherwise UNKNOWN if any is UNKNOWN;
- otherwise VERIFIED.

applicability:
- UNKNOWN if any fixed parent applicability is UNKNOWN;
- INAPPLICABLE only if every fixed parent is explicitly INAPPLICABLE and its inapplicability has provenance;
- otherwise APPLICABLE.

freshness:
- UNKNOWN if any fixed parent freshness_status is UNKNOWN;
- otherwise STALE if any is STALE;
- otherwise CURRENT.

principal_match:
- true only when the target evidence is admitted to the exact Aaron projection under Section 4 and the privacy rules below;
- otherwise false.

provenance_ok:
- true only when every present fixed parent used by the target has nonempty provenance_refs and every row-level source_ref used by the target resolves to a frozen source_id with valid provenance;
- false for a missing required provenance chain.
- a proven empty surface is allowed to inherit the immutable case/source-envelope provenance; zero rows is not zero provenance.

partial:
- true when any fixed parent availability is PARTIAL or a target-specific material missing dimension applies;
- false only when no material partiality remains.

The SourceEvaluation property insertion order used before candidate invocation is exactly:
source_id, required, present, principal_match, identity, applicability, freshness, provenance_ok, partial.
The partial property is always present as a boolean.

### 5.3 Frozen missing-dimension interpretation

Only these E1 missing_dimension tokens are admitted:

DUPLICATE_CANONICAL_IDENTITY
- pilot001:obligations partial=true.

REQUIRED_OBLIGATION_SOURCE
- obligation-backed targets remain missing/partial through src_obligation; no synthetic records are created.

CURRENT_OBJECTIVE_FRESHNESS
- objective-backed targets use the frozen source freshness; no fresh timestamp is invented.

OBJECTIVE_SOURCE_APPLICABILITY
- objective-backed applicability remains UNKNOWN.

OBLIGATION_OWNER
- pilot001:obligation_governance partial=true; affected item ownership stays unknown.

AARON_RELEVANCE
- pilot001:obligation_governance partial=true; affected item applicability is UNKNOWN.

AUTHORITY_HOLDER
- pilot001:authority_generation_and_leases partial=true and pilot001:obligation_governance partial=true; holder stays unknown.

NONMATERIAL_OBJECTIVE_DETAIL
- this is the sole frozen proof that the missing objective detail is irrelevant to Pilot classification. It neutralizes raw objective PARTIAL only for pilot001:objectives and pilot001:applicability_current_assertions. It does not manufacture any missing fact.

REQUIRED_AUTHORITY_STATE
- authority-backed targets remain missing/partial through src_authority; embedded authority-looking values from a MISSING source MUST NOT be promoted as usable authority evidence.

STABLE_DEPENDENCY_BRACKET
- handled only by Section 10; it never changes a source fact.

Any unrecognized missing_dimension is a binding error, not a default.

### 5.4 Qualified BIG surface

If qualified_big_inputs exists and is an empty array:
- the qualified-BIG-in-IRIS surface is present and explicitly empty at fixture_time;
- present=true, principal_match=true, identity=VERIFIED, applicability=APPLICABLE, freshness=CURRENT, provenance_ok=true, partial=false.
- this proves an empty qualified surface read; it does not prove external BIG is empty.

For each nonempty qualified BIG packet:
- qualification_state must be exact QUALIFIED_BOUNDED;
- provenance_refs must be nonempty;
- cross-principal use must satisfy Section 9;
- the packet must carry an explicit observed/qualified basis and either valid-through or an explicit source max-age/applicability contract before freshness may be CURRENT.
- absence of an evaluable freshness contract maps freshness to UNKNOWN. fixture_time is not silently substituted for missing packet freshness.
- malformed qualification/provenance maps source identity/provenance fail-closed, never to CURRENT.

This rule is derived from Blueprint v0.4 required-source freshness semantics and is not label-dependent.

## 6. Candidate item construction

The E1 case is a projection fixture, not one implicit intervention. The binding creates item candidates only from explicit canonical record types supported by the frozen candidate.

Root order is fixed:
1. obligation roots in E1 obligations[] order;
2. decision roots in E1 decision_requirements[] order;
3. unresolved effect-intent roots in E1 effect_state.intents[] order;
4. conflict-only roots, only when an unresolved conflict cannot be attached through an explicit assertion reference to a prior root, in E1 conflicts[] order.

There is no semantic-similarity joining.

### 6.1 Obligation root

For each privacy-admissible obligation:
- id = e1:<case_id>:obligation:<raw obligation_id>
- principal_id = normalized objective principal
- objective_id = exact objective_id when privacy-admissible
- obligation_id = canonical_anchor_id when it is a nonempty string; otherwise exact raw obligation_id
- obligation_status = exact E1 state string; BLOCKED is not silently renamed to HOLD
- obligation_owner = normalized owner; null becomes UNKNOWN
- concrete_action_remaining = true only for state OPEN, IN_PROGRESS, WAITING, HOLD or BLOCKED when required_action_kind is nonempty and informational_only is false; false otherwise
- informational_only = exact boolean
- applicability = exact obligation applicability, degraded to UNKNOWN if its direct source applicability/identity prevents a reliable item determination
- freshness/source_identity/provenance are derived from the direct source evidence used by this item.
- possible_duplicate_refs follows Section 8.

### 6.2 Decision root

E1 v0.1 decision records do not contain an obligation_id link. Therefore they MUST NOT be fused with an obligation merely because there is only one obligation in the same case.

Each admissible decision_requirement becomes its own root:
- id = e1:<case_id>:decision:<decision_requirement_id>
- principal_id = AARON only when the decision record is admitted to Aaron's projection under Sections 4 and 9
- objective_id = exact objective_id only when that objective identity is privacy-admissible
- decision_requirement_id = exact ID
- decision_status = exact frozen status
- decision_maker_identity_id = normalized exact value; null becomes UNKNOWN
- reserved_authority_class is copied exactly when privacy-admissible
- applicability/freshness/source_identity/provenance derive from admitted decision evidence.

This explicit non-join eliminates a post-label choice capable of changing intervention identity.

### 6.3 Authority context on obligation/decision roots

Authority is a classification dimension, not an owner alias.

For each privacy-admissible obligation or decision root:
- if a reserved_authority_class is present on the decision root, preserve it;
- otherwise a nonnull case authority_state.reserved_authority_class may supply the reserved class;
- if both are nonnull and differ, the case is structurally contradictory and binding execution stops; no precedence is invented.
- authority_holder_identity_id comes only from authority_state when src_authority is usable; VERIFIED holder is normalized, UNKNOWN/CONFLICTING holder becomes UNKNOWN.
- matching_current_delegation exact ABSENT -> valid_delegation=false.
- an exact value beginning VALID_ -> valid_delegation=true.
- UNKNOWN or CONFLICTING_RECORDS -> valid_delegation is omitted.
- any other delegation token is a binding error.

If src_authority is MISSING, authority fields from the embedded object are not used as positive classification evidence.

The item health calculation includes src_authority whenever reserved-authority classification is being attempted. Missing/UNKNOWN authority therefore cannot be upgraded to AR-3 or a justified omission.

### 6.4 Unresolved effect roots

When effect_state.reconciliation_state is NO_EXTERNAL_EFFECT, no effect root is created.

For any other frozen reconciliation state:
- each explicit unresolved intent becomes one root in intent order;
- id = e1:<case_id>:intent:<intent_id>
- principal_id = AARON only within the admitted Aaron projection
- objective_id = exact admissible objective_id
- intent_id = exact intent_id
- unresolved_effect=true
- applicability/freshness/source_identity/provenance derive from src_effect.
- an unresolved effect state with no deterministic intent identity is a binding error.

No receipt is silently treated as verification. No missing verification is manufactured.

## 7. Conflict and escalation binding

input.conflicts contains each E1 conflict_id with state UNRESOLVED, exactly once and in frozen E1 order. Resolved/nonmaterial states may not be promoted into this array. Unknown conflict states fail validation.

Recognized conflict classes are exactly:
INCOMPATIBLE_OBLIGATIONS
INCOMPATIBLE_CURRENT_STATE
AUTHORITY_CONFLICT
EFFECT_REALITY_CONFLICT
SOURCE_IDENTITY_CONFLICT
POSSIBLE_DUPLICATE_UNRESOLVED.

For each unresolved conflict:
1. resolve assertion_refs against already-created roots:
   - a raw obligation_id resolves to that obligation root;
   - a decision_requirement_id resolves to that decision root;
   - an intent_id resolves to that effect root;
   - a receipt_id resolves through its exact receipt.intent_id to that effect root.
2. every explicitly referenced resolved root receives conflict_id=<exact E1 conflict_id> and material_conflict=true.
3. if no root resolves:
   - create exactly one conflict-only root with id e1:<case_id>:conflict:<conflict_id>, principal_id=AARON for an Aaron-scope case, admissible objective_id, conflict_id, material_conflict=true;
   - provenance is selected deterministically by conflict class: INCOMPATIBLE_OBLIGATIONS/POSSIBLE_DUPLICATE_UNRESOLVED -> src_obligation; AUTHORITY_CONFLICT -> src_authority; EFFECT_REALITY_CONFLICT -> src_effect; INCOMPATIBLE_CURRENT_STATE -> provenance of the exact referenced current_assertions; SOURCE_IDENTITY_CONFLICT -> exact referenced source identities.
4. if one root would receive more than one distinct conflict_id, the frozen PilotCandidate type cannot encode that without score-changing fan-out; execution fails closed rather than cloning the item.

Raw E1 conflict IDs are preserved. The harness does not recompute new conflict identities after E1 freeze.

Escalation:
- NOT_REQUIRED -> escalation_required=false.
- REQUIRED_OPEN with target principal_aaron is an Aaron escalation; any other nonnull target is not an Aaron escalation.
- REQUIRED_OPEN with a null/unknown target makes affected applicability UNKNOWN.
- when escalation.reason_class is MATERIAL_AUTHORITY_AMBIGUITY and exactly one AUTHORITY_CONFLICT exists, escalation is attached to the root(s) carrying that conflict;
- when reason_class is INCOMPATIBLE_INSTRUCTIONS and exactly one INCOMPATIBLE_OBLIGATIONS conflict exists, escalation is attached to the root(s) carrying that conflict;
- otherwise escalation may attach only when exactly one privacy-admissible obligation/decision root exists.
- any remaining one-to-many escalation ambiguity is a binding error. No escalation is sprayed across unrelated roots.

## 8. Duplicate identity

Duplicate handling uses explicit frozen identity evidence only.

For each obligation:
- nonnull canonical_anchor_id becomes the candidate obligation_id anchor;
- raw obligation_id remains in candidate id and binding trace.

For duplicate_candidates:
- EXACT_CANONICAL_ANCHOR_MATCH: records must share the same nonempty canonical anchor. They remain separate input candidates but frozen candidate logic may merge their exact intervention identity.
- SHARED_CANONICAL_ANCHOR_DIFFERENT_EXPRESSION: same rule; display text does not create a new identity.
- SIMILAR_TEXT_DISTINCT_CANONICAL_ANCHORS: distinct anchors remain distinct; semantic similarity cannot merge.
- UNCERTAIN_NO_CANONICAL_ANCHOR: retain raw obligation IDs as distinct anchors and set each affected candidate possible_duplicate_refs to the sorted other record_refs. Do not merge.
- unresolved duplicate identity also keeps pilot001:obligations partial=true under Section 5.3.

Stable intervention IDs are produced only by the frozen candidate. The harness never precomputes, rewrites or renumbers arq_ identities.

## 9. Privacy, cross-principal evidence and exclusions

Pilot 001 is Aaron-principal scoped.

SAME_PRINCIPAL / PERMITTED_FOR_FIXTURE:
- normal same-principal data may enter according to the mapping above.

NO_CROSS_PRINCIPAL_AUTHORIZATION / PRIVACY_EXCLUDED_AUDIT_REQUIRED:
- the other-principal objective/obligation/decision fields do not enter candidates;
- ProjectionInput.privacyExcluded gets exactly objective:<objective_id> once for the excluded record group;
- the per-case wrapper preserves the exact known_exclusion basis/evidence;
- privacy exclusion is never counted as justified relevance omission.

EXPLICIT_BOUNDED_PACKET_AUTHORIZATION / PERMITTED_FIELDS_ONLY:
- only fields explicitly named by qualified_big_inputs[].allowed_fields may cross from the other-principal packet.
- no omitted field is inferred from narrative text.
- if decision_requirement_id is allowed, a bounded decision root may be created for the Aaron projection using that exact ID; any load-bearing decision status, decision-maker, authority, deadline or provenance field not actually authorized and present stays unknown.
- such a root uses applicability=UNKNOWN when the permitted fields are insufficient to establish Aaron relevance.
- packet freshness follows Section 5.4.
- fields outside the allowlist are recorded as privacy redactions in the binding trace, not silently consumed.

Case-specific known_exclusions such as commerce_execution or an intentionally out-of-scope external domain are preserved byte-for-byte in the output binding trace. They do not narrow any of the eight immutable required source identities unless the frozen exclusion explicitly proves that exact required source inapplicable. No current E1 v0.1 exclusion authorizes such narrowing.

## 10. Dependency bracket

The frozen dependency_bracket maps mechanically:

- rerun_count=0 and initial_digest==final_digest -> STABLE.
- rerun_count=1 with valid initial/final digests and no STABLE_DEPENDENCY_BRACKET missing dimension -> RERUN_STABLE.
- rerun_count>=2 -> UNSTABLE.
- STABLE_DEPENDENCY_BRACKET in missing_dimensions -> UNSTABLE.
- malformed or missing bracket fields -> binding error.

The harness does not synthesize a new dependency digest. The candidate will compute its own load-bearing dependency_digest from the exact ProjectionInput. The wrapper preserves the frozen E1 initial/final bracket digests separately for audit.

## 11. Candidate item health and provenance

For each item, use only evidence actually used to establish that item's fields.

Reduction order:
identity: CONFLICT > UNKNOWN > VERIFIED.
applicability: UNKNOWN dominates; otherwise the root's exact applicability.
freshness: UNKNOWN > STALE > CURRENT.

PARTIAL does not automatically suppress a positively proved class because the accepted protocol permits positive inclusion from sufficient partial evidence. PARTIAL is carried through the global SourceEvaluation and therefore prevents a false COMPLETE/omission claim unless the exact NONMATERIAL_OBJECTIVE_DETAIL exception applies.

Candidate provenance_refs is the lexicographically sorted unique union of the original frozen provenance_refs from the direct source envelopes/qualified packet fields actually used for that item. The harness does not invent evidence URIs for candidate classification. Structural JSON-pointer traces may appear only in the external binding_trace.

## 12. Exact PilotCandidate object construction order

To freeze the frozen candidate's JSON.stringify-based dependency digest, the harness MUST create every PilotCandidate by ordered assignment in this exact property order:

1. id
2. principal_id
3. objective_id, when admitted
4. obligation_id, when applicable
5. decision_requirement_id, when applicable
6. intent_id, when applicable
7. conflict_id, when applicable
8. obligation_status, when applicable
9. obligation_owner, when applicable
10. concrete_action_remaining, when applicable
11. decision_status, when applicable
12. decision_maker_identity_id, when applicable
13. reserved_authority_class, when nonnull
14. authority_holder_identity_id, when applicable
15. valid_delegation, only when deterministically boolean
16. escalation_required, always boolean
17. unresolved_effect, always boolean
18. material_conflict, always boolean
19. informational_only, always boolean
20. applicability
21. freshness
22. source_identity
23. provenance_refs
24. possible_duplicate_refs, always an array

why is never supplied by the harness.

Optional properties that are not semantically applicable are not inserted. null is not substituted for an omitted candidate optional field unless this binding explicitly says UNKNOWN.

## 13. Exact ProjectionInput

ProjectionInput property order for harness construction is:

candidates
sources
conflicts
privacyExcluded
bracket
started_at
emitted_at

candidates: Section 6/7 fixed order after privacy filtering.
sources: Section 5 exact eight-source order.
conflicts: unresolved conflict IDs in E1 order.
privacyExcluded: deterministic Section 9 entries in E1 record order, deduplicated by exact string.
bracket: Section 10.
started_at: fixture_time.
emitted_at: fixture_time.

The harness then invokes exactly the frozen export buildProjection(ProjectionInput) once.

It MUST NOT call a copied/reimplemented classifier, coverage evaluator or intervention-ID generator as a substitute for the frozen candidate.

## 14. Deterministic output contract

One file per case:
artifacts/evaluation/pilot001/execution-binding-v0.1/outputs/<case_id>.json

One index:
artifacts/evaluation/pilot001/execution-binding-v0.1/IRIS-PILOT-001-FROZEN-CANDIDATE-OUTPUT-INDEX-v0.1.json

Per-case schema_version:
pilot001.e1-frozen-candidate-output.v0.1

Each per-case file contains:
- schema_version
- case_id
- case_order_index
- E1 head and population digest
- frozen candidate head/tree
- accepted binding artifact path plus its post-publication SHA-256 and Git blob
- frozen fixture bracket evidence
- exact candidate_projection returned by buildProjection, unedited
- binding_trace containing source-to-target mappings, raw-to-canonical obligation anchor decisions, privacy redactions, known exclusions and structural warnings
- payload_sha256

No second semantic scoring view is generated. The frozen candidate_projection is the candidate output.

The candidate_projection already carries:
- canonical candidate intervention identities;
- AR classifications;
- resolution_kind;
- omission IDs;
- completeness/coverage state;
- unresolved conflicts;
- coverage gaps;
- privacy exclusions;
- uncertainty candidates.

The frozen candidate API does not emit a consequence class/weight. The harness MUST NOT invent one. Consequence classification remains reference-side evidence for the later independent scorer. This binding preserves the candidate intervention/case identities needed for that later comparison without consuming the reference answers.

### 14.1 Canonical JSON

Canonical JSON algorithm pilot001.binding-canonical-json.v0.1:
- UTF-8;
- no BOM;
- recursive object keys sorted lexicographically;
- arrays preserve their already-frozen semantic order;
- strings use JSON escaping;
- integers remain base-10 JSON integers;
- no NaN, Infinity or undefined values;
- no insignificant whitespace;
- no trailing newline in the canonical digest payload.

payload_sha256 = lowercase hex SHA-256 of the canonical bytes of the per-case payload object before payload_sha256 is attached.

The final file itself is canonicalized with the same algorithm after payload_sha256 is attached. Publication evidence records whole-file byte count, SHA-256 and Git blob separately.

No wall-clock or machine-specific metadata is allowed in a per-case canonical output.

A second execution from the same manifest bytes + candidate head/tree + accepted binding MUST be byte-identical for all 32 per-case files and the output index.

## 15. Fail-closed binding errors versus represented uncertainty

Represented E1 uncertainty is still executable:
- MISSING, STALE, PARTIAL, UNKNOWN, conflict and unstable bracket values are translated according to this binding and allowed to drive the frozen candidate's fail-closed semantics.

Structural ambiguity is not executable and aborts publication of candidate outputs:
- unknown case/schema version;
- malformed identity type;
- unrecognized source class/status token;
- duplicate required source envelope;
- unknown missing_dimension;
- contradictory reserved-authority classes;
- unresolved effect without deterministic intent identity;
- conflict relation that would require cloning one candidate because the frozen type cannot carry multiple conflict IDs;
- escalation with no deterministic target root;
- unauthorized cross-principal field use;
- unrecognized delegation token;
- any required mapping not covered above.

The harness may never invent a convenient default merely to make 32/32 executable.

## 16. Deeper-layer falsification closure

The binding was challenged for score-changing hidden choices before publication.

Closed choices:
- principal alias guessing -> exact principal_aaron only.
- four-to-eight source fan-out -> fixed table, no per-case choice.
- empty surface versus missing surface -> source-envelope/field presence decides.
- stale/UNKNOWN packet freshness -> never replaced by fixture_time.
- decision/obligation semantic merging -> prohibited without an explicit frozen relation; E1 v0.1 decision roots remain separate.
- duplicate semantic similarity -> prohibited; canonical_anchor_id only.
- conflict fan-out -> only explicit assertion references; otherwise conflict-only root.
- escalation fan-out -> conflict-class relation or exactly one root; otherwise error.
- privacy import -> exact packet field allowlist.
- missing authority source -> embedded values cannot resurrect it.
- partial evidence -> can support positive inclusion but cannot yield false omission because global coverage remains non-COMPLETE.
- bracket instability -> exact mechanical mapping.
- ordering -> frozen population/root/source/property order.
- time nondeterminism -> fixture_time only.
- JSON object-key/insertion nondeterminism -> exact construction order plus canonical output serialization.
- intervention identity tuning -> only frozen candidate computes arq_ IDs.
- consequence tuning -> harness emits no consequence class.
- label leakage -> prohibited dependency and independent acceptance gate.

One-layer-deeper question:
If the mapping appears deterministic, what hidden choice remains capable of changing the score?

Answer after this contract: no runtime mapping choice is left to the Builder. Any new unmapped condition is a named binding error requiring a new independently accepted binding version, not a discretionary transformation.

## 17. Independence certification

The IBA publication certifies:
- per-case E2 governing labels were not used to select transformations;
- E3 metric outcomes were not used to tune transformations;
- candidate source/tests/evidence were not modified;
- frozen E1 population/order/digest were not modified;
- adjudication protocol and metric thresholds were not modified;
- the binding derives from pre-existing v0.4 architecture, frozen E1 semantics and frozen candidate interfaces only;
- the publication branch descends from the pre-label E1 head, not the E2 label branch.

## 18. Required next sequence

This READY disposition does not authorize execution or scoring.

Required sequence:
1. fresh independent acceptance of this exact binding artifact and Builder packet;
2. authorized DEV/execution owner implements only the external harness on a branch rooted at the frozen candidate;
3. unchanged candidate executes all 32 frozen cases;
4. immutable per-case outputs and index are published;
5. a fresh independent Phase-E3 scorer resumes against the already-frozen labels.

Preserve:
ZERO_AUTHORITY
CONTINUITY_OFF
NO_PR4_MERGE
NO_CANDIDATE_MUTATION
NO_LABEL_MUTATION
NO_SCORING
NO_DEPLOYMENT
NO_OPERATIONAL_PROMOTION
IRIS_CURRENT != BIG_CURRENT
BIG_ACTIVATION_NOT_AUTHORIZED
