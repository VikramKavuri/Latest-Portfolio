import { useState, useCallback, useEffect } from 'react';

const TOTAL_PAGES = 6;

export default function usePageFlip() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null); // 'forward' or 'backward'

  const goToPage = useCallback((pageIndex) => {
    if (isFlipping || pageIndex === currentPage || pageIndex < 0 || pageIndex >= TOTAL_PAGES) return;

    setIsFlipping(true);
    setFlipDirection(pageIndex > currentPage ? 'forward' : 'backward');

    setTimeout(() => {
      setCurrentPage(pageIndex);
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 100);
    }, 700); // Match CSS animation duration
  }, [currentPage, isFlipping]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevPage();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextPage, prevPage]);

  return {
    currentPage,
    totalPages: TOTAL_PAGES,
    isFlipping,
    flipDirection,
    nextPage,
    prevPage,
    goToPage,
    isFirstPage: currentPage === 0,
    isLastPage: currentPage === TOTAL_PAGES - 1,
  };
}
