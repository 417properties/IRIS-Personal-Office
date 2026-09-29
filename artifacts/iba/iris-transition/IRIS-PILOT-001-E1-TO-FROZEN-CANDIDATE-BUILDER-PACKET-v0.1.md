# IRIS Pilot 001 — E1 → Frozen-Candidate External Harness Builder Packet v0.1

**Status:** BUILDER_READY / FRESH_INDEPENDENT_BINDING_ACCEPTANCE_REQUIRED  
**Authority effect:** NONE  
**Candidate mutation:** PROHIBITED  
**Phase E3 scoring:** PROHIBITED

## 1. Governing pins

- Binding artifact: `artifacts/iba/iris-transition/IRIS-PILOT-001-E1-TO-FROZEN-CANDIDATE-EXECUTION-BINDING-v0.1.json`
- Frozen E1 head: `aa8bba661976c2ef2c1d115b548fc2a86122e2f8`
- Frozen E1 tree: `05ea622e0210425d60ed017b857772e7499a21a8`
- E1 population: 32 cases
- E1 population digest: `969c448021389502bcf4f689d7b7cea5d526fde250cbe264f9f8b1f3d6aee980`
- Frozen candidate head: `2fd02febbc94e738b2f4be6a23622263a2ee4f3c`
- Frozen candidate tree: `c6015cf7eab00756e2a3ab111dcb51aea8430648`
- Blueprint v0.4 commit: `cda075e0137571aaf9fcb4b752ce0085d361e0cb`
- Blueprint SHA-256: `d478799495f06b7ac1d7b83c6726b913d8cc2fb43950ad45928ea0ec8affdc6d`

Consume the exact IBA publication head/tree/bytes/SHA-256/blob from the IBA return. If the binding artifact on disk does not hash to that publication identity, STOP.

## 2. Independence boundary

Implementation MUST NOT read, import, copy, grep, parse, or otherwise consume:
- `IRIS-PILOT-001-REFERENCE-SET-LABELS-v0.1.json`;
- any E2 per-case answer artifact;
- any E3 metric numerator, score, pass/fail result, or candidate grading artifact.

Implementation may use only the frozen E1 objects, the accepted binding, and exact frozen candidate source/API.

## 3. Execution topology

Use two physically distinct worktrees/directories:

1. **Harness workspace** — descendant of the accepted binding publication head.
2. **Candidate workspace** — detached read-only checkout at exactly `2fd02febbc94e738b2f4be6a23622263a2ee4f3c`.

Before every run:

```bash
git -C <candidate-worktree> rev-parse HEAD
git -C <candidate-worktree> rev-parse HEAD^{tree}
git -C <candidate-worktree> status --porcelain
```

Required observations:
- HEAD == frozen candidate head;
- tree == frozen candidate tree;
- status is empty.

After the run, repeat the same three checks. Any difference invalidates the run.

## 4. Files permitted to create

Only new files under these paths:
- `evaluation-harness/pilot001/e1-to-frozen-candidate-binding-v0.1.mts`
- `evaluation-harness/pilot001/run-e1-frozen-candidate-v0.1.mts`
- `tests/evaluation/pilot001/e1-to-frozen-candidate-binding-v0.1.test.mts`
- `artifacts/evaluation/pilot001/candidate-outputs-v0.1/*.json`
- `artifacts/evaluation/pilot001/IRIS-PILOT-001-FROZEN-CANDIDATE-OUTPUT-BUNDLE-RECEIPT-v0.1.json`

Do not add a package script merely for convenience; invoke Node directly.

## 5. Files forbidden to change

Forbidden:
- all frozen candidate files, including every `src/agent-transition/**` file;
- `db/**`;
- `package.json` and lockfiles;
- existing `tests/agent-transition/**`;
- all frozen E1 artifacts;
- all E2/E3 artifacts;
- PR #4 branch/ref/metadata;
- migrations;
- scoring metrics or thresholds.

The implementation branch may not be used to update PR #4.

## 6. Required implementation behavior

Implement the binding literally. In particular:

- verify E1 manifest bytes/hash/blob and population digest;
- verify all 32 case IDs and frozen order;
- normalize only `principal_aaron -> AARON`;
- construct exactly eight `SourceEvaluation` values in the frozen candidate required-source order;
- preserve MISSING/PARTIAL/STALE/UNKNOWN/CONFLICT;
- do not infer external packet freshness;
- use exact duplicate canonical anchors only where frozen duplicate evidence proves them;
- preserve uncertain duplicates with `possible_duplicate_refs`;
- enforce field-level cross-principal packet authorization;
- construct UNKNOWN rather than consume withheld cross-principal classifier fields;
- preserve unresolved conflicts without choosing a side;
- map fixture dependency bracket deterministically;
- set `started_at == emitted_at == fixture_time`;
- invoke frozen `buildProjection` exactly once for each case;
- do not call candidate metric functions;
- canonicalize output exactly per binding;
- emit one file per case plus one bundle receipt.

## 7. Required tests / falsifiers

The implementation test MUST cover at least:

1. exact E1 hash/digest/order pinning;
2. exact candidate head/tree/source-blob pinning;
3. eight-source membership and order;
4. `required:true` cannot be narrowed;
5. missing source -> no false COMPLETE;
6. stale source -> no false COMPLETE;
7. partial source -> no false COMPLETE;
8. UNKNOWN identity/applicability/freshness preserved;
9. exact principal normalization only;
10. wrong-principal private record leaks zero private classifier fields;
11. bounded packet cannot widen beyond `allowed_fields`;
12. exact canonical duplicate anchor consolidates;
13. semantic similarity with distinct anchors stays distinct;
14. uncertain duplicate stays unmerged and visible;
15. conflict is never silently resolved;
16. unstable bracket -> UNKNOWN behavior through frozen candidate;
17. unauthorized scope-change request cannot narrow required source set;
18. repeated execution of every case produces byte-identical canonical files;
19. candidate worktree tree/status identical before and after;
20. no label/E3 artifact path was read.

## 8. Commands

Illustrative execution commands; paths are local workspace parameters, not authority:

```bash
node --experimental-strip-types tests/evaluation/pilot001/e1-to-frozen-candidate-binding-v0.1.test.mts
node --experimental-strip-types evaluation-harness/pilot001/run-e1-frozen-candidate-v0.1.mts \
  --manifest <harness-worktree>/artifacts/evaluation/pilot001/IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.1.json \
  --candidate-root <candidate-worktree> \
  --output <harness-worktree>/artifacts/evaluation/pilot001/candidate-outputs-v0.1
```

The runner MUST abort before the first invocation on any pin mismatch.

## 9. Output bundle receipt

The receipt MUST include:
- accepted binding artifact SHA-256/blob/publication head/tree;
- E1 head/tree/manifest hash/population digest;
- candidate head/tree and verified source blobs;
- exactly 32 ordered output filenames;
- per-file byte count/SHA-256;
- bundle digest over ordered `case_id|output_sha256`;
- candidate pre/post tree equality;
- test result summary;
- label artifacts consumed = 0;
- E3 scoring performed = NO;
- candidate source modified = NO.

## 10. Stop / handoff

After immutable outputs and receipt are published, STOP.

Next owner is a **fresh Phase E3 scorer**, not DEV/V0/Builder.

Do not score, merge, deploy, promote IRIS, activate continuity, or claim BIG Activation.

`ZERO_AUTHORITY / CONTINUITY_OFF / NO_PR4_MERGE / NO_DEPLOYMENT / NO_PHASE_E3_SCORING / BIG_ACTIVATION_NOT_AUTHORIZED`
