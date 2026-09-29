# IRIS Pilot 001 — E1 to Frozen-Candidate Execution Builder Packet v0.1

Status: BUILDER_READY_AFTER_FRESH_INDEPENDENT_BINDING_ACCEPTANCE
Authority effect: NONE

Governing binding:
artifacts/iba/iris-transition/IRIS-PILOT-001-E1-TO-FROZEN-CANDIDATE-EXECUTION-BINDING-v0.1.md

Binding publication commit:
851810b0715d0be90b32f0f9b7cd16be652e0d5e

This packet does not release implementation by itself. STRATA 8.4 must first consume a fresh independent acceptance of the exact binding.

## 1. Frozen pins

Candidate repository:
417properties/IRIS-Personal-Office

Frozen candidate:
- HEAD 2fd02febbc94e738b2f4be6a23622263a2ee4f3c
- tree c6015cf7eab00756e2a3ab111dcb51aea8430648
- PR #4 remains DRAFT / OPEN / UNMERGED

Frozen E1:
- head aa8bba661976c2ef2c1d115b548fc2a86122e2f8
- manifest path artifacts/evaluation/pilot001/IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.1.json
- manifest SHA-256 fde99bb1b1aa82a5b98f1d17eae1b42d790afabb0d9b74a2804f0ab9e6ff31df
- manifest Git blob cac80fce950924af8140a8689953bef35a2217f6
- population 32
- population digest 969c448021389502bcf4f689d7b7cea5d526fde250cbe264f9f8b1f3d6aee980
- adjudication protocol blob 62ddbc5189a6fde6fe0697ac8e1ed933dc606363

Governing Blueprint:
- commit cda075e0137571aaf9fcb4b752ce0085d361e0cb
- SHA-256 d478799495f06b7ac1d7b83c6726b913d8cc2fb43950ad45928ea0ec8affdc6d

## 2. Downstream owner

After fresh independent acceptance and explicit STRATA release:

implementation owner = authorized DEV / execution capability for IRIS Pilot 001.

The owner implements only the external evaluation harness and immutable evidence/output carrier.

The owner does not become candidate Builder for PR #4, does not modify candidate semantics, and does not self-score.

## 3. Execution branch

Create a new execution branch rooted at the exact frozen candidate commit:

evaluation/iris-pilot001-e1-frozen-candidate-harness-v0-1

Base MUST be:
2fd02febbc94e738b2f4be6a23622263a2ee4f3c

Before writing, prove:
git rev-parse HEAD == 2fd02febbc94e738b2f4be6a23622263a2ee4f3c
git rev-parse HEAD^{tree} == c6015cf7eab00756e2a3ab111dcb51aea8430648

The accepted binding/packet may be brought onto the execution branch only as exact byte-identical documentary additions or consumed from their immutable Git objects. Their bytes must not be edited by DEV.

## 4. Permitted new paths

Only new files under these path families are permitted:

