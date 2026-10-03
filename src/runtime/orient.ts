import type { LegacyRepository } from '../state/legacy-repository.ts';
export interface OrientationEnvelope {
  principal_id:string;
  orientation_id:string;
  orientation_version:number;
  state_version:number;
  explicit_decision_scopes:string[];
  standing_preference_keys:string[];
  predicted_preference_keys:string[];
  privacy_constraints:string[];
  authority_constraints:string[];
  open_objective_ids:string[];
  open_obligation_ids:string[];
}
export function orient(repo:LegacyRepository, principalId:string): OrientationEnvelope {
  const orientation=[...repo.orientations.values()].filter(o=>o.principal_id===principalId && !o.effective_to).sort((a,b)=>b.version-a.version)[0];
  if (!orientation) throw new Error('ORIENTATION_MISSING');
  return {
    principal_id:principalId,
    orientation_id:orientation.orientation_id,
    orientation_version:orientation.version,
    state_version:repo.stateVersion,
    explicit_decision_scopes:orientation.explicit_current_decisions.map(x=>x.key),
    standing_preference_keys:orientation.standing_preferences.map(x=>x.key),
    predicted_preference_keys:orientation.predicted_preferences.map(x=>x.key),
    privacy_constraints:[...orientation.privacy_constraints],
    authority_constraints:[...orientation.authority_constraints],
    open_objective_ids:[...repo.objectives.values()].filter(x=>x.principal_id===principalId && x.status==='OPEN').map(x=>x.objective_id),
    open_obligation_ids:[...repo.obligations.values()].filter(x=>x.status!=='CLOSED').map(x=>x.obligation_id)
  };
}
