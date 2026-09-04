'use client';

import React from 'react';
import { ACCENT, ariaProps, pct, shellClass, type ProgressScreenProps } from './types';

const SIDE = 200;
const INSET = 12;
/** Perimeter of the stroked square: the dash length the progress draws along. */
const PERIMETER = 4 * SIDE;

/**
 * 06 — DIAL
 *
 * A square gauge rather than a ring: the stroke draws itself around the box
 * clockwise from the top-left. A circle would be the obvious choice and the
 * wrong one here — every other edge on this site is a right angle.
 */
const DialLoader: React.FC<ProgressScreenProps> = ({ progress, steps, label, inline }) => {
  const p = pct(progress);
  const done = steps.filter((s) => s.done).length;
  const current = steps.find((s) => !s.done)?.label ?? 'READY';

  return (
    <div
      {...ariaProps(progress, label)}
      className={`${shellClass(inline)} bg-white flex flex-col items-center justify-center gap-[4%] px-[6%] py-[5%]`}
    >
      <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-black/30 text-center truncate max-w-full">
        {label ?? 'LOADING'}
      </span>

      <div className="relative w-[46%] max-w-[220px] min-w-[120px] aspect-square">
        <svg viewBox={`0 0 ${SIDE + INSET * 2} ${SIDE + INSET * 2}`} className="w-full h-full">
          <rect
            x={INSET}
            y={INSET}
            width={SIDE}
            height={SIDE}
            fill="none"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={6}
          />
          <rect
            x={INSET}
            y={INSET}
            width={SIDE}
            height={SIDE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={10}
            // A dash of the drawn length followed by a full-perimeter gap, so
            // the stroke grows clockwise from the top-left corner. Offsetting a
            // full-length dash instead walks the segment backwards from the
            // start point, which left the top edge blank while the other three
            // sides filled.
            strokeDasharray={`${(PERIMETER * p) / 100} ${PERIMETER}`}
            strokeLinecap="butt"
            style={{ transition: 'stroke-dasharray 300ms linear' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading font-black tabular-nums leading-none text-[clamp(1.5rem,9cqw,3.5rem)]">
            {p}
          </span>
          <span className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] text-black/30">PERCENT</span>
        </div>
      </div>

      <div className="text-center max-w-full">
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] truncate">{current}</p>
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mt-1">
          {done}/{steps.length} SOURCES LOADED
        </p>
      </div>
    </div>
  );
};

export default DialLoader;
