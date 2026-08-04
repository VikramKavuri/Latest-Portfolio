import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * ScrollCue — small "Scroll to proceed" hint with a bouncing down-chevron,
 * shown near the bottom of a page to signal that scrolling advances to the
 * next page. The bounce is disabled under prefers-reduced-motion (see CSS).
 */
export default function ScrollCue({ visible }) {
  return (
    <div
      className={`scroll-cue ${visible ? 'scroll-cue-visible' : ''}`}
      aria-hidden="true"
    >
      <span className="scroll-cue-text">Scroll to proceed</span>
      <ChevronDown className="scroll-cue-arrow" size={18} />
    </div>
  );
}
