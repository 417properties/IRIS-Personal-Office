export type PerceptionClass='EPHEMERAL_WORKING'|'EVIDENCE_CANDIDATE';
export interface Perception{observation_id:string;sensor_available:boolean;perception_class:PerceptionClass;qualified:boolean;expires_at?:string;persisted:boolean;}
// Retired label-only boundary. No qualification or retention from booleans.
export function processPerception(p:Perception,now:string){return {persist:false,evidence:false,current:false,expired:!!p.expires_at&&p.expires_at<=now,reason:'B5_CANONICAL_PERCEPTION_PRIVACY_REQUIRED'};}
