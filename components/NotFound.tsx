import React from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import CtaLink from '@/components/CtaLink';

/**
 * 404.
 *
 * Deliberately locked to a single screen: `h-dvh` with `overflow-hidden`, and
 * every row either fixed-height or `min-h-0`, so the page can never produce a
 * scrollbar at any viewport size. That constraint is why the type is clamped
 * rather than set in vw — an unbounded numeral is what would push it over.
 *
 * Visually it follows the site rather than inventing a separate terminal
 * language: white ground, 4px black rules, the accent used once.
 */
const NotFound: React.FC = () => (
  // h-dvh, not h-screen: 100vh on mobile Safari counts the space behind the
  // URL bar, which is exactly what would hand the page a scrollbar there.
  <div className="h-dvh overflow-hidden bg-white flex flex-col selection:bg-[#FF5F1F] selection:text-white">
    <TopBar
      left={
        <Link
          href="/"
          className="font-heading font-bold text-lg sm:text-2xl tracking-tighter uppercase hover:text-[#FF5F1F] transition-colors"
        >
          404
        </Link>
      }
      right={
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hidden sm:block">
          ROUTE_NOT_FOUND
        </span>
      }
    />

    <main className="flex-1 min-h-0 flex flex-col justify-center px-6 md:px-12 py-6 overflow-hidden">
      <span className="inline-block w-fit bg-[#FF5F1F] text-white px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest">
        ERROR 404
      </span>

      <h1
        className="mt-4 sm:mt-6 font-heading font-black uppercase leading-[0.85] tracking-tighter break-words"
        style={{ fontSize: 'clamp(2rem, 9vw, 7rem)' }}
      >
        PAGE
        <br />
        NOT FOUND
      </h1>

      <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-lg md:text-2xl font-bold uppercase leading-tight opacity-60">
        THIS ROUTE WAS NEVER BUILT, OR IT HAS BEEN RETIRED. THE ARCHIVE IS STILL WHERE YOU LEFT IT.
      </p>

      <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <CtaLink href="/" variant="primary" arrow="left">
          BACK TO HOME
        </CtaLink>
        <CtaLink href="/work" variant="secondary" arrow="right">
          VIEW THE WORK
        </CtaLink>
      </div>
    </main>

    <footer className="shrink-0 border-t-4 border-black px-6 md:px-12 py-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
      <span>STATUS // 404</span>
      <span className="hidden sm:block">NO RECORD AT THIS ADDRESS</span>
    </footer>
  </div>
);

export default NotFound;
