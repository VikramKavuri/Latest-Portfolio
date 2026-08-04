import React, { useRef, useState, useEffect } from 'react';

const MILESTONES = [
  { year: '2020', label: 'Business Analyst', sub: 'SRIT India' },
  { year: '2021', label: 'Data Science Analyst', sub: 'Accenture' },
  { year: '2023', label: 'MS Data Science', sub: 'UB, SUNY' },
  { year: '2025', label: 'Data Analytics Engineer', sub: 'The Arc Erie County', isCurrent: true },
];

export default function CareerPathTimeline({ className = '' }) {
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
    <div ref={ref} className={`py-6 ${className}`}>
      {/* Horizontal line container */}
      <div className="relative">
        {/* Background track */}
        <div className="absolute top-5 left-0 right-0 h-px bg-navy/10" />

        {/* Animated progress line */}
        <div
          className="absolute top-5 left-0 h-px"
          style={{
            width: isVisible ? '100%' : '0%',
            background: 'linear-gradient(90deg, #B8860B, #2C4A72, #2C4A72)',
            transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Milestones */}
        <div className="relative flex justify-between">
          {MILESTONES.map((m, i) => (
            <div
              key={m.year}
              className="flex flex-col items-center text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.5s ease ${0.3 + i * 0.25}s, transform 0.5s ease ${0.3 + i * 0.25}s`,
              }}
            >
              {/* Year label */}
              <span className="font-body text-xs text-[#888CA4] tracking-wider mb-2">
                {m.year}
              </span>

              {/* Dot */}
              <div className="relative">
                <div
                  className={`w-3 h-3 border-2 transition-all duration-500 ${
                    m.isCurrent
                      ? 'bg-gold border-gold shadow-[0_0_12px_rgba(184,134,11,0.5)]'
                      : 'bg-page border-navy/40'
                  }`}
                  style={{
                    transform: isVisible ? 'scale(1)' : 'scale(0)',
                    transition: `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.5 + i * 0.25}s`,
                  }}
                />
                {/* Pulse ring for current */}
                {m.isCurrent && isVisible && (
                  <div
                    className="absolute inset-0 border-2 border-gold/40 animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                )}
              </div>

              {/* Label */}
              <div className="mt-3 max-w-[100px]">
                <p className={`font-body text-xs font-medium leading-tight ${
                  m.isCurrent ? 'text-gold' : 'text-[#161927]'
                }`}>
                  {m.label}
                </p>
                <p className="font-body text-[10px] text-[#888CA4] mt-0.5">
                  {m.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
