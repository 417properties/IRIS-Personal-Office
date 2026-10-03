import type { LegacyRepository } from '../state/legacy-repository.ts';
export type IefEventType='EXPERIENCE_RECORDED'|'CANDIDATE_LESSON_PROPOSED'|'LESSON_REJECTED'|'LESSON_QUALIFICATION_REQUIRED'|'CAPABILITY_EVIDENCE_ADDED'|'FAILURE_FRONTIER_OBSERVED';
export function emitIefEvent(repo:LegacyRepository,episodeId:string,eventType:IefEventType,payload:Record<string,unknown>):void {
  repo.instrumentation.push({event_id:`ief:${episodeId}:${repo.instrumentation.length+1}`,event_type:eventType,work_episode_id:episodeId,payload:structuredClone(payload),occurred_at:new Date().toISOString()});
}
