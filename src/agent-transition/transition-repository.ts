import crypto from 'node:crypto';
import type { SqlExecutor } from '../state/postgres-repository.ts';
import { buildProjection } from './pilot001-projection.ts';
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
export type ProjectionInput = Parameters<typeof buildProjection>[0];

export interface SnapshotDecoder {
  decode(rows: Readonly<CanonicalRows>, at:string): ProjectionInput;
}

export interface ProjectionRepository {
  readRepeatableSnapshot():Promise<ProjectionInput & {dependencies:Record<string,string>}>;
  readDependencies():Promise<Record<string,string>>;
  buildConsistentProjection():Promise<PilotProjection>;
  appendProjection(p: PilotProjection):Promise<void>;
}

function dependencyDigest(dependencies:Record<string,string>){
  return digest(Object.entries(dependencies).sort(([a],[b])=>a.localeCompare(b)));
}

export class PostgresTransitionProjectionRepository implements ProjectionRepository {
  readonly sql:SqlExecutor;
  readonly decoder:SnapshotDecoder;
  readonly at:()=>string;

  constructor(sql:SqlExecutor,decoder:SnapshotDecoder,at:()=>string){
    this.sql=sql;
    this.decoder=decoder;
    this.at=at;
  }

  async #read():Promise<{rows:CanonicalRows;dependencies:Record<string,string>}>{
    await this.sql.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
    try{
      const rows={} as CanonicalRows;
      const dependencies:Record<string,string>={};
      for(const table of READ_TABLES){
        const values=await this.sql.query(`SELECT * FROM ${table}`);
        rows[table]=values;
        dependencies[table]=digest(values.map(digest).sort());
      }
      await this.sql.query('COMMIT');
      return {rows,dependencies};
    }catch(error){
      await this.sql.query('ROLLBACK');
      throw error;
    }
  }

  async readRepeatableSnapshot():Promise<ProjectionInput & {dependencies:Record<string,string>}>{
    const {rows,dependencies}=await this.#read();
    return {...this.decoder.decode(structuredClone(rows),this.at()),dependencies};
  }

  async readDependencies():Promise<Record<string,string>>{
    return (await this.#read()).dependencies;
  }

  async buildConsistentProjection():Promise<PilotProjection>{
    const first=await this.readRepeatableSnapshot();
    const firstEnd=await this.readDependencies();
    if(dependencyDigest(first.dependencies)===dependencyDigest(firstEnd)){
      const {dependencies:_dependencies,...input}=first;
      return buildProjection({...input,bracket:'STABLE'});
    }

    const second=await this.readRepeatableSnapshot();
    const secondEnd=await this.readDependencies();
    const {dependencies:_dependencies,...input}=second;
    if(dependencyDigest(second.dependencies)===dependencyDigest(secondEnd)){
      return buildProjection({...input,bracket:'RERUN_STABLE'});
    }
    return buildProjection({...input,bracket:'UNSTABLE'});
  }

  async appendProjection(p:PilotProjection):Promise<void>{
    await this.sql.query('BEGIN');
    try{
      await this.sql.query(
        'INSERT INTO pilot001_projection_run (projection_id, principal_id, contract_id, scope_version, completeness_state, snapshot_started_at, emitted_at, dependency_digest, bracket_status, output) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [p.projection_id,p.principal_id,p.coverage_contract_id,p.scope_version,p.completeness_state,p.snapshot.started_at,p.snapshot.emitted_at,p.snapshot.dependency_digest,p.snapshot.bracket_status,JSON.stringify(p)]
      );
      for(const item of p.known_aaron_required){
        await this.sql.query(
          'INSERT INTO pilot001_projection_item (projection_id, item_id, disposition, payload) VALUES ($1,$2,$3,$4)',
          [p.projection_id,item.intervention_id,'AARON_REQUIRED',JSON.stringify(item)]
        );
      }
      await this.sql.query('COMMIT');
    }catch(error){
      await this.sql.query('ROLLBACK');
      throw error;
    }
  }
}
