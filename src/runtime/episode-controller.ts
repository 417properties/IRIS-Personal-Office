import type { LegacyRepository } from '../state/legacy-repository.ts';
import type { WorkEpisode } from '../domain/work-episode.ts';
import {EnforcementRepository} from '../enforcement/repository.ts';
import type {ContinuationClaim} from '../semantic-kernel/continuation.ts';
export function transferContinuation(repository:EnforcementRepository,expected:ContinuationClaim,successor:ContinuationClaim){return repository.command({kind:'TRANSFER_CONTINUATION',value:{expected,successor}});}
// A mutable V0 episode cannot acquire a canonical continuation fence.
export function claimContinuation(_repo:LegacyRepository,_episode:WorkEpisode):never {throw new Error('CANONICAL_CONTINUATION_CAS_REQUIRED');}
