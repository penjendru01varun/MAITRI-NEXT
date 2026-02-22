"use client";

import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { vitalsAtom, agentStatesAtom, messagesAtom } from '@/lib/store';
import { Activity, Heart, Moon, Zap, AlertTriangle, MessageSquare, Shield, Settings, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MindMap3D from './MindMap3D';
import ChatPanel from './ChatPanel';
import AgentActivity from './AgentActivity';
import { AnimatedPage, MagneticButton, OrbitalDashboard } from './AdvancedEffects';

export default function Dashboard() {
    const [vitals, setVitals] = useAtom(vitalsAtom);
    const [agentStates, setAgentStates] = useAtom(agentStatesAtom);
    const [messages, setMessages] = useAtom(messagesAtom);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws');

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.vitals) setVitals(data.vitals);
            if (data.agent_states) setAgentStates(data.agent_states);
        };

        socket.onopen = () => console.log('Connected to MAITRI Backend Data Stream');
        socket.onclose = () => console.log('Disconnected from MAITRI Backend Data Stream');

        return () => socket.close();
    }, [setVitals, setAgentStates]);

    const quickActions = [
        { content: <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary border border-primary/30"><Heart size={18} /></div>, label: "Vitals" },
        { content: <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary border border-primary/30"><Activity size={18} /></div>, label: "Activity" },
        { content: <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary border border-primary/30"><Shield size={18} /></div>, label: "Security" },
        { content: <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary border border-primary/30"><Zap size={18} /></div>, label: "Power" },
    ];

    return (
        <AnimatedPage>
            <div className="flex flex-col h-screen bg-[#0a0f1f] text-white p-4 gap-4 overflow-hidden relative">
                <div className="nebula-bg" />

                {/* Header */}
                <header className="flex justify-between items-center glass p-4 h-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-pulse border border-primary/40">
                            <Zap className="text-primary" />
                        </div>
                        <div>
                            <h1 className="font-orbitron text-xl font-bold tracking-widest text-glow-primary">MAITRI-NEXT</h1>
                            <p className="text-xs text-primary/60 uppercase tracking-tighter">Mission: Psychological & Physical Well-being</p>
                        </div>
                    </div>

                    <div className="flex gap-6 items-center">
                        <div className="text-right">
                            <p className="text-xs text-white/40 uppercase">Mission Clock</p>
                            <p className="font-mono text-2xl text-primary">245:12:45:10</p>
                        </div>

                        <div className="h-10 w-px bg-white/10" />

                        <div className="flex flex-col items-center">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className={`h-1 w-4 rounded-full ${i <= 4 ? 'bg-primary' : 'bg-primary/20'}`} />
                                ))}
                            </div>
                            <p className="text-[10px] text-primary/60 mt-1">AI TRUST SCORE: 92%</p>
                        </div>

                        <MagneticButton>
                            <button className="flex items-center gap-2 bg-red-500/20 text-red-500 border border-red-500/40 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all active:scale-95 group">
                                <AlertTriangle className="group-hover:animate-bounce" size={18} />
                                <span className="font-bold text-sm">EMERGENCY</span>
                            </button>
                        </MagneticButton>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex flex-1 gap-4 min-h-0">
                    {/* Left Sidebar - Avatar & Quick Actions */}
                    <aside className="w-80 glass flex flex-col p-4 gap-4 shrink-0">
                        <div className="aspect-square glass-dark rounded-xl relative overflow-hidden flex items-center justify-center border border-white/10 group">
                            {/* 3D Avatar Placeholder - To be replaced by R3F component */}
                            <div className="text-center p-6">
                                <div className="w-32 h-32 rounded-full border-2 border-primary/40 p-1 mb-4 mx-auto relative cursor-pointer group-hover:border-primary">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                        <Shield className="text-primary w-12 h-12" />
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-[#0a0f1f] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        ACTIVE
                                    </div>
                                </div>
                                <h3 className="font-orbitron font-bold text-primary">MAITRI AI</h3>
                                <p className="text-xs text-white/60 mb-4 italic">"I'm monitoring your status, Commander."</p>

                                <div className="flex justify-center gap-1 h-8 items-center">
                                    {[1, 2, 3, 4, 5, 2, 1, 3, 4, 3, 2].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [`${h * 10}%`, `${h * 20}%`, `${h * 10}%`] }}
                                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                            className="w-1 bg-primary/40 rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Quick Actions</p>
                            {["Feeling Stressed", "Need Exercise", "Mission Help", "Talk to Earth"].map((action) => (
                                <button key={action} className="glass-card p-3 text-left text-sm font-medium hover:text-primary flex justify-between items-center group">
                                    {action}
                                    <Zap size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>

                        <div className="mt-auto glass-dark p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-white/60">Psychological State</span>
                                <span className="text-xs text-primary font-bold">STABLE</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    className="h-full bg-gradient-to-r from-primary to-accent"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Center - Mind Map View */}
                    <main className="flex-1 glass relative overflow-hidden group">
                        <div className="absolute top-4 left-4 z-10">
                            <h2 className="font-orbitron text-sm text-primary/80 flex items-center gap-2">
                                <Activity size={16} /> AGENTIC ORCHESTRATION MESH
                            </h2>
                        </div>

                        {/* 3D Canvas Container */}
                        <div className="w-full h-full" id="mind-map-canvas">
                            <MindMap3D />
                        </div>

                        {/* Floating UI Elements over Mind Map */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <div className="glass-dark p-4 rounded-xl border border-white/10 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                                        <Shield size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase">Selected Agent</p>
                                        <p className="text-sm font-bold text-primary">ORCHESTRATOR</p>
                                    </div>
                                </div>
                                <div className="text-[10px] text-white/60 max-w-[200px]">
                                    Managing task convergence across 12 specialized clusters. Optimization level: 98.4%.
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="glass-dark p-3 rounded-lg border border-white/10 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] uppercase font-bold">Link Stable</span>
                                </div>
                                <div className="glass-dark p-3 rounded-lg border border-white/10 flex items-center gap-3">
                                    <span className="text-[10px] uppercase font-bold text-white/40">Latency</span>
                                    <span className="text-[10px] font-mono">14ms</span>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Right Panel - Agent Status & Activity */}
                    <aside className="w-96 flex flex-col gap-4 shrink-0">
                        <div className="flex-1 glass overflow-hidden flex flex-col p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-orbitron text-sm flex items-center gap-2">
                                    <Menu size={16} className="text-primary" /> AGENT CLUSTERS
                                </h3>
                                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">15 ACTIVE</span>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <AgentActivity />
                            </div>
                        </div>

                        <div className="h-64 glass flex flex-col overflow-hidden">
                            <div className="flex items-center gap-2 p-4 pb-0">
                                <MessageSquare size={16} className="text-primary" />
                                <h3 className="font-orbitron text-sm">SECURE COMMS</h3>
                            </div>
                            <ChatPanel />
                        </div>
                    </aside>
                </div>

                {/* Bottom Bar - Environmental & Timeline */}
                <footer className="h-20 glass shrink-0 flex items-center px-6 gap-8 overflow-hidden">
                    <div className="flex gap-8 items-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-white/40 font-bold">OXYGEN DEPOT</span>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-lg">21.4%</span>
                                <div className="w-12 h-6 glass-dark rounded relative">
                                    <div className="absolute inset-y-0 left-0 bg-blue-500/50 w-[80%] rounded-l" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-white/40 font-bold">CABIN TEMP</span>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-lg">22.5°C</span>
                                <div className="w-12 h-6 glass-dark rounded relative">
                                    <div className="absolute inset-y-0 left-0 bg-orange-500/50 w-[65%] rounded-l" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] text-white/40 uppercase font-bold">
                            <span>Timeline: Phase 4 Implementation</span>
                            <span>T-Minus 12h 45m</span>
                        </div>
                        <div className="h-2 glass-dark rounded-full overflow-hidden relative">
                            <motion.div
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                className="absolute inset-y-0 w-20 bg-primary/20 blur-sm"
                            />
                            <div className="absolute inset-y-0 left-0 bg-primary w-[75%] rounded-full shadow-[0_0_10px_rgba(78,205,196,0.5)]" />
                            <div className="absolute top-1/2 -translate-y-1/2 left-[30%] w-3 h-3 bg-white rounded-full border-2 border-primary" />
                            <div className="absolute top-1/2 -translate-y-1/2 left-[60%] w-3 h-3 bg-white rounded-full border-2 border-primary" />
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] text-white/40 uppercase">Earth Link</p>
                            <p className="text-xs font-bold text-green-500">CONNECTED</p>
                        </div>
                        <MagneticButton>
                            <div className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center">
                                <Activity size={18} className="text-primary animate-pulse" />
                            </div>
                        </MagneticButton>
                    </div>
                </footer>

                {/* Quick Actions Orbital Menu Overlay */}
                <div className="absolute bottom-24 right-24 pointer-events-none">
                    <div className="pointer-events-auto">
                        <OrbitalDashboard
                            centerContent={
                                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(78,205,196,0.5)]">
                                    <Menu size={24} />
                                </div>
                            }
                            satellites={quickActions}
                        />
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
