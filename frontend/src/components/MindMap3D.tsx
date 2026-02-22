"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { agentStatesAtom, activeAgentAtom } from '@/lib/store';

const AGENTS = [
    { name: "Orchestrator", color: "#4ecdc4", size: 64, ring: 0, angle: 0, desc: "Command Hub" },
    { name: "Vitals", color: "#ff6b6b", size: 48, ring: 1, angle: 0, desc: "Biometrics" },
    { name: "Psyche", color: "#aa6dc9", size: 48, ring: 1, angle: 72, desc: "Mental State" },
    { name: "Exercise", color: "#feca57", size: 48, ring: 1, angle: 144, desc: "Fitness" },
    { name: "Sleep", color: "#54a0ff", size: 48, ring: 1, angle: 216, desc: "Rest Cycles" },
    { name: "Nutrition", color: "#5f27cd", size: 48, ring: 1, angle: 288, desc: "Sustenance" },
    { name: "Mission", color: "#ff9f43", size: 44, ring: 2, angle: 0, desc: "Operations" },
    { name: "Comms", color: "#ee5253", size: 44, ring: 2, angle: 51, desc: "Earth Link" },
    { name: "Enviro", color: "#00d2d3", size: 44, ring: 2, angle: 102, desc: "Habitat" },
    { name: "Entertain", color: "#ff6b6b", size: 44, ring: 2, angle: 153, desc: "Recreation" },
    { name: "Training", color: "#4ecdc4", size: 44, ring: 2, angle: 204, desc: "Skills" },
    { name: "Alert", color: "#ff4757", size: 44, ring: 2, angle: 255, desc: "Alerts" },
    { name: "Knowledge", color: "#7bed9f", size: 44, ring: 2, angle: 306, desc: "AI Corpus" },
];

const RING_RADII = [0, 110, 210];

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
    const [size, setSize] = useState({ w: 600, h: 500 });
    useEffect(() => {
        if (!ref.current) return;
        const obs = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            setSize({ w: width, h: height });
        });
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref]);
    return size;
}

