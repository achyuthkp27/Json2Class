import React from 'react';
import { Layers, Box, Braces } from 'lucide-react';
import styles from './CodePanel.module.css';

export const ModelSummary = ({ ir }) => {
    if (!ir) return null;

    // Calculate stats
    let classesCount = 0;
    let fieldsCount = 0;
    let maxDepth = 0;

    function traverse(node, depth) {
        maxDepth = Math.max(maxDepth, depth);
        if (node.type === 'object') {
            classesCount++;
            Object.values(node.fields).forEach(child => {
                fieldsCount++;
                traverse(child, depth + 1);
            });
        } else if (node.type === 'array') {
            traverse(node.itemType, depth);
        }
    }

    // Initial call
    if (ir) traverse(ir, 1);

    return (
        <div className={styles.summaryContainer}>
            <div className={styles.statItem}>
                <Box size={14} />
                <span>{classesCount} Classes</span>
            </div>
            <div className={styles.statItem}>
                <Layers size={14} />
                <span>{fieldsCount} Fields</span>
            </div>
            <div className={styles.statItem}>
                <Braces size={14} />
                <span>Depth: {maxDepth}</span>
            </div>
        </div>
    );
};
