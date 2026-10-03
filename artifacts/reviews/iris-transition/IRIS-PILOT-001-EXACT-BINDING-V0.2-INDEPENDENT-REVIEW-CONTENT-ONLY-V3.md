# IRIS Pilot 001 — Independent exact-binding review, content-only v3

Disposition: IRIS_PILOT_001_REPLACEMENT_E1_EXECUTION_BINDING_INDEPENDENT_ACCEPTANCE_HOLD
Exact material HOLD: BINDING_HOLD/PROVEN_SELF_IDENTITY_MISCLASSIFIED_AS_UNRESOLVED_DUPLICATE
EXACT_BINDING_V0_2_NOT_ACCEPTED / NO_EXECUTION_RELEASE / NO_GATE_PROGRESS

## Authority and independence

Sole institutional starting authority: https://github.com/417properties/BIG-Navigator/issues/703#issuecomment-5963559363.

This was a fresh independent review without inherited review conclusions. Only that exact authority comment was emitted from the issue-comment retrieval; other comments were filtered out before entering reviewer context. Subsequent repository retrieval was confined to individually requested file contents and one specifically pinned Blueprint blob. No Git commit/tree/ref/provenance/compare/diff/search endpoint, PR metadata, candidate test file, candidate evidence/review file, E2/E3 artifact, or candidate output was retrieved. Documentary test requirements inside the expressly permitted binding/packet/Blueprint were not candidate test expectations. Parent assistance supplied mechanical repository/file locations only.

REVIEW_CONTENT_TRANSPORT=PASS / FILE_OR_BLOB_READS_ONLY / ZERO_GIT_METADATA_ENDPOINTS / ZERO_TEST_EXPECTATIONS / ZERO_CANDIDATE_OUTPUTS / ZERO_E2_E3_ANSWERS.

Graph identities were accepted as authority-supplied pins, not verified through Git metadata. Content hashes and Git blob identities below were independently computed locally from UTF-8 bytes using SHA256 and SHA1("blob " + byte_length + NUL + bytes). The Blueprint was requested directly by its authority-pinned blob SHA and its returned bytes independently reproduce that SHA. No candidate code was imported, implemented or executed; no labels, denominators or scores were calculated.

## Exact input verification

Repository: 417properties/IRIS-Personal-Office.

Binding at 849dcdee8ae1ff351b2c11da426ab1009bbe8ff4:
artifacts/iba/iris-transition/IRIS-PILOT-001-REPLACEMENT-E1-TO-FROZEN-CANDIDATE-EXECUTION-BINDING-v0.2.md
15004 bytes / SHA256 cfc8a73114b46b34c7de1150a50a33aa5aef806b1e721b0718699b67a00cfc71 / blob 40b05a3b98ee4a25345310c0dcf89521c43a40c5. All match.

Packet at 3e95553bd4531e25f50e0e84858025b6df47a62c:
artifacts/iba/iris-transition/IRIS-PILOT-001-REPLACEMENT-E1-EXECUTION-BUILDER-PACKET-v0.2.md
7505 bytes / SHA256 a675ff14d5f9d74c23ecaeb275de891ee5eeda74e0eb360885cfe823957c3f61 / blob 8cc34a5e199de92d34baf1b78853ffe269fd96db. All match.

Blueprint v0.4: 53261 bytes / SHA256 d478799495f06b7ac1d7b83c6726b913d8cc2fb43950ad45928ea0ec8affdc6d / blob c030c5f475f38d6edd4bda52ecd74d6f9d9eb786. Authority content pins match.

Replacement-E1 directory at 849deca383add66773ab1ba0c8bc0ca852523c8f:
artifacts/evaluation/pilot001/replacement-e1-v0.4-08e89d578d95/.

| File | Bytes | Locally reproduced Git blob |
| --- | ---: | --- |
| case-input-manifest.json | 3169 | fef39e3284eae5559ac016c01211c0d9bc244fa5 |
| population-identity.json | 3148 | ff873138926524501eba5ea1230f9635fca124c8 |
| adjudication-protocol.md | 17169 | 5aa65205d401409b5b07b82e57864841bd57120b |
| case-inputs-01.json | 302533 | 7a35d77ad927218f903e63f966ccee3341e7d717 |
| case-inputs-02.json | 311749 | 53a8c9dbf36b1bc666d164daed3bcbf05c46b230 |
| case-inputs-03.json | 310747 | 4d492ac0d661b6fdb6315461fba5f720757a3cc7 |
| case-inputs-04.json | 303058 | 86924bb9e12c6e39e155ee6fcb0ca9f75dae7dec |

Manifest SHA256 0eca9c456d85bd2b3e62cd1752d0cf4de81988c519c2ae0724a81573269b53d6 and protocol SHA256 619b28d8cc6fdd8048bdaeff2807a10f438349f1a7249f3701b209a7e786d66b reproduce their supplied content pins. The four arrays concatenate to exactly 40 cases, with ordered IDs equal to both manifest and population-identity lists. Recursive-key-sorted, comma/colon-separated, UTF-8, ensure_ascii=false serialization without trailing LF reproduces population SHA256 32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f.

Permitted production files at frozen candidate 185dbd1be80bd54c6cf5dcc085f105a637fe7e44, under src/agent-transition/:

