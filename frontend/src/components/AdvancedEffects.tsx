"use client";

import React, { useState, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, MotionValue } from 'framer-motion';

// --- Page Transitions ---
const pageVariants = {
    initial: {
        opacity: 0,
        scale: 0.8,
        rotateX: 45,
        y: 100
    },
    animate: {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        y: 0,
        transition: {
            duration: 1.2,
            ease: [0.6, -0.05, 0.01, 0.99],
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        scale: 1.2,
        rotateX: -45,
        y: -100,
        transition: {
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99]
        }
    }
};

export function AnimatedPage({ children }: { children: ReactNode }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen"
        >
            {children}
        </motion.div>
    );
}

// --- Magnetic Button Effect ---
export function MagneticButton({ children }: { children: ReactNode }) {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = buttonRef.current.getBoundingClientRect();

        const x = (clientX - (left + width / 2)) * 0.3;
        const y = (clientY - (top + height / 2)) * 0.3;

        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            className="inline-block"
        >
            {children}
        </motion.div>
    );
}

// --- Orbital Menu Components ---
interface SatelliteProps {
    dragX: any;
    dragY: any;
    angle: number;
    radius: number;
    content: React.ReactNode;
    index: number;
}

function Satellite({ dragX, dragY, angle, radius, content, index }: any) {
    const x = useTransform(dragX, (latestX: any) => Math.cos(angle) * (radius as number) + (latestX as number));
    const y = useTransform(dragY, (latestY: any) => Math.sin(angle) * (radius as number) + (latestY as number));

    return (
        <motion.div
            style={{
                position: 'absolute',
                left: x,
                top: y,
                translate: '-50% -50%'
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.2 }}
        >
            {content}
        </motion.div>
    );
}

export function OrbitalDashboard({ centerContent, satellites }: { centerContent: ReactNode, satellites: { content: ReactNode }[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const dragX = useMotionValue(0);
    const dragY = useMotionValue(0);

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0.1}
                style={{ x: dragX, y: dragY }}
                className="z-10 cursor-grab active:cursor-grabbing"
            >
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {centerContent}
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {isOpen && satellites.map((sat: any, i: number) => {
                    const angle = (i / satellites.length) * Math.PI * 2;
                    return (
                        <Satellite
                            key={i}
                            dragX={dragX}
                            dragY={dragY}
                            angle={angle}
                            radius={120}
                            content={sat.content}
                            index={i}
                        />
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
