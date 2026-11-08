#!/usr/bin/env node
// Demo: parse and re-serialize a sample. --assert exits non-zero on mismatch.
import { parse, stringify } from '../src/ini.mjs';

const SAMPLE = '; db\n[db]\nhost = localhost\nport = 5432\n';

let failed = 0;
try {
  const doc = parse(SAMPLE);
  const pass = doc.db.host === 'localhost' && parse(stringify(doc)).db.port === '5432';
  console.log(`${pass ? 'PASS' : 'FAIL'} sections=${Object.keys(doc).length} keys=${Object.keys(doc.db).length}`);
  if (!pass) failed++;
} catch (e) {
  failed++;
  console.log(`FAIL threw ${e.code}`);
}
if (process.argv.includes('--assert') && failed > 0) process.exit(1);
if (failed > 0) process.exitCode = 1;
console.log(failed === 0 ? 'demo: all cases as expected' : `demo: ${failed} mismatch(es)`);
