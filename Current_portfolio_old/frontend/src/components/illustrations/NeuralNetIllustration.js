import React from 'react';

export default function NeuralNetIllustration() {
  // Layer definitions: x position and number of nodes
  const layers = [
    { x: 60, nodes: 4, label: 'Input' },
    { x: 180, nodes: 6, label: 'Process' },
    { x: 300, nodes: 6, label: 'Analyze' },
    { x: 420, nodes: 3, label: 'Output' },
  ];

  const getNodeY = (total, index, height = 160) => {
    const spacing = height / (total + 1);
    return 20 + spacing * (index + 1);
  };

  return (
    <svg
      viewBox="0 0 500 200"
      className="w-full h-auto opacity-65"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nnLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2C4A72" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Connection lines between layers */}
      {layers.slice(0, -1).map((layer, li) => {
        const nextLayer = layers[li + 1];
        const lines = [];
        for (let i = 0; i < layer.nodes; i++) {
          for (let j = 0; j < nextLayer.nodes; j++) {
            const y1 = getNodeY(layer.nodes, i);
            const y2 = getNodeY(nextLayer.nodes, j);
            lines.push(
              <line
                key={`${li}-${i}-${j}`}
                x1={layer.x}
                y1={y1}
                x2={nextLayer.x}
                y2={y2}
                stroke="url(#nnLineGrad)"
                strokeWidth="0.5"
                opacity="0.4"
              />
            );
          }
        }
        return lines;
      })}

      {/* Animated pulse along one path */}
      {[0, 1, 2].map((pathIdx) => {
        const nodeIndices = [
          pathIdx % layers[0].nodes,
          (pathIdx + 1) % layers[1].nodes,
          (pathIdx + 2) % layers[2].nodes,
          pathIdx % layers[3].nodes,
        ];
        const points = layers.map((l, li) => ({
          x: l.x,
          y: getNodeY(l.nodes, nodeIndices[li]),
        }));
        const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        return (
          <path
            key={`pulse-${pathIdx}`}
            d={pathD}
            fill="none"
            stroke="#B8860B"
            strokeWidth="1.5"
            strokeDasharray="6,12"
            opacity="0.35"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="36"
              to="0"
              dur={`${2 + pathIdx * 0.5}s`}
              repeatCount="indefinite"
            />
          </path>
        );
      })}

      {/* Nodes */}
      {layers.map((layer, li) =>
        Array.from({ length: layer.nodes }).map((_, ni) => {
          const y = getNodeY(layer.nodes, ni);
          const isEdge = li === 0 || li === layers.length - 1;
          const color = isEdge ? '#B8860B' : '#2C4A72';
          return (
            <g key={`node-${li}-${ni}`}>
              <circle
                cx={layer.x}
                cy={y}
                r={isEdge ? 6 : 5}
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity="0.5"
              >
                <animate
                  attributeName="opacity"
                  values="0.3;0.6;0.3"
                  dur={`${2.5 + ni * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={layer.x} cy={y} r="2" fill={color} opacity="0.35" />
            </g>
          );
        })
      )}

      {/* Layer labels */}
      {layers.map((layer) => (
        <text
          key={layer.label}
          x={layer.x}
          y="195"
          textAnchor="middle"
          className="font-body"
          fill="#888CA4"
          fontSize="8"
        >
          {layer.label}
        </text>
      ))}
    </svg>
  );
}
