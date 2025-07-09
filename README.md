# Figma UI kit for Handsontable

A tool for generating theme files from Figma design tokens.

## How to use

This tool helps you generate Handsontable theme files from Figma design tokens. It works in conjunction with the main [Handsontable repository](https://github.com/handsontable/handsontable).

### Prerequisites

- Node.js version 20 or higher
- Access to Figma with design tokens
- A local clone of the [Handsontable repository](https://github.com/handsontable/handsontable)

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
    - Place the exported `tokens.json` file in the root directory

3. Generate theme files:

    - Run `npm start` to generate the theme files
    - The generated `.scss` files will appear in the `/output` directory

4. Apply the theme:

    - Copy the generated `.scss` files from `/output`
    - Paste them into the Handsontable themes directory at: `handsontable/src/styles/themes/`

5. Build and use the theme:

    - Build the project and include the generated CSS files from the `handsontable/styles` directory in your application. 
   
    If you've created a new theme, you also need to create a corresponding icon pack `handsontable/src/styles/themes/utils/[your-theme-name]/_icons.scss`:

    Alternatively, you can use an existing icon pack. To do so, simply replace `@use "utils/[your-theme-name]/icons";` with, for example, `@use "utils/main/icons";` in your `[your-theme-name].scss` file.

<br>

---

© 2012 - 2025 Handsoncode