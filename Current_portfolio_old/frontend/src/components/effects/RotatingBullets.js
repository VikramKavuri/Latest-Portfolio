import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * RotatingBullets — Cycles through bullet points with word-by-word reveal.
 * Blends with surrounding background. No navigation, no author row.
 */
export default function RotatingBullets({ bullets = [], interval = 4000, className = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const numberX = useTransform(x, [-200, 200], [-15, 15]);
  const numberY = useTransform(y, [-200, 200], [-8, 8]);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - (rect.left + rect.width / 2));
      mouseY.set(e.clientY - (rect.top + rect.height / 2));
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bullets.length);
    }, interval);
    return () => clearInterval(timer);
  }, [bullets.length, interval]);

  const current = bullets[activeIndex] || '';

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Oversized index number — ghosted into background */}
      <motion.div
        className="absolute -left-4 top-1/2 -translate-y-1/2 text-[16rem] md:text-[20rem] font-display font-bold text-navy/[0.03] select-none pointer-events-none leading-none tracking-tighter"
        style={{ x: numberX, y: numberY }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {String(activeIndex + 1).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Content area */}
      <div className="relative flex">
        {/* Left vertical progress bar */}
        <div className="flex flex-col items-center justify-center pr-8 md:pr-12">
          <div className="relative h-24 w-px bg-navy/10">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gold origin-top"
              animate={{
                height: `${((activeIndex + 1) / bullets.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {/* Dot indicators */}
          <div className="flex flex-col gap-2 mt-4">
            {bullets.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="group p-1"
                aria-label={`Go to bullet ${i + 1}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'bg-gold scale-125'
                      : 'bg-navy/15 group-hover:bg-navy/30'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Bullet text */}
        <div className="flex-1 py-6 min-h-[100px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              className="text-xl md:text-2xl font-body font-light text-[#1a1a2e] leading-snug tracking-tight"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {current.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.3em]"
                  variants={{
                    hidden: { opacity: 0, y: 16, rotateX: 60 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      transition: {
                        duration: 0.45,
                        delay: i * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                    exit: {
                      opacity: 0,
                      y: -8,
                      transition: { duration: 0.15, delay: i * 0.015 },
                    },
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
