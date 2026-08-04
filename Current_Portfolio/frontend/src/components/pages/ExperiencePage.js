import React, { useRef, useState, useEffect } from 'react';
import { experiences } from '../../data/experience';
import CareerPathTimeline from '../illustrations/CareerPathTimeline';
import { ScrollReveal } from '../effects/ScrollReveal';
import { SpotlightCard } from '../effects/SpotlightCard';
import { TextShimmer } from '../effects/TextShimmer';

/**
 * AnimatedTimeline — self-drawing vertical timeline line
 */
function AnimatedTimeline({ children }) {
  const containerRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollParent = container.parentElement;
    while (scrollParent && !scrollParent.classList.contains('page-scroll')) {
      scrollParent = scrollParent.parentElement;
    }
    if (!scrollParent) scrollParent = window;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const parentRect = scrollParent === window
        ? { top: 0, height: window.innerHeight }
        : scrollParent.getBoundingClientRect();

      const containerTop = rect.top - parentRect.top;
      const containerHeight = rect.height;
      const viewportHeight = scrollParent === window ? window.innerHeight : parentRect.height;
      const scrolledPast = viewportHeight - containerTop;
      const progress = Math.max(0, Math.min(1, scrolledPast / (containerHeight + viewportHeight * 0.3)));
      setLineHeight(progress * 100);
    };

    const target = scrollParent === window ? window : scrollParent;
    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-navy/10" />
      <div
        className="absolute left-3 top-0 w-px bg-gradient-to-b from-gold via-navy to-navy/20 transition-all duration-300 ease-out"
        style={{ height: `${lineHeight}%` }}
      />
      {children}
    </div>
  );
}

function TimelineDot({ isActive }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all duration-500
        ${visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        ${isActive ? 'bg-gold border-gold shadow-[0_0_12px_rgba(184,134,11,0.4)]' : 'bg-page border-navy/30'}`}
    />
  );
}

export default function ExperiencePage() {
  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-16 pb-24">
      <ScrollReveal>
        <span className="font-display text-gold text-lg tracking-widest">02</span>
        <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight mt-2 mb-8">
          <TextShimmer as="span">Experience</TextShimmer>
        </h2>
        <div className="gold-line w-16 mb-12" />
      </ScrollReveal>

      <AnimatedTimeline>
        {experiences.map((exp, index) => (
          <ScrollReveal key={exp.id} delay={0.1 + index * 0.12}>
            <div className="relative pl-10 pb-12 last:pb-0">
              <TimelineDot isActive={index === 0} />
              <SpotlightCard intensity={3}>
                <div className="p-4 border border-transparent hover:border-page-edge/60 hover:bg-page-alt/20 transition-all duration-300">
                  <div className="mb-4">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-2xl md:text-3xl font-medium text-[#161927]">
                        {exp.title}
                      </h3>
                      {index === 0 && (
                        <span className="text-xs font-body font-medium text-gold uppercase tracking-widest">Current</span>
                      )}
                    </div>
                    <p className="font-body text-[#1a1a2e] mt-1" style={{ fontVariant: 'small-caps', letterSpacing: '0.05em' }}>
                      {exp.company}
                    </p>
                    <p className="font-body text-sm text-[#4A4F6A] mt-0.5">
                      {exp.location} &middot; {exp.period}
                    </p>
                  </div>
                  <ul className="space-y-2.5 mb-4">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex gap-3 font-body text-[#1a1a2e] text-[15px] leading-relaxed">
                        <span className="text-navy/70 mt-1 flex-shrink-0">&bull;</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="px-2.5 py-0.5 text-xs font-body text-navy bg-navy/5 border border-navy/10 hover:bg-navy/10 transition-colors duration-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </ScrollReveal>
        ))}
      </AnimatedTimeline>

      <ScrollReveal delay={0.5}>
        <div className="mt-8">
          <CareerPathTimeline />
        </div>
      </ScrollReveal>
    </div>
  );
}
