import type {PilotCandidate,SourceEvaluation} from '../../../src/agent-transition/pilot001-types.ts';

export const REQUIRED_SOURCE_IDS = [
  'pilot001:objectives',
  'pilot001:obligations',
  'pilot001:obligation_governance',
  'pilot001:decision_requirements',
  'pilot001:authority_generation_and_leases',
  'pilot001:unresolved_intents_and_effects',
  'pilot001:applicability_current_assertions',
  'pilot001:qualified_big_quarantine_evidence'
] as const;

export const ALLOWED_MISSING_DIMENSIONS = new Set([
  'DUPLICATE_CANONICAL_IDENTITY','REQUIRED_OBLIGATION_SOURCE','CURRENT_OBJECTIVE_FRESHNESS',
  'OBJECTIVE_SOURCE_APPLICABILITY','OBLIGATION_OWNER','AARON_RELEVANCE','AUTHORITY_HOLDER',
  'NONMATERIAL_OBJECTIVE_DETAIL','REQUIRED_AUTHORITY_STATE','STABLE_DEPENDENCY_BRACKET'
]);

const EXPECTED_SOURCE_IDS = ['src_objective','src_obligation','src_authority','src_effect'] as const;
const EXPECTED_SOURCE_CLASSES = new Set(['OBJECTIVE_STATE','OBLIGATION_STATE','AUTHORITY_STATE','EFFECT_STATE']);
const IDENTITY = new Set(['VERIFIED','UNKNOWN','CONFLICT']);
const APPLICABILITY = new Set(['APPLICABLE','INAPPLICABLE','UNKNOWN']);
const AVAILABILITY = new Set(['PRESENT','PARTIAL','MISSING']);
const FRESHNESS = new Set(['CURRENT','STALE','UNKNOWN']);
const CONFLICT_TYPES = new Set(['INCOMPATIBLE_OBLIGATIONS','INCOMPATIBLE_CURRENT_STATE','AUTHORITY_CONFLICT','EFFECT_REALITY_CONFLICT','SOURCE_IDENTITY_CONFLICT','POSSIBLE_DUPLICATE_UNRESOLVED']);

type Raw = Record<string, any>;
type Spec = Raw & { _kind:string; _raw_ref?:string; _health_refs:string[] };

function fail(message:string):never { throw new Error('BINDING_ERROR: '+message); }
function array(value:any,name:string):any[]{ if(!Array.isArray(value)) fail(name+' must be array'); return value; }
function nonemptyString(value:any,name:string):string { if(typeof value!=='string'||!value) fail(name+' must be nonempty string'); return value; }
function sortedUnique(values:string[]):string[]{ return [...new Set(values)].sort(); }

export function normalizeIdentity(value:unknown):string {
  if(value===null) return 'UNKNOWN';
  if(typeof value!=='string') fail('identity must be string or null');
  return value==='principal_aaron'?'AARON':value;
}

function validateSourceEnvelope(source:Raw){
  if(!EXPECTED_SOURCE_CLASSES.has(source.source_class)) fail('unknown source_class '+String(source.source_class));
  if(!IDENTITY.has(source.identity_status)) fail('unknown identity_status '+String(source.identity_status));
  if(!APPLICABILITY.has(source.applicability)) fail('unknown source applicability '+String(source.applicability));
  if(!AVAILABILITY.has(source.availability)) fail('unknown source availability '+String(source.availability));
  if(!FRESHNESS.has(source.freshness_status)) fail('unknown source freshness '+String(source.freshness_status));
  array(source.provenance_refs,'source.provenance_refs');
  if(source.provenance_refs.some((x:any)=>typeof x!=='string'||!x)) fail('invalid source provenance');
}

function sourceMap(c:Raw):Map<string,Raw>{
  const sources=array(c.sources,'sources');
  const map=new Map<string,Raw>();
  for(const source of sources){
    validateSourceEnvelope(source);
    if(!EXPECTED_SOURCE_IDS.includes(source.source_id)) fail('unknown source_id '+String(source.source_id));
    if(map.has(source.source_id)) fail('duplicate source envelope '+source.source_id);
    map.set(source.source_id,source);
  }
  for(const id of EXPECTED_SOURCE_IDS) if(!map.has(id)) fail('missing source envelope '+id);
  return map;
}

