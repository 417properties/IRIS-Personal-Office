// IRIS_LEGACY_V0 source representation. Explicit decoders/maps are in
// source-dto.ts / legacy-maps.ts; qualified canonical records use canonical.ts.
export type ObligationStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'HOLD' | 'CLOSED' | 'UNKNOWN';
export interface Obligation {
  obligation_id: string;
  objective_id: string;
  owner: 'IRIS' | 'AARON' | 'EXTERNAL';
  description: string;
  status: ObligationStatus;
  due_at?: string;
  closure_criteria: string[];
  authority_requirement: string[];
  privacy_requirement: string[];
  source_refs: string[];
  last_episode_id?: string;
  version: number;
}
