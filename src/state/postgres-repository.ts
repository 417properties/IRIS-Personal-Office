export interface SqlExecutor {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
}
export class PostgresCanonicalRepository {
  readonly sql:SqlExecutor;
  constructor(sql: SqlExecutor) { this.sql=sql; }
  async verifyConnectivity(): Promise<boolean> {
    const rows = await this.sql.query<{ ok:number }>('select 1 as ok');
    return rows[0]?.ok === 1;
  }
  async readOpenObligations(): Promise<Record<string,unknown>[]> {
    return this.sql.query("select * from obligation where status <> 'CLOSED' order by obligation_id");
  }
  async readActiveCurrent(subjectRef:string,predicate:string): Promise<Record<string,unknown>[]> {
    return this.sql.query(
      'select * from current_assertion where subject_ref=$1 and predicate=$2 and effective_to is null order by version desc limit 2',
      [subjectRef,predicate]
    );
  }
  async appendInstrumentation(eventType:string,payload:unknown): Promise<void> {
    await this.sql.query('insert into instrumentation_event(event_id,event_type,payload,occurred_at) values(gen_random_uuid(),$1,$2,now())',[eventType,JSON.stringify(payload)]);
  }
}
