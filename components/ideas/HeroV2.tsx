'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGetProfileQuery } from '@/services/api';
import { SkeletonBar, SkeletonRegion } from '@/components/skeletons/Skeleton';

/**
 * Reworked hero.
 *
 * What it changes from the live HeroSection:
 *
 * 1. The manifesto slab is laid out in the grid instead of being absolutely
 *    positioned at `top-[40%] left-[5%]`, where it lands on top of the name at
 *    a range of viewport sizes and name lengths.
 * 2. The name is fluid with a ceiling, so it stops growing on ultrawide
 *    displays rather than running past the viewport at a raw `10vw`.
 * 3. `mix-blend-difference` is gone — it was inverting against the slab's own
 *    accent fill, which made the manifesto text muddy and unpredictable.
 * 4. The section now earns its full height: a status bar, the name, the
 *    manifesto, and two calls to action, none of which the original had.
 */

const ACCENT = '#FF5F1F';

/* -------------------------------------------------------------- clock ----- */

/**
 * Local time where the work happens. Rendered only after mount: a clock in the
 * server payload would mismatch the client on hydration.
 */
const SystemClock: React.FC = () => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());

    setTime(format());
    const tick = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time ?? '--:--:--'} IST
    </span>
  );
};

/* --------------------------------------------------------------- name ----- */

/**
 * Splits a word so each glyph can react on hover.
 *
 * The letters are hidden from assistive tech and the readable name is carried
 * by the heading's aria-label, otherwise a screen reader spells it out.
 */
const SplitWord: React.FC<{ word: string; delayFrom: number }> = ({ word, delayFrom }) => (
  <span className="inline-block whitespace-nowrap" aria-hidden="true">
    {word.split('').map((char, i) => (
      <span
        key={`${char}-${i}`}
        className="inline-block transition-[transform,color] duration-200 ease-out hover:-translate-y-[0.06em] hover:text-[#FF5F1F] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        style={{ transitionDelay: `${(delayFrom + i) * 8}ms` }}
      >
        {char}
      </span>
    ))}
  </span>
);

/* ------------------------------------------------------------ skeleton ---- */

const HeroV2Skeleton: React.FC = () => (
  <SkeletonRegion label="Loading profile">
    <section className="min-h-screen flex flex-col border-b-4 border-black">
      <div className="h-12 border-b-4 border-black shrink-0" />
      <div className="flex-1 flex flex-col justify-center gap-8 px-6 md:px-12 py-12">
        <SkeletonBar className="h-[11vw] w-[65%]" />
        <SkeletonBar className="h-[11vw] w-[48%]" />
        <div className="max-w-2xl border-4 border-black bg-[#FF5F1F]/30 p-6 md:p-8 space-y-3 animate-pulse">
          <div className="h-6 w-full bg-white/40" />
          <div className="h-6 w-4/5 bg-white/40" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 border-t-4 border-black">
        {['STATUS', 'LOCATION', 'DISCIPLINE'].map((label, i) => (
          <div
            key={label}
            className={`p-8 border-black border-b-4 md:border-b-0 ${i < 2 ? 'md:border-r-4' : 'bg-[#FF5F1F]/30'}`}
          >
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">{label}</span>
            <SkeletonBar className="h-6 w-3/4" />
          </div>
        ))}
      </div>
    </section>
  </SkeletonRegion>
);

/* ---------------------------------------------------------------- hero ---- */

