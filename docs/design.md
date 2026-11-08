# Design — ini-parse-core

One line at a time: comments/blanks skipped, sections captured, then
the first `=` wins (colon only if no `=` matched... either separator,
key trimmed, value trimmed). Strictness is per-line with line numbers,
so a 20000-line file with one bad key reports exactly where.

Oracle: comments/globals/both separators/section merge, one case per
rejection, canonical round-trip. Types, quoting and interpolation are
out of scope by design.