function refsForTarget(c:Raw,target:string):string[]{
  const refs:string[]=[];
  const pushRefs=(v:any)=>{ for(const ref of array(v??[],'source_refs')) refs.push(nonemptyString(ref,'source_ref')); };
  if(target==='pilot001:objectives') pushRefs(c.objective?.source_refs);
  if(target==='pilot001:obligations') for(const o of array(c.obligations,'obligations')) pushRefs(o.source_refs);
  if(target==='pilot001:obligation_governance'){
    for(const o of array(c.obligations,'obligations')) pushRefs(o.source_refs);
    for(const d of array(c.decision_requirements,'decision_requirements')) pushRefs(d.source_refs);
    pushRefs(c.authority_state?.source_refs); pushRefs(c.escalation?.source_refs);
  }
  if(target==='pilot001:decision_requirements') for(const d of array(c.decision_requirements,'decision_requirements')) pushRefs(d.source_refs);
  if(target==='pilot001:authority_generation_and_leases') pushRefs(c.authority_state?.source_refs);
  if(target==='pilot001:unresolved_intents_and_effects') pushRefs(c.effect_state?.source_refs);
  if(target==='pilot001:applicability_current_assertions'){
    pushRefs(c.objective?.source_refs);
    for(const o of array(c.obligations,'obligations')) pushRefs(o.source_refs);
    for(const a of array(c.current_assertions,'current_assertions')) refs.push(nonemptyString(a.source_ref,'current_assertion.source_ref'));
  }
  return refs;
}

function normalPrincipalMatch(c:Raw):boolean {
  return c.privacy?.access_basis==='SAME_PRINCIPAL' &&
    c.privacy?.disclosure_state==='PERMITTED_FOR_FIXTURE' &&
    c.objective?.principal_id==='principal_aaron';
}

function reduceRequiredSource(c:Raw,target:string,parentIds:string[],map:Map<string,Raw>):SourceEvaluation {
  const parents=parentIds.map(id=>map.get(id)!);
  const present=!parents.some(s=>s.availability==='MISSING');
  const identity=parents.some(s=>s.identity_status==='CONFLICT')?'CONFLICT':
    parents.some(s=>s.identity_status==='UNKNOWN')?'UNKNOWN':'VERIFIED';
  const applicability=parents.some(s=>s.applicability==='UNKNOWN')?'UNKNOWN':
    parents.every(s=>s.applicability==='INAPPLICABLE'&&s.provenance_refs.length>0)?'INAPPLICABLE':'APPLICABLE';
  const freshness=parents.some(s=>s.freshness_status==='UNKNOWN')?'UNKNOWN':
    parents.some(s=>s.freshness_status==='STALE')?'STALE':'CURRENT';

  const refs=refsForTarget(c,target);
  let provenance_ok=present && parents.every(s=>s.provenance_refs.length>0);
  for(const ref of refs){
    const source=map.get(ref);
    if(!source||source.availability==='MISSING'||!Array.isArray(source.provenance_refs)||source.provenance_refs.length===0) provenance_ok=false;
  }

  let partial=parents.some(s=>s.availability==='PARTIAL');
  const missing=new Set(array(c.missing_dimensions,'missing_dimensions'));
  if(target==='pilot001:obligations'&&missing.has('DUPLICATE_CANONICAL_IDENTITY')) partial=true;
  if(target==='pilot001:obligation_governance'&&['OBLIGATION_OWNER','AARON_RELEVANCE','AUTHORITY_HOLDER'].some(x=>missing.has(x))) partial=true;
  if(target==='pilot001:authority_generation_and_leases'&&missing.has('AUTHORITY_HOLDER')) partial=true;
  if((target==='pilot001:objectives'||target==='pilot001:applicability_current_assertions')&&missing.has('NONMATERIAL_OBJECTIVE_DETAIL')){
    partial=parents.some(s=>s.availability==='PARTIAL'&&s.source_id!=='src_objective');
  }

  const result={} as SourceEvaluation;
  result.source_id=target;
  result.required=true;
  result.present=present;
  result.principal_match=normalPrincipalMatch(c);
  result.identity=identity as SourceEvaluation['identity'];
  result.applicability=applicability as SourceEvaluation['applicability'];
  result.freshness=freshness as SourceEvaluation['freshness'];
  result.provenance_ok=provenance_ok;
  result.partial=partial;
  return result;
}

