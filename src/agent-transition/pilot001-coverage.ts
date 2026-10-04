import type {CoverageState,PilotCandidate,SourceEvaluation} from './pilot001-types.ts';
import {REQUIRED_SOURCES} from '../personal-office/contracts.ts';
export const REQUIRED_SOURCE_REQUIREMENT_IDS=REQUIRED_SOURCES;
// Raw flags cannot prove source identity, Current, coverage, or omission.
export function evaluateCoverage(_sources:SourceEvaluation[],_candidates:PilotCandidate[],_conflicts:string[],_bracket:'STABLE'|'RERUN_STABLE'|'UNSTABLE'):never {throw new Error('B6_CANONICAL_PILOT_REQUIRED');}
export function justifiedOmission(_candidate:PilotCandidate,_coverage:CoverageState):never {throw new Error('B6_CANONICAL_PILOT_REQUIRED');}
