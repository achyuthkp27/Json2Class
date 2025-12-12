import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sun, Moon, Rocket } from 'lucide-react';
import { Button } from '../Shared';
import styles from './Header.module.css';

export const Header = ({ theme, toggleTheme }) => {
    const [subtitle, setSubtitle] = useState("Stop writing models by hand");
    const { scrollY } = useScroll();

    // Transform background opacity based on scroll
    const headerBackground = useTransform(
        scrollY,
        [0, 50],
        ['rgba(30, 41, 59, 0)', 'rgba(30, 41, 59, 0.7)']
    );

    const backdropBlur = useTransform(
        scrollY,
        [0, 50],
        ['blur(0px)', 'blur(16px)']
    );

    const borderBottom = useTransform(
        scrollY,
        [0, 50],
        ['1px solid transparent', '1px solid rgba(255,255,255,0.1)']
    );

    useEffect(() => {
        const texts = [
            "Stop writing models by hand.",
            "Paste JSON. Get classes.",
            "One JSON. Many languages."
        ];
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % texts.length;
            setSubtitle(texts[index]);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.header
            className={styles.header}
            style={{
                backgroundColor: headerBackground,
                backdropFilter: backdropBlur,
                borderBottom: borderBottom
            }}
        >
            <div className={styles.logoSection}>
                <motion.div
                    className={styles.iconWrapper}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Rocket size={24} className={styles.icon} />
                </motion.div>
                <div>
                    <h1 className={styles.title}>JSON Model Studio</h1>
                    <motion.p
                        key={subtitle}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className={styles.subtitle}
                    >
                        {subtitle}
                    </motion.p>
                </div>
            </div>

            <div className={styles.actions}>
                <Button variant="secondary" onClick={toggleTheme} className={styles.themeBtn}>
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
            </div>
        </motion.header>
    );
};
