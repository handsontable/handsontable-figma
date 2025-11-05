const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { OUTPUT_PATH, TOKENS_PATH } = require('./constants');

/**
 * Ensures the output directory exists, creating it if necessary
 */
function ensureOutputDirectory() {
    if (!existsSync(OUTPUT_PATH)) {
        mkdirSync(OUTPUT_PATH);
    }
}

/**
 * Loads and parses the tokens JSON file
 */
function loadTokens() {
    const fileContent = readFileSync(TOKENS_PATH, 'utf8');

    return JSON.parse(fileContent);
}

module.exports = {
    ensureOutputDirectory,
    loadTokens,
    writeFileSync,
};

