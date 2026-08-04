import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Page from './Page';
import TableOfContents from './TableOfContents';
import ScrollCue from './ScrollCue';
import { CursorGlow } from '../effects/CursorGlow';
import useAutoAdvance from '../../hooks/useAutoAdvance';

const PAGE_LABELS = ['About', 'Experience', 'Projects', 'Toolkit', 'Credentials', 'Contact'];

export default function BookLayout({
  currentPage,
  totalPages,
  isFlipping,
  flipDirection,
  nextPage,
  prevPage,
  goToPage,
  isFirstPage,
  isLastPage,
  onCloseBook,
  children,
}) {
  const containerRef = useRef(null);
  const touchStartX = useRef(null);

  // Auto-advance to next/prev page on over-scroll past content edges
  useAutoAdvance(containerRef, { currentPage, nextPage, prevPage, isFlipping });

  // Mobile swipe
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
      if (touchStartX.current === null) return;
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) nextPage();
        else prevPage();
      }
      touchStartX.current = null;
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextPage, prevPage]);

  return (
    <CursorGlow glowColor="rgba(184, 134, 11, 0.03)" glowSize={500}>
    <div
      ref={containerRef}
      className="relative w-full h-full bg-page overflow-hidden"
      style={{ perspective: '2000px' }}
    >
      {/* Page flip container */}
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        <div
          className={`absolute inset-0 ${isFlipping ? (flipDirection === 'forward' ? 'animate-page-flip-forward' : 'animate-page-flip-backward') : ''}`}
          style={{
            transformOrigin: flipDirection === 'forward' ? 'left center' : 'right center',
            backfaceVisibility: 'hidden',
          }}
        >
          {React.Children.map(children, (child, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              isActive={index === currentPage}
            >
              {child}
            </Page>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {!isFirstPage && (
        <button
          onClick={prevPage}
          disabled={isFlipping}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30
                     w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                     text-[#4A4F6A] hover:text-navy transition-all duration-200
                     hover:bg-navy/5 backdrop-blur-sm
                     disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {!isLastPage && (
        <button
          onClick={nextPage}
          disabled={isFlipping}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30
                     w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                     text-[#4A4F6A] hover:text-navy transition-all duration-200
                     hover:bg-navy/5 backdrop-blur-sm
                     disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Table of contents */}
      <TableOfContents
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
        labels={PAGE_LABELS}
      />

      {/* Scroll-to-proceed cue */}
      <ScrollCue visible={!isFlipping && !isLastPage} />

      {/* Close book button */}
      <button
        onClick={onCloseBook}
        className="absolute top-4 right-4 z-30 w-8 h-8 flex items-center justify-center
                   text-[#4A4F6A] hover:text-navy transition-colors duration-200"
        aria-label="Close book"
      >
        <X size={18} />
      </button>
    </div>
    </CursorGlow>
  );
}
