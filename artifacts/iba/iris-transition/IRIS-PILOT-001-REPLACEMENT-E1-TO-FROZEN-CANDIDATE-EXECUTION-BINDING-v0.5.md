# IRIS Pilot 001 — Replacement-E1 to Frozen-Candidate Execution Binding v0.5

Disposition: `BINDING_CORRECTION_READY / TYPED_IDENTIFIER_BOUNDARY_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
Authority: NONE

## 0. Bounded correction

Authorized by STRATA #703/5964614000 after independent v0.4 HOLD:
`BINDING_HOLD/PINNED_TYPED_DECISION_ID_DOUBLE_PREFIXED_AT_CANDIDATE_BOUNDARY`.

v0.3 self-identity and v0.4 UNAVAILABLE corrections remain fully normative. All unrelated v0.2-v0.4 semantics remain unchanged.

Frozen candidate:
`185dbd1be80bd54c6cf5dcc085f105a637fe7e44 / af4808dc6c6db17ed7dc5cdd923fe5b9697c006a`.

Frozen replacement E1:
`849deca383add66773ab1ba0c8bc0ca852523c8f / fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4 / 40 / 32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f`.

No E2/E3 labels, candidate outputs, or scores were consumed.

## 1. Candidate boundary source audit

All 40 replacement cases were audited for typed IDs/refs.

Candidate-owned source anchor classes demonstrated:
- 40 objective records with IDs exactly `objective:<payload>`;
- 42 obligation records with IDs exactly `obligation:<payload>`;
- 40 decision_requirement records with IDs exactly `decision_requirement:<payload>`;
- 2 intent records with IDs exactly `intent:<payload>`.

The candidate source proves its anchor serializer owns these namespaces:
- DECIDE: `decision_requirement:` + candidate.decision_requirement_id;
- ACT/AUTHORIZE fallback: `obligation:` + candidate obligation payload;
- RECONCILE_EFFECT: `intent:` + candidate.intent_id;
- fallback: `objective:` + candidate.objective_id;
- conflict: `conflict:` + candidate.conflict_id.

Therefore passing a source typed reference directly into those candidate payload fields double-prefixes the canonical anchor.

Exact cited case:
source `decision_requirement:5304c81075b94529b3da9f2e81083444`
must enter candidate `decision_requirement_id` as:
`5304c81075b94529b3da9f2e81083444`.

## 2. Typed identifier parser

Define one external binding helper:

`candidateAnchorPayload(expectedNamespace, typedRef)`.

It MUST:
1. require typedRef is a string;
2. require exactly one leading namespace delimiter structure `<expectedNamespace>:<payload>`;
3. require namespace equals expectedNamespace byte-for-byte;
4. require payload nonempty;
5. require payload contains no colon;
6. return payload unchanged; no case-folding, trimming, Unicode normalization, UUID parsing, or semantic rewriting.

Failures:
- missing namespace -> `BINDING_HOLD/CANDIDATE_ANCHOR_NAMESPACE_MISSING`;
- wrong namespace -> `BINDING_HOLD/CANDIDATE_ANCHOR_NAMESPACE_MISMATCH`;
- empty/nested payload -> `BINDING_HOLD/CANDIDATE_ANCHOR_PAYLOAD_MALFORMED`.

The helper is representation-boundary parsing only. It does not alter source identity.

## 3. Exact candidate-owned mappings

### Objective
Source `objective:<payload>`:
- candidate.objective_id = payload.

### Obligation
Source `obligation:<payload>`:
- candidate.obligation_id = payload unless an independently frozen canonical-anchor rule supplies a candidate-owned obligation payload;
- synthetic candidate id = `e1:<case_id>:obligation:<payload>`.

Any canonical obligation anchor used by the duplicate rule MUST itself be converted through the exact expected obligation namespace before entering candidate.obligation_id. No typed `obligation:...` string may enter candidate.obligation_id.

This also ensures candidate `rawObligationId()` yields the raw payload from the synthetic candidate id and then adds exactly one `obligation:` prefix.

### Decision requirement
Source `decision_requirement:<payload>`:
- candidate.decision_requirement_id = payload;
- synthetic candidate id = `e1:<case_id>:decision:<payload>`.

### Intent
Source `intent:<payload>`:
- candidate.intent_id = payload;
- synthetic candidate id = `e1:<case_id>:intent:<payload>`.

### Conflict
Binding-generated conflict IDs remain `conf_<sha256>` payloads with no `conflict:` prefix.
Candidate.conflict_id receives that untyped payload.
Synthetic conflict candidate id uses `e1:<case_id>:conflict:<conf_payload>`.
Candidate alone emits `conflict:<conf_payload>` anchors.

## 4. Fields that MUST remain typed

Do NOT globally strip namespaces.

Typed source identity is retained unchanged for:
- record.id while resolving source records;
- objective_ref / obligation_ref / decision refs / intent_ref while joining source records;
- lifecycle affected_record_refs;
- action-decision resolves/supersedes refs;
- applicability subject_refs;
- required-next-step subject/decision refs;
- source-link left_ref/right_ref/authoritative_merge_ref;
- source_refs/evidence refs;
- impact_packet_ref validation;
- authority-domain/lease/worker/episode/IRIS refs;
- binding_trace source identifiers;
- privacyExcluded source record IDs;
- provenance_refs;
- possible_duplicate_refs when they are source-record references rather than candidate-owned anchor payloads.

Typed refs are compared/joined in source space first. Conversion to payload occurs only at the named candidate-owned field boundary.

## 5. Source-to-candidate join rule

Every source relation MUST resolve using full typed refs before payload conversion.

Example:
`decision_requirement.obligation_ref = obligation:abc`
resolves against source record `obligation:abc`.
Only after the exact source record is selected does candidate.obligation_id receive `abc`.

Never compare a stripped payload to an arbitrary source ID.

This prevents namespace collision such as:
`objective:abc` vs `obligation:abc`.

## 6. Candidate anchor invariant

For every produced intervention anchor:
- exactly one namespace prefix is present;
- no anchor contains:
  - `objective:objective:`
  - `obligation:obligation:`
  - `decision_requirement:decision_requirement:`
  - `intent:intent:`
  - `conflict:conflict:`.

The harness may assert this representation invariant without interpreting/scoring candidate output.

The candidate remains sole owner of anchor serialization and intervention-ID generation.

## 7. Candidate object representation invariant

Before buildProjection, for every PilotCandidate:
- objective_id, if present, contains no colon and is the payload from exact objective namespace;
- obligation_id, if present, contains no colon and is the payload from exact obligation namespace/canonical anchor;
- decision_requirement_id, if present, contains no colon and is the payload from exact decision_requirement namespace;
- intent_id, if present, contains no colon and is the payload from exact intent namespace;
- conflict_id, if present, is existing untyped `conf_<hex>`;
- synthetic candidate id uses raw payload suffix for obligation/decision/intent/conflict.

Any typed namespace found in a candidate-owned payload field => HOLD before buildProjection.

## 8. Complete 40-case boundary audit requirement

The harness must precompute a binding trace for all source-to-candidate anchor conversions and prove:
- every 40 objective IDs parse under objective namespace;
- every 42 obligation IDs parse under obligation namespace;
- every 40 decision IDs parse under decision_requirement namespace;
- both intent IDs parse under intent namespace;
- no demonstrated candidate-owned anchor requires a different representation;
- no typed source ref is stripped outside the explicit candidate-owned fields.

Unexpected candidate-owned namespace/type => `BINDING_HOLD/UNMAPPED_CANDIDATE_ANCHOR_NAMESPACE`.

## 9. One-layer-deeper falsification closure

Potential score-changing representation choices are frozen:
- strip globally vs boundary-only -> boundary-only;
- strip zero/one/multiple prefixes -> exactly one validated expected namespace;
- trim/case-fold/normalize -> prohibited;
- source joins before/after strip -> full typed source joins first;
- synthetic candidate IDs -> raw candidate payload suffix;
- conflict IDs -> remain binding-generated untyped payload;
- provenance/privacy/duplicate source refs -> remain typed;
- candidate output anchors -> candidate-generated, never rewritten.

No Builder choice remains.

## 10. Independence

Correction inputs:
- replacement-E1 typed source structures;
- exact candidate types/classifier/projection source;
- independent review falsifier;
- prior binding.

Not consumed:
- E2 labels/answers/reference interventions;
- candidate output vectors;
- E3 scoring/results;
- score-derived configuration.

`labels_consumed=0 / candidate_outputs_consumed=0 / scoring=false`.

## 11. Acceptance

Fresh independent exact-binding reviewer must verify:
1. complete candidate-boundary typed-ID audit;
2. exact parser rule;
3. source joins remain typed;
4. candidate-owned fields use raw payloads;
5. cited decision case produces exactly one decision_requirement prefix at candidate anchor serialization;
6. obligation rawObligationId path also produces exactly one obligation prefix;
7. objective/intent/conflict paths produce exactly one prefix;
8. provenance/privacy/source-link refs remain typed;
9. v0.3 self-identity and v0.4 UNAVAILABLE rules unchanged;
10. no E2/E3/output/scoring leakage.

Required PASS:
`IRIS_PILOT_001_REPLACEMENT_E1_EXECUTION_BINDING_INDEPENDENT_ACCEPTANCE_PASS`
or one exact HOLD.

No execution release.

Preserve:
`REPLACEMENT_E1_FROZEN / POST_REPLACEMENT_E1_CANDIDATE_REFREEZE_CLOSED / REPLACEMENT_E1_BLIND_E2_CLOSED / ROUND3_E2_HOLD_VALID_AS_HISTORICAL_EVIDENCE / IRIS_NOT_OPERATIONALLY_PROMOTED / CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_CONTINUITY_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED`.

Final:
`BINDING_CORRECTION_READY / TYPED_IDENTIFIER_BOUNDARY_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
