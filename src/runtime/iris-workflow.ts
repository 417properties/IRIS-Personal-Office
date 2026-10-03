import type { LegacyRepository } from '../state/legacy-repository.ts';
import type { ActionIntent } from '../domain/action-intent.ts';
import { toolContractMatches, type ToolContract, type ToolExecutor } from '../tools/tool-contract.ts';
import {ReleaseService,type ReleaseRequest} from '../enforcement/repository.ts';
// B4 owns effect verification/closure; this migrated consequential seam releases only.
export async function runConsequentialCircuit(service:ReleaseService,request:ReleaseRequest){if(!(service instanceof ReleaseService))throw new Error('CANONICAL_RELEASE_REQUIRED');return service.release(request);}
export async function runBoundedCircuit(args:{
  repo:LegacyRepository; principalId:string; objectiveId:string; obligationId:string; episodeId:string;
  subjectRef:string; predicate:string; actionScope:string; privacyScope:string; intent:ActionIntent;
  contract:ToolContract; executor:ToolExecutor; fixtureRead:()=>unknown; expectedEffect:unknown; now:string;
}) {
  if (!toolContractMatches(args.intent,args.contract,args.actionScope,args.privacyScope)) return {status:'HOLD_TOOL_CONTRACT_MISMATCH'};
  return {status:'HOLD_CANONICAL_RELEASE_REQUIRED'};
}

import {decodeReleaseRequest} from '../enforcement/repository.ts';
import {VerificationService,RecoveryService} from '../recovery/service.ts';
import {freeze,demand} from '../semantic-kernel/validation.ts';
import {jsonValue} from '../domain/json.ts';
export async function runVerifiedCircuit(service:ReleaseService,verifier:VerificationService,request:ReleaseRequest,closure:{service:RecoveryService;command:unknown}|null=null){
 demand(service instanceof ReleaseService&&verifier instanceof VerificationService&&service.repository===verifier.repository,'B4_CANONICAL_CIRCUIT_REQUIRED');const captured=decodeReleaseRequest(request),close=closure===null?null:{service:closure.service,command:freeze(jsonValue(closure.command))};if(close)demand(close.service.repository===service.repository,'B4_CIRCUIT_STORE_MISMATCH');
 const release=await service.release(captured);if(!['SUBMITTING','AMBIGUOUS_SUBMISSION','RELEASED_SUBMITTED'].includes(release.state))return freeze({status:'HOLD_RELEASE',release});const verification=await verifier.verifyNew(captured.attempt);if(verification.disposition!=='EFFECT_VERIFIED')return freeze({status:'RECONCILIATION_REQUIRED',release,verification});const reconciliation=close?await close.service.reconcileClosure(close.command):null;return freeze({status:reconciliation?'CLOSURE_RECONCILED':'EFFECT_VERIFIED_CLOSURE_NOT_ADJUDICATED',release,verification,reconciliation});
}
