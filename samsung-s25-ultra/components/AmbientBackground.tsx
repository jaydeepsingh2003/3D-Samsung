'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function AmbientBackground() {
    const { scrollYProgress } = useScroll();

    // Opacity Transforms for diverse sections
    // 1. Hero: Titanium White/Silver
    const opacity1 = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

    // 2. Camera: Samsung Cyan
    const opacity2 = useTransform(scrollYProgress, [0.15, 0.3, 0.45], [0, 1, 0]);

    // 3. Performance: Deep Indigo/Blue
    const opacity3 = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 1, 0]);

    // 4. S Pen: Subtle Amber/Gold
    const opacity4 = useTransform(scrollYProgress, [0.55, 0.7, 0.85], [0, 1, 0]);

    // 5. Galaxy AI: Purple/Violet
    const opacity5 = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* 1. Hero Glow */}
            <motion.div
                style={{ opacity: opacity1 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08)_0%,transparent_60%)] blur-3xl"
            />

            {/* 2. Camera Cyan Glow */}
            <motion.div
                style={{ opacity: opacity2 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,214,255,0.1)_0%,transparent_60%)] blur-3xl"
            />

            {/* 3. Performance Indigo Glow */}
            <motion.div
                style={{ opacity: opacity3 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(50,50,250,0.15)_0%,transparent_60%)] blur-3xl"
            />

            {/* 4. S Pen Amber Glow */}
            <motion.div
                style={{ opacity: opacity4 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,180,50,0.08)_0%,transparent_60%)] blur-3xl"
            />

            {/* 5. Galaxy AI Purple Glow */}
            <motion.div
                style={{ opacity: opacity5 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(160,50,255,0.15)_0%,transparent_60%)] blur-3xl"
            />

            {/* Global Grain/Noise Overlay for Texture - adds 'film' look */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        </div>
    );
}
