'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Navbar() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [activeSection, setActiveSection] = useState('Overview');

    // Smooth scroll hook
    // @ts-ignore
    const lenis = globalThis.lenis; // Access global lenis instance if strictly needed, or relies on window.scrollTo if lenis context invisible. 
    // Ideally we use useLenis from the package, but to avoid context errors if not wrapped perfectly, we can use simple window calc or try useLenis.
    // Let's stick to window.scrollTo which Lenis intercepts, or standard anchor logic.
    // Actually, explicit window.scrollTo(0, val) works with Lenis if 'smooth' isn't forced, or we can just calculate pixel values.

    const NAV_ITEMS = [
        { name: 'Overview', offset: 0 },
        { name: 'Camera', offset: 0.23 },
        { name: 'Performance', offset: 0.43 },
        { name: 'S Pen', offset: 0.63 },
        { name: 'Galaxy AI', offset: 0.83 },
    ];

    useEffect(() => {
        return scrollY.onChange((latest) => {
            // Navbar visibility
            // Always show
            setHidden(false);

            // Active State Calculation
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = latest / docHeight;

            if (progress < 0.2) setActiveSection('Overview');
            else if (progress < 0.4) setActiveSection('Camera');
            else if (progress < 0.6) setActiveSection('Performance');
            else if (progress < 0.8) setActiveSection('S Pen');
            else setActiveSection('Galaxy AI');
        });
    }, [scrollY]);

    const handleScroll = (offset: number) => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({
            top: offset * docHeight,
            behavior: 'smooth'
        });
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: hidden ? 0 : 1, y: hidden ? -20 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 left-0 w-full z-50 glass-panel"
        >
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                <div onClick={() => handleScroll(0)} className="font-semibold text-lg tracking-tight text-white flex items-center gap-2 cursor-pointer">
                    <span className="font-bold">Samsung</span> Galaxy S25 Ultra
                </div>

                <div className="hidden md:flex space-x-8 text-sm font-medium text-white/70">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleScroll(item.offset)}
                            className={`transition-colors relative ${activeSection === item.name ? 'text-white' : 'hover:text-samsung-cyan'}`}
                        >
                            {item.name}
                            {activeSection === item.name && (
                                <motion.div
                                    layoutId="active-nav"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-samsung-blue"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <button className="bg-gradient-to-r from-samsung-blue to-samsung-cyan text-white px-5 py-1.5 rounded-full text-sm font-semibold hover:shadow-[0_0_15px_rgba(0,214,255,0.5)] transition-shadow">
                    Order Now
                </button>
            </div>
        </motion.nav>
    );
}
