import { toPascalCase, toCamelCase } from '../stringUtils';

export function generateKotlin(ir, config) {
    const { rootClassName = 'Root', packageName = 'com.example' } = config;
    const classes = [];

    function processType(name, node) {
        if (node.type === 'object') {
            const className = toPascalCase(name);

            const fields = [];
            Object.entries(node.fields).forEach(([key, value]) => {
                let subName = key;
                if (value.type === 'array' && subName.endsWith('s')) subName = subName.slice(0, -1);

                const typeName = getTypeName(subName, value);
                fields.push({ key, name: toCamelCase(key), type: typeName });
            });
            classes.push({ className, fields });
            return className;
        } else if (node.type === 'array') {
            let subName = name;
            if (subName.endsWith('s')) subName = subName.slice(0, -1);
            const itemType = processType(subName, node.itemType);
            return `List<${itemType}>`;
        }
        return getPrimitiveType(node.type);
    }

    function getTypeName(name, node) {
        return processType(name, node);
    }

    function getPrimitiveType(type) {
        switch (type) {
            case 'string': return 'String';
            case 'number': return 'Double'; // Smart switch later
            case 'boolean': return 'Boolean';
            default: return 'Any';
        }
    }

    processType(rootClassName, ir.root);

    let output = `package ${packageName}\n\n`;

    classes.reverse().forEach(cls => {
        output += `data class ${cls.className}(\n`;
        cls.fields.forEach((f, idx) => {
            const isLast = idx === cls.fields.length - 1;
            const comma = isLast ? '' : ',';
            // val name: Type
            // Handle rename logic simplified
            if (f.name !== f.key) {
                // output += `    @SerializedName("${f.key}")\n`; // library specific
            }
            output += `    val ${f.name}: ${f.type}? = null${comma}\n`; // Default nullable for safety in MVP
        });
        output += `)\n\n`;
    });

    return output;
}
