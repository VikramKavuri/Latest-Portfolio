import React from 'react';

export default function TechGridIllustration() {
  // Hexagonal grid for tech ecosystem
  const hexSize = 22;
  const hexH = hexSize * Math.sqrt(3);

  // Generate hex grid positions
  const hexagons = [];
  const cols = 8;
  const rows = 3;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 55 + col * hexSize * 1.55 + (row % 2 ? hexSize * 0.775 : 0);
      const y = 30 + row * hexH * 0.85;
      hexagons.push({ x, y, row, col });
    }
  }

  const hexPath = (cx, cy, r) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return `M ${points.join(' L ')} Z`;
  };

  return (
    <svg
      viewBox="0 0 500 160"
      className="w-full h-auto opacity-60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2C4A72" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Connection lines between adjacent hexagons */}
      {hexagons.map((h1, i) =>
        hexagons.slice(i + 1).map((h2, j) => {
          const dist = Math.hypot(h1.x - h2.x, h1.y - h2.y);
          if (dist < hexSize * 2.2) {
            return (
              <line
                key={`conn-${i}-${j}`}
                x1={h1.x}
                y1={h1.y}
                x2={h2.x}
                y2={h2.y}
                stroke="#2C4A72"
                strokeWidth="0.5"
                opacity="0.12"
              />
            );
          }
          return null;
        })
      )}

      {/* Hexagons */}
      {hexagons.map((h, i) => {
        const isAccent = i % 5 === 0;
        const strokeColor = isAccent ? '#B8860B' : '#2C4A72';
        const fillOpacity = isAccent ? 0.08 : 0.04;
        return (
          <g key={i}>
            <path
              d={hexPath(h.x, h.y, hexSize * 0.75)}
              fill={strokeColor}
              fillOpacity={fillOpacity}
              stroke={strokeColor}
              strokeWidth="0.8"
              opacity="0.4"
            >
              <animate
                attributeName="opacity"
                values={`0.25;${0.35 + (i % 3) * 0.1};0.25`}
                dur={`${3 + (i % 4)}s`}
                repeatCount="indefinite"
              />
            </path>
            {/* Center dot */}
            <circle cx={h.x} cy={h.y} r="1.5" fill={strokeColor} opacity="0.25" />
          </g>
        );
      })}

      {/* Animated data pulse through grid */}
      {[0, 1].map((pathIdx) => {
        const start = hexagons[pathIdx * 3];
        const mid1 = hexagons[pathIdx * 3 + 4];
        const mid2 = hexagons[pathIdx * 3 + 9];
        const end = hexagons[hexagons.length - 1 - pathIdx * 2];
        if (!start || !mid1 || !mid2 || !end) return null;
        return (
          <path
            key={`pulse-${pathIdx}`}
            d={`M ${start.x} ${start.y} L ${mid1.x} ${mid1.y} L ${mid2.x} ${mid2.y} L ${end.x} ${end.y}`}
            fill="none"
            stroke="#B8860B"
            strokeWidth="1.5"
            strokeDasharray="5,10"
            opacity="0.3"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="30"
              to="0"
              dur={`${2.5 + pathIdx}s`}
              repeatCount="indefinite"
            />
          </path>
        );
      })}

      {/* Labels */}
      <text x="250" y="155" textAnchor="middle" className="font-body" fill="#888CA4" fontSize="8" letterSpacing="0.15em">
        INTERCONNECTED TECHNOLOGY ECOSYSTEM
      </text>
    </svg>
  );
}
