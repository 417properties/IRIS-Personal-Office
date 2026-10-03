import { type CanonicalRecord, type RepositoryIdentity, decodeRepositoryIdentity } from './canonical.ts';
// Representation refs are opaque exact coordinates. No prefix parsing or
// shared-objective inference. Each relation must also have an explicit version.
const SOURCE_RELATIONS:Record<string,Record<string,RepositoryIdentity['kind']>>={
 ORIENTATIONSTATE_V0:{supersedes_orientation_id:'ORIENTATION'},
 EVIDENCEOCCURRENCE_V0:{work_episode_id:'WORK_EPISODE',causal_episode_id:'CAUSAL_OCCURRENCE',supersedes_occurrence_id:'EVIDENCE'},
 OBJECTIVE_V0:{parent_objective_id:'OBJECTIVE'},
 OBLIGATION_V0:{objective_id:'OBJECTIVE',last_episode_id:'WORK_EPISODE'},
 ACTIONINTENT_V0:{decision_ref:'ACTION_DECISION',work_episode_id:'WORK_EPISODE'},
 ACTIONRECEIPT_V0:{intent_id:'INTENT'},
 EFFECTVERIFICATION_V0:{intent_id:'INTENT',receipt_id:'RECEIPT'},
 WORKEPISODE_V0:{objective_id:'OBJECTIVE',obligation_id:'OBLIGATION',continuation_of_episode_id:'WORK_EPISODE',causal_episode_id:'CAUSAL_OCCURRENCE'}
};
export function sourceReferences(v:CanonicalRecord):RepositoryIdentity[]{
 const values=v.source_representations.slice();
 if(v.object_type==='ENTITY')values.push((v.payload as {source:typeof values[number]}).source);
 return values.flatMap(({representation_version,source})=>Object.entries(SOURCE_RELATIONS[representation_version]??{}).flatMap(([field,kind])=>{
  const x=(source as Record<string,unknown>)[field];return x===undefined?[]:[decodeRepositoryIdentity({kind,id:x})];
 }));
}
