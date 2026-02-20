"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

/* ── Mouse-Reactive Dust Field ── */
function DustField({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  const count = 1500;

  const basePositions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 24;
      p[i * 3 + 1] = (Math.random() - 0.5) * 24;
      p[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return p;
  }, []);

  const positions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.005;
    const geo = ref.current.geometry;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    const mx = pointer.x * 5;
    const my = pointer.y * 5;

    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const dx = bx - mx;
      const dy = by - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulse = Math.max(0, 1 - dist / 3) * 1.5;
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);
      posAttr.setXYZ(i, bx + nx * repulse, by + ny * repulse, basePositions[i * 3 + 2]);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={isDark ? "#ffffff" : "#333333"} size={0.025} transparent opacity={isDark ? 0.7 : 0.4} sizeAttenuation />
    </points>
  );
}

/* ── Reactive Wireframe — lines split open near cursor ── */
function ReactiveWireframe({ geo, baseScale, speedX, speedY, isDark, opacity }: {
  geo: "icosahedron" | "octahedron" | "dodecahedron";
  baseScale: number;
  speedX: number;
  speedY: number;
  isDark: boolean;
  opacity: number;
}) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  // Extract edges from geometry
  const { basePositions, edgeCount } = useMemo(() => {
    let geom: THREE.BufferGeometry;
    switch (geo) {
      case "icosahedron": geom = new THREE.IcosahedronGeometry(1, 1); break;
      case "octahedron": geom = new THREE.OctahedronGeometry(1, 1); break;
      case "dodecahedron": geom = new THREE.DodecahedronGeometry(1, 1); break;
    }
    const edges = new THREE.EdgesGeometry(geom, 15);
    const pos = edges.getAttribute("position");
    const arr = new Float32Array(pos.array.length);
    arr.set(pos.array as Float32Array);
    geom.dispose();
    edges.dispose();
    return { basePositions: arr, edgeCount: pos.count / 2 };
  }, [geo]);

  const positions = useMemo(() => new Float32Array(basePositions.length), [basePositions]);

  useFrame((state) => {
    if (!lineRef.current || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = t * speedX + pointer.y * 0.3;
    groupRef.current.rotation.y = t * speedY + pointer.x * 0.3;

    const posAttr = lineRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    // Mouse position in 3D (approximate — project into scene space)
    const mx = pointer.x * 3;
    const my = pointer.y * 3;
    const repulseRadius = 1.2;
    const repulseStrength = 0.6;

    for (let i = 0; i < edgeCount; i++) {
      const i0 = i * 6; // 2 vertices per edge, 3 components each
      // Get midpoint of edge
      const midX = (basePositions[i0] + basePositions[i0 + 3]) / 2 * baseScale;
      const midY = (basePositions[i0 + 1] + basePositions[i0 + 4]) / 2 * baseScale;

      const dx = midX - mx;
      const dy = midY - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, 1 - dist / repulseRadius);
      const pushX = (dx / (dist || 1)) * force * repulseStrength;
      const pushY = (dy / (dist || 1)) * force * repulseStrength;

      // Apply push to both vertices of this edge, also spread them apart
      const spreadX = (basePositions[i0] - basePositions[i0 + 3]) * force * 0.3;
      const spreadY = (basePositions[i0 + 1] - basePositions[i0 + 4]) * force * 0.3;

      positions[i0] = basePositions[i0] + pushX / baseScale + spreadX;
      positions[i0 + 1] = basePositions[i0 + 1] + pushY / baseScale + spreadY;
      positions[i0 + 2] = basePositions[i0 + 2];

      positions[i0 + 3] = basePositions[i0 + 3] + pushX / baseScale - spreadX;
      positions[i0 + 4] = basePositions[i0 + 4] + pushY / baseScale - spreadY;
      positions[i0 + 5] = basePositions[i0 + 5];
    }

    posAttr.set(positions);
    posAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef} scale={baseScale}>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={isDark ? "#ffffff" : "#000000"}
          transparent
          opacity={opacity}
        />
      </lineSegments>
    </group>
  );
}

