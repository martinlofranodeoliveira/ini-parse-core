// SPDX-License-Identifier: MIT
// INI parse and serialize: [sections], key=value (or key: value),
// ';'/'#' comments, blank lines. Duplicate keys fail; duplicate sections
// merge. Values are raw strings (no quoting, no types). No network, no I/O.

export const MAX_CHARS = 1000000;
export const MAX_LINES = 20000;

export class IniError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'IniError';
    this.code = code;
  }
}

/** Parse INI text -> frozen { section: frozen { key: value } }. '' = global. */
export function parse(input) {
  if (typeof input !== 'string') throw new IniError('NOT_STRING');
  if (input.length > MAX_CHARS) throw new IniError('TOO_BIG');
  const lines = input.replace(/\r\n?/g, '\n').split('\n');
  if (lines.length > MAX_LINES) throw new IniError('TOO_MANY_LINES');
  const out = new Map();
  const get = (section) => {
    if (!out.has(section)) out.set(section, new Map());
    return out.get(section);
  };
  let current = '';
  get(current);
  lines.forEach((raw, i) => {
    const line = raw.trim();
    const at = `line ${i + 1}`;
    if (line === '' || line.startsWith(';') || line.startsWith('#')) return;
    const section = /^\[([^\][\r\n]+)\]$/.exec(line);
    if (section) {
      current = section[1].trim();
      if (!current) throw new IniError('BAD_SECTION', at);
      get(current);
      return;
    }
    const kv = /^([^=:]+?)\s*[=](.*)$/.exec(raw) ?? /^([^=:]+?)\s*[:](.*)$/.exec(raw);
    if (!kv) {
      if (/^[=:]/.test(line)) throw new IniError('BAD_KEY', at);
      if (/^\[/.test(line)) throw new IniError('BAD_SECTION', at);
      throw new IniError('BAD_LINE', at);
    }
    const key = kv[1].trim();
    if (!key) throw new IniError('BAD_KEY', at);
    const scope = get(current);
    if (scope.has(key)) throw new IniError('DUP_KEY', `${at}: ${key}`);
    scope.set(key, kv[2].trim());
  });
  return Object.freeze(Object.fromEntries([...out].map(([s, m]) => [s, Object.freeze(Object.fromEntries(m))])));
}

/** Serialize back to canonical text (global first, then sections). */
export function stringify(doc) {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) throw new IniError('BAD_DOC');
  const lines = [];
  const entries = Object.entries(doc);
  for (const [section, kv] of entries) {
    if (!kv || typeof kv !== 'object' || Array.isArray(kv)) throw new IniError('BAD_DOC');
    if (section !== '') lines.push(`[${section}]`);
    for (const [k, v] of Object.entries(kv)) {
      if (/[\r\n]/.test(k) || /[\r\n]/.test(String(v))) throw new IniError('BAD_VALUE');
      if (k.includes('=') || k.includes(':') || k.trim() !== k || k === '') throw new IniError('BAD_KEY');
      lines.push(`${k} = ${v}`);
    }
    lines.push('');
  }
  if (lines.length && lines[lines.length - 1] === '') lines.pop();
  return (lines.length ? lines.join('\n') + '\n' : '');
}
