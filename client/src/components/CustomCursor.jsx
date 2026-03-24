import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [rotation, setRotation] = useState(-45);
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [cursorText, setCursorText] = useState('');

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    const followerConfig = { damping: 15, stiffness: 80 };
    const followerX = useSpring(mouseX, followerConfig);
    const followerY = useSpring(mouseY, followerConfig);
 
    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY, movementX, movementY } = e;
            mouseX.set(clientX);
            mouseY.set(clientY);
            setMousePosition({ x: clientX, y: clientY });
 
            // Orchestrate Syringe Rotation based on movement vector
            if (Math.abs(movementX) > 2 || Math.abs(movementY) > 2) {
                const angle = Math.atan2(movementY, movementX) * (180 / Math.PI);
                setRotation(angle + 135); 
            }
 
            const target = e.target;
            const isClickable = target.closest('button') || target.closest('a') || target.tagName === 'BUTTON' || target.tagName === 'A';
            
            if (isClickable) {
                setIsHovered(true);
                const text = target.getAttribute('data-cursor') || '';
                setCursorText(text);
            } else {
                setIsHovered(false);
                setCursorText('');
            }
        };

        const handleMouseDown = () => setIsHovered(true);
        const handleMouseUp = () => setIsHovered(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden hidden lg:block">
            {/* Soft Ambient Follower - The 'Fluid' Part */}
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full bg-hospital-primary opacity-[0.03] blur-[120px]"
                style={{
                    x: followerX,
                    y: followerY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />

            {/* Magnetic Ring */}
            <motion.div
                className="absolute w-8 h-8 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-[2px]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isHovered ? 2.5 : 1,
                    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0)',
                    borderColor: isHovered ? 'rgba(0, 204, 204, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                }}
            >
                {/* Internal Crosshair */}
                <motion.div 
                    animate={{ rotate: isHovered ? 90 : 0 }}
                    className="w-full h-full relative"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-1.5 bg-white/40"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-1.5 bg-white/40"></div>
                </motion.div>
            </motion.div>

            {/* Core Syringe Focal Point */}
            <motion.div
                className="absolute pointer-events-none text-hospital-primary"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-10%',
                    translateY: '-90%',
                    rotate: rotation,
                    scale: isHovered ? 1.2 : 0.8,
                }}
            >
                <div className="relative group/syringe">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-neon">
                        <path d="m18 2 4 4" className="opacity-40" />
                        <path d="m17 7 3-3" className="opacity-40" />
                        <motion.path 
                            animate={{ y: isHovered ? 2 : 0 }}
                            d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" 
                            strokeWidth="2.5"
                        />
                        <path d="m9 11 4 4" className="opacity-60" />
                        <path d="m5 19-3 3" strokeWidth="3" className="text-hospital-secondary" />
                        <path d="m14 4 6 6" className="opacity-40" />
                    </svg>
                    
                    {/* Pulsing Clinical Liquid Drop */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0, y: 0 }}
                                animate={{ scale: [1, 1.5, 1.2], opacity: [0.8, 1, 0.4], y: 10 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute bottom-[-15px] left-[2px] w-2 h-2 bg-hospital-secondary rounded-full blur-[2px]"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Dynamic Telemetry Label */}
            <AnimatePresence>
                {isHovered && cursorText && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 35 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute flex flex-col items-start gap-1"
                        style={{
                            x: mouseX,
                            y: mouseY,
                            translateY: '-100%',
                        }}
                    >
                        <div className="px-3 py-1 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-lg shadow-4xl">
                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-hospital-primary whitespace-nowrap">{cursorText}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trailing Vapor Effect (Simplified for performance) */}
            <motion.div
                className="absolute w-4 h-4 bg-white/5 rounded-full blur-md"
                style={{
                    x: followerX,
                    y: followerY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isHovered ? 0.2 : 0,
                }}
            />
        </div>
    );
};

export default CustomCursor;