| File | Bytes | Locally reproduced Git blob |
| --- | ---: | --- |
| pilot001-types.ts | 2420 | c8c7aa257b1f319b5fe518f8cebaf9ff55ea6301 |
| pilot001-classifier.ts | 4246 | b716d1bf8d07cd040793d54674bb3cd1a4ae2e14 |
| pilot001-coverage.ts | 4733 | 2b21f40cf27457523d5540db226446c1ee6c83e4 |
| pilot001-projection.ts | 7108 | 4931d997e7200353e3011bfd3c548b0bf826c027 |

All four match binding pins and returned file blob identities. Historical documentary files were unnecessary and not retrieved.

## One exact material falsifier

Pinned source: case-inputs-04.json, case p1e1r4_dd291386b74e4b568634d20c138457ea, record source_link_observation:90e53de973cd4d2fa34b054a412c0bb0.

Its exact candidate-free source facts are:

```json
{
  "authoritative_merge_ref": null,
  "identity_proven": true,
  "left_ref": "obligation:1b3146da2fac4befa199947d0e30e3d2",
  "possible_same_underlying_request": true,
  "right_ref": "obligation:1b3146da2fac4befa199947d0e30e3d2"
}
```

There is one obligation record with that exact ID, and the obligations envelope references it once. The source-link record is explicitly included in the current_assertions envelope. This is a proven self-identity, not two unresolved competing canonical identities. It needs no merge of distinct records.

Binding section 11 nevertheless selects POSSIBLE_DUPLICATE_UNRESOLVED whenever source_link_observation has possible_same_underlying_request=true and no authoritative_merge_ref. Section 12 repeats that possible_same=true without authoritative merge creates possible_duplicate_refs/conflict. Neither predicate excludes exact self-identity or checks identity_proven. The quoted source record satisfies the written predicate literally.

This conflicts with Blueprint section 10's distinction between exact canonical identity and uncertain possible duplicates, and the candidate-free protocol's rule that an uncertain identity link is a possible-duplicate conflict. The binding changes proven identity into unresolved conflict merely because a redundant self-link has no merge reference. No semantic similarity inference or consequence packet is necessary to establish this defect.

Materiality follows directly from the permitted production interface, without computing an output: binding section 11 requires deterministic conflict IDs in input.conflicts; buildProjection passes input.conflicts to evaluateCoverage and copies it to unresolved_conflicts. evaluateCoverage returns CONFLICTED_COVERAGE when that list is nonempty after its unstable-bracket check. Thus injecting this unsupported conflict affects coverage and visible conflict reporting, and can affect downstream intervention treatment. This is evaluation-relevant input transformation, not cosmetic serialization.

The one-layer-deeper discretionary choice is whether an implementer follows the binding's broad condition and injects the unsupported self-conflict, or silently exempts proven identical anchors to preserve the source meaning. Those alternatives differ in a material ProjectionInput field before candidate execution. The second alternative repairs the binding rather than implements it literally; it is not authorized by the exact frozen document.

Section 17's fallback for an unlisted record type or structurally non-unique mapping does not supply a deterministic resolution here: source_link_observation is explicitly listed, the exact target identity is unique, and the positive conflict predicate expressly matches. A blanket claim that ambiguity fails closed cannot override this concrete erroneous positive mapping. The binding needs an explicit candidate-independent distinction between exact proven identity, authorized merging of distinct identities, and genuinely uncertain links, or an explicit pre-execution HOLD for a contradictory source-link shape. The reviewer does not choose or implement that amendment.

## Scope of completed review and release decision

The review examined the binding's population/order, snapshot selection, eight source mappings, record history/lifecycle, principal/privacy boundary, roots/order, permission/delegation, conflicts/duplicate identity, qualified BIG, consequence deny rule, serialization/rerun and input-deny boundary against the permitted source/protocol/Blueprint and production interface. The verified population and execution boundary do not cure the concrete duplicate-identity defect. No PASS is asserted for the complete mapping contract, and no claim is made that this is an exhaustive defect inventory. One material falsifier is sufficient to reject exact-binding acceptance; no E2 reference answer or observed candidate behavior is needed.

The Builder packet requires literal implementation of this binding and therefore inherits the blocker. Two deterministic runs could reproduce the same unsupported conflict; determinism alone would not validate the transformation. Do not release implementation/execution under this acceptance review. Route this exact HOLD for binding-owner reconciliation and fresh exact-binding acceptance of any authorized correction.

Preserve all earned gates and immutable evidence, including ROUND3_E1_SUPERSEDED_FOR_EVALUATION_BY_CONSEQUENCE_INPUT_DEFECT / ROUND3_E2_HOLD_VALID_AS_HISTORICAL_EVIDENCE / REPLACEMENT_E1_FROZEN / POST_REPLACEMENT_E1_CANDIDATE_REFREEZE_CLOSED / REPLACEMENT_E1_BLIND_E2_CLOSED.

IRIS_NOT_OPERATIONALLY_PROMOTED / CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_CONTINUITY_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED.

No candidate mutation, DEV execution, scoring, deployment, admission, continuity change or authority expansion was performed or authorized. Reviewer stops after sealing this judgment. Parent publication must preserve these exact UTF-8 bytes.
