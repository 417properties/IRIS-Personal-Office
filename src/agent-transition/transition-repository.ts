import crypto from 'node:crypto';
import type { SqlExecutor } from '../state/postgres-repository.ts';
import type {LegacyProjectionInput} from './pilot001-projection.ts';
import type { PilotProjection } from './pilot001-types.ts';

export const transitionMigrationFiles = [
  'db/migrations/005_agent_transition_identity_authority.sql',
  'db/migrations/006_pilot001_projection.sql'
] as const;

export function digest(value:unknown):string {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

const READ_TABLES = [
  'projection_coverage_contract',
  'projection_source_requirement',
  'principal',
  'objective',
  'obligation',
  'obligation_governance',
  'decision_requirement',
  'authority_generation_state',
  'authority_lease',
  'authority_lease_state',
  'action_intent',
  'action_receipt',
  'effect_verification',
  'current_assertion',
  'big_delta_quarantine',
  'evidence_occurrence',
  'authority_policy',
  'privacy_policy',
  'agent_identity',
  'worker_identity_profile',
  'worker_assignment'
] as const;

export type CanonicalRows = Record<typeof READ_TABLES[number], Record<string, unknown>[]>;
export type ProjectionInput = LegacyProjectionInput;

export interface SnapshotDecoder {
  decode(rows: Readonly<CanonicalRows>, at:string): ProjectionInput;
}

export interface ProjectionRepository {
  readRepeatableSnapshot():Promise<ProjectionInput & {dependencies:Record<string,string>}>;
  readDependencies():Promise<Record<string,string>>;
  buildConsistentProjection():Promise<PilotProjection>;
  appendProjection(p: PilotProjection):Promise<void>;
}

// The legacy SQL table scan is not a B2/B3/B4 canonical snapshot proof.
// Reject before invoking SQL or a caller-authored decoder. No second journal.
export class PostgresTransitionProjectionRepository implements ProjectionRepository {
 constructor(_sql:SqlExecutor,_decoder:SnapshotDecoder,_at:()=>string){throw new Error('B6_CANONICAL_PILOT_REQUIRED');}
 async readRepeatableSnapshot():Promise<ProjectionInput & {dependencies:Record<string,string>}>{throw new Error('B6_CANONICAL_PILOT_REQUIRED');}
 async readDependencies():Promise<Record<string,string>>{throw new Error('B6_CANONICAL_PILOT_REQUIRED');}
 async buildConsistentProjection():Promise<PilotProjection>{throw new Error('B6_CANONICAL_PILOT_REQUIRED');}
 async appendProjection(_p:PilotProjection):Promise<void>{throw new Error('B6_CANONICAL_PILOT_REQUIRED');}
}
