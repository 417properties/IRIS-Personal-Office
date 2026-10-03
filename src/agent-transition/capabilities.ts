import type {LegacyRepository} from '../state/legacy-repository.ts';import {getObjectives,getOpenObligations} from './persistent-objective-runtime.ts';import {buildProjection} from './pilot001-projection.ts';
export const get_objectives=(repo:LegacyRepository)=>getObjectives(repo);
export const get_open_obligations=(repo:LegacyRepository)=>getOpenObligations(repo);
export const get_aaron_required_items=buildProjection;
export const DOCUMENTARY_CAPABILITIES=['query_big_navigator','submit_evidence','prepare_action','request_authority','verify_effect'] as const;
export const EXTERNAL_EFFECT_AUTHORITY='NONE' as const;
export function protocolAuthentication(){return {authenticated:true,iris_authority:false,current_authority:false} as const;}
export function unrestrictedDbMutation():never{throw new Error('UNRESTRICTED_DB_MUTATION_FORBIDDEN');}