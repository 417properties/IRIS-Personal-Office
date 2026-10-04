// ICCP is a loss-explicit representation profile over B1/B2. No receipt,
// delivery, hash, or negotiated vocabulary grants truth, Current, or authority.
import {B5,CapabilityContext,withCapabilityContext,id,same} from '../capability/context.ts';
import {decodeDisclosure,filterPrivacy,type DisclosureRequest} from '../capability/privacy.ts';
import {decodeReference,type Reference} from '../domain/canonical.ts';
import {decodeIdentity,type Identity} from '../semantic-kernel/identity.ts';
import {decodeEpistemic,type EpistemicState} from '../semantic-kernel/epistemic.ts';
import {decodeTemporal,instant,knownAsOf,type TemporalCoordinates} from '../semantic-kernel/temporal.ts';
import {demand,record,text,member,evidence,strings,freeze,version} from '../semantic-kernel/validation.ts';
import {denseArray,jsonValue,parseJSON} from '../domain/json.ts';
import {digest,sha,nonnegative} from '../enforcement/contracts.ts';
import type {CanonicalRepository} from '../state/repository.ts';
export const PROFILE='IRIS_ICCP_V1' as const;
export const FIELDS=['schema_version','profile','vocabulary','message','occurrence','actor','principal','sponsor','object_refs','base_refs','transition','epistemic','evidence_refs','provenance_refs','privacy_refs','authority_refs','relations','temporal','consequence','unresolved_debt','return_destination','assurance','loss','required_extensions','optional_extensions'] as const;
export interface Message {
 schema_version:typeof B5;profile:typeof PROFILE;vocabulary:'IRIS_A1_A5_V1';message:Identity;occurrence:Identity;actor:Identity;principal:Identity;sponsor:Identity;
 object_refs:Reference[];base_refs:Reference[];transition:'NO_DELTA'|'PROPOSED_DELTA';epistemic:EpistemicState;evidence_refs:string[];provenance_refs:string[];privacy_refs:Reference[];authority_refs:Reference[];
 relations:{kind:'PARENT'|'DERIVED_FROM'|'RESPONDS_TO';source:Identity;target:Identity}[];temporal:TemporalCoordinates;consequence:'OBSERVATION_ONLY'|'PROPOSAL_ONLY';unresolved_debt:string[];return_destination:Identity;assurance:{required:string[];achieved:string[]};loss:string[];required_extensions:string[];optional_extensions:Record<string,unknown>;
}
export function decodeMessage(input:unknown):Readonly<Message>{
 const r=record(input,FIELDS);demand(r.schema_version===B5&&r.profile===PROFILE&&r.vocabulary==='IRIS_A1_A5_V1','B5_ICCP_PROFILE');const a=record(r.assurance,['required','achieved']),optional=jsonValue(r.optional_extensions);demand(optional!==null&&typeof optional==='object'&&!Array.isArray(optional),'B5_ICCP_EXTENSIONS');
 const actor=decodeIdentity(r.actor);demand(['WORKER','SUBSTRATE','PRINCIPAL'].includes(actor.kind),'B5_ICCP_ACTOR');
 const refs=(v:unknown)=>denseArray(v).map(decodeReference);return freeze({schema_version:B5,profile:PROFILE,vocabulary:'IRIS_A1_A5_V1',message:id(r.message,'COMMUNICATION_EVENT'),occurrence:id(r.occurrence,'CAUSAL_OCCURRENCE'),actor,principal:id(r.principal,'PRINCIPAL'),sponsor:id(r.sponsor,'PRINCIPAL'),object_refs:refs(r.object_refs),base_refs:refs(r.base_refs),transition:member(r.transition,['NO_DELTA','PROPOSED_DELTA']),epistemic:decodeEpistemic(r.epistemic),evidence_refs:evidence(denseArray(r.evidence_refs)),provenance_refs:evidence(denseArray(r.provenance_refs)),privacy_refs:refs(r.privacy_refs),authority_refs:refs(r.authority_refs),relations:denseArray(r.relations).map(v=>{const x=record(v,['kind','source','target']);return {kind:member(x.kind,['PARENT','DERIVED_FROM','RESPONDS_TO']),source:id(x.source,'CAUSAL_OCCURRENCE'),target:id(x.target,'CAUSAL_OCCURRENCE')};}),temporal:decodeTemporal(r.temporal),consequence:member(r.consequence,['OBSERVATION_ONLY','PROPOSAL_ONLY']),unresolved_debt:strings(denseArray(r.unresolved_debt)),return_destination:id(r.return_destination,'PRINCIPAL'),assurance:{required:strings(denseArray(a.required)),achieved:strings(denseArray(a.achieved))},loss:strings(denseArray(r.loss)),required_extensions:strings(denseArray(r.required_extensions)),optional_extensions:optional as Record<string,unknown>});
}
export function occurrenceMeaning(input:Message){const {message,...meaning}=decodeMessage(input);return digest(meaning);}
export interface ReceiverProfile {profile:typeof PROFILE;vocabulary:'IRIS_A1_A5_V1';extensions:string[];max_representation:'CANONICAL'|'DENSE';recipient:Identity}
export function decodeProfile(input:unknown):Readonly<ReceiverProfile>{const r=record(input,['profile','vocabulary','extensions','max_representation','recipient']);demand(r.profile===PROFILE&&r.vocabulary==='IRIS_A1_A5_V1','B5_ICCP_NEGOTIATION_HOLD');return freeze({profile:PROFILE,vocabulary:'IRIS_A1_A5_V1',extensions:strings(denseArray(r.extensions)),max_representation:member(r.max_representation,['CANONICAL','DENSE']),recipient:id(r.recipient,'PRINCIPAL')});}
export function negotiate(message:Message,receiver:ReceiverProfile){const m=decodeMessage(message),r=decodeProfile(receiver);demand(m.required_extensions.every(x=>r.extensions.includes(x)),'B5_ICCP_REQUIRED_EXTENSION_HOLD');return r.max_representation;}
export function toDense(input:Message){const m=decodeMessage(input);return freeze({profile:PROFILE,codec:'FIELD_VECTOR_V1',fields:FIELDS.map(k=>m[k])});}
export function fromDense(input:unknown){const r=record(input,['profile','codec','fields']);demand(r.profile===PROFILE&&r.codec==='FIELD_VECTOR_V1','B5_ICCP_DENSE_CODEC');const fields=denseArray(r.fields);demand(fields.length===FIELDS.length,'B5_ICCP_DENSE_REQUIRED_MEANING');return decodeMessage(Object.fromEntries(FIELDS.map((k,i)=>[k,fields[i]])));}
export interface Wire {
 schema_version:typeof B5;profile:typeof PROFILE;vocabulary:'IRIS_A1_A5_V1';event_id:string;message:Identity;occurrence:Identity;source:Identity;destination:Identity;recorded_at:string;expires_at:string;
 encoding:'CANONICAL'|'DENSE';payload:unknown;semantic_digest:string;integrity_digest:string;attempt:number;idempotency_key:string;trace_id:string;parent_event:string|null;queue_latency_ms:number;failure_debt:string[];
}
const WIRE_FIELDS=['schema_version','profile','vocabulary','event_id','message','occurrence','source','destination','recorded_at','expires_at','encoding','payload','semantic_digest','integrity_digest','attempt','idempotency_key','trace_id','parent_event','queue_latency_ms','failure_debt'] as const;
export function decodeWire(input:unknown):Readonly<Wire>{const r=record(input,WIRE_FIELDS);demand(r.schema_version===B5&&r.profile===PROFILE&&r.vocabulary==='IRIS_A1_A5_V1','B5_ICCP_WIRE_PROFILE');const source=decodeIdentity(r.source),wire:Wire={schema_version:B5,profile:PROFILE,vocabulary:'IRIS_A1_A5_V1',event_id:text(r.event_id),message:id(r.message,'COMMUNICATION_EVENT'),occurrence:id(r.occurrence,'CAUSAL_OCCURRENCE'),source,destination:id(r.destination,'PRINCIPAL'),recorded_at:instant(r.recorded_at),expires_at:instant(r.expires_at),encoding:member(r.encoding,['CANONICAL','DENSE']),payload:jsonValue(r.payload),semantic_digest:sha(r.semantic_digest),integrity_digest:sha(r.integrity_digest),attempt:version(r.attempt),idempotency_key:sha(r.idempotency_key),trace_id:text(r.trace_id),parent_event:r.parent_event===null?null:text(r.parent_event),queue_latency_ms:nonnegative(r.queue_latency_ms),failure_debt:strings(denseArray(r.failure_debt))};const {integrity_digest,...body}=wire;demand(integrity_digest===digest(body),'B5_ICCP_INTEGRITY_HOLD');return freeze(wire);}
export function encodeWire(message:Message,receiver:ReceiverProfile,delivery:{event_id:string;attempt:number;trace_id:string;parent_event:string|null;recorded_at:string;queue_latency_ms:number;failure_debt:string[]}){
 const m=decodeMessage(message),r=decodeProfile(receiver),encoding=negotiate(m,r);demand(m.temporal.valid_until!==undefined,'B5_ICCP_EXPIRY_REQUIRED');
 const body={schema_version:B5,profile:PROFILE,vocabulary:'IRIS_A1_A5_V1',...delivery,message:m.message,occurrence:m.occurrence,source:m.actor,destination:r.recipient,expires_at:m.temporal.valid_until,encoding,payload:encoding==='DENSE'?toDense(m):m,semantic_digest:digest(m),idempotency_key:digest([m.principal,m.occurrence,m.message]),};return decodeWire({...body,integrity_digest:digest(body)});
}
export async function filterMessage(c:CapabilityContext,input:Message,privacy:DisclosureRequest){
 const m=decodeMessage(input);demand(same(m.principal,c.principal)&&m.temporal.valid_until!==undefined&&m.temporal.observed_at!==undefined&&knownAsOf(m.temporal,c.as_of)&&(m.temporal.requalification_at===undefined||Date.parse(m.temporal.requalification_at)>Date.parse(c.as_of))&&m.loss.length===0,'B5_ICCP_MEANING_CURRENTNESS_LOSS_HOLD');
 demand(Date.parse(m.epistemic.as_of)<=Date.parse(c.as_of)&&m.epistemic.invalidators.length===0&&m.epistemic.applicability_state==='APPLICABLE'&&m.epistemic.freshness_state==='CURRENT_AS_OF','B5_ICCP_EPISTEMIC_HOLD');
 for(const ref of [...m.object_refs,...m.base_refs,...m.privacy_refs,...m.authority_refs])await c.reference(ref);
 await c.registered(m.actor);await c.registered(m.sponsor);await c.registered(m.occurrence);await c.registered(m.message);await c.registered(m.return_destination);
 const reconstruction=await c.repository.reconstruct({schema_version:'IRIS_B2_V1',principal:c.principal,as_of:c.as_of}),occurrence=reconstruction.views.find(v=>v.known_effective&&v.selected?.object_type==='CAUSAL_OCCURRENCE'&&same(v.selected.object,m.occurrence))?.selected;
 demand(occurrence&&m.object_refs.some(ref=>same(ref,c.ref(occurrence)))&&same((occurrence.payload as Record<string,unknown>).originating_ref,m.actor)&&(occurrence.payload as Record<string,unknown>).operation_digest===occurrenceMeaning(m),'B5_ICCP_CANONICAL_OCCURRENCE_BINDING');
 for(const relation of m.relations){demand(!same(relation.source,relation.target)&&same(relation.source,m.occurrence),'B5_ICCP_RELATION_DIRECTION');await c.registered(relation.target);}
 demand(m.assurance.required.every(x=>m.assurance.achieved.includes(x)),'B5_ICCP_ASSURANCE_HOLD');demand(same(privacy.payload,m)&&same(privacy.source_refs,[...m.object_refs,...m.base_refs,...m.privacy_refs,...m.authority_refs]),'B5_ICCP_PRIVACY_PAYLOAD');await filterPrivacy(c,privacy);
 return m;
}
export class IccpService {
 readonly repository:CanonicalRepository;readonly principal:Identity;#clock:()=>string;
 constructor(repository:CanonicalRepository,principal:Identity,clock:()=>string){this.repository=repository;this.principal=freeze(id(principal,'PRINCIPAL'));this.#clock=clock;}
 async send(input:unknown){const r=record(input,['message','receiver','delivery','privacy']),m=decodeMessage(r.message),receiver=decodeProfile(r.receiver),privacy=decodeDisclosure(r.privacy),delivery=freeze(jsonValue(r.delivery)) as Parameters<typeof encodeWire>[2];demand(privacy.disclose&&same(privacy.recipient,receiver.recipient),'B5_ICCP_EGRESS_RECIPIENT');
  return withCapabilityContext(this.repository,this.principal,this.#clock(),async c=>{await filterMessage(c,m,privacy);const wire=encodeWire(m,receiver,delivery);return {wire,authority_effect:'NONE',current_mutation:false,continuity_ON:false};});
 }
 async receive(input:unknown){const r=record(input,['wire','receiver','privacy']),wire=decodeWire(typeof r.wire==='string'?parseJSON(r.wire):r.wire),receiver=decodeProfile(r.receiver),privacy=decodeDisclosure(r.privacy);
  return withCapabilityContext(this.repository,this.principal,this.#clock(),async c=>{
   demand(same(wire.destination,receiver.recipient)&&same(receiver.recipient,c.principal)&&Date.parse(wire.recorded_at)<=Date.parse(c.as_of)&&Date.parse(wire.expires_at)>Date.parse(c.as_of),'B5_ICCP_DELIVERY_SCOPE_TIME');
   const m=wire.encoding==='DENSE'?fromDense(wire.payload):decodeMessage(wire.payload);negotiate(m,receiver);demand(digest(m)===wire.semantic_digest&&same(m.message,wire.message)&&same(m.occurrence,wire.occurrence)&&same(m.actor,wire.source)&&wire.expires_at===m.temporal.valid_until&&wire.idempotency_key===digest([m.principal,m.occurrence,m.message]),'B5_ICCP_SEMANTIC_BINDING');
   await filterMessage(c,m,privacy);return {meaning:m,as_of:c.as_of,snapshot_digest:c.snapshot_digest,occurrence_key:digest([m.principal,m.occurrence]),message_key:wire.idempotency_key,delivery_attempt:wire.attempt,qualified_observation:false,control:false,current_mutation:false,authority_effect:'NONE',continuity_ON:false};
  });
 }
}
