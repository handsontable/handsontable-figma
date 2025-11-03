const { OUTPUT_PATH } = require('./constants');
const { writeFileSync } = require('./fileSystem');

/**
 * Generates SCSS mixin content for a variant (light/dark)
 */
function generateVariantMixin(variantKey, variantValue) {
    let output = `@mixin ${variantKey} {\n`;

    Object.entries(variantValue).forEach(([key, value]) => {
        output += `  ${key}: ${value};\n`;
    });

    output += `}\n\n`;

    return output;
}

/**
 * Generates SCSS mixin content for theme variables
 */
function generateThemeMixin(themeVariables) {
    let output = `@mixin theme {\n`;

    Object.entries(themeVariables).forEach(([key, value]) => {
        output += `  ${key}: ${value};\n`;
    });

    output += `}\n`;

    return output;
}

/**
 * Generates SCSS file content for a theme
 */
function generateSCSSContent(themeValues, themeVars) {
    let output = '';

    // Generate variant mixins (light/dark)
    Object.entries(themeValues).forEach(([variantKey, variantValue]) => {
        output += generateVariantMixin(variantKey, variantValue);
    });

    // Generate theme mixin
    output += generateThemeMixin(themeVars);

    return output;
}

/**
 * Writes SCSS files for all themes
 */
function writeThemeFiles(modeVariables, themeVariables) {
    Object.entries(modeVariables).forEach(([themeKey, themeValues]) => {
        const scssContent = generateSCSSContent(themeValues, themeVariables[themeKey]);
        const filePath = `${OUTPUT_PATH}/${themeKey}.scss`;

        writeFileSync(filePath, scssContent);
    });
}

module.exports = {
    generateVariantMixin,
    generateThemeMixin,
    generateSCSSContent,
    writeThemeFiles,
};

