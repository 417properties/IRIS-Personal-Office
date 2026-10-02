# IRIS Pilot 001 — Replacement-E1 v0.4 to Frozen-Candidate Execution Binding v0.2

Object: IRIS_PILOT_001_REPLACEMENT_E1_TO_FROZEN_CANDIDATE_EXECUTION_BINDING
Authority: NONE
Disposition: IRIS_PILOT_001_REPLACEMENT_E1_TO_FROZEN_CANDIDATE_EXECUTION_BINDING_READY / FRESH_INDEPENDENT_EXACT_BINDING_ACCEPTANCE_REQUIRED

## 0 Pins
STRATA: BIG-Navigator #703/5962437554.
Blueprint v0.4: commit cda075e0137571aaf9fcb4b752ce0085d361e0cb; blob c030c5f475f38d6edd4bda52ecd74d6f9d9eb786; SHA256 d478799495f06b7ac1d7b83c6726b913d8cc2fb43950ad45928ea0ec8affdc6d.
Replacement E1: ref refs/heads/evidence/iris-pilot001-replacement-e1-v0-4-08e89d578d95; commit 849deca383add66773ab1ba0c8bc0ca852523c8f; tree fe0264a8fa5d0bc5ac7ee1dd9210f35dd97a6fc4; 40 cases; population SHA256 32529f099c0f79d2b37782627cd6e8d7fd69ed6b4b9fbd390fddefeb0d0bac5f; protocol SHA256 619b28d8cc6fdd8048bdaeff2807a10f438349f1a7249f3701b209a7e786d66b; protocol blob 5aa65205d401409b5b07b82e57864841bd57120b; manifest blob fef39e3284eae5559ac016c01211c0d9bc244fa5; shard blobs 7a35d77ad927218f903e63f966ccee3341e7d717,53a8c9dbf36b1bc666d164daed3bcbf05c46b230,4d492ac0d661b6fdb6315461fba5f720757a3cc7,86924bb9e12c6e39e155ee6fcb0ca9f75dae7dec.
Candidate: HEAD 185dbd1be80bd54c6cf5dcc085f105a637fe7e44; tree af4808dc6c6db17ed7dc5cdd923fe5b9697c006a; PR#4 DRAFT/OPEN/UNMERGED; types blob c8c7aa257b1f319b5fe518f8cebaf9ff55ea6301; classifier b716d1bf8d07cd040793d54674bb3cd1a4ae2e14; coverage 2b21f40cf27457523d5540db226446c1ee6c83e4; projection 4931d997e7200353e3011bfd3c548b0bf826c027.
Precedent: binding commit 851810b0715d0be90b32f0f9b7cd16be652e0d5e/blob e0c6244d916e7970f965eb8a95972d73e8e28d24; Builder packet commit f2faa2efe80166714bdff827a200def6ffe93f66/blob 166cd2b201ae67255845baa0f1c10a9cb27ea2ee.

## 1 Independence
Derived only from replacement-E1 source/schema/protocol, Blueprint v0.4, exact candidate API/source, and accepted historical binding architecture. This IBA round did NOT fetch replacement-E1 E2 label contents, per-case reference answers/interventions/classes, Round-3 E2 answers, E3 scoring, candidate outputs, or score-derived configuration. Implementation MUST hard-deny label/scoring inputs. labels_consumed=0; scoring=false.

## 2 Execution invariant
For each case in exact manifest order:
one frozen case -> one ReplacementE1V04ProjectionDecoder -> exactly one ProjectionInput -> exactly one frozen buildProjection call -> one unedited deterministic output.
Never split/aggregate cases. Decoder ends at ProjectionInput. It MUST NOT copy/reimplement classifier, coverage, intervention-ID, consolidation, omission, or projection semantics.

## 3 Population
Load only four pinned shards. Recompute manifest population digest exactly: recursively sorted object keys, comma/colon separators, UTF-8, ensure_ascii=false, no trailing LF, normative array order. Require exactly 40 IDs exactly equal manifest/population-identity order, no missing/extra/duplicate/reorder. Validate whole population before first candidate call. Failure: BINDING_HOLD/POPULATION_IDENTITY_MISMATCH.

