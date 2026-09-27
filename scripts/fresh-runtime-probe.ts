import { readFile } from 'node:fs/promises';
import { importCanonicalSnapshot } from '../src/state/repository.ts';
import { continuityAdmission } from '../src/state/continuity-admission.ts';
import { perceive } from '../src/runtime/perceive.ts';
import { evaluateAuthority } from '../src/domain/authority.ts';

const [path,caseName]=process.argv.slice(2);
if (!path || !caseName) throw new Error('ARGS_REQUIRED');
const envelope=JSON.parse(await readFile(path,'utf8'));
const repo=importCanonicalSnapshot(envelope.snapshot);
let passed=false;
let detail:unknown={};
switch(caseName) {
  case 'R1_CLEAN_CONTINUATION': {
    const x=continuityAdmission(repo,envelope.priorStateVersion);
    passed=x.admitted && !x.requires_reorient && x.open_obligation_ids.includes('obl-1'); detail=x; break;
  }
  case 'R2_CURRENT_CHANGED_AFTER_INTERRUPTION': {
    const x=continuityAdmission(repo,envelope.priorStateVersion);
    passed=x.admitted && x.requires_reorient; detail=x; break;
  }
  case 'R3_CONFLICTING_EVIDENCE': {
    const x=perceive(repo,'fixture:source',['status']);
    passed=x.conflict && !x.qualified; detail=x; break;
  }
  case 'R4_MISSING_SOURCE': {
    const x=perceive(repo,'fixture:source',['status','missing']);
    passed=x.missing_source && !x.qualified; detail=x; break;
  }
  case 'R5_AMBIGUOUS_EXTERNAL_EFFECT': {
    const x=continuityAdmission(repo,envelope.priorStateVersion);
    passed=!x.admitted && x.reason==='RECONCILIATION_REQUIRED'; detail=x; break;
  }
  case 'R6_OPEN_OBLIGATION_NO_CONVERSATION': {
    const x=continuityAdmission(repo,envelope.priorStateVersion);
    passed=x.open_obligation_ids.includes('obl-1'); detail=x; break;
  }
  case 'R7_PRESERVED_AUTHORITY_STATE': {
    const now='2026-09-27T12:00:00.000Z';
    const predicted=evaluateAuthority([...repo.authorityPolicies.values()],'spending.purchase',now);
    const fixture=evaluateAuthority([...repo.authorityPolicies.values()],'fixture.write',now);
    passed=predicted==='UNKNOWN' && fixture==='AUTHORIZED_WITHIN_STANDING_SCOPE';
    detail={predicted,fixture}; break;
  }
  case 'R8_HISTORY_SURVIVES_NEW_CURRENT': {
    const h=repo.currentHistory('fixture:source','status');
    passed=h.length===2 && h[0]?.value==='READY' && h[1]?.value==='DONE' && Boolean(h[0]?.effective_to);
    detail={historyLength:h.length,values:h.map(x=>x.value)}; break;
  }
  case "R9_INTENT_ONLY":
  case "R10_RECEIPT_WITHOUT_VERIFICATION": {
    const x=continuityAdmission(repo,envelope.priorStateVersion);
    const receipt=repo.receipts.get("receipt-1");
    const crashState=repo.intents.has("intent-1") && repo.verifications.size===0 && (caseName==="R9_INTENT_ONLY"
      ? repo.receipts.size===0
      : repo.receipts.size===1 && receipt?.intent_id==="intent-1" && receipt.completion_class==="SUCCESS" && receipt.tool_reported_status==="SUCCESS");
    passed=crashState && !x.admitted && x.reason==="RECONCILIATION_REQUIRED" && x.requires_reorient
      && x.unresolved_effect_intent_ids.length===1 && x.unresolved_effect_intent_ids[0]==="intent-1"
      && repo.objectives.get("obj-parent")?.status==="OPEN" && repo.obligations.get("obl-1")?.status==="OPEN";
    detail=x; break;
  }
  default: throw new Error(`UNKNOWN_CASE:${caseName}`);
}
process.stdout.write(JSON.stringify({caseName,passed,detail,stateVersion:repo.stateVersion}));
if (!passed) process.exit(2);
