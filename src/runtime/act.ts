import type { ActionIntent } from '../domain/action-intent.ts';
import { toolContractMatches, type ToolContract, type ToolExecutor } from '../tools/tool-contract.ts';
import type { ActionReceipt } from '../domain/action-receipt.ts';
export async function act(intent:ActionIntent, contract:ToolContract, executor:ToolExecutor, actionScope:string, privacyScope:string): Promise<ActionReceipt> {
  if (!toolContractMatches(intent,contract,actionScope,privacyScope)) throw new Error('TOOL_CONTRACT_MISMATCH');
  return executor.execute(intent);
}