function qualifiedBigSource(c:Raw):SourceEvaluation {
  const packets=array(c.qualified_big_inputs,'qualified_big_inputs');
  let present=true, principal_match=true, identity:'VERIFIED'|'UNKNOWN'|'CONFLICT'='VERIFIED';
  let applicability:'APPLICABLE'|'INAPPLICABLE'|'UNKNOWN'='APPLICABLE';
  let freshness:'CURRENT'|'STALE'|'UNKNOWN'='CURRENT';
  let provenance_ok=true, partial=false;

  if(packets.length){
    freshness='CURRENT';
    for(const packet of packets){
      if(packet.qualification_state!=='QUALIFIED_BOUNDED') { identity='UNKNOWN'; provenance_ok=false; }
      if(!Array.isArray(packet.provenance_refs)||packet.provenance_refs.length===0||packet.provenance_refs.some((x:any)=>typeof x!=='string'||!x)) provenance_ok=false;
      if(!Array.isArray(packet.allowed_fields)||packet.allowed_fields.some((x:any)=>typeof x!=='string')) provenance_ok=false;
      let packetFresh:'CURRENT'|'STALE'|'UNKNOWN'='UNKNOWN';
      if(typeof packet.valid_through==='string'){
        const until=Date.parse(packet.valid_through), at=Date.parse(c.fixture_time);
        if(Number.isFinite(until)&&Number.isFinite(at)) packetFresh=at<=until?'CURRENT':'STALE';
      } else if(typeof packet.source_max_age_seconds==='number'&&typeof packet.observed_at==='string'){
        const observed=Date.parse(packet.observed_at), at=Date.parse(c.fixture_time);
        if(Number.isFinite(observed)&&Number.isFinite(at)&&Number.isFinite(packet.source_max_age_seconds)){
          packetFresh=(at-observed)<=packet.source_max_age_seconds*1000?'CURRENT':'STALE';
        }
      }
      if(packetFresh==='UNKNOWN') freshness='UNKNOWN';
      else if(packetFresh==='STALE'&&freshness!=='UNKNOWN') freshness='STALE';
    }
  }
  const result={} as SourceEvaluation;
  result.source_id='pilot001:qualified_big_quarantine_evidence';
  result.required=true;
  result.present=present;
  result.principal_match=principal_match;
  result.identity=identity;
  result.applicability=applicability;
  result.freshness=freshness;
  result.provenance_ok=provenance_ok;
  result.partial=partial;
  return result;
}

function health(c:Raw,refs:string[],map:Map<string,Raw>,rootApplicability='APPLICABLE'){
  const envs=sortedUnique(refs).map(ref=>map.get(ref)??fail('unresolved source_ref '+ref));
  const missing=envs.some(s=>s.availability==='MISSING');
  const source_identity=missing?'UNKNOWN':envs.some(s=>s.identity_status==='CONFLICT')?'CONFLICT':envs.some(s=>s.identity_status==='UNKNOWN')?'UNKNOWN':'VERIFIED';
  const applicability=missing||rootApplicability==='UNKNOWN'||envs.some(s=>s.applicability==='UNKNOWN'||s.identity_status!=='VERIFIED')?'UNKNOWN':rootApplicability;
  const freshness=missing||envs.some(s=>s.freshness_status==='UNKNOWN')?'UNKNOWN':envs.some(s=>s.freshness_status==='STALE')?'STALE':'CURRENT';
  const provenance_refs=sortedUnique(envs.filter(s=>s.availability!=='MISSING').flatMap(s=>s.provenance_refs));
  return {source_identity,applicability,freshness,provenance_refs};
}

