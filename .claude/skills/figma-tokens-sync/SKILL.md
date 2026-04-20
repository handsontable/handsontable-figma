---
name: figma-tokens-sync
description: Use whenever a user of the handsontable-figma project pastes or updates `tokens.json`, asks to "add tokens", "sync", "audit", "validate" the tokens, regenerate themes, or mentions anything about missing/new design tokens, pagination buttons, notification tokens, or similar. Also trigger for questions about what's different between `tokens.json` and `tokensKeys.js`, or when the user reports that a design change isn't showing up in generated CSS. Don't wait for the user to explicitly say "skill" — the moment someone says they updated `tokens.json`, run this.
---

# Figma tokens sync

This skill owns the workflow for processing `tokens.json` in the handsontable-figma project: validating its structure, diffing its leaves against the allow-list in `tokensKeys.js`, flagging silent-override collisions, and regenerating `/output`.

## Why this skill exists

`tokensKeys.js` is an explicit allow-list. Leaves present in `tokens.json` but missing from `tokensKeys.js` are silently dropped — a designer can add a token in Figma and nothing will appear in the generated CSS. Worse, two leaves with the same terminal key name inside one theme collide: `findValueRecursively` in `utils/helpers/tokenReference.js` returns the first match, so one state's value silently shadows another's.

Manually eyeballing `tokens.json` (which is >100KB) to find these issues is error-prone. The bundled audit script does it deterministically.

## Workflow

### 1. Run the audit

```bash
python3 .claude/skills/figma-tokens-sync/scripts/audit_tokens.py
```

Runs from the repo root. Prints a JSON report to stdout and exits non-zero only on hard structural errors (missing file, invalid JSON, missing top-level key). A successful run always exits 0 — even when the report contains new keys or collisions.

The report has these fields:

- `themes` — list of theme names found.
- `total_leaves_per_theme` — sanity-check counts (excluding boolean-typed Figma mode switches like `common.icons.main`).
- `current_keys_count` — literals already in `tokensKeys.js`.
- `new` — leaf keys present in `tokens.json` but missing from `tokensKeys.js`. **These will be silently dropped from the output until added.**
- `stale` — keys in `tokensKeys.js` not present as a leaf in any theme. Likely safe to remove, but confirm with the user first — a theme might be mid-migration.
- `collisions` — leaves sharing a terminal key name inside one theme. See "Handling collisions" below.
- `suggested_groups` — `new` keys roughly grouped by prefix and state. A starting point, not a finished answer: always check how similar components are grouped in `tokensKeys.js` (e.g., `Primary Button` / `Secondary Button` / `Icon Button` all follow base → hover → disabled → focus ordering with blank lines between subsections).

### 2. Present findings to the user

Before touching any file, summarize for the user:

- Total new keys (with a bulleted breakdown by component — don't dump the raw JSON).
- Any collisions, and whether their values match across all themes. Use the language from "Handling collisions" below.
- Any stale keys, with a recommendation.

Ask the user which groups to add. If they've already told you ("add pagination buttons"), only propose that subset and mention the rest as a heads-up. If they said "everything new", propose all of it.

### 3. Handling collisions

For each collision:

- **`values_match: true` across all themes** — benign. The design intent is "this token is the same in both states". Add the key once; the first-match semantics produce one CSS variable that covers both states. Note the Figma duplication in your summary so the user can rename it later for clarity, but don't block on it.
- **`values_match: false` in any theme** — this is a problem: adding the key to `tokensKeys.js` will silently lose one state's value. Don't add it until the user resolves the duplication in Figma (typically by renaming the second occurrence to include the state prefix, following the pattern `<component>-<state>-<property>`, e.g., `pagination-button-disabled-border-color`).

Always surface collisions even when benign. A future value change could flip a benign collision into a data-losing one.

### 4. Edit `tokensKeys.js`

After approval, insert the new keys into `tokensKeys.js`. Preserve these conventions (which the file already follows):

- Keys are hyphen-case double-quoted strings, one per line, trailing comma.
- Sections use `// <Component Name> Variables` header comments.
- Multi-state components split into subsections in this order: **base → hover → active → focus → disabled → checked → indeterminate → open → close**. Blank line between subsections.
- `"density"` stays at the very bottom (it's a mode switch listed in `OTHER_VARIABLES`, not a token).
- Place new components near related existing ones, not at the end — e.g., pagination-button keys go right after the `// Pagination Variables` section, notification keys go near other overlay/dialog components.

Use Edit to insert, not Write — the file is ~400 lines and a targeted diff is easier to review.

### 5. Regenerate and verify

```bash
npm start
```

Then grep the generated CSS for at least one of the new variables to confirm references resolved cleanly:

```bash
grep -E "<a-new-variable-name>" output/css/theme/ht-theme-main.css
```

A reference that couldn't resolve would emit the raw dotted string (e.g., `tokens.foo-bar`) instead of a `var(...)`. If you see that, the issue is usually a Figma reference pointing at a token that itself isn't in `tokensKeys.js` — audit recursively until it resolves.

### 6. Report back

Summarize in the chat: which keys were added, to which sections, any collisions surfaced, whether `/output` regenerated cleanly, and any follow-ups (stale removals the user declined, Figma renames worth doing).

## Things that bite

- **Don't add boolean-typed leaves** like `common.icons.main` / `common.icons.horizon`. They're Figma mode flags for switching between icon sets, not design tokens. The audit script filters these out, but if you're auditing by hand, skip anything with `"type": "boolean"`.
- **`stale` entries aren't always safe to delete.** If the user is mid-refactor (removing a component from Figma), a stale entry might still be used by downstream Handsontable code. Default to surfacing them, not auto-removing.
- **`suggested_groups` is a heuristic**, not a schema. It splits by hyphen-state markers; keys like `cell-warning-background-color` end up in a standalone group when they really belong with other `// Cell State Variables`. Always look at existing sections to decide the final grouping.
- **`/output/` is wiped on every `npm start`** — no need to `rm` it first, and no point hand-editing anything there.
- **`tokens.json` is gitignored.** If the user is on a fresh clone and the file is missing, the audit script exits with a clear message pointing back to `README.md` for the Figma export steps. Don't try to fabricate a tokens file.

## Worked example (pagination buttons)

Input: user pastes a `tokens.json` that adds a pagination-button component under `component.buttons.pagination.{enabled,hover,disabled,focus}`.

Audit output:

- `new`: 10 unique pagination-button leaves (`pagination-button-{background,foreground,border}-color` plus `-hover-*`, `-disabled-*`, `-focus-*`).
- `collisions`: `pagination-button-border-color` appears under both `enabled` and `disabled` in all three themes, with `values_match: true`.

Action taken:

- Added 11 lines to `tokensKeys.js` under a new `// Pagination Button Variables` section (with `// Pagination Button Hover Variables`, `// Pagination Button Disabled Variables`, `// Pagination Button Focus Variables` subsections), placed immediately after the existing `// Pagination Variables` block.
- Surfaced the collision: "benign — border-color has identical values in enabled and disabled across all themes, so one CSS variable covers both. Worth renaming the disabled one to `pagination-button-disabled-border-color` in Figma for clarity, but not blocking."
- Ran `npm start`, grepped `output/css/theme/ht-theme-main.css` for `pagination-button`, confirmed 11 `--ht-pagination-button-*` variables appeared with all `var(...)` references resolved.
