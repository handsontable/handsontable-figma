import { rmSync, existsSync, loadTokens } from "./utils/helpers/fileSystem.js";
import { generateAllVariables } from "./utils/themeProcessing.js";
import { writeJsThemeFiles } from "./utils/jsGeneration.js";
import { writeCssThemeFiles } from "./utils/cssGeneration.js";
import { OUTPUT_PATH } from "./utils/constants.js";

// ============================================================================
// Main Execution
// ============================================================================

function main() {
  const themes = loadTokens();
  const { themeVariables } = generateAllVariables(themes);

  try {
    // Remove output directory if it exists
    if (existsSync(OUTPUT_PATH)) {
      rmSync(OUTPUT_PATH, { recursive: true });
    }

    writeJsThemeFiles(themeVariables);
    writeCssThemeFiles(themeVariables);

    console.log("\nTheme files generated successfully.");
  } catch (error) {
    console.error("\nError generating theme files:", error);
  }
}

main();
