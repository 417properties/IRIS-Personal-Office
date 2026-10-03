import test from 'node:test';
import assert from 'node:assert/strict';
import * as k from '../../src/semantic-kernel/index.ts';

const T = '2026-10-03T12:00:00Z', earlier = '2026-10-03T11:00:00Z', later = '2026-10-03T13:00:00Z';
const principal = k.identity('PRINCIPAL', 'Aaron:opaque'), root = k.identity('OBLIGATION', 'obj_NOT_a_relationship');
const epistemic = { knowledge_state: 'KNOWN', applicability_state: 'APPLICABLE', freshness_state: 'CURRENT_AS_OF', coverage_state: 'COMPLETE_FOR_DECLARED_SCOPE', as_of: T, evidence_refs: ['source:one'], invalidators: ['expiry'] };
const fact = { root, principal, epistemic, requirement: 'REQUIRED', disposition: 'KNOWN_REQUIRED', disposition_evidence: [], reactivation_refs: [] };
const temporal = { recorded_at: earlier, effective_from: earlier, observed_at: earlier };
const lifecycle = { object: root, principal, version: 1, state: 'NONTERMINAL', last_event_ref: 'e0', evidence_refs: ['initial-state'], basis_ref: 'source:initial' };
const lifeEvent = { object: root, principal, expected_version: 1, event_id: 'e1', next_state: 'SATISFIED', kind: 'TRANSITION', evidence_refs: ['proof'], at: T, basis_ref: 'reconciliation:one', basis_kind: 'CLOSURE_RECONCILIATION', basis_knowledge: 'KNOWN' };
const effect = { intent: k.identity('INTENT', 'intent'), operation_digest: 'digest', occurrence: k.identity('CAUSAL_OCCURRENCE', 'occurrence'), version: 1, disposition: 'UNKNOWN', last_event_ref: 'e0', proof: 'NONE', evidence_refs: ['uncertainty-source'] };
const effectEvent = { intent: effect.intent, operation_digest: effect.operation_digest, occurrence: effect.occurrence, expected_version: 1, event_id: 'e1', next_disposition: 'NO_EFFECT_VERIFIED', kind: 'OBSERVATION', proof: 'POSITIVE_ABSENCE', evidence_refs: ['absence-proof'], at: T };
const relation = { relation_id: 'relation', principal, source: k.identity('RESOLUTION', 'r1'), target: k.identity('RESOLUTION', 'r2'), kind: 'RESOLUTION_EQUIVALENCE', version: 1, temporal, evidence_refs: ['equivalence-source'] };
const occurrence = { occurrence: effect.occurrence, originating_ref: effect.intent, first_occurred_at: earlier, operation_digest: 'digest', evidence_refs: ['live-source'] };