## 4 ProjectionInput order/time
Insert properties exactly: candidates,sources,conflicts,privacyExcluded,bracket,started_at,emitted_at.
Wall clock/file/Git/publication time prohibited.
Snapshot reads are ordered dependency observations. Compare exact record_ref/version maps.
- stable first pair -> select first read; bracket STABLE.
- drift then exact stable second pair (four reads) -> select third read; RERUN_STABLE.
- second drift -> bracket UNSTABLE.
- malformed 1/3/>4 structure -> HOLD.
started_at=emitted_at=selected read_at. If UNSTABLE leaves canonical record version non-unique -> BINDING_HOLD/UNSTABLE_RECORD_SELECTION_AMBIGUOUS. No third retry.

## 5 Eight SourceEvaluation mappings
Exact candidate order:
pilot001:objectives <- objectives
pilot001:obligations <- obligations
pilot001:obligation_governance <- obligation_governance
pilot001:decision_requirements <- decision_requirements
pilot001:authority_generation_and_leases <- authority_state
pilot001:unresolved_intents_and_effects <- intent_effect_state
pilot001:applicability_current_assertions <- current_assertions
pilot001:qualified_big_quarantine_evidence <- qualified_big_packets.
All required=true. Property insertion order: source_id,required,present,principal_match,identity,applicability,freshness,provenance_ok,partial; partial always boolean.
PRESENT=>present true. UNKNOWN=>present false, identity/applicability/freshness UNKNOWN, partial true. Other availability=>HOLD.
Aaron-bound + provenance_verified => principal_match true/identity VERIFIED. enumeration_complete=false or provenance failure => partial true. Empty PRESENT+complete is present empty.
Freshness: CURRENT iff observed_at<=selected read_at<=valid_through; expired=>STALE; unevaluable=>UNKNOWN.
Applicability derives only from exact source applicability/lifecycle; ambiguity=>UNKNOWN. Impact consequence predicates never affect SourceEvaluation.

## 6 Canonical record selection
At selected snapshot, resolve exact dependency versions. Lifecycle events affect only affected_record_refs; action_decision only resolves/supersedes exact refs; applicability_assertion only exact subject_refs; version_event must form exact from_version->to_version chain and cannot invent semantic change; prior_semantic_values_retained=true preserves semantic fields. required_next_step and informational_receipt are evidence, not independent roots. Device/provider possession is noncanonical. If exact source history cannot uniquely select current semantic state: BINDING_HOLD/CURRENT_RECORD_NON_UNIQUE.

## 7 Privacy
Only exact principal_id=AARON may populate Aaron candidates. No alias/case/trim/name inference. Foreign/private source_packet, device observation, provider session or record is excluded unless explicitly qualified into Aaron evidence by the exact envelope and source contract. privacyExcluded is deduplicated UTF-8 lexical record IDs. Private foreign payload is never copied. Required foreign payload=>BINDING_HOLD/CROSS_PRINCIPAL_MAPPING_FORBIDDEN.

## 8 Candidate roots/order
Order classes: obligations, decisions, unresolved intents, conflict-only; within each UTF-8 lexical raw record ID.

Obligation root:
id=e1:<case_id>:obligation:<raw obligation id>; principal AARON; objective_id exact objective_ref; obligation_id exact raw id; status exact selected status; owner from uniquely linked governance else UNKNOWN; concrete_action_remaining iff action_remaining true + nonempty concrete_action + !informational_only; applicability from exact governance/assertion/lifecycle; provenance/freshness/identity from used source facts.

Decision root:
id=e1:<case_id>:decision:<decision id>; principal AARON; objective_id exact; decision_requirement_id exact; status OPEN only if source OPEN + applicable + decision_history_complete + no selected resolving/superseding action_decision; otherwise exact RESOLVED/SUPERSEDED/ABANDONED/UNKNOWN. decision_maker exact or UNKNOWN; reserved_authority exact. Do not set obligation_id merely because obligation_ref exists.

