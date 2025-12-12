import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import styles from './Shared.module.css';

export const Card = ({ children, className }) => (
    <div className={clsx(styles.card, className)}>
        {children}
    </div>
);

export const Button = ({ children, onClick, variant = 'primary', className, disabled }) => (
    <motion.button
        className={clsx(styles.button, styles[variant], className)}
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: 1.02, boxShadow: "0px 0px 8px rgb(99, 102, 241)" }}
        whileTap={{ scale: 0.95 }}
    >
        {children}
        {/* Ripple effect can be added here if we want manual DOM manipulation, but scale is cleaner for React */}
    </motion.button>
);

export const Input = ({ value, onChange, placeholder, className }) => (
    <input
        className={clsx(styles.input, className)}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
    />
);

export const ToggleSwitch = ({ checked, onChange, label }) => (
    <div className={styles.toggleWrapper} onClick={() => onChange(!checked)}>
        <motion.div
            className={clsx(styles.toggleTrack, checked && styles.checked)}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className={styles.toggleThumb}
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
            />
        </motion.div>
        {label && <span className={styles.toggleLabel}>{label}</span>}
    </div>
);

export const TabGroup = ({ tabs, activeTab, onTabChange }) => (
    <div className={styles.tabGroup}>
        {tabs.map(tab => (
            <button
                key={tab.id}
                className={clsx(styles.tab, activeTab === tab.id && styles.activeTab)}
                onClick={() => onTabChange(tab.id)}
            >
                {tab.label}
            </button>
        ))}
    </div>
);
