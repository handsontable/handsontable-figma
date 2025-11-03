const { PREFIX, THEME_KEY, MODE_KEY } = require('./constants');
const { hexToRGBA } = require('./colorConversion');
const { getReferencePath, formatThemeReference, formatModeReference } = require('./tokenReference');

/**
 * Converts a dimension value to a CSS string with appropriate unit
 */
function formatDimensionValue(value, key) {
    if (key.includes('transition')) {
        return `${value}s`;
    }

    return value > 0 ? `${value}px` : `${value}`;
}

/**
 * Processes a token value and converts it to the appropriate CSS format
 */
function processTokenValue(prop, prefix, useNestedKeyName, prevKeyName, key) {
    const propertyName = `--${prefix}-${useNestedKeyName ? `${prevKeyName}-${key}` : key}`;

    // Handle dimension types
    if (prop.type === 'dimension' && typeof prop.value !== 'string') {
        return {
            property: propertyName,
            value: formatDimensionValue(prop.value, key),
        };
    }

    // Handle hex color values
    if (typeof prop.value === 'string' && prop.value.includes('#')) {
        return {
            property: propertyName,
            value: hexToRGBA(prop.value),
        };
    }

    // Handle string values with references
    if (typeof prop.value === 'string') {
        const refPath = getReferencePath(prop.value);

        if (prop.value.includes(THEME_KEY) && refPath) {
            return {
                property: propertyName,
                value: formatThemeReference(refPath, prefix),
            };
        }

        if (prop.value.includes(MODE_KEY) && refPath) {
            return {
                property: propertyName,
                value: formatModeReference(refPath, prefix),
            };
        }

        return {
            property: propertyName,
            value: String(prop.value),
        };
    }

    // Default: convert to string
    return {
        property: propertyName,
        value: String(prop.value),
    };
}

/**
 * Recursively flattens a nested token object into a flat map of CSS variables
 */
function flattenTokensRecursive(obj, prefix, useNestedKeyName = false, propertyMap = {}, prevKeyName = '') {
    for (const [key, prop] of Object.entries(obj)) {
        // If it's a nested object without a 'value' property, recurse
        if (prop && typeof prop === 'object' && !('value' in prop)) {
            const newKeyName = prevKeyName ? `${prevKeyName}-${key}` : key;
            flattenTokensRecursive(prop, prefix, useNestedKeyName, propertyMap, newKeyName);
        } else {
            // Process the token value
            const { property, value } = processTokenValue(prop, prefix, useNestedKeyName, prevKeyName, key);
            propertyMap[property] = value;
        }
    }

    return propertyMap;
}

/**
 * Generates CSS variables from a token object
 */
function generateVariables(obj, useNestedKeyName = false) {
    return flattenTokensRecursive(obj, PREFIX, useNestedKeyName);
}

module.exports = {
    formatDimensionValue,
    processTokenValue,
    flattenTokensRecursive,
    generateVariables,
};

