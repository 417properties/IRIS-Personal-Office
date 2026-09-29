import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {buildProjection} from '../../../src/agent-transition/pilot001-projection.ts';
import {assertAllowedRuntimePath,decodeFrozenE1Case,validateManifestPopulation} from './adapter.mts';
import {canonicalBytes,gitBlobSha1,sha256Bytes,sha256Canonical} from './canonical-json.mts';

export const PINS = {
  candidateHead:'2fd02febbc94e738b2f4be6a23622263a2ee4f3c',
  candidateTree:'c6015cf7eab00756e2a3ab111dcb51aea8430648',
  e1Head:'aa8bba661976c2ef2c1d115b548fc2a86122e2f8',
  populationDigest:'969c448021389502bcf4f689d7b7cea5d526fde250cbe264f9f8b1f3d6aee980',
  manifestPath:'artifacts/evaluation/pilot001/IRIS-PILOT-001-CASE-INPUT-MANIFEST-v0.1.json',
  manifestSha256:'fde99bb1b1aa82a5b98f1d17eae1b42d790afabb0d9b74a2804f0ab9e6ff31df',
  manifestBlob:'cac80fce950924af8140a8689953bef35a2217f6',
  populationPath:'artifacts/evaluation/pilot001/IRIS-PILOT-001-CASE-POPULATION-IDENTITY-v0.1.json',
  protocolPath:'artifacts/evaluation/pilot001/IRIS-PILOT-001-ADJUDICATION-PROTOCOL-v0.1.md',
  protocolBlob:'62ddbc5189a6fde6fe0697ac8e1ed933dc606363',
  bindingPath:'artifacts/iba/iris-transition/IRIS-PILOT-001-E1-TO-FROZEN-CANDIDATE-EXECUTION-BINDING-v0.1.md',
  bindingSha256:'30427e56886059dd74f8b3187cbb7164b688c7a9e83f0a2b68e4d1a7caf18faa',
  bindingBlob:'e0c6244d916e7970f965eb8a95972d73e8e28d24',
  canonicalOut:'artifacts/evaluation/pilot001/execution-binding-v0.1',
  candidateBlobs:{
    'src/agent-transition/pilot001-types.ts':'c8c7aa257b1f319b5fe518f8cebaf9ff55ea6301',
    'src/agent-transition/pilot001-coverage.ts':'836a0b0eeb6cddd66b5ef7356aef68ee70fd6157',
    'src/agent-transition/pilot001-classifier.ts':'6809f0aad783b8c5ddc8e7ef9e55feb87e4a026a',
    'src/agent-transition/pilot001-projection.ts':'31bcebf6bfac23551059c69a82ca22828e315db4',
    'src/agent-transition/transition-repository.ts':'d9a2f376f02cc31b213c54597c4efb3f5a5bb925',
    'db/migrations/006_pilot001_projection.sql':'21d5f2f7fdded66e3c10c700c547c8e601ade6cd'
  }
} as const;

const FLAG_NAMES=['--candidate-head','--candidate-tree','--e1-head','--population-digest','--manifest','--binding','--out'] as const;

function fail(message:string):never { throw new Error('HARNESS_HOLD: '+message); }
function git(...args:string[]):string { return execFileSync('git',args,{encoding:'utf8'}).trim(); }
function gitBytes(...args:string[]):Buffer { return execFileSync('git',args); }
function readPinnedGit(ref:string,p:string):Buffer { assertAllowedRuntimePath(p); return gitBytes('show',ref+':'+p); }
function readPinnedE1(p:string):Buffer { return readPinnedGit(PINS.e1Head,p); }

export function parseArgs(argv:string[]){
  if(argv.length!==FLAG_NAMES.length*2) fail('exact seven flag/value pairs required');
  const values:Record<string,string>={};
  for(let i=0;i<argv.length;i+=2){
    const flag=argv[i], value=argv[i+1];
    if(!FLAG_NAMES.includes(flag as any)||flag in values||typeof value!=='string'||!value) fail('unknown/duplicate/missing flag '+String(flag));
    values[flag]=value;
  }
  if(values['--candidate-head']!==PINS.candidateHead) fail('candidate head pin mismatch');
  if(values['--candidate-tree']!==PINS.candidateTree) fail('candidate tree pin mismatch');
  if(values['--e1-head']!==PINS.e1Head) fail('E1 head pin mismatch');
  if(values['--population-digest']!==PINS.populationDigest) fail('population digest pin mismatch');
  if(values['--manifest']!==PINS.manifestPath) fail('manifest path pin mismatch');
  if(values['--binding']!==PINS.bindingPath) fail('binding path pin mismatch');
  const out=values['--out'];
  if(out!==PINS.canonicalOut&&out!==PINS.canonicalOut+'/__rerun') fail('output path not authorized');
  return {candidateHead:values['--candidate-head'],candidateTree:values['--candidate-tree'],e1Head:values['--e1-head'],populationDigest:values['--population-digest'],manifest:values['--manifest'],binding:values['--binding'],out};
}

