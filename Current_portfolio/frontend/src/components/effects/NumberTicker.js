import React, { useRef, useState, useEffect } from 'react';

/**
 * NumberTicker — animates a number from 0 to target when scrolled into view
 * Parses "87% Accuracy" into number=87, suffix="% Accuracy"
 */
export function NumberTicker({
  value,
  className = '',
  duration = 1500,
  delay = 0,
}) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Parse the value string: extract leading number and suffix
  const parsed = String(value).match(/^([\d.]+)(.*)/);
  const targetNumber = parsed ? parseFloat(parsed[1]) : 0;
  const suffix = parsed ? parsed[2] : '';
  const isDecimal = String(targetNumber).includes('.');
  const decimalPlaces = isDecimal
    ? String(targetNumber).split('.')[1].length
    : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const timer = setTimeout(() => {
      const startTime = performance.now();

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * targetNumber;

        setDisplayValue(
          isDecimal
            ? parseFloat(current.toFixed(decimalPlaces))
            : Math.round(current)
        );

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [hasStarted, targetNumber, duration, delay, isDecimal, decimalPlaces]);

  return (
    <span ref={ref} className={className}>
      {hasStarted ? (
        <>
          {isDecimal ? displayValue.toFixed(decimalPlaces) : displayValue}
          {suffix}
        </>
      ) : (
        <>0{suffix}</>
      )}
    </span>
  );
}
