'use client';

import React from 'react';
import { ACCENT, ariaProps, pct, shellClass, type ProgressScreenProps } from './types';

/**
 * 04 — TERMINAL
 *
 * A build log. Lines are derived from the steps rather than faked on a timer,
 * so what scrolls past is genuinely what resolved and in what order. The status
 * bar keeps the number visible while the log moves.
 */
const TerminalLoader: React.FC<ProgressScreenProps> = ({ progress, steps, label, inline }) => {
  const p = pct(progress);
  const activeIndex = steps.findIndex((s) => !s.done);
  const active = activeIndex === -1 ? null : steps[activeIndex];

  return (
    <div
      {...ariaProps(progress, label)}
      className={`${shellClass(inline)} bg-black text-white flex flex-col font-mono`}
    >
      <div className="shrink-0 border-b-2 border-white/20 px-[4%] py-[2%] flex items-center justify-between gap-4">
        <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-white/40 truncate">
          {label ?? 'LOADING'} — TRANSFER LOG
        </span>
        <span className="flex gap-1.5 shrink-0" aria-hidden="true">
          <span className="h-2.5 w-2.5 border border-white/30" />
          <span className="h-2.5 w-2.5 border border-white/30" />
          <span className="h-2.5 w-2.5 border" style={{ borderColor: ACCENT, backgroundColor: ACCENT }} />
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden px-[4%] py-[3%] flex flex-col justify-end gap-1 text-[10px] sm:text-xs leading-relaxed">
        {steps.map((step, i) => {
          if (!step.done && i !== activeIndex) return null;
          return (
            <p key={step.label} className={step.done ? 'text-white/60' : 'text-white'}>
              <span style={{ color: ACCENT }}>&gt;</span> GET /api/{step.label.toLowerCase()}
              {step.done ? (
                <span className="text-white/35"> … 200 OK</span>
              ) : (
                <span className="text-white/50"> … waiting</span>
              )}
            </p>
          );
        })}
        {active && (
          <p className="text-white/90">
            <span style={{ color: ACCENT }}>&gt;</span>{' '}
            <span className="inline-block w-2 h-3.5 align-middle animate-pulse motion-reduce:animate-none" style={{ backgroundColor: ACCENT }} />
          </p>
        )}
        {!active && (
          <p className="font-black" style={{ color: ACCENT }}>
            &gt; ALL SOURCES RESOLVED — RENDERING
          </p>
        )}
      </div>

      <div className="shrink-0 border-t-2 border-white/20">
        <div className="h-1.5" style={{ width: `${p}%`, backgroundColor: ACCENT, transition: 'width 300ms linear' }} />
        <div className="px-[4%] py-[2%] flex items-center justify-between gap-4 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em]">
          <span className="text-white/40 truncate">{active ? `FETCHING ${active.label}` : 'DONE'}</span>
          <span className="tabular-nums shrink-0" style={{ color: ACCENT }}>
            {String(p).padStart(3, '0')}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default TerminalLoader;
