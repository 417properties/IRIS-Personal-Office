#!/usr/bin/env python3
"""Presence/consistency verification only. No AR, consequence-class or output labels."""
import argparse, hashlib, json, pathlib, re
ROOT=pathlib.Path(__file__).resolve().parent
def read(name): return json.loads((ROOT/name).read_text())
def canonical(x): return json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
def sha(x):return hashlib.sha256(x).hexdigest()
def blob(x):return hashlib.sha1(b'blob '+str(len(x)).encode()+b'\0'+x).hexdigest()
def require(test, message):
    if not test:raise ValueError(message)
ALLOWED=set('''account action_remaining admission affected_record_refs amount_minor applicability applicability_rule applicability_state as_of authoritative_merge_ref authority_domain_ref authority_effect authority_envelope authority_holder_identity_id authority_lease_refs authority_policy_version authority_state availability basis bodily_harm_pathway bounded_scope bounds breached canonical_admission canonicalization_authority capability case_id causal_episode_id change changed_fields claimed_principal claimed_subject commitment complete_enumeration concrete_action consequential contract_id coordination_breaks coverage_contract created_at credential_retained currency current_assertions current_generation data_scope decision_class decision_history_complete decision_maker_identity_id decision_ref decision_requirements declared_scope delay_minutes dependency_versions description device_authenticated domain effective_at emission_time enumeration_complete episode_ref escalation_blocks escalation_target_identity_id event_kind exact_restore_supported expires_at financial_changes freshness_rule from_version generation hazard history_event_refs id identity_kind identity_proven impact_packet_ref impact_packets informational_only institutional_identity instruction instrument intent_effect_state intent_ref iris_ref irreversible_residue issue issuer known_exclusions left_ref legal_changes material max_elapsed_minutes max_records mechanism objective_delays objective_ref objectives obligation_governance obligation_ref obligations observed_at operation operation_scope owner_identity_id payload permission_needed permission_present persistence possible_same_underlying_request predecessor_ref predicate preimage_retained principal principal_id principal_identity principal_judgment_required prior_semantic_values_retained privacy_disclosures privacy_envelope privacy_policy_version privacy_scope provenance_requirements provenance_verified qualified_at qualified_big_packets read_at reason receipt_present recipient record_count record_ref record_refs record_type records required_principal_id required_surfaces requires_action reserved_authority_class reserved_steps resolution_scope resolved_at resolves_record_refs resource_kind restoration restoration_permitted_after_completion retained_preimage retention_expires_at retry_permission right_ref routine_catalog_entry safety_hazards scope_resource_refs scope_version session_state snapshot_reads snapshot_time source_commitment source_current_mutation_allowed source_envelopes source_history_complete source_identity_verified source_kind source_principal_id source_refs source_requirements sponsor_ref state status subject_ref subject_refs subject_version supersedes_record_refs surface target_refs test_only text to_version tolerance_minutes tool unresolved_effects valid_through value verification_present version worker_ref'''.split())
SURFACES={'objectives','obligations','obligation_governance','decision_requirements','authority_state','intent_effect_state','current_assertions','qualified_big_packets'}
BEARING={'objective','obligation','decision_requirement','current_assertion','applicability_assertion','intent','effect_record','required_next_step','informational_receipt'}
IMPACT_KEYS={'id','subject_ref','subject_version','source_refs','as_of','valid_through','complete_enumeration','provenance_verified','operation','bounds','restoration','legal_changes','financial_changes','safety_hazards','objective_delays','privacy_disclosures','coordination_breaks','reserved_steps','unresolved_effects','escalation_blocks'}

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--write-report',action='store_true');args=parser.parse_args()
    m=read('case-input-manifest.json');identity=read('population-identity.json');cases=[]
    for shard in m['case_shards']:
        values=read(shard['path']);require(len(values)==shard['count'],'shard count')
        require(values[0]['case_id']==shard['first_case_id'] and values[-1]['case_id']==shard['last_case_id'],'shard ordering');cases.extend(values)
    ids=[c['case_id'] for c in cases]
    require(len(cases)==40==m['case_count']==identity['case_count'],'population count')
    require(len(set(ids))==len(ids) and ids==sorted(ids,key=lambda x:x.encode()),'unique ordered IDs')
    require(all(re.fullmatch(r'p1e1r4_[0-9a-f]{32}',x) for x in ids),'opaque ID format')
    require(ids==m['case_ids_ordered']==identity['ordered_ids'],'population membership')
    require(sha(canonical(cases))==m['population_sha256']==identity['population_sha256'],'population digest')
    require(sha((ROOT/'case-input-manifest.json').read_bytes())==identity['manifest_sha256'],'manifest identity')
    total_records=total_packets=total_refs=0;all_ids=set();observed_types=set();surface_availability=set();read_lengths=set();lifecycle_combos=set()
    for c in cases:
        records=c['records'];packets=c['impact_packets'];byid={r['id']:r for r in records+packets}
        require(len(byid)==len(records)+len(packets),'duplicate source ID')
        require(not all_ids.intersection(byid),'cross-case reused record IDs');all_ids.update(byid)
        total_records+=len(records);total_packets+=len(packets);observed_types.update(r['record_type'] for r in records)
        require(set(c['source_envelopes'])==SURFACES==set(c['coverage_contract']['required_surfaces']),'eight required surfaces')
        require({x['surface'] for x in c['source_requirements']}==SURFACES,'requirements')
        require(c['coverage_contract']['contract_id']=='PILOT001_IRIS_PLUS_QUALIFIED_BIG_V0_1','scope identity')
        require(c['coverage_contract']['known_exclusions'],'bounded exclusions')
        for key,env in c['source_envelopes'].items():
            require({'availability','enumeration_complete','principal_identity','provenance_verified','observed_at','valid_through','source_refs','record_refs'}==set(env),'source envelope fields')
            require(env['availability'] in {'PRESENT','UNAVAILABLE','UNKNOWN'},'availability')
            if env['availability']=='UNAVAILABLE':require(not env['enumeration_complete'] and not env['record_refs'],'explicit unavailable inventory')
            surface_availability.add(env['availability'])
        def walk(x):
            nonlocal total_refs
            if isinstance(x,dict):
                require(set(x)<=ALLOWED,'unapproved field name')
                for k,v in x.items():
                    require(not re.search(r'expected|ground.?truth|prediction|answer|label|score|consequence_class|intervention_id|resolution_kind|coverage_state|completeness_state|conflict_class',k,re.I),'prohibited answer field')
                    if k.endswith('_ref') and v is not None:
                        require(isinstance(v,str) and v in byid,'unresolved single reference');total_refs+=1
                    elif k.endswith('_refs'):
                        require(isinstance(v,list) and all(r in byid for r in v),'unresolved reference set');total_refs+=len(v)
                    walk(v)
            elif isinstance(x,list):
                for v in x:walk(v)
        walk(c)
        evidence=[r for r in records if r['record_type']=='evidence']
        require(len(evidence)==1 and evidence[0]['provenance_verified'] and evidence[0]['complete_enumeration'],'evidence provenance')
        require(set(evidence[0]['subject_refs'])=={r['id'] for r in records if r['record_type']!='evidence'},'source record enumeration')
        for r in records:
            if r['record_type'] in BEARING:require('impact_packet_ref' in r,'missing consequence basis')
            if 'impact_packet_ref' in r:
                p=byid[r['impact_packet_ref']];require(p['subject_ref']==r['id'] and p['subject_version']==r['version'],'impact subject/version')
        for p in packets:
            require(set(p)==IMPACT_KEYS,'complete consequence source fields')
            require(p['complete_enumeration'] is True and p['provenance_verified'] is True,'consequence source completeness')
            require(p['as_of']<=c['snapshot_time']<=p['valid_through'],'consequence applicability')
            require(p['operation']['description'] and p['operation']['target_refs'],'operation scope')
            require(all(type(v) is bool for v in p['restoration'].values()),'restoration evidence types')
            b=p['bounds'];r=p['restoration']
            require(set(b)=={'max_records','max_elapsed_minutes','expires_at'},'bounded source schema')
            require(all(isinstance(b[k],int) and b[k]>0 for k in ['max_records','max_elapsed_minutes']),'finite bounds')
            require(b['expires_at']>c['snapshot_time'],'operation expiry')
            # Boolean source sufficiency only: never compute a class, weight, AR or intervention.
            routine_basis=(p['operation']['routine_catalog_entry'] is not None and r['retained_preimage'] and r['exact_restore_supported'] and r['restoration_permitted_after_completion'] and not r['irreversible_residue'])
            require(routine_basis or r['irreversible_residue'],'source basis present without assigning a class')
            require(not(r['irreversible_residue'] and r['exact_restore_supported']),'conflicting restoration evidence')
            for x in p['objective_delays']:require(x['delay_minutes']>=0 and x['tolerance_minutes']>=0 and x['source_commitment'],'delay source threshold')
            for x in p['privacy_disclosures']:require(x['data_scope'] and x['recipient'] and type(x['permission_present']) is bool and x['source_commitment'],'privacy evidence')
            for x in p['coordination_breaks']:require(x['commitment'] and type(x['breached']) is bool and x['mechanism'],'coordination evidence')
            for x in p['financial_changes']:require(type(x['amount_minor']) is int and x['amount_minor']!=0 and x['currency'] and x['change'],'financial evidence')
            for x in p['legal_changes']:require(x['instrument'] and x['change'],'legal evidence')
            for x in p['safety_hazards']:require(x['hazard'] and x['bodily_harm_pathway'],'safety evidence')
            for x in p['reserved_steps']:require(byid[x['record_ref']]['reserved_authority_class']==x['reserved_authority_class'] and x['reserved_authority_class'],'reserved evidence')
            for x in p['unresolved_effects']:
                require(byid[x['intent_ref']]['status']==x['state'] and x['consequential'] is True,'effect linkage')
                require(any(r['record_type']=='effect_record' and r['intent_ref']==x['intent_ref'] and r['state']==x['state'] and not r['verification_present'] for r in records),'effect source state')
            for x in p['escalation_blocks']:require(x['issue'] and x['source_commitment'] and x['principal_judgment_required'] is True and x['material'] is True,'escalation source basis')
        for d in [r for r in records if r['record_type']=='decision_requirement']:
            require(d['decision_history_complete'] is True,'decision history enumeration')
            ob=byid[d['obligation_ref']];gs=[r for r in records if r['record_type']=='obligation_governance' and r['obligation_ref']==ob['id']];require(len(gs)==1,'governance linkage')
            combo=(ob['status'],gs[0]['applicability_state'],d['status']);lifecycle_combos.add(combo)
            if combo==('ABANDONED','APPLICABLE','OPEN'):
                cancels=[r for r in records if r['record_type']=='lifecycle_event' and r['event_kind']=='ABANDONED' and ob['id'] in r['affected_record_refs']]
                require(cancels and all(d['id'] not in r['affected_record_refs'] for r in cancels),'explicit cancellation scope')
                require(any(r['record_type']=='applicability_assertion' and r['subject_refs']==[d['id']] and r['applicability']=='APPLICABLE' and r['effective_at']>max(x['effective_at'] for x in cancels) for r in records),'independent decision applicability')
            if d['status'] in {'RESOLVED','SUPERSEDED'}:
                field='resolves_record_refs' if d['status']=='RESOLVED' else 'supersedes_record_refs'
                require(any(r['record_type']=='action_decision' and d['id'] in r[field] for r in records),'decision resolution history')
        for step in [r for r in records if r['record_type']=='required_next_step']:
            require(byid[step['decision_ref']]['obligation_ref']==step['subject_ref'],'permission decision exact binding')
        reads=c['snapshot_reads'];read_lengths.add(len(reads));require(len(reads) in [2,4],'bounded read pairs')
        require([x['read_at'] for x in reads]==sorted(x['read_at'] for x in reads),'temporal read ordering')
        depids=[x['record_ref'] for x in reads[0]['dependency_versions']]
        for rd in reads:
            require([x['record_ref'] for x in rd['dependency_versions']]==depids,'exact stable dependency membership')
            require(len(set(depids))==len(depids),'unique dependencies')
            for x in rd['dependency_versions']:
                base=byid[x['record_ref']]['version']
                require(x['version']>=base,'source version range')
                if x['version']>base:
                    for v in range(base,x['version']):
                        require(any(r['record_type']=='version_event' and r['subject_ref']==x['record_ref'] and r['from_version']==v and r['to_version']==v+1 and r['prior_semantic_values_retained'] and r['effective_at']<=rd['read_at'] for r in records),'complete version-event chain')
    require(read_lengths=={2,4},'snapshot bracket source coverage')
    require(surface_availability=={'PRESENT','UNKNOWN','UNAVAILABLE'},'surface availability source coverage')
    require(('ABANDONED','APPLICABLE','OPEN') in lifecycle_combos,'cross-record source coverage')
    report={'result':'STRUCTURAL_ADJUDICABILITY_PASS','population_count':len(cases),'population_sha256':m['population_sha256'],'source_record_count':total_records,'impact_packet_count':total_packets,'resolved_reference_occurrences':total_refs,'unique_source_and_packet_ids':len(all_ids),'answer_label_fields':0,'case_specific_classifications_generated':0,'candidate_inputs_consumed':0,'checks':['exact eight source envelopes and requirements for every case, including explicit unavailable-source observations','closed source record inventories and verified synthetic provenance','every potentially consequence-bearing record bound to a complete source impact packet','exact subject/version and all internal references resolve','all consequence fields present; source restoration/effect/reserved facts consistent; supported evidence exists without computing classes','cross-record abandonment scope and separate decision reaffirmation present','resolved/superseded decision histories present','exact permission-to-decision bindings remove duplicate resolution ambiguity','bounded snapshot read pairs and complete version-change source chains','strict input-field allowlist; no answer-label fields','unique opaque IDs; exact membership; deterministic ordering and population digest'],'limits':['structural presence and source consistency proof only; no AR, class, intervention, coverage answer or scoring truth generated','de novo authorship certification is provenance evidence, not a claim that synthetic scenarios are semantically disjoint from every historical scenario','runtime implementation and optional future-worker interfaces are not executed or evaluated at E1; this population concerns Pilot 001 projection and its governing source/authority boundaries']}
    if args.write_report:(ROOT/'structural-verification.json').write_text(json.dumps(report,indent=2,sort_keys=True)+'\n')
    elif (ROOT/'structural-verification.json').exists():require(read('structural-verification.json')==report,'verification report exact identity')
    if (ROOT/'integrity-manifest.json').exists():
        for row in read('integrity-manifest.json')['files']:
            raw=(ROOT/row['path']).read_bytes();require(len(raw)==row['bytes'] and sha(raw)==row['sha256'] and blob(raw)==row['git_blob'],'artifact integrity')
    print(json.dumps(report,sort_keys=True))
if __name__=='__main__':main()
