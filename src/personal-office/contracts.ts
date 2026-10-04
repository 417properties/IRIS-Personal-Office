import {decodeIdentity,type Identity} from '../semantic-kernel/identity.ts';
import {decodeReference,type Reference} from '../domain/canonical.ts';
import {denseArray} from '../domain/json.ts';
import {demand,record,text,version,evidence,freeze} from '../semantic-kernel/validation.ts';
import {instant} from '../semantic-kernel/temporal.ts';
export const B6='IRIS_B6_V1' as const;
export const REQUIRED_SOURCES=[
 'pilot001:objectives','pilot001:obligations','pilot001:obligation_governance',
 'pilot001:decision_requirements','pilot001:authority_generation_and_leases',
 'pilot001:unresolved_intents_and_effects','pilot001:applicability_current_assertions',
 'pilot001:qualified_big_quarantine_evidence'
] as const;
export interface PilotRequest {schema_version:typeof B6;principal:Identity;run:Identity;as_of:string;scope_ref:Reference;recovery_scope_version:number;recipient:Identity;purpose:string;boundary_id:string;consumer_class:string}
export function decodePilotRequest(input:unknown):Readonly<PilotRequest>{
 const r=record(input,['schema_version','principal','run','as_of','scope_ref','recovery_scope_version','recipient','purpose','boundary_id','consumer_class']);
 demand(r.schema_version===B6,'B6_CANONICAL_INTERFACE_REQUIRED');const principal=decodeIdentity(r.principal),recipient=decodeIdentity(r.recipient),run=decodeIdentity(r.run);
 demand(principal.kind==='PRINCIPAL'&&recipient.kind==='PRINCIPAL'&&run.kind==='PROJECTION_RUN','B6_IDENTITY_KIND');
 return freeze({schema_version:B6,principal,recipient,run,as_of:instant(r.as_of),scope_ref:decodeReference(r.scope_ref),recovery_scope_version:version(r.recovery_scope_version),purpose:text(r.purpose),boundary_id:text(r.boundary_id),consumer_class:text(r.consumer_class)});
}
export function decodeScope(input:unknown){
 const r=record(input,['schema_version','principal','recipient','purpose','boundary_id','consumer_class','roots','sources','resolutions','equivalences','evidence_refs']);demand(r.schema_version===B6,'B6_SCOPE_VERSION');
 const roots=denseArray(r.roots).map(decodeReference),sources=denseArray(r.sources).map(v=>{const s=record(v,['source_id','reference']);return {source_id:text(s.source_id),reference:decodeReference(s.reference)};});
 demand(roots.length>0&&roots.length<=256&&sources.length===REQUIRED_SOURCES.length,'B6_BOUNDED_REQUIRED_SCOPE');
 demand(REQUIRED_SOURCES.every(id=>sources.filter(s=>s.source_id===id).length===1),'B6_REQUIRED_SOURCE_ROSTER');
 demand(new Set([...roots,...sources.map(s=>s.reference)].map(v=>v.record_id)).size===roots.length+sources.length,'B6_DUPLICATE_SCOPE_ROOT');
 const resolutions=denseArray(r.resolutions).map(decodeReference),equivalences=denseArray(r.equivalences).map(decodeReference);demand(resolutions.length<=256&&equivalences.length<=256,'B6_BOUNDED_RESOLUTIONS');
 return freeze({schema_version:B6,principal:decodeIdentity(r.principal),recipient:decodeIdentity(r.recipient),purpose:text(r.purpose),boundary_id:text(r.boundary_id),consumer_class:text(r.consumer_class),roots,sources,resolutions,equivalences,evidence_refs:evidence(denseArray(r.evidence_refs))});
}
