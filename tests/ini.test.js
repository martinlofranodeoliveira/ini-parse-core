import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parse, stringify, IniError } from '../src/ini.mjs';

const SAMPLE = `# comment\n; another\nglobal = 1\n\n[server]\nhost = example.com\nport: 8080\n\n[server]\nmode = prod\n`;

describe('parse', () => {
  it('handles comments, globals, both separators and section merge', () => {
    assert.deepEqual(parse(SAMPLE), {
      '': { global: '1' },
      server: { host: 'example.com', port: '8080', mode: 'prod' },
    });
  });
  it('rejects duplicates, bad lines and bad sections', () => {
    assert.throws(() => parse('[a]\nk = 1\nk = 2'), (e) => e.code === 'DUP_KEY');
    assert.throws(() => parse('just words'), (e) => e.code === 'BAD_LINE');
    assert.throws(() => parse('[]'), (e) => e.code === 'BAD_SECTION');
    assert.throws(() => parse('= novalue'), (e) => e.code === 'BAD_KEY');
    assert.ok(new IniError('X') instanceof Error);
  });
});

describe('stringify', () => {
  it('round-trips canonical documents', () => {
    const doc = parse(SAMPLE);
    assert.deepEqual(parse(stringify(doc)), doc);
    assert.equal(stringify({}), '');
  });
  it('rejects bad documents', () => {
    assert.throws(() => stringify([]), (e) => e.code === 'BAD_DOC');
    assert.throws(() => stringify({ s: { 'a=b': '1' } }), (e) => e.code === 'BAD_KEY');
  });
});
