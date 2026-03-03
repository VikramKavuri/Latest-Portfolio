import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * SpotlightCard — mouse-tracking radial spotlight + subtle 3D tilt
 * Drop-in replacement for TiltCard with added spotlight glow
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(184, 134, 11, 0.07)',
  spotlightSize = 280,
  intensity = 4,
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback(
    (e) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);

      // 3D tilt
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.01)`;
    },
    [mouseX, mouseY, intensity]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    const el = containerRef.current;
    if (el) {
      el.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`tilt-card relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight glow */}
      <motion.div
        className="pointer-events-none absolute z-0 rounded-full transition-opacity duration-300"
        style={{
          width: spotlightSize,
          height: spotlightSize,
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          background: `radial-gradient(circle, ${spotlightColor}, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
          filter: 'blur(20px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
