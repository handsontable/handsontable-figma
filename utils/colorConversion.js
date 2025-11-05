/**
 * Validates if a string is a valid hexadecimal color code
 */
function isValidHex(hex) {
    return /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);
}

/**
 * Splits a string into chunks of a specified size
 */
function getChunksFromString(str, chunkSize) {
    return str.match(new RegExp(`.{${chunkSize}}`, 'g'));
}

/**
 * Converts a hexadecimal unit to a 0-255 range value
 */
function convertHexUnitTo256(hexStr) {
    return parseInt(hexStr.repeat(2 / hexStr.length), 16);
}

/**
 * Calculates the alpha channel float value (0-1)
 */
function getAlphaFloat(alphaFromHex, alphaOverride) {
    if (typeof alphaFromHex !== 'undefined') {
        return alphaFromHex / 255;
    }

    if (typeof alphaOverride !== 'number' || alphaOverride < 0 || alphaOverride > 1) {
        return 1;
    }

    return alphaOverride;
}

/**
 * Converts a hexadecimal color to RGBA format
 */
function hexToRGBA(hex, alpha) {
    if (!isValidHex(hex)) {
        throw new Error('Invalid HEX color format');
    }

    const chunkSize = Math.floor((hex.length - 1) / 3);
    const hexArr = getChunksFromString(hex.slice(1), chunkSize);
    const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
    const alphaFloat = getAlphaFloat(a, alpha);

    // Return hex format if fully opaque
    if (alphaFloat === 1) {
        return hex.slice(0, -2);
    }

    return `rgba(${r}, ${g}, ${b}, ${alphaFloat > 0 ? alphaFloat.toFixed(2) : alphaFloat})`;
}

module.exports = {
    isValidHex,
    getChunksFromString,
    convertHexUnitTo256,
    getAlphaFloat,
    hexToRGBA,
};

