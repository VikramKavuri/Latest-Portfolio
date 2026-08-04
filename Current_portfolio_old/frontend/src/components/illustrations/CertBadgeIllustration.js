import React from 'react';

export default function CertBadgeIllustration() {
  return (
    <svg
      viewBox="0 0 400 120"
      className="w-full h-auto opacity-60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B8860B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2C4A72" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Central shield/badge */}
      <path
        d="M 200 15 L 230 25 L 235 55 L 215 80 L 200 88 L 185 80 L 165 55 L 170 25 Z"
        fill="url(#badgeGrad)"
        stroke="#B8860B"
        strokeWidth="1"
        opacity="0.6"
      >
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite" />
      </path>

      {/* Checkmark inside badge */}
      <path
        d="M 188 50 L 196 58 L 212 42"
        fill="none"
        stroke="#B8860B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* Radiating lines (seal effect) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 12;
        const r1 = 48;
        const r2 = 58;
        const x1 = 200 + Math.cos(angle) * r1;
        const y1 = 50 + Math.sin(angle) * r1;
        const x2 = 200 + Math.cos(angle) * r2;
        const y2 = 50 + Math.sin(angle) * r2;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#B8860B"
            strokeWidth="0.5"
            opacity="0.25"
          >
            <animate
              attributeName="opacity"
              values="0.15;0.35;0.15"
              dur={`${2 + (i % 3) * 0.5}s`}
              repeatCount="indefinite"
            />
          </line>
        );
      })}

      {/* Orbiting dots */}
      {[0, 1, 2].map((i) => {
        const radius = 52;
        return (
          <circle
            key={`orbit-${i}`}
            cx="200"
            cy="50"
            r="2"
            fill="#2C4A72"
            opacity="0.35"
          >
            <animateMotion
              dur={`${4 + i}s`}
              repeatCount="indefinite"
              path={`M ${radius * Math.cos(i * 2.09)} ${radius * Math.sin(i * 2.09)} A ${radius} ${radius} 0 1 1 ${radius * Math.cos(i * 2.09 - 0.01)} ${radius * Math.sin(i * 2.09 - 0.01)} Z`}
            />
          </circle>
        );
      })}

      {/* Decorative side elements — data chart left */}
      <g opacity="0.3">
        {[60, 75, 90, 105, 120].map((x, i) => (
          <rect
            key={`bar-l-${i}`}
            x={x}
            y={80 - [20, 30, 15, 35, 25][i]}
            width="8"
            height={[20, 30, 15, 35, 25][i]}
            fill="#2C4A72"
            opacity="0.4"
            rx="1"
          >
            <animate
              attributeName="height"
              values={`${[20, 30, 15, 35, 25][i]};${[25, 20, 30, 20, 35][i]};${[20, 30, 15, 35, 25][i]}`}
              dur={`${3 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </g>

      {/* Decorative side elements — line chart right */}
      <g opacity="0.3">
        <polyline
          points="280,70 295,55 310,65 325,45 340,50"
          fill="none"
          stroke="#2C4A72"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {[280, 295, 310, 325, 340].map((x, i) => (
          <circle key={`dot-r-${i}`} cx={x} cy={[70, 55, 65, 45, 50][i]} r="2" fill="#B8860B" opacity="0.5" />
        ))}
      </g>

      {/* Bottom label */}
      <text x="200" y="110" textAnchor="middle" className="font-body" fill="#888CA4" fontSize="8" letterSpacing="0.12em">
        VERIFIED CREDENTIALS
      </text>
    </svg>
  );
}
