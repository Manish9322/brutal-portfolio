import React from 'react';

/**
 * Brutalist loading primitives.
 *
 * No rounded corners, no shimmer gradients — placeholders are hard-edged blocks
 * that pulse, so a loading page still reads as part of the same grid system.
 */

interface SkeletonProps {
  className?: string;
}

/** A filled bar, for a line of text. Give it a width and height class. */
export const SkeletonBar: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`bg-black/10 animate-pulse ${className}`} aria-hidden="true" />
);

/** An outlined block, for cards, images and panels. */
export const SkeletonBox: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`border-4 border-black bg-black/5 animate-pulse ${className}`} aria-hidden="true" />
);

/** A pill matching the tech-stack / skill chips. */
export const SkeletonChip: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`h-6 w-20 border-2 border-black/20 bg-black/5 animate-pulse ${className}`} aria-hidden="true" />
);

/** Several bars of decreasing width, for a paragraph. */
export const SkeletonParagraph: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => (
  <div className={`space-y-3 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBar key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

/**
 * Wraps a loading region so screen readers announce it instead of reading the
 * placeholder blocks, which are all aria-hidden.
 */
export const SkeletonRegion: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({
  label,
  children,
  className = '',
}) => (
  <div role="status" aria-live="polite" aria-busy="true" className={className}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
);
