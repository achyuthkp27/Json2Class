import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const Sparkle = ({ style }) => {
    return (
        <motion.span
            style={{
                display: 'block',
                width: '10px',
                height: '10px',
                background: '#FFD700',
                borderRadius: '50%',
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 9999,
                // Using a star shape via clip-path
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                ...style,
            }}
            initial={{ scale: 0, opacity: 1, rotate: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [1, 1, 0], rotate: 180 }}
            transition={{ duration: 0.8 }}
        />
    );
};

export const Sparkles = ({ active, x, y, count = 10 }) => {
    if (!active) return null;

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <Sparkle
                    key={i}
                    style={{
                        top: y,
                        left: x,
                        marginLeft: random(-50, 50) + 'px',
                        marginTop: random(-50, 50) + 'px',
                        background: ['#FFD700', '#FF69B4', '#00BFFF'][random(0, 3)]
                    }}
                />
            ))}
        </>
    );
};

export const useSparkles = () => {
    const [sparkles, setSparkles] = useState({ active: false, x: 0, y: 0 });

    const triggerSparkles = (e) => {
        const { clientX, clientY } = e;
        setSparkles({ active: true, x: clientX, y: clientY });
        setTimeout(() => setSparkles({ active: false, x: 0, y: 0 }), 1000);
    };

    return { sparkles, triggerSparkles };
};
