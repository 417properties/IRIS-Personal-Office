import crypto from 'node:crypto';
import type {ARClass,Intervention,PilotCandidate,ResolutionKind} from './pilot001-types.ts';

function rawObligationId(c:PilotCandidate):string|undefined {
  const marker=':obligation:';
  const at=c.id.lastIndexOf(marker);
  if(at>=0){
    const raw=c.id.slice(at+marker.length);
    if(raw) return raw;
  }
  return c.obligation_id;
}

function anchorsFor(c:PilotCandidate,resolution:ResolutionKind):string[]{
  const anchors:string[]=[];
  const obligation=rawObligationId(c);
  if(resolution==='DECIDE'&&c.decision_requirement_id) anchors.push('decision_requirement:'+c.decision_requirement_id);
  if(resolution==='ACT'&&obligation) anchors.push('obligation:'+obligation);
  if(resolution==='AUTHORIZE'){
    if(obligation) anchors.push('obligation:'+obligation);
    if(c.decision_requirement_id) anchors.push('decision_requirement:'+c.decision_requirement_id);
    if(c.conflict_id) anchors.push('conflict:'+c.conflict_id);
  }
  if(resolution==='RECONCILE_EFFECT'){
    if(c.intent_id) anchors.push('intent:'+c.intent_id);
    if(c.conflict_id) anchors.push('conflict:'+c.conflict_id);
  }
  if(resolution==='RESOLVE_CONFLICT'){
    if(c.conflict_id) anchors.push('conflict:'+c.conflict_id);
    else if(obligation) anchors.push('obligation:'+obligation);
    else if(c.decision_requirement_id) anchors.push('decision_requirement:'+c.decision_requirement_id);
    else if(c.intent_id) anchors.push('intent:'+c.intent_id);
  }
  if(!anchors.length&&c.objective_id) anchors.push('objective:'+c.objective_id);
  return [...new Set(anchors)].sort();
}

function missingMaterialARDimension(c:PilotCandidate):boolean {
  return Boolean(c.decision_requirement_id&&c.decision_status==='OPEN'&&(!c.decision_maker_identity_id||c.decision_maker_identity_id==='UNKNOWN'));
}

export function classifyAaron(c:PilotCandidate):{classes:ARClass[];unknown:boolean;omittable:boolean}{
  if(c.principal_id!=='AARON') return {classes:[],unknown:false,omittable:true};
  const unknown=c.applicability==='UNKNOWN'||c.freshness==='UNKNOWN'||c.source_identity==='UNKNOWN'||c.source_identity==='CONFLICT'||missingMaterialARDimension(c);
  if(unknown) return {classes:[],unknown:true,omittable:false};
  if(c.applicability!=='APPLICABLE') return {classes:[],unknown:false,omittable:true};
  const classes:ARClass[]=[];
  if(c.decision_requirement_id&&c.decision_status==='OPEN'&&c.decision_maker_identity_id==='AARON') classes.push('AR-1');
  if(c.obligation_id&&['OPEN','IN_PROGRESS','WAITING','HOLD'].includes(c.obligation_status??'')&&c.obligation_owner==='AARON'&&c.concrete_action_remaining&&!c.informational_only) classes.push('AR-2');
  if(c.reserved_authority_class&&(c.authority_holder_identity_id==='AARON'||c.valid_delegation!==true)) classes.push('AR-3');
  if(c.escalation_required||c.unresolved_effect||c.material_conflict) classes.push('AR-4');
  return {classes,unknown:false,omittable:classes.length===0};
}

function resolutionFor(c:PilotCandidate,classes:ARClass[]):ResolutionKind {
  if(c.unresolved_effect) return 'RECONCILE_EFFECT';
  if(classes.includes('AR-3')) return 'AUTHORIZE';
  if(classes.includes('AR-4')) return 'RESOLVE_CONFLICT';
  if(classes.includes('AR-1')) return 'DECIDE';
  return 'ACT';
}

export function interventionForResolution(c:PilotCandidate,classes:ARClass[],resolution_kind:ResolutionKind,anchorOverride?:string[]):Intervention {
  const anchor_refs=[...new Set(anchorOverride??anchorsFor(c,resolution_kind))].sort();
  const h=crypto.createHash('sha256').update(['pilot001-intervention-v1','AARON',resolution_kind,...anchor_refs].join('|')).digest('hex');
  return {intervention_id:'arq_'+h,ar_classes:[...classes],resolution_kind,anchor_refs,why_aaron_required:c.why??classes.join(','),provenance:[...c.provenance_refs],freshness:c.freshness??'UNKNOWN',uncertainty:[],possible_duplicate_refs:[...(c.possible_duplicate_refs??[])]};
}

export function interventionFor(c:PilotCandidate,classes:ARClass[]):Intervention {
  return interventionForResolution(c,classes,resolutionFor(c,classes));
}

export function sameCanonicalIntervention(a:Intervention,b:Intervention){
  return a.resolution_kind===b.resolution_kind&&JSON.stringify(a.anchor_refs)===JSON.stringify(b.anchor_refs);
}