function authorityContext(c:Raw,map:Map<string,Raw>,explicitReserved:any){
  const state=c.authority_state??fail('authority_state missing');
  const authoritySource=map.get('src_authority')!;
  let reserved=explicitReserved??state.reserved_authority_class??undefined;
  if(explicitReserved!==null&&explicitReserved!==undefined&&state.reserved_authority_class!==null&&state.reserved_authority_class!==undefined&&explicitReserved!==state.reserved_authority_class){
    fail('contradictory reserved authority classes');
  }
  if(!reserved) return {reserved:undefined,holder:undefined,delegation:undefined,refs:[] as string[]};
  const refs=array(state.source_refs,'authority_state.source_refs').map((x:any)=>nonemptyString(x,'authority source_ref'));
  if(authoritySource.availability==='MISSING') return {reserved,holder:'UNKNOWN',delegation:undefined,refs};
  let holder='UNKNOWN';
  if(state.authority_holder_status==='VERIFIED') holder=normalizeIdentity(state.authority_holder_identity_id);
  else if(!['UNKNOWN','CONFLICTING'].includes(state.authority_holder_status)) fail('unknown authority_holder_status '+String(state.authority_holder_status));
  let delegation:boolean|undefined;
  if(state.matching_current_delegation==='ABSENT') delegation=false;
  else if(typeof state.matching_current_delegation==='string'&&state.matching_current_delegation.startsWith('VALID_')) delegation=true;
  else if(!['UNKNOWN','CONFLICTING_RECORDS'].includes(state.matching_current_delegation)) fail('unknown delegation token '+String(state.matching_current_delegation));
  return {reserved,holder,delegation,refs};
}

function finalize(spec:Spec):PilotCandidate {
  const c={} as PilotCandidate;
  c.id=spec.id; c.principal_id=spec.principal_id;
  if(spec.objective_id!==undefined)c.objective_id=spec.objective_id;
  if(spec.obligation_id!==undefined)c.obligation_id=spec.obligation_id;
  if(spec.decision_requirement_id!==undefined)c.decision_requirement_id=spec.decision_requirement_id;
  if(spec.intent_id!==undefined)c.intent_id=spec.intent_id;
  if(spec.conflict_id!==undefined)c.conflict_id=spec.conflict_id;
  if(spec.obligation_status!==undefined)c.obligation_status=spec.obligation_status;
  if(spec.obligation_owner!==undefined)c.obligation_owner=spec.obligation_owner;
  if(spec.concrete_action_remaining!==undefined)c.concrete_action_remaining=spec.concrete_action_remaining;
  if(spec.decision_status!==undefined)c.decision_status=spec.decision_status;
  if(spec.decision_maker_identity_id!==undefined)c.decision_maker_identity_id=spec.decision_maker_identity_id;
  if(spec.reserved_authority_class!==undefined)c.reserved_authority_class=spec.reserved_authority_class;
  if(spec.authority_holder_identity_id!==undefined)c.authority_holder_identity_id=spec.authority_holder_identity_id;
  if(spec.valid_delegation!==undefined)c.valid_delegation=spec.valid_delegation;
  c.escalation_required=Boolean(spec.escalation_required);
  c.unresolved_effect=Boolean(spec.unresolved_effect);
  c.material_conflict=Boolean(spec.material_conflict);
  c.informational_only=Boolean(spec.informational_only);
  c.applicability=spec.applicability;
  c.freshness=spec.freshness;
  c.source_identity=spec.source_identity;
  c.provenance_refs=[...spec.provenance_refs];
  c.possible_duplicate_refs=[...(spec.possible_duplicate_refs??[])];
  return c;
}

function applyAuthority(spec:Spec,c:Raw,map:Map<string,Raw>,explicitReserved:any){
  const a=authorityContext(c,map,explicitReserved);
  if(a.reserved!==undefined){
    spec.reserved_authority_class=a.reserved;
    spec.authority_holder_identity_id=a.holder;
    if(a.delegation!==undefined) spec.valid_delegation=a.delegation;
    spec._health_refs.push(...a.refs);
  }
}

