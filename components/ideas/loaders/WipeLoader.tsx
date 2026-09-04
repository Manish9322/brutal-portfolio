'use client';

import React from 'react';
import { ACCENT, ariaProps, pct, shellClass, type ProgressScreenProps } from './types';

/**
 * 05 — WIPE
 *
 * The section title is the progress bar. An accent copy of the word is clipped
 * to the percentage and sits exactly on top of the outline copy, so the fill
 * travels through the letterforms themselves.
 *
 * Both copies render the same string at the same size; only the clip differs.
 * That is what keeps the two in register — any difference in tracking or weight
 * would show as a doubled edge.
 */
const WipeLoader: React.FC<ProgressScreenProps> = ({ progress, steps, label, inline }) => {
  const p = pct(progress);
  const word = (label ?? 'LOADING').toUpperCase();
  const current = steps.find((s) => !s.done)?.label ?? 'READY';

  const type: React.CSSProperties = {
    fontSize: inline ? 'clamp(2rem, 15cqw, 8rem)' : 'clamp(2.5rem, 15vw, 12rem)',
    lineHeight: 0.85,
  };

  return (
    <div
      {...ariaProps(progress, label)}
      className={`${shellClass(inline)} bg-white flex flex-col justify-center px-[6%]`}
    >
      <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-black/30 mb-[2%]">
        {current}
      </span>

      <div className="relative w-fit max-w-full">
        {/* Outline underneath */}
        <span
          aria-hidden="true"
          className="block font-heading font-black uppercase tracking-tighter break-words text-transparent"
          style={{ ...type, WebkitTextStroke: '2px rgba(0,0,0,0.25)' }}
        >
          {word}
        </span>

        {/* Solid accent on top, clipped to the percentage */}
        <span
          aria-hidden="true"
          // Same classes as the outline copy, deliberately: whitespace-pre here
          // stopped this copy wrapping while the one underneath still did, so
          // the two fell out of register on any label long enough to break.
          className="absolute inset-0 block font-heading font-black uppercase tracking-tighter break-words"
          style={{
            ...type,
            color: ACCENT,
            clipPath: `inset(0 ${100 - p}% 0 0)`,
            transition: 'clip-path 300ms linear',
          }}
        >
          {word}
        </span>
      </div>

      <div className="mt-[3%] flex items-center gap-4">
        <span className="text-xl sm:text-3xl font-black tabular-nums">{p}%</span>
        <span className="flex-1 h-1 bg-black/10">
          <span
            className="block h-full transition-[width] duration-300"
            style={{ width: `${p}%`, backgroundColor: ACCENT }}
          />
        </span>
      </div>
    </div>
  );
};

export default WipeLoader;
