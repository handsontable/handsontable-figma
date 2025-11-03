/**
 * Extracts the reference path from a token value (e.g., "{path.to.value}" -> "path.to.value")
 */
function getReferencePath(value) {
    if (!value || typeof value !== 'string') {
        return null;
    }

    const match = value.match(/^\{(.*)\}/);

    return match ? match[1] : null;
}

/**
 * Formats a CSS variable reference for theme tokens
 */
function formatThemeReference(refPath, prefix) {
    const paths = refPath.split('.');

    return `var(--${prefix}-${paths.at(-1)})`;
}

/**
 * Formats a CSS variable reference for mode tokens
 */
function formatModeReference(refPath, prefix) {
    const paths = refPath.split('.').slice(3);

    return `var(--${prefix}-${paths.join('-')})`;
}

module.exports = {
    getReferencePath,
    formatThemeReference,
    formatModeReference,
};

