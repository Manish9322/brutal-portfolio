import React from 'react';

/**
 * The single source of truth for how tall a sticky top bar is.
 *
 * The main navbar and every page header use these, so they can never drift
 * apart. Heights include the 4px bottom border (border-box), which is why they
 * are stated as explicit values rather than derived from padding.
 */
export const TOP_BAR_HEIGHT = 'h-16 sm:h-[84px]';

/** Offset for anything that sticks directly beneath a top bar. */
export const TOP_BAR_OFFSET = 'top-16 sm:top-[84px]';

interface TopBarProps {
  /** Usually a back link, or a pair of them. */
  left: React.ReactNode;
  /** Usually the mode/breadcrumb label; hidden on small screens. */
  right?: React.ReactNode;
  className?: string;
}

/**
 * Page-level sticky header, matching the main navigation's height exactly.
 * Used by /work, /work/[id], /education, /experience, /gallery, /journal and
 * /journal/[slug].
 */
const TopBar: React.FC<TopBarProps> = ({ left, right, className = '' }) => (
  <header
    className={`sticky top-0 z-40 bg-white border-b-4 border-black ${TOP_BAR_HEIGHT} ${className}`}
  >
    <div className="h-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 md:gap-6 min-w-0">{left}</div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  </header>
);

export default TopBar;
