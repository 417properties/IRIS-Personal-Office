# IRIS Pilot 001 — Replacement-E1 Execution Builder Packet v0.4

Disposition: `BINDING_CORRECTION_READY / UNAVAILABLE_REQUIRED_SURFACE_MAPPING_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
Authority: NO EXECUTION UNTIL INDEPENDENT PASS + STRATA RELEASE

## 1. Governing delta

Consume binding v0.4:
`artifacts/iba/iris-transition/IRIS-PILOT-001-REPLACEMENT-E1-TO-FROZEN-CANDIDATE-EXECUTION-BINDING-v0.4.md`.

All v0.3 Builder requirements remain unchanged except source-envelope availability falsification is extended below.

Candidate remains exact `185dbd1be80bd54c6cf5dcc085f105a637fe7e44 / af4808dc6c6db17ed7dc5cdd923fe5b9697c006a`.
Replacement E1 remains exact `849deca383add66773ab1ba0c8bc0ca852523c8f / fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4`.

## 2. Availability decoder

Implement exact three-token allowlist:
`PRESENT | UNKNOWN | UNAVAILABLE`.

PRESENT and UNKNOWN remain v0.2 semantics.

UNAVAILABLE required surface maps:
- present=false
- principal_match from exact principal_identity
- identity VERIFIED only from exact Aaron+verified provenance rule
- applicability=APPLICABLE
- freshness from exact envelope observed_at/valid_through vs selected snapshot
- provenance_ok from exact envelope/source provenance
- partial=true.

Do not create any candidate/source record to fill unavailable inventory.
Any other token => `BINDING_HOLD/UNMAPPED_SOURCE_AVAILABILITY_TOKEN`.

## 3. Complete population audit test

Harness test must scan all 40 pinned cases before execution and assert:
- total required envelopes = 320
- PRESENT=318
- UNKNOWN=1
- UNAVAILABLE=1.

Assert sole UNAVAILABLE:
`p1e1r4_9f4b83c6c71644fd88451639fdf88db8 / qualified_big_packets`.

Unexpected count/token/location => HOLD before candidate call.

## 4. New falsification controls

Preserve all v0.3 F-controls including F25a-h.

Add:

F47 exact demonstrated UNAVAILABLE envelope -> SourceEvaluation:
`required=true,present=false,principal_match=true,identity=VERIFIED,applicability=APPLICABLE,freshness=CURRENT,provenance_ok=true,partial=true`.

F48 F47 fed to frozen candidate coverage with otherwise qualifying required sources -> INCOMPLETE_COVERAGE.

F49 UNAVAILABLE is not PRESENT-empty: toggling only availability from PRESENT empty/complete to UNAVAILABLE/incomplete changes present true->false and partial false->true.

F50 UNAVAILABLE is not UNKNOWN: UNKNOWN maps identity/applicability/freshness UNKNOWN; demonstrated UNAVAILABLE preserves VERIFIED/APPLICABLE/CURRENT.

F51 UNAVAILABLE cannot become INAPPLICABLE solely because record_refs empty.

F52 UNAVAILABLE cannot create synthetic qualified-BIG record/candidate/proven absence.

F53 enumeration_complete=false prevents closed-world absence.

F54 unavailable envelope provenance failure -> provenance_ok=false/partial=true under existing fail-closed identity rules; never upgraded to empty.

F55 unavailable envelope stale valid_through -> freshness=STALE and remains unavailable/partial.

F56 unavailable envelope malformed time -> freshness=UNKNOWN; never fabricated CURRENT.

F57 foreign principal unavailable envelope -> principal_match=false and existing identity fail-closed; privacy/source rules remain independent.

F58 unknown availability token -> `BINDING_HOLD/UNMAPPED_SOURCE_AVAILABILITY_TOKEN`.

F59 consequence/impact packet cannot change UNAVAILABLE SourceEvaluation fields.

F60 exact v0.3 self-identity F25a-h still pass unchanged.

All controls execute without E2/E3 inputs or candidate outputs.

## 5. Hard deny and counters

Unchanged:
`labels_consumed=0`
`candidate_outputs_consumed=0` during binding/harness qualification
`scoring_performed=false`.

E2 label/reference paths, Round-3 E2, E3/scoring and score-derived configuration remain denied before candidate execution.

## 6. Candidate immutability

Later execution branch still roots directly at exact candidate HEAD. Existing candidate source/tests byte-identical. Harness/evidence/output additions only under v0.3 permitted path boundary.

No candidate change to obtain INCOMPLETE_COVERAGE; existing coverage semantics already represent known inaccessible required source through present=false/partial=true with known identity/applicability/freshness.

## 7. Independent review before execution

No harness implementation/40-case execution until:
1. fresh independent exact-binding reviewer accepts v0.4;
2. STRATA issues execution release.

Reviewer must reproduce F47-F60 conceptually/source-level without E2 labels/candidate outputs.

## 8. Later execution contract unchanged

After release:
- exact 40/40
- one decoder + one buildProjection per case
- two clean runs
- byte-identical outputs/index
- immutable remote publication/readback
- labels=0
- scoring=false
- STOP before E3.

No candidate edit, merge, deploy, provider access, continuity admission or authority change.

Final current disposition:
`BINDING_CORRECTION_READY / UNAVAILABLE_REQUIRED_SURFACE_MAPPING_FROZEN / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED`
