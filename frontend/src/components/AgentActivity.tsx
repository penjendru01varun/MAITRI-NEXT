"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { agentStatesAtom } from '@/lib/store';
import { Shield, Activity, Zap } from 'lucide-react';

export default function AgentActivity() {
    const [agentStates] = useAtom(agentStatesAtom);

    const agentsList = Object.entries(agentStates).map(([name, state]) => ({
        name,
        ...(state as object)
    })) as any[];

    return (
        <div className="flex flex-col gap-2 p-2">
            {agentsList.length === 0 ? (
                <div className="text-center py-8 opacity-40">
                    <Activity className="mx-auto mb-2 animate-pulse" size={24} />
                    <p className="text-[10px] uppercase font-orbitron">No Data Stream</p>
                </div>
            ) : (
                agentsList.map((agent, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={agent.name}
                        className="glass-dark p-3 rounded-lg border border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Alert' ? 'bg-red-500 animate-ping' :
                                    agent.status === 'Processing' ? 'bg-yellow-500 animate-pulse' :
                                        'bg-green-500'
                                    }`} />
                                <span className="text-xs font-bold font-orbitron group-hover:text-primary transition-colors uppercase tracking-wider">{agent.name}</span>
                            </div>
                            <Shield size={10} className="text-white/20" />
                        </div>
                        <p className="text-[10px] text-white/50 truncate">{agent.last_action}</p>

                        {agent.status === 'Processing' && (
                            <div className="mt-2 w-full bg-white/5 h-0.5 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                    className="h-full w-full bg-primary/40"
                                />
                            </div>
                        )}
                    </motion.div>
                ))
            )}
        </div>
    );
}
