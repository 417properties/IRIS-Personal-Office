# IRIS Pilot 001 — E1 Frozen-Candidate Execution Return v0.1

Disposition:

`IRIS_PILOT_001_FROZEN_CANDIDATE_OUTPUT_VECTOR_PUBLISHED / EXACT_BINDING_CONSUMED / LABELS_CONSUMED_ZERO / SCORING_NOT_PERFORMED / FRESH_PHASE_E3_SCORER_REQUIRED`

Authority effect: NONE

## Frozen inputs

Accepted execution binding:
- acceptance object HEAD: `f2faa2efe80166714bdff827a200def6ffe93f66`
- binding SHA-256: `30427e56886059dd74f8b3187cbb7164b688c7a9e83f0a2b68e4d1a7caf18faa`
- binding Git blob: `e0c6244d916e7970f965eb8a95972d73e8e28d24`

Frozen candidate:
- HEAD: `2fd02febbc94e738b2f4be6a23622263a2ee4f3c`
- tree: `c6015cf7eab00756e2a3ab111dcb51aea8430648`

Frozen E1:
- HEAD: `aa8bba661976c2ef2c1d115b548fc2a86122e2f8`
- cases: 32
- population digest: `969c448021389502bcf4f689d7b7cea5d526fde250cbe264f9f8b1f3d6aee980`
- manifest SHA-256: `fde99bb1b1aa82a5b98f1d17eae1b42d790afabb0d9b74a2804f0ab9e6ff31df`
- manifest Git blob: `cac80fce950924af8140a8689953bef35a2217f6`

## Harness identity

Execution branch:
`evaluation/iris-pilot001-e1-frozen-candidate-harness-v0-1`

Harness source qualification head before output publication:
`6cd32f701550c2819491895a7563a62c8e3e2a07`

Harness blobs:
- adapter.mts: `8101d5cb0b8a5e7ee0e9eef63a97b4e735759a87`
- canonical-json.mts: `dc47453d8dae49160e38b591d44e57ce0d7fe0be`
- run.mts: `6b05e13c21661b22b6a2b731043db768ce36c9f4`
- harness.test.mts: `89b18f7c5a9c185459cd3a848b36c3402ab81310`

Candidate source was not modified. Comparison from the frozen candidate through the publication object contains only allowed additive harness, test, accepted-documentary, output, and evidence paths.

## Qualification

Harness falsification suite:
- 17/17 PASS
- label-path denial PASS
- exact 32-case population/order/digest checks PASS
- source mapping / privacy / duplicates / conflicts / escalation / bracket checks PASS
- frozen candidate blob checks PASS
- no copied candidate classifier/coverage/intervention logic

Repository regression:
- 171/171 PASS
- 0 fail

Static harness source leakage scan:
- prohibited E2/E3/reference-label source hits: 0

## Exact execution

The unchanged frozen candidate was invoked according to the accepted binding for all 32 frozen E1 case IDs.

Canonical execution:
- 32/32 case outputs written
- candidate HEAD/tree remained exact frozen pins
- labels consumed: 0
- scoring performed: false

Independent deterministic verification rerun:
- 32/32 case outputs
- 33 files compared (32 per-case outputs + index)
- byte-identical: PASS
- mismatches: 0
- vector digest: `e2ce80987928709e3872fbb9ae808ea4e06b1af6e77512289422772c54eccea0`

No E2 governing answers were read.
No E3 metric numerators/results were computed.
No candidate PASS/FAIL conclusion was produced by DEV.

## Immutable output publication

Output publication commit:
`b85c30a676f0991e8c33af9a32a16587fd2671ee`

Publication tree:
`78be0a8fdcd7fb4237fb94e8f6d310c76cb7633b`

Output index:
`artifacts/evaluation/pilot001/execution-binding-v0.1/IRIS-PILOT-001-FROZEN-CANDIDATE-OUTPUT-INDEX-v0.1.json`

- bytes: 12,997
- SHA-256: `858098db0d663340c6043fdef88de60abd07750520cd984e63d0d0cf878748ac`
- Git blob: `04b15bf7e8e4c27763be69add46b4d630d2a5706`

Execution evidence:
`artifacts/evaluation/pilot001/execution-binding-v0.1/IRIS-PILOT-001-FROZEN-CANDIDATE-EXECUTION-EVIDENCE-v0.1.json`

- bytes: 2,222
- SHA-256: `95423d98295c14fea1f7b26eb8a8046a06c7bcc0446da64cf30408c3bcab6243`
- Git blob: `9d52676d3f292cfea60efd19a34035d36ed5878c`

Per-case outputs:
- exact count: 32
- remote GitHub reread count: 32
- every remote per-case Git blob and byte count equals the immutable output index
- mismatches: 0

Remote round-trip:
- remote publication HEAD == `b85c30a676f0991e8c33af9a32a16587fd2671ee`
- remote publication tree == `78be0a8fdcd7fb4237fb94e8f6d310c76cb7633b`
- changed paths from frozen candidate: 40
- forbidden changed paths: 0

## Independence / authority boundary

`LABELS_CONSUMED_ZERO`
`SCORING_NOT_PERFORMED`
`NO_CANDIDATE_MUTATION`
`NO_LABEL_MUTATION`
`NO_PR4_MERGE`
`NO_DEPLOYMENT`
`CONTINUITY_OFF`
`ZERO_AUTHORITY`
`IRIS_NOT_OPERATIONALLY_PROMOTED`
`BIG_ACTIVATION_NOT_AUTHORIZED`

DEV stops here.

Next owner:
**STRATA -> fresh independent Phase E3 scorer**

The scorer may apply the already-frozen E2 labels/metrics to this immutable candidate-output vector. DEV must not inspect those answers or self-score.
