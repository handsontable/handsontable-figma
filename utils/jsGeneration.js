import { OUTPUT_PATH, SIZING_KEY, DENSITY_KEY, OTHER_VARIABLES, ICONS_SET } from "./constants.js";
import { readFileSync, writeFileSync, ensureOutputDirectory } from "./helpers/fileSystem.js";

/**
 * Converts an object to a JS string with unquoted keys
 */
function toJsObject(obj, indent = 2) {
  const spaces = " ".repeat(indent);
  const entries = Object.entries(obj).map(([key, value]) => {
    const formattedValue =
      typeof value === "object" && value !== null ? toJsObject(value, indent + 2) : JSON.stringify(value);
    return `${spaces}${key}: ${formattedValue}`;
  });
  return `{\n${entries.join(",\n")}\n${" ".repeat(indent - 2)}}`;
}

/**
 * Writes JS theme files for theme variables
 */
function writeJsThemeFiles(themeVariables) {
  const jsPath = `variables`;
  const path = `${OUTPUT_PATH}/${jsPath}`;

  ensureOutputDirectory(path);

  console.log(`## JS Generation ##`);

  Object.entries(themeVariables).forEach(([key, value]) => {
    console.log(`\n### JS ${key} Generation ###`);

    if (key === SIZING_KEY || key === DENSITY_KEY) {
      writeFileSync(`${path}/${key}.js`, `export default ${toJsObject(value)}`);

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

        writeFileSync(`${filePath}/${subKey}.js`, `export default ${toJsObject(values)}`);

        console.log(`Generated: ${filePath}/${subKey}.js`);
      });
    }
  });

  const iconsPath = `${OUTPUT_PATH}/${jsPath}/icons`;

  ensureOutputDirectory(iconsPath);

  // Generate icons files
  Object.entries(ICONS_SET).forEach(([key, value]) => {
    writeFileSync(`${iconsPath}/${key}.js`, `export default ${toJsObject(value)}`);

    console.log(`Generated: ${iconsPath}/${key}.js`);
  });

  const helpersPath = `${OUTPUT_PATH}/${jsPath}/helpers`;

  ensureOutputDirectory(helpersPath);

  // Generate icons helper file from utils/icons.js
  const iconsHelperContent = readFileSync("./utils/helpers/iconsMap.js", "utf8");

  writeFileSync(`${helpersPath}/iconsMap.js`, iconsHelperContent);

  console.log(`Generated: ${helpersPath}/iconsMap.js`);
}

export { writeJsThemeFiles };
