import React, { useState } from 'react';

const badges = [
  {
    id: 'medical',
    label: 'Medical Domain',
    color: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    rotation: -3,
  },
  {
    id: 'retail',
    label: 'Retail',
    color: 'linear-gradient(135deg, #F59E0B, #D97706)',
    rotation: 2,
  },
  {
    id: 'marketing',
    label: 'Marketing Analytics',
    color: 'linear-gradient(135deg, #EC4899, #DB2777)',
    rotation: -2,
  },
  {
    id: 'telecom',
    label: 'Telecom Industries',
    color: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    rotation: 1,
  },
  {
    id: 'energy',
    label: 'Oil & Energy',
    color: 'linear-gradient(135deg, #10B981, #059669)',
    rotation: 3,
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    color: 'linear-gradient(135deg, #F97316, #EA580C)',
    rotation: -1,
  },
];

export function SkillBadges() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div
      className="skill-badges-container"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {badges.map((badge) => {
        const isHovered = hoveredId === badge.id;
        const isOtherHovered = hoveredId !== null && hoveredId !== badge.id;

        return (
          <div
            key={badge.id}
            className="skill-badge"
            style={{
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: '9999px',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              background: badge.color,
              padding: '3px 10px',
              fontSize: '0.65rem',
              transform: `
                rotate(${isHovered ? 0 : badge.rotation}deg)
                scale(${isHovered ? 1.1 : isOtherHovered ? 0.95 : 1})
                translateY(${isHovered ? -3 : 0}px)
              `,
              zIndex: isHovered ? 100 : 1,
              boxShadow: isHovered
                ? '0 12px 24px -6px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.3)'
                : '0 3px 8px -2px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.2)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              color: 'white',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
            onMouseEnter={() => setHoveredId(badge.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <span
              style={{
                display: 'block',
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
              }}
            >
              {badge.label}
            </span>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '9999px',
                opacity: 0.4,
                pointerEvents: 'none',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
