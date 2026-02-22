"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { messagesAtom } from '@/lib/store';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPanel() {
    const [messages, setMessages] = useAtom(messagesAtom);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user' as const, text: input, timestamp: new Date().toLocaleTimeString() };
        setMessages((prev: any[]) => [...prev, userMsg]);
        const currentInput = input;
        setInput('');

        try {
            const response = await fetch(`http://localhost:8000/query/${encodeURIComponent(currentInput)}`);
            const data = await response.json();

            const aiMsg = {
                role: 'ai' as const,
                text: data.response,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages((prev: any[]) => [...prev, aiMsg]);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            const errorMsg = {
                role: 'ai' as const,
                text: "I'm having trouble connecting to the orchestration core. Please check my status.",
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages((prev: any[]) => [...prev, errorMsg]);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar" ref={scrollRef}>
                <AnimatePresence initial={false}>
                    {messages.map((msg: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] p-3 rounded-2xl flex gap-3 ${msg.role === 'user' ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/10'
                                }`}>
                                {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/40">
                                    <Bot size={16} className="text-primary" />
                                </div>}
                                <div>
                                    <p className="text-xs font-mono text-white/40 mb-1">{msg.role === 'user' ? 'COMMANDER' : 'MAITRI'}</p>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <p className="text-[10px] text-white/20 mt-1 text-right">{msg.timestamp}</p>
                                </div>
                                {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 border border-accent/40">
                                    <User size={16} className="text-accent" />
                                </div>}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-4 bg-black/20 border-t border-white/5">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all pr-12"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="flex gap-2 mt-3">
                    {["Analyze Mood", "Health Summary", "Sync with Earth"].map(tag => (
                        <button key={tag} className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 text-white/60 transition-all">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
