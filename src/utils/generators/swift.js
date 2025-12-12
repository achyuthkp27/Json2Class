import { toPascalCase, toCamelCase } from '../stringUtils';

export function generateSwift(ir, config) {
    const { rootClassName = 'Root' } = config;
    const structs = [];

    function processType(name, node) {
        if (node.type === 'object') {
            const structName = toPascalCase(name);
            const fields = [];
            Object.entries(node.fields).forEach(([key, value]) => {
                let subName = key;
                if (value.type === 'array' && subName.endsWith('s')) subName = subName.slice(0, -1);

                const typeName = getTypeName(subName, value);
                fields.push({ key, name: toCamelCase(key), type: typeName });
            });
            structs.push({ structName, fields });
            return structName;
        } else if (node.type === 'array') {
            let subName = name;
            if (subName.endsWith('s')) subName = subName.slice(0, -1);
            const itemType = processType(subName, node.itemType);
            return `[${itemType}]`;
        }
        return getPrimitiveType(node.type);
    }

    function getTypeName(name, node) {
        return processType(name, node);
    }

    function getPrimitiveType(type) {
        switch (type) {
            case 'string': return 'String';
            case 'number': return 'Double'; // or Int
            case 'boolean': return 'Bool';
            default: return 'Any';
        }
    }

    processType(rootClassName, ir.root);

    let output = 'import Foundation\n\n';

    // Swift usually nests, but we can list flat too.
    structs.reverse().forEach(s => {
        output += `struct ${s.structName}: Codable {\n`;
        s.fields.forEach(f => {
            output += `    let ${f.name}: ${f.type}?\n`;
        });

        // Coding keys if needed options...

        output += `}\n\n`;
    });

    return output;
}
