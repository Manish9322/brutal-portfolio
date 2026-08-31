'use client';

import React, { useEffect, useState } from 'react';

interface ProjectImageProps {
  src?: string;
  alt: string;
  className?: string;
  /** Shown in the placeholder so an empty slot still identifies itself. */
  label?: string;
}

/**
 * Project banner with a brutalist fallback.
 *
 * Covers both empty slots (a project saved without an image) and dead links
 * (the legacy records whose images point at the old site's /gallery folder),
 * so neither shows a broken-image icon.
 */
const ProjectImage: React.FC<ProjectImageProps> = ({ src, alt, className = '', label }) => {
  const [failed, setFailed] = useState(false);

  // A new src deserves a fresh attempt.
  useEffect(() => setFailed(false), [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${alt} — no image`}
      className={`relative w-full h-full bg-gray-100 overflow-hidden flex items-center justify-center select-none ${className}`}
    >
      {/* Diagonal hatch */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #000 0 2px, transparent 2px 14px)',
        }}
      />
      {/* Corner ticks */}
      <span aria-hidden="true" className="absolute top-2 left-2 h-4 w-4 border-t-4 border-l-4 border-black" />
      <span aria-hidden="true" className="absolute top-2 right-2 h-4 w-4 border-t-4 border-r-4 border-black" />
      <span aria-hidden="true" className="absolute bottom-2 left-2 h-4 w-4 border-b-4 border-l-4 border-black" />
      <span aria-hidden="true" className="absolute bottom-2 right-2 h-4 w-4 border-b-4 border-r-4 border-black" />

      <div className="relative text-center px-4">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center border-4 border-black bg-[#FF5F1F]">
          <span className="text-white text-xl font-black leading-none">/</span>
        </div>
        <p className="font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">NO_SIGNAL</p>
        {label && (
          <p className="mt-1 font-black uppercase tracking-tighter text-xs sm:text-sm opacity-40 line-clamp-1">
            {label}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectImage;