evaluation/pilot001/frozen-e1-binding-v0.1/**
tests/evaluation/pilot001-frozen-e1-binding-v0.1/**
artifacts/evaluation/pilot001/execution-binding-v0.1/**
evidence/IRIS-PILOT-001-E1-FROZEN-CANDIDATE-EXECUTION-RETURN-v0.1.md

If exact accepted IBA documentary objects are copied into the execution branch, only these exact paths may additionally be created byte-identically:
artifacts/iba/iris-transition/IRIS-PILOT-001-E1-TO-FROZEN-CANDIDATE-EXECUTION-BINDING-v0.1.md
artifacts/iba/iris-transition/IRIS-PILOT-001-E1-TO-FROZEN-CANDIDATE-EXECUTION-BUILDER-PACKET-v0.1.md

No other path addition is authorized without a new release.

## 5. Forbidden changes

No existing file at candidate HEAD 2fd02feb... may change.

Explicitly forbidden:
- src/agent-transition/**
- tests/agent-transition/**
- db/migrations/**
- src/state/**
- package.json
- package-lock.json or any dependency lockfile
- existing evidence/**
- existing artifacts/evaluation/pilot001/**
- PR #4 metadata/source
- E1 manifest/protocol/population identity
- any E2 label artifact
- any E3 scoring artifact
- metric code or thresholds.

Required source-boundary proof:
git diff --name-status 2fd02febbc94e738b2f4be6a23622263a2ee4f3c..HEAD

Every changed path must be an allowed new path above. Any M, D or R status on a pre-existing candidate file is an execution HOLD.

## 6. Required harness files

Minimum implementation:

evaluation/pilot001/frozen-e1-binding-v0.1/adapter.mts
- implements the exact FrozenE1ProjectionDecoder contract;
- imports candidate types/functions from the frozen candidate source, never copies their logic;
- produces ProjectionInput exactly as frozen by the binding.

evaluation/pilot001/frozen-e1-binding-v0.1/canonical-json.mts
- implements pilot001.binding-canonical-json.v0.1;
- has no candidate semantics.

evaluation/pilot001/frozen-e1-binding-v0.1/run.mts
- validates all frozen pins;
- reads only the allowed E1/binding inputs;
- iterates the exact ordered 32 cases;
- calls frozen buildProjection exactly once per case;
- writes deterministic per-case outputs and index;
- performs no scoring.

Optional helper modules are allowed only inside the same harness directory and may not duplicate candidate classifier/coverage logic.

## 7. Label-leakage deny boundary

The harness and tests MUST NOT read, import, parse, fetch or open:
- IRIS-PILOT-001-REFERENCE-SET-LABELS-v0.1.json
- any path containing PHASE-E3-FINAL-SCORING
- any E2/E3 score result or metric numerator artifact
- commit fdcac4331ea9e5f3dbd13bf04d14e3e7b406c41e as a data source for execution.

Runtime file access must be allowlisted to:
- frozen E1 manifest;
- frozen E1 population identity / protocol only when needed for pin verification;
- accepted binding/packet identities;
- frozen candidate modules imported by the harness;
- its output directory.

Tests MUST include a negative control proving a labels path causes immediate failure.

A source grep/static check must prove no reference-label filename, E2 label commit, or Phase-E3 scoring artifact is embedded in harness source.

## 8. Required execution command

The implementation must support this exact public command shape:

node --experimental-strip-types evaluation/pilot001/frozen-e1-binding-v0.1/run.mts \
  --candidate-head 2fd02febbc94e738b2f4be6a23622263a2ee4f3c \
  --candidate-tree c6015cf7eab00756e2a3ab111dcb51aea8430648 \
  --e1-head aa8bba661976c2ef2c1d115b548fc2a86122e2f8 \
  --population-digest 969c448021389502bcf4f689d7b7cea5d526fde250cbe264f9f8b1f3d6aee980 \
  --manifest artifacts/evaluation/pilot001/IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.1.json \
  --binding artifacts/iba/iris-transition/IRIS-PILOT-001-E1-TO-FROZEN-CANDIDATE-EXECUTION-BINDING-v0.1.md \
  --out artifacts/evaluation/pilot001/execution-binding-v0.1

No option may accept an alternate principal mapping, source mapping, duplicate policy, bracket policy, privacy policy, case filter, ordering policy or scoring label.

The run command must reject any attempt to select a subset of cases.

## 9. Required test/falsification suite

Before publishing outputs, tests must prove at minimum:

Identity:
- exact principal_aaron -> AARON;
- PRINCIPAL_AARON, Aaron, whitespace variants and unknown aliases do not normalize;
- null material identity remains unknown.

Population:
- exact 32 ordered IDs pass;
- missing, extra, duplicate or reordered case fails.

Required sources:
- exactly eight target IDs in exact order;
- empty present surface is not mistaken for missing;
- caller required=false cannot narrow a required source;
- missing, stale, unknown-applicability and partial facts map exactly per binding;
- qualified BIG empty surface is deterministic;
- a qualified BIG packet without evaluable freshness maps UNKNOWN, never CURRENT.

Candidate construction:
- decision records are not joined to obligations without an explicit frozen relation;
- candidate root order is deterministic;
- embedded facts from a MISSING source cannot restore that source;
- owner, decision-maker, authority holder and escalation target remain distinct.

Duplicates:
- exact/shared canonical_anchor_id yields exact common obligation anchor;
- similar text with distinct canonical anchors stays distinct;
- uncertain/no anchor stays distinct with possible_duplicate_refs;
- no semantic-text dedupe exists.

Conflicts:
- assertion-ref overlays are deterministic;
- receipt -> exact intent relation is deterministic;
- no-match conflict creates exactly one conflict-only root;
- more than one conflict_id on a single frozen candidate root fails closed rather than cloning.

Escalation:
- authority-ambiguity escalation binds to exact AUTHORITY_CONFLICT root(s);
- incompatible-instruction escalation binds to exact INCOMPATIBLE_OBLIGATIONS root(s);
- otherwise only one deterministic root may receive escalation;
- ambiguous multi-root escalation fails.

Privacy:
- wrong-principal/no authorization yields privacy exclusion and zero private candidates;
- bounded packet imports only allowed fields;
- unauthorized fields cannot affect candidate classification;
- privacy exclusion is not justified omission.

Bracket:
- zero-rerun stable -> STABLE;
- one-rerun declared stable -> RERUN_STABLE;
- repeated instability -> UNSTABLE.

Determinism:
- candidate/source object property insertion order matches binding;
- canonical JSON rejects undefined/nonfinite values;
- two complete executions produce byte-identical 32 outputs and identical index;
- per-case payload SHA-256 values match on both runs.

Candidate boundary:
- harness imports frozen buildProjection;
- no copied classifyAaron, evaluateCoverage, interventionFor or intervention-ID logic is accepted;
- frozen candidate source blobs remain byte-identical.

## 10. Output directory

Required:
artifacts/evaluation/pilot001/execution-binding-v0.1/outputs/<case_id>.json

Required index:
artifacts/evaluation/pilot001/execution-binding-v0.1/IRIS-PILOT-001-FROZEN-CANDIDATE-OUTPUT-INDEX-v0.1.json

Required execution evidence:
artifacts/evaluation/pilot001/execution-binding-v0.1/IRIS-PILOT-001-FROZEN-CANDIDATE-EXECUTION-EVIDENCE-v0.1.json

The index must contain:
- schema/version;
- exact binding path/SHA-256/Git blob;
- candidate head/tree;
- E1 head/population digest;
- ordered 32 case IDs;
- each output path, byte count, file SHA-256, payload SHA-256 and Git blob after publication;
- deterministic rerun comparison PASS/FAIL;
- labels-consumed count fixed at zero;
- scoring-performed fixed at false.

The execution evidence must record tests and pin checks, not candidate PASS/FAIL metrics.

## 11. Pre-publication verification

Required before commit:
1. verify manifest SHA-256 and population digest;
2. verify candidate HEAD/tree;
3. verify exact accepted binding bytes/hash/blob;
4. run harness tests;
5. run exact 32-case command;
6. rerun into a clean second output directory;
7. byte-compare all outputs/index payloads;
8. prove no label/E3 path access;
9. prove frozen candidate files unchanged;
10. compute output file hashes.

If any check fails, do not publish a partial candidate-output vector as governing evidence.

## 12. Publication and round trip

Publish only after all checks pass.

Then reread from canonical GitHub:
- execution branch head/tree;
- harness files;
- all 32 outputs;
- index;
- execution evidence.

Verify bytes/SHA-256/Git blobs after publication.

Required successful return:

IRIS_PILOT_001_FROZEN_CANDIDATE_OUTPUT_VECTOR_PUBLISHED / EXACT_BINDING_CONSUMED / LABELS_CONSUMED_ZERO / SCORING_NOT_PERFORMED / FRESH_PHASE_E3_SCORER_REQUIRED

Return:
- branch/head/tree;
- changed-path proof;
- harness artifact identities;
- binding identity;
- candidate head/tree;
- E1 population identity;
- 32/32 execution count;
- deterministic rerun proof;
- output-index identity;
- per-case publication proof;
- no-label-use certification.

## 13. Stop condition and owner succession

The DEV/execution owner MUST stop after immutable output publication.

It MUST NOT:
- inspect E2 answers;
- compute metrics;
- decide PASS/FAIL;
- merge PR #4;
- deploy;
- activate continuity;
- perform AMIR utility qualification;
- promote IRIS.

After output publication, return to STRATA 8.4.

STRATA releases a fresh independent Phase-E3 scorer only after the immutable vector is reconciled.

Preserve:
ZERO_AUTHORITY
CONTINUITY_OFF
NO_CANDIDATE_MUTATION
NO_LABEL_MUTATION
NO_SCORING
NO_PR4_MERGE
NO_DEPLOYMENT
IRIS_NOT_OPERATIONALLY_PROMOTED
BIG_ACTIVATION_NOT_AUTHORIZED
