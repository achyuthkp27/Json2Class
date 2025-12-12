import { toPascalCase, toCamelCase } from '../stringUtils';

export function generateDart(ir, config) {
    const { rootClassName = 'Root' } = config;
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
            case 'number': return 'num';
            case 'boolean': return 'bool';
            default: return 'dynamic';
        }
    }

    processType(rootClassName, ir.root);

    let output = '';

    classes.reverse().forEach(cls => {
        output += `class ${cls.className} {\n`;
        // Fields
        cls.fields.forEach(f => {
            output += `  ${f.type}? ${f.name};\n`;
        });

        output += `\n  ${cls.className}({\n`;
        cls.fields.forEach(f => {
            output += `    this.${f.name},\n`;
        });
        output += `  });\n`;

        output += `\n  ${cls.className}.fromJson(Map<String, dynamic> json) {\n`;
        cls.fields.forEach(f => {
            // Simple assignment for primitives, complex for nested?
            // MVP: Just assign, user refines
            output += `    ${f.name} = json['${f.key}'];\n`;
        });
        output += `  }\n`;

        output += `\n  Map<String, dynamic> toJson() {\n`;
        output += `    final Map<String, dynamic> data = new Map<String, dynamic>();\n`;
        cls.fields.forEach(f => {
            output += `    data['${f.key}'] = this.${f.name};\n`;
        });
        output += `    return data;\n`;
        output += `  }\n`;

        output += `}\n\n`;
    });

    return output;
}
