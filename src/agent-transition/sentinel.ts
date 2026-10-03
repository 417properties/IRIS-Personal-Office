import {EnforcementRepository,ReleaseService,type ReleaseRequest,type ReleaseAttempt} from '../enforcement/repository.ts';
export type {ReleaseAttempt} from '../enforcement/repository.ts';
export function prepareReleaseAttempt(repository:EnforcementRepository,request:ReleaseRequest){
 if(!(repository instanceof EnforcementRepository))throw new Error('CANONICAL_RELEASE_REQUIRED');
 return repository.command({kind:'PREPARE',value:{intent:request.intent,attempt:request.attempt,fence:request.fence}}) as Promise<ReleaseAttempt>;
}
export function validateAndRelease(service:ReleaseService,request:ReleaseRequest){
 if(!(service instanceof ReleaseService))throw new Error('CANONICAL_RELEASE_REQUIRED');
 return service.release(request);
}
// Re-invocation observes PREPARED (not submitted) or possible submission. A boolean
// knownReceipt never manufactures accepted submission or effect verification.
export function recoverPreparedAttempt(repository:EnforcementRepository,request:ReleaseRequest){return repository.getAttempt(request.attempt);}
