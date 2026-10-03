import type { LegacyRepository, BigDelta } from '../state/legacy-repository.ts';
import { validateBigDelta } from './big-delta-envelope.ts';
export function quarantineBigDelta(repo:LegacyRepository,delta:BigDelta):void {
  validateBigDelta(delta);
  repo.bigDeltaQuarantine.set(delta.delta_id,structuredClone(delta));
  repo.stateVersion++;
}
