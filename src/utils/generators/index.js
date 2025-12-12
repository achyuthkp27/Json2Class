import { generateJava } from './java';
import { generateTypeScript } from './typescript';
import { generateKotlin } from './kotlin';
import { generateDart } from './dart';
import { generateSwift } from './swift';
import { generateGo } from './go';

export const LANGUAGES = {
    JAVA: 'java',
    TYPESCRIPT: 'typescript',
    KOTLIN: 'kotlin',
    DART: 'dart',
    SWIFT: 'swift',
    GO: 'go',
};

const GENERATORS = {
    [LANGUAGES.JAVA]: generateJava,
    [LANGUAGES.TYPESCRIPT]: generateTypeScript,
    [LANGUAGES.KOTLIN]: generateKotlin,
    [LANGUAGES.DART]: generateDart,
    [LANGUAGES.SWIFT]: generateSwift,
    [LANGUAGES.GO]: generateGo,
};

export function generateCode(language, ir, config) {
    const generator = GENERATORS[language];
    if (!generator) {
        return `// No generator found for language: ${language}`;
    }

    try {
        return generator(ir, config);
    } catch (err) {
        console.error(err);
        return `// Error generating code: ${err.message}`;
    }
}
