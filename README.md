# Figma UI kit for Handsontable

A tool for generating theme files from Figma design tokens.

## How to use

This tool helps you generate Handsontable theme files from Figma design tokens.

### Prerequisites

- Node.js version 20 or higher
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

    - Clone this repository
    - Run `npm install`
    - Place the exported `tokens.json` file in the root directory

3. Generate theme files:

    - Run `npm start` to generate the theme files
    - The generated files will appear in the `/output` directory

## Output Structure

The tool generates the following files in the `/output` directory:

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