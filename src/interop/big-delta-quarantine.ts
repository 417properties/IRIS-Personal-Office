import type { CanonicalRepository, BigDelta } from '../state/repository.ts';
import { validateBigDelta } from './big-delta-envelope.ts';
export function quarantineBigDelta(repo:CanonicalRepository,delta:BigDelta):void {
  validateBigDelta(delta);
  repo.bigDeltaQuarantine.set(delta.delta_id,structuredClone(delta));
  repo.stateVersion++;
}
