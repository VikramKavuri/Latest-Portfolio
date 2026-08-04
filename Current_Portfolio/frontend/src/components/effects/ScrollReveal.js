import React, { useRef, useState, useEffect, useCallback } from 'react';

/**
 * ScrollReveal — fades + slides children into view on scroll
 * Uses IntersectionObserver, works inside book pages with overflow scroll
 */
export function ScrollReveal({ children, delay = 0, direction = 'up', className = '' }) {
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
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const transforms = {
    up: 'translateY(28px)',
    down: 'translateY(-28px)',
    left: 'translateX(28px)',
    right: 'translateX(-28px)',
    scale: 'scale(0.95)',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : transforms[direction] || transforms.up,
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

/**
 * TiltCard — 3D perspective tilt on mouse hover
 * Creates a subtle 3D depth effect on cards
 */
export function TiltCard({ children, className = '', intensity = 5 }) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.01)`;
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/**
 * StaggerChildren — wraps children with staggered reveal delays
 */
export function StaggerChildren({ children, baseDelay = 0, stagger = 0.08, className = '' }) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollReveal delay={baseDelay + index * stagger}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}

/**
 * ParallaxLayer — subtle parallax within scrollable pages
 */
export function ParallaxLayer({ children, speed = 0.3, className = '' }) {
  const ref = useRef(null);
  const parentRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Find the scrollable parent (page-scroll container)
    let parent = el.parentElement;
    while (parent && !parent.classList.contains('page-scroll')) {
      parent = parent.parentElement;
    }
    if (!parent) return;
    parentRef.current = parent;

    const handleScroll = () => {
      const scrollTop = parent.scrollTop;
      const rect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const offset = rect.top - parentRect.top + scrollTop;
      const delta = (scrollTop - offset + parent.clientHeight / 2) * speed * 0.1;
      el.style.transform = `translateY(${delta}px)`;
    };

    parent.addEventListener('scroll', handleScroll, { passive: true });
    return () => parent.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
