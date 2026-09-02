'use client';

import React, { useEffect, useState } from 'react';
import { useGetProfileQuery } from '@/services/api';
import { HeroSkeleton } from '@/components/skeletons';

/**
 * Hero rework — a copy of the live HeroSection with UI layered on top.
 *
 * The bones are deliberately unchanged: a min-h-[90vh] column, the name as a
 * centred w-fit block with both lines flush left, the accent manifesto slab,
 * and the three-cell STATUS / LOCATION / DISCIPLINE strip on the bottom edge.
 *
 * What is added:
 *   - an outlined echo of the name sitting behind the solid one, for depth
 *   - per-glyph hover on the name
 *   - a meta line (availability pulse, location, live local time)
 *   - the slab moved into the flow with a controlled overlap, so it stops
 *     swallowing whole lines of the surname at arbitrary viewport sizes
 *   - a marquee ticker between the name and the strip
 *   - numbered, hover-reactive stat cells
 *   - a staggered entrance
 */

const ACCENT = '#FF5F1F';

/* --------------------------------------------------------------- clock ---- */

/** Rendered only after mount — a clock in the SSR payload mismatches on hydration. */
const LocalTime: React.FC = () => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const read = () =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());

    setTime(read());
    const tick = setInterval(() => setTime(read()), 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time ?? '--:--:--'} IST
    </span>
  );
};

/* ---------------------------------------------------------------- name ---- */

const NAME_TYPE =
  'font-heading font-black leading-[0.85] uppercase select-none break-words tracking-tighter';

/**
 * One line of the name, split so each glyph can react on hover.
 *
 * Both the solid name and the outlined echo behind it render through this, so
 * their glyph boxes stay identical — inline-block spans measure slightly
 * differently from a plain text run, and any mismatch would show as a blurred
 * double edge rather than a clean offset outline.
 */
const NameLine: React.FC<{ text: string; ghost?: boolean }> = ({ text, ghost }) => (
  <span className="block">
    {text.split('').map((char, i) => (
      <span
        key={`${char}-${i}`}
        className={
          ghost
            ? 'inline-block'
            : 'inline-block transition-[transform,color] duration-200 ease-out hover:-translate-y-[0.05em] hover:text-[#FF5F1F] motion-reduce:transition-none motion-reduce:hover:translate-y-0'
        }
        style={ghost ? undefined : { transitionDelay: `${i * 8}ms` }}
      >
        {char}
      </span>
    ))}
  </span>
);

/* ---------------------------------------------------------------- hero ---- */

const HeroV3: React.FC = () => {
  const { data: profile, isLoading } = useGetProfileQuery();

  if (isLoading) return <HeroSkeleton />;

  const first = (profile?.name ?? '').trim();
  const last = (profile?.lastName ?? '').trim();
  const fullName = [first, last].filter(Boolean).join(' ');

  // The strip directly below already states discipline, status and location, so
  // echoing them here said nothing new. This reads as a workshop sign instead:
  // what gets built, how it is approached, and how to start a conversation.
  const ticker = [
    'DESIGN THAT ARGUES',
    'CODE THAT SHIPS',
    'NO TEMPLATES',
    'NO FILLER',
    'BUILT END TO END',
    'CURRENTLY TAKING ON NEW WORK',
    'SCROLL FOR THE ARCHIVE',
  ].join('  ///  ');

  // Repeated twice: .animate-marquee translates -50%, so the track only loops
  // seamlessly when its content is two identical halves.
  const tickerTrack = `${ticker}  ///  ${ticker}  ///  `;

  const meta = [
    { label: 'STATUS', value: profile?.status, accent: false },
    { label: 'LOCATION', value: profile?.location, accent: false },
    { label: 'DISCIPLINE', value: profile?.discipline, accent: true },
  ];

  return (
    <section className="relative min-h-[90vh] flex flex-col border-b-4 border-black overflow-hidden bg-white">
      {/* Grid wash, echoing the overlay the homepage lays across everything. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ---------------------------------------------------- meta line ---- */}
      <div className="relative shrink-0 flex items-center justify-between gap-4 px-4 md:px-12 py-3 border-b-2 border-black/10 text-[10px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-top-2 duration-500">
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
          <LocalTime />
        </span>
      </div>

      {/* --------------------------------------------------------- name ---- */}
      <div className="relative flex-1 flex flex-col justify-center py-10">
        <div className="relative z-10 w-fit mx-auto px-6 md:px-12">
          {/* Outlined echo, offset behind the solid name. */}
          <span
            aria-hidden="true"
            className={`${NAME_TYPE} absolute inset-0 px-6 md:px-12 text-transparent animate-in fade-in duration-1000`}
            style={{
              fontSize: 'clamp(2.5rem, 11vw, 12rem)',
              WebkitTextStroke: '1.5px rgba(0,0,0,0.18)',
              transform: 'translate(0.045em, 0.045em)',
            }}
          >
            <NameLine text={first} ghost />
            <NameLine text={last} ghost />
          </span>

          <h1
            aria-label={fullName}
            className={`${NAME_TYPE} relative animate-in fade-in slide-in-from-bottom-4 duration-700`}
            // Same 11vw as the live hero at normal widths, but capped so it
            // stops growing past the viewport on an ultrawide display.
            style={{ fontSize: 'clamp(2.5rem, 11vw, 12rem)' }}
          >
            <span aria-hidden="true">
              <NameLine text={first} />
              <NameLine text={last} />
            </span>
          </h1>

          {/* In the flow with a negative offset: the slab still crashes into the
              name as a collage, but by a fixed amount rather than landing
              wherever top-[70%] happens to fall at a given viewport size. */}
          {profile?.manifestoLine && (
            <div
              className="relative z-20 mt-6 sm:-mt-4 md:-mt-8 ml-auto mr-0 w-full sm:w-auto sm:max-w-2xl bg-[#FF5F1F] p-4 md:p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-2 animate-in fade-in zoom-in-95 duration-700"
              style={{ animationDelay: '240ms', animationFillMode: 'both' }}
            >
              <p className="text-white text-lg sm:text-xl md:text-3xl font-bold uppercase leading-tight tracking-tight">
                {profile.manifestoLine}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------- ticker ---- */}
      {ticker && (
        <div className="relative shrink-0 border-t-4 border-black bg-black text-white overflow-hidden whitespace-nowrap py-2.5">
          <span className="animate-marquee text-[10px] font-black uppercase tracking-[0.5em]">
            {tickerTrack}
          </span>
        </div>
      )}

      {/* --------------------------------------------------- stat strip ---- */}
      <div className="relative shrink-0 grid grid-cols-1 md:grid-cols-3 gap-0 border-t-4 border-black">
        {meta.map((cell, i) => (
          <div
            key={cell.label}
            className={`group p-8 border-black transition-colors ${
              i < meta.length - 1 ? 'border-b-4 md:border-b-0 md:border-r-4' : ''
            } ${cell.accent ? 'bg-[#FF5F1F]' : 'hover:bg-black hover:text-white'}`}
          >
            <span className="flex items-center gap-3 mb-4">
              <span className={`text-[10px] font-black tabular-nums ${cell.accent ? 'text-white/50' : 'opacity-30'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  cell.accent ? 'text-white opacity-70' : 'opacity-50'
                }`}
              >
                {cell.label}
              </span>
            </span>
            <p className={`text-xl font-bold uppercase break-words ${cell.accent ? 'text-white' : ''}`}>
              {cell.value || '—'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroV3;
