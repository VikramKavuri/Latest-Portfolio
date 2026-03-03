import React from 'react';

export default function DataPipelineIllustration() {
  return (
    <svg
      viewBox="0 0 600 200"
      className="w-full h-auto opacity-70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2C4A72" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#2C4A72" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="nodeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2C4A72" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Connection lines with animation */}
      <path d="M 60 100 C 120 100, 140 50, 200 50" fill="none" stroke="url(#pipeGrad)" strokeWidth="2" strokeDasharray="8,4">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M 60 100 C 120 100, 140 100, 200 100" fill="none" stroke="url(#pipeGrad)" strokeWidth="2" strokeDasharray="8,4">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.8s" repeatCount="indefinite" />
      </path>
      <path d="M 60 100 C 120 100, 140 150, 200 150" fill="none" stroke="url(#pipeGrad)" strokeWidth="2" strokeDasharray="8,4">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="2.2s" repeatCount="indefinite" />
      </path>

      {/* Middle convergence */}
      <path d="M 200 50 L 300 100" fill="none" stroke="url(#pipeGrad)" strokeWidth="2" strokeDasharray="8,4">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M 200 100 L 300 100" fill="none" stroke="url(#pipeGrad)" strokeWidth="2" strokeDasharray="8,4">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M 200 150 L 300 100" fill="none" stroke="url(#pipeGrad)" strokeWidth="2" strokeDasharray="8,4">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.5s" repeatCount="indefinite" />
      </path>

      {/* Output lines */}
      <path d="M 300 100 C 360 100, 380 60, 440 60" fill="none" stroke="url(#pipeGrad)" strokeWidth="2" strokeDasharray="8,4">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.6s" repeatCount="indefinite" />
      </path>
      <path d="M 300 100 C 360 100, 380 140, 440 140" fill="none" stroke="url(#pipeGrad)" strokeWidth="2" strokeDasharray="8,4">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.8s" repeatCount="indefinite" />
      </path>

      {/* Final convergence */}
      <path d="M 440 60 L 540 100" fill="none" stroke="url(#pipeGrad)" strokeWidth="2" strokeDasharray="8,4">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.4s" repeatCount="indefinite" />
      </path>
      <path d="M 440 140 L 540 100" fill="none" stroke="url(#pipeGrad)" strokeWidth="2" strokeDasharray="8,4">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.4s" repeatCount="indefinite" />
      </path>

      {/* Source node */}
      <circle cx="60" cy="100" r="12" fill="none" stroke="#2C4A72" strokeWidth="1.5" opacity="0.5">
        <animate attributeName="r" values="12;14;12" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="100" r="4" fill="#2C4A72" opacity="0.4" />
      <text x="60" y="130" textAnchor="middle" className="font-body" fill="#888CA4" fontSize="9">Sources</text>

      {/* ETL nodes */}
      <circle cx="200" cy="50" r="8" fill="none" stroke="#2C4A72" strokeWidth="1" opacity="0.4" />
      <circle cx="200" cy="50" r="3" fill="#2C4A72" opacity="0.3" />
      <circle cx="200" cy="100" r="8" fill="none" stroke="#2C4A72" strokeWidth="1" opacity="0.4" />
      <circle cx="200" cy="100" r="3" fill="#2C4A72" opacity="0.3" />
      <circle cx="200" cy="150" r="8" fill="none" stroke="#2C4A72" strokeWidth="1" opacity="0.4" />
      <circle cx="200" cy="150" r="3" fill="#2C4A72" opacity="0.3" />
      <text x="200" y="180" textAnchor="middle" className="font-body" fill="#888CA4" fontSize="9">ETL</text>

      {/* Central warehouse */}
      <rect x="280" y="80" width="40" height="40" rx="2" fill="none" stroke="#B8860B" strokeWidth="1.5" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="288" y="88" width="24" height="24" rx="1" fill="#B8860B" opacity="0.12" />
      <text x="300" y="140" textAnchor="middle" className="font-body" fill="#888CA4" fontSize="9">Warehouse</text>

      {/* Analytics nodes */}
      <circle cx="440" cy="60" r="10" fill="none" stroke="#2C4A72" strokeWidth="1" opacity="0.4" />
      <circle cx="440" cy="60" r="3.5" fill="#2C4A72" opacity="0.3" />
      <text x="440" y="85" textAnchor="middle" className="font-body" fill="#888CA4" fontSize="9">ML</text>

      <circle cx="440" cy="140" r="10" fill="none" stroke="#2C4A72" strokeWidth="1" opacity="0.4" />
      <circle cx="440" cy="140" r="3.5" fill="#2C4A72" opacity="0.3" />
      <text x="440" y="165" textAnchor="middle" className="font-body" fill="#888CA4" fontSize="9">BI</text>

      {/* Output insight node */}
      <circle cx="540" cy="100" r="14" fill="none" stroke="#B8860B" strokeWidth="1.5" opacity="0.5" filter="url(#glow)">
        <animate attributeName="r" values="14;16;14" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="540" cy="100" r="5" fill="#B8860B" opacity="0.25" />
      <text x="540" y="130" textAnchor="middle" className="font-body" fill="#888CA4" fontSize="9">Insights</text>
    </svg>
  );
}
