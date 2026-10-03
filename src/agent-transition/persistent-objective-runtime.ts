import type { LegacyRepository } from '../state/legacy-repository.ts';

export function getObjectives(repo:LegacyRepository,principal='aaron'){
  return [...repo.objectives.values()].filter(x=>x.principal_id===principal).map(x=>structuredClone(x));
}

export function getOpenObligations(repo:LegacyRepository){
  return [...repo.obligations.values()].filter(x=>!['CLOSED'].includes(x.status)).map(x=>structuredClone(x));
}

export function workerEvidenceOnly(repo:LegacyRepository,beforeVersion:number){
  return repo.stateVersion===beforeVersion;
}

export function reconstructRuntime(repo:LegacyRepository){
  // Legacy labels are not qualified B4 source proofs. Preserve all pending intents.
  const terminalIntentIds=new Set<string>();
  return {
    objectives:getObjectives(repo),
    obligations:getOpenObligations(repo),
    unresolved_effects:[...repo.intents.values()].filter(i=>!terminalIntentIds.has(i.intent_id)).map(i=>i.intent_id),
    continuity_admitted:false
  };
}
