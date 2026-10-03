import type { LegacyRepository } from '../state/legacy-repository.ts';
import { orient } from './orient.ts';
import { perceive } from './perceive.ts';
import { think } from './think.ts';
import { evaluateAuthority } from '../domain/authority.ts';
import { evaluatePrivacy } from '../domain/privacy.ts';
import type { ActionIntent } from '../domain/action-intent.ts';
import { toolContractMatches, type ToolContract, type ToolExecutor } from '../tools/tool-contract.ts';
import { act } from './act.ts';
import { verifyFixtureEffect } from '../tools/verification.ts';
import { recordCandidateLearning } from './learn.ts';
import { recordBireMetric } from '../instrumentation/personal-bire.ts';
import { emitIefEvent } from '../instrumentation/ief-events.ts';

export async function runBoundedCircuit(args:{
  repo:LegacyRepository; principalId:string; objectiveId:string; obligationId:string; episodeId:string;
  subjectRef:string; predicate:string; actionScope:string; privacyScope:string; intent:ActionIntent;
  contract:ToolContract; executor:ToolExecutor; fixtureRead:()=>unknown; expectedEffect:unknown; now:string;
}) {
  if (!toolContractMatches(args.intent,args.contract,args.actionScope,args.privacyScope)) return {status:'HOLD_TOOL_CONTRACT_MISMATCH'};
  const started=Date.now();
  const orientation=orient(args.repo,args.principalId);
  const perception=perceive(args.repo,args.subjectRef,[args.predicate]);
  const thought=think({objective_id:args.objectiveId,perception_qualified:perception.qualified,desired_operation:args.intent.operation});
  const auth=evaluateAuthority([...args.repo.authorityPolicies.values()],args.contract.authority_scope,args.now,orientation.explicit_decision_scopes);
  const privacy=evaluatePrivacy([...args.repo.privacyPolicies.values()],args.contract.privacy_scope,args.now);
  if (auth!=='AUTHORIZED_WITHIN_STANDING_SCOPE') return {status:'HOLD_AUTHORITY',auth,privacy};
  if (privacy!=='ALLOW') return {status:'HOLD_PRIVACY',auth,privacy};
  if (!args.repo.intents.has(args.intent.intent_id)) { args.repo.intents.set(args.intent.intent_id,structuredClone(args.intent)); args.repo.stateVersion++; }
  const receipt=await act(args.intent,args.contract,args.executor,args.actionScope,args.privacyScope);
  args.repo.receipts.set(receipt.receipt_id,structuredClone(receipt)); args.repo.stateVersion++;
  const verification=verifyFixtureEffect(args.intent,receipt,args.fixtureRead(),args.expectedEffect);
  args.repo.verifications.set(verification.verification_id,verification); args.repo.stateVersion++;
  const obligation=args.repo.obligations.get(args.obligationId)!;
  const objective=args.repo.objectives.get(args.objectiveId)!;
  if (verification.disposition==='VERIFIED_EFFECT') {
    obligation.status='CLOSED'; obligation.version++; obligation.last_episode_id=args.episodeId;
    objective.status='SATISFIED'; objective.version++; objective.closure_evidence_refs.push(verification.verification_id); objective.closed_at=new Date().toISOString();
  } else {
    obligation.status='HOLD'; obligation.version++;
    objective.status='OPEN';
  }
  args.repo.stateVersion++;
  const learning=recordCandidateLearning(args.episodeId,[verification.verification_id],verification.disposition==='VERIFIED_EFFECT'?'Verified bounded circuit effect':'Fixture did not establish intended effect');
  args.repo.learning.set(learning.learning_id,learning);
  emitIefEvent(args.repo,args.episodeId,'CANDIDATE_LESSON_PROPOSED',{learning_id:learning.learning_id});
  recordBireMetric(args.repo,args.episodeId,{wall_clock_ms:Date.now()-started,tool_calls:1,retries:0,reconciliation_events:verification.disposition==='AMBIGUOUS_EFFECT'?1:0,aaron_mechanical_interventions:0});
  return {status:verification.disposition==='VERIFIED_EFFECT'?'EPISODE_CLOSED':'OBJECTIVE_REMAINS_OPEN',orientation,perception,thought,receipt,verification,learning};
}
