import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
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
            const { clientX, clientY } = e;
            mouseX.set(clientX);
            mouseY.set(clientY);
            setMousePosition({ x: clientX, y: clientY });

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
                className="absolute w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-[2px]"
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-2 bg-white/40"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-2 bg-white/40"></div>
                </motion.div>
            </motion.div>

            {/* Core Focal Point */}
            <motion.div
                className="absolute w-1.5 h-1.5 bg-hospital-primary rounded-full shadow-neon-primary"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isHovered ? 0.5 : 1,
                }}
            />

            {/* Dynamic Telemetry Label */}
            <AnimatePresence>
                {isHovered && cursorText && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 40 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute flex flex-col items-start gap-1"
                        style={{
                            x: mouseX,
                            y: mouseY,
                            translateY: '-50%',
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
