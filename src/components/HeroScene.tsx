"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

/* ── Ambient Particles (subtle background stars) ── */
function AmbientParticles({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const count = 800;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={isDark ? "#ffffff" : "#333333"}
        size={0.008}
        sizeAttenuation
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

/* ── Orbital Ring (electron path) ── */
function OrbitalRing({
  radius,
  tiltX,
  tiltY,
  speed,
  color,
  opacity,
}: {
  radius: number;
  tiltX: number;
  tiltY: number;
  speed: number;
  color: string;
  opacity: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <group rotation={[tiltX, tiltY, 0]} ref={ref}>
      <mesh>
        <torusGeometry args={[radius, 0.008, 16, 150]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

/* ── Electron (orbiting particle on a ring) ── */
function Electron({
  radius,
  tiltX,
  tiltY,
  speed,
  color,
  size,
}: {
  radius: number;
  tiltX: number;
  tiltY: number;
  speed: number;
  color: string;
  size: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    const x = Math.cos(t) * radius;
    const y = Math.sin(t) * radius;

    // Apply the tilt rotation manually
    const cosX = Math.cos(tiltX);
    const sinX = Math.sin(tiltX);
    const cosY = Math.cos(tiltY);
    const sinY = Math.sin(tiltY);

    // Rotate around X then Y
    const y1 = y * cosX;
    const z1 = y * sinX;
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;

    ref.current.position.set(x2, y1, z2);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

/* ── Nucleus Core (distorted glowing sphere) ── */
function NucleusCore({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.002;
    ref.current.rotation.y += 0.003;
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      pointer.x * 0.8,
      0.03
    );
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      pointer.y * 0.8,
      0.03
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.6, 64, 64]} />
        <MeshDistortMaterial
          color={isDark ? "#6644ff" : "#4422cc"}
          roughness={0.1}
          metalness={0.6}
          distort={0.4}
          speed={3}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

/* ── Inner Glow Shell ── */
function InnerGlow({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.08);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.85, 32, 32]} />
      <meshBasicMaterial
        color={isDark ? "#4422cc" : "#6644ff"}
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

/* ── Scene ── */
function Scene({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#6644ff" />
      <pointLight position={[-5, -3, 3]} intensity={0.6} color="#ff4488" />
      <pointLight position={[0, 5, -5]} intensity={0.4} color="#44aaff" />

      <AmbientParticles isDark={isDark} />

      {/* Nucleus core */}
      <NucleusCore isDark={isDark} />
      <InnerGlow isDark={isDark} />

      {/* Orbital rings at different tilts */}
      <OrbitalRing radius={2} tiltX={0.3} tiltY={0} speed={0.15} color={isDark ? "#6644ff" : "#4422cc"} opacity={0.2} />
      <OrbitalRing radius={2.8} tiltX={1.2} tiltY={0.5} speed={-0.1} color={isDark ? "#ff4488" : "#cc2266"} opacity={0.15} />
      <OrbitalRing radius={3.5} tiltX={0.8} tiltY={-0.7} speed={0.08} color={isDark ? "#44aaff" : "#2266cc"} opacity={0.12} />

      {/* Electrons orbiting on the rings */}
      <Electron radius={2} tiltX={0.3} tiltY={0} speed={1.2} color="#8866ff" size={0.06} />
      <Electron radius={2} tiltX={0.3} tiltY={0} speed={1.2 + Math.PI} color="#8866ff" size={0.05} />
      <Electron radius={2.8} tiltX={1.2} tiltY={0.5} speed={-0.9} color="#ff6699" size={0.06} />
      <Electron radius={2.8} tiltX={1.2} tiltY={0.5} speed={-0.9 + Math.PI} color="#ff6699" size={0.04} />
      <Electron radius={3.5} tiltX={0.8} tiltY={-0.7} speed={0.7} color="#66bbff" size={0.05} />
      <Electron radius={3.5} tiltX={0.8} tiltY={-0.7} speed={0.7 + Math.PI * 0.7} color="#66bbff" size={0.05} />
    </>
  );
}

export default function HeroScene() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 z-0 opacity-80" data-no-transition>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <Scene isDark={isDark} />
      </Canvas>
    </div>
  );
}
