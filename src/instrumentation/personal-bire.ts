import type { LegacyRepository } from '../state/legacy-repository.ts';
import type { QualifiedCapability } from '../capability/qualification.ts';
import { freeze } from '../semantic-kernel/validation.ts';
// Costs are separately dimensioned integers. Do not add milliseconds to money.
// The capability seam performs eligibility first; no BIRE score admits a subject.
export function rankSufficientConfigurations(eligible:readonly QualifiedCapability[]){
 return freeze([...eligible].sort((a,b)=>a.configuration.cost_minor-b.configuration.cost_minor||a.configuration.attention_units-b.configuration.attention_units||a.configuration.resource_units-b.configuration.resource_units||a.configuration.latency_ms-b.configuration.latency_ms||b.configuration.reliability_ppm-a.configuration.reliability_ppm||JSON.stringify(a.subject).localeCompare(JSON.stringify(b.subject))));
}
export interface PersonalBireMetric {
  wall_clock_ms:number;
  tool_calls:number;
  retries:number;
  reconciliation_events:number;
  aaron_mechanical_interventions:number;
  model_provider?:string;
  provider_substitutions?:number;
}
export function recordBireMetric(repo:LegacyRepository,episodeId:string,metric:PersonalBireMetric):void {
  repo.instrumentation.push({event_id:`bire:${episodeId}:${repo.instrumentation.length+1}`,event_type:'PERSONAL_BIRE',work_episode_id:episodeId,payload:structuredClone(metric) as unknown as Record<string,unknown>,occurred_at:new Date().toISOString()});
}
