import React from 'react';

/**
 * Marquee — infinite horizontal scroll of items
 * Duplicates children for seamless loop, pauses on hover
 */
export function Marquee({
  children,
  className = '',
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
}) {
  const animationClass = direction === 'left' ? 'marquee-scroll-left' : 'marquee-scroll-right';

  return (
    <div
      className={`marquee-container overflow-hidden ${className}`}
      style={{ '--marquee-speed': `${speed}s` }}
    >
      <div
        className={`marquee-track flex w-max ${animationClass} ${
          pauseOnHover ? 'marquee-pause-hover' : ''
        }`}
      >
        {/* Original */}
        <div className="flex items-center shrink-0">{children}</div>
        {/* Duplicate for seamless loop */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * MarqueeItem — single item inside the marquee strip
 */
export function MarqueeItem({ icon, label, className = '' }) {
  return (
    <div
      className={`flex items-center gap-2.5 px-5 py-2.5 mx-2 border border-page-edge/40 bg-page-alt/30
                   hover:border-navy/20 hover:bg-page-alt/60 transition-all duration-200 group ${className}`}
    >
      {icon && (
        <img
          src={icon}
          alt={label}
          className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-200"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}
      <span className="font-body text-sm text-[#1a1a2e] group-hover:text-[#161927] transition-colors duration-200 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
