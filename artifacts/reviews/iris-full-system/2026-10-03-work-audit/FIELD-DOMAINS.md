# Demonstrated constructor-field domains and presence rules

Read with 84-ROOT-CENSUS.csv and 84-ROOT-FIELD-DERIVATIONS.csv. This is static input-derivation assurance, not execution, a candidate output vector, or a successful semantic-totality certification. Fields marked defined have a rule over the demonstrated source domain; D01 prevents full construction totality, and D02–D04 prevent downstream semantic acceptance. References are standalone binding v1.0 §§4–9, matrix property_order, and exact candidate pilot001-types.ts.

| Field | Demonstrated domain / derivation constraint | Presence rule |
|---|---|---|
| id | exact e1:<opaque case>:obligation/decision/intent:<raw root payload>; conflict-only grammar MISSING | Required all84; defined83, missing1 |
| principal_id | exact AARON; no inferred/case-folded alias | Present84 |
| objective_id | exact raw objective namespace payload; one exact linked objective per demonstrated root | Present84 |
| obligation_id | exact raw obligation payload, never typed ref | Present42 obligation roots; absent42 |
| decision_requirement_id | exact raw decision_requirement payload | Present40 decision roots; absent44 |
| intent_id | exact raw intent payload | Present1 unresolved-intent root; absent83 |
| conflict_id | deterministic conf_<sha256> over exact full anchor set/class | Present4 roots (3 attached +1 conflict-only); absent80 |
| obligation_status | OPEN38, ABANDONED1, SATISFIED2, SUPERSEDED1; source history exact scoped | Present42 obligation roots only |
| obligation_owner | AARON20, IRIS20, EXTERNAL_ORG1, UNKNOWN1 | Present42 obligation roots only; UNKNOWN remains an epistemic defect downstream |
| concrete_action_remaining | source action_remaining=true AND nonempty concrete action AND informational_only=false; true38/false4 | Present42 obligation roots only |
| decision_status | OPEN36, RESOLVED3, SUPERSEDED1; exact decision history only | Present40 decision roots only |
| decision_maker_identity_id | IRIS29, AARON10, UNKNOWN1 | Present40 decision roots only |
| reserved_authority_class | PRINCIPAL_PRIVATE_DISCLOSURE; exact step/governance/decision agreement | Present20 exact permission-linked roots; absent64 |
| authority_holder_identity_id | AARON18; UNKNOWN2 when authority envelope unavailable epistemically | Present20 reserved roots only |
| valid_delegation | false18; no demonstrated true; known-invalid reasons differ; UNKNOWN is absence of property, not false | Present18; absent2 reserved unknown +64 nonreserved |
| escalation_required | true1 only exact material instruction-conflict obligation with same-root Aaron escalation; false83 | Present84 boolean, never default |
| unresolved_effect | true1 exact unresolved-intent root; false83 | Present84 boolean |
| material_conflict | true4 exact attached/conflict-only roots; false80 | Present84 boolean |
| informational_only | true1 exact obligation source flag; false83 | Present84 boolean |
| applicability | APPLICABLE75, UNKNOWN3, SATISFIED4, SUPERSEDED2; status does not cascade across refs; intent with no exact applicability evidence UNKNOWN | Present84, never null/undefined |
| freshness | CURRENT84 from exact item evidence closure; source-envelope health separately may be STALE/UNKNOWN | Present84; health dimensions not erased by authority UNKNOWN |
| source_identity | VERIFIED84 from exact used source evidence; authority uncertainty independently represented | Present84 |
| provenance_refs | exact-deduped UTF-8 lexical typed source refs actually used; demonstrated per-case evidence source; no binding/review/protocol URI | Present84 arrays; no candidate-owned namespace stripping applied to provenance |
| possible_duplicate_refs | exact typed other-root refs only for distinct unresolved identity observation; nonempty2, empty82 | Present84 arrays; self-identity produces [] |

`why`: never supplied by decoder, not in the 24-position constructor order. Optional nonapplicable fields are omitted rather than null-padded. Exact raw candidate payload fields do not contain colon; typed provenance and possible-duplicate refs retain namespace. Opaque case IDs are not semantically parsed.

The evidence witness identifies each source root and exact joins. Field counts above were checked against the personally inspected 40-case source templates/case maps and binding census; they are input-shape facts. No classifyAaron/buildProjection call, candidate import, consequence class, score or governing answer was produced. The candidate's different use of c.id versus obligation_id and the missing conflict-only id are explicitly not repaired here.

Authority-domain generation and worker identity generation remain different domains. Absence of a referenced lease in a complete known authority surface can establish known nondelegation; absence of knowledge about authority cannot. The candidate boolean interface fails to preserve that distinction downstream (D02).

Root partition: 42 obligations +40 decisions +1 unresolved intent +1 conflict-only =84. The verified source intent is intentionally not an unresolved-intent root. Required-next-step, lifecycle, applicability, informational receipt, device, provider, authority and impact packets do not independently create roots. Unrecognized future structures must HOLD; the table is not a universal schema proof.
