import {
  OUTPUT_PATH,
  PREFIX,
  SIZING_KEY,
  DENSITY_KEY,
  COLORS_KEY,
  TOKENS_KEY,
  VARIANTS,
  OTHER_VARIABLES,
} from "./constants.js";
import { writeFileSync, ensureOutputDirectory } from "./helpers/fileSystem.js";
import { iconsMap } from "./helpers/iconsMap.js";
import { ICONS_SET } from "./constants.js";

// Default density level to use
const DEFAULT_DENSITY_LEVEL = "default";

/**
 * Converts underscores to hyphens in a string
 */
function toHyphen(str) {
  return str.replace(/_/g, "-");
}

/**
 * Converts a key to CSS variable name format
 */
function toCssVariableName(prefix, ...parts) {
  return `--${prefix}-${parts.map(toHyphen).join("-")}`;
}

/**
 * Formats a value as a CSS variable reference
 */
function toVarReference(prefix, ...parts) {
  return `var(${toCssVariableName(prefix, ...parts)})`;
}

/**
 * Converts a reference string like "sizing.size_4" to "var(--ht-sizing-size-4)"
 */
function convertReferenceToVar(value) {
  if (typeof value !== "string") {
    return value;
  }

  // Handle sizing references: "sizing.size_4" -> "var(--ht-sizing-size-4)"
  if (value.startsWith(`${SIZING_KEY}.`)) {
    const path = toHyphen(value.substring(SIZING_KEY.length + 1));

    return toVarReference(PREFIX, SIZING_KEY, path);
  }

  // Handle colors references: "colors.palette.100" -> "var(--ht-colors-palette-100)"
  // "colors.white" -> "var(--ht-colors-white)"
  if (value.startsWith(`${COLORS_KEY}.`)) {
    const path = toHyphen(value.substring(COLORS_KEY.length + 1).replace(/\./g, "-"));

    return toVarReference(PREFIX, COLORS_KEY, path);
  }

  // Handle density references: "density.gap" -> "var(--ht-density-gap)"
  if (value.startsWith(`${DENSITY_KEY}.`)) {
    const path = toHyphen(value.substring(DENSITY_KEY.length + 1));

    return toVarReference(PREFIX, DENSITY_KEY, path);
  }

  // Handle themes references: "themes.foreground_color" -> "var(--ht-foreground-color)"
  if (value.startsWith("themes.")) {
    const path = toHyphen(value.substring("themes.".length));

    return toVarReference(PREFIX, path);
  }

  return value;
}

/**
 * Generates sizing CSS variables
 */
function generateSizingVariables(sizing) {
  const lines = [];

  for (const [key, value] of Object.entries(sizing)) {
    const varName = toCssVariableName(PREFIX, SIZING_KEY, key);

    lines.push(`  ${varName}: ${value};`);
  }

  return lines;
}

/**
 * Generates density CSS variables from a specific density level
 */
function generateDensityVariables(density, level = DEFAULT_DENSITY_LEVEL) {
  const lines = [];
  const densityLevel = density[level];

  if (!densityLevel) {
    console.warn(`Density level "${level}" not found`);

    return lines;
  }

  for (const [key, value] of Object.entries(densityLevel)) {
    const varName = toCssVariableName(PREFIX, DENSITY_KEY, key);
    const cssValue = convertReferenceToVar(value);

    lines.push(`  ${varName}: ${cssValue};`);
  }

  return lines;
}

/**
 * Generates color CSS variables for a specific theme
 */
function generateColorVariables(colors, themeName) {
  const lines = [];
  const themeColors = colors[themeName];

  if (!themeColors) {
    console.warn(`Colors for theme "${themeName}" not found`);

    return lines;
  }

  for (const [category, values] of Object.entries(themeColors)) {
    if (typeof values === "object" && values !== null) {
      // Nested colors like primary.100, palette.50
      for (const [shade, value] of Object.entries(values)) {
        const varName = toCssVariableName(PREFIX, COLORS_KEY, category, shade);

        lines.push(`  ${varName}: ${value};`);
      }
    } else {
      // Top-level colors like white, black, transparent
      const varName = toCssVariableName(PREFIX, COLORS_KEY, category);

      lines.push(`  ${varName}: ${values};`);
    }
  }

  return lines;
}

/**
 * Formats a token value for CSS output
 */
function formatTokenValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  // Handle light/dark mode objects
  if (typeof value === "object" && value !== null) {
    const light = value[VARIANTS[0]];
    const dark = value[VARIANTS[1]];

    if (light !== undefined && dark !== undefined) {
      const lightVal = convertReferenceToVar(light);
      const darkVal = convertReferenceToVar(dark);
      return `light-dark(${lightVal}, ${darkVal})`;
    }

    return null;
  }

  return convertReferenceToVar(value);
}

