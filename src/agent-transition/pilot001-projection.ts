import crypto from 'node:crypto';
import {classifyAaron,interventionFor,interventionForResolution,sameCanonicalIntervention} from './pilot001-classifier.ts';
import {evaluateCoverage,justifiedOmission} from './pilot001-coverage.ts';
import {DEFAULT_COVERAGE_CONTRACT,type ARClass,type Intervention,type PilotCandidate,type PilotProjection,type ResolutionKind,type SourceEvaluation} from './pilot001-types.ts';

function loadBearingDigest(input:{candidates:PilotCandidate[];sources:SourceEvaluation[];conflicts:string[];privacyExcluded:string[]}){
  return crypto.createHash('sha256').update(JSON.stringify({sources:input.sources,candidates:input.candidates,conflicts:input.conflicts,privacyExcluded:input.privacyExcluded})).digest('hex');
}

function mergeExactIntervention(target:Intervention,next:Intervention){
  target.ar_classes=[...new Set([...target.ar_classes,...next.ar_classes])];
  target.provenance=[...new Set([...target.provenance,...next.provenance])];
  target.possible_duplicate_refs=[...new Set([...target.possible_duplicate_refs,...next.possible_duplicate_refs])];
  target.uncertainty=[...new Set([...target.uncertainty,...next.uncertainty])];
}

type Draft={candidate:PilotCandidate;classes:ARClass[];item:Intervention;absorbed?:boolean};

function conflictOnly(c:PilotCandidate):PilotCandidate {
  return {...c,obligation_id:undefined,decision_requirement_id:undefined,intent_id:undefined,obligation_status:undefined,obligation_owner:undefined,concrete_action_remaining:undefined,decision_status:undefined,decision_maker_identity_id:undefined,reserved_authority_class:undefined,authority_holder_identity_id:undefined,valid_delegation:undefined,escalation_required:false,unresolved_effect:false,material_conflict:true};
}

function baseWithoutConflict(c:PilotCandidate):PilotCandidate {
  return {...c,conflict_id:undefined,material_conflict:false,escalation_required:false,unresolved_effect:false};
}

function draftsFor(c:PilotCandidate,classes:ARClass[]):Draft[]{
  if(c.unresolved_effect) return [{candidate:c,classes,item:interventionForResolution(c,classes,'RECONCILE_EFFECT')}];
  if(c.material_conflict&&c.conflict_id&&classes.includes('AR-4')){
    const baseClasses=classes.filter(x=>x!=='AR-4');
    const drafts:Draft[]=[];
    if(baseClasses.length){
      const base=baseWithoutConflict(c);
      drafts.push({candidate:base,classes:baseClasses,item:interventionFor(base,baseClasses)});
    }
    const conflict=conflictOnly(c);
    drafts.push({candidate:conflict,classes:['AR-4'],item:interventionForResolution(conflict,['AR-4'],'RESOLVE_CONFLICT')});
    return drafts;
  }
  return [{candidate:c,classes,item:interventionFor(c,classes)}];
}

function combinedDraft(group:Draft[],resolution:ResolutionKind,extra:Draft[]=[]):Draft {
  const all=[...group,...extra];
  const classes=[...new Set(all.flatMap(x=>x.item.ar_classes))] as ARClass[];
  const anchors=[...new Set(all.flatMap(x=>x.item.anchor_refs))].sort();
  const first=group[0]!;
  const item=interventionForResolution(first.candidate,classes,resolution,anchors);
  item.provenance=[...new Set(all.flatMap(x=>x.item.provenance))];
  item.possible_duplicate_refs=[...new Set(all.flatMap(x=>x.item.possible_duplicate_refs))];
  item.uncertainty=[...new Set(all.flatMap(x=>x.item.uncertainty))];
  item.freshness=all.some(x=>x.item.freshness==='UNKNOWN')?'UNKNOWN':all.some(x=>x.item.freshness==='STALE')?'STALE':'CURRENT';
  return {candidate:first.candidate,classes,item};
}

