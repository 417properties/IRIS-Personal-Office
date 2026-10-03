import type { LegacyRepository } from '../state/legacy-repository.ts';
import type { WorkEpisode } from '../domain/work-episode.ts';
export function claimContinuation(repo:LegacyRepository, episode:WorkEpisode): void {
  const same=[...repo.episodes.values()].filter(e=>e.causal_episode_id===episode.causal_episode_id && !e.ended_at);
  if (same.some(e=>e.episode_generation>=episode.episode_generation && e.work_episode_id!==episode.work_episode_id)) throw new Error('CONTINUATION_CAS_CONFLICT');
  repo.episodes.set(episode.work_episode_id,structuredClone(episode)); repo.stateVersion++;
}
