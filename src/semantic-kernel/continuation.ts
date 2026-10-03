import { demand, evidence, freeze, record, text, version } from './validation.ts';
import { decodeIdentity, type Identity } from './identity.ts';
import { decodeTemporal, type TemporalCoordinates } from './temporal.ts';

// Representation of A2's continuation fence. This is no durable claim/transfer,
// authority grant, or release permission; the atomic enforcement seam is B3.
export interface ContinuationClaim {
  claim: Identity; principal: Identity; causal_episode: Identity; owner_incarnation: Identity;
  generation: number; fence_token: string; temporal: TemporalCoordinates; admission_evidence_refs: string[];
}
export function decodeContinuation(value: unknown): Readonly<ContinuationClaim> {
  const r = record(value, ['claim', 'principal', 'causal_episode', 'owner_incarnation', 'generation', 'fence_token', 'temporal', 'admission_evidence_refs']);
  const claim = decodeIdentity(r.claim), principal = decodeIdentity(r.principal), causal_episode = decodeIdentity(r.causal_episode), owner_incarnation = decodeIdentity(r.owner_incarnation);
  demand(claim.kind === 'CONTINUATION' && principal.kind === 'PRINCIPAL' && causal_episode.kind === 'CAUSAL_OCCURRENCE' && ['WORKER', 'SUBSTRATE'].includes(owner_incarnation.kind), 'CONTINUATION_IDENTITY_KINDS');
  return freeze({ claim, principal, causal_episode, owner_incarnation, generation: version(r.generation), fence_token: text(r.fence_token), temporal: decodeTemporal(r.temporal), admission_evidence_refs: evidence(r.admission_evidence_refs) });
}
