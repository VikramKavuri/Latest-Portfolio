import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * ProjectSlider — minimalist showcase modeled on the 21st.dev testimonial
 * slider: vertical "Projects" label + counter on the left, a large feature
 * image in the centre, details on the right, and a small responsive
 * thumbnail strip. Click the image/title to open the full ProjectDetail.
 */
export default function ProjectSlider({ projects, onSelectProject }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

  const project = projects[selected] || projects[0];
  const total = projects.length;
  const pad = (n) => String(n + 1).padStart(2, '0');

  return (
    <div className="psl-wrap">
      <div className="psl-grid">
        {/* Left rail: counter + vertical label */}
        <div className="psl-rail">
          <div className="psl-counter">
            <span className="psl-counter-cur">{pad(selected)}</span>
            <span className="psl-counter-tot">/ {pad(total - 1)}</span>
          </div>
          <span className="psl-vlabel">Projects</span>
        </div>

        {/* Feature image (Embla) */}
        <div className="psl-media-col">
          <div className="psl-viewport" ref={emblaRef}>
            <div className="psl-container">
              {projects.map((p) => (
                <div className="psl-slide" key={p.id}>
                  <button
                    type="button"
                    className="psl-media"
                    onClick={() => onSelectProject(p)}
                    aria-label={`Open ${p.title} details`}
                  >
                    <img src={p.detailGif || p.image} alt={p.title} loading="lazy" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Small responsive thumbnail strip */}
          <div className="psl-thumbs">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => scrollTo(i)}
                className={`psl-thumb ${i === selected ? 'psl-thumb-active' : ''}`}
                aria-label={`Go to ${p.title}`}
              >
                <img src={p.image} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="psl-details">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <span className="psl-category">{project.category}</span>
            <h2 className="psl-title">
              <button type="button" className="psl-title-btn" onClick={() => onSelectProject(project)}>
                {project.title}
              </button>
            </h2>
            <p className="psl-tagline">{project.tagline}</p>
            <p className="psl-desc">{project.description}</p>
            <div className="psl-skills">
              {project.technologies.slice(0, 6).map((t) => (
                <span key={t} className="psl-skill">{t}</span>
              ))}
            </div>
          </motion.div>

          <button type="button" className="psl-view" onClick={() => onSelectProject(project)}>
            View Details <ArrowRight size={14} />
          </button>

          <div className="psl-arrows">
            <button type="button" onClick={scrollPrev} className="psl-arrow" aria-label="Previous project">
              <ArrowLeft size={18} />
            </button>
            <button type="button" onClick={scrollNext} className="psl-arrow" aria-label="Next project">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
