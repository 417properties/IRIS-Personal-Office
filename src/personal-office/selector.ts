// Pure interpretation of the source-qualified compound coordinates. This
// function cannot establish source qualification, completeness, or authority.
import {decodeRootDisposition,type RootDispositionV2} from '../domain/root-disposition.ts';
import {decodeFact,type ItemFact} from '../semantic-kernel/epistemic.ts';
import {demand,freeze} from '../semantic-kernel/validation.ts';
export function selectPrimary(input:unknown){
 const q=decodeRootDisposition(input),e=q.epistemic;
 if(q.privacy.disclosure_result==='PROHIBITED')return 'PRIVACY_EXCLUDED' as const;
 demand(q.privacy.disclosure_result==='PERMITTED','B6_DISCLOSURE_UNKNOWN_HOLD');
 if(['INVALID','REJECTED'].includes(e.knowledge_state))return 'INVALID_REJECTED' as const;
 if(e.knowledge_state==='CONFLICTED'||e.coverage_state==='CONFLICTED')return 'CONFLICT_HOLD' as const;
 if(q.lifecycle&&['SATISFIED','RESOLVED','SUPERSEDED','ABANDONED'].includes(q.lifecycle.state))return 'TERMINAL_RETAINED' as const;
 if(e.knowledge_state==='KNOWN'&&e.freshness_state==='CURRENT_AS_OF'&&e.applicability_state==='NOT_APPLICABLE_PROVEN'&&q.requirement==='NOT_REQUIRED_PROVEN')return 'JUSTIFIED_NOT_APPLICABLE' as const;
 if(e.knowledge_state!=='KNOWN'||e.freshness_state!=='CURRENT_AS_OF'||e.applicability_state==='UNKNOWN'||e.coverage_state!=='COMPLETE_FOR_DECLARED_SCOPE'||q.requirement==='UNKNOWN'||q.holder_knowledge_state!=='KNOWN'||q.lifecycle?.state==='UNKNOWN')return 'RELEVANCE_UNKNOWN' as const;
 if(q.reactivation_refs.length)return 'DEFERRED_SUPPRESSED_WITH_REACTIVATION' as const;
 if(q.requirement==='REQUIRED'&&e.applicability_state==='APPLICABLE')return 'KNOWN_REQUIRED' as const;
 return 'RELEVANCE_UNKNOWN' as const;
}
export function coverageFact(q:RootDispositionV2,primary:ReturnType<typeof selectPrimary>,publicBoundary=false):Readonly<ItemFact>{
 // B1 cannot flatten independently proven lifecycle and unknown knowledge
 // into a known terminal fact. Preserve both in the private compound audit;
 // the B1 operational facet remains UNKNOWN. No coordinate is rewritten.
 const hidden=publicBoundary&&primary==='PRIVACY_EXCLUDED';
 const e=hidden?{knowledge_state:'UNKNOWN' as const,applicability_state:'UNKNOWN' as const,freshness_state:'UNKNOWN' as const,coverage_state:'UNKNOWN' as const,as_of:q.as_of,evidence_refs:[],invalidators:[]}:q.epistemic;
 const known=e.knowledge_state==='KNOWN'&&e.freshness_state==='CURRENT_AS_OF'&&e.applicability_state!=='UNKNOWN';
 let disposition:ItemFact['disposition']=hidden?'PRIVACY_EXCLUDED':primary;
 if(disposition==='TERMINAL_RETAINED'&&(!known||!['SATISFIED','SUPERSEDED','ABANDONED'].includes(e.applicability_state)))disposition='RELEVANCE_UNKNOWN';
 return freeze(decodeFact({root:q.root_ref,principal:q.principal_ref,epistemic:e,requirement:known?q.requirement:'UNKNOWN',disposition,disposition_evidence:q.privacy.evidence_refs,reactivation_refs:hidden?[]:q.reactivation_refs}));
}
