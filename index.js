const { ensureOutputDirectory, loadTokens } = require('./utils/fileSystem');
const { generateAllVariables } = require('./utils/themeProcessing');
const { writeThemeFiles } = require('./utils/scssGeneration');

// ============================================================================
// Main Execution
// ============================================================================

function main() {
    ensureOutputDirectory();

    const themes = loadTokens();
    const { modeVariables, themeVariables } = generateAllVariables(themes);

    try {
        writeThemeFiles(modeVariables, themeVariables);

        console.log('Theme files generated successfully.');
    } catch (error) {
        console.error('Error generating theme files:', error);
    }
}

main();
