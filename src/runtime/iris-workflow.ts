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
