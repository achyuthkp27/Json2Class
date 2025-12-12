import React from 'react';
import { BadgeAlert, CheckCircle, Copy, Trash2, FileJson } from 'lucide-react';
import styles from './JsonPanel.module.css';

export const JsonEditor = ({ value, onChange, error, onFormat }) => {
    return (
        <div className={styles.editorContainer}>
            <div className={styles.editorToolbar}>
                <div className={styles.status}>
                    {error ? (
                        <span className={styles.errorText}><BadgeAlert size={14} /> Invalid JSON</span>
                    ) : (
                        <span className={styles.validText}><CheckCircle size={14} /> Valid JSON</span>
                    )}
                </div>
                <div className={styles.actions}>
                    <button onClick={() => onChange('')} className={styles.iconBtn} title="Clear">
                        <Trash2 size={16} />
                    </button>
                    <button onClick={onFormat} className={styles.iconBtn} title="Prettify">
                        <FileJson size={16} />
                    </button>
                </div>
            </div>
            <textarea
                className={styles.textarea}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder='{ "paste": "your json here" }'
                spellCheck="false"
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
    );
};
