import {readFileSync} from 'node:fs';
import {MemoryEnforcementRepository} from '../candidate/src/enforcement/backends.ts';
import {PersonalOffice,candidateInterface} from '../candidate/src/personal-office/office.ts';
const request=JSON.parse(process.argv[3]);
const repo=new MemoryEnforcementRepository(()=>request.as_of);
await repo.importSnapshot(readFileSync(process.argv[2],'utf8'));
const output=await candidateInterface(new PersonalOffice(repo,request.principal,()=>request.as_of),{interface_version:'IRIS_CANONICAL_PILOT_B6_V1',operation:'GET_PERSONAL_ATTENTION',request});
console.log(JSON.stringify(output));
