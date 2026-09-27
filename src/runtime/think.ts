export interface Thought {
  thought_id:string;
  recommended_operation:string;
  reason:string;
  authority_effect:'NONE';
}
export function think(input:{objective_id:string; perception_qualified:boolean; desired_operation:string}): Thought {
  if (!input.perception_qualified) throw new Error('THINK_REQUIRES_QUALIFIED_PERCEPTION');
  return {thought_id:`thought:${input.objective_id}`,recommended_operation:input.desired_operation,reason:'BOUNDED_OBJECTIVE_AND_QUALIFIED_PERCEPTION',authority_effect:'NONE'};
}