function normalRoots(c:Raw,map:Map<string,Raw>):Spec[]{
  const specs:Spec[]=[];
  const objectiveId=nonemptyString(c.objective?.objective_id,'objective_id');
  const principal=normalizeIdentity(c.objective?.principal_id);
  for(const o of array(c.obligations,'obligations')){
    const rawId=nonemptyString(o.obligation_id,'obligation_id');
    const canonical=typeof o.canonical_anchor_id==='string'&&o.canonical_anchor_id?o.canonical_anchor_id:rawId;
    const refs=array(o.source_refs,'obligation.source_refs').map((x:any)=>nonemptyString(x,'obligation source_ref'));
    const spec:Spec={_kind:'obligation',_raw_ref:rawId,_health_refs:[...refs],id:`e1:${c.case_id}:obligation:${rawId}`,principal_id:principal,objective_id:objectiveId,obligation_id:canonical,
      obligation_status:nonemptyString(o.state,'obligation state'),obligation_owner:o.owner_identity_id===null?'UNKNOWN':normalizeIdentity(o.owner_identity_id),
      concrete_action_remaining:['OPEN','IN_PROGRESS','WAITING','HOLD','BLOCKED'].includes(o.state)&&typeof o.required_action_kind==='string'&&o.required_action_kind.length>0&&!o.informational_only,
      informational_only:Boolean(o.informational_only),escalation_required:false,unresolved_effect:false,material_conflict:false,possible_duplicate_refs:[]};
    applyAuthority(spec,c,map,null);
    const h=health(c,spec._health_refs,map,o.applicability);
    Object.assign(spec,h);
    specs.push(spec);
  }
  for(const d of array(c.decision_requirements,'decision_requirements')){
    const id=nonemptyString(d.decision_requirement_id,'decision_requirement_id');
    const refs=array(d.source_refs,'decision.source_refs').map((x:any)=>nonemptyString(x,'decision source_ref'));
    const spec:Spec={_kind:'decision',_raw_ref:id,_health_refs:[...refs],id:`e1:${c.case_id}:decision:${id}`,principal_id:'AARON',objective_id:objectiveId,
      decision_requirement_id:id,decision_status:nonemptyString(d.status,'decision status'),
      decision_maker_identity_id:d.decision_maker_identity_id===null?'UNKNOWN':normalizeIdentity(d.decision_maker_identity_id),
      informational_only:false,escalation_required:false,unresolved_effect:false,material_conflict:false,possible_duplicate_refs:[]};
    applyAuthority(spec,c,map,d.reserved_authority_class);
    const h=health(c,spec._health_refs,map,'APPLICABLE');
    Object.assign(spec,h);
    specs.push(spec);
  }
  if(c.effect_state?.reconciliation_state!=='NO_EXTERNAL_EFFECT'){
    for(const intent of array(c.effect_state?.intents,'effect_state.intents')){
      const id=nonemptyString(intent.intent_id,'intent_id');
      const refs=array(c.effect_state.source_refs,'effect source_refs').map((x:any)=>nonemptyString(x,'effect source_ref'));
      const h=health(c,refs,map,'APPLICABLE');
      specs.push({_kind:'intent',_raw_ref:id,_health_refs:refs,id:`e1:${c.case_id}:intent:${id}`,principal_id:'AARON',objective_id:objectiveId,intent_id:id,
        escalation_required:false,unresolved_effect:true,material_conflict:false,informational_only:false,possible_duplicate_refs:[],...h});
    }
    if(specs.filter(s=>s._kind==='intent').length===0) fail('unresolved effect without deterministic intent');
  }
  return specs;
}

function boundedPacketRoots(c:Raw,bigSource:SourceEvaluation):Spec[]{
  const packets=array(c.qualified_big_inputs,'qualified_big_inputs');
  const allowed=new Set(packets.flatMap((p:any)=>array(p.allowed_fields,'allowed_fields')));
  const provenance=sortedUnique(packets.flatMap((p:any)=>array(p.provenance_refs,'packet provenance_refs')));
  const specs:Spec[]=[];
  if(allowed.has('decision_requirement_id')){
    for(const d of array(c.decision_requirements,'decision_requirements')){
      const id=nonemptyString(d.decision_requirement_id,'bounded decision_requirement_id');
      specs.push({_kind:'decision',_raw_ref:id,_health_refs:[],id:`e1:${c.case_id}:decision:${id}`,principal_id:'AARON',decision_requirement_id:id,
        escalation_required:false,unresolved_effect:false,material_conflict:false,informational_only:false,applicability:'UNKNOWN',
        freshness:bigSource.freshness,source_identity:bigSource.identity,provenance_refs:provenance,possible_duplicate_refs:[]});
    }
  }
  return specs;
}

