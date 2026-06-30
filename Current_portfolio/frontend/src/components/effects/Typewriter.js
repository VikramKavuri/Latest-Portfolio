import React, { useState, useEffect, useRef } from 'react';

/**
 * Typewriter — types and erases a rotating list of phrases with a blinking caret.
 * Drop-in replacement for RollingBullets under the hero "I Will" label.
 *
 * Honors prefers-reduced-motion: renders the first phrase statically with a
 * steady (non-blinking) caret and no typing animation.
 */
export default function Typewriter({
  phrases = [],
  typingSpeed = 55,
  deletingSpeed = 28,
  pause = 1600,
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('typing'); // 'typing' | 'deleting'
  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (reduceMotion.current || phrases.length === 0) return undefined;

    const current = phrases[index % phrases.length];
    let timeout;

    if (phase === 'typing') {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase('deleting'), pause);
      }
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deletingSpeed);
      } else {
        setIndex((i) => (i + 1) % phrases.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, index, phrases, typingSpeed, deletingSpeed, pause]);

  const display = reduceMotion.current ? phrases[0] || '' : text;

  return (
    <div className="w-full">
      {/* "I Will" label */}
      <p
        className="font-body text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-1"
        style={{
          background: 'linear-gradient(90deg, #B8860B, #D4A843, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        I Will
      </p>

      {/* Typed line */}
      <p
        className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#161927] tracking-tight leading-snug"
        style={{ minHeight: '1.6em' }}
        aria-live="polite"
      >
        {display}
        <span
          className={`typewriter-caret ${reduceMotion.current ? '' : 'typewriter-caret-blink'}`}
          aria-hidden="true"
        >
          |
        </span>
      </p>
    </div>
  );
}
