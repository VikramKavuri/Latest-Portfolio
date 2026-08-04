import React from 'react';

export default function NetworkIllustration() {
  // Network nodes representing communication/connections
  const nodes = [
    { x: 250, y: 60, r: 14, label: 'You', accent: true },
    { x: 120, y: 40, r: 8, label: '' },
    { x: 380, y: 45, r: 8, label: '' },
    { x: 80, y: 95, r: 6, label: '' },
    { x: 170, y: 110, r: 7, label: '' },
    { x: 330, y: 105, r: 7, label: '' },
    { x: 420, y: 90, r: 6, label: '' },
    { x: 140, y: 150, r: 5, label: '' },
    { x: 260, y: 145, r: 5, label: '' },
    { x: 370, y: 148, r: 5, label: '' },
  ];

  // Connections from center to satellite nodes
  const connections = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
    [1, 3], [1, 4], [2, 5], [2, 6],
    [4, 7], [4, 8], [5, 8], [5, 9], [6, 9],
  ];

  return (
    <svg
      viewBox="0 0 500 170"
      className="w-full h-auto opacity-60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="netGlow" cx="50%" cy="35%">
          <stop offset="0%" stopColor="#B8860B" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2C4A72" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow behind center */}
      <circle cx="250" cy="60" r="60" fill="url(#netGlow)" />

      {/* Connection lines */}
      {connections.map(([from, to], i) => {
        const n1 = nodes[from];
        const n2 = nodes[to];
        return (
          <line
            key={`line-${i}`}
            x1={n1.x} y1={n1.y}
            x2={n2.x} y2={n2.y}
            stroke="#2C4A72"
            strokeWidth="0.8"
            strokeDasharray="4,4"
            opacity="0.2"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="16"
              to="0"
              dur={`${2 + (i % 4) * 0.5}s`}
              repeatCount="indefinite"
            />
          </line>
        );
      })}

      {/* Data packet animation along select paths */}
      {[[0, 1], [0, 5], [4, 8]].map(([from, to], i) => {
        const n1 = nodes[from];
        const n2 = nodes[to];
        return (
          <circle key={`packet-${i}`} r="2.5" fill="#B8860B" opacity="0.5">
            <animateMotion
              dur={`${2.5 + i * 0.5}s`}
              repeatCount="indefinite"
              path={`M ${n1.x - 250} ${n1.y - 60} L ${n2.x - 250} ${n2.y - 60} L ${n1.x - 250} ${n1.y - 60}`}
            />
          </circle>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const color = node.accent ? '#B8860B' : '#2C4A72';
        return (
          <g key={`node-${i}`}>
            {node.accent && (
              <circle cx={node.x} cy={node.y} r={node.r + 4} fill="none" stroke="#B8860B" strokeWidth="0.5" opacity="0.25">
                <animate attributeName="r" values={`${node.r + 4};${node.r + 8};${node.r + 4}`} dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0.1;0.25" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={node.x} cy={node.y} r={node.r}
              fill="none"
              stroke={color}
              strokeWidth={node.accent ? 1.5 : 1}
              opacity="0.5"
            >
              <animate
                attributeName="opacity"
                values="0.35;0.6;0.35"
                dur={`${3 + (i % 3)}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={node.x} cy={node.y} r={node.r * 0.4} fill={color} opacity="0.3" />
            {node.label && (
              <text x={node.x} y={node.y + node.r + 14} textAnchor="middle" className="font-body" fill="#888CA4" fontSize="8">
                {node.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Envelope icon near center */}
      <g transform="translate(250, 58)" opacity="0.4">
        <rect x="-6" y="-4" width="12" height="8" fill="none" stroke="#B8860B" strokeWidth="0.8" rx="1" />
        <path d="M -6 -4 L 0 1 L 6 -4" fill="none" stroke="#B8860B" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
