// Representation of the accepted IBA clarification BIG #703/5971926463,
// reconciled by STRATA #703/5972224426. This decoder preserves declarations;
// B6 owns the source-qualified boundary selector, B3 owns disclosure authority.
import { decodeIdentity, sameIdentity, type Identity } from '../semantic-kernel/identity.ts';
import { decodeEpistemic, KNOWLEDGE, APPLICABILITY, FRESHNESS, COVERAGE, DISPOSITIONS, type EpistemicState } from '../semantic-kernel/epistemic.ts';
import { decodeLifecycle, LIFECYCLE, DECISION_LIFECYCLE, type LifecycleState } from '../semantic-kernel/lifecycle.ts';
import { instant } from '../semantic-kernel/temporal.ts';
import { demand, evidence, freeze, member, record, strings, text, version } from '../semantic-kernel/validation.ts';
import { denseArray } from './json.ts';
export const ROOT_DISPOSITION_VERSION='IRIS_ROOT_DISPOSITION_V2' as const;
export const REASON_DOMAINS={
 KNOWLEDGE,APPLICABILITY,FRESHNESS,COVERAGE,
 LIFECYCLE:[...LIFECYCLE,...DECISION_LIFECYCLE],
 REQUIREMENT:['REQUIRED','NOT_REQUIRED_PROVEN','UNKNOWN'],HOLDER:KNOWLEDGE,
 DISCLOSURE:['PERMITTED','PROHIBITED','UNKNOWN'],
 REACTIVATION:['REACTIVATION_RECORDED'],INVALIDATOR:['INVALIDATION_RECORDED']
} as const;
export interface CanonicalReason {reason_id:string;reason_type:keyof typeof REASON_DOMAINS;canonical_code:string;evidence_refs:string[]}
export interface RootDispositionV2 {
 schema_version:typeof ROOT_DISPOSITION_VERSION;root_ref:Identity;principal_ref:Identity;version:number;as_of:string;
 boundary_id:string;consumer_class:string;epistemic:EpistemicState;lifecycle:LifecycleState|null;
 requirement:'REQUIRED'|'NOT_REQUIRED_PROVEN'|'UNKNOWN';holder_knowledge_state:typeof KNOWLEDGE[number];holder_ref:Identity|null;
 privacy:{recipient_ref:Identity;purpose_ref:string;disclosure_result:'PERMITTED'|'PROHIBITED'|'UNKNOWN';evidence_refs:string[]};
 primary_visible_disposition:typeof DISPOSITIONS[number];reason_set:CanonicalReason[];visible_reason_projection:string[];
 reactivation_refs:string[];invalidator_refs:string[];provenance_refs:string[];projection_qualification:'NOT_ADJUDICATED';
}
export function decodeReason(value:unknown):Readonly<CanonicalReason>{
 const r=record(value,['reason_id','reason_type','canonical_code','evidence_refs']);const type=member(r.reason_type,Object.keys(REASON_DOMAINS) as (keyof typeof REASON_DOMAINS)[]);
 return freeze({reason_id:text(r.reason_id),reason_type:type,canonical_code:member(r.canonical_code,REASON_DOMAINS[type]),evidence_refs:evidence(denseArray(r.evidence_refs))});
}
export function decodeRootDisposition(value:unknown):Readonly<RootDispositionV2>{
 const r=record(value,['schema_version','root_ref','principal_ref','version','as_of','boundary_id','consumer_class','epistemic','lifecycle','requirement','holder_knowledge_state','holder_ref','privacy','primary_visible_disposition','reason_set','visible_reason_projection','reactivation_refs','invalidator_refs','provenance_refs','projection_qualification']);
 demand(r.schema_version===ROOT_DISPOSITION_VERSION,'UNSUPPORTED_ROOT_DISPOSITION_VERSION');demand(r.projection_qualification==='NOT_ADJUDICATED','B6_PROJECTION_QUALIFICATION_REQUIRED');
 const root=decodeIdentity(r.root_ref),principal=decodeIdentity(r.principal_ref);demand(principal.kind==='PRINCIPAL','PRINCIPAL_KIND');
 const as_of=instant(r.as_of),epistemic=decodeEpistemic(r.epistemic);demand(epistemic.as_of===as_of,'ROOT_REASON_CUT_MISMATCH');
 const life=r.lifecycle===null?null:decodeLifecycle(r.lifecycle);
 demand(!['OBJECTIVE','OBLIGATION','DECISION_REQUIREMENT'].includes(root.kind)||life!==null,'MATERIAL_LIFECYCLE_REQUIRED');
 if(life)demand(sameIdentity(life.object,root)&&sameIdentity(life.principal,principal),'ROOT_LIFECYCLE_BINDING');
 const requirement=member(r.requirement,REASON_DOMAINS.REQUIREMENT),holder=member(r.holder_knowledge_state,KNOWLEDGE),holder_ref=r.holder_ref===null?null:decodeIdentity(r.holder_ref);
 demand(holder!=='KNOWN'||holder_ref!==null,'KNOWN_HOLDER_IDENTITY_REQUIRED');
 const p=record(r.privacy,['recipient_ref','purpose_ref','disclosure_result','evidence_refs']);
 const privacy={recipient_ref:decodeIdentity(p.recipient_ref),purpose_ref:text(p.purpose_ref),disclosure_result:member(p.disclosure_result,REASON_DOMAINS.DISCLOSURE),evidence_refs:evidence(denseArray(p.evidence_refs))};
 const reasons=denseArray(r.reason_set).map(decodeReason);demand(reasons.length>0,'CANONICAL_REASONS_REQUIRED');demand(new Set(reasons.map(x=>x.reason_id)).size===reasons.length,'DUPLICATE_CANONICAL_REASON');
 const projection=strings(denseArray(r.visible_reason_projection));demand(new Set(projection).size===projection.length&&projection.every(id=>reasons.some(x=>x.reason_id===id)),'VISIBLE_REASON_NOT_CANONICAL');
 const reactivation=strings(denseArray(r.reactivation_refs)),invalidators=strings(denseArray(r.invalidator_refs));
 const coordinates:Record<string,unknown>={KNOWLEDGE:epistemic.knowledge_state,APPLICABILITY:epistemic.applicability_state,FRESHNESS:epistemic.freshness_state,COVERAGE:epistemic.coverage_state,LIFECYCLE:life?.state,REQUIREMENT:requirement,HOLDER:holder,DISCLOSURE:privacy.disclosure_result};
 for(const reason of reasons){if(Object.hasOwn(coordinates,reason.reason_type))demand(reason.canonical_code===coordinates[reason.reason_type],'REASON_COORDINATE_DRIFT');else demand(reason.reason_type==='REACTIVATION'?reactivation.length>0:invalidators.length>0,'REASON_BASIS_REQUIRED');}
 const primary=member(r.primary_visible_disposition,DISPOSITIONS);
 if(privacy.disclosure_result==='PROHIBITED'){
  demand(primary==='PRIVACY_EXCLUDED','PRIVACY_PRIMARY_REQUIRED');
  demand(projection.every(id=>reasons.some(x=>x.reason_id===id&&x.reason_type==='DISCLOSURE'&&x.canonical_code==='PROHIBITED')),'PRIVATE_SECONDARY_REASON_LEAK');
 }
 return freeze({schema_version:ROOT_DISPOSITION_VERSION,root_ref:root,principal_ref:principal,version:version(r.version),as_of,boundary_id:text(r.boundary_id),consumer_class:text(r.consumer_class),epistemic,lifecycle:life,requirement,holder_knowledge_state:holder,holder_ref,privacy,primary_visible_disposition:primary,reason_set:reasons,visible_reason_projection:projection,reactivation_refs:reactivation,invalidator_refs:invalidators,provenance_refs:evidence(denseArray(r.provenance_refs)),projection_qualification:'NOT_ADJUDICATED'});
}
