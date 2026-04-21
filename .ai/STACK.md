# STACK.md

## Runtime

- **Node.js 20+** (hard requirement; uses top-level ESM, `fs` sync APIs, and no transpilation step).
- **ESM only.** `package.json` has `"type": "module"`; all source files use `import`/`export` and the `.js` extension in import paths is required.

## Dependencies

- **No runtime dependencies.** Everything is built on the Node standard library (`fs`).
- **Dev dependencies:** `prettier` only. There is no bundler, no test framework, no linter, and no TypeScript.

## Scripts (`package.json`)

| Script | What it does |
|---|---|
| `npm start` | `node index.js` — the whole build. |
| `npm run format` | `prettier --write .` |
| `npm run format:check` | `prettier --check .` |

## Formatting

Prettier config (`.prettierrc`):

- `semi: true`
- `singleQuote: false` (double quotes in source files)
- `tabWidth: 2`
- `trailingComma: "es5"`
- `printWidth: 120`
- `bracketSpacing: true`
- `arrowParens: "always"`

Note: the *generated* JS in `/output` uses **single quotes** for non-icon files and **double quotes** for icon files — this is a deliberate choice inside `utils/jsGeneration.js` (`toSingleQuotedString` / `toDoubleQuotedString`), not a Prettier run over the output.

## External contract

The tool produces files that are consumed by the [`handsontable`](https://handsontable.com) package — specifically its `registerTheme` API (JS output) and the `theme` class-name option (CSS output). The README shows the exact import paths the generated files are meant to land at in a downstream Handsontable install.
