import { toPascalCase } from '../stringUtils';

export function generateTypeScript(ir, config) {
    const { rootClassName = 'Root' } = config;
    const interfaces = [];

    function processType(name, node) {
        if (node.type === 'object') {
            const interfaceName = toPascalCase(name);
            const fields = [];
            Object.entries(node.fields).forEach(([key, value]) => {
                // for naming sub-types
                let subName = key;
                if (value.type === 'array') {
                    if (subName.endsWith('s')) subName = subName.slice(0, -1);
                }

                const typeName = getTypeName(subName, value);
                // handle rename if needed, but TS usually matches JSON unless mapped.
                // We'll quote keys if they are invalid identifiers? No for now assume simple keys.
                fields.push({ key, type: typeName });
            });
            interfaces.push({ name: interfaceName, fields });
            return interfaceName;
        } else if (node.type === 'array') {
            // array logic
            let subName = name;
            if (subName.endsWith('s')) subName = subName.slice(0, -1);
            const itemType = processType(subName, node.itemType);
            return `${itemType}[]`;
        }
        return getPrimitiveType(node.type);
    }

    function getTypeName(name, node) {
        return processType(name, node);
    }

    function getPrimitiveType(type) {
        switch (type) {
            case 'string': return 'string';
            case 'number': return 'number';
            case 'boolean': return 'boolean';
            case 'null': return 'null';
            default: return 'any';
        }
    }

    processType(rootClassName, ir.root);

    let output = '';
    interfaces.reverse().forEach(iface => {
        output += `export interface ${iface.name} {\n`;
        iface.fields.forEach(f => {
            // Optional check?
            output += `  ${f.key}: ${f.type};\n`;
        });
        output += `}\n\n`;
    });

    return output;
}