function applyDuplicates(c:Raw,specs:Spec[]){
  const obligations=new Map(specs.filter(s=>s._kind==='obligation').map(s=>[s._raw_ref!,s]));
  for(const d of array(c.duplicate_candidates,'duplicate_candidates')){
    const refs=array(d.record_refs,'duplicate record_refs').map((x:any)=>nonemptyString(x,'duplicate record_ref'));
    const roots=refs.map((r:string)=>obligations.get(r)??fail('duplicate record_ref not obligation '+r));
    const state=d.identity_evidence_state;
    if(state==='EXACT_CANONICAL_ANCHOR_MATCH'||state==='SHARED_CANONICAL_ANCHOR_DIFFERENT_EXPRESSION'){
      const anchors=roots.map(r=>r.obligation_id);
      if(!anchors[0]||!anchors.every(a=>a===anchors[0])) fail('shared duplicate anchor mismatch');
    } else if(state==='SIMILAR_TEXT_DISTINCT_CANONICAL_ANCHORS'){
      if(new Set(roots.map(r=>r.obligation_id)).size!==roots.length) fail('distinct duplicate anchors not distinct');
    } else if(state==='UNCERTAIN_NO_CANONICAL_ANCHOR'){
      for(const root of roots) root.possible_duplicate_refs=refs.filter((r:string)=>r!==root._raw_ref).sort();
    } else fail('unknown duplicate identity state '+String(state));
  }
}

function conflictRefs(c:Raw,type:string,conflict:Raw):string[]{
  if(type==='INCOMPATIBLE_OBLIGATIONS'||type==='POSSIBLE_DUPLICATE_UNRESOLVED') return ['src_obligation'];
  if(type==='AUTHORITY_CONFLICT') return ['src_authority'];
  if(type==='EFFECT_REALITY_CONFLICT') return ['src_effect'];
  if(type==='INCOMPATIBLE_CURRENT_STATE'){
    const wanted=new Set(array(conflict.assertion_refs,'conflict assertion_refs'));
    const refs=array(c.current_assertions,'current_assertions').filter((a:any)=>wanted.has(a.assertion_id)).map((a:any)=>nonemptyString(a.source_ref,'current assertion source_ref'));
    if(!refs.length) fail('current-state conflict has no referenced current assertion');
    return refs;
  }
  if(type==='SOURCE_IDENTITY_CONFLICT') return array(conflict.assertion_refs,'source identity refs').filter((x:any)=>typeof x==='string');
  fail('unknown conflict type '+type);
}

function applyConflicts(c:Raw,specs:Spec[],map:Map<string,Raw>):string[]{
  const unresolved:string[]=[];
  const receipts=new Map(array(c.effect_state?.receipts??[],'receipts').map((r:any)=>[r.receipt_id,r.intent_id]));
  for(const conflict of array(c.conflicts,'conflicts')){
    if(!CONFLICT_TYPES.has(conflict.type)) fail('unknown conflict type '+String(conflict.type));
    if(conflict.state!=='UNRESOLVED') fail('unknown/nonmaterial conflict state '+String(conflict.state));
    const id=nonemptyString(conflict.conflict_id,'conflict_id'); unresolved.push(id);
    const matched=new Set<Spec>();
    for(const ref of array(conflict.assertion_refs,'conflict assertion_refs')){
      let resolved=ref;
      if(receipts.has(ref)) resolved=receipts.get(ref);
      for(const spec of specs) if(spec._raw_ref===resolved) matched.add(spec);
    }
    if(matched.size===0){
      const refs=conflictRefs(c,conflict.type,conflict);
      const h=health(c,refs,map,'APPLICABLE');
      specs.push({_kind:'conflict',_raw_ref:id,_health_refs:refs,id:`e1:${c.case_id}:conflict:${id}`,principal_id:'AARON',
        objective_id:c.objective?.objective_id,conflict_id:id,escalation_required:false,unresolved_effect:false,material_conflict:true,informational_only:false,
        possible_duplicate_refs:[],...h});
    }else{
      for(const spec of matched){
        if(spec.conflict_id&&spec.conflict_id!==id) fail('single root requires more than one conflict_id');
        spec.conflict_id=id; spec.material_conflict=true;
      }
    }
  }
  return unresolved;
}

