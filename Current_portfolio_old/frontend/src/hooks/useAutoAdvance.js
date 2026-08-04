import { useEffect, useRef } from 'react';

/**
 * useAutoAdvance — flips to the next/previous book page when the user
 * "over-scrolls" past the end (or start) of the active page's content.
 *
 * Manual flip controls still work; this just makes clicking optional.
 * Disabled under prefers-reduced-motion.
 *
 * @param containerRef  ref to the BookLayout container (holds the .page-scroll panes)
 * @param opts.currentPage  current page index (re-binds when it changes)
 * @param opts.nextPage / opts.prevPage  flip callbacks
 * @param opts.isFlipping  true while a flip animation is running
 */
const OVERSCROLL_THRESHOLD = 110; // accumulated wheel delta past an edge to trigger a flip
const COOLDOWN_MS = 850;
const EDGE_TOLERANCE = 6;

export default function useAutoAdvance(containerRef, { currentPage, nextPage, prevPage, isFlipping }) {
  const accum = useRef(0);
  const lastFlip = useRef(0);
  const isFlippingRef = useRef(isFlipping);

  useEffect(() => {
    isFlippingRef.current = isFlipping;
  }, [isFlipping]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    // reset accumulator whenever we land on a new page
    accum.current = 0;

    const getActivePane = () =>
      container.querySelector('.page-scroll.opacity-100') ||
      container.querySelector('.page-scroll:not(.pointer-events-none)');

    const handleWheel = (e) => {
      if (isFlippingRef.current) return;
      const now = Date.now();
      if (now - lastFlip.current < COOLDOWN_MS) return;

      const pane = getActivePane();
      if (!pane) return;

      const { scrollTop, scrollHeight, clientHeight } = pane;
      const atBottom = scrollTop + clientHeight >= scrollHeight - EDGE_TOLERANCE;
      const atTop = scrollTop <= EDGE_TOLERANCE;

      if (e.deltaY > 0 && atBottom) {
        // accumulate downward over-scroll
        accum.current = accum.current > 0 ? accum.current + e.deltaY : e.deltaY;
        if (accum.current >= OVERSCROLL_THRESHOLD) {
          accum.current = 0;
          lastFlip.current = now;
          nextPage();
        }
      } else if (e.deltaY < 0 && atTop) {
        accum.current = accum.current < 0 ? accum.current + e.deltaY : e.deltaY;
        if (accum.current <= -OVERSCROLL_THRESHOLD) {
          accum.current = 0;
          lastFlip.current = now;
          prevPage();
        }
      } else {
        // mid-content scroll — reset
        accum.current = 0;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: true });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [containerRef, currentPage, nextPage, prevPage]);
}
