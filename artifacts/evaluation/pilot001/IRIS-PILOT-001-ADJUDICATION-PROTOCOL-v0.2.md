# IRIS PILOT 001 — ADJUDICATION / CONSEQUENCE PROTOCOL v0.2
## Post-Fail Fresh Independent E1 Freeze

**Artifact ID:** IRIS-PILOT-001-ADJUDICATION-PROTOCOL-v0.2
**Evaluation round:** POST_FAIL_E1_FRESH_INDEPENDENT (second E1 cycle, following canonically CLOSED FAIL E3 at commit `5e92a059b5d1e15e10ea513ccd29f707b5d4013e`)
**Evaluator role:** NEW FRESH INDEPENDENT POST-FAIL E1 EVALUATOR, session `nD3udfQPYZA`
**Governing artifact:** Blueprint v0.4, §15-17.1 (blob `c030c5f475f38d6edd4bda52ecd74d6f9d9eb786`, commit `cda075e0137571aaf9fcb4b752ce0085d361e0cb`)
**Status:** PROTOCOL FROZEN AT E1. NOT YET APPLIED. NO LABELS EXIST.

---

## 1. Scope and binding

This protocol governs how the case population defined in
`IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.2.json` (30 cases, population digest
`acff0d9e1a2c268803f009c875d28f41ac8d8376e95ee551bd3a0ec75eb7c140`) will later be
adjudicated into governing answer labels, **after** exact repaired-candidate
freeze (Phase E2), by an evaluator blind to candidate outputs, per Blueprint
§17.1.

This document does **not** create, imply, or precompute any label for any
case. No case in the manifest carries an AR class, resolution_kind,
consequence weight, or expected disposition. Applying this protocol to
produce labels is explicitly deferred to Phase E2/E3 and is out of scope for
this E1 freeze.

## 2. Adjudication procedure (to be executed only after candidate freeze)

For each frozen case, the blind adjudicator will, using only:
(a) the frozen `scenario_text` and case metadata already published at E1,
(b) accepted Blueprint v0.4 architecture/semantics (§15 output contract, §17
metrics/thresholds), and
(c) source evidence strictly necessary to establish ground truth (never
candidate-derived signals),

determine for that case:

1. Whether the scenario constitutes a known-Aaron-required intervention,
   an Aaron-relevance-unknown item, an unresolved conflict, a coverage gap,
   a privacy exclusion, or a justified omission - mapped to the §15
   output-contract categories.
2. The applicable AR class(es) and `resolution_kind` per Blueprint §15.
3. The consequence-classification weight per the fixed §17 scale (§3 below).
4. Provenance, freshness, and uncertainty annotations required by §15.

The adjudicator MUST NOT consult, and MUST remain blind to, any classifier
output, candidate pass/fail result, model prediction, or V0 self-scoring
until after governing labels are completed and published, per
`LABEL_ADJUDICATOR_BLIND_TO_CANDIDATE_OUTPUTS_UNTIL_LABEL_PUBLICATION`.

## 3. Consequence-classification protocol (fixed weights, unchanged)

Preserved verbatim from Blueprint v0.4 §17 - this E1 freeze does not alter,
propose, or interpret these weights for any specific case:

| Class | Definition | Weight |
|---|---|---|
| C1 | Routine, bounded, reversible | 1 |
| C2 | Material objective-delay / privacy / coordination effect | 4 |
| C3 | Reserved-authority / unresolved consequential effect / material escalation | 16 |
| C4 | Legal / financial / safety / irreversible - classification evidence only | 64 |

Assignment of a specific case to a specific class is deferred to Phase
E2/E3 adjudication and is **not** performed in this document.

## 4. Metrics to be computed at E3 (unchanged from Blueprint §17)

weighted miss rate; unweighted recall; excess-notification rate; abstention;
incomplete coverage; conflict; justified-omission precision; Aaron Mechanical
Intervention Rate (AMIR, evaluated later as a comparative utility metric per
§17.1, not a Phase E1/E2 gate); institutional-change-to-Aaron-decision
compression; freshness latency; provenance coverage.

No threshold, denominator, or weight in Blueprint v0.4 §17/§17.1 is modified,
relaxed, or reinterpreted by this protocol.

## 5. Sequencing preserved (Blueprint §17.1, unchanged)

1. **E1 (this freeze):** case-input population + protocol + digest + evidence
   frozen and published BEFORE DEV/Builder repairs the label-exposed
   candidate. No labels exist. DEV/Builder does not author, select, or alter
   population, case IDs, digest, protocol, or thresholds.
2. **E2:** DEV repairs candidate -> exact repaired-candidate freeze (branch,
   head, tree, source-delta, test/evidence identity) -> STOP. Only after that
   freeze may a blind adjudicator apply §2 above to the already-frozen
   population to produce the governing label artifact
   (`IRIS-PILOT-001-REFERENCE-SET-LABELS-v0.2.json`, path/version to be fixed
   at that time), binding byte count, SHA-256, Git blob ID, population digest,
   and adjudication certification.
3. **E3:** Final independent scoring begins only once both the candidate and
   the labels are frozen and immutable; scorer evaluates the frozen candidate
   against frozen labels; AMIR is a later comparative utility metric.

`BUILDER_IMPLEMENTATION != REFERENCE_SET_ADJUDICATION != FINAL_METRIC_EVALUATION`
is preserved.

## 6. Independence guarantees for this E1 freeze

- Case scenarios were generated deterministically from an evaluator-chosen
  salt and this evaluator's session identity, independent of the failed
  candidate, its outputs, old E2 labels, or old E3 ledgers.
- Case content was not derived from, and does not reproduce, any prior-round
  case text. Only prior-round case IDs and aggregate digest/byte metadata
  were consulted, narrowly, to prove non-overlap (see independence
  certification, §3).
- No field in the manifest encodes an expected action, disposition, status,
  consequence assignment, or rationale that would function as a de facto
  label.

## 7. Non-authority preserved

This document grants no implementation, merge, deployment, Current
promotion, continuity activation, commerce, or BIG Activation authority.
`ZERO_AUTHORITY / CONTINUITY_OFF / NO_PR4_MERGE / NO_DEPLOYMENT /
IRIS_NOT_OPERATIONALLY_PROMOTED / BIG_ACTIVATION_NOT_AUTHORIZED` remain in
force.