export default function MindMap3D() {
    const [agentStates] = useAtom(agentStatesAtom);
    const [, setActiveAgent] = useAtom(activeAgentAtom);
    const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
    const [time, setTime] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { w, h } = useContainerSize(containerRef);
    const cx = w / 2;
    const cy = h / 2;

    useEffect(() => {
        const id = setInterval(() => setTime(t => t + 0.008), 16);
        return () => clearInterval(id);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden" style={{ background: 'transparent' }}>
            {/* SVG layer for orbital rings and connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {/* Orbital rings */}
                {[1, 2].map(ring => (
                    <circle
                        key={ring}
                        cx={cx} cy={cy}
                        r={RING_RADII[ring]}
                        fill="none"
                        stroke="rgba(78,205,196,0.08)"
                        strokeWidth="1"
                        strokeDasharray="4 8"
                    />
                ))}

                {/* Connection lines from center to ring-1 */}
                {AGENTS.filter(a => a.ring === 1).map((agent, i) => {
                    const speed = 0.3 + i * 0.07;
                    const angle = (agent.angle * Math.PI / 180) + time * speed;
                    const x = cx + Math.cos(angle) * RING_RADII[1];
                    const y = cy + Math.sin(angle) * RING_RADII[1];
                    const isHov = hoveredAgent === agent.name;
                    return (
                        <line key={agent.name}
                            x1={cx} y1={cy} x2={x} y2={y}
                            stroke={agent.color}
                            strokeOpacity={isHov ? 0.6 : 0.15}
                            strokeWidth={isHov ? 1.5 : 0.8}
                            strokeDasharray="3 6"
                        />
                    );
                })}

                {/* Connection lines from ring-1 hub to ring-2 agents */}
                {AGENTS.filter(a => a.ring === 2).map((agent, i) => {
                    const speed2 = 0.18 + i * 0.04;
                    const angle2 = (agent.angle * Math.PI / 180) + time * speed2;
                    const x2 = cx + Math.cos(angle2) * RING_RADII[2];
                    const y2 = cy + Math.sin(angle2) * RING_RADII[2];
                    // find nearest ring-1 agent
                    const hub = AGENTS.find(a => a.ring === 1 && Math.floor(i / 2.4) === AGENTS.filter(a => a.ring === 1).indexOf(a));
                    const hIdx = Math.floor(i * (AGENTS.filter(a => a.ring === 1).length / AGENTS.filter(a => a.ring === 2).length));
                    const hubAgent = AGENTS.filter(a => a.ring === 1)[hIdx] || AGENTS.filter(a => a.ring === 1)[0];
                    const hubSpeed = 0.3 + hIdx * 0.07;
                    const hubAngle = (hubAgent.angle * Math.PI / 180) + time * hubSpeed;
                    const hx = cx + Math.cos(hubAngle) * RING_RADII[1];
                    const hy = cy + Math.sin(hubAngle) * RING_RADII[1];
                    return (
                        <line key={agent.name}
                            x1={hx} y1={hy} x2={x2} y2={y2}
                            stroke={agent.color}
                            strokeOpacity={0.1}
                            strokeWidth={0.6}
                            strokeDasharray="2 8"
                        />
                    );
                })}
            </svg>

            {/* Center Node — Astronaut */}
            <motion.div
                className="absolute flex flex-col items-center justify-center cursor-pointer"
                style={{
                    left: cx, top: cy,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    width: 80, height: 80,
                }}
                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
                <div style={{
                    width: 80, height: 80,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, rgba(78,205,196,0.6), rgba(10,15,31,0.9))',
                    border: '2px solid rgba(78,205,196,0.5)',
                    boxShadow: '0 0 30px rgba(78,205,196,0.4), inset 0 0 20px rgba(78,205,196,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <span style={{ fontSize: 28 }}>🧑‍🚀</span>
                </div>
                <span style={{
                    fontSize: 9, color: '#4ecdc4', marginTop: 4,
                    fontFamily: 'Orbitron, monospace', letterSpacing: 2, textTransform: 'uppercase',
                    textShadow: '0 0 10px rgba(78,205,196,0.8)', whiteSpace: 'nowrap',
                }}>ASTRONAUT</span>
            </motion.div>

            {/* Agent Nodes */}
            {AGENTS.filter(a => a.ring > 0).map((agent, i) => {
                const isRingOne = agent.ring === 1;
                const idx = AGENTS.filter(a => a.ring === agent.ring).indexOf(agent);
                const speed = isRingOne ? (0.3 + idx * 0.07) : (0.18 + idx * 0.04);
                const baseAngle = agent.angle * Math.PI / 180;
                const liveAngle = baseAngle + time * speed;
                const x = cx + Math.cos(liveAngle) * RING_RADII[agent.ring];
                const y = cy + Math.sin(liveAngle) * RING_RADII[agent.ring];
                const isHov = hoveredAgent === agent.name;
                const state = agentStates[agent.name];
                const isProcessing = state?.status === 'Processing';
                const isAlert = state?.status === 'Alert';

                return (
                    <motion.div
                        key={agent.name}
                        className="absolute flex flex-col items-center cursor-pointer"
                        style={{
                            left: x, top: y,
                            transform: 'translate(-50%, -50%)',
                            zIndex: isHov ? 20 : 5,
                        }}
                        onMouseEnter={() => { setHoveredAgent(agent.name); setActiveAgent(agent.name); }}
                        onMouseLeave={() => { setHoveredAgent(null); setActiveAgent(null); }}
                        animate={{ scale: isHov ? 1.3 : 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        {/* Pulse ring for active agents */}
                        {(isProcessing || isAlert) && (
                            <motion.div
                                className="absolute rounded-full"
                                style={{
                                    width: agent.size + 16, height: agent.size + 16,
                                    border: `1.5px solid ${isAlert ? '#ff4757' : agent.color}`,
                                    top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}

                        {/* Agent sphere */}
                        <div style={{
                            width: agent.size, height: agent.size,
                            borderRadius: '50%',
                            background: `radial-gradient(circle at 35% 35%, ${agent.color}99, ${agent.color}22)`,
                            border: `1.5px solid ${agent.color}${isHov ? 'ff' : '66'}`,
                            boxShadow: isHov
                                ? `0 0 20px ${agent.color}99, 0 0 40px ${agent.color}44`
                                : `0 0 8px ${agent.color}44`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'box-shadow 0.3s',
                        }}>
                            <span style={{
                                fontSize: 9, color: 'white', fontWeight: 700,
                                fontFamily: 'Orbitron, monospace', textAlign: 'center',
                                letterSpacing: 0.5, textShadow: `0 0 8px ${agent.color}`,
                                padding: '0 2px',
                            }}>
                                {agent.name.slice(0, 4).toUpperCase()}
                            </span>
                        </div>

                        {/* Tooltip on hover */}
                        <AnimatePresence>
                            {isHov && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5, scale: 0.9 }}
                                    animate={{ opacity: 1, y: -8, scale: 1 }}
                                    exit={{ opacity: 0, y: -5, scale: 0.9 }}
                                    style={{
                                        position: 'absolute', bottom: '110%',
                                        background: 'rgba(10,15,31,0.95)',
                                        border: `1px solid ${agent.color}66`,
                                        borderRadius: 8, padding: '6px 10px',
                                        whiteSpace: 'nowrap', zIndex: 30,
                                        boxShadow: `0 4px 20px ${agent.color}33`,
                                    }}
                                >
                                    <p style={{ color: agent.color, fontSize: 10, fontFamily: 'Orbitron, monospace', fontWeight: 700 }}>
                                        {agent.name}
                                    </p>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, marginTop: 2 }}>{agent.desc}</p>
                                    {state && (
                                        <p style={{ color: state.status === 'Alert' ? '#ff4757' : '#4ecdc4', fontSize: 8, marginTop: 2 }}>
                                            ● {state.status}
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}

            {/* Label - top-left */}
            <div className="absolute top-4 left-4" style={{ zIndex: 25 }}>
                <p style={{
                    fontSize: 9, color: 'rgba(78,205,196,0.5)',
                    fontFamily: 'Orbitron, monospace', letterSpacing: 3,
                    textTransform: 'uppercase',
                }}>
                    ◎ Live Agentic Mesh — {AGENTS.length} Nodes Active
                </p>
            </div>
        </div>
    );
}
