import {CanonicalPilotService} from '../personal-office/pilot.ts';
import type {PilotCandidate,SourceEvaluation} from './pilot001-types.ts';
export interface LegacyProjectionInput {candidates:PilotCandidate[];sources:SourceEvaluation[];conflicts:string[];privacyExcluded:string[];bracket:'STABLE'|'RERUN_STABLE'|'UNSTABLE';started_at:string;emitted_at:string}
// The old one-argument DTO fails closed; migrated callers supply the canonical
// service. No pure renderer can assert that a repeatable read happened.
export function buildProjection(input:LegacyProjectionInput):never;
export function buildProjection(service:CanonicalPilotService,input:unknown):ReturnType<CanonicalPilotService['project']>;
export function buildProjection(service:unknown,input?:unknown){if(!(service instanceof CanonicalPilotService))throw new Error('B6_CANONICAL_PILOT_REQUIRED');return service.project(input);}
