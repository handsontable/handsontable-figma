# CONCERNS.md

Known sharp edges, technical debt, and behaviors that are easy to get wrong.

## `/output` is destroyed on every run

`index.js::main()` calls `rmSync(OUTPUT_PATH, { recursive: true })` before regenerating. Do not keep anything valuable under `/output`. The directory is gitignored (see `.gitignore`), so regeneration will not appear in PR diffs — the artifacts must be generated downstream (or by a release step) rather than reviewed in VCS.

## Silent drops

- Tokens present in `tokens.json` but not listed in `tokensKeys.js` are **silently dropped** from per-theme output. There is no warning. If a design change doesn't show up in the generated CSS, this is the first place to check.
- `processTokenValue` returns `null` when a token isn't found at all, and the null is filtered by `processThemeTokens`. Again, no warning.
- `mode` references that don't resolve both a light and a dark variant return `null` (see `processReference` case `MODE_KEY`: it requires `result.length === 2`).

## Hardcoded icon-set branching

`utils/cssGeneration.js::generateThemeCss` has:

```js
if (themeName === "horizon") {
  css += iconsMap(ICONS_SET.horizon, ...);
} else {
  css += iconsMap(ICONS_SET.main, ...);
}
```

Adding a third icon family requires editing this branch. `ICONS_SET` is the only other place that needs updating for the standalone `ht-icons-<name>.css` file to appear.

## No input validation

`loadTokens()` only handles the missing-file case (with a friendly error and `process.exit(1)`). A malformed or partially-populated `tokens.json` will fail somewhere deep in `generateAllVariables` with a harder-to-diagnose error. If you're debugging a weird crash, first verify the shape of `tokens.json` matches what `generateAllVariables` expects: top-level `sizing`, `density`, `colors`, `themes`.

## Unit heuristics are name-based

`formatValue` decides units from substrings of the *key name* (`"opacity"` → `%`, `"transition"` → `s`, else `px`). A future token whose name doesn't follow this pattern will get the wrong unit. Fix is to extend `formatValue`, not to inline a unit in `tokens.json`.

## `EXCEPTION_KEYS` affects two generators differently

- In `themeProcessing.js::formatValue`, these keys bypass **unit formatting**.
- In `jsGeneration.js::convertKeysToCamelCase`, values under these keys bypass **reference-camelCase conversion** (so a font stack string isn't munged).

Both behaviors must stay in sync. Currently the list contains only `"font-family"`.

## No tests

There is no test suite. The only safeguard against regressions is:
1. Running `npm start` and comparing `/output` diffs against expectations.
2. Manually integrating the output into a Handsontable instance and verifying rendering.

Treat changes to `utils/themeProcessing.js` with extra care — there is no automated check that reference resolution still produces the same output for a given `tokens.json`.

## The `.ai/` self-improvement rule

When an AI agent discovers information in `AGENTS.md` / `CLAUDE.md` / `.ai/` that is **incorrect, outdated, or missing**, update the correct file immediately as part of the current task. Do not defer.

| What changed | Update where |
|---|---|
| Pipeline / data-flow change | `.ai/ARCHITECTURE.md` |
| New or renamed file / directory | `.ai/STRUCTURE.md` |
| Node / tooling / script change | `.ai/STACK.md` |
| Naming rule, formatting rule, new exception key | `.ai/CONVENTIONS.md` |
| New gotcha / footgun / silent failure | this file |
| Quick-reference item that every agent should see first | `AGENTS.md` |
