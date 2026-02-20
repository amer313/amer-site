"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

/* ── Colored Particles ── */
function ParticleField({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const count = 2500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0.4, 0.3, 1.0],   // blue-purple
      [1.0, 0.2, 0.5],   // hot pink
      [0.2, 1.0, 0.7],   // mint
      [1.0, 0.6, 0.1],   // orange
      [0.5, 0.2, 1.0],   // violet
      [0.1, 0.8, 1.0],   // cyan
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.15;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={isDark ? 0.8 : 0.5}
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
  opacity,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  scale: number;
  distort: number;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.x = position[0] + Math.sin(t * speed * 0.5) * 1.2;
    ref.current.position.y = position[1] + Math.cos(t * speed * 0.3) * 0.8;
    ref.current.rotation.z = t * speed * 0.1;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        roughness={0.1}
        metalness={0.2}
        distort={distort}
        speed={speed}
        transparent
        opacity={opacity}
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
          color={isDark ? "#a0a0ff" : "#3030aa"}
          roughness={0.15}
          metalness={0.9}
          distort={0.3}
          speed={2}
          wireframe
        />
      </mesh>
    </Float>
  );
}

/* ── Wave Rings ── */
function WaveRing({ radius, color, speed, offset }: { radius: number; color: string; speed: number; offset: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + offset;
    ref.current.rotation.x = Math.PI / 2 + Math.sin(t * speed) * 0.25;
    ref.current.rotation.z = t * speed * 0.3;
    ref.current.scale.setScalar(1 + Math.sin(t * speed * 0.8) * 0.12);
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <torusGeometry args={[radius, 0.015, 16, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} />
    </mesh>
  );
}

/* ── Scene ── */
function Scene({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6060ff" />
      <pointLight position={[-10, -5, 5]} intensity={0.8} color="#ff4080" />
      <pointLight position={[5, -10, -5]} intensity={0.6} color="#40ffa0" />
      <pointLight position={[-5, 8, 3]} intensity={0.5} color="#ffaa20" />

      <ParticleField isDark={isDark} />

      {/* Vibrant blobs with higher opacity */}
      <GradientBlob position={[-3.5, 1.5, -4]} color="#4444ff" speed={1.2} scale={2.8} distort={0.5} opacity={isDark ? 0.25 : 0.15} />
      <GradientBlob position={[3, -1, -3]} color="#ff2266" speed={0.8} scale={2.2} distort={0.6} opacity={isDark ? 0.22 : 0.12} />
      <GradientBlob position={[0, 2.5, -5]} color="#00ffaa" speed={1} scale={2} distort={0.4} opacity={isDark ? 0.2 : 0.1} />
      <GradientBlob position={[-1, -2, -4.5]} color="#ff8800" speed={0.9} scale={1.6} distort={0.45} opacity={isDark ? 0.18 : 0.1} />
      <GradientBlob position={[2.5, 1, -6]} color="#aa44ff" speed={1.1} scale={2.4} distort={0.55} opacity={isDark ? 0.2 : 0.12} />

      {/* Colored wave rings */}
      <WaveRing radius={3} color="#6060ff" speed={0.3} offset={0} />
      <WaveRing radius={4.5} color="#ff4080" speed={0.2} offset={2} />
      <WaveRing radius={6} color="#40ffa0" speed={0.15} offset={4} />

      <InteractiveTorusKnot isDark={isDark} />
    </>
  );
}

export default function HeroScene() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 z-0 opacity-70" data-no-transition>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <Scene isDark={isDark} />
      </Canvas>
    </div>
  );
}