Intent root: create only when selected intent/effect evidence establishes unresolved state SUBMITTED_UNVERIFIED, AMBIGUOUS, or RECONCILIATION_REQUIRED. id=e1:<case_id>:intent:<intent id>; unresolved_effect=true; exact objective/intent; provenance from effect envelope. VERIFIED/NO_EXTERNAL_EFFECT creates no unresolved root. Non-unique intent/effect pairing=>HOLD.

## 9 Authority/permission
required_next_step never creates a root. If exact OPEN/APPLICABLE permission_needed=true links subject obligation + decision_ref and reserved_authority_class, copy reserved class onto those exact roots; mismatch with decision/governance reserved class=>HOLD.
Authority holder comes only from exact obligation_governance when authority envelope is usable.
valid_delegation=true only if a referenced authority_lease is ACTIVE at selected time AND exact domain/generation, principal, operation_scope, privacy policy/scope, worker/episode and authority policy match current authority_generation_state. Any mismatch/expiry/replaced worker=>false when deterministically invalid; missing/ambiguous load-bearing state=>omit valid_delegation and degrade source/item identity/freshness/applicability to UNKNOWN as applicable. Provider session/credential never grants delegation.
A permission-linked decision remains one candidate decision/authorization basis; decoder never manufactures an extra intervention.

## 10 Lifecycle/applicability/history
Obligation applicability is exact governance + applicability assertion + lifecycle at selected snapshot. ABANDONED/SUPERSEDED/SATISFIED never auto-resurrect.
Decision lifecycle is independent. Obligation abandonment does not abandon linked decision unless lifecycle/action-decision explicitly names it. A later exact reaffirmation applies only to named refs. Incomplete decision history=>decision material dimension UNKNOWN, never assumed OPEN/RESOLVED.
Current assertions are evidence for applicability/coverage; they are not candidate roots.

## 11 Conflicts
Decoder may create conflict facts only from explicit source facts, never consequence classes.
Deterministic conflict classes remain candidate enum. Use exact anchor refs and formula conf_<sha256(AARON|sorted anchors|class)>; UTF-8 byte sort, exact dedupe, no Unicode normalization.
Sources:
- incompatible exact instruction/current values -> INCOMPATIBLE_CURRENT_STATE or INCOMPATIBLE_OBLIGATIONS as source semantics specify;
- authority records with incompatible current authority facts -> AUTHORITY_CONFLICT;
- unresolved contradictory effect records -> EFFECT_REALITY_CONFLICT;
- source identity contradiction -> SOURCE_IDENTITY_CONFLICT;
- source_link_observation possible_same_underlying_request=true with no authoritative_merge_ref -> POSSIBLE_DUPLICATE_UNRESOLVED.
Attach conflict to every exactly referenced existing root. If none resolves, one conflict-only root. If one PilotCandidate would need >1 distinct conflict_id, HOLD/MULTIPLE_CONFLICT_IDS_UNENCODABLE; never clone for convenience.
input.conflicts = exact deterministic conflict IDs, UTF-8 lexical.

## 12 Duplicate identity
No semantic similarity. source_link_observation with authoritative_merge_ref uniquely proven may supply exact canonical anchor; possible_same=true without authoritative merge never consolidates and creates possible_duplicate_refs/conflict. Uncertain identity remains visible.

## 13 Qualified BIG
Only records in qualified_big_packets envelope may influence qualified BIG SourceEvaluation. big_packet requires admission=QUALIFIED_IN_IRIS_EVIDENCE, authority_effect=NONE, source_current_mutation_allowed=false, exact Aaron scope, verified provenance, and selected time within valid_through. Provider session alone is excluded/noncanonical. Malformed packet=>source partial/UNKNOWN or HOLD if structurally non-unique. Never read live BIG/provider data.