function escalationTargets(c:Raw,specs:Spec[]):Spec[]{
  const esc=c.escalation??fail('escalation missing');
  if(esc.state==='NOT_REQUIRED') return [];
  if(esc.state!=='REQUIRED_OPEN') fail('unknown escalation state '+String(esc.state));
  const target=normalizeIdentity(esc.target_identity_id);
  if(target!=='AARON'){
    if(target==='UNKNOWN'){
      const roots=specs.filter(s=>s._kind==='obligation'||s._kind==='decision');
      if(roots.length!==1) fail('unknown escalation target has ambiguous affected root');
      roots[0].applicability='UNKNOWN';
    }
    return [];
  }
  if(esc.reason_class==='MATERIAL_AUTHORITY_AMBIGUITY'){
    const ids=array(c.conflicts,'conflicts').filter((x:any)=>x.type==='AUTHORITY_CONFLICT'&&x.state==='UNRESOLVED').map((x:any)=>x.conflict_id);
    if(ids.length!==1) fail('authority escalation lacks exactly one AUTHORITY_CONFLICT');
    return specs.filter(s=>s.conflict_id===ids[0]);
  }
  if(esc.reason_class==='INCOMPATIBLE_INSTRUCTIONS'){
    const ids=array(c.conflicts,'conflicts').filter((x:any)=>x.type==='INCOMPATIBLE_OBLIGATIONS'&&x.state==='UNRESOLVED').map((x:any)=>x.conflict_id);
    if(ids.length!==1) fail('instruction escalation lacks exactly one INCOMPATIBLE_OBLIGATIONS conflict');
    return specs.filter(s=>s.conflict_id===ids[0]);
  }
  const roots=specs.filter(s=>s._kind==='obligation'||s._kind==='decision');
  if(roots.length!==1) fail('escalation has no deterministic single target root');
  return roots;
}

function validateCase(c:Raw){
  if(c.case_version!=='1.0') fail('unknown case_version '+String(c.case_version));
  nonemptyString(c.case_id,'case_id'); nonemptyString(c.fixture_time,'fixture_time');
  if(c.declared_scope?.principal_id!=='principal_aaron'||c.principal_identity?.principal_id!=='principal_aaron'||c.principal_identity?.identity_status!=='VERIFIED') fail('declared principal identity mismatch');
  for(const dim of array(c.missing_dimensions,'missing_dimensions')) if(!ALLOWED_MISSING_DIMENSIONS.has(dim)) fail('unknown missing_dimension '+String(dim));
  if(!['SAME_PRINCIPAL','NO_CROSS_PRINCIPAL_AUTHORIZATION','EXPLICIT_BOUNDED_PACKET_AUTHORIZATION'].includes(c.privacy?.access_basis)) fail('unknown privacy access basis');
}

function bracket(c:Raw):'STABLE'|'RERUN_STABLE'|'UNSTABLE'{
  const b=c.coverage_inputs?.dependency_bracket??fail('dependency bracket missing');
  if(typeof b.initial_digest!=='string'||!b.initial_digest||typeof b.final_digest!=='string'||!b.final_digest||!Number.isInteger(b.rerun_count)||b.rerun_count<0) fail('malformed dependency bracket');
  if(array(c.missing_dimensions,'missing_dimensions').includes('STABLE_DEPENDENCY_BRACKET')) return 'UNSTABLE';
  if(b.rerun_count===0) return b.initial_digest===b.final_digest?'STABLE':fail('zero-rerun digest drift');
  if(b.rerun_count===1) return 'RERUN_STABLE';
  return 'UNSTABLE';
}

