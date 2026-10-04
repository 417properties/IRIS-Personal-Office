import {PersonalOffice} from '../personal-office/office.ts';
import {buildProjection} from './pilot001-projection.ts';
function canonicalOffice(value:unknown):asserts value is PersonalOffice {if(!(value instanceof PersonalOffice))throw new Error('B6_CANONICAL_PILOT_REQUIRED');}
export const get_objectives=(office:PersonalOffice,input:unknown)=>{canonicalOffice(office);return office.objectives(input);};
export const get_open_obligations=(office:PersonalOffice,input:unknown)=>{canonicalOffice(office);return office.openObligations(input);};
export const get_aaron_required_items=buildProjection;
export const DOCUMENTARY_CAPABILITIES=['query_big_navigator','submit_evidence','prepare_action','request_authority','verify_effect'] as const;
export const EXTERNAL_EFFECT_AUTHORITY='NONE' as const;
export function protocolAuthentication(){return {authenticated:false,iris_authority:false,current_authority:false} as const;}
export function unrestrictedDbMutation():never{throw new Error('UNRESTRICTED_DB_MUTATION_FORBIDDEN');}
