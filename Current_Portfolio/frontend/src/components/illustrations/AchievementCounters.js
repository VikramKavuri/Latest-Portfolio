import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NumberTicker } from '../effects/NumberTicker';
import { SpotlightCard } from '../effects/SpotlightCard';

const STATS = [
  {
    value: '3+',
    label: 'Certifications',
    // Shield/badge icon path
    iconPath: 'M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 14l-3.5-3.5 1.41-1.41L11 13.17l5.09-5.09L17.5 9.5 11 16z',
  },
  {
    value: '5+',
    label: 'Years Experience',
    // Briefcase icon path
    iconPath: 'M20 6h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2zM10 4h4v2h-4V4z',
  },
  {
    value: '7',
    label: 'Projects Shipped',
    // Rocket icon path
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  },
  {
    value: '25+',
    label: 'Tools Mastered',
    // Wrench/tools icon path
    iconPath: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
  },
];

function DrawingIcon({ path, isVisible }) {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
      <motion.path
        d={path}
        stroke="#B8860B"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isVisible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export default function AchievementCounters({ className = '' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <div ref={ref} className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {STATS.map((stat, i) => (
        <SpotlightCard key={stat.label} intensity={3}>
          <div
            className="p-4 border border-page-edge/50 border-t-2 border-t-gold text-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
            }}
          >
            <div className="flex justify-center mb-3">
              <DrawingIcon path={stat.iconPath} isVisible={isVisible} />
            </div>
            <div className="font-display text-3xl md:text-4xl text-[#161927] mb-1">
              <NumberTicker
                value={stat.value}
                duration={1200}
                delay={i * 150}
              />
            </div>
            <p className="font-body text-xs text-[#888CA4] uppercase tracking-[0.15em]">
              {stat.label}
            </p>
          </div>
        </SpotlightCard>
      ))}
    </div>
  );
}
