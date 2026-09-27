import type { ActionIntent } from '../domain/action-intent.ts';
import type { ToolContract, ToolExecutor } from '../tools/tool-contract.ts';
import type { ActionReceipt } from '../domain/action-receipt.ts';
export async function act(intent:ActionIntent, contract:ToolContract, executor:ToolExecutor): Promise<ActionReceipt> {
  if (intent.tool_id!==contract.tool_id) throw new Error('TOOL_CONTRACT_MISMATCH');
  return executor.execute(intent);
}
