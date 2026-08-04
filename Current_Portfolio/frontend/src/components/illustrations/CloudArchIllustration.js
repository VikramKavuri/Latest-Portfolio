import React from 'react';

export default function CloudArchIllustration() {
  return (
    <svg
      viewBox="0 0 500 180"
      className="w-full h-auto opacity-65"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2C4A72" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0.1" />
        </linearGradient>
        <filter id="cloudGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Cloud shape */}
      <path
        d="M 180 55 C 180 35, 200 20, 225 20 C 235 10, 260 5, 280 15 C 295 5, 325 10, 330 25 C 345 22, 355 35, 350 50 C 360 55, 360 70, 345 75 L 185 75 C 170 72, 168 58, 180 55 Z"
        fill="url(#cloudGrad)"
        stroke="#2C4A72"
        strokeWidth="1"
        opacity="0.5"
      />
      <text x="265" y="55" textAnchor="middle" className="font-body" fill="#2C4A72" fontSize="10" opacity="0.6">CLOUD</text>

      {/* Database cylinders at bottom */}
      {[100, 200, 300, 400].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy="145" rx="20" ry="6" fill="none" stroke="#2C4A72" strokeWidth="1" opacity="0.35" />
          <rect x={x - 20} y="145" width="40" height="20" fill="none" stroke="#2C4A72" strokeWidth="1" opacity="0.35" />
          <ellipse cx={x} cy="165" rx="20" ry="6" fill="none" stroke="#2C4A72" strokeWidth="1" opacity="0.35" />
          <ellipse cx={x} cy="145" rx="20" ry="6" fill="#2C4A72" opacity="0.06" />
          <text x={x} y="182" textAnchor="middle" className="font-body" fill="#888CA4" fontSize="7">
            {['SQL', 'NoSQL', 'Lake', 'API'][i]}
          </text>
        </g>
      ))}

      {/* Data flow arrows (bottom → cloud) */}
      {[100, 200, 300, 400].map((x, i) => (
        <path
          key={`arrow-${i}`}
          d={`M ${x} 138 L ${x < 250 ? x + 30 : x - 30} 80`}
          fill="none"
          stroke="#2C4A72"
          strokeWidth="1"
          strokeDasharray="4,3"
          opacity="0.3"
        >
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </path>
      ))}

      {/* Processing nodes inside cloud */}
      {[225, 265, 305].map((x, i) => (
        <g key={`proc-${i}`}>
          <circle cx={x} cy="48" r="5" fill="none" stroke="#B8860B" strokeWidth="0.8" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy="48" r="2" fill="#B8860B" opacity="0.3" />
        </g>
      ))}

      {/* Output arrows (cloud → top) */}
      <path d="M 240 22 L 220 5" fill="none" stroke="#B8860B" strokeWidth="1" strokeDasharray="3,3" opacity="0.3">
        <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.8s" repeatCount="indefinite" />
      </path>
      <path d="M 290 18 L 310 3" fill="none" stroke="#B8860B" strokeWidth="1" strokeDasharray="3,3" opacity="0.3">
        <animate attributeName="stroke-dashoffset" from="12" to="0" dur="2s" repeatCount="indefinite" />
      </path>

      {/* Labels */}
      <text x="210" y="10" textAnchor="middle" className="font-body" fill="#888CA4" fontSize="7">Analytics</text>
      <text x="320" y="8" textAnchor="middle" className="font-body" fill="#888CA4" fontSize="7">Dashboards</text>
    </svg>
  );
}
