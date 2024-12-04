const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { variableKeys } = require('./variableKeys');

const PREFIX = 'ht'
const THEME_KEY = 'ht_themes';
const TOKENS_PATH = './tokens.json';
const OUTPUT_PATH = './output';

const file = readFileSync(TOKENS_PATH, 'utf8');
const themes = JSON.parse(file);

if (!existsSync(OUTPUT_PATH)) {
    mkdirSync(OUTPUT_PATH);
}

const isValidHex = (hex) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex)
const getChunksFromString = (st, chunkSize) => st.match(new RegExp(`.{${chunkSize}}`, "g"))
const convertHexUnitTo256 = (hexStr) => parseInt(hexStr.repeat(2 / hexStr.length), 16)

function getAlphaFloat(a, alpha) {
    if (typeof a !== "undefined") { return a / 255 }
    if ((typeof alpha != "number") || alpha < 0 || alpha > 1) {
        return 1
    }

    return alpha
}

function hexToRGBA(hex, alpha) {
    if (!isValidHex(hex)) { throw new Error("Invalid HEX") }
    const chunkSize = Math.floor((hex.length - 1) / 3)
    const hexArr = getChunksFromString(hex.slice(1), chunkSize)
    const [r, g, b, a] = hexArr.map(convertHexUnitTo256)
    const alp = getAlphaFloat(a, alpha);

    if (alp === 1) {
        return `${hex.slice(0, -2)}`
    }

    return `rgba(${r}, ${g}, ${b}, ${alp > 0 ? alp.toFixed(2) : alp})`
}

function getReferencePath(value) {
    if (!value || typeof value !== "string") {
        return false;
    }

    const [, match] = value.match(/^\{(.*)\}/) || [];
    return match;
}

function findValue(obj, prop, variant) {
    const refPath = getReferencePath(prop?.value);

    if (refPath) {
        let current = obj;
        let paths = refPath.split(".");

        if (paths[0] === 'mode' && paths[1] === paths[2]) {
            paths = [paths[0], variant, ...paths.slice(2)];
        }

        for (let i = 0; i < paths.length; ++i) {
            if (current[paths[i]] === undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }

        return findValue(obj, current, variant)
    }

    return prop;
}

function updateValues(obj, variant) {
    if (typeof obj === 'object') {
        for (const key in obj) {
            if (obj[key].value === undefined) {
                updateValues(obj[key], variant);
            } else {
                const prop = obj[key];

                prop.value = findValue(themes, prop, variant)?.value

                if (prop.type === 'dimension' && typeof prop.value != 'string') {
                    prop.value = `${prop.value}${key.includes('transition') ? 's' : prop.value > 0 ? 'px' : ''}`;
                }

                obj[key] = prop;
            }
        }
    }

    return obj;
}

function generateVariables(obj) {
    const flattenRecursive = (obj, propertyMap = {}) => {
        for (const [key, prop] of Object.entries(obj)) {

            const property = `--${PREFIX}-${key}`;

            if (prop && typeof prop === 'object' && !('value' in prop)) {
                flattenRecursive(prop, propertyMap, key);
            } else {
                if (typeof prop.value === 'string' && prop.value.includes('#')) {
                    propertyMap[property] = `${hexToRGBA(prop.value)}`;
                } else {
                    propertyMap[property] = prop.value;
                }
            }
        }

        return propertyMap;
    };

    return flattenRecursive(obj);
}

const themesContent = {};

// Generate object structure for light and dark theme.
['light', 'dark'].forEach((variant) => {
    const themeClone = JSON.parse(JSON.stringify(themes));

    updateValues(themeClone, variant);

    Object.entries(themeClone[THEME_KEY]).forEach(([themeKey, themeValues]) => {
        if (!themesContent[themeKey]) {
            themesContent[themeKey] = {};
        }

        themesContent[themeKey][variant] = generateVariables(themeValues);
    });
});

// Generate theme scss content and save it to a file.
Object.entries(themesContent).forEach(([themeKey, themeValues]) => {
    let output = ''
    output += '@use "sass:color";\n';
    output += `@use "utils/${themeKey}/icons";\n\n`;

    Object.entries(themeValues).forEach(([variantKey, variantValue]) => {
        Object.entries(variantValue).forEach(([key, value]) => {
            if (variantKey === 'dark' && themesContent[themeKey]['light'][key] === value) {
                delete themesContent[themeKey]['dark'][key];
            }
        })

        output += `@mixin ${variantKey} {\n`;

        variableKeys.forEach(name => {
            const key = `--${PREFIX}-${name}`
            const value = variantValue[key];

            if (value) {
                if (typeof value === 'boolean') return;

                output += `  ${key}: ${value};\n`;
            }
        })

        output += `}\n\n`;
    });

    output += `.ht-theme-${themeKey},
.ht-theme-${themeKey}-dark,
.ht-theme-${themeKey}-dark-auto {
  @include light();
}

/* Dark mode */
.ht-theme-${themeKey}-dark {
  @include dark();
}

/* Auto dark mode */
@media (prefers-color-scheme: dark) {
  .ht-theme-${themeKey}-dark-auto {
    @include dark();
  }
}

/* Icons */
[class*=ht-theme-${themeKey}] {
  @include icons.output();
}
`

    writeFileSync(`${OUTPUT_PATH}/${themeKey}.scss`, output);
});

console.log("Theme files generated successfully.");