/**
 * Generates token CSS variables for a specific theme
 */
function generateTokenVariables(tokens) {
  const lines = [];

  for (const [key, value] of Object.entries(tokens)) {
    const formattedValue = formatTokenValue(value);

    if (formattedValue !== null && !OTHER_VARIABLES.includes(key)) {
      const varName = toCssVariableName(PREFIX, key);
      lines.push(`  ${varName}: ${formattedValue};`);
    }
  }

  return lines;
}

/**
 * Generates a complete CSS file content for a theme
 */
function generateThemeCss(themeName, themeVariables, withIcons = false) {
  const { [SIZING_KEY]: sizing, [DENSITY_KEY]: density, [COLORS_KEY]: colors, [TOKENS_KEY]: tokens } = themeVariables;
  const themeTokens = tokens[themeName];

  if (!themeTokens) {
    console.warn(`No tokens found for theme: ${themeName}`);
    return null;
  }

  // Generate class selectors for all variants
  const baseClass = `.ht-theme-${themeName}`;
  const darkClass = `.ht-theme-${themeName}-dark`;
  const darkAutoClass = `.ht-theme-${themeName}-dark-auto`;

  const lines = [];

  // Combined selector for shared variables
  lines.push(`${baseClass},`);
  lines.push(`${darkClass},`);
  lines.push(`${darkAutoClass} {`);

  // Add sizing variables
  lines.push(...generateSizingVariables(sizing));

  // Add density variables (using comfortable density level)
  lines.push(...generateDensityVariables(density, themeTokens[DENSITY_KEY]));

  // Add color variables (using theme-specific colors)
  lines.push(...generateColorVariables(colors, themeName));

  // Add token variables
  lines.push(...generateTokenVariables(themeTokens));

  lines.push("}");

  // Add color-scheme declarations for each variant
  lines.push("");
  lines.push(`${baseClass} {`);
  lines.push("  color-scheme: light;");
  lines.push("}");

  lines.push("");
  lines.push(`${darkClass} {`);
  lines.push("  color-scheme: dark;");
  lines.push("}");

  lines.push("");
  lines.push(`${darkAutoClass} {`);
  lines.push("  color-scheme: light dark;");
  lines.push("}");

  if (withIcons) {
    lines.push("");
    if (themeName === "horizon") {
      lines.push(iconsMap(ICONS_SET.horizon, `${PREFIX}-theme-${themeName}`));
    } else {
      lines.push(iconsMap(ICONS_SET.main, `${PREFIX}-theme-${themeName}`));
    }
  }

  lines.push("");

  return lines.join("\n");
}

/**
 * Writes CSS theme files for all themes
 */
function writeCssThemeFiles(themeVariables) {
  const baseThemePath = `${OUTPUT_PATH}/css/theme`;
  const baseIconsPath = `${OUTPUT_PATH}/css/icons`;

  ensureOutputDirectory(baseThemePath);
  ensureOutputDirectory(baseIconsPath);

  const themeNames = Object.keys(themeVariables[TOKENS_KEY]);
  const iconsNames = Object.keys(ICONS_SET);

  console.log(`\n## CSS Generation ##`);
  console.log(`\n### CSS theme Generation ###`);

  for (const themeName of themeNames) {
    const cssContent = generateThemeCss(themeName, themeVariables);
    const cssContentWithIcons = generateThemeCss(themeName, themeVariables, true);

    if (cssContent) {
      const filePathNoIcons = `${baseThemePath}/${PREFIX}-theme-${themeName}-no-icons.css`;

      writeFileSync(filePathNoIcons, cssContent);

      console.log(`Generated: ${filePathNoIcons}`);

      const filePath = `${baseThemePath}/${PREFIX}-theme-${themeName}.css`;

      writeFileSync(filePath, cssContentWithIcons);

      console.log(`Generated: ${filePath}`);
    }
  }

  console.log(`\n### CSS icons Generation ###`);

  for (const iconName of iconsNames) {
    const icons = ICONS_SET[iconName];
    const cssContent = iconsMap(icons, `${PREFIX}-theme-${iconName}`);
    const filePath = `${baseIconsPath}/${PREFIX}-icons-${iconName}.css`;

    writeFileSync(filePath, cssContent);

    console.log(`Generated: ${filePath}`);
  }
}

export { writeCssThemeFiles, generateThemeCss };
