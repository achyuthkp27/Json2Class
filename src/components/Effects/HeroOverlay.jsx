import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles as SparklesIcon, Zap, Code2 } from 'lucide-react';
import styles from './HeroOverlay.module.css';

export const HeroOverlay = ({ visible, onDismiss }) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4 }}
                >
                    <div className={styles.content}>
                        <motion.div
                            className={styles.iconRing}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                            <Code2 size={48} className={styles.icon} />
                        </motion.div>

                        <h2 className={styles.title}>Ready to Generate?</h2>
                        <p className={styles.description}>
                            Paste your JSON on the left to instantly generate strongly-typed models for
                            <strong> Java, Kotlin, Swift, TypeScript, Dart, and Go.</strong>
                        </p>

                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <Zap size={16} className={styles.featureIcon} />
                                <span>Instant Parsing</span>
                            </div>
                            <div className={styles.feature}>
                                <SparklesIcon size={16} className={styles.featureIcon} />
                                <span>Smart Type Guessing</span>
                            </div>
                        </div>

                        <motion.button
                            className={styles.ctaButton}
                            onClick={onDismiss}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start coding
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
