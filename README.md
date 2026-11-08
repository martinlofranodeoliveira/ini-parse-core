# ini-parse-core

INI parse and serialize: sections, `key = value`, comments, duplicate-key
rejection. Zero runtime dependencies, Node >= 22.

Part of the LOFRANO TECNOLOGIA open-source lab. MIT.

```js
import { parse, stringify } from './src/ini.mjs';
parse('[db]\nhost = localhost'); // { '': {}, db: { host: 'localhost' } }
```

```sh
npm test          # 4 tests, node:test, no dependencies
npm run demo
```

Values are raw strings; at most 1M chars. MIT — see `LICENSE`.
[Versão em português](README.pt-BR.md).
