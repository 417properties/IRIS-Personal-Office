import type { ToolContract } from './tool-contract.ts';
export class ToolRegistry {
  private readonly tools=new Map<string,ToolContract>();
  register(contract:ToolContract):void { this.tools.set(contract.tool_id,structuredClone(contract)); }
  get(toolId:string):ToolContract|undefined { const x=this.tools.get(toolId); return x?structuredClone(x):undefined; }
  has(toolId:string):boolean { return this.tools.has(toolId); }
}
