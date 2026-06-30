import React from 'react';

const VISUALS = [
  {
    src: '/models/cutouts/01-fragmented-systems.png',
    alt: 'Four separate data systems feeding different entity, transaction, activity, and engagement records',
    title: 'Fragmented systems',
  },
  {
    src: '/models/cutouts/02-reconciled-records.png',
    alt: 'Different records being matched and reconciled into consistent connected rows',
    title: 'Reconciled records',
  },
  {
    src: '/models/cutouts/03-trusted-business-view.png',
    alt: 'A unified business view with connected data panels gathered into one trusted source',
    title: 'Trusted business view',
  },
  {
    src: '/models/cutouts/04-faster-decisions.png',
    alt: 'Fast decision making represented by accelerated signals and a clear direction indicator',
    title: 'Faster decisions',
  },
  {
    src: '/models/cutouts/05-audit-ready-confidence.png',
    alt: 'Audit-ready confidence represented by a verified shield and organized evidence trail',
    title: 'Audit-ready confidence',
  },
  {
    src: '/models/cutouts/06-optimal-insight.png',
    alt: 'One optimal insight emerging from noisy information as a focused glowing result',
    title: 'Optimal insight',
  },
];

export function preloadAboutCutouts() {
  if (typeof window === 'undefined') return;
  VISUALS.forEach((visual) => {
    const img = new Image();
    img.src = visual.src;
  });
}

export default function AboutScene3D({ active = 0 }) {
  const safeActive = Math.min(Math.max(active, 0), VISUALS.length - 1);

  return (
    <div className="about-cutout-scene" aria-live="polite">
      {VISUALS.map((visual, index) => (
        <figure
          key={visual.src}
          className={`about-cutout-layer ${index === safeActive ? 'is-active' : ''}`}
          aria-hidden={index !== safeActive}
        >
          <div className="about-cutout-object">
            <img className="about-cutout-thickness about-cutout-thickness-a" src={visual.src} alt="" draggable="false" />
            <img className="about-cutout-thickness about-cutout-thickness-b" src={visual.src} alt="" draggable="false" />
            <img className="about-cutout-rim" src={visual.src} alt="" draggable="false" />
            <img className="about-cutout-main" src={visual.src} alt={visual.alt} draggable="false" />
          </div>
          <figcaption className="sr-only">{visual.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}
