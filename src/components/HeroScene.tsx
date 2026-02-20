"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Points, PointMaterial, Edges } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

/* ── Dust Particles ── */
function DustField({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const count = 600;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.005;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={isDark ? "#ffffff" : "#000000"}
        size={0.006}
        sizeAttenuation
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

/* ── Outer Wireframe Icosahedron (slowly rotating cage) ── */
function WireframeCage({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.05;
    ref.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <mesh ref={ref} scale={3.2}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial visible={false} />
      <Edges
        threshold={15}
        color={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
      />
    </mesh>
  );
}

/* ── Inner Morphing Core ── */
function MorphCore({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.004;
    ref.current.rotation.y += 0.006;
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      pointer.x * 0.6,
      0.02
    );
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      pointer.y * 0.6,
      0.02
    );
  });

  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.2}>
      <mesh ref={ref} scale={1.4}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color={isDark ? "#ffffff" : "#111111"}
          roughness={0.15}
          metalness={0.95}
          distort={0.25}
          speed={1.5}
          wireframe
        />
      </mesh>
    </Float>
  );
}

/* ── Secondary Orbiting Shape ── */
function OrbitingShard({ isDark, offset, radius, speed }: { isDark: boolean; offset: number; radius: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.7) * radius * 0.5;
    ref.current.position.z = Math.sin(t) * radius * 0.8;
    ref.current.rotation.x = t * 2;
    ref.current.rotation.z = t * 1.5;
  });

  return (
    <mesh ref={ref} scale={0.12}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={isDark ? "#ffffff" : "#222222"}
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
}

/* ── Thin Orbital Rings ── */
function ThinRing({ radius, tiltX, tiltY, speed, isDark }: { radius: number; tiltX: number; tiltY: number; speed: number; isDark: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <group rotation={[tiltX, tiltY, 0]} ref={ref}>
      <mesh>
        <torusGeometry args={[radius, 0.004, 8, 200]} />
        <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

/* ── Scene ── */
function Scene({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 2, 4]} intensity={0.4} color="#ffffff" />

      <DustField isDark={isDark} />
      <WireframeCage isDark={isDark} />
      <MorphCore isDark={isDark} />

      {/* Orbiting shards */}
      <OrbitingShard isDark={isDark} offset={0} radius={2.5} speed={0.4} />
      <OrbitingShard isDark={isDark} offset={2.1} radius={2.8} speed={0.3} />
      <OrbitingShard isDark={isDark} offset={4.2} radius={2.2} speed={0.5} />
      <OrbitingShard isDark={isDark} offset={1.0} radius={3.0} speed={0.35} />
      <OrbitingShard isDark={isDark} offset={5.5} radius={2.0} speed={0.45} />

      {/* Subtle rings */}
      <ThinRing radius={2.0} tiltX={0.4} tiltY={0.2} speed={0.06} isDark={isDark} />
      <ThinRing radius={2.6} tiltX={1.3} tiltY={-0.4} speed={-0.04} isDark={isDark} />
      <ThinRing radius={3.3} tiltX={0.7} tiltY={0.8} speed={0.03} isDark={isDark} />
    </>
  );
}

export default function HeroScene() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 z-0" data-no-transition>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <Scene isDark={isDark} />
      </Canvas>
    </div>
  );
}
