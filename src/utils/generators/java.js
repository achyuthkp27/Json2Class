import { toPascalCase, toCamelCase } from '../stringUtils';

export function generateJava(ir, config) {
    const { rootClassName = 'Root', packageName = 'com.example', useLombok = false } = config;
    const classes = [];

    // Helper to process object types and queue class generation
    function processType(name, node) {
        if (node.type === 'object') {
            const storedClassName = toPascalCase(name);

            // Check if similar class already exists? For now, we assume unique names or user handles duplicates
            // We will generate a class definition
            const fields = [];
            Object.entries(node.fields).forEach(([key, value]) => {
                const fieldName = toCamelCase(key);
                // Recursively determine type
                const typeName = getTypeName(key, value);
                fields.push({ name: fieldName, type: typeName, originalName: key });
            });

            classes.push({ className: storedClassName, fields });
            return storedClassName;
        } else if (node.type === 'array') {
            const itemType = processType(name + 'Item', node.itemType);
            return `List<${itemType}>`;
        } else {
            return getPrimitiveType(node.type); // basic types
        }
    }

    function getTypeName(key, node) {
        if (node.type === 'object') {
            return processType(key, node);
        } else if (node.type === 'array') {
            // array logic: simple heuristic
            // If item is object, we need a name for it. Usually 'Key' + 'Item' or just 'Key' (singularized)
            // singularize simplistic:
            let singular = key;
            if (key.endsWith('s')) singular = key.slice(0, -1);

            const itemType = processType(singular, node.itemType);
            return `List<${itemType}>`;
        }
        return getPrimitiveType(node.type);
    }

    function getPrimitiveType(type) {
        switch (type) {
            case 'string': return 'String';
            case 'number': return 'double'; // simplified, could be int/double based on analysis
            case 'boolean': return 'boolean';
            default: return 'Object';
        }
    }

    // Start generation
    processType(rootClassName, ir.root);

    // Output string builder
    let output = `package ${packageName};\n\n`;
    if (!useLombok) {
        // output += `import java.util.List;\n\n`; // Simplified imports
    } else {
        output += `import lombok.Data;\n\n`;
    }
    output += `import java.util.List;\n\n`;

    // Render Classes in reverse order (dependents first? Or just list them)
    // Actually order doesn't matter much in Java file if nested or same package
    // We'll just dump them one by one.

    classes.reverse().forEach(cls => {
        if (useLombok) output += `@Data\n`;
        output += `public class ${cls.className} {\n`;
        cls.fields.forEach(f => {
            // Annotation for original name
            // output += `    @SerializedName("${f.originalName}")\n`; // Gson style example
            output += `    private ${f.type} ${f.name};\n`;
        });

        if (!useLombok) {
            output += `\n    // Getters and Setters omitted for brevity in MVP\n`;
        }
        output += `}\n\n`;
    });

    return output;
}
