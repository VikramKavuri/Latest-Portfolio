import React from 'react';

export default function TableOfContents({ currentPage, totalPages, goToPage, labels }) {
  return (
    <nav
      className="absolute left-1/2 -translate-x-1/2 bottom-3 md:bottom-6 z-30
                 flex items-center gap-0.5 sm:gap-1 md:gap-4
                 bg-page/90 backdrop-blur-sm px-1.5 sm:px-2 md:px-4 py-1 md:py-2 border border-page-edge/40
                 max-w-[calc(100vw-1rem)] md:max-w-[95vw]"
      aria-label="Page navigation"
    >
      {labels.map((label, index) => (
        <button
          key={index}
          type="button"
          onClick={() => goToPage(index)}
          className={`
            book-toc-target group flex min-w-11 min-h-11 items-center justify-center gap-1.5 rounded-full
            transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
            md:min-w-0 md:min-h-0 md:justify-start md:rounded-none
            ${index === currentPage ? 'text-navy' : 'text-[#4A4F6A] hover:text-[#1a1a2e]'}
          `}
          aria-label={`Go to ${label}`}
          aria-current={index === currentPage ? 'page' : undefined}
        >
          <span
            className={`
              w-1.5 h-1.5 rounded-full transition-all duration-200
              ${index === currentPage ? 'bg-gold w-2 h-2' : 'bg-[#CDD1DD] group-hover:bg-[#4A4F6A]'}
            `}
          />
          <span className="book-toc-label hidden md:inline text-xs font-body tracking-wide">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
