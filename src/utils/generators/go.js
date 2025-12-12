import { toPascalCase } from '../stringUtils'; // Go public fields are PascalCase

export function generateGo(ir, config) {
    const { rootClassName = 'Root', packageName = 'main' } = config;
    const structs = [];

    function processType(name, node) {
        if (node.type === 'object') {
            const structName = toPascalCase(name);
            const fields = [];
            Object.entries(node.fields).forEach(([key, value]) => {
                let subName = key;
                if (value.type === 'array' && subName.endsWith('s')) subName = subName.slice(0, -1);

                const typeName = getTypeName(subName, value);
                // Go fields PascalCase
                fields.push({ key, name: toPascalCase(key), type: typeName });
            });
            structs.push({ structName, fields });
            return structName;
        } else if (node.type === 'array') {
            let subName = name;
            if (subName.endsWith('s')) subName = subName.slice(0, -1);
            const itemType = processType(subName, node.itemType);
            return `[]${itemType}`;
        }
        return getPrimitiveType(node.type);
    }

    function getTypeName(name, node) {
        return processType(name, node);
    }

    function getPrimitiveType(type) {
        switch (type) {
            case 'string': return 'string';
            case 'number': return 'float64';
            case 'boolean': return 'bool';
            default: return 'interface{}';
        }
    }

    processType(rootClassName, ir.root);

    let output = `package ${packageName}\n\n`;

    structs.reverse().forEach(s => {
        output += `type ${s.structName} struct {\n`;
        s.fields.forEach(f => {
            output += `\t${f.name} ${f.type} \`json:"${f.key}"\`\n`;
        });
        output += `}\n\n`;
    });

    return output;
}