const HeroV2: React.FC = () => {
  const { data: profile, isLoading } = useGetProfileQuery();

  if (isLoading) return <HeroV2Skeleton />;

  const first = (profile?.name ?? '').trim();
  const last = (profile?.lastName ?? '').trim();
  const fullName = [first, last].filter(Boolean).join(' ');

  const meta = [
    { label: 'STATUS', value: profile?.status, accent: false },
    { label: 'LOCATION', value: profile?.location, accent: false },
    { label: 'DISCIPLINE', value: profile?.discipline, accent: true },
  ];

  return (
    <section className="relative min-h-screen flex flex-col border-b-4 border-black bg-white overflow-hidden">
      {/* Grid wash, matching the one the homepage lays over everything. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* -------------------------------------------------- status bar ---- */}
      <div className="relative shrink-0 h-12 border-b-4 border-black flex items-center justify-between px-4 md:px-12 text-[10px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-top-2 duration-500">
        <span className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:animate-none"
              style={{ backgroundColor: ACCENT }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
          </span>
          <span className="truncate">{profile?.status || 'ONLINE'}</span>
        </span>
        <span className="hidden sm:block opacity-40">
          <SystemClock />
        </span>
      </div>

      {/* ------------------------------------------------------- name ----- */}
      <div className="relative flex-1 flex flex-col justify-center px-4 md:px-12 py-12 md:py-16">
        <h1
          aria-label={fullName}
          className="font-heading font-black uppercase leading-[0.82] tracking-tighter select-none break-words"
          // Fluid, but with a ceiling — the live hero's raw 10vw keeps growing
          // past the viewport on a 2560px display.
          style={{ fontSize: 'clamp(2.75rem, 11vw, 13rem)' }}
        >
          <span className="block animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SplitWord word={first} delayFrom={0} />
          </span>
          <span
            className="block animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '120ms', animationFillMode: 'both' }}
          >
            <SplitWord word={last} delayFrom={first.length} />
          </span>
        </h1>

        {/* The slab sits in the flow, so it can no longer cover the name. */}
        {profile?.manifestoLine && (
          <div
            className="mt-10 md:mt-14 md:ml-[8%] lg:ml-[18%] max-w-3xl border-4 border-black bg-[#FF5F1F] p-5 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] -rotate-1 animate-in fade-in zoom-in-95 duration-700"
            style={{ animationDelay: '260ms', animationFillMode: 'both' }}
          >
            <p className="text-white text-lg sm:text-xl md:text-3xl font-bold uppercase leading-tight tracking-tight">
              {profile.manifestoLine}
            </p>
          </div>
        )}

        {/* The live hero ends here and offers the reader nowhere to go. */}
        <div
          className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-3 duration-700"
          style={{ animationDelay: '400ms', animationFillMode: 'both' }}
        >
          <Link
            href="/work"
            className="group inline-flex items-center justify-between gap-6 border-4 border-black bg-black px-7 py-4 text-sm md:text-base font-black uppercase tracking-widest text-white transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(255,95,31,1)] motion-reduce:hover:translate-y-0"
          >
            VIEW THE WORK
            <span className="transition-transform group-hover:translate-x-1">↗</span>
          </Link>
          <Link
            href="/#contact"
            className="group inline-flex items-center justify-between gap-6 border-4 border-black bg-white px-7 py-4 text-sm md:text-base font-black uppercase tracking-widest transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] motion-reduce:hover:translate-y-0"
          >
            START A PROJECT
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------- meta strip ----- */}
      <div
        className="relative shrink-0 grid grid-cols-1 md:grid-cols-3 border-t-4 border-black animate-in fade-in duration-700"
        style={{ animationDelay: '520ms', animationFillMode: 'both' }}
      >
        {meta.map((cell, i) => (
          <div
            key={cell.label}
            className={`group p-6 md:p-8 border-black transition-colors ${
              i < meta.length - 1 ? 'border-b-4 md:border-b-0 md:border-r-4' : ''
            } ${cell.accent ? 'bg-[#FF5F1F] text-white' : 'hover:bg-black hover:text-white'}`}
          >
            <span className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="text-[10px] font-black tabular-nums opacity-30">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                  cell.accent ? 'text-white/70' : 'opacity-40'
                }`}
              >
                {cell.label}
              </span>
            </span>
            <p className="text-lg md:text-xl font-black uppercase leading-tight break-words">
              {cell.value || '—'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroV2;
