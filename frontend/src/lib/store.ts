"use client";
import { atom } from 'jotai';

export interface Vitals {
    heart_rate: number;
    sleep_quality: number;
    stress_level: number;
    o2_level: number;
    co2_level: number;
    temperature: number;
}

export interface AgentStatus {
    status: 'Active' | 'Processing' | 'Alert';
    last_action: string;
}

export const vitalsAtom = atom<Vitals>({
    heart_rate: 72,
    sleep_quality: 88,
    stress_level: 25,
    o2_level: 21,
    co2_level: 0.04,
    temperature: 22,
});

export const agentStatesAtom = atom<Record<string, AgentStatus>>({});

export const activeAgentAtom = atom<string | null>(null);

export const messagesAtom = atom<{ role: 'user' | 'ai', text: string, timestamp: string }[]>([]);

export const missionEndClockAtom = atom<string>("245:12:45");
