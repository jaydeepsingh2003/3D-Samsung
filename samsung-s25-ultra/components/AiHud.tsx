'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function AiHud() {
    const { scrollYProgress } = useScroll();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    // Smooth scroll percentage for display
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    const scrollPercent = useTransform(smoothProgress, (v) => Math.round(v * 100));

    // Active Module Calculation
    const [activeModule, setActiveModule] = useState('SYSTEM.INIT');

    useEffect(() => {
        return scrollYProgress.onChange((v) => {
            if (v < 0.2) setActiveModule('TITANIUM.CORE');
            else if (v < 0.4) setActiveModule('OPTICS.200MP');
            else if (v < 0.6) setActiveModule('SNAPDRAGON.G8');
            else if (v < 0.8) setActiveModule('SPEN.DIGITIZER');
            else setActiveModule('NEURAL.ENGINE');
        });
    }, [scrollYProgress]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    if (isMobile) return null; // Hide on mobile to save screen space

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed bottom-8 right-8 z-40 hidden md:flex flex-col gap-2 pointer-events-none font-mono text-xs text-samsung-cyan tracking-wider"
        >
            {/* Decoration Lines */}
            <div className="absolute -top-4 right-0 w-24 h-[1px] bg-gradient-to-l from-samsung-cyan/50 to-transparent"></div>
            <div className="absolute -bottom-4 right-0 w-12 h-[1px] bg-gradient-to-l from-samsung-cyan/50 to-transparent"></div>

            <div className="bg-black/40 backdrop-blur-md border border-samsung-cyan/20 p-4 rounded-lg shadow-[0_0_20px_rgba(0,214,255,0.1)] flex flex-col gap-3 min-w-[200px]">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-samsung-cyan/20 pb-2">
                    <span className="text-white/70">GALAXY.OS</span>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-samsung-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-samsung-cyan"></span>
                        </span>
                        <span>ONLINE</span>
                    </div>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[10px] text-samsung-cyan/80">
                    <div className="flex flex-col">
                        <span className="text-white/40">MODULE</span>
                        <motion.span>{activeModule}</motion.span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-white/40">SCROLL</span>
                        <div className="flex">
                            <DisplayValue value={scrollPercent} />%
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white/40">POINTER</span>
                        <span>{mousePos.x}, {mousePos.y}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-white/40">MEMORY</span>
                        <span>12GB / OK</span>
                    </div>
                </div>

                {/* Simulated Graph */}
                <div className="h-6 flex items-end gap-[2px] opacity-60">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-samsung-cyan w-[6px]"
                            style={{
                                height: `${Math.random() * 80 + 20}%`,
                                opacity: Math.random() > 0.5 ? 1 : 0.4
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function DisplayValue({ value }: { value: any }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        return value.on("change", (latest: number) => {
            setCurrent(latest);
        });
    }, [value]);

    return <span>{current}</span>;
}
