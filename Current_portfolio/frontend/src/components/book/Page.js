import React from 'react';

export default function Page({ children, pageNumber, isActive }) {
  return (
    <div
      className={`
        absolute inset-0 w-full h-full
        paper-texture page-scroll
        overflow-y-auto overflow-x-hidden
        transition-opacity duration-300
        ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      {/* Gold border frame */}
      <div className="absolute inset-3 md:inset-6 border border-gold/15 pointer-events-none" />

      {/* Subtle corner accents */}
      <div className="absolute top-3 left-3 md:top-6 md:left-6 w-6 h-6 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gold/25" />
        <div className="absolute top-0 left-0 h-full w-px bg-gold/25" />
      </div>
      <div className="absolute top-3 right-3 md:top-6 md:right-6 w-6 h-6 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-px bg-gold/25" />
        <div className="absolute top-0 right-0 h-full w-px bg-gold/25" />
      </div>
      <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 w-6 h-6 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gold/25" />
        <div className="absolute bottom-0 left-0 h-full w-px bg-gold/25" />
      </div>
      <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 w-6 h-6 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gold/25" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-gold/25" />
      </div>

      {/* Page content */}
      <div className="page-padding min-h-full relative">
        {children}
      </div>

      {/* Page number — above TableOfContents nav */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 font-display text-sm text-[#4A4F6A] pointer-events-none">
        {pageNumber}
      </div>
    </div>
  );
}
