import type { LegacyRepository } from '../state/legacy-repository.ts';
import type { CurrentAssertion } from '../domain/current-assertion.ts';
export interface PerceptionResult {
  assertions: CurrentAssertion[];
  conflict:boolean;
  missing_source:boolean;
  qualified:boolean;
}
export function perceive(repo:LegacyRepository, subjectRef:string, predicates:string[]): PerceptionResult {
  const assertions=predicates.map(p=>repo.getActiveCurrent(subjectRef,p)).filter((x): x is CurrentAssertion=>Boolean(x));
  const missing=assertions.length!==predicates.length;
  const conflict=assertions.some(x=>x.qualification==='CONFLICT'||x.coverage==='CONFLICT');
  const qualified=!missing && !conflict && assertions.every(x=>['VERIFIED','QUALIFIED'].includes(x.qualification) && x.freshness==='FRESH');
  return {assertions,conflict,missing_source:missing,qualified};
}
