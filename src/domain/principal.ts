// IRIS_LEGACY_V0 source representation. Explicit decoders/maps are in
// source-dto.ts / legacy-maps.ts; qualified canonical records use canonical.ts.
export interface Principal {
  principal_id: string;
  principal_type: 'AARON';
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  schema_version: number;
}
