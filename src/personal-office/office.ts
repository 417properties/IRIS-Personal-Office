// One composition surface; B1–B5 retain their existing semantic ownership.
import {CanonicalPilotService} from './pilot.ts';
import {decodePilotRequest} from './contracts.ts';
import {EnforcementRepository} from '../enforcement/repository.ts';
import {CapabilityService} from '../capability/service.ts';
import {RecoveryService} from '../recovery/service.ts';
import {decodeIdentity,sameIdentity,type Identity} from '../semantic-kernel/identity.ts';
import {demand,record,freeze} from '../semantic-kernel/validation.ts';
export class PersonalOffice {
 readonly principal:Identity;readonly repository:EnforcementRepository;readonly capabilities:CapabilityService;
 constructor(repository:EnforcementRepository,principal:Identity,clock:()=>string){
  demand(repository instanceof EnforcementRepository,'B6_CANONICAL_REPOSITORY_REQUIRED');this.principal=freeze(decodeIdentity(principal));demand(this.principal.kind==='PRINCIPAL','PRINCIPAL_KIND');this.repository=repository;this.capabilities=new CapabilityService(repository.canonical,this.principal,clock);
 }
 attention(input:unknown){const request=decodePilotRequest(input);demand(sameIdentity(request.principal,this.principal),'B6_OFFICE_PRINCIPAL_MISMATCH');return new CanonicalPilotService(this.repository).project(request);}
 async objectives(input:unknown){const view=await this.attention(input);return freeze({...view,items:view.projection.roots.filter(r=>r.root_ref.kind==='OBJECTIVE')});}
 async openObligations(input:unknown){const view=await this.attention(input);return freeze({...view,items:view.projection.roots.filter(r=>r.root_ref.kind==='OBLIGATION'&&['KNOWN_REQUIRED','RELEVANCE_UNKNOWN','CONFLICT_HOLD'].includes(r.primary_visible_disposition))});}
 route(input:unknown){return this.capabilities.route(input);}
 reconstruct(as_of:string){return new RecoveryService(this.repository).reconstruct(this.principal,as_of);}
}
// Frozen E1 remains reference-only. A future STRATA-owned conformance binding
// may adapt representations to this interface; caller labels/badges are never
// inputs to classification and this interface supplies neither scores nor ON.
export function candidateInterface(office:PersonalOffice,input:unknown){
 demand(office instanceof PersonalOffice,'B6_PERSONAL_OFFICE_REQUIRED');const r=record(input,['interface_version','operation','request']);demand(r.interface_version==='IRIS_CANONICAL_PILOT_B6_V1'&&r.operation==='GET_PERSONAL_ATTENTION','B6_CANDIDATE_INTERFACE_HOLD');return office.attention(r.request);
}
