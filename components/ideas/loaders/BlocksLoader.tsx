'use client';

import React from 'react';
import { ACCENT, ariaProps, pct, shellClass, type ProgressScreenProps } from './types';

const CELLS = 40;

/**
 * 02 — BLOCKS
 *
 * A cartridge meter: forty cells that fill in order. Quantised progress reads
 * as mechanical rather than smooth, which suits the grid the rest of the site
 * is built on — and a cell either is or is not filled, so there is no illusion
 * of precision the underlying data cannot support.
 */
const BlocksLoader: React.FC<ProgressScreenProps> = ({ progress, steps, label, inline }) => {
  const p = pct(progress);
  const filled = Math.round((p / 100) * CELLS);
  const current = steps.find((s) => !s.done)?.label ?? 'READY';

  return (
    <div
      {...ariaProps(progress, label)}
      className={`${shellClass(inline)} bg-black text-white flex flex-col justify-center px-[6%] py-[5%] gap-[4%]`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-white/40 truncate">
          {label ?? 'LOADING'}
        </span>
        <span className="text-[10px] sm:text-xs font-black tabular-nums" style={{ color: ACCENT }}>
          {String(p).padStart(3, ' ')}%
        </span>
      </div>

      <div className="grid grid-cols-10 gap-[6px] sm:gap-2">
        {Array.from({ length: CELLS }, (_, i) => {
          const on = i < filled;
          return (
            <div
              key={i}
              className="aspect-square border-2 transition-colors duration-150"
              style={{
                borderColor: on ? ACCENT : 'rgba(255,255,255,0.18)',
                backgroundColor: on ? ACCENT : 'transparent',
              }}
            />
          );
        })}
      </div>

      <div className="flex items-baseline justify-between gap-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">
        <span className="truncate text-white/70">{current}</span>
        <span className="tabular-nums text-white/30 shrink-0">
          {filled}/{CELLS}
        </span>
      </div>
    </div>
  );
};

export default BlocksLoader;
