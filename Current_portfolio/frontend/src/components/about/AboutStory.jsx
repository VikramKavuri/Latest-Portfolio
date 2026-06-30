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
  const chapterRefs = useRef([]);
  const rootRef = useRef(null);

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
      const triggerY = rootRect.top + rootRect.height * 0.5;

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
  }, []);

  return (
    <div className="about-story" ref={rootRef}>
      <OpeningStatement text={about.opening} />

      <div className="about-scrolly">
        {/* Sticky 3D visual */}
        <div className="about-sticky">
          <div className="about-stage">
            <div className={`about-disc ${DISC_CLASS[active]}`} />
            <div className="about-canvas-wrap">
              <AboutScene3D active={active} />
            </div>
            <span className="about-stage-caption">{CAPTIONS[active]}</span>
          </div>
        </div>

        {/* Chapter text column */}
        <div className="about-chapters">
          {about.chapters.map((c, i) => (
            <Chapter
              key={c.id}
              ref={(el) => { chapterRefs.current[i] = el; }}
              chapter={c}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Close */}
      <div className="about-close">
        <div className="gold-line w-12 mx-auto mb-6" />
        <h2 className="about-close-line">{about.close}</h2>
        <p className="about-close-hint">{about.closeHint}</p>
      </div>
    </div>
  );
}
