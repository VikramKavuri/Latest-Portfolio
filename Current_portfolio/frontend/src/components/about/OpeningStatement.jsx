import React from 'react';

/**
 * OpeningStatement — oversized editorial line kept static so the About page
 * reads cleanly while the visual story changes beside it.
 */
export default function OpeningStatement({ text }) {
  const words = text.split(' ');

  return (
    <div className="about-opening">
      <span className="about-opening-eyebrow">About</span>
      <h1 className="about-opening-line">
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="about-opening-word"
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </h1>
      <div className="gold-line w-16 mt-6" />
    </div>
  );
}
