import React from 'react';

export default function TableOfContents({ currentPage, totalPages, goToPage, labels }) {
  return (
    <nav
      className="absolute left-1/2 -translate-x-1/2 bottom-6 z-30
                 flex items-center gap-1.5 sm:gap-3 md:gap-4
                 bg-page/80 backdrop-blur-sm px-2 sm:px-4 py-2 border border-page-edge/40
                 max-w-[95vw]"
      aria-label="Page navigation"
    >
      {labels.map((label, index) => (
        <button
          key={index}
          onClick={() => goToPage(index)}
          className={`
            group flex items-center gap-1.5 transition-all duration-200
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
          <span className="hidden md:inline text-xs font-body tracking-wide">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
