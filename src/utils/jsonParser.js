/**
 * Analyzes a value and guesses its type.
 * Options can configure specific behaviors (e.g., int vs float).
 */
function analyzeValue(value, options = {}) {
    if (value === null) {
        return { type: 'null' };
    }

    const type = typeof value;

    if (type === 'string') {
        return { type: 'string', value }; // Keep sample value for enum detection later
    }

    if (type === 'number') {
        const isFloat = !Number.isInteger(value);
        return { type: 'number', isFloat };
    }

    if (type === 'boolean') {
        return { type: 'boolean' };
    }

    if (Array.isArray(value)) {
        // Analyze array items to determine the common type
        // For now, we take the first item or merge types (advanced)
        // Simple version: grab the first non-null item to guess type
        const firstNonNull = value.find(v => v !== null);
        if (firstNonNull === undefined) {
            return { type: 'array', itemType: { type: 'any' } };
        }
        const itemType = analyzeValue(firstNonNull, options);
        return { type: 'array', itemType };
    }

    if (type === 'object') {
        // Recursive analysis for objects
        const fields = {};
        for (const [key, val] of Object.entries(value)) {
            fields[key] = analyzeValue(val, options);
        }
        return { type: 'object', fields };
    }

    return { type: 'any' };
}

/**
 * Parses JSON string and returns an Intermediate Representation (IR).
 * @param {string} jsonString - The raw JSON code.
 * @param {object} options - Parsing options.
 * @returns {object} { root: IR, error: string|null }
 */
export function parseAndAnalyzeJson(jsonString, options = {}) {
    if (!jsonString || jsonString.trim() === '') {
        return { root: null, error: null };
    }

    try {
        const parsed = JSON.parse(jsonString);
        const root = analyzeValue(parsed, options);

        // IF the root is an array, we might want to treat the definition as the item type (List<Model>)
        // or wrap it. For this tool, usually users paste a sample Object or a List of Objects.
        // We will preserve the root type.

        return { root, error: null };
    } catch (e) {
        return { root: null, error: e.message };
    }
}