for (const state of k.KNOWLEDGE) test('A1 distinct knowledge coordinate ' + state, () => {
  const e = k.decodeEpistemic({ ...epistemic, knowledge_state: state }); assert.equal(e.knowledge_state, state);
  assert.equal(e.applicability_state, 'APPLICABLE'); assert.equal(e.freshness_state, 'CURRENT_AS_OF');
});
for (const state of k.APPLICABILITY) test('A1 distinct applicability coordinate ' + state, () => assert.equal(k.decodeEpistemic({ ...epistemic, applicability_state: state }).applicability_state, state));
for (const state of k.FRESHNESS) test('A1 distinct freshness coordinate ' + state, () => assert.equal(k.decodeEpistemic({ ...epistemic, freshness_state: state }).freshness_state, state));
for (const state of k.COVERAGE) test('A1 distinct coverage coordinate ' + state, () => assert.equal(k.decodeEpistemic({ ...epistemic, coverage_state: state }).coverage_state, state));
for (const field of Object.keys(epistemic)) test('A1 missing coordinate rejected ' + field, () => { const x = { ...epistemic }; delete x[field]; assert.throws(() => k.decodeEpistemic(x), /MISSING_COORDINATE/); });
test('A1 unknown denial cannot become known false/not applicable', () => assert.throws(() => k.decodeEpistemic({ ...epistemic, knowledge_state: 'UNKNOWN', applicability_state: 'NOT_APPLICABLE_PROVEN' }), /UNKNOWN/));
test('A1 not-applicable absence is not proof', () => assert.throws(() => k.decodeEpistemic({ ...epistemic, applicability_state: 'NOT_APPLICABLE_PROVEN', evidence_refs: [] }), /EVIDENCE/));
test('A1 no casing/default/extra coordinate coercion', () => {
  assert.throws(() => k.decodeEpistemic({ ...epistemic, knowledge_state: 'known' }), /UNSUPPORTED/);
  assert.throws(() => k.decodeEpistemic({ ...epistemic, authority: 'GRANTED' }), /UNMAPPED/);
});
test('A1 exact nonempty conserved facts produce complete coverage', () => {
  const r = k.reduceCoverage({ roots: [root], principal, as_of: T }, [fact]); assert.equal(r.coverage_state, 'COMPLETE_FOR_DECLARED_SCOPE'); assert.equal(r.facts.length, 1);
});
test('A1 empty scope never manufactures complete coverage', () => assert.equal(k.reduceCoverage({ roots: [], principal, as_of: T }, []).coverage_state, 'INCOMPLETE'));
for (const state of ['UNKNOWN', 'MISSING', 'UNAVAILABLE', 'CONFLICTED', 'INVALID', 'REJECTED']) test('A1 classification facts drive coverage ' + state, () => {
  const f = { ...fact, epistemic: { ...epistemic, knowledge_state: state }, requirement: 'UNKNOWN', disposition: state === 'CONFLICTED' ? 'CONFLICT_HOLD' : state === 'INVALID' || state === 'REJECTED' ? 'INVALID_REJECTED' : 'RELEVANCE_UNKNOWN' };
  const result = k.reduceCoverage({ roots: [root], principal, as_of: T }, [f]);
  assert.equal(result.coverage_state, state === 'CONFLICTED' ? 'CONFLICTED' : state === 'UNKNOWN' ? 'UNKNOWN' : 'INCOMPLETE');
  assert.equal(result.facts[0].epistemic.knowledge_state, state);
});
test('A1 omissions, duplicate roots and foreign roots fail conservation', () => {
  const scope = { roots: [root], principal, as_of: T };
  for (const inputs of [[], [fact, fact], [{ ...fact, root: k.identity('OBLIGATION', 'other') }]]) assert.throws(() => k.reduceCoverage(scope, inputs), /CONSERVATION/);
  assert.throws(() => k.reduceCoverage({ ...scope, roots: [root, root] }, [fact, fact]), /DUPLICATE/);
});
test('A1 exact principal and as-of conservation', () => {
  for (const f of [{ ...fact, principal: k.identity('PRINCIPAL', 'foreign') }, { ...fact, epistemic: { ...epistemic, as_of: later } }]) assert.throws(() => k.reduceCoverage({ roots: [root], principal, as_of: T }, [f]), /SCOPE_OR_CUT/);
});
for (const terminal of ['SATISFIED', 'SUPERSEDED', 'ABANDONED']) test('A1 terminal history retained ' + terminal, () => {
  const f = { ...fact, epistemic: { ...epistemic, applicability_state: terminal }, requirement: 'NOT_REQUIRED_PROVEN', disposition: 'TERMINAL_RETAINED' };
  assert.equal(k.decodeFact(f).root.id, root.id); assert.equal(k.reduceCoverage({ roots: [root], principal, as_of: T }, [f]).facts.length, 1);
});
test('A1 privacy/deferred retains unknown and needs explicit reactivation', () => {
  const f = { ...fact, epistemic: { ...epistemic, knowledge_state: 'UNKNOWN' }, requirement: 'UNKNOWN', disposition: 'PRIVACY_EXCLUDED', disposition_evidence: ['privacy-basis'] };
  assert.equal(k.reduceCoverage({ roots: [root], principal, as_of: T }, [f]).coverage_state, 'UNKNOWN');
  assert.throws(() => k.decodeFact({ ...f, disposition: 'DEFERRED_SUPPRESSED_WITH_REACTIVATION' }), /EVIDENCE/);
  assert.equal(k.decodeFact({ ...f, disposition: 'DEFERRED_SUPPRESSED_WITH_REACTIVATION', reactivation_refs: ['review-at-expiry'] }).epistemic.knowledge_state, 'UNKNOWN');
});
for (const kind of k.ID_KINDS) test('A2 opaque typed identity ' + kind, () => assert.deepEqual(k.decodeIdentity(k.identity(kind, 'same_AARON_id_NOT_RELATION')), { kind, id: 'same_AARON_id_NOT_RELATION' }));
test('A2 shared spelling or context never establishes resolution equivalence', () => {
  assert.equal(k.resolutionsEquivalent(relation.source, relation.target, principal, [], T), false);
  assert.equal(k.resolutionsEquivalent(relation.source, relation.target, principal, [{ ...relation, kind: 'CONTEXT' }], T), false);
  assert.equal(k.resolutionsEquivalent(relation.source, relation.source, principal, [], T), true);
  assert.equal(k.sameIdentity(k.identity('INTENT', 'same'), k.identity('EFFECT', 'same')), false);
});
test('A2 explicit proved current relation alone supports consolidation', () => {
  assert.equal(k.resolutionsEquivalent(relation.source, relation.target, principal, [relation], T), true);
  assert.equal(k.resolutionsEquivalent(relation.target, relation.source, principal, [relation], T), true);
  for (const r of [{ ...relation, principal: k.identity('PRINCIPAL', 'other') }, { ...relation, temporal: { ...temporal, valid_until: T } }, { ...relation, temporal: { ...temporal, recorded_at: later } }]) assert.equal(k.resolutionsEquivalent(relation.source, relation.target, principal, [r], T), false);
  assert.throws(() => k.decodeRelation({ ...relation, evidence_refs: [] }), /EVIDENCE/);
});
test('A2 live/retry/replay/reconstruction count one causal occurrence', () => {
  assert.deepEqual(k.experienceKeys([occurrence, { ...occurrence, evidence_refs: ['replay'] }, { ...occurrence, evidence_refs: ['cold-reconstruction'] }]), ['occurrence']);
  assert.equal(k.experienceKeys([occurrence, { ...occurrence, occurrence: k.identity('CAUSAL_OCCURRENCE', 'new-proven-occurrence') }]).length, 2);
});
for (const change of [{ operation_digest: 'changed' }, { first_occurred_at: later }, { originating_ref: k.identity('INTENT', 'other') }]) test('A2 same occurrence semantic drift rejected ' + Object.keys(change)[0], () => assert.throws(() => k.experienceKeys([occurrence, { ...occurrence, ...change }]), /DRIFT/));
test('07 historical truth differs from what was recorded by cut', () => {
  const t = { ...temporal, recorded_at: later };
  assert.equal(k.temporalAsOf(t, T).effective, true); assert.equal(k.temporalAsOf(t, T).recorded_by_cut, false); assert.equal(k.knownAsOf(t, T), false);
});
for (const field of ['valid_until', 'revoked_at', 'superseded_at']) test('07 decision-time invalidation at exact cut ' + field, () => {
  assert.equal(k.temporalAsOf({ ...temporal, [field]: T }, T).effective, false);
  assert.equal(k.temporalAsOf({ ...temporal, [field]: later }, T).effective, true);
});
test('07 observation and requalification meanings remain separate', () => {
  const t = { ...temporal, observed_at: later, requalification_at: T };
  assert.equal(k.temporalAsOf(t, T).recorded_by_cut, true); assert.equal(k.temporalAsOf(t, T).observed_by_cut, false); assert.equal(k.knownAsOf(t, T), false); assert.equal(k.temporalAsOf(t, T).requalification_due, true);
});
for (const time of ['2026-02-30T12:00:00Z', '2026-10-03', 'bad', '2026-10-03T12:00:00-05:00']) test('07 invalid/noncanonical cut rejected ' + time, () => assert.throws(() => k.instant(time)));
test('07 current truth is not latest row and validity cannot be empty', () => {
  assert.equal(k.knownAsOf({ ...temporal, effective_from: later }, T), false);
  assert.throws(() => k.decodeTemporal({ ...temporal, valid_until: earlier }), /EMPTY/);
});
for (const kind of ['OBJECTIVE', 'OBLIGATION', 'DECISION_REQUIREMENT']) test('13 canonical lifecycle separates object kinds ' + kind, () => {
  const ref = k.identity(kind as k.IdentityKind, 'opaque'); const s = { ...lifecycle, object: ref, state: kind === 'DECISION_REQUIREMENT' ? 'OPEN' : 'NONTERMINAL' };
  const e = { ...lifeEvent, object: ref, next_state: kind === 'DECISION_REQUIREMENT' ? 'RESOLVED' : 'SATISFIED' };
  const next = k.reduceLifecycle(s, e); assert.equal(next.version, 2); assert.equal(s.version, 1); assert.equal(next.object.kind, kind);
});
test('13 exact targets, known reconciliation and version before closure', () => {
  for (const change of [{ object: k.identity('OBLIGATION', 'other') }, { principal: k.identity('PRINCIPAL', 'other') }, { expected_version: 2 }, { basis_knowledge: 'UNKNOWN' }, { basis_kind: 'LIFECYCLE_EVIDENCE' }, { evidence_refs: [] }]) assert.throws(() => k.reduceLifecycle(lifecycle, { ...lifeEvent, ...change }));
});
for (const terminal of ['SATISFIED', 'SUPERSEDED', 'ABANDONED']) test('13 terminal correction explicit ' + terminal, () => {
  const s = { ...lifecycle, state: terminal }; const e = { ...lifeEvent, next_state: 'NONTERMINAL', basis_kind: 'LIFECYCLE_EVIDENCE' };
  assert.throws(() => k.reduceLifecycle(s, e), /CORRECTION/);
  assert.equal(k.reduceLifecycle(s, { ...e, kind: 'CORRECTION', basis_kind: 'CORRECTION' }).version, 2);
  assert.equal(s.state, terminal);
});
test('13 stale duplicate and overflow commands fail without mutation', () => {
  for (const [s, e] of [[lifecycle, { ...lifeEvent, event_id: 'e0' }], [{ ...lifecycle, version: Number.MAX_SAFE_INTEGER }, { ...lifeEvent, expected_version: Number.MAX_SAFE_INTEGER }], [lifecycle, { ...lifeEvent, next_state: 'NONTERMINAL' }]]) assert.throws(() => k.reduceLifecycle(s, e));
  assert.equal(lifecycle.version, 1);
});
const proofMap = { NO_SUBMISSION_PROVEN: 'POSITIVE_ABSENCE', SUBMISSION_KNOWN: 'SUBMISSION_ACCEPTED', EFFECT_VERIFIED: 'MATCHING_EFFECT', NO_EFFECT_VERIFIED: 'POSITIVE_ABSENCE', PARTIAL_EFFECT: 'PARTIAL_MATCH', AMBIGUOUS_EFFECT: 'AMBIGUOUS', CONFLICTED_EFFECT: 'CONFLICT', RECONCILIATION_REQUIRED: 'NONE', UNAVAILABLE_READBACK: 'UNAVAILABLE' };
for (const disposition of k.EFFECT) test('A4 distinct epistemic effect state ' + disposition, () => assert.equal(k.decodeEffect({ ...effect, disposition, proof: proofMap[disposition] ?? 'NONE' }).disposition, disposition));
for (const [state, proof] of Object.entries(proofMap)) test('A4 explicit evidence-reduced state ' + state, () => {
  const next = k.reduceEffect(effect, { ...effectEvent, next_disposition: state, proof }); assert.equal(next.disposition, state); assert.equal(next.version, 2); assert.equal(effect.disposition, 'UNKNOWN');
});
test('A4 transport success/inequality never proves no effect', () => {
  assert.throws(() => k.reduceEffect(effect, { ...effectEvent, proof: 'SUBMISSION_ACCEPTED' }), /PROOF_KIND/);
  assert.throws(() => k.reduceEffect(effect, { ...effectEvent, proof: 'UNEQUAL_READBACK' }), /PROOF_KIND/);
  assert.throws(() => k.reduceEffect(effect, { ...effectEvent, evidence_refs: [] }), /EVIDENCE/);
});
for (const change of [{ operation_digest: 'changed' }, { intent: k.identity('INTENT', 'other') }, { occurrence: k.identity('CAUSAL_OCCURRENCE', 'other') }, { expected_version: 2 }]) test('A4 immutable effect and occurrence binding ' + Object.keys(change)[0], () => assert.throws(() => k.reduceEffect(effect, { ...effectEvent, ...change })));
for (const disposition of k.EFFECT) test('A4 retry evidence never grants authority ' + disposition, () => {
  const d = k.retryEvidenceDisposition({ ...effect, disposition, proof: proofMap[disposition] ?? 'NONE' }); assert.equal(d, disposition === 'EFFECT_VERIFIED' ? 'NO_RETRY' : ['NO_SUBMISSION_PROVEN', 'NO_EFFECT_VERIFIED'].includes(disposition) ? 'RETRY_EVIDENCE_SUFFICIENT' : 'RECONCILE_FIRST');
});
test('A4 verified states require correction and unknown ambiguity stays blocked', () => {
  assert.throws(() => k.reduceEffect({ ...effect, disposition: 'EFFECT_VERIFIED', proof: 'MATCHING_EFFECT' }, effectEvent), /CORRECTION/);
  assert.equal(k.reduceEffect({ ...effect, disposition: 'EFFECT_VERIFIED', proof: 'MATCHING_EFFECT' }, { ...effectEvent, kind: 'CORRECTION' }).disposition, 'NO_EFFECT_VERIFIED');
});
const payloads = { EPISTEMIC: epistemic, ITEM_FACT: fact, IDENTITY: root, RELATION: relation, CAUSAL_OCCURRENCE: occurrence, TEMPORAL: temporal, LIFECYCLE: lifecycle, EFFECT: effect };
for (const [kind, payload] of Object.entries(payloads)) test('representation exact JSON round-trip ' + kind, () => {
  const wire = k.encodeEnvelope(kind as k.KernelKind, payload as never); const out = k.decodeWire(wire);
  assert.deepEqual(out.payload, payload); assert.equal(k.encodeEnvelope(kind as k.KernelKind, out.payload as never), wire); assert.equal(Object.isFrozen(out.payload), true);
});
for (const [map, table] of Object.entries(k.LEGACY_MAPS)) for (const [source, semantic] of Object.entries(table)) test('representation retained total legacy map ' + map + ':' + source, () => {
  const retained = k.retainLegacy(map as keyof typeof k.LEGACY_MAPS, source); assert.equal(retained.semantic_state, semantic); assert.equal(k.restoreLegacy(retained), source);
});
test('representation ambiguous CLOSED/UNSATISFIED and default casing HOLD', () => {
  for (const [map, state] of [['OBLIGATION_V0', 'CLOSED'], ['OBJECTIVE_V0', 'UNSATISFIED'], ['OBLIGATION_V0', 'open']]) assert.throws(() => k.translateLegacy(map as keyof typeof k.LEGACY_MAPS, state), /UNMAPPED/);
  assert.throws(() => k.restoreLegacy({ representation_version: 'OBLIGATION_V0', source_token: 'WAITING', semantic_state: 'SATISFIED' }), /DRIFT/);
});
test('representation unknown schema/type/fields rejected', () => {
  const envelope = { schema_version: k.KERNEL_SCHEMA_VERSION, object_type: 'IDENTITY', payload: root };
  for (const change of [{ schema_version: 'V2' }, { object_type: 'AUTHORITY_GRANT' }, { payload: { ...root, implicit_principal: 'AARON' } }, { authority: true }]) assert.throws(() => k.decodeEnvelope({ ...envelope, ...change }));
});
test('all decoded structures detached, recursively immutable, no caller mutation', () => {
  const input = structuredClone(fact); const output = k.decodeFact(input); input.epistemic.evidence_refs.push('changed');
  assert.equal(output.epistemic.evidence_refs.length, 1); assert.throws(() => output.epistemic.evidence_refs.push('mutate'));
});
test('strict runtime inputs reject sparse proof arrays and accessor/symbol fields', () => {
  assert.throws(() => k.evidence(new Array(1)), /DENSE_ARRAY/);
  assert.throws(() => k.decodeIdentity({ kind: 'PRINCIPAL', get id() { return 'hidden'; } }), /DATA_COORDINATES/);
  assert.throws(() => k.decodeIdentity({ ...root, [Symbol('authority')]: true }), /DATA_COORDINATES/);
});
const continuation = { claim: k.identity('CONTINUATION', 'claim'), principal, causal_episode: occurrence.occurrence, owner_incarnation: k.identity('WORKER', 'fresh-incarnation'), generation: 2, fence_token: 'opaque-fence', temporal, admission_evidence_refs: ['independent-admission'] };
test('A2 continuation carries exact generation/fence/incarnation without authority', () => {
  const out = k.decodeContinuation(continuation); assert.equal(out.generation, 2); assert.equal(out.owner_incarnation.id, 'fresh-incarnation');
  assert.deepEqual(k.decodeWire(k.encodeEnvelope('CONTINUATION', continuation)).payload, continuation);
});
for (const change of [{ generation: 0 }, { generation: 1.5 }, { fence_token: '' }, { owner_incarnation: root }, { admission_evidence_refs: [] }, { authority: true }]) test('A2 invalid continuation representation rejected ' + Object.keys(change)[0], () => assert.throws(() => k.decodeContinuation({ ...continuation, ...change })));
test('snapshot decoder cannot claim effect/terminal verification without proof', () => {
  assert.throws(() => k.decodeEffect({ ...effect, disposition: 'NO_EFFECT_VERIFIED' }), /PROOF_KIND/);
  assert.throws(() => k.decodeEffect({ ...effect, disposition: 'NO_EFFECT_VERIFIED', proof: 'POSITIVE_ABSENCE', evidence_refs: [] }), /EVIDENCE/);
  assert.throws(() => k.decodeLifecycle({ ...lifecycle, state: 'SATISFIED', evidence_refs: [] }), /EVIDENCE/);
});
