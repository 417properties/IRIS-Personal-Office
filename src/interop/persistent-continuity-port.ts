export interface PersistentContinuityAdapter {
  offerCheckpoint(input:{work_episode_id:string;canonical_state_version:number;payload_ref:string}):Promise<{accepted:boolean;provider_ref?:string}>;
}
export const CONTINUITY_STATUS='OFF' as const;
