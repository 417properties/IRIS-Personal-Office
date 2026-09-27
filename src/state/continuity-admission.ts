import type { CanonicalRepository } from './repository.ts';
import { projectAaronCurrent } from './projections.ts';
export interface ContinuityAdmissionResult {
  admitted:boolean;
  reason:string;
  requires_reorient:boolean;
  unresolved_effect_intent_ids:string[];
  open_obligation_ids:string[];
  state_version:number;
}
export function continuityAdmission(repo: CanonicalRepository, priorStateVersion:number): ContinuityAdmissionResult {
  const open=[...repo.obligations.values()].filter(o=>o.status!=='CLOSED').map(o=>o.obligation_id);
  const ambiguous=[...repo.verifications.values()].filter(v=>['AMBIGUOUS_EFFECT','UNKNOWN','CONFLICT'].includes(v.disposition)).map(v=>v.intent_id);
  const projection=projectAaronCurrent(repo);
  if (ambiguous.length) return {admitted:false,reason:'RECONCILIATION_REQUIRED',requires_reorient:true,unresolved_effect_intent_ids:ambiguous,open_obligation_ids:open,state_version:projection.state_version};
  const changed=repo.stateVersion!==priorStateVersion;
  return {admitted:true,reason:changed?'ADMITTED_REORIENT_REQUIRED':'ADMITTED_CLEAN',requires_reorient:changed,unresolved_effect_intent_ids:[],open_obligation_ids:open,state_version:projection.state_version};
}
