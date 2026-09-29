import type {CoverageState,PilotCandidate,SourceEvaluation} from './pilot001-types.ts';

export const REQUIRED_SOURCE_REQUIREMENT_IDS = [
  'pilot001:objectives',
  'pilot001:obligations',
  'pilot001:obligation_governance',
  'pilot001:decision_requirements',
  'pilot001:authority_generation_and_leases',
  'pilot001:unresolved_intents_and_effects',
  'pilot001:applicability_current_assertions',
  'pilot001:qualified_big_quarantine_evidence'
] as const;

const REQUIRED_SOURCE_ID_SET = new Set<string>(REQUIRED_SOURCE_REQUIREMENT_IDS);

const SOURCE_IDENTITIES = new Set(['VERIFIED','UNKNOWN','CONFLICT']);
const SOURCE_APPLICABILITIES = new Set(['APPLICABLE','INAPPLICABLE','UNKNOWN']);
const SOURCE_FRESHNESSES = new Set(['CURRENT','STALE','UNKNOWN']);

function hasValidRequiredSourceRuntimeShape(source:SourceEvaluation):boolean {
  const value=source as unknown as Record<string,unknown>;
  return typeof value.source_id==='string' &&
    typeof value.required==='boolean' &&
    typeof value.present==='boolean' &&
    typeof value.principal_match==='boolean' &&
    typeof value.provenance_ok==='boolean' &&
    (value.partial===undefined||typeof value.partial==='boolean') &&
    typeof value.identity==='string' && SOURCE_IDENTITIES.has(value.identity) &&
    typeof value.applicability==='string' && SOURCE_APPLICABILITIES.has(value.applicability) &&
    typeof value.freshness==='string' && SOURCE_FRESHNESSES.has(value.freshness);
}

function missingMaterialClassification(c:PilotCandidate):boolean {
  if(c.decision_requirement_id && c.decision_status==='OPEN' && (!c.decision_maker_identity_id || c.decision_maker_identity_id==='UNKNOWN')) return true;
  if(c.reserved_authority_class){
    if(!c.authority_holder_identity_id || c.authority_holder_identity_id==='UNKNOWN') return true;
    if(c.authority_holder_identity_id!=='AARON' && typeof c.valid_delegation!=='boolean') return true;
  }
  return false;
}

export function evaluateCoverage(sources:SourceEvaluation[],candidates:PilotCandidate[],materialConflicts:string[],bracket:'STABLE'|'RERUN_STABLE'|'UNSTABLE'):CoverageState {
  if(bracket==='UNSTABLE') return 'UNKNOWN_COVERAGE';
  if(materialConflicts.length) return 'CONFLICTED_COVERAGE';

  const requiredSources:SourceEvaluation[]=[];
  for(const requiredId of REQUIRED_SOURCE_REQUIREMENT_IDS){
    const matches=sources.filter(s=>s.source_id===requiredId);
    if(matches.length===0) return 'INCOMPLETE_COVERAGE';
    if(matches.length>1) return 'CONFLICTED_COVERAGE';
    requiredSources.push(matches[0]!);
  }

  // TypeScript annotations are not runtime evidence. Malformed decoded required-source facts fail closed.
  if(requiredSources.some(s=>!hasValidRequiredSourceRuntimeShape(s))) return 'UNKNOWN_COVERAGE';
  // Required status is immutable contract state, never caller-narrowable input.
  if(requiredSources.some(s=>s.required!==true)) return 'UNKNOWN_COVERAGE';
  if(requiredSources.some(s=>!s.principal_match)) return 'UNKNOWN_COVERAGE';
  if(requiredSources.some(s=>s.identity!=='VERIFIED'||s.applicability==='UNKNOWN')) return 'UNKNOWN_COVERAGE';
  // Frozen v0.4 requires every immutable required source to be present or proven inapplicable.
  // Applicable sources require known freshness; INAPPLICABLE is supportable only with provenance.
  if(requiredSources.some(s=>s.applicability==='APPLICABLE'&&s.freshness==='UNKNOWN')) return 'UNKNOWN_COVERAGE';
  if(requiredSources.some(s=>s.applicability==='INAPPLICABLE'&&(!s.provenance_ok||s.freshness==='UNKNOWN'))) return 'UNKNOWN_COVERAGE';
  if(requiredSources.some(s=>s.applicability==='INAPPLICABLE'&&(s.freshness==='STALE'||s.partial))) return 'INCOMPLETE_COVERAGE';
  if(requiredSources.some(s=>s.applicability==='APPLICABLE'&&(!s.present||s.freshness==='STALE'||!s.provenance_ok||s.partial))) return 'INCOMPLETE_COVERAGE';

  // Optional/non-contract sources cannot make required coverage disappear and cannot elevate coverage.
  for(const source of sources){
    if(REQUIRED_SOURCE_ID_SET.has(source.source_id)) continue;
  }

  if(candidates.some(c=>c.principal_id==='AARON'&&(c.source_identity==='UNKNOWN'||c.source_identity==='CONFLICT'||c.applicability==='UNKNOWN'||c.freshness==='UNKNOWN'||missingMaterialClassification(c)))) return 'UNKNOWN_COVERAGE';
  return 'COMPLETE_FOR_DECLARED_SCOPE';
}

export function justifiedOmission(c:PilotCandidate,coverage:CoverageState){
  return coverage==='COMPLETE_FOR_DECLARED_SCOPE' &&
    c.principal_id==='AARON' &&
    c.applicability==='APPLICABLE' &&
    c.freshness==='CURRENT' &&
    c.source_identity==='VERIFIED' &&
    c.provenance_refs.length>0 &&
    !c.material_conflict &&
    !c.unresolved_effect &&
    !missingMaterialClassification(c);
}
