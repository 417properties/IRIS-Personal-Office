import { MemoryCanonicalRepository } from '../src/state/repository.ts';
import type { ActionIntent } from '../src/domain/action-intent.ts';

export const NOW='2026-09-27T12:00:00.000Z';
export function seededRepo() {
  const repo=new MemoryCanonicalRepository();
  repo.principals.set('aaron',{principal_id:'aaron',principal_type:'AARON',status:'ACTIVE',created_at:NOW,schema_version:1});
  repo.orientations.set('orient-1',{orientation_id:'orient-1',principal_id:'aaron',effective_from:'2026-09-01T00:00:00.000Z',source_basis_refs:['directive:seed'],standing_preferences:[],explicit_current_decisions:[{key:'fixture.write',value:true,source_ref:'decision:fixture',effective_from:'2026-09-27T00:00:00.000Z'}],predicted_preferences:[{key:'spending.purchase',value:true,source_ref:'prediction:1',effective_from:'2026-09-27T00:00:00.000Z'}],privacy_constraints:['fixture.non_sensitive'],authority_constraints:['no-financial'],version:1});
  repo.authorityPolicies.set('auth-1',{policy_id:'auth-1',principal_id:'aaron',basis_type:'STANDING_AUTHORIZATION',scopes:['fixture.write'],valid_from:'2026-09-01T00:00:00.000Z',valid_to:'2026-12-31T00:00:00.000Z',source_ref:'decision:fixture',version:1});
  repo.privacyPolicies.set('privacy-1',{policy_id:'privacy-1',principal_id:'aaron',scopes:['fixture.non_sensitive'],disclosure:'ALLOW',valid_from:'2026-09-01T00:00:00.000Z',valid_to:'2026-12-31T00:00:00.000Z',source_ref:'decision:fixture',version:1});
  repo.objectives.set('obj-parent',{objective_id:'obj-parent',principal_id:'aaron',description:'bounded fixture objective',desired_outcome:'fixture becomes complete',success_criteria:['verified fixture complete'],status:'OPEN',authority_scope:['fixture.write'],privacy_scope:['fixture.non_sensitive'],created_from:'directive:1',created_at:NOW,closure_evidence_refs:[],version:1});
  repo.obligations.set('obl-1',{obligation_id:'obl-1',objective_id:'obj-parent',owner:'IRIS',description:'set fixture complete',status:'OPEN',closure_criteria:['verified fixture complete'],authority_requirement:['fixture.write'],privacy_requirement:['fixture.non_sensitive'],source_refs:['directive:1'],version:1});
  repo.appendEvidence({occurrence_id:'ev-1',principal_id:'aaron',source_type:'FIXTURE',source_ref:'fixture:source',observed_at:NOW,ingested_at:NOW,payload_digest:'d1',content_ref:'fixture://state',provenance:'fixture',coverage_state:'COMPLETE',confidence_class:'DIRECT',privacy_class:'fixture.non_sensitive'});
  repo.publishCurrent({assertion_id:'assert-1',subject_ref:'fixture:source',predicate:'status',value:'READY',effective_from:NOW,source_occurrence_refs:['ev-1'],qualification:'VERIFIED',freshness:'FRESH',coverage:'COMPLETE',uncertainty:[],version:1,invalidated_by_refs:[]});
  return repo;
}
export function fixtureIntent(): ActionIntent {
  return {intent_id:'intent-1',decision_ref:'decision:fixture',work_episode_id:'episode-1',tool_id:'fixture.action',operation:'set-complete',arguments_digest:'args-digest',expected_effect:{status:'COMPLETE'},authority_basis:'decision:fixture',privacy_basis:'privacy-1',idempotency_key:'idem-1',verification_contract:'fixture-readback',retry_classification:'IDEMPOTENT_BY_KEY',created_at:NOW};
}