function consolidateStructuralDrafts(drafts:Draft[]):Draft[]{
  const out:Draft[]=[];
  const used=new Set<Draft>();

  for(const d of drafts){
    if(used.has(d)||d.item.resolution_kind!=='ACT'||!d.candidate.obligation_id) continue;
    const group=drafts.filter(x=>!used.has(x)&&x.item.resolution_kind==='ACT'&&x.candidate.obligation_id===d.candidate.obligation_id&&x.candidate.objective_id===d.candidate.objective_id);
    if(group.length>1){
      group.forEach(x=>used.add(x));
      out.push(combinedDraft(group,'ACT'));
    }
  }

  for(const d of drafts){
    if(used.has(d)||d.item.resolution_kind!=='AUTHORIZE'||!d.candidate.reserved_authority_class) continue;
    const key=[d.candidate.objective_id??'',d.candidate.reserved_authority_class,d.candidate.authority_holder_identity_id??'',String(d.candidate.valid_delegation)].join('|');
    const group=drafts.filter(x=>!used.has(x)&&x.item.resolution_kind==='AUTHORIZE'&&x.candidate.reserved_authority_class&&[x.candidate.objective_id??'',x.candidate.reserved_authority_class,x.candidate.authority_holder_identity_id??'',String(x.candidate.valid_delegation)].join('|')===key);
    const hasObligation=group.some(x=>Boolean(x.candidate.obligation_id));
    const hasDecision=group.some(x=>Boolean(x.candidate.decision_requirement_id));
    if(group.length>1&&hasObligation&&hasDecision){
      const conflicts=drafts.filter(x=>!used.has(x)&&x.item.resolution_kind==='RESOLVE_CONFLICT'&&Boolean(x.candidate.conflict_id)&&!x.candidate.obligation_id&&!x.candidate.decision_requirement_id&&!x.candidate.intent_id&&x.candidate.objective_id===d.candidate.objective_id);
      group.forEach(x=>used.add(x)); conflicts.forEach(x=>used.add(x));
      out.push(combinedDraft(group,'AUTHORIZE',conflicts));
    }
  }

  for(const d of drafts) if(!used.has(d)) out.push(d);
  return out;
}

export function buildProjection(input:{candidates:PilotCandidate[];sources:SourceEvaluation[];conflicts:string[];privacyExcluded:string[];bracket:'STABLE'|'RERUN_STABLE'|'UNSTABLE';started_at:string;emitted_at:string}):PilotProjection{
  const state=evaluateCoverage(input.sources,input.candidates,input.conflicts,input.bracket);
  const drafts:Draft[]=[];const unknown:PilotCandidate[]=[];const omissions:string[]=[];
  for(const c of input.candidates){
    if(c.principal_id!=='AARON') continue;
    const r=classifyAaron(c);
    if(r.unknown){unknown.push(c);continue;}
    if(r.classes.length) drafts.push(...draftsFor(c,r.classes));
    else if(r.omittable&&justifiedOmission(c,state)) omissions.push(c.id);
  }
  const known:Intervention[]=[];
  for(const draft of consolidateStructuralDrafts(drafts)){
    const existing=known.find(item=>sameCanonicalIntervention(item,draft.item));
    if(existing) mergeExactIntervention(existing,draft.item); else known.push(draft.item);
  }
  const digest=loadBearingDigest(input);
  return {projection_id:'pilot001_'+digest.slice(0,16),principal_id:'AARON',coverage_contract_id:DEFAULT_COVERAGE_CONTRACT,scope_name:'WHAT_NEEDS_AARON',scope_version:1,declared_scope:['IRIS_CANONICAL','QUALIFIED_BIG_DELTA'],known_exclusions:['LIVE_GMAIL','LIVE_CALENDAR','AMBIENT','UNQUALIFIED_BIG_CURRENT','OTHER_PRINCIPALS','COMMERCE','REPRESENTATION'],completeness_state:state,snapshot:{started_at:input.started_at,emitted_at:input.emitted_at,dependency_digest:digest,bracket_status:input.bracket},known_aaron_required:known,aaron_relevance_unknown:unknown,unresolved_conflicts:[...input.conflicts],coverage_gaps:state==='COMPLETE_FOR_DECLARED_SCOPE'?[]:['DECLARED_SCOPE_NOT_COMPLETE'],privacy_exclusions:[...input.privacyExcluded],justified_omissions:omissions};
}
