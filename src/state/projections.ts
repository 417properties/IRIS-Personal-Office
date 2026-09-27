import type { CanonicalRepository } from './repository.ts';
export interface AaronCurrentProjection {
  noncanonical: true;
  state_version: number;
  assertions: Record<string, unknown>;
  open_obligation_ids: string[];
}
export function projectAaronCurrent(repo: CanonicalRepository): AaronCurrentProjection {
  const assertions: Record<string,unknown> = {};
  for (const [key,list] of repo.currentAssertions.entries()) {
    const active=list.findLast(x=>!x.effective_to);
    if (active) assertions[key]=structuredClone(active.value);
  }
  return {
    noncanonical:true,
    state_version:repo.stateVersion,
    assertions,
    open_obligation_ids:[...repo.obligations.values()].filter(x=>x.status!=='CLOSED').map(x=>x.obligation_id).sort()
  };
}
