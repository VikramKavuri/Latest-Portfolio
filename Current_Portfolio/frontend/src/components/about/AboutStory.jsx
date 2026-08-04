import React, { useEffect, useRef, useState } from 'react';
import { about } from '../../data/about';
import OpeningStatement from './OpeningStatement';
import Chapter from './Chapter';
import AboutScene3D, { preloadAboutCutouts } from './AboutScene3D';

const CAPTIONS = [
  'fragmented systems',
  'reconciled records',
  'trusted business view',
  'faster decisions',
  'audit-ready confidence',
  'optimal insight',
];
const DISC_CLASS = ['disc-gold', 'disc-navy', 'disc-gold', 'disc-navy', 'disc-navy', 'disc-gold'];

export default function AboutStory() {
  const [active, setActive] = useState(0);
  const [isCompact, setIsCompact] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px), (max-height: 600px) and (max-width: 1024px)').matches
  ));
  const chapterRefs = useRef([]);
  const rootRef = useRef(null);

  useEffect(() => {
    const compactQuery = window.matchMedia('(max-width: 768px), (max-height: 600px) and (max-width: 1024px)');
    const updateCompact = () => setIsCompact(compactQuery.matches);
    updateCompact();
    compactQuery.addEventListener('change', updateCompact);
    return () => compactQuery.removeEventListener('change', updateCompact);
  }, []);

  useEffect(() => {
    preloadAboutCutouts();

    const scrollRoot = rootRef.current ? rootRef.current.closest('.page-scroll') : null;
    let frame = null;

    const updateActiveChapter = () => {
      frame = null;
      const chapters = chapterRefs.current.filter(Boolean);
      if (!chapters.length) return;

      if (scrollRoot) {
        const maxScroll = scrollRoot.scrollHeight - scrollRoot.clientHeight;
        if (scrollRoot.scrollTop <= 4) {
          setActive(0);
          return;
        }
        if (maxScroll > 0 && scrollRoot.scrollTop >= maxScroll - 4) {
          setActive(chapters.length - 1);
          return;
        }
      }

      const rootRect = scrollRoot
        ? scrollRoot.getBoundingClientRect()
        : { top: 0, height: window.innerHeight };
      const triggerY = rootRect.top + rootRect.height * (isCompact ? 0.62 : 0.5);

      let nextActive = 0;
      chapters.forEach((chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        if (rect.top <= triggerY) {
          nextActive = index;
        }
      });

      setActive(nextActive);
    };

    const scheduleUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateActiveChapter);
    };

    scheduleUpdate();
    const target = scrollRoot || window;
    target.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      target.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [isCompact]);

  return (
    <div className="about-story" ref={rootRef}>
      <OpeningStatement
        eyebrow={about.openingEyebrow}
        text={about.opening}
      />

      <div className={`about-scrolly ${isCompact ? 'is-compact' : 'is-wide'}`}>
        {!isCompact && (
          <div className="about-sticky">
            <div className="about-stage">
              <div className={`about-disc ${DISC_CLASS[active]}`} />
              <div className="about-canvas-wrap">
                <AboutScene3D active={active} />
              </div>
              <span className="about-stage-caption">{CAPTIONS[active]}</span>
            </div>
          </div>
        )}

        <div className="about-chapters">
          {about.chapters.map((c, i) => (
            <div
              className={`about-chapter-shell ${active === i ? 'is-current' : ''}`}
              key={c.id}
            >
              {isCompact && (
                <div className="about-mobile-diorama" aria-hidden="true">
                  <div className="about-mobile-diorama-meta">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <span>{CAPTIONS[i]}</span>
                  </div>
                  <div className="about-stage">
                    <div className={`about-disc ${DISC_CLASS[i]}`} />
                    <div className="about-canvas-wrap">
                      <AboutScene3D active={i} preloadNext={false} />
                    </div>
                  </div>
                  <div className="about-mobile-progress">
                    {about.chapters.map((chapter, chapterIndex) => (
                      <span
                        key={chapter.id}
                        className={chapterIndex === i ? 'is-active' : ''}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Chapter
                ref={(el) => { chapterRefs.current[i] = el; }}
                chapter={c}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="about-close">
        <div className="gold-line w-12 mx-auto mb-6" />
        <h2 className="about-close-line">{about.close}</h2>
        <p className="about-close-hint">{about.closeHint}</p>
      </div>
    </div>
  );
}