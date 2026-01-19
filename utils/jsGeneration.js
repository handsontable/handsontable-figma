import { OUTPUT_PATH, SIZING_KEY, DENSITY_KEY, OTHER_VARIABLES, ICONS_SET } from "./constants.js";
import { readFileSync, writeFileSync, ensureOutputDirectory } from "./helpers/fileSystem.js";

/**
 * Auto-generated file header
 */
const AUTO_GENERATED_HEADER = `/*
 * This file is auto-generated. Do not edit directly.
 */

`;

/**
 * ESLint disable comment for icons files
 */
const ESLINT_DISABLE_ICONS = `/* eslint-disable max-len, quotes */

`;

/**
 * Converts hyphen-case to camelCase (hyphens before digits become underscores)
 */
function toCamelCase(str) {
  return str
    .replace(/-(\d)/g, "_$1") // hyphen before digit → underscore
    .replace(/-([a-z])/g, (_, char) => char.toUpperCase()); // hyphen before letter → camelCase
}

/**
 * Converts reference values like "themes.background-secondary-color" to "themes.backgroundSecondaryColor"
 */
function convertValueReferenceToCamelCase(value) {
  if (typeof value !== "string") {
    return value;
  }

  // Split by dots, convert each part to camelCase, rejoin
  return value
    .split(".")
    .map((part) => toCamelCase(part))
    .join(".");
}

/**
 * Recursively converts all keys in an object from hyphen-case to camelCase
 * Also converts string values that are references (e.g., "themes.background-secondary-color")
 */
function convertKeysToCamelCase(obj) {
  if (typeof obj !== "object" || obj === null) {
    return convertValueReferenceToCamelCase(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[toCamelCase(key)] = convertKeysToCamelCase(value);
    return acc;
  }, {});
}

/**
 * Converts a value to a single-quoted string representation (for output files)
 */
function toSingleQuotedString(value) {
  if (typeof value === "string") {
    // Escape single quotes and backslashes, then wrap in single quotes
    const escaped = value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    return `'${escaped}'`;
  }
  return JSON.stringify(value);
}

/**
 * Converts a value to a double-quoted string representation (for icons)
 */
function toDoubleQuotedString(value) {
  if (typeof value === "string") {
    // Escape double quotes and backslashes, then wrap in double quotes
    const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `"${escaped}"`;
  }
  return JSON.stringify(value);
}

/**
 * Converts an object to a JS string with unquoted keys
 */
function toJsObject(obj, indent = 2, useDoubleQuotes = false) {
  const spaces = " ".repeat(indent);
  const stringFormatter = useDoubleQuotes ? toDoubleQuotedString : toSingleQuotedString;

  // Handle arrays
  if (Array.isArray(obj)) {
    const items = obj.map((item) =>
      typeof item === "object" && item !== null ? toJsObject(item, indent + 2, useDoubleQuotes) : stringFormatter(item)
    );
    return `[${items.join(", ")}]`;
  }

  const entries = Object.entries(obj).map(([key, value]) => {
    const formattedValue =
      typeof value === "object" && value !== null ? toJsObject(value, indent + 2, useDoubleQuotes) : stringFormatter(value);
    return `${spaces}${key}: ${formattedValue}`;
  });
  return `{\n${entries.join(",\n")}\n${" ".repeat(indent - 2)}}`;
}

/**
 * Writes JS theme files for theme variables
 */
function writeJsThemeFiles(themeVariables) {
  const jsPath = "variables";
  const path = `${OUTPUT_PATH}/${jsPath}`;

  ensureOutputDirectory(path);

  console.log("## JS Generation ##");

  Object.entries(themeVariables).forEach(([key, value]) => {
    console.log(`\n### JS ${key} Generation ###`);

    if (key === SIZING_KEY || key === DENSITY_KEY) {
      const camelCaseValue = convertKeysToCamelCase(value);
      writeFileSync(`${path}/${key}.js`, `${AUTO_GENERATED_HEADER}export default ${toJsObject(camelCaseValue)};\n`);

      console.log(`Generated: ${path}/${key}.js`);
    } else {
      Object.entries(value).forEach(([subKey, subValue]) => {
        const filePath = `${path}/${key}`;

        ensureOutputDirectory(filePath);

        const values = Object.entries(subValue).reduce((acc, [key, value]) => {
          if (!OTHER_VARIABLES.includes(key)) {
            acc[key] = value;
          }
          return acc;
        }, {});

        const camelCaseValues = convertKeysToCamelCase(values);
        writeFileSync(`${filePath}/${subKey}.js`, `${AUTO_GENERATED_HEADER}export default ${toJsObject(camelCaseValues)};\n`);

        console.log(`Generated: ${filePath}/${subKey}.js`);
      });
    }
  });

  const iconsPath = `${OUTPUT_PATH}/${jsPath}/icons`;

  ensureOutputDirectory(iconsPath);

  // Generate icons files (use double quotes and add semicolon)
  Object.entries(ICONS_SET).forEach(([key, value]) => {
    writeFileSync(`${iconsPath}/${key}.js`, `${ESLINT_DISABLE_ICONS}${AUTO_GENERATED_HEADER}export default ${toJsObject(value, 2, true)};\n`);

    console.log(`Generated: ${iconsPath}/${key}.js`);
  });

  const helpersPath = `${OUTPUT_PATH}/${jsPath}/helpers`;

  ensureOutputDirectory(helpersPath);

  // Generate icons helper file from utils/helpers/iconsMap.js
  const iconsHelperContent = readFileSync("./utils/helpers/iconsMap.js", "utf8");

  writeFileSync(`${helpersPath}/iconsMap.js`, `${ESLINT_DISABLE_ICONS}${AUTO_GENERATED_HEADER}${iconsHelperContent}`);

  console.log(`Generated: ${helpersPath}/iconsMap.js`);
}

export { writeJsThemeFiles };