export function decodeFrozenE1Case(c:Raw){
  validateCase(c);
  const map=sourceMap(c);
  const sources:SourceEvaluation[]=[
    reduceRequiredSource(c,'pilot001:objectives',['src_objective'],map),
    reduceRequiredSource(c,'pilot001:obligations',['src_obligation'],map),
    reduceRequiredSource(c,'pilot001:obligation_governance',['src_obligation','src_authority'],map),
    reduceRequiredSource(c,'pilot001:decision_requirements',['src_obligation'],map),
    reduceRequiredSource(c,'pilot001:authority_generation_and_leases',['src_authority'],map),
    reduceRequiredSource(c,'pilot001:unresolved_intents_and_effects',['src_effect'],map),
    reduceRequiredSource(c,'pilot001:applicability_current_assertions',['src_objective','src_obligation'],map),
    qualifiedBigSource(c)
  ];

  let specs:Spec[]=[]; const privacyExcluded:string[]=[]; const privacyRedactions:any[]=[];
  if(c.privacy.access_basis==='NO_CROSS_PRINCIPAL_AUTHORIZATION'){
    privacyExcluded.push('objective:'+nonemptyString(c.objective?.objective_id,'objective_id'));
    privacyRedactions.push({record_group:c.objective.objective_id,basis:'NO_CROSS_PRINCIPAL_AUTHORIZATION'});
  } else if(c.privacy.access_basis==='EXPLICIT_BOUNDED_PACKET_AUTHORIZATION'){
    specs=boundedPacketRoots(c,sources[7]);
    privacyRedactions.push({record_group:c.objective?.objective_id,basis:'EXPLICIT_BOUNDED_PACKET_AUTHORIZATION',allowed_fields:sortedUnique(array(c.qualified_big_inputs,'qualified_big_inputs').flatMap((p:any)=>p.allowed_fields??[]))});
  } else {
    specs=normalRoots(c,map);
    applyDuplicates(c,specs);
  }

  const unresolved=applyConflicts(c,specs,map);
  for(const target of escalationTargets(c,specs)) target.escalation_required=true;

  const candidates=specs.map(finalize);
  const input:any={};
  input.candidates=candidates;
  input.sources=sources;
  input.conflicts=unresolved;
  input.privacyExcluded=privacyExcluded;
  input.bracket=bracket(c);
  input.started_at=c.fixture_time;
  input.emitted_at=c.fixture_time;

  const trace={
    source_to_target_mappings: sources.map(s=>({source_id:s.source_id,present:s.present,principal_match:s.principal_match,identity:s.identity,applicability:s.applicability,freshness:s.freshness,provenance_ok:s.provenance_ok,partial:s.partial})),
    raw_to_canonical_obligation_anchors: array(c.obligations,'obligations').map((o:any)=>({raw_obligation_id:o.obligation_id,canonical_obligation_id:typeof o.canonical_anchor_id==='string'&&o.canonical_anchor_id?o.canonical_anchor_id:o.obligation_id})),
    privacy_redactions:privacyRedactions,
    known_exclusions:array(c.known_exclusions,'known_exclusions'),
    structural_warnings: sources[7].freshness==='UNKNOWN'&&array(c.qualified_big_inputs,'qualified_big_inputs').length?['QUALIFIED_BIG_FRESHNESS_UNKNOWN']:[],
    frozen_bracket:{...c.coverage_inputs.dependency_bracket,derived_bracket:input.bracket}
  };
  return {input,binding_trace:trace};
}

export function validateManifestPopulation(manifest:Raw,population:Raw,expectedDigest:string,canonicalDigest:(value:unknown)=>string){
  if(manifest.case_count!==32||population.case_count!==32) fail('population must contain exactly 32 cases');
  const ids=array(manifest.ordered_case_ids,'manifest.ordered_case_ids');
  const pids=array(population.ordered_case_ids,'population.ordered_case_ids');
  if(ids.length!==32||new Set(ids).size!==32||JSON.stringify(ids)!==JSON.stringify(pids)) fail('ordered case IDs mismatch');
  const cases=array(manifest.cases,'manifest.cases');
  if(cases.length!==32||JSON.stringify(cases.map((c:any)=>c.case_id))!==JSON.stringify(ids)) fail('case order/count mismatch');
  const digest=canonicalDigest(cases);
  if(digest!==expectedDigest) fail('population digest mismatch');
  const frozen=typeof population.population_digest==='object'?population.population_digest.value:population.population_digest;
  if(frozen!==expectedDigest||manifest.population_digest!==expectedDigest) fail('published population digest pin mismatch');
  if(manifest.labels_present!==false||population.labels_present!==false) fail('labels must not be present');
}

export const RUNTIME_ALLOWED_INPUTS = new Set([
  'artifacts/evaluation/pilot001/IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.1.json',
  'artifacts/evaluation/pilot001/IRIS-PILOT-001-CASE-POPULATION-IDENTITY-v0.1.json',
  'artifacts/evaluation/pilot001/IRIS-PILOT-001-ADJUDICATION-PROTOCOL-v0.1.md',
  'artifacts/iba/iris-transition/IRIS-PILOT-001-E1-TO-FROZEN-CANDIDATE-EXECUTION-BINDING-v0.1.md',
  'artifacts/iba/iris-transition/IRIS-PILOT-001-E1-TO-FROZEN-CANDIDATE-EXECUTION-BUILDER-PACKET-v0.1.md'
]);

export function assertAllowedRuntimePath(path:string){
  if(!RUNTIME_ALLOWED_INPUTS.has(path)) fail('runtime input path is not allowlisted: '+path);
}
