import React, { useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

function SplitText({ text }) {
  const words = text.split(' ');

  return (
    <span style={{ display: 'inline' }}>
      {words.map((word, i) => (
        <motion.span
          key={`${text}-${i}`}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.4,
            delay: i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function TestimonialCarousel({ testimonials }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[activeIndex];

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', padding: '2rem 0', cursor: 'none' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNext}
    >
      {/* Custom cursor */}
      <motion.div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          zIndex: 50,
          mixBlendMode: 'difference',
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          style={{
            borderRadius: '9999px',
            backgroundColor: '#161927',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          animate={{
            width: isHovered ? 64 : 0,
            height: isHovered ? 64 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        >
          <motion.span
            style={{
              color: '#ECEDF4',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: "'DM Sans', sans-serif",
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.1 }}
          >
            Next
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Index indicator */}
      <motion.div
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: 0,
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.25rem',
          fontFamily: "'DM Sans', monospace",
          fontSize: '0.7rem',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span
          style={{ fontSize: '1.5rem', fontWeight: 300, color: '#161927' }}
          key={activeIndex}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {String(activeIndex + 1).padStart(2, '0')}
        </motion.span>
        <span style={{ color: '#9399AD' }}>/</span>
        <span style={{ color: '#9399AD' }}>{String(testimonials.length).padStart(2, '0')}</span>
      </motion.div>

      {/* Stacked avatar dots */}
      <motion.div
        style={{ position: 'absolute', top: '0.75rem', left: 0, display: 'flex' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6 }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            style={{
              width: 24,
              height: 24,
              borderRadius: '9999px',
              overflow: 'hidden',
              border: '2px solid #ECEDF4',
              marginLeft: i > 0 ? -6 : 0,
              opacity: i === activeIndex ? 1 : 0.5,
              filter: i === activeIndex ? 'none' : 'grayscale(100%)',
              transition: 'all 0.3s ease',
            }}
          >
            <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </motion.div>

      {/* Quote */}
      <div style={{ position: 'relative', marginTop: '2.5rem' }}>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="font-display"
            style={{
              fontSize: '1.25rem',
              fontWeight: 300,
              lineHeight: 1.7,
              letterSpacing: '-0.01em',
              color: '#161927',
              fontStyle: 'italic',
            }}
          >
            <span style={{ color: '#B8860B', fontSize: '2rem', lineHeight: 0, verticalAlign: '-0.3em', marginRight: '0.25rem' }}>&ldquo;</span>
            <SplitText text={current.fullContent || current.content} />
          </motion.blockquote>
        </AnimatePresence>

        {/* Author */}
        <motion.div style={{ marginTop: '1.5rem', position: 'relative' }} layout>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', width: 44, height: 44 }}>
              <div
                style={{
                  position: 'absolute',
                  inset: -4,
                  borderRadius: '9999px',
                  border: '1px solid rgba(184, 134, 11, 0.3)',
                }}
              />
              {testimonials.map((t, i) => (
                <motion.img
                  key={t.name}
                  src={t.avatar}
                  alt={t.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: 44,
                    height: 44,
                    borderRadius: '9999px',
                    objectFit: 'cover',
                  }}
                  animate={{
                    opacity: i === activeIndex ? 1 : 0,
                    zIndex: i === activeIndex ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              ))}
            </div>

            {/* Info with gold accent line */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                style={{ position: 'relative', paddingLeft: '1rem' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: '#B8860B',
                    transformOrigin: 'top',
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className="font-body" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#161927' }}>
                  {current.name}
                </span>
                <span className="font-body" style={{ display: 'block', fontSize: '0.7rem', color: '#4A4F6A', marginTop: 2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {current.role} — {current.company}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div style={{ marginTop: '2rem', height: 1, backgroundColor: 'rgba(205, 209, 221, 0.5)', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, backgroundColor: '#B8860B' }}
            initial={{ width: '0%' }}
            animate={{ width: `${((activeIndex + 1) / testimonials.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Click hint */}
      <motion.div
        style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.4 : 0.2 }}
        transition={{ duration: 0.3 }}
      >
        <span className="font-body" style={{ fontSize: '0.6rem', color: '#9399AD', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Click anywhere
        </span>
      </motion.div>
    </div>
  );
}
