import React from 'react';
import { ToggleSwitch, Input } from '../Shared';
import styles from './JsonPanel.module.css';

export const Configuration = ({ config, onChange }) => {
    const updateConfig = (key, val) => onChange({ ...config, [key]: val });

    return (
        <div className={styles.configContainer}>
            <div className={styles.sectionTitle}>Global Settings</div>

            <div className={styles.row}>
                <ToggleSwitch
                    label="Root Class Name"
                    checked={true} // Dummy wrapper for styling consistency or just Input
                    onChange={() => { }}
                />
                <Input
                    value={config.rootClassName}
                    onChange={(e) => updateConfig('rootClassName', e.target.value)}
                    className={styles.smallInput}
                />
            </div>

            <div className={styles.divider} />
            <div className={styles.sectionTitle}>Naming Strategy</div>
            <div className={styles.row}>
                <label className={styles.label}>Coming soon: Custom naming strategies</label>
            </div>

            <div className={styles.divider} />
            <div className={styles.sectionTitle}>Advanced</div>
            <div className={styles.row}>
                <ToggleSwitch
                    label="Use Lombok (Java)"
                    checked={config.useLombok}
                    onChange={(val) => updateConfig('useLombok', val)}
                />
            </div>
            <div className={styles.row}>
                <ToggleSwitch
                    label="Strict Null Checks"
                    checked={config.strictNulls}
                    onChange={(val) => updateConfig('strictNulls', val)}
                />
            </div>
        </div>
    );
};
