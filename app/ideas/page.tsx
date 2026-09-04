import { pageMetadata } from '@/lib/page-metadata';
import Link from 'next/link';
import HeroV3 from '@/components/ideas/HeroV3';
import LoaderShowcase from '@/components/ideas/LoaderShowcase';

export const metadata = pageMetadata(
  'IDEAS',
  'A scratch page for reworked sections before they land on the site.'
);

export default function IdeasPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#FF5F1F] selection:text-white">
      <div className="max-w-[1800px] mx-auto border-x-4 border-black bg-white">
        <HeroV3 />

        <LoaderShowcase />

        {/* Marker sits in the flow, not fixed: pinned to a corner it covered the
            meta strip, which runs the full width of the hero's bottom edge. */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 md:px-12 py-6 bg-black text-white">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
            IDEA · HERO REWORK · NOT LIVE
          </span>
          <Link
            href="/"
            className="self-start sm:self-auto border-4 border-white px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] transition-colors hover:bg-[#FF5F1F] hover:border-[#FF5F1F]"
          >
            COMPARE WITH THE LIVE HERO ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
