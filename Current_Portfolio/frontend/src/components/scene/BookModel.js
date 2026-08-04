import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const NAVY = '#2C4A72';
const GOLD = '#B8860B';
const CREAM = '#ECEDF4';

export default function BookModel({ isOpening, onOpenComplete, onClick }) {
  const groupRef = useRef();
  const coverRef = useRef();
  const openProgress = useRef(0);
  const [hovered, setHovered] = useState(false);

  const coverMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: NAVY,
    roughness: 0.25,
    metalness: 0.15,
  }), []);

  const pageMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: CREAM,
    roughness: 0.7,
    metalness: 0,
  }), []);

  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: GOLD,
    roughness: 0.2,
    metalness: 0.7,
    emissive: GOLD,
    emissiveIntensity: 0.15,
  }), []);

  const bookWidth = 3;
  const bookHeight = 4;
  const bookDepth = 0.4;
  const coverThickness = 0.05;

  useFrame((_, delta) => {
    if (isOpening && openProgress.current < 1) {
      openProgress.current = Math.min(openProgress.current + delta * 0.8, 1);
      if (coverRef.current) {
        const ease = 1 - Math.pow(1 - openProgress.current, 3);
        coverRef.current.rotation.y = -ease * Math.PI * 0.85;
      }
      if (openProgress.current >= 1 && onOpenComplete) {
        onOpenComplete();
      }
    }

    // Hover float effect
    if (groupRef.current && !isOpening) {
      const targetY = hovered ? 0.08 : 0;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.08;
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[-0.1, 0, 0]}>
      {/* Back cover */}
      <mesh material={coverMaterial} position={[0, -bookDepth / 2 + coverThickness / 2, 0]}>
        <boxGeometry args={[bookWidth, coverThickness, bookHeight]} />
      </mesh>

      {/* Pages block */}
      <mesh material={pageMaterial} position={[0, 0, 0]}>
        <boxGeometry args={[bookWidth - 0.1, bookDepth - coverThickness * 2, bookHeight - 0.1]} />
      </mesh>

      {/* Front cover (opens) — clickable */}
      <group
        ref={coverRef}
        position={[-bookWidth / 2, bookDepth / 2 - coverThickness / 2, 0]}
      >
        <mesh
          material={coverMaterial}
          position={[bookWidth / 2, 0, 0]}
          onClick={onClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <boxGeometry args={[bookWidth, coverThickness, bookHeight]} />
        </mesh>

        {/* Cover text — VIKRAM (no font prop = uses built-in default) */}
        <Text
          position={[bookWidth / 2, coverThickness / 2 + 0.01, 0.4]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.35}
          color={GOLD}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          VIKRAM
        </Text>
        <Text
          position={[bookWidth / 2, coverThickness / 2 + 0.01, -0.05]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.35}
          color={GOLD}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          KAVURI
        </Text>

        {/* Gold divider line */}
        <mesh material={goldMaterial} position={[bookWidth / 2, coverThickness / 2 + 0.012, -0.45]}>
          <boxGeometry args={[1.6, 0.005, 0.015]} />
        </mesh>

        {/* Cover text — Title */}
        <Text
          position={[bookWidth / 2, coverThickness / 2 + 0.01, -0.75]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.13}
          color={GOLD}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
        >
          DATA ANALYTICS ENGINEER
        </Text>

        {/* Corner gold decorations — top-left */}
        <mesh material={goldMaterial} position={[0.3, coverThickness / 2 + 0.012, bookHeight / 2 - 0.3]}>
          <boxGeometry args={[0.4, 0.003, 0.003]} />
        </mesh>
        <mesh material={goldMaterial} position={[0.12, coverThickness / 2 + 0.012, bookHeight / 2 - 0.12]}>
          <boxGeometry args={[0.003, 0.003, 0.4]} />
        </mesh>
        {/* Corner gold decorations — bottom-right */}
        <mesh material={goldMaterial} position={[bookWidth - 0.3, coverThickness / 2 + 0.012, -(bookHeight / 2 - 0.3)]}>
          <boxGeometry args={[0.4, 0.003, 0.003]} />
        </mesh>
        <mesh material={goldMaterial} position={[bookWidth - 0.12, coverThickness / 2 + 0.012, -(bookHeight / 2 - 0.12)]}>
          <boxGeometry args={[0.003, 0.003, 0.4]} />
        </mesh>
      </group>

      {/* Spine */}
      <mesh material={coverMaterial} position={[-bookWidth / 2, 0, 0]}>
        <boxGeometry args={[0.06, bookDepth, bookHeight]} />
      </mesh>

      {/* Hover glow on right edge */}
      {hovered && !isOpening && (
        <mesh position={[bookWidth / 2 + 0.02, bookDepth / 2, 0]}>
          <boxGeometry args={[0.05, 0.1, bookHeight * 0.85]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
