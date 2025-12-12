import React, { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-go';
import { Copy, Download, Check } from 'lucide-react';
import { TabGroup } from '../Shared';
import styles from './CodePanel.module.css';
import { useSparkles, Sparkles } from '../Effects/Sparkles';

export const CodePreview = ({ code, language, onLanguageChange, availableLanguages }) => {
    const codeRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const { sparkles, triggerSparkles } = useSparkles();

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [code, language]);

    const handleCopy = (e) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        triggerSparkles(e); // Trigger sparkles
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = (e) => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Model.${language}`; // Simple name for now
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        triggerSparkles(e); // Trigger sparkles on download too
    };

    return (
        <div className={styles.panelContainer}>
            <Sparkles active={sparkles.active} x={sparkles.x} y={sparkles.y} />
            <div className={styles.toolbar}>
                <TabGroup
                    tabs={availableLanguages}
                    activeTab={language}
                    onTabChange={onLanguageChange}
                />
                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={handleCopy} title="Copy">
                        {copied ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
                    </button>
                    <button className={styles.actionBtn} onClick={handleDownload} title="Download">
                        <Download size={16} />
                    </button>
                </div>
            </div>

            <div className={styles.codeWrapper}>
                <pre className={styles.pre}>
                    <code ref={codeRef} className={`language-${language}`}>
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
};
