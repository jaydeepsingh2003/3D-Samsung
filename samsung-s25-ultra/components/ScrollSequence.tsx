'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';

const FRAME_COUNT = 240;

export default function ScrollSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [cameraImages, setCameraImages] = useState<HTMLImageElement[]>([]);
    const [thirdImages, setThirdImages] = useState<HTMLImageElement[]>([]);
    const [spenImages, setSpenImages] = useState<HTMLImageElement[]>([]);
    const [aiImages, setAiImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Timeline (Total 5 Sections -> 20% each)
    // 1. Hero: 0 - 0.2
    // 2. Camera: 0.2 - 0.4
    // 3. Performance: 0.4 - 0.6
    // 4. S Pen: 0.6 - 0.8
    // 5. Galaxy AI: 0.8 - 1.0

    const currentIndex = useTransform(scrollYProgress, [0, 0.2], [1, FRAME_COUNT]);
    const currentCameraIndex = useTransform(scrollYProgress, [0.2, 0.4], [1, FRAME_COUNT]);
    const currentThirdIndex = useTransform(scrollYProgress, [0.4, 0.6], [1, FRAME_COUNT]);
    const currentSpenIndex = useTransform(scrollYProgress, [0.6, 0.8], [1, FRAME_COUNT]);
    const currentAiIndex = useTransform(scrollYProgress, [0.8, 1], [1, FRAME_COUNT]);

    // Opacities for Crossfades
    // 1. Hero Fade Out: 0.18-0.2
    const mainOpacity = useTransform(scrollYProgress, [0.18, 0.2], [1, 0]);

    // 2. Camera Fade In/Out: 0.18-0.2 -> 0.38-0.4
    const cameraOpacity = useTransform(scrollYProgress, [0.18, 0.2, 0.38, 0.4], [0, 1, 1, 0]);

    // 3. Perf Fade In/Out: 0.38-0.4 -> 0.58-0.6
    const thirdOpacity = useTransform(scrollYProgress, [0.38, 0.4, 0.58, 0.6], [0, 1, 1, 0]);

    // 4. S Pen Fade In/Out: 0.58-0.6 -> 0.78-0.8
    const spenOpacity = useTransform(scrollYProgress, [0.58, 0.6, 0.78, 0.8], [0, 1, 1, 0]);

    // 5. AI Fade In: 0.78-0.8
    const aiOpacity = useTransform(scrollYProgress, [0.78, 0.8], [0, 1]);


    useEffect(() => {
        const loadAllImages = async () => {
            const loadSequence = (folder: string): Promise<HTMLImageElement[]> => {
                const loaded: HTMLImageElement[] = [];
                const promises: Promise<void>[] = [];

                for (let i = 1; i <= FRAME_COUNT; i++) {
                    promises.push(new Promise<void>((resolve) => {
                        const img = new Image();
                        const frameIndex = i.toString().padStart(3, '0');
                        img.src = `/${folder}/ezgif-frame-${frameIndex}.jpg`;
                        img.onload = () => { loaded[i - 1] = img; resolve(); };
                        img.onerror = () => { console.error(`Failed ${folder} ${i}`); resolve(); }
                    }));
                }
                return Promise.all(promises).then(() => loaded);
            };

            const [seq1, seq2, seq3, seq4, seq5] = await Promise.all([
                loadSequence('sequence'),
                loadSequence('camera-sequence'),
                loadSequence('third-sequence'),
                loadSequence('spen-sequence'),
                loadSequence('ai-sequence'),
            ]);

            setImages(seq1);
            setCameraImages(seq2);
            setThirdImages(seq3);
            setSpenImages(seq4);
            setAiImages(seq5);
            setImagesLoaded(true);
        };

        loadAllImages();
    }, []);

    useEffect(() => {
        const render = () => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (!canvas || !context || !imagesLoaded || images.length === 0) return;

            context.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Hero Layer
            if (mainOpacity.get() > 0) {
                const idx = Math.min(FRAME_COUNT, Math.max(1, Math.round(currentIndex.get())));
                const img = images[idx - 1];
                if (img) drawImageCover(context, img, canvas, mainOpacity.get(), true);
            }

            // 2. Camera Layer
            if (cameraOpacity.get() > 0) {
                const idx = Math.min(FRAME_COUNT, Math.max(1, Math.round(currentCameraIndex.get())));
                const img = cameraImages[idx - 1];
                if (img) drawImageCover(context, img, canvas, cameraOpacity.get(), true);
            }

            // 3. Third Layer
            if (thirdOpacity.get() > 0) {
                const idx = Math.min(FRAME_COUNT, Math.max(1, Math.round(currentThirdIndex.get())));
                const img = thirdImages[idx - 1];
                if (img) drawImageCover(context, img, canvas, thirdOpacity.get(), true);
            }

            // 4. S Pen Layer
            if (spenOpacity.get() > 0) {
                const idx = Math.min(FRAME_COUNT, Math.max(1, Math.round(currentSpenIndex.get())));
                const img = spenImages[idx - 1];
                if (img) drawImageCover(context, img, canvas, spenOpacity.get(), true);
            }

            // 5. Galaxy AI Layer (Images removed as per request)
            /* 
            if (aiOpacity.get() > 0) {
                const idx = Math.min(FRAME_COUNT, Math.max(1, Math.round(currentAiIndex.get())));
                const img = aiImages[idx - 1];
                if (img) drawImageCover(context, img, canvas, aiOpacity.get(), false);
            }
            */
        };

        const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement, opacity: number, enableRotation: boolean = true) => {
            ctx.save();
            ctx.globalAlpha = opacity;

            const isMobile = canvas.width < 768;

            if (isMobile && enableRotation) {
                // Mobile: Rotate image 90 degrees to fit vertical screen
                const scale = Math.max(canvas.width / img.height, canvas.height / img.width);

                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(Math.PI / 2);
                ctx.drawImage(
                    img,
                    (-img.width / 2) * scale,
                    (-img.height / 2) * scale,
                    img.width * scale,
                    img.height * scale
                );
            } else {
                // Desktop OR Mobile Horizontal (Standard logic)
                const widthScale = canvas.width / img.width;
                const heightScale = canvas.height / img.height;
                let scale = Math.max(widthScale, heightScale);

                // If mobile but rotation disabled (Galaxy AI section), use the "Smart Scale" to balance zoom/visibility
                if (isMobile && !enableRotation) {
                    scale = widthScale + (heightScale - widthScale) * 0.6;
                }

                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            }

            ctx.restore();
        }

        const unsubscribe1 = currentIndex.on("change", render);
        const unsubscribe2 = currentCameraIndex.on("change", render);
        const unsubscribe3 = currentThirdIndex.on("change", render);
        const unsubscribe4 = currentSpenIndex.on("change", render);
        const unsubscribe5 = currentAiIndex.on("change", render);

        // Initial Render
        render();

        return () => { unsubscribe1(); unsubscribe2(); unsubscribe3(); unsubscribe4(); unsubscribe5(); };
    }, [currentIndex, currentCameraIndex, currentThirdIndex, currentSpenIndex, currentAiIndex, images, cameraImages, thirdImages, spenImages, aiImages, imagesLoaded, mainOpacity, cameraOpacity, thirdOpacity, spenOpacity, aiOpacity]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div ref={containerRef} className="relative h-[1200vh] bg-samsung-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover mix-blend-lighten"
                />

                {/* Vignette Overlay to blend image edges */}
                <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_50%,#050505_100%)] mix-blend-normal"></div>

                {!imagesLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50">
                        Loading Experience...
                    </div>
                )}

                {/* --- SECTION 1: HERO (0 - 0.20) --- */}
                <TextLayer progress={scrollYProgress} start={0} end={0.12} align="center">
                    <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6 drop-shadow-2xl text-center px-4">
                        Galaxy S25 Ultra
                    </h1>
                    <p className="text-xl md:text-2xl text-white/70 font-light tracking-wide text-center px-4">The new standard of power.</p>
                </TextLayer>

                <TextLayer progress={scrollYProgress} start={0.14} end={0.18} align="left">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg text-center md:text-left px-4">Precision Engineered</h2>
                    <p className="text-lg md:text-xl text-white/60 max-w-md leading-relaxed font-light text-center md:text-left px-4">
                        Titanium shell. Armor Aluminum frame. Designed to endure the extreme.
                    </p>
                </TextLayer>

                {/* --- SECTION 2: CAMERA (0.20 - 0.40) --- */}
                <TextLayer progress={scrollYProgress} start={0.25} end={0.35} align="right">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg text-center md:text-right px-4">200MP Clarity</h2>
                    <p className="text-lg md:text-xl text-white/60 max-w-md leading-relaxed font-light text-center md:text-right px-4">
                        Capture the unseen with our most advanced sensor technology yet.
                    </p>
                </TextLayer>

                {/* --- SECTION 3: PERFORMANCE (0.40 - 0.60) --- */}
                <TextLayer progress={scrollYProgress} start={0.45} end={0.55} align="center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg text-center px-4">Snapdragon 8 Gen 5</h2>
                    <p className="text-lg md:text-xl text-white/60 max-w-md leading-relaxed font-light text-center px-4">
                        Ray tracing, 8K video, and real-time AI translation at the speed of thought.
                    </p>
                </TextLayer>

                {/* --- SECTION 4: S PEN (0.60 - 0.80) --- */}
                <TextLayer progress={scrollYProgress} start={0.65} end={0.75} align="left">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg text-center md:text-left px-4">Integrated S Pen</h2>
                    <p className="text-lg md:text-xl text-white/60 max-w-md leading-relaxed font-light text-center md:text-left px-4">
                        Write, sketch, and control with precision. The S Pen is built-in and ready when you are.
                    </p>
                </TextLayer>

                {/* --- SECTION 5: GALAXY AI (0.80 - 1.0) --- */}
                {/* Adjusted padding and sizing for better mobile visibility */}
                <TextLayer progress={scrollYProgress} start={0.85} end={0.92} align="right">
                    <div className="w-full px-4 md:px-0 flex flex-col items-center md:items-end">
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-samsung-blue to-purple-400 mb-4 drop-shadow-lg text-center md:text-right w-full">
                            Galaxy AI
                        </h2>
                        <p className="text-base sm:text-xl text-white/60 leading-relaxed font-light text-center md:text-right max-w-xs md:max-w-md">
                            The most advanced AI on a smartphone. Live Translate, Note Assist, and Circle to Search.
                        </p>
                    </div>
                </TextLayer>

                <TextLayer progress={scrollYProgress} start={0.95} end={1.0} align="center">
                    <button className="bg-gradient-to-r from-samsung-blue to-samsung-cyan text-white px-8 py-3 md:px-10 md:py-4 rounded-full text-lg md:text-xl font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,214,255,0.4)]">
                        Order Now
                    </button>
                </TextLayer>

            </div>
        </div>
    );
}

function TextLayer({ children, progress, start, end, align }: { children: React.ReactNode, progress: MotionValue<number>, start: number, end: number, align: 'center' | 'left' | 'right' }) {
    const opacity = useTransform(progress,
        start === 0 ? [0, end - 0.02, end] : [start, start + 0.02, end - 0.02, end],
        start === 0 ? [1, 1, 0] : [0, 1, 1, 0]
    );
    const y = useTransform(progress, [start, end], start === 0 ? [0, -50] : [50, -50]);
    // @ts-ignore
    const pointerEvents = useTransform(progress, (v) => (v >= start && v <= end ? 'auto' : 'none'));

    // Adjusted alignment logic for better mobile resizing
    let alignClass = 'items-center text-center';
    if (align === 'left') alignClass = 'items-center md:items-start md:text-left justify-center md:pl-32';
    if (align === 'right') alignClass = 'items-center md:items-end md:text-right justify-center md:pr-32';

    return (
        <motion.div
            style={{ opacity, y, pointerEvents }}
            className={`absolute inset-0 flex flex-col justify-center ${alignClass} z-10 w-full`} // added w-full
        >
            {children}
        </motion.div>
    )
}
