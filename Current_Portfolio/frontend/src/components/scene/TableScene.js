import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SteamParticles() {
  const particlesRef = useRef();
  const count = 20;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 1] = Math.random() * 0.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const posArray = particlesRef.current.geometry.attributes.position.array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += 0.005;
      posArray[i * 3] += Math.sin(t + i) * 0.001;
      if (posArray[i * 3 + 1] > 1.2) {
        posArray[i * 3 + 1] = 0;
        posArray[i * 3] = (Math.random() - 0.5) * 0.2;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#D0D4E0"
        size={0.03}
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function CoffeeCup({ position }) {
  const cupColor = '#E8E9F0';
  const coffeeColor = '#3E2723';

  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.16, 0.5, 32]} />
        <meshStandardMaterial color={cupColor} roughness={0.2} metalness={0.1} />
      </mesh>

      <mesh position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial color={coffeeColor} roughness={0.1} metalness={0.1} />
      </mesh>

      <mesh position={[0.28, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.1, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color={cupColor} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.03, 32]} />
        <meshStandardMaterial color={cupColor} roughness={0.2} metalness={0.05} />
      </mesh>

      <group position={[0, 0.5, 0]}>
        <SteamParticles />
      </group>
    </group>
  );
}

export default function TableScene() {
  const tableTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Dark slate base
    ctx.fillStyle = '#2D3142';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle marble veining
    for (let i = 0; i < 25; i++) {
      const r = 140 + Math.random() * 50;
      const g = 145 + Math.random() * 50;
      const b = 165 + Math.random() * 50;
      const a = 0.04 + Math.random() * 0.06;
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.lineWidth = 0.5 + Math.random() * 2.5;
      ctx.beginPath();
      const startY = Math.random() * 512;
      ctx.moveTo(0, startY);
      for (let x = 0; x < 512; x += 15) {
        ctx.lineTo(x, startY + Math.sin(x * 0.008 + i) * 20 + (Math.random() - 0.5) * 8);
      }
      ctx.stroke();
    }

    // Subtle grain noise
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const v = 50 + Math.random() * 30;
      ctx.fillStyle = `rgba(${v}, ${v + 5}, ${v + 15}, 0.08)`;
      ctx.fillRect(x, y, 1, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }, []);

  return (
    <group>
      {/* Dark slate table surface */}
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial
          map={tableTexture}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* Subtle reflective layer */}
      <mesh position={[0, -0.245, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial
          color="#3D4258"
          transparent
          opacity={0.03}
          roughness={0}
          metalness={0.9}
        />
      </mesh>

      <CoffeeCup position={[2.5, -0.25, -0.5]} />
      <group position={[3.2, -0.25, 1.2]} scale={[0.7, 0.7, 0.7]}>
        <CoffeeCup position={[0, 0, 0]} />
      </group>
    </group>
  );
}
