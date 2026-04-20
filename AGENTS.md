# AGENTS.md

## Overview

A small Node.js (ESM) build tool that reads a `tokens.json` file exported from the Figma "Design Tokens" plugin and generates Handsontable theme files — both CSS stylesheets and JS modules — into `/output`. There are no tests, no linter, and no bundler; the pipeline is a single `npm start`.

For deeper context on specific topics, see the `.ai/` directory:

| File | Topic |
|---|---|
| `.ai/STACK.md` | Runtime, dependencies, scripts, formatting config |
| `.ai/STRUCTURE.md` | Repo layout, key files, I/O contract |
| `.ai/ARCHITECTURE.md` | Three-stage pipeline: reference resolution → JS → CSS |
| `.ai/CONVENTIONS.md` | Naming rules, how to add a token / theme / icon |
| `.ai/CONCERNS.md` | Known gotchas, silent failures, technical debt |

---

## Self-improvement rule

When an AI agent discovers that information in this file or `.ai/` is **incorrect, outdated, or missing**, update the correct file immediately as part of the current task. Do not defer.

| What changed | Update where |
|---|---|
| Pipeline / data-flow change | `.ai/ARCHITECTURE.md` |
| New or renamed file / directory | `.ai/STRUCTURE.md` |
| Node / tooling / script change | `.ai/STACK.md` |
| Naming rule, formatting rule, new exception key | `.ai/CONVENTIONS.md` |
| New gotcha / footgun / silent failure | `.ai/CONCERNS.md` |
| Quick-reference item every agent should see first | this file |

Never duplicate detailed content across files — reference the authoritative `.ai/` file instead.

---

## Common pitfalls

Read this before making changes.

| Pitfall | What to do instead |
|---|---|
| Adding a Figma token and expecting it in the output | Also add the hyphen-case key to `tokensKeys.js` — unlisted tokens are silently dropped. See `.ai/CONVENTIONS.md`. |
| Hand-editing files under `/output` | The whole directory is wiped on every `npm start`. Change `utils/` or the input instead. |
| Adding a new icon family and only updating `ICONS_SET` | Also update the hardcoded branch in `utils/cssGeneration.js::generateThemeCss` that picks between `main` and `horizon`. See `.ai/CONCERNS.md`. |
| Inlining a unit in `tokens.json` (e.g., `"16px"`) | Values are numeric; units are added by `formatValue` based on key name (`px`/`%`/`s`). Extend `formatValue` for a new unit category. |
| Putting a `font-family`-style verbatim string through the pipeline | Add the key to `EXCEPTION_KEYS` in `utils/constants.js` so both unit formatting and reference-camelCase conversion are skipped. |
| Omitting the `.js` extension in an import | This is an ESM project (`"type": "module"`); Node requires the extension. |
| Editing `/output/variables/helpers/iconsMap.js` | It's copied verbatim from `utils/helpers/iconsMap.js` on each run. Edit the source. |
| Assuming `tokens.json` is in git | It's gitignored and user-provided — exported from the Figma Design Tokens plugin. Missing-file errors come from `loadTokens()`. |

---

## Prerequisites

- **Node.js 20+** (required for top-level ESM and modern `fs` APIs).
- **`tokens.json` at repo root** — not in git; exported from the Figma "Design Tokens" plugin per the steps in `README.md`.

---

## Build, format

- `npm start` — run the whole pipeline (`node index.js`). Wipes `/output` and regenerates everything.
- `npm run format` — Prettier over the repo.
- `npm run format:check` — check-only (useful in CI).

There is no `npm test` and no `npm run lint`.

---

## Repo snapshot

- `index.js` — entry point, orchestrator.
- `tokensKeys.js` — ordered allow-list of token keys to emit per theme.
- `utils/constants.js` — all shared keys, paths, `ICONS_SET`, `EXCEPTION_KEYS`, `VARIANTS`.
- `utils/themeProcessing.js` — stage 1: resolve Figma `{path.to.ref}` references, format values.
- `utils/jsGeneration.js` — stage 2: emit `output/variables/**` (camelCase JS modules).
- `utils/cssGeneration.js` — stage 3: emit `output/css/**` (`--ht-*` custom properties).
- `utils/helpers/{fileSystem,tokenReference,iconsMap}.js` — shared utilities.
- `icons/{main,horizon}.js` — hand-maintained icon name → SVG data URI maps.

Full layout: `.ai/STRUCTURE.md`. Pipeline detail: `.ai/ARCHITECTURE.md`.

---

## Output artifact shape

Each run produces, for every theme in `tokens.json`:

- `output/css/theme/ht-theme-<name>.css` (with icons) and `ht-theme-<name>-no-icons.css` (without).
- `output/variables/tokens/<name>.js` and `colors/<name>.js`.

Plus shared artifacts: `output/variables/sizing.js`, `density.js`, `icons/<name>.js`, `helpers/iconsMap.js`, and `output/css/icons/ht-icons-<name>.css`.

Downstream consumption is the `handsontable` package — see `README.md` for the two usage options (CSS class or `registerTheme` JS API).
