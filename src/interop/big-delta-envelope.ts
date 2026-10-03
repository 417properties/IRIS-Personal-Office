import type { BigDelta } from '../state/legacy-repository.ts';
export type BigDeltaEnvelope = BigDelta;
export function validateBigDelta(x:BigDelta):void {
  if (x.source_system!=='BIG'||x.target_system!=='IRIS'||x.authority_effect!=='NONE') throw new Error('BIG_DELTA_BOUNDARY_VIOLATION');
}
