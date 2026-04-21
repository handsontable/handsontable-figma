# STRUCTURE.md

## Repo layout

```
handsontable-figma/
├── index.js                     # Entry point (npm start)
├── tokens.json                  # Input — exported from Figma (gitignored, user-provided)
├── tokensKeys.js                # Allow-list + ordering of token keys to emit per theme
├── package.json
├── .prettierrc / .prettierignore
├── .gitignore
├── README.md
├── AGENTS.md                    # Agent/contributor overview; CLAUDE.md → symlink to this
├── CLAUDE.md → AGENTS.md
├── LICENSE
├── icons/
│   ├── main.js                  # Icon name → SVG data URI for the "main" theme family
│   └── horizon.js               # Icon name → SVG data URI for the "horizon" theme
├── utils/
│   ├── constants.js             # All shared keys, paths, variants, ICONS_SET wiring
│   ├── themeProcessing.js       # Stage 1 — resolve Figma refs → in-memory `themeVariables`
│   ├── jsGeneration.js          # Stage 2 — serialize `themeVariables` to JS modules
│   ├── cssGeneration.js         # Stage 3 — serialize `themeVariables` to CSS custom props
│   └── helpers/
│       ├── fileSystem.js        # fs wrappers + `loadTokens()` (exits on missing file)
│       ├── tokenReference.js    # `{path.to.ref}` parsing and transformation utilities
│       └── iconsMap.js          # CSS generator for Handsontable icon selectors (copied to output)
└── output/                      # Wiped and regenerated on every `npm start`
    ├── css/
    │   ├── theme/ht-theme-<name>.css
    │   ├── theme/ht-theme-<name>-no-icons.css
    │   └── icons/ht-icons-<name>.css
    └── variables/
        ├── sizing.js
        ├── density.js
        ├── colors/<name>.js
        ├── tokens/<name>.js
        ├── icons/<name>.js
        └── helpers/iconsMap.js
```

## Key files

### `index.js`
Orchestrator. Calls `loadTokens()` → `generateAllVariables()` → wipes `/output` → `writeJsThemeFiles()` → `writeCssThemeFiles()`. Wraps the write phase in a try/catch that logs but does not re-throw.

### `utils/constants.js`
Every string used to key into the token tree lives here (`THEME_KEY`, `MODE_KEY`, `TOKENS_KEY`, `COLORS_KEY`, `DENSITY_KEY`, `SIZING_KEY`). Also defines:
- `VARIANTS = ["light", "dark"]` — drives mode-ref expansion.
- `OTHER_VARIABLES = ["density"]` — keys to strip from per-theme token output (because density is emitted separately).
- `EXCEPTION_KEYS = ["font-family"]` — values that skip unit formatting and camelCase conversion.
- `ICONS_SET` — map of theme name → icon set; used by both CSS and JS generators.

### `tokensKeys.js`
An explicit, ordered array of token keys. Only tokens listed here are emitted per theme. Adding a new design token almost always means adding a key here.

### `icons/*.js`
Hand-maintained icon sets — object literals mapping icon names (e.g., `arrowRight`, `check`, `caretHiddenLeft`) to SVG `data:` URIs. Changes here are visual and must be tested by regenerating output and inspecting the CSS.

## Input / output contract

- **Input:** `./tokens.json` at repo root (gitignored). Produced by Figma's "Design Tokens" plugin export. The loader (`utils/helpers/fileSystem.js::loadTokens`) calls `process.exit(1)` with a friendly message if the file is missing.
- **Output:** `./output/` — generated on every run, with every file prefixed by an `auto-generated` header comment. Do not hand-edit.
