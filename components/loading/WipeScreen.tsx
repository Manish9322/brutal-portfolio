'use client';

import React from 'react';

const ACCENT = '#FF5F1F';

/**
 * Widest per-character advance in the heading face, measured at
 * `font-heading font-black uppercase tracking-tighter`: WORK comes out at
 * 0.9988em per character, everything else is narrower. Rounding to 1.0 gives
 * the width guard a small margin.
 */
const EM_PER_CHAR = 1.0;
/** Viewport left after the screen's px-[6%] gutters. */
const AVAILABLE_VW = 88;

export interface WipeScreenProps {
  /** 0–100. */
  progress: number;
  /** The word the fill travels through: the owner's name, or the page's. */
  label: string;
  /** What is still outstanding, shown above the word. */
  status: string;
  settled: number;
  total: number;
  /** Fades out once everything has arrived, just before the page appears. */
  leaving?: boolean;
}

/**
 * Loading screen where the title is the progress bar.
 *
 * An accent copy of the word is clipped to the percentage and sits exactly on
 * top of an outline copy, so the fill travels through the letterforms. Both
 * copies render through the same component, because any difference in wrapping
 * or tracking shows immediately as a doubled edge.
 *
 * Words are never split. Each one gets its own nowrap line and the type is
 * capped so the longest still fits the viewport — otherwise a long name wraps
 * mid-word and reads as "SONAWAN / E".
 */
const Lines: React.FC<{ words: string[]; className: string; style: React.CSSProperties }> = ({
  words,
  className,
  style,
}) => (
  <span aria-hidden="true" className={className} style={style}>
    {words.map((word, i) => (
      <span key={`${word}-${i}`} className="block whitespace-nowrap">
        {word}
      </span>
    ))}
  </span>
);

const WipeScreen: React.FC<WipeScreenProps> = ({
  progress,
  label,
  status,
  settled,
  total,
  leaving,
}) => {
  const p = Math.floor(Math.max(0, Math.min(100, progress)));
  const words = label.toUpperCase().split(/\s+/).filter(Boolean);
  const longest = Math.max(1, ...words.map((w) => w.length));

  // Take the smaller of the design size and the size at which the longest word
  // still fits on one line.
  const fontSize = `min(clamp(2.5rem, 15vw, 12rem), ${(AVAILABLE_VW / (longest * EM_PER_CHAR)).toFixed(2)}vw)`;
  const type: React.CSSProperties = { fontSize, lineHeight: 0.85 };
  const shared = 'block font-heading font-black uppercase tracking-tighter';

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={p}
      aria-label={`Loading ${label}`}
      className={`fixed inset-0 z-[500] bg-white flex flex-col justify-center px-[6%] transition-opacity duration-300 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-black/30 mb-[2%] truncate">
        {status}
      </span>

      <div className="relative w-fit max-w-full">
        <Lines
          words={words}
          className={`${shared} text-transparent`}
          style={{ ...type, WebkitTextStroke: '2px rgba(0,0,0,0.25)' }}
        />

        <Lines
          words={words}
          className={`${shared} absolute inset-0`}
          style={{
            ...type,
            color: ACCENT,
            clipPath: `inset(0 ${100 - p}% 0 0)`,
            transition: 'clip-path 120ms linear',
          }}
        />
      </div>

      <div className="mt-[3%] flex items-center gap-4">
        <span className="text-xl sm:text-3xl font-black tabular-nums w-[3.5ch]">{p}%</span>
        <span className="flex-1 h-1 bg-black/10">
          <span
            className="block h-full"
            style={{ width: `${p}%`, backgroundColor: ACCENT, transition: 'width 120ms linear' }}
          />
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/25 tabular-nums shrink-0 hidden sm:block">
          {settled}/{total}
        </span>
      </div>
    </div>
  );
};

export default WipeScreen;
