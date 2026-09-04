'use client';

import React from 'react';
import { ACCENT, ariaProps, pct, shellClass, type ProgressScreenProps } from './types';

/**
 * 03 — MANIFEST
 *
 * Names every source the section is waiting on and ticks them off. The most
 * informative of the set: when a load stalls, this is the only variant that
 * says which request is hanging. Each row carries its own bar so a slow single
 * source still shows movement.
 */
const ManifestLoader: React.FC<ProgressScreenProps> = ({ progress, steps, label, inline }) => {
  const p = pct(progress);
  const done = steps.filter((s) => s.done).length;
  const activeIndex = steps.findIndex((s) => !s.done);

  return (
    <div
      {...ariaProps(progress, label)}
      className={`${shellClass(inline)} bg-white flex flex-col justify-center px-[6%] py-[5%]`}
    >
      <div className="flex items-baseline justify-between gap-4 border-b-4 border-black pb-[2%]">
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-black/40 truncate">
          {label ?? 'LOADING'}
        </span>
        <span className="text-sm sm:text-xl font-black tabular-nums shrink-0">{p}%</span>
      </div>

      <ul className="divide-y-2 divide-black/10">
        {steps.map((step, i) => {
          const active = i === activeIndex;
          return (
            <li key={step.label} className="py-[1.6%] flex items-center gap-3 sm:gap-4">
              <span
                className="shrink-0 w-8 sm:w-11 text-[9px] sm:text-[10px] font-black tabular-nums text-center border-2 py-0.5"
                style={{
                  borderColor: step.done ? ACCENT : 'rgba(0,0,0,0.2)',
                  backgroundColor: step.done ? ACCENT : 'transparent',
                  color: step.done ? '#fff' : 'rgba(0,0,0,0.3)',
                }}
              >
                {step.done ? 'OK' : active ? '··' : '--'}
              </span>

              <span
                className={`flex-1 min-w-0 truncate text-[10px] sm:text-xs font-black uppercase tracking-widest ${
                  step.done ? 'text-black' : active ? 'text-black/70' : 'text-black/25'
                }`}
              >
                {step.label}
              </span>

              <span className="hidden sm:block w-24 md:w-40 h-2 border-2 border-black/20 shrink-0">
                <span
                  className="block h-full transition-[width] duration-300"
                  style={{
                    width: step.done ? '100%' : active ? '45%' : '0%',
                    backgroundColor: step.done ? ACCENT : 'rgba(0,0,0,0.25)',
                  }}
                />
              </span>
            </li>
          );
        })}
      </ul>

      <div className="border-t-4 border-black pt-[2%] flex items-baseline justify-between gap-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">
        <span className="text-black/40">
          {done}/{steps.length} SOURCES
        </span>
        <span className="tabular-nums" style={{ color: ACCENT }}>
          {done === steps.length ? 'COMPLETE' : 'FETCHING'}
        </span>
      </div>
    </div>
  );
};

export default ManifestLoader;