## 14 Consequence/impact deny rule
impact_packets are reference-side evidence. Decoder MUST NOT calculate/read/inject C1/C2/C3/C4, weights, P1-P4, reference intervention eligibility, expected resolution, or E2 omissions.
Only underlying source facts independently required by existing ProjectionInput may be used, and only from canonical records/envelopes themselves. impact_packet_ref may be validated for source integrity but packet consequence fields cannot set candidate applicability, AR fields, conflict, escalation, unresolved_effect, omission, coverage, or ordering.
If a mapping appears to require a consequence predicate: BINDING_HOLD/REFERENCE_SIDE_CONSEQUENCE_DEPENDENCY.

## 15 Determinism/canonical serialization
Candidate and source arrays follow Sections 5/8. All generated provenance_refs and possible_duplicate_refs are exact-deduped UTF-8 lexical. No locale sort. No Unicode normalization. No random IDs. No wall clock.
Call buildProjection exactly once. Preserve returned object unedited. Serialize output as JSON.stringify(output)+LF using candidate-returned property/array order; no pretty-print/rekeying.
Per-case file: outputs/<case_id>.json. Index order exact manifest. Index stores case_id, output path, byte count, SHA256, Git blob after publication.
Run twice in clean processes from same pins; every 40 output byte stream and canonical pre-publication index content must match.

## 16 Label/scoring hard deny
Harness process receives an explicit allowlist of E1/Blueprint/candidate/binding paths. Deny by exact path/ref pattern any:
- replacement-E1 blind-E2 ref/artifact;
- Round-3 E2 answer/reference artifact;
- E3/scoring/metric-result artifact;
- score-derived config.
Unexpected file/config/CLI/env input outside allowlist=>LABEL_OR_SCORING_INPUT_FORBIDDEN before candidate import/execution.
Evidence must state labels_consumed=0; scoring_performed=false.

## 17 One-layer-deeper falsification closure
Potential score-changing choices and closure:
population membership/order -> exact pins/digest or HOLD;
snapshot time/bracket -> Section4;
record version/history -> Section6/10 or HOLD;
surface availability/freshness/applicability -> Section5;
principal/privacy -> Section7;
root membership/order -> Section8;
permission/delegation -> Section9;
conflict/duplicate identity -> Sections11/12;
qualified BIG -> Section13;
consequence classes/weights -> prohibited Section14;
candidate semantics/intervention IDs/coverage -> candidate-only, never reimplemented;
serialization/rerun -> Section15.
No discretionary runtime transformation choice remains. Any unlisted replacement record type or structurally non-unique mapping => BINDING_HOLD/UNMAPPED_REPLACEMENT_E1_STRUCTURE.

## 18 Explicit delta from historical v0.1
Preserved: external decoder boundary; one case/one ProjectionInput/one buildProjection; candidate unmodified; no labels/scoring; deterministic population/rerun; fail closed.
Changed: 32->40; old E1 manifest->replacement four-shard v0.4; old four-envelope fanout->eight explicit envelopes; new lifecycle/action-decision/version history selection; new authority generation/lease validation; new qualified-BIG packet form; new source-link duplicate evidence; ordered multi-read bracket; impact packets explicitly denied as consequence transformation inputs; candidate pin 2fd02feb...->185dbd1....

## 19 Acceptance and authority
Fresh independent exact-binding reviewer must reproduce pins, inspect mapping against source/candidate without E2 labels, falsify Sections 3-17, verify no discretionary score-changing mapping, and return PASS or one exact HOLD.
This binding authorizes no candidate edit/execution/scoring/merge/deploy/provider access/continuity admission.
Preserve ROUND3_E1_SUPERSEDED_FOR_EVALUATION_BY_CONSEQUENCE_INPUT_DEFECT / ROUND3_E2_HOLD_VALID_AS_HISTORICAL_EVIDENCE / REPLACEMENT_E1_FROZEN / POST_REPLACEMENT_E1_CANDIDATE_REFREEZE_CLOSED / REPLACEMENT_E1_BLIND_E2_CLOSED / IRIS_NOT_OPERATIONALLY_PROMOTED / CONTINUITY_DEFAULT_OFF / ZERO_AUTHORITY / NO_PRODUCTION / NO_IRIS_CONTINUITY_ADMISSION / BIG_ACTIVATION_NOT_AUTHORIZED.
