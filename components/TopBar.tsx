import React from 'react';

export const TOP_BAR_HEIGHT = 'h-16 sm:h-[84px]';

export const TOP_BAR_OFFSET = 'top-16 sm:top-[84px]';

interface TopBarProps {
  left: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

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
