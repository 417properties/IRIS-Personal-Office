import type { ToolContract } from './tool-contract.ts';
export interface McpDiscoveredTool { name:string; description?:string; }
export function wrapMcpTool(tool:McpDiscoveredTool,authorityScope:string,privacyScope:string): ToolContract {
  return {
    tool_id:`mcp:${tool.name}`,
    authority_scope:authorityScope,
    privacy_scope:privacyScope,
    retry_classification:'NON_IDEMPOTENT_RECONCILABLE',
    external:true
  };
}
export const MCP_PROTOCOL_TARGET='2026-07-28';
