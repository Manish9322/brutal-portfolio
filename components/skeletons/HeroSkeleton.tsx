import React from 'react';
import { SkeletonBar, SkeletonRegion } from './Skeleton';

/** Mirrors HeroSection so the name block and stat strip don't shift on load. */
const HeroSkeleton: React.FC = () => (
  <SkeletonRegion label="Loading profile">
    <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 border-b-4 border-black overflow-hidden">
      <div className="relative z-10">
        {/* Two lines of the oversized name */}
        <div className="space-y-4 -ml-[1vw]">
          <SkeletonBar className="h-[12vw] w-[70%]" />
          <SkeletonBar className="h-[12vw] w-[55%]" />
        </div>

        {/* Manifesto slab keeps its accent colour so the page still reads brutalist */}
        <div className="absolute top-[40%] left-[5%] md:left-[20%] z-20 bg-[#FF5F1F]/30 p-4 md:p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-[80%] transform -rotate-2 animate-pulse">
          <div className="space-y-3">
            <div className="h-6 w-full bg-white/40" />
            <div className="h-6 w-4/5 bg-white/40" />
          </div>
        </div>
      </div>

      <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-0 border-t-4 border-black">
        {['STATUS', 'LOCATION', 'DISCIPLINE'].map((label, i) => (
          <div
            key={label}
            className={`p-8 border-r-0 md:border-r-4 border-b-4 md:border-b-0 border-black ${i === 2 ? 'bg-[#FF5F1F]/30 md:border-r-0' : ''}`}
          >
            <span className="block text-xs font-bold uppercase mb-4 opacity-50">{label}</span>
            <SkeletonBar className="h-6 w-3/4" />
          </div>
        ))}
      </div>
    </section>
  </SkeletonRegion>
);

export default HeroSkeleton;
