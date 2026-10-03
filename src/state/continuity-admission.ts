import type { LegacyRepository } from './legacy-repository.ts';
import { projectAaronCurrent } from './projections.ts';
export interface ContinuityAdmissionResult {
  admitted:boolean;
  reason:string;
  requires_reorient:boolean;
  unresolved_effect_intent_ids:string[];
  open_obligation_ids:string[];
  state_version:number;
}
export function continuityAdmission(repo: LegacyRepository, priorStateVersion:number): ContinuityAdmissionResult {
  const open=[...repo.obligations.values()].filter(o=>o.status!=='CLOSED').map(o=>o.obligation_id);
  const terminal=new Set<string>(); // Legacy labels cannot clear canonical effect proof obligations.
  const unresolved=new Set([...repo.verifications.values()].map(v=>v.intent_id));
  for (const intent of repo.intents.values()) if (!terminal.has(intent.intent_id)) unresolved.add(intent.intent_id);
  const projection=projectAaronCurrent(repo);
  if (unresolved.size) return {admitted:false,reason:'RECONCILIATION_REQUIRED',requires_reorient:true,unresolved_effect_intent_ids:[...unresolved],open_obligation_ids:open,state_version:projection.state_version};
  void priorStateVersion;return {admitted:false,reason:'HOLD_CANONICAL_RECOVERY_PROOF_REQUIRED',requires_reorient:true,unresolved_effect_intent_ids:[],open_obligation_ids:open,state_version:projection.state_version};
}