/* ── Smaller Morphing Core ── */
function MorphCore({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.004;
    ref.current.rotation.y += 0.006;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, pointer.x * 0.6, 0.02);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, pointer.y * 0.6, 0.02);
  });

  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.2}>
      <mesh ref={ref} scale={0.8}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color={isDark ? "#ffffff" : "#111111"}
          roughness={0.15}
          metalness={0.95}
          distort={0.2}
          speed={1.5}
          wireframe
        />
      </mesh>
    </Float>
  );
}

/* ── Orbiting Shards ── */
function Shard({ isDark, offset, radius, speed, size }: { isDark: boolean; offset: number; radius: number; speed: number; size: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.7) * radius * 0.5, Math.sin(t) * radius * 0.8);
    ref.current.rotation.x = t * 2;
    ref.current.rotation.z = t * 1.5;
  });
  return (
    <mesh ref={ref} scale={size}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={isDark ? "#fff" : "#222"} roughness={0.3} metalness={0.8} />
    </mesh>
  );
}

/* ── Mouse-Reactive Grid Floor ── */
function ReactiveGrid({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  const gridSize = 30;
  const spacing = 0.6;

  const basePositions = useMemo(() => {
    const pos = new Float32Array(gridSize * gridSize * 3);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const idx = (i * gridSize + j) * 3;
        pos[idx] = (i - gridSize / 2) * spacing;
        pos[idx + 1] = -3;
        pos[idx + 2] = (j - gridSize / 2) * spacing - 2;
      }
    }
    return pos;
  }, []);

  const positions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  useFrame(() => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const mouseX = pointer.x * 8;
    const mouseZ = pointer.y * 8;
    for (let i = 0; i < gridSize * gridSize; i++) {
      const bx = basePositions[i * 3];
      const bz = basePositions[i * 3 + 2];
      const dx = bx - mouseX;
      const dz = bz - mouseZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const wave = Math.exp(-dist * 0.3) * 1.2;
      posAttr.setY(i, -3 + wave);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={isDark ? "#ffffff" : "#000000"} size={0.02} transparent opacity={0.15} sizeAttenuation />
    </points>
  );
}

/* ── Scene ── */
function Scene({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 2, 4]} intensity={0.4} />

      <DustField isDark={isDark} />

      {/* Reactive wireframes — lines split open near cursor */}
      <ReactiveWireframe geo="icosahedron" baseScale={2.2} speedX={0.04} speedY={0.06} isDark={isDark} opacity={isDark ? 0.12 : 0.08} />
      <ReactiveWireframe geo="dodecahedron" baseScale={1.8} speedX={-0.03} speedY={0.05} isDark={isDark} opacity={isDark ? 0.1 : 0.07} />
      <ReactiveWireframe geo="octahedron" baseScale={2.8} speedX={0.02} speedY={-0.03} isDark={isDark} opacity={isDark ? 0.08 : 0.05} />

      <MorphCore isDark={isDark} />

      {/* Shards */}
      <Shard isDark={isDark} offset={0} radius={2.5} speed={0.4} size={0.1} />
      <Shard isDark={isDark} offset={2.1} radius={2.8} speed={0.3} size={0.08} />
      <Shard isDark={isDark} offset={4.2} radius={2.2} speed={0.5} size={0.12} />
      <Shard isDark={isDark} offset={1.0} radius={3.0} speed={0.35} size={0.09} />
      <Shard isDark={isDark} offset={5.5} radius={2.0} speed={0.45} size={0.07} />

      <ReactiveGrid isDark={isDark} />
    </>
  );
}

export default function HeroScene() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 z-0" data-no-transition>
      <Canvas camera={{ position: [0, 0.5, 6], fov: 45 }} dpr={[1, 2]}>
        <Scene isDark={isDark} />
      </Canvas>
    </div>
  );
}
