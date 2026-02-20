"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

/* ── Particles ── */
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 2000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

/* ── Gradient Blob ── */
function GradientBlob({
  position,
  color,
  speed,
  scale,
  distort,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  scale: number;
  distort: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.x = position[0] + Math.sin(t * speed * 0.5) * 0.8;
    ref.current.position.y = position[1] + Math.cos(t * speed * 0.3) * 0.6;
    ref.current.rotation.z = t * speed * 0.1;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        roughness={0.1}
        metalness={0.3}
        distort={distort}
        speed={speed}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

/* ── Torus Knot ── */
function InteractiveTorusKnot({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      pointer.x * 1.5,
      0.05
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      pointer.y * 1.5,
      0.05
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <MeshDistortMaterial
          color={isDark ? "#ffffff" : "#1a1a1a"}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
          wireframe
        />
      </mesh>
    </Float>
  );
}

/* ── Wave Ring ── */
function WaveRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.2;
    ref.current.rotation.z = t * 0.1;
    ref.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.1);
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <torusGeometry args={[3, 0.02, 16, 100]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
    </mesh>
  );
}

function WaveRing2() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = Math.PI / 2 + Math.cos(t * 0.2) * 0.3;
    ref.current.rotation.y = t * 0.08;
    ref.current.scale.setScalar(1 + Math.cos(t * 0.4) * 0.15);
  });

  return (
    <mesh ref={ref} position={[0, 0, -3]}>
      <torusGeometry args={[4.5, 0.015, 16, 120]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
    </mesh>
  );
}

/* ── Scene Wrapper ── */
function Scene({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -5, 5]} intensity={0.4} color="#4060ff" />
      <pointLight position={[5, -10, -5]} intensity={0.3} color="#ff4080" />

      <ParticleField />

      <GradientBlob position={[-3, 1.5, -4]} color="#4060ff" speed={1.2} scale={2.5} distort={0.5} />
      <GradientBlob position={[3, -1, -3]} color="#ff4080" speed={0.8} scale={2} distort={0.6} />
      <GradientBlob position={[0, 2, -5]} color="#40ffaa" speed={1} scale={1.8} distort={0.4} />

      <WaveRing />
      <WaveRing2 />

      <InteractiveTorusKnot isDark={isDark} />
    </>
  );
}

export default function HeroScene() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 z-0 opacity-60" data-no-transition>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <Scene isDark={isDark} />
      </Canvas>
    </div>
  );
}
