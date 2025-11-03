const { PREFIX, THEME_KEY, MODE_KEY, VARIANTS } = require('./constants');
const { tokensKeys } = require('../tokensKeys');
const { generateVariables } = require('./variableGeneration');

/**
 * Filters variables to only include those specified in tokensKeys
 */
function filterVariablesByKeys(variables) {
    return tokensKeys.reduce((acc, key) => {
        const variableKey = `--${PREFIX}-${key}`;
        acc[variableKey] = variables[variableKey];

        return acc;
    }, {});
}

/**
 * Processes mode variables for a specific theme and variant
 */
function processModeVariables(themes, themeKey, variant) {
    const mode = themes[MODE_KEY][variant][themeKey];

    return generateVariables({
        color: mode.color,
        common: mode.common,
    }, true);
}

/**
 * Processes theme variables for a specific theme
 */
function processThemeVariables(themeValues) {
    const variables = generateVariables(themeValues);

    return filterVariablesByKeys(variables);
}

/**
 * Generates all mode and theme variables from the tokens
 */
function generateAllVariables(themes) {
    const modeVariables = {};
    const themeVariables = {};

    VARIANTS.forEach((variant) => {
        Object.entries(themes[THEME_KEY]).forEach(([themeKey, themeValues]) => {
            // Initialize theme objects if needed
            if (!modeVariables[themeKey]) {
                modeVariables[themeKey] = {};
            }

            // Generate mode-specific variables (light/dark)
            modeVariables[themeKey][variant] = processModeVariables(themes, themeKey, variant);

            // Generate theme variables (only once per theme, not per variant)
            if (!themeVariables[themeKey]) {
                themeVariables[themeKey] = processThemeVariables(themeValues);
            }
        });
    });

    return { modeVariables, themeVariables };
}

module.exports = {
    filterVariablesByKeys,
    processModeVariables,
    processThemeVariables,
    generateAllVariables,
};

