import test from 'node:test';
import assert from 'node:assert/strict';
import {compound,principal,T2} from './fixtures.ts';
import {selectPrimary,coverageFact} from '../../src/personal-office/selector.ts';
import {reduceCoverage} from '../../src/semantic-kernel/epistemic.ts';
import {identity} from '../../src/semantic-kernel/identity.ts';
const root=identity('OBLIGATION','opaque:obligation:do-not-parse');
const life=(state:any)=>({object:root,principal,version:1,state,last_event_ref:'source:life',evidence_refs:['source:qualified'],basis_ref:'source:qualified'});
const base=()=>compound(root,{lifecycle:life('NONTERMINAL')});
const apply=(q:any,patch:any)=>compound(root,{...q,...patch});
const patches:any={invalid:{epistemic:{...base().epistemic,knowledge_state:'INVALID'}},conflict:{epistemic:{...base().epistemic,knowledge_state:'CONFLICTED'}},terminal:{lifecycle:life('SATISFIED')},notApplicable:{epistemic:{...base().epistemic,applicability_state:'NOT_APPLICABLE_PROVEN'},requirement:'NOT_REQUIRED_PROVEN'},unknown:{holder_knowledge_state:'UNKNOWN',holder_ref:null},deferred:{reactivation_refs:['source:qualified']},required:{}};
const expected:any={invalid:'INVALID_REJECTED',conflict:'CONFLICT_HOLD',terminal:'TERMINAL_RETAINED',notApplicable:'JUSTIFIED_NOT_APPLICABLE',unknown:'RELEVANCE_UNKNOWN',deferred:'DEFERRED_SUPPRESSED_WITH_REACTIVATION',required:'KNOWN_REQUIRED'};
for(const [name,patch] of Object.entries(patches))test('Q primary '+name,()=>assert.equal(selectPrimary(apply(base(),patch)),expected[name]));
// Precedence probes use semantic coordinates, not Builder output labels from
// any governing oracle or E1 population. Every secondary reason is retained.
const names=Object.keys(patches);
for(let i=0;i<names.length;i++)for(let j=i+1;j<names.length;j++){
 const high=names[i]!,low=names[j]!;if(high==='invalid'&&low==='notApplicable'||high==='conflict'&&low==='notApplicable')continue; // B1 prohibits a proven N/A with non-known knowledge.
 test('Q precedence '+high+' over '+low,()=>{const q=apply(base(),{...patches[low],...patches[high]});assert.equal(selectPrimary(q),expected[high]);assert(q.reason_set.length>=8);});
}
for(const name of names)test('privacy outer guard conceals '+name,()=>{const q=apply(base(),{...patches[name],privacy:{...base().privacy,disclosure_result:'PROHIBITED'}});assert.equal(selectPrimary(q),'PRIVACY_EXCLUDED');const f=coverageFact(q,'PRIVACY_EXCLUDED',true);assert.equal(f.epistemic.knowledge_state,'UNKNOWN');assert.equal(reduceCoverage({roots:[root],principal,as_of:T2},[f]).coverage_state,'UNKNOWN');});
test('terminal + unknown retains unknown operational coverage without erasing lifecycle',()=>{const q=apply(base(),{lifecycle:life('SATISFIED'),epistemic:{...base().epistemic,knowledge_state:'UNKNOWN'},requirement:'UNKNOWN',holder_knowledge_state:'UNKNOWN',holder_ref:null});assert.equal(selectPrimary(q),'TERMINAL_RETAINED');const f=coverageFact(q,'TERMINAL_RETAINED');assert.equal(f.disposition,'RELEVANCE_UNKNOWN');assert.equal(q.lifecycle!.state,'SATISFIED');assert.equal(reduceCoverage({roots:[root],principal,as_of:T2},[f]).coverage_state,'UNKNOWN');});
test('conflict + terminal + UNKNOWN chooses conflict and conserves all coordinates',()=>{const q=apply(base(),{lifecycle:life('SATISFIED'),epistemic:{...base().epistemic,knowledge_state:'UNKNOWN',coverage_state:'CONFLICTED'},requirement:'UNKNOWN'});assert.equal(selectPrimary(q),'CONFLICT_HOLD');assert(q.reason_set.some(r=>r.canonical_code==='UNKNOWN'));assert(q.reason_set.some(r=>r.canonical_code==='SATISFIED'));const fact=coverageFact(q,'CONFLICT_HOLD');assert.equal(reduceCoverage({roots:[root],principal,as_of:T2},[fact]).coverage_state,'CONFLICTED');});
for(const field of ['knowledge_state','applicability_state','freshness_state','coverage_state'] as const)test('canonical UNKNOWN '+field+' cannot become known required',()=>{const q=apply(base(),{epistemic:{...base().epistemic,[field]:'UNKNOWN'},requirement:'UNKNOWN'});assert.equal(selectPrimary(q),'RELEVANCE_UNKNOWN');});
test('unknown privacy is HOLD and is neither prohibition nor admissibility',()=>assert.throws(()=>selectPrimary(apply(base(),{privacy:{...base().privacy,disclosure_result:'UNKNOWN'}})),/B6_DISCLOSURE_UNKNOWN_HOLD/));
test('a supplied primary badge cannot override the canonical coordinates',()=>assert.equal(selectPrimary(apply(base(),{primary_visible_disposition:'TERMINAL_RETAINED'})),'KNOWN_REQUIRED'));
test('stale knowledge cannot manufacture required routing or complete coverage',()=>{const q=apply(base(),{epistemic:{...base().epistemic,freshness_state:'STALE'}});assert.equal(selectPrimary(q),'RELEVANCE_UNKNOWN');const fact=coverageFact(q,'RELEVANCE_UNKNOWN');assert.equal(reduceCoverage({roots:[root],principal,as_of:T2},[fact]).coverage_state,'INCOMPLETE');});
