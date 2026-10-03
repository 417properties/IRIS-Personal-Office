// IRIS_B2_V1 is the persistence representation owner; B1 owns semantic meaning.
import { translateLegacy } from '../semantic-kernel/representation.ts';
import { decodeEnvelope, KERNEL_SCHEMA_VERSION, type KernelKind } from '../semantic-kernel/representation.ts';
import { decodeIdentity, sameIdentity, type Identity } from '../semantic-kernel/identity.ts';
import { decodeEpistemic, type EpistemicState } from '../semantic-kernel/epistemic.ts';
import { decodeTemporal, instant, type TemporalCoordinates } from '../semantic-kernel/temporal.ts';
import { decodeRootDisposition } from './root-disposition.ts';
import { jsonValue, denseArray } from './json.ts';
export { jsonValue } from './json.ts';
import { decodeSource, SOURCE_SCHEMAS } from './source-dto.ts';
import { ID_KINDS } from '../semantic-kernel/identity.ts';
import { demand, evidence, freeze, member, record, strings, text, version } from '../semantic-kernel/validation.ts';
export const SCHEMA_VERSION = 'IRIS_B2_V1' as const;
export const RECORD_KINDS = ['IDENTITY','EPISTEMIC','ITEM_FACT','RELATION','CAUSAL_OCCURRENCE','CONTINUATION','TEMPORAL','LIFECYCLE','EFFECT','CURRENT','ENTITY','ROOT_DISPOSITION'] as const;
export const METADATA_KINDS = ['ORIENTATION','EVIDENCE','CAPABILITY','LEARNING','AUTHORITY_POLICY','PRIVACY_POLICY','ACTION_DECISION'] as const;
export interface RepositoryIdentity { kind: Identity['kind'] | typeof METADATA_KINDS[number]; id: string }
export function decodeRepositoryIdentity(value:unknown):Readonly<RepositoryIdentity>{const r=record(value,['kind','id']);return freeze({kind:member(r.kind,[...ID_KINDS,...METADATA_KINDS]),id:text(r.id)});}
export function sameRepositoryIdentity(a:RepositoryIdentity,b:RepositoryIdentity){const x=decodeRepositoryIdentity(a),y=decodeRepositoryIdentity(b);return x.kind===y.kind&&x.id===y.id;}
const ENTITY_KINDS:Record<string,RepositoryIdentity['kind']>={ACTIONDECISION_V0:'ACTION_DECISION',PRINCIPAL_V0:'PRINCIPAL',ORIENTATIONSTATE_V0:'ORIENTATION',EVIDENCEOCCURRENCE_V0:'EVIDENCE',ACTIONINTENT_V0:'INTENT',ACTIONRECEIPT_V0:'RECEIPT',AUTHORITYPOLICY_V0:'AUTHORITY_POLICY',PRIVACYPOLICY_V0:'PRIVACY_POLICY',CAPABILITYPROCEDURE_V0:'CAPABILITY',LEARNINGRECORD_V0:'LEARNING',WORKEPISODE_V0:'WORK_EPISODE'};
function decodeEntity(value:unknown,object:RepositoryIdentity,principal:Identity,revision:number){
 const r=record(value,['entity_version','source','epistemic']);demand(r.entity_version==='IRIS_B2_ENTITY_V1','UNSUPPORTED_ENTITY_VERSION');
 const source=decodeSource(r.source),fields=source.source as Record<string,unknown>;const descriptor=SOURCE_SCHEMAS[source.representation_version as keyof typeof SOURCE_SCHEMAS];
 demand(object.kind===ENTITY_KINDS[source.representation_version]&&object.id===fields[descriptor.id_field],'ENTITY_IDENTITY_MISMATCH');
 if(Object.hasOwn(fields,'principal_id'))demand(fields.principal_id===principal.id,'ENTITY_PRINCIPAL_MISMATCH');
 if(Object.hasOwn(fields,'version'))demand(fields.version===revision,'ENTITY_VERSION_MISMATCH');
 return freeze({entity_version:'IRIS_B2_ENTITY_V1',source,epistemic:decodeEpistemic(r.epistemic)});
}
export interface Reference { record_id: string; object: RepositoryIdentity; version: number }
export interface CurrentValue { subject: Identity; predicate: string; value: unknown; epistemic: EpistemicState }
export interface CanonicalRecord {
  schema_version: typeof SCHEMA_VERSION; record_id: string; event_ref: string; object_type: typeof RECORD_KINDS[number];
  object: RepositoryIdentity; principal: Identity; version: number; temporal: TemporalCoordinates;
  evidence_refs: string[]; provenance_refs: string[]; privacy_refs: string[]; authority_refs: string[];
  references: Reference[]; source_representations: ReturnType<typeof decodeSource>[]; payload: unknown;
}
export function decodeReference(value: unknown): Reference {
  const r=record(value,['record_id','object','version']); return freeze({record_id:text(r.record_id),object:decodeRepositoryIdentity(r.object),version:version(r.version)});
}
export function decodeCurrent(value: unknown): Readonly<CurrentValue> {
  const r=record(value,['subject','predicate','value','epistemic']);
  return freeze({subject:decodeIdentity(r.subject),predicate:text(r.predicate),value:jsonValue(r.value),epistemic:decodeEpistemic(r.epistemic)});
}
export function decodeRecord(input: unknown): Readonly<CanonicalRecord> {
  const r=record(input,['schema_version','record_id','event_ref','object_type','object','principal','version','temporal','evidence_refs','provenance_refs','privacy_refs','authority_refs','references','source_representations','payload']);
  demand(r.schema_version===SCHEMA_VERSION,'UNSUPPORTED_REPOSITORY_SCHEMA');
  const kind=member(r.object_type,RECORD_KINDS), object=decodeRepositoryIdentity(r.object), principal=decodeIdentity(r.principal);
  demand(principal.kind==='PRINCIPAL','PRINCIPAL_KIND'); const v=version(r.version), temporal=decodeTemporal(r.temporal);
  const references=denseArray(r.references).map(decodeReference);
  const sources=denseArray(r.source_representations).map(decodeSource);
  demand(new Set(references.map(x=>JSON.stringify(x))).size===references.length,'DUPLICATE_REFERENCE');
  const payload=kind==='ROOT_DISPOSITION'?decodeRootDisposition(r.payload):kind==='ENTITY'?decodeEntity(r.payload,object,principal,v):kind==='IDENTITY'&&METADATA_KINDS.includes(object.kind as typeof METADATA_KINDS[number])?decodeRepositoryIdentity(r.payload):kind==='CURRENT'?decodeCurrent(r.payload):decodeEnvelope({schema_version:KERNEL_SCHEMA_VERSION,object_type:kind as KernelKind,payload:r.payload}).payload;
  const p=payload as unknown as Record<string,unknown>;
  if(kind==='ROOT_DISPOSITION'){demand(sameIdentity(decodeIdentity(p.root_ref),decodeIdentity(object))&&sameIdentity(decodeIdentity(p.principal_ref),principal),'ROOT_DISPOSITION_BINDING');demand(p.as_of===temporal.recorded_at,'ROOT_REASON_CUT_MISMATCH');}
  const event_ref=text(r.event_ref);if(Object.hasOwn(p,'last_event_ref'))demand(p.last_event_ref===event_ref,'PAYLOAD_EVENT_MISMATCH');
  if (['IDENTITY','LIFECYCLE','ITEM_FACT','CONTINUATION','CAUSAL_OCCURRENCE','EFFECT','CURRENT'].includes(kind)) {
    const target=kind==='IDENTITY'?payload:p[({LIFECYCLE:'object',ITEM_FACT:'root',CONTINUATION:'claim',CAUSAL_OCCURRENCE:'occurrence',EFFECT:'intent',CURRENT:'subject'} as Record<string,string>)[kind]!];
    demand(sameRepositoryIdentity(object,decodeRepositoryIdentity(target)),'PAYLOAD_OBJECT_MISMATCH');
  }
  if (Object.hasOwn(p,'principal')) demand(sameIdentity(principal,decodeIdentity(p.principal)),'PAYLOAD_PRINCIPAL_MISMATCH');
  if (Object.hasOwn(p,'version')) demand(p.version===v,'PAYLOAD_VERSION_MISMATCH');
  if (Object.hasOwn(p,'temporal')) demand(JSON.stringify(p.temporal)===JSON.stringify(temporal),'PAYLOAD_TEMPORAL_MISMATCH');
  if (kind==='TEMPORAL') demand(JSON.stringify(payload)===JSON.stringify(temporal),'PAYLOAD_TEMPORAL_MISMATCH');
  for(const source of sources){
    const fields=source.source as Record<string,unknown>,descriptor=SOURCE_SCHEMAS[source.representation_version as keyof typeof SOURCE_SCHEMAS];
    if(Object.hasOwn(fields,'principal_id'))demand(fields.principal_id===principal.id,'SOURCE_PRINCIPAL_MISMATCH');
    if(Object.hasOwn(fields,'version'))demand(fields.version===v,'SOURCE_VERSION_MISMATCH');
    if(['OBJECTIVE_V0','OBLIGATION_V0'].includes(source.representation_version)){
      demand(kind==='LIFECYCLE'&&object.kind===(source.representation_version==='OBJECTIVE_V0'?'OBJECTIVE':'OBLIGATION')&&object.id===fields[descriptor.id_field],'SOURCE_TARGET_MISMATCH');
      demand(p.state===translateLegacy(source.representation_version as 'OBJECTIVE_V0'|'OBLIGATION_V0',fields.status),'SOURCE_SEMANTIC_DRIFT');
    }else if(source.representation_version==='EFFECTVERIFICATION_V0'){
      demand(kind==='EFFECT'&&object.id===fields.intent_id&&p.disposition===translateLegacy('EFFECT_V0',fields.disposition),'SOURCE_SEMANTIC_DRIFT');
    }else if(source.representation_version==='CURRENTASSERTION_V0'){
      demand(kind==='CURRENT'&&(p.subject as Identity).id===fields.subject_ref&&p.predicate===fields.predicate&&JSON.stringify(jsonValue(p.value))===JSON.stringify(jsonValue(fields.value)),'SOURCE_CURRENT_DRIFT');
    }else demand(kind==='ENTITY'&&JSON.stringify((p.source as unknown))===JSON.stringify(source),'SOURCE_ENTITY_DRIFT');
  }
  const epistemic=kind==='CURRENT'||kind==='ITEM_FACT'||kind==='ENTITY'?p.epistemic:kind==='EPISTEMIC'?payload:undefined;
  if (epistemic) demand(instant((epistemic as EpistemicState).as_of)===temporal.recorded_at,'EPISTEMIC_RECORDING_CUT_MISMATCH');
  return freeze({schema_version:SCHEMA_VERSION,record_id:text(r.record_id),event_ref,object_type:kind,object,principal,version:v,temporal,
    evidence_refs:evidence(denseArray(r.evidence_refs)),provenance_refs:evidence(denseArray(r.provenance_refs)),privacy_refs:strings(denseArray(r.privacy_refs)),authority_refs:strings(denseArray(r.authority_refs)),references,source_representations:sources,payload});
}
// Total identity translation for every B1 payload: no coordinate stripping.
export function domainToDTO(value: unknown) { return decodeRecord(value); }
export function dtoToDomain(value: unknown) { return decodeRecord(value); }
export function recordKey(value: Pick<CanonicalRecord,'principal'|'record_id'>) { return JSON.stringify([value.principal.id,value.record_id]); }
