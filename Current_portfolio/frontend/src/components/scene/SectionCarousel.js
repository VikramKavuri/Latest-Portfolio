import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

/**
 * SectionCarousel — full-bleed coverflow. The centred section is bright and
 * large; the immediate neighbours sit very close, with the centre card
 * covering ~1/4 of each. Arrows are pushed far to the edges so the section
 * imagery owns the attention. Click the centre card (or its "Explore") to open.
 */
export default function SectionCarousel({ sections, onSelect }) {
  const n = sections.length;
  const [index, setIndex] = useState(0);

  const go = useCallback((dir) => setIndex((i) => (i + dir + n) % n), [n]);

  // shortest circular distance from the centred card
  const offset = (i) => {
    let d = i - index;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  return (
    <div className="cf2-wrap">
      <button type="button" onClick={() => go(-1)} className="cf2-arrow cf2-arrow-left" aria-label="Previous section">
        <ChevronLeft size={24} />
      </button>

      <div className="cf2-stage">
        {sections.map((section, i) => {
          const d = offset(i);
          const abs = Math.abs(d);
          const isCenter = d === 0;
          const visible = abs <= 1;
          const Icon = section.icon;

          return (
            <div
              key={section.label}
              className="cf2-card-pos"
              style={{
                transform: `translate(-50%, -50%) translateX(${d * 70}%) scale(${isCenter ? 1 : 0.8})`,
                opacity: isCenter ? 1 : abs === 1 ? 0.4 : 0,
                zIndex: 10 - abs,
                pointerEvents: visible ? 'auto' : 'none',
              }}
            >
              <button
                type="button"
                className={`cf2-card ${isCenter ? 'is-center' : ''}`}
                onClick={() => (isCenter ? onSelect(section.pageIndex) : setIndex(i))}
                aria-label={isCenter ? `Open ${section.label}` : `Focus ${section.label}`}
                tabIndex={visible ? 0 : -1}
              >
                <div className="cf2-card-bg" style={{ backgroundImage: `url(${section.image})` }} />
                <div className="cf2-card-scrim" />
                <div className="cf2-card-content">
                  <div className="cf2-card-icon"><Icon size={26} strokeWidth={1.5} /></div>
                  <h3 className="cf2-card-label">{section.label}</h3>
                  <p className="cf2-card-desc">{section.description}</p>
                  {isCenter && (
                    <span className="cf2-card-cta">Explore <ArrowRight size={14} /></span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={() => go(1)} className="cf2-arrow cf2-arrow-right" aria-label="Next section">
        <ChevronRight size={24} />
      </button>

      <div className="cf2-dots">
        {sections.map((s, i) => (
          <button
            key={s.label}
            type="button"
            className={`cf2-dot ${i === index ? 'cf2-dot-active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to ${s.label}`}
          />
        ))}
      </div>
    </div>
  );
}
