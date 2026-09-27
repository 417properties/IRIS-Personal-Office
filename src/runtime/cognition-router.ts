export interface CognitionRequest {
  phase:'ORIENT'|'PERCEIVE'|'THINK'|'ACT'|'LEARN';
  task_type:string;
  complexity:'LOW'|'MEDIUM'|'HIGH';
  privacy_constraints:string[];
  required_modalities:string[];
  model_provider_restrictions:string[];
  max_reasoning_class:'LOW'|'MEDIUM'|'HIGH';
  trace_context:string;
}
export interface CognitionResult {
  provider:string;
  model:string;
  usage:{input_tokens:number;output_tokens:number};
  uncertainty:string[];
  authority_effect:'NONE';
}
export class CognitionRouter {
  readonly allowedModels:string[];
  constructor(allowedModels: string[]) { this.allowedModels=[...allowedModels]; }
  route(request:CognitionRequest): string {
    const restricted=this.allowedModels.filter(m=>!request.model_provider_restrictions.some(r=>m.startsWith(`${r}/`)));
    if (!restricted.length) throw new Error('NO_ALLOWED_COGNITION_PROVIDER');
    if (request.complexity==='HIGH') return restricted.at(-1)!;
    return restricted[0]!;
  }
  normalize(provider:string,model:string): CognitionResult {
    return {provider,model,usage:{input_tokens:0,output_tokens:0},uncertainty:[],authority_effect:'NONE'};
  }
}
