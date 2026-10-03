import type { ActionIntent } from '../domain/action-intent.ts';
import { toolContractMatches, type ToolContract, type ToolExecutor } from '../tools/tool-contract.ts';
import {ReleaseService,type ReleaseRequest} from '../enforcement/repository.ts';
export function releaseAction(service:ReleaseService,request:ReleaseRequest){if(!(service instanceof ReleaseService))throw new Error('CANONICAL_RELEASE_REQUIRED');return service.release(request);}
import type { ActionReceipt } from '../domain/action-receipt.ts';
export async function act(intent:ActionIntent, contract:ToolContract, executor:ToolExecutor, actionScope:string, privacyScope:string): Promise<ActionReceipt> {
  if (!toolContractMatches(intent,contract,actionScope,privacyScope)) throw new Error('TOOL_CONTRACT_MISMATCH');
  void executor;throw new Error('CANONICAL_RELEASE_REQUIRED');
}
