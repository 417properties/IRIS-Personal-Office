import {readFileSync} from 'node:fs';
import {MemoryEnforcementRepository,PostgresEnforcementRepository} from '../../src/enforcement/backends.ts';
import {CanonicalPilotService} from '../../src/personal-office/pilot.ts';
import {engine} from '../canonical-repository/sql-fixture.ts';
const [mode,path,requestFile]=process.argv.slice(2),request=JSON.parse(readFileSync(requestFile,'utf8')),wire=readFileSync(path,'utf8'),e=mode==='SQL'?await engine():null,repo=e?new PostgresEnforcementRepository(e.executor,()=>request.as_of):new MemoryEnforcementRepository(()=>request.as_of);
try{await repo.importSnapshot(wire);process.stdout.write(JSON.stringify({output:await new CanonicalPilotService(repo).read(request),wire:await repo.exportSnapshot()}));}finally{await e?.db.close();}
