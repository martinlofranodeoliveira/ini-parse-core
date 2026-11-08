# Contract — ini-parse-core

Pure ESM in `src/ini.mjs`, zero runtime dependencies, Node >= 22.
`[sections]`, `key = value` (or `key: value`), `;`/`#` comments, blank
lines. Values are raw strings — no quoting, no types, no inline-comment
stripping.

| Export | Result |
| --- | --- |
| `MAX_CHARS` (1M) · `MAX_LINES` (20000) | Hard bounds. |
| `parse(text)` | Frozen `{ section: { key: value } }` (`''` = pre-section globals). Duplicate sections merge; duplicate keys fail. |
| `stringify(doc)` | Canonical text (`k = v`, globals first). `parse(stringify(d))` is a fixed point. |

Line-shape errors are specific: `=`/`:`-led → `BAD_KEY`, `[`-led →
`BAD_SECTION`, otherwise `BAD_LINE`.

Errors: `NOT_STRING` · `TOO_BIG` · `TOO_MANY_LINES` · `BAD_SECTION` ·
`BAD_LINE` · `BAD_KEY` · `DUP_KEY` · `BAD_DOC` · `BAD_VALUE`.
