'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CounterLoader from './loaders/CounterLoader';
import BlocksLoader from './loaders/BlocksLoader';
import ManifestLoader from './loaders/ManifestLoader';
import TerminalLoader from './loaders/TerminalLoader';
import WipeLoader from './loaders/WipeLoader';
import DialLoader from './loaders/DialLoader';
import type { LoadStep, ProgressScreenProps } from './loaders/types';

/**
 * Six progress screens, driven by one shared value.
 *
 * A single driver on purpose: comparing loaders is only meaningful if they are
 * all showing the same moment. The scrubber exists because the interesting
 * states — 0%, mid-load, 99% — are exactly the ones an autoplay loop rushes
 * past.
 *
 * UI only. Nothing here fetches; `steps` is a plausible stand-in for what a
 * homepage section actually waits on.
 */

const SOURCES = ['PROFILE', 'PROJECTS', 'SKILLS', 'EXPERIENCE', 'GALLERY', 'TESTIMONIALS'];

const VARIANTS: { id: string; name: string; note: string; Screen: React.FC<ProgressScreenProps> }[] = [
  { id: '01', name: 'COUNTER', note: 'Reads from across the room', Screen: CounterLoader },
  { id: '02', name: 'BLOCKS', note: 'Quantised — no false precision', Screen: BlocksLoader },
  { id: '03', name: 'MANIFEST', note: 'Names what is still pending', Screen: ManifestLoader },
  { id: '04', name: 'TERMINAL', note: 'Log of what resolved, in order', Screen: TerminalLoader },
  { id: '05', name: 'WIPE', note: 'The title is the bar', Screen: WipeLoader },
  { id: '06', name: 'DIAL', note: 'Square gauge, not a ring', Screen: DialLoader },
];

const LoaderShowcase: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [fullscreen, setFullscreen] = useState<string | null>(null);

  // Advance, hold briefly at the top, then start over.
  useEffect(() => {
    if (!playing) return;
    const tick = setInterval(() => {
      setProgress((v) => (v >= 112 ? 0 : v + 1));
    }, 90);
    return () => clearInterval(tick);
  }, [playing]);

  const shown = Math.min(100, progress);

  /** Sources resolve in order as the bar passes each threshold. */
  const steps: LoadStep[] = useMemo(
    () =>
      SOURCES.map((label, i) => ({
        label,
        done: shown >= ((i + 1) / SOURCES.length) * 100,
      })),
    [shown]
  );

  const escape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setFullscreen(null);
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    window.addEventListener('keydown', escape);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', escape);
      document.body.style.overflow = previous;
    };
  }, [fullscreen, escape]);

  const active = VARIANTS.find((v) => v.id === fullscreen);

  return (
    <section className="border-t-4 border-black bg-white">
      {/* ------------------------------------------------------- header ---- */}
      <div className="px-4 md:px-12 py-8 md:py-12 border-b-4 border-black bg-black text-white">
        <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-6xl uppercase leading-none tracking-tighter">
          PROGRESS
          <br />
          SCREENS
        </h2>
        <p className="mt-4 max-w-3xl text-[11px] sm:text-sm font-bold uppercase tracking-wide text-white/50 leading-relaxed">
          Six alternatives to a skeleton. Each one reports how much of the section&rsquo;s data has
          arrived — the percentage is sources resolved over sources requested, not a timer.
        </p>
      </div>

      {/* -------------------------------------------------- the controls --- */}
      <div className="sticky top-0 z-30 border-b-4 border-black bg-white px-4 md:px-12 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            className="border-4 border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            {playing ? '❙❙ PAUSE' : '▶ PLAY'}
          </button>
          <button
            type="button"
            onClick={() => {
              setProgress(0);
              setPlaying(true);
            }}
            className="border-4 border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            ↺ RESTART
          </button>
        </div>

        <label className="flex-1 flex items-center gap-3 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/40 shrink-0 hidden sm:block">
            SCRUB
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={shown}
            onChange={(e) => {
              setPlaying(false);
              setProgress(Number(e.target.value));
            }}
            className="flex-1 min-w-0 accent-[#FF5F1F] cursor-pointer"
            aria-label="Scrub progress"
          />
          <span className="w-14 text-right text-sm font-black tabular-nums shrink-0">{shown}%</span>
        </label>
      </div>

      {/* --------------------------------------------------- the variants -- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y-4 lg:divide-y-0 divide-black">
        {VARIANTS.map((v, i) => (
          <figure
            key={v.id}
            className={`border-black ${i % 2 === 0 ? 'lg:border-r-4' : ''} ${i >= 2 ? 'lg:border-t-4' : ''} ${
              i > 0 ? 'border-t-4 lg:border-t-4' : ''
            }`}
          >
            <figcaption className="px-4 md:px-8 py-3 border-b-4 border-black flex items-center justify-between gap-3 bg-gray-50">
              <span className="min-w-0">
                <span className="text-[10px] font-black tabular-nums text-black/30 mr-2">{v.id}</span>
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest">{v.name}</span>
                <span className="block text-[10px] font-bold uppercase tracking-wide text-black/35 truncate">
                  {v.note}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setFullscreen(v.id)}
                className="shrink-0 border-2 border-black px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-[#FF5F1F] hover:border-[#FF5F1F] hover:text-white transition-colors"
              >
                FULL SCREEN ⤢
              </button>
            </figcaption>

            {/* Container queries so each screen scales to its frame, letting the
                same component serve both the tile and the full-screen preview. */}
            <div className="h-[320px] sm:h-[380px] md:h-[420px]" style={{ containerType: 'inline-size' }}>
              <v.Screen progress={shown} steps={steps} label="THE ARCHIVE" inline />
            </div>
          </figure>
        ))}
      </div>

      {/* ------------------------------------------------------ overlay ---- */}
      {active && (
        <div className="fixed inset-0 z-[400] bg-white animate-in fade-in duration-150">
          <active.Screen progress={shown} steps={steps} label="THE ARCHIVE" />
          <button
            type="button"
            onClick={() => setFullscreen(null)}
            className="fixed top-4 right-4 z-10 border-4 border-black bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            CLOSE ✕
          </button>
          <span className="fixed bottom-4 left-4 z-10 text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
            {active.id} — {active.name} // ESC TO CLOSE
          </span>
        </div>
      )}
    </section>
  );
};

export default LoaderShowcase;
