import React, { useRef, useState, useEffect } from 'react';

/**
 * TextShimmer — animated gold gradient sweep across text
 * Triggers once when scrolled into view
 */
export function TextShimmer({ children, className = '', as: Tag = 'span' }) {
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
    <Tag
      ref={ref}
      className={`${isVisible ? 'text-shimmer-active' : ''} ${className}`}
      style={{
        backgroundImage: isVisible
          ? 'linear-gradient(90deg, #161927 0%, #161927 35%, #B8860B 50%, #161927 65%, #161927 100%)'
          : 'none',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: isVisible ? 'text' : 'unset',
        backgroundClip: isVisible ? 'text' : 'unset',
        WebkitTextFillColor: isVisible ? 'transparent' : 'inherit',
        color: isVisible ? 'transparent' : 'inherit',
      }}
    >
      {children}
    </Tag>
  );
}
