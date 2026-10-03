// IRIS_LEGACY_V0 compatibility only. Not qualified canonical state or admission.
import type { Principal } from '../domain/principal.ts';
import type { OrientationState } from '../domain/orientation.ts';
import type { EvidenceOccurrence } from '../domain/evidence-occurrence.ts';
import { currentKey, type CurrentAssertion } from '../domain/current-assertion.ts';
import type { Objective } from '../domain/objective.ts';
import type { Obligation } from '../domain/obligation.ts';
import type { CapabilityProcedure } from '../domain/capability-procedure.ts';
import type { LearningRecord } from '../domain/learning-record.ts';
import type { WorkEpisode } from '../domain/work-episode.ts';
import type { AuthorityPolicy } from '../domain/authority.ts';
import type { PrivacyPolicy } from '../domain/privacy.ts';
import type { ActionDecision, ActionIntent } from '../domain/action-intent.ts';
import type { ActionReceipt } from '../domain/action-receipt.ts';
import type { EffectVerification } from '../domain/effect-verification.ts';

export interface InstrumentationEvent { event_id:string; event_type:string; work_episode_id?:string; payload:Record<string,unknown>; occurred_at:string; }
export interface BigDelta { delta_id:string; source_system:'BIG'; target_system:'IRIS'; delta_class:string; content_ref:string; evidence_refs:string[]; qualification:string; authority_effect:'NONE'; privacy_scope:string[]; applicability:string[]; expires_at?:string; }

export interface LegacyRepository {
  principals: Map<string, Principal>;
  orientations: Map<string, OrientationState>;
  evidence: Map<string, EvidenceOccurrence>;
  currentAssertions: Map<string, CurrentAssertion[]>;
  objectives: Map<string, Objective>;
  obligations: Map<string, Obligation>;
  capabilities: Map<string, CapabilityProcedure>;
  learning: Map<string, LearningRecord>;
  episodes: Map<string, WorkEpisode>;
  authorityPolicies: Map<string, AuthorityPolicy>;
  privacyPolicies: Map<string, PrivacyPolicy>;
  decisions: Map<string, ActionDecision>;
  intents: Map<string, ActionIntent>;
  receipts: Map<string, ActionReceipt>;
  verifications: Map<string, EffectVerification>;
  bigDeltaQuarantine: Map<string, BigDelta>;
  instrumentation: InstrumentationEvent[];
  stateVersion: number;
}

export class LegacyMemoryRepository implements LegacyRepository {
  principals = new Map<string, Principal>();
  orientations = new Map<string, OrientationState>();
  evidence = new Map<string, EvidenceOccurrence>();
  currentAssertions = new Map<string, CurrentAssertion[]>();
  objectives = new Map<string, Objective>();
  obligations = new Map<string, Obligation>();
  capabilities = new Map<string, CapabilityProcedure>();
  learning = new Map<string, LearningRecord>();
  episodes = new Map<string, WorkEpisode>();
  authorityPolicies = new Map<string, AuthorityPolicy>();
  privacyPolicies = new Map<string, PrivacyPolicy>();
  decisions = new Map<string, ActionDecision>();
  intents = new Map<string, ActionIntent>();
  receipts = new Map<string, ActionReceipt>();
  verifications = new Map<string, EffectVerification>();
  bigDeltaQuarantine = new Map<string, BigDelta>();
  instrumentation: InstrumentationEvent[] = [];
  stateVersion = 0;
  bump(): number { this.stateVersion += 1; return this.stateVersion; }

  appendEvidence(value: EvidenceOccurrence): void {
    if (this.evidence.has(value.occurrence_id)) throw new Error('EVIDENCE_OCCURRENCE_IMMUTABLE_COLLISION');
    this.evidence.set(value.occurrence_id, structuredClone(value)); this.bump();
  }
  publishCurrent(value: CurrentAssertion): void {
    const key=currentKey(value); const list=this.currentAssertions.get(key) ?? [];
    const active=list.filter(x=>!x.effective_to);
    if (active.length>1) throw new Error('CURRENT_INVARIANT_ALREADY_BROKEN');
    if (active.length===1) {
      const prev=active[0]!;
      if (value.version <= prev.version) throw new Error('CURRENT_VERSION_NOT_ADVANCING');
      prev.effective_to=value.effective_from;
      value.supersedes_assertion_id=prev.assertion_id;
    }
    list.push(structuredClone(value)); this.currentAssertions.set(key,list); this.bump();
  }
  getActiveCurrent(subject_ref:string,predicate:string): CurrentAssertion | undefined {
    const list=this.currentAssertions.get(`${subject_ref}::${predicate}`) ?? [];
    return list.filter(x=>!x.effective_to).at(-1);
  }
  currentHistory(subject_ref:string,predicate:string): CurrentAssertion[] {
    return structuredClone(this.currentAssertions.get(`${subject_ref}::${predicate}`) ?? []);
  }
}

export function exportLegacySnapshot(repo: LegacyRepository): string {
  const map = <T>(m: Map<string,T>) => [...m.entries()];
  return JSON.stringify({
    stateVersion: repo.stateVersion,
    principals: map(repo.principals),
    orientations: map(repo.orientations),
    evidence: map(repo.evidence),
    currentAssertions: map(repo.currentAssertions),
    objectives: map(repo.objectives),
    obligations: map(repo.obligations),
    capabilities: map(repo.capabilities),
    learning: map(repo.learning),
    episodes: map(repo.episodes),
    authorityPolicies: map(repo.authorityPolicies),
    privacyPolicies: map(repo.privacyPolicies),
    decisions: map(repo.decisions),
    intents: map(repo.intents),
    receipts: map(repo.receipts),
    verifications: map(repo.verifications),
    bigDeltaQuarantine: map(repo.bigDeltaQuarantine),
    instrumentation: repo.instrumentation
  });
}

export function importLegacySnapshot(text: string): LegacyMemoryRepository {
  const x=JSON.parse(text);
  const repo=new LegacyMemoryRepository();
  const load=<T>(values:[string,T][])=>new Map<string,T>(values);
  repo.principals=load(x.principals);
  repo.orientations=load(x.orientations);
  repo.evidence=load(x.evidence);
  repo.currentAssertions=load(x.currentAssertions);
  repo.objectives=load(x.objectives);
  repo.obligations=load(x.obligations);
  repo.capabilities=load(x.capabilities);
  repo.learning=load(x.learning);
  repo.episodes=load(x.episodes);
  repo.authorityPolicies=load(x.authorityPolicies);
  repo.privacyPolicies=load(x.privacyPolicies);
  repo.decisions=load(x.decisions);
  repo.intents=load(x.intents);
  repo.receipts=load(x.receipts);
  repo.verifications=load(x.verifications);
  repo.bigDeltaQuarantine=load(x.bigDeltaQuarantine);
  repo.instrumentation=x.instrumentation;
  repo.stateVersion=x.stateVersion;
  return repo;
}
