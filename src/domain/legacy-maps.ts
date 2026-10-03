import { decodeSource, SOURCE_SCHEMAS } from './source-dto.ts';
export { decodeSource, SOURCE_SCHEMAS } from './source-dto.ts';
import { demand, freeze, record } from '../semantic-kernel/validation.ts';
import { retainLegacy, restoreLegacy } from '../semantic-kernel/representation.ts';
import { decodeRecord } from './canonical.ts';
import { jsonValue } from './json.ts';
// Information absent in V0 is REQUIRED from explicit canonical context. There
// is no auto-guess of principal, recording time, proof kind, coverage or closure.
export function mapSourceToDomain(value:unknown,canonical:unknown){
  const source=decodeSource(value),target=decodeRecord(canonical),s=source.source as Record<string,unknown>;
  const schema=SOURCE_SCHEMAS[source.representation_version as keyof typeof SOURCE_SCHEMAS];
  const p=target.payload as Record<string,unknown>;
  if(Object.hasOwn(s,'principal_id'))demand(s.principal_id===target.principal.id,'SOURCE_PRINCIPAL_MISMATCH');
  if(Object.hasOwn(s,'version'))demand(s.version===target.version,'SOURCE_VERSION_MISMATCH');
  let translation:unknown=null;
  if(source.representation_version==='OBJECTIVE_V0'||source.representation_version==='OBLIGATION_V0'){
    demand(target.object_type==='LIFECYCLE'&&target.object.id===s[schema.id_field],'SOURCE_TARGET_MISMATCH');
    translation=retainLegacy(source.representation_version,s.status as string);
    demand(p.state===(translation as {semantic_state:string}).semantic_state,'SOURCE_SEMANTIC_DRIFT');
  }else if(source.representation_version==='EFFECTVERIFICATION_V0'){
    demand(target.object_type==='EFFECT'&&target.object.id===s.intent_id,'SOURCE_TARGET_MISMATCH');
    translation=retainLegacy('EFFECT_V0',s.disposition as string);
    demand(p.disposition===(translation as {semantic_state:string}).semantic_state,'SOURCE_SEMANTIC_DRIFT');
  }else if(source.representation_version==='CURRENTASSERTION_V0'){
    demand(target.object_type==='CURRENT'&&(p.subject as {id:string}).id===s.subject_ref&&p.predicate===s.predicate,'SOURCE_TARGET_MISMATCH');
    demand(JSON.stringify(jsonValue(p.value))===JSON.stringify(jsonValue(s.value)),'SOURCE_VALUE_DRIFT');
    // V0 qualification/coverage is retained but never promoted into A1.
  }else demand(target.object_type==='ENTITY'&&target.object.id===s[schema.id_field]&&JSON.stringify(p.source)===JSON.stringify(source),'EXPLICIT_AGGREGATE_MAPPING_REQUIRED');
  return freeze({schema_version:'IRIS_B2_SOURCE_MAP_V1',source,canonical:target,translation});
}
export function restoreSource(value:unknown){
  const r=record(value,['schema_version','source','canonical','translation']);demand(r.schema_version==='IRIS_B2_SOURCE_MAP_V1','UNSUPPORTED_SOURCE_MAP');
  const mapped=mapSourceToDomain(r.source,r.canonical);
  demand(JSON.stringify(mapped.translation)===JSON.stringify(r.translation),'SOURCE_TRANSLATION_DRIFT');
  if(r.translation!==null)restoreLegacy(r.translation);
  return mapped.source;
}
