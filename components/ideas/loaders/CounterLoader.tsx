'use client';

import React from 'react';
import { ACCENT, ariaProps, pct, shellClass, type ProgressScreenProps } from './types';

/**
 * 01 — COUNTER
 *
 * The percentage as the whole composition. Reads at a glance from across the
 * room, which is what a loading screen is actually for; the step name below it
 * answers "what is it doing" without a second look.
 */
const CounterLoader: React.FC<ProgressScreenProps> = ({ progress, steps, label, inline }) => {
  const p = pct(progress);
  const current = steps.find((s) => !s.done)?.label ?? 'READY';
  const done = steps.filter((s) => s.done).length;

  return (
    <div {...ariaProps(progress, label)} className={`${shellClass(inline)} bg-white flex flex-col`}>
      <div className="flex-1 flex flex-col justify-center px-[6%]">
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-black/30">
          {label ?? 'LOADING'}
        </span>

        <div className="flex items-end gap-[2%] leading-none">
          <span
            className="font-heading font-black tabular-nums tracking-tighter"
            style={{ fontSize: inline ? 'clamp(3rem, 22cqw, 14rem)' : 'clamp(4rem, 22vw, 18rem)' }}
          >
            {String(p).padStart(2, '0')}
          </span>
          <span
            className="font-heading font-black pb-[1.5%]"
            style={{ color: ACCENT, fontSize: inline ? 'clamp(1rem, 6cqw, 4rem)' : 'clamp(1.25rem, 6vw, 5rem)' }}
          >
            %
          </span>
        </div>

        <p className="mt-[2%] text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.3em] text-black/50 truncate">
          {current}
          <span className="text-black/25"> — {done}/{steps.length} LOADED</span>
        </p>
      </div>

      {/* Hairline rule rather than a chunky bar: the numeral is already the bar. */}
      <div className="shrink-0 h-2 sm:h-3 border-t-4 border-black bg-white">
        <div
          className="h-full transition-[width] duration-300 ease-out"
          style={{ width: `${p}%`, backgroundColor: ACCENT }}
        />
      </div>
    </div>
  );
};

export default CounterLoader;
