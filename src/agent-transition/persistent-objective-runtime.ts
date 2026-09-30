import type { CanonicalRepository } from '../state/repository.ts';

export function getObjectives(repo:CanonicalRepository,principal='aaron'){
  return [...repo.objectives.values()].filter(x=>x.principal_id===principal).map(x=>structuredClone(x));
}

export function getOpenObligations(repo:CanonicalRepository){
  return [...repo.obligations.values()].filter(x=>!['CLOSED'].includes(x.status)).map(x=>structuredClone(x));
}

export function workerEvidenceOnly(repo:CanonicalRepository,beforeVersion:number){
  return repo.stateVersion===beforeVersion;
}

export function reconstructRuntime(repo:CanonicalRepository){
  const terminalIntentIds=new Set([...repo.verifications.values()].map(v=>v.intent_id));
  return {
    objectives:getObjectives(repo),
    obligations:getOpenObligations(repo),
    unresolved_effects:[...repo.intents.values()].filter(i=>!terminalIntentIds.has(i.intent_id)).map(i=>i.intent_id),
    continuity_admitted:false
  };
}
