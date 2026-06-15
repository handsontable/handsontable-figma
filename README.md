# Figma UI kit for Handsontable

> **This repository is archived.** The theme generator has moved into the [handsontable](https://github.com/handsontable/handsontable) monorepo at [`handsontable/scripts/themes/figma`](https://github.com/handsontable/handsontable/tree/develop/handsontable/scripts/themes/figma). Starting with **Handsontable 18.0.0**, the generated themes live in that repo and are consumed via the Theme API or CSS class names.

A tool for generating theme files from Figma design tokens.

## How to use

Use the generator in the monorepo — see its [README](https://github.com/handsontable/handsontable/tree/develop/handsontable/scripts/themes/figma#readme) for full instructions.

### Prerequisites

- Node.js 22 (see the monorepo `.nvmrc`)
- Access to Figma with design tokens

### Steps

1. Export design tokens from your Figma project:

    - Find the Design Tokens Plugin
        - Search for Design Tokens in the Plugins & Widgets section of Figma.

    - Open the Plugin and Select Export
        - Launch the Design Tokens Plugin.
        - Click Export Design Token File.
    
    - Adjust Export Settings
        - Deselect all Include types in export options, except for Figma Variables.
        - Click Export to save the JSON file to your computer.

    You can find the instructions in the [Design System in Figma](https://www.figma.com/community/file/1487445656371116081), under the "Create Custom Theme" tab.

2. Set up the theme generator:

    - Clone the [handsontable](https://github.com/handsontable/handsontable) repository
    - Place the exported `tokens.json` file at `handsontable/scripts/themes/figma/tokens.json` (gitignored)

3. Generate theme files:

    - From the `handsontable/` package root, run `npm run generate:themes`
    - The generated files are written to `handsontable/src/themes/static/`
    - Review and commit the regenerated files under `src/themes/static/`

## Output Structure

The generator writes the following files to `handsontable/src/themes/static/`:

### CSS Files

- `css/theme/ht-theme-[name].css` - Complete theme CSS with icons
- `css/theme/ht-theme-[name]-no-icons.css` - Theme CSS without icons
- `css/icons/ht-icons-[name].css` - Standalone icon CSS files

Each theme CSS file includes CSS custom properties for:
- Sizing variables (`--ht-sizing-*`)
- Density variables (`--ht-density-*`)
- Color variables (`--ht-colors-*`)
- Token variables (`--ht-*`)

Theme variants supported: `.ht-theme-[name]` (light), `.ht-theme-[name]-dark`, `.ht-theme-[name]-dark-auto`

### JS Files

- `variables/sizing.js` - Sizing scale values
- `variables/density.js` - Density/spacing presets
- `variables/colors/[name].js` - Color palette for each theme
- `variables/tokens/[name].js` - Theme tokens for each theme
- `variables/icons/[name].js` - Icon definitions
- `variables/helpers/iconsMap.js` - Helper for generating icon CSS

## Usage

Available from **Handsontable 18.0.0** onward.

### Option 1: JavaScript (Theme API)

Register a custom theme using the generated JS files:

```js
import { registerTheme } from 'handsontable/themes';
import icons from 'handsontable/themes/static/variables/icons/main';
import colors from 'handsontable/themes/static/variables/colors/main';
import tokens from 'handsontable/themes/static/variables/tokens/main';

const myTheme = registerTheme({
  name: 'theme_name',
  icons: icons,
  colors: colors,
  tokens: tokens,
});
```

Then apply the theme to your Handsontable instance:

```js
const hot = new Handsontable(container, {
  theme: myTheme,
  // ... other options
});
```

You can configure the color scheme using `setColorScheme()` with `'light'`, `'dark'`, or `'auto'` values. The `'auto'` option allows programmatic control over light/dark switching based on your application's logic.

### Option 2: CSS

Include the generated CSS file in your application:

```html
<link rel="stylesheet" href="ht-theme-main.css">
```

or

```js
import 'ht-theme-main.css';
```

Set the `theme` option to your theme class name in the Handsontable config:

```js
const hot = new Handsontable(container, {
  theme: 'ht-theme-main',
  // ... other options
});
```

For dark mode, use `.ht-theme-main-dark` or `.ht-theme-main-dark-auto` (follows system preference).

---

© 2012 - 2026 Handsoncode