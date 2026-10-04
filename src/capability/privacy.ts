import {B5,CapabilityContext,id,same} from './context.ts';
import {decodeReference,type Reference} from '../domain/canonical.ts';
import {demand,record,text,evidence,freeze,strings} from '../semantic-kernel/validation.ts';
import {denseArray,jsonValue} from '../domain/json.ts';
import {digest,sha} from '../enforcement/contracts.ts';
import {instant} from '../semantic-kernel/temporal.ts';
import type {Identity} from '../semantic-kernel/identity.ts';
export interface DisclosureRequest {policy_id:string;purpose:string;recipient:Identity;classification:string;payload:unknown;source_refs:Reference[];retain:boolean;disclose:boolean}
export function decodeDisclosure(input:unknown):Readonly<DisclosureRequest>{const r=record(input,['policy_id','purpose','recipient','classification','payload','source_refs','retain','disclose']);demand(typeof r.retain==='boolean'&&typeof r.disclose==='boolean','B5_EXPLICIT_PRIVACY_OPERATION');return freeze({policy_id:text(r.policy_id),purpose:text(r.purpose),recipient:id(r.recipient,'PRINCIPAL'),classification:text(r.classification),payload:jsonValue(r.payload),source_refs:denseArray(r.source_refs).map(decodeReference),retain:r.retain,disclose:r.disclose});}
// Evidence truth, retention, use, and disclosure are independent proofs. This
// policy is interpreted from B2 Current; transport/qualification cannot mint it.
export async function filterPrivacy(c:CapabilityContext,input:DisclosureRequest){
 const r=decodeDisclosure(input),source=await c.current(c.principal,'PRIVACY:'+r.policy_id),p=record(source.value,['schema_version','policy_id','purpose','recipient','classification','payload_digest','source_refs','retain','use','disclose','minimum_necessary','allowed_fields','retention_until','reuse','transfer','evidence_refs']);
 demand(p.schema_version===B5&&p.policy_id===r.policy_id&&p.purpose===r.purpose&&same(p.recipient,r.recipient)&&p.classification===r.classification&&sha(p.payload_digest)===digest(r.payload)&&same(denseArray(p.source_refs).map(decodeReference),r.source_refs),'B5_PRIVACY_BINDING');
 for(const field of ['retain','use','disclose','minimum_necessary'])demand(['ALLOW','DENY','UNKNOWN'].includes(text(p[field])),'B5_PRIVACY_VALUE');
 demand(p.use==='ALLOW'&&p.minimum_necessary==='ALLOW'&&(!r.retain||p.retain==='ALLOW')&&(!r.disclose||p.disclose==='ALLOW'),'B5_PRIVACY_DENIED_OR_UNKNOWN');
 demand(Date.parse(instant(p.retention_until))>Date.parse(c.as_of)&&p.reuse==='THIS_PURPOSE_ONLY'&&p.transfer==='NO_TRANSFER','B5_PRIVACY_RETENTION_REUSE');
 const fields=strings(denseArray(p.allowed_fields));demand(r.payload!==null&&typeof r.payload==='object'&&!Array.isArray(r.payload),'B5_PROJECTED_OBJECT_REQUIRED');demand(Object.keys(r.payload).every(k=>fields.includes(k)),'B5_MINIMUM_NECESSARY_VIOLATION');
 await c.registered(r.recipient);for(const ref of r.source_refs)await c.reference(ref);evidence(denseArray(p.evidence_refs));return freeze({policy_ref:c.ref(source.row),payload:r.payload,authority_effect:'NONE'});
}
