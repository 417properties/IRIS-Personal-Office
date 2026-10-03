import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const module=process.env.IRIS_B2_PGLITE_MODULE??createRequire(import.meta.url).resolve('@electric-sql/pglite');
const guard=fileURLToPath(new URL('./network-guard.cjs',import.meta.url));
const result=spawnSync(process.execPath,['scripts/run-tests.mjs'],{cwd:root,stdio:'inherit',env:{...process.env,IRIS_B2_PGLITE_MODULE:module,NODE_OPTIONS:[process.env.NODE_OPTIONS,'--require',guard].filter(Boolean).join(' ')}});
process.exit(result.status??1);
