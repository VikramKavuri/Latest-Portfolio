import React, { useRef, useState, useCallback, useEffect } from 'react';

/**
 * CursorGlow — soft radial glow that follows the mouse cursor
 * Wrap around a container to add an ambient cursor light
 */
export function CursorGlow({
  children,
  className = '',
  glowColor = 'rgba(184, 134, 11, 0.04)',
  glowSize = 400,
}) {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const [isInside, setIsInside] = useState(false);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current || !glowRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glowRef.current.style.left = `${x}px`;
      glowRef.current.style.top = `${y}px`;
    },
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
    >
      {/* Glow element */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute z-0 rounded-full transition-opacity duration-500"
        style={{
          width: glowSize,
          height: glowSize,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          opacity: isInside ? 1 : 0,
          filter: 'blur(30px)',
        }}
      />
      {children}
    </div>
  );
}
