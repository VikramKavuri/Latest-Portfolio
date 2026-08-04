import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const SKILLS = [
  { label: 'Data Engineering', value: 0.92 },
  { label: 'Cloud & DevOps', value: 0.85 },
  { label: 'Machine Learning', value: 0.8 },
  { label: 'Business Intel', value: 0.88 },
  { label: 'ETL Pipelines', value: 0.93 },
  { label: 'Data Governance', value: 0.78 },
  { label: 'Database Design', value: 0.86 },
];

const SIZE = 320;
const CENTER = SIZE / 2;
const MAX_RADIUS = 110;
const LEVELS = 3;

function polarToCart(angle, radius) {
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

function getAngle(index, total) {
  return (2 * Math.PI * index) / total - Math.PI / 2;
}

export default function SkillRadarChart({ className = '' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const n = SKILLS.length;

  // Build polygon points for each grid level
  const gridPolygons = Array.from({ length: LEVELS }, (_, lvl) => {
    const r = MAX_RADIUS * ((lvl + 1) / LEVELS);
    return SKILLS.map((_, i) => {
      const { x, y } = polarToCart(getAngle(i, n), r);
      return `${x},${y}`;
    }).join(' ');
  });

  // Build data polygon
  const dataPoints = SKILLS.map((s, i) => {
    const { x, y } = polarToCart(getAngle(i, n), s.value * MAX_RADIUS);
    return `${x},${y}`;
  }).join(' ');

  // Vertex positions for dots + labels
  const vertices = SKILLS.map((s, i) => ({
    ...s,
    ...polarToCart(getAngle(i, n), s.value * MAX_RADIUS),
    axisEnd: polarToCart(getAngle(i, n), MAX_RADIUS),
    angle: getAngle(i, n),
    index: i,
  }));

  const handleHover = useCallback((i) => setHoveredIndex(i), []);
  const handleLeave = useCallback(() => setHoveredIndex(null), []);

  return (
    <div ref={ref} className={`flex justify-center px-16 ${className}`}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[340px] h-auto" overflow="visible">
        {/* Grid levels */}
        {gridPolygons.map((points, lvl) => (
          <polygon
            key={lvl}
            points={points}
            fill="none"
            stroke="#2C4A72"
            strokeWidth={0.8}
            opacity={0.2 + lvl * 0.08}
          />
        ))}

        {/* Axis lines */}
        {vertices.map((v) => (
          <line
            key={`axis-${v.index}`}
            x1={CENTER}
            y1={CENTER}
            x2={v.axisEnd.x}
            y2={v.axisEnd.y}
            stroke="#2C4A72"
            strokeWidth={0.7}
            opacity={0.18}
          />
        ))}

        {/* Data polygon fill */}
        <motion.polygon
          points={dataPoints}
          fill="#B8860B"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 0.18 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Data polygon stroke */}
        <motion.polygon
          points={dataPoints}
          fill="none"
          stroke="#B8860B"
          strokeWidth={1.5}
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isVisible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Vertex dots + hover zones */}
        {vertices.map((v) => (
          <g key={`dot-${v.index}`}>
            {/* Invisible larger hover target */}
            <circle
              cx={v.x}
              cy={v.y}
              r={12}
              fill="transparent"
              onMouseEnter={() => handleHover(v.index)}
              onMouseLeave={handleLeave}
              style={{ cursor: 'pointer' }}
            />
            {/* Visible dot */}
            <motion.circle
              cx={v.x}
              cy={v.y}
              r={hoveredIndex === v.index ? 5 : 3}
              fill="#B8860B"
              initial={{ scale: 0, opacity: 0 }}
              animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + v.index * 0.08 }}
            />
            {/* Hover glow */}
            {hoveredIndex === v.index && (
              <circle
                cx={v.x}
                cy={v.y}
                r={10}
                fill="none"
                stroke="#B8860B"
                strokeWidth={1}
                opacity={0.3}
              />
            )}
          </g>
        ))}

        {/* Axis labels */}
        {vertices.map((v) => {
          const labelR = MAX_RADIUS + 24;
          const { x: lx, y: ly } = polarToCart(v.angle, labelR);
          const isRight = lx > CENTER;
          const isBottom = ly > CENTER;
          return (
            <text
              key={`label-${v.index}`}
              x={lx}
              y={ly}
              textAnchor={Math.abs(lx - CENTER) < 5 ? 'middle' : isRight ? 'start' : 'end'}
              dominantBaseline={Math.abs(ly - CENTER) < 5 ? 'middle' : isBottom ? 'hanging' : 'auto'}
              className="font-body"
              fontSize={11}
              fontWeight={hoveredIndex === v.index ? 600 : 500}
              fill={hoveredIndex === v.index ? '#B8860B' : '#2C4A72'}
              style={{
                opacity: isVisible ? 1 : 0,
                transition: `opacity 0.5s ease ${0.5 + v.index * 0.06}s, fill 0.2s ease`,
              }}
            >
              {v.label}
            </text>
          );
        })}

        {/* Hover tooltip: show percentage */}
        {hoveredIndex !== null && (
          <text
            x={CENTER}
            y={CENTER + 4}
            textAnchor="middle"
            className="font-display"
            fontSize={18}
            fill="#161927"
            fontWeight={500}
          >
            {Math.round(SKILLS[hoveredIndex].value * 100)}%
          </text>
        )}
      </svg>
    </div>
  );
}
