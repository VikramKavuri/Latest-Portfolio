import React, { forwardRef } from 'react';

/**
 * Chapter — one beat of the About story: kicker + bold headline + warm body,
 * with an optional pull-quote and an optional proof strip. Forwarded ref is
 * used by AboutStory's scroll geometry to drive the sticky visual.
 */
const Chapter = forwardRef(function Chapter({ chapter, index }, ref) {
  return (
    <section
      ref={ref}
      data-chapter={index}
      className="about-chapter"
    >
      <div>
        <span className="about-chapter-kicker">
          <span className="about-chapter-kicker-num">{String(index + 1).padStart(2, '0')}</span>
          {chapter.kicker}
        </span>

        <h2 className="about-chapter-headline">{chapter.headline}</h2>

        {chapter.body.map((p, i) => (
          <p key={i} className="about-chapter-body">{p}</p>
        ))}

        {chapter.quote && (
          <blockquote className="about-quote">
            <span className="about-quote-mark">“</span>
            <p className="about-quote-text">{chapter.quote.text}</p>
            <footer className="about-quote-source">— {chapter.quote.source}</footer>
          </blockquote>
        )}

        {chapter.proof && (
          <div className="about-proof">
            {chapter.proof.map((stat) => (
              <div key={stat.label} className="about-proof-item">
                <span className="about-proof-value">{stat.value}</span>
                <span className="about-proof-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

export default Chapter;
