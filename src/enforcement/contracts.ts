// B3 owns release enforcement; B1 owns identity/time/state and B2 owns Current.
import {createHash} from 'node:crypto';
import {decodeIdentity,sameIdentity,type Identity} from '../semantic-kernel/identity.ts';
import {decodeTemporal,instant,knownAsOf} from '../semantic-kernel/temporal.ts';
import {decodeContinuation,type ContinuationClaim} from '../semantic-kernel/continuation.ts';
import {demand,record,text,version,member,evidence,freeze} from '../semantic-kernel/validation.ts';
import {jsonValue,denseArray} from '../domain/json.ts';
import {canonicalJSON,type CurrentDTO} from '../state/repository.ts';
export const ENFORCEMENT_SCHEMA='IRIS_B3_V1' as const;
export const authorityPredicate=(domain:string)=>canonicalJSON(['IRIS_B3_AUTHORITY_V1',text(domain)]);
export function digest(value:unknown):string{return createHash('sha256').update(canonicalJSON(jsonValue(value))).digest('hex');}
export function sha(value:unknown):string{const s=text(value);demand(/^[a-f0-9]{64}$/.test(s),'SHA256_REQUIRED');return s;}
export function nonnegative(value:unknown):number{demand(Number.isSafeInteger(value)&&(value as number)>=0,'NONNEGATIVE_SAFE_INTEGER_REQUIRED');return value as number;}
function id(value:unknown,kind:Identity['kind']):Identity{const i=decodeIdentity(value);demand(i.kind===kind,'B3_IDENTITY_KIND');return i;}
export interface ReleaseIntent {
 schema_version:typeof ENFORCEMENT_SCHEMA; intent:Identity; principal:Identity; sponsor:Identity; grantee:Identity; incarnation:Identity;
 objective:Identity; obligation:Identity; work_episode:Identity; causal_episode:Identity; occurrence:Identity;
 authority_domain:string; authority_generation:number; authority_policy_id:string; authority_policy_version:number; privacy_policy_id:string; privacy_policy_version:number; delegation_digest:string; lease_id:string; purpose:string; object_refs:string[]; resource_refs:string[];
 capability_id:string; qualification_id:string; configuration_digest:string; role:string; tool_id:string; operation:string;
 arguments:unknown; expected_effect:unknown; effect_class:string; consequence_class:string; value:{currency:string;amount_minor:number}; resources:{units:number;cost_minor:number};
 privacy:{classification:string;recipient:Identity;purpose:string;retention_until:string;minimum_necessary_digest:string;egress:string;reuse:string;transfer:string};
 retry_class:'IDEMPOTENT_BY_KEY'|'READ_ONLY'|'NON_IDEMPOTENT_RECONCILABLE'|'NON_IDEMPOTENT_UNSAFE'; idempotency_key:string;
 temporal:ReturnType<typeof decodeTemporal>; evidence_refs:string[]; provenance_refs:string[]; operation_digest:string;
}
export const INTENT_FIELDS=['schema_version','intent','principal','sponsor','grantee','incarnation','objective','obligation','work_episode','causal_episode','occurrence','authority_domain','authority_generation','authority_policy_id','authority_policy_version','privacy_policy_id','privacy_policy_version','delegation_digest','lease_id','purpose','object_refs','resource_refs','capability_id','qualification_id','configuration_digest','role','tool_id','operation','arguments','expected_effect','effect_class','consequence_class','value','resources','privacy','retry_class','idempotency_key','temporal','evidence_refs','provenance_refs','operation_digest'] as const;
function exactRefs(v:unknown):string[]{const refs=evidence(denseArray(v));demand(new Set(refs).size===refs.length,'DUPLICATE_SCOPE_REF');return refs;}
export function decodeIntent(input:unknown):Readonly<ReleaseIntent>{
 const r=record(input,INTENT_FIELDS);demand(r.schema_version===ENFORCEMENT_SCHEMA,'B3_SCHEMA_REQUIRED');
 const v=record(r.value,['currency','amount_minor']),resources=record(r.resources,['units','cost_minor']);
 const p=record(r.privacy,['classification','recipient','purpose','retention_until','minimum_necessary_digest','egress','reuse','transfer']);
 const incarnation=decodeIdentity(r.incarnation);demand(['WORKER','SUBSTRATE'].includes(incarnation.kind),'INCARNATION_KIND');
 const result:ReleaseIntent={schema_version:ENFORCEMENT_SCHEMA,intent:id(r.intent,'INTENT'),principal:id(r.principal,'PRINCIPAL'),sponsor:id(r.sponsor,'PRINCIPAL'),grantee:id(r.grantee,'WORKER'),incarnation,
 objective:id(r.objective,'OBJECTIVE'),obligation:id(r.obligation,'OBLIGATION'),work_episode:id(r.work_episode,'WORK_EPISODE'),causal_episode:id(r.causal_episode,'CAUSAL_OCCURRENCE'),occurrence:id(r.occurrence,'CAUSAL_OCCURRENCE'),
 authority_domain:text(r.authority_domain),authority_generation:version(r.authority_generation),authority_policy_id:text(r.authority_policy_id),authority_policy_version:version(r.authority_policy_version),privacy_policy_id:text(r.privacy_policy_id),privacy_policy_version:version(r.privacy_policy_version),delegation_digest:sha(r.delegation_digest),lease_id:text(r.lease_id),purpose:text(r.purpose),object_refs:exactRefs(r.object_refs),resource_refs:exactRefs(r.resource_refs),
 capability_id:text(r.capability_id),qualification_id:text(r.qualification_id),configuration_digest:sha(r.configuration_digest),role:text(r.role),tool_id:text(r.tool_id),operation:text(r.operation),arguments:jsonValue(r.arguments),expected_effect:jsonValue(r.expected_effect),effect_class:text(r.effect_class),consequence_class:text(r.consequence_class),
 value:{currency:text(v.currency),amount_minor:nonnegative(v.amount_minor)},resources:{units:nonnegative(resources.units),cost_minor:nonnegative(resources.cost_minor)},
 privacy:{classification:text(p.classification),recipient:id(p.recipient,'PRINCIPAL'),purpose:text(p.purpose),retention_until:instant(p.retention_until),minimum_necessary_digest:sha(p.minimum_necessary_digest),egress:text(p.egress),reuse:text(p.reuse),transfer:text(p.transfer)},
 retry_class:member(r.retry_class,['IDEMPOTENT_BY_KEY','READ_ONLY','NON_IDEMPOTENT_RECONCILABLE','NON_IDEMPOTENT_UNSAFE'] as const),idempotency_key:text(r.idempotency_key),temporal:decodeTemporal(r.temporal),evidence_refs:evidence(denseArray(r.evidence_refs)),provenance_refs:evidence(denseArray(r.provenance_refs)),operation_digest:sha(r.operation_digest)};
 const {operation_digest,...binding}=result;demand(operation_digest===digest(binding),'IMMUTABLE_OPERATION_DIGEST_MISMATCH');
 demand(result.temporal.valid_until!==undefined,'BOUNDED_INTENT_REQUIRED');return freeze(result);
}
export interface AuthorityDocument {
 schema_version:'IRIS_B3_AUTHORITY_V1'; issued_at:string; permission:'ALLOW'|'DENY'|'UNKNOWN'; binding:Omit<ReleaseIntent,'schema_version'|'arguments'|'expected_effect'|'temporal'|'evidence_refs'|'provenance_refs'>;
 release_attempt:Identity; policy_id:string; policy_version:number; privacy_policy_id:string; privacy_policy_version:number;
 latest_generation:number; worker_status:'ACTIVE'|'REPLACED'|'RETIRED'|'UNKNOWN'; worker_temporal:ReturnType<typeof decodeTemporal>;
 qualification:{qualification_id:string;configuration_digest:string;role:string;capability_id:string;tool_id:string;status:'QUALIFIED'|'DENIED'|'UNKNOWN';temporal:ReturnType<typeof decodeTemporal>;evidence_refs:string[]};
 lease:{lease_id:string;issued_at:string;state:'ACTIVE'|'REVOKED'|'EXPIRED'|'SUPERSEDED'|'UNKNOWN';generation:number;temporal:ReturnType<typeof decodeTemporal>;evidence_refs:string[]};
 delegation:{from:Identity;to:Identity;generation:number;permission:'ALLOW'|'DENY'|'UNKNOWN';temporal:ReturnType<typeof decodeTemporal>;evidence_refs:string[]}[];
 privacy_permission:{retain:'ALLOW'|'DENY'|'UNKNOWN';use:'ALLOW'|'DENY'|'UNKNOWN';disclose:'ALLOW'|'DENY'|'UNKNOWN';minimum_necessary:'ALLOW'|'DENY'|'UNKNOWN';temporal:ReturnType<typeof decodeTemporal>;evidence_refs:string[]};
 limits:{currency:string;max_value_minor:number;max_resource_units:number;max_cost_minor:number};
 temporal:ReturnType<typeof decodeTemporal>; evidence_refs:string[];provenance_refs:string[];
}
export function intentBinding(i:ReleaseIntent):AuthorityDocument['binding']{const {schema_version,arguments:a,expected_effect,temporal,evidence_refs,provenance_refs,...binding}=i;return binding;}
export function decodeAuthority(input:unknown):Readonly<AuthorityDocument>{
 const r=record(input,['schema_version','issued_at','permission','binding','release_attempt','policy_id','policy_version','privacy_policy_id','privacy_policy_version','latest_generation','worker_status','worker_temporal','qualification','lease','delegation','privacy_permission','limits','temporal','evidence_refs','provenance_refs']);demand(r.schema_version==='IRIS_B3_AUTHORITY_V1','AUTHORITY_SCHEMA_REQUIRED');
 // Validate binding by its exact coordinate set and values against the already decoded intent at validation time.
 const binding=record(r.binding,INTENT_FIELDS.filter(k=>!['schema_version','arguments','expected_effect','temporal','evidence_refs','provenance_refs'].includes(k)));
 jsonValue(binding);
 const q=record(r.qualification,['qualification_id','configuration_digest','role','capability_id','tool_id','status','temporal','evidence_refs']);
 const l=record(r.lease,['lease_id','issued_at','state','generation','temporal','evidence_refs']);
 const p=record(r.privacy_permission,['retain','use','disclose','minimum_necessary','temporal','evidence_refs']);
 const limits=record(r.limits,['currency','max_value_minor','max_resource_units','max_cost_minor']);
 const permissions=['ALLOW','DENY','UNKNOWN'] as const;
 const delegation=denseArray(r.delegation).map(v=>{const d=record(v,['from','to','generation','permission','temporal','evidence_refs']);return {from:decodeIdentity(d.from),to:decodeIdentity(d.to),generation:version(d.generation),permission:member(d.permission,permissions),temporal:decodeTemporal(d.temporal),evidence_refs:evidence(denseArray(d.evidence_refs))};});
 return freeze({schema_version:'IRIS_B3_AUTHORITY_V1',issued_at:instant(r.issued_at),permission:member(r.permission,permissions),binding:binding as unknown as AuthorityDocument['binding'],release_attempt:id(r.release_attempt,'RELEASE_ATTEMPT'),policy_id:text(r.policy_id),policy_version:version(r.policy_version),privacy_policy_id:text(r.privacy_policy_id),privacy_policy_version:version(r.privacy_policy_version),latest_generation:version(r.latest_generation),worker_status:member(r.worker_status,['ACTIVE','REPLACED','RETIRED','UNKNOWN'] as const),worker_temporal:decodeTemporal(r.worker_temporal),
 qualification:{qualification_id:text(q.qualification_id),configuration_digest:sha(q.configuration_digest),role:text(q.role),capability_id:text(q.capability_id),tool_id:text(q.tool_id),status:member(q.status,['QUALIFIED','DENIED','UNKNOWN'] as const),temporal:decodeTemporal(q.temporal),evidence_refs:evidence(denseArray(q.evidence_refs))},
 lease:{lease_id:text(l.lease_id),issued_at:instant(l.issued_at),state:member(l.state,['ACTIVE','REVOKED','EXPIRED','SUPERSEDED','UNKNOWN'] as const),generation:version(l.generation),temporal:decodeTemporal(l.temporal),evidence_refs:evidence(denseArray(l.evidence_refs))},delegation,
 privacy_permission:{retain:member(p.retain,permissions),use:member(p.use,permissions),disclose:member(p.disclose,permissions),minimum_necessary:member(p.minimum_necessary,permissions),temporal:decodeTemporal(p.temporal),evidence_refs:evidence(denseArray(p.evidence_refs))},
 limits:{currency:text(limits.currency),max_value_minor:nonnegative(limits.max_value_minor),max_resource_units:nonnegative(limits.max_resource_units),max_cost_minor:nonnegative(limits.max_cost_minor)},temporal:decodeTemporal(r.temporal),evidence_refs:evidence(denseArray(r.evidence_refs)),provenance_refs:evidence(denseArray(r.provenance_refs))});
}
export interface ValidatedAuthoritySnapshot {schema_version:typeof ENFORCEMENT_SCHEMA;as_of:string;current_record_id:string;current_version:number;current_digest:string;authority:Readonly<AuthorityDocument>;continuation:Readonly<ContinuationClaim>;intent_digest:string;release_attempt:Identity}
export function validateAuthority(current:CurrentDTO,intentInput:unknown,attemptInput:unknown,claimInput:unknown,at:string,revokedGeneration:number):Readonly<ValidatedAuthoritySnapshot>{
 const i=decodeIntent(intentInput),attempt=id(attemptInput,'RELEASE_ATTEMPT'),claim=decodeContinuation(claimInput);instant(at);
 demand(current.status==='RECORDED_AS_OF'&&current.as_of===at&&sameIdentity(current.principal,i.principal)&&sameIdentity(decodeIdentity(current.subject),i.principal)&&current.predicate===authorityPredicate(i.authority_domain)&&current.record!==null,'AUTHORITY_CURRENT_UNKNOWN');
 const payload=current.record.payload as {value:unknown;epistemic:import('../semantic-kernel/epistemic.ts').EpistemicState};const e=payload.epistemic;
 demand(e.knowledge_state==='KNOWN'&&e.applicability_state==='APPLICABLE'&&e.freshness_state==='CURRENT_AS_OF'&&e.coverage_state==='COMPLETE_FOR_DECLARED_SCOPE'&&e.invalidators.length===0,'AUTHORITY_EPISTEMIC_HOLD');
 const a=decodeAuthority(payload.value);demand(a.permission==='ALLOW','AUTHORITY_NOT_ALLOWED');
 demand(canonicalJSON(a.binding)===canonicalJSON(intentBinding(i))&&sameIdentity(a.release_attempt,attempt),'AUTHORITY_TOTAL_BINDING_MISMATCH');
 demand(i.authority_policy_id===a.policy_id&&i.authority_policy_version===a.policy_version&&i.privacy_policy_id===a.privacy_policy_id&&i.privacy_policy_version===a.privacy_policy_version&&i.delegation_digest===digest(a.delegation),'POLICY_DELEGATION_BINDING_MISMATCH');
 demand(i.authority_generation===a.latest_generation&&i.authority_generation>revokedGeneration,'AUTHORITY_GENERATION_FENCED');
 demand(Date.parse(a.issued_at)<=Date.parse(at)&&Date.parse(a.lease.issued_at)<=Date.parse(at)&&Date.parse(a.issued_at)<=Date.parse(a.lease.issued_at),'FUTURE_OR_UNGOVERNED_ISSUANCE');
 demand(a.worker_status==='ACTIVE','WORKER_NOT_ACTIVE');demand(a.lease.state==='ACTIVE'&&a.lease.lease_id===i.lease_id&&a.lease.generation===i.authority_generation,'LATEST_LEASE_NOT_ACTIVE');
 const q=a.qualification;demand(q.temporal.requalification_at===undefined||Date.parse(q.temporal.requalification_at)>Date.parse(at),'QUALIFICATION_REVIEW_DUE');
 demand(q.status==='QUALIFIED'&&q.qualification_id===i.qualification_id&&q.configuration_digest===i.configuration_digest&&q.role===i.role&&q.capability_id===i.capability_id&&q.tool_id===i.tool_id,'QUALIFICATION_BINDING_MISMATCH');
 for(const t of [current.record.temporal,i.temporal,a.temporal,a.worker_temporal,a.lease.temporal,q.temporal,a.privacy_permission.temporal,claim.temporal])demand(t.valid_until!==undefined&&t.observed_at!==undefined&&(t.occurred_at===undefined||Date.parse(t.occurred_at)<=Date.parse(at))&&knownAsOf(t,at),'AUTHORITY_TEMPORAL_HOLD');
 demand(Date.parse(i.privacy.retention_until)>Date.parse(at),'RETENTION_EXPIRED');
 for(const flag of ['retain','use','disclose','minimum_necessary'] as const)demand(a.privacy_permission[flag]==='ALLOW','PRIVACY_NOT_ALLOWED');
 demand(i.privacy.minimum_necessary_digest===digest(i.arguments),'DISCLOSURE_PAYLOAD_DIGEST_MISMATCH');
 demand(i.privacy.purpose===i.purpose,'PRIVACY_PURPOSE_MISMATCH');
 demand(i.value.currency===a.limits.currency&&i.value.amount_minor<=a.limits.max_value_minor&&i.resources.units<=a.limits.max_resource_units&&i.resources.cost_minor<=a.limits.max_cost_minor,'VALUE_RESOURCE_DENIED');
 demand(a.delegation.length>0,'DELEGATION_REQUIRED');let from=i.sponsor;const seen=new Set<string>([canonicalJSON(i.sponsor)]);
 for(const edge of a.delegation){demand(sameIdentity(edge.from,from)&&edge.permission==='ALLOW'&&edge.generation===i.authority_generation&&edge.temporal.valid_until!==undefined&&edge.temporal.observed_at!==undefined&&(edge.temporal.occurred_at===undefined||Date.parse(edge.temporal.occurred_at)<=Date.parse(at))&&knownAsOf(edge.temporal,at),'DELEGATION_INVALID');const key=canonicalJSON(edge.to);demand(!seen.has(key),'DELEGATION_CYCLE');seen.add(key);from=edge.to;}
 demand(sameIdentity(from,i.grantee),'DELEGATION_GRANTEE_MISMATCH');
 demand(sameIdentity(claim.principal,i.principal)&&sameIdentity(claim.causal_episode,i.causal_episode)&&sameIdentity(claim.owner_incarnation,i.incarnation),'CONTINUATION_OWNER_FENCED');
 return freeze({schema_version:ENFORCEMENT_SCHEMA,as_of:at,current_record_id:current.record.record_id,current_version:current.record.version,current_digest:digest(current.record),authority:a,continuation:claim,intent_digest:i.operation_digest,release_attempt:attempt});
}
