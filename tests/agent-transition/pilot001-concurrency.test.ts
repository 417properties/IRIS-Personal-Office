import test from 'node:test';
import assert from 'node:assert/strict';
import {buildProjection} from '../../src/agent-transition/pilot001-projection.ts';
for(const bracket of ['STABLE','RERUN_STABLE','UNSTABLE'] as const)test('legacy caller bracket '+bracket+' is no snapshot proof',()=>assert.throws(()=>buildProjection({candidates:[],sources:[],conflicts:[],privacyExcluded:[],bracket,started_at:'a',emitted_at:'b'}),/^Error: B6_CANONICAL_PILOT_REQUIRED$/));
test('legacy duplicate labels cannot manufacture exact identity',()=>assert.throws(()=>buildProjection({candidates:[{id:'x',principal_id:'AARON',obligation_id:'shared',provenance_refs:['claim']},{id:'y',principal_id:'AARON',obligation_id:'shared',provenance_refs:['claim']}],sources:[],conflicts:[],privacyExcluded:[],bracket:'STABLE',started_at:'a',emitted_at:'b'}),/B6_CANONICAL_PILOT_REQUIRED/));
