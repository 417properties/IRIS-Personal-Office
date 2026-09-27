import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const requiredTables=['principal','orientation_state','evidence_occurrence','current_assertion','objective','obligation','capability_procedure','learning_record','work_episode','action_decision','action_intent','action_receipt','effect_verification','authority_policy','privacy_policy','big_delta_quarantine','instrumentation_event'];
const files=await readdir('db/migrations');
const sql=(await Promise.all(files.map(f=>readFile(join('db/migrations',f),'utf8')))).join('\n').toLowerCase();
for (const table of requiredTables) if (!sql.includes(`create table ${table}`)) throw new Error(`MISSING_TABLE:${table}`);
const readme=await readFile('README.md','utf8');
for (const invariant of ['Current ≠ history','Capability ≠ authorization','IRIS state ≠ BIG state']) if (!readme.includes(invariant)) throw new Error(`MISSING_INVARIANT:${invariant}`);
console.log(JSON.stringify({status:'PASS',requiredTables:requiredTables.length,migrations:files.sort()}));
