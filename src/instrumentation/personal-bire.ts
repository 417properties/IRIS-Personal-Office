import type { CanonicalRepository } from '../state/repository.ts';
export interface PersonalBireMetric {
  wall_clock_ms:number;
  tool_calls:number;
  retries:number;
  reconciliation_events:number;
  aaron_mechanical_interventions:number;
  model_provider?:string;
  provider_substitutions?:number;
}
export function recordBireMetric(repo:CanonicalRepository,episodeId:string,metric:PersonalBireMetric):void {
  repo.instrumentation.push({event_id:`bire:${episodeId}:${repo.instrumentation.length+1}`,event_type:'PERSONAL_BIRE',work_episode_id:episodeId,payload:structuredClone(metric) as unknown as Record<string,unknown>,occurred_at:new Date().toISOString()});
}
