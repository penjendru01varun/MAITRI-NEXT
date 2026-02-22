"use client";

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Sphere, MeshDistortMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useAtom } from 'jotai';
import { agentStatesAtom, activeAgentAtom } from '@/lib/store';

const AGENTS = [
    { name: "Orchestrator", color: "#4ecdc4", size: 0.8, distance: 3 },
    { name: "Vitals", color: "#ff6b6b", size: 0.5, distance: 5 },
    { name: "Psyche", color: "#aa6dc9", size: 0.5, distance: 7 },
    { name: "Exercise", color: "#feca57", size: 0.5, distance: 9 },
    { name: "Sleep", color: "#54a0ff", size: 0.5, distance: 11 },
    { name: "Nutrition", color: "#5f27cd", size: 0.5, distance: 13 },
    { name: "Mission", color: "#ff9f43", size: 0.5, distance: 15 },
    { name: "Comms", color: "#ee5253", size: 0.5, distance: 17 },
    { name: "Enviro", color: "#00d2d3", size: 0.5, distance: 19 },
    { name: "Entertain", color: "#ff6b6b", size: 0.5, distance: 21 },
    { name: "Training", color: "#4ecdc4", size: 0.5, distance: 23 },
    { name: "Alert", color: "#ff4757", size: 0.6, distance: 25 },
];

function AgentPlanet({ agent, index, onHover }: { agent: any, index: number, onHover: (name: string | null) => void }) {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);
    const orbitalSpeed = 0.5 / agent.distance;
    const initialAngle = (index / AGENTS.length) * Math.PI * 2;

    useFrame((state: any) => {
        const time = state.clock.getElapsedTime();
        const angle = initialAngle + time * orbitalSpeed;
        mesh.current.position.x = Math.cos(angle) * agent.distance;
        mesh.current.position.z = Math.sin(angle) * agent.distance;
        mesh.current.rotation.y += 0.01;
    });

    return (
        <group>
            {/* Orbital Path */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[agent.distance - 0.01, agent.distance + 0.01, 64]} />
                <meshBasicMaterial color={agent.color} opacity={0.1} transparent />
            </mesh>

            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <mesh
                    ref={mesh}
                    onPointerOver={() => { setHovered(true); onHover(agent.name); }}
                    onPointerOut={() => { setHovered(false); onHover(null); }}
                >
                    <sphereGeometry args={[agent.size * (hovered ? 1.2 : 1), 32, 32]} />
                    <MeshDistortMaterial
                        color={agent.color}
                        speed={2}
                        distort={0.4}
                        radius={1}
                        emissive={agent.color}
                        emissiveIntensity={hovered ? 2 : 0.5}
                    />
                    <Text
                        position={[0, agent.size + 0.5, 0]}
                        fontSize={0.3}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        font="/fonts/Orbitron-Bold.ttf"
                    >
                        {agent.name}
                    </Text>
                </mesh>
            </Float>
        </group>
    );
}

function Astronaut() {
    return (
        <group>
            <mesh>
                <sphereGeometry args={[1.5, 64, 64]} />
                <MeshDistortMaterial
                    color="#ffffff"
                    speed={1}
                    distort={0.1}
                    radius={1}
                    emissive="#4ecdc4"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.8}
                />
            </mesh>
            <pointLight color="#4ecdc4" intensity={2} distance={10} />
            <Text
                position={[0, 2.5, 0]}
                fontSize={0.5}
                color="#4ecdc4"
                anchorX="center"
                anchorY="middle"
            >
                ASTRONAUT
            </Text>
        </group>
    );
}

export default function MindMap3D() {
    const [, setActiveAgent] = useAtom(activeAgentAtom);

    return (
        <Canvas camera={{ position: [0, 20, 30], fov: 45 }}>
            <color attach="background" args={['#0a0f1f']} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            <Astronaut />

            {AGENTS.map((agent, i) => (
                <AgentPlanet key={agent.name} agent={agent} index={i} onHover={setActiveAgent} />
            ))}

            <OrbitControls
                enableDamping
                dampingFactor={0.05}
                rotateSpeed={0.5}
                maxDistance={100}
                minDistance={5}
            />

            {/* Background Star Particles */}
            <Stars count={1000} />
        </Canvas>
    );
}

function Stars({ count = 5000 }) {
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 200;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 200;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
        return pos;
    }, [count]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.1} color="white" transparent opacity={0.5} />
        </points>
    );
}