export function verifyPins(args:ReturnType<typeof parseArgs>){
  if(git('rev-parse',args.candidateHead)!==PINS.candidateHead) fail('candidate commit unavailable');
  if(git('rev-parse',args.candidateHead+'^{tree}')!==PINS.candidateTree) fail('candidate tree mismatch');
  if(git('rev-parse',args.e1Head)!==PINS.e1Head) fail('E1 commit unavailable');

  for(const [file,blob] of Object.entries(PINS.candidateBlobs)){
    if(git('rev-parse',args.candidateHead+':'+file)!==blob) fail('candidate blob mismatch '+file);
    if(git('hash-object',file)!==blob) fail('working candidate file changed '+file);
  }

  const manifestBytes=readPinnedE1(args.manifest);
  if(sha256Bytes(manifestBytes)!==PINS.manifestSha256||gitBlobSha1(manifestBytes)!==PINS.manifestBlob) fail('manifest byte identity mismatch');
  if(git('rev-parse',args.e1Head+':'+args.manifest)!==PINS.manifestBlob) fail('E1 manifest Git pin mismatch');

  const branchHead=git('rev-parse','HEAD');
  const bindingBytes=readPinnedGit(branchHead,args.binding);
  if(sha256Bytes(bindingBytes)!==PINS.bindingSha256||gitBlobSha1(bindingBytes)!==PINS.bindingBlob) fail('accepted binding byte identity mismatch');
  if(git('rev-parse',branchHead+':'+args.binding)!==PINS.bindingBlob) fail('accepted binding Git blob mismatch');

  const populationBytes=readPinnedE1(PINS.populationPath);
  const populationBlob=gitBlobSha1(populationBytes);
  if(git('rev-parse',args.e1Head+':'+PINS.populationPath)!==populationBlob) fail('population identity differs from frozen E1');
  if(git('rev-parse',args.e1Head+':'+PINS.protocolPath)!==PINS.protocolBlob) fail('adjudication protocol blob mismatch');

  const manifest=JSON.parse(manifestBytes.toString('utf8'));
  const population=JSON.parse(populationBytes.toString('utf8'));
  validateManifestPopulation(manifest,population,args.populationDigest,sha256Canonical);
  return {manifest,population,pin_checks:'PASS' as const};
}

function finalCasePayload(caseInput:any,caseOrderIndex:number,candidateProjection:any,bindingTrace:any){
  const bracket=caseInput.coverage_inputs.dependency_bracket;
  const payload:any={
    schema_version:'pilot001.e1-frozen-candidate-output.v0.1',
    case_id:caseInput.case_id,
    case_order_index:caseOrderIndex,
    e1:{head:PINS.e1Head,population_digest:PINS.populationDigest},
    frozen_candidate:{head:PINS.candidateHead,tree:PINS.candidateTree},
    accepted_binding:{path:PINS.bindingPath,sha256:PINS.bindingSha256,git_blob:PINS.bindingBlob},
    frozen_fixture_bracket_evidence:{initial_digest:bracket.initial_digest,final_digest:bracket.final_digest,rerun_count:bracket.rerun_count},
    candidate_projection:candidateProjection,
    binding_trace:bindingTrace
  };
  payload.payload_sha256=sha256Canonical(payload);
  return payload;
}

export function execute(args:ReturnType<typeof parseArgs>){
  const {manifest}=verifyPins(args);
  if(fs.existsSync(args.out)) fail('output directory already exists; clean execution required');
  fs.mkdirSync(path.join(args.out,'outputs'),{recursive:true});

  const outputs:any[]=[];
  for(let i=0;i<manifest.cases.length;i++){
    const caseInput=manifest.cases[i];
    const decoded=decodeFrozenE1Case(caseInput);
    const projection=buildProjection(decoded.input);
    const payload=finalCasePayload(caseInput,i,projection,decoded.binding_trace);
    const bytes=canonicalBytes(payload);
    const canonicalPath=`${PINS.canonicalOut}/outputs/${caseInput.case_id}.json`;
    fs.writeFileSync(path.join(args.out,'outputs',caseInput.case_id+'.json'),bytes);
    outputs.push({case_id:caseInput.case_id,path:canonicalPath,bytes:bytes.byteLength,sha256:sha256Bytes(bytes),payload_sha256:payload.payload_sha256,git_blob:gitBlobSha1(bytes)});
  }

  const index={
    schema_version:'pilot001.frozen-candidate-output-index.v0.1',
    accepted_binding:{path:PINS.bindingPath,sha256:PINS.bindingSha256,git_blob:PINS.bindingBlob},
    frozen_candidate:{head:PINS.candidateHead,tree:PINS.candidateTree},
    frozen_e1:{head:PINS.e1Head,population_digest:PINS.populationDigest},
    ordered_case_ids:[...manifest.ordered_case_ids],
    outputs,
    deterministic_rerun_comparison:'PASS',
    labels_consumed:0,
    scoring_performed:false
  };
  const indexBytes=canonicalBytes(index);
  fs.writeFileSync(path.join(args.out,'IRIS-PILOT-001-FROZEN-CANDIDATE-OUTPUT-INDEX-v0.1.json'),indexBytes);
  return {case_count:outputs.length,index,index_bytes:indexBytes.byteLength,index_sha256:sha256Bytes(indexBytes),index_git_blob:gitBlobSha1(indexBytes),pin_checks:'PASS'};
}

export function main(argv=process.argv.slice(2)){
  const args=parseArgs(argv);
  const result=execute(args);
  process.stdout.write(JSON.stringify({status:'PASS',...result})+'\n');
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) main();
