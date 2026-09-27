import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

async function collect(dir) {
  const out=[];
  for (const e of await readdir(dir,{withFileTypes:true})) {
    const p=join(dir,e.name);
    if (e.isDirectory()) out.push(...await collect(p));
    else if (e.name.endsWith('.test.ts')) out.push(p);
  }
  return out.sort();
}
const dirs=process.argv.slice(2);
const roots=dirs.length?dirs:['tests'];
const files=(await Promise.all(roots.map(collect))).flat();
if (!files.length) throw new Error('NO_TEST_FILES');
const r=spawnSync(process.execPath,['--experimental-strip-types','--test',...files],{stdio:'inherit'});
process.exit(r.status ?? 1);
