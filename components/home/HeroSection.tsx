'use client';

import React from 'react';
import { useGetProfileQuery } from '@/services/api';
import { HeroSkeleton } from '@/components/skeletons';

const HeroSection: React.FC = () => {
  const { data: profile, isLoading } = useGetProfileQuery();

  if (isLoading) return <HeroSkeleton />;

  return (
    <section className="relative min-h-[90vh] flex flex-col border-b-4 border-black overflow-hidden">
      {/* The name area absorbs the section's spare height so the stat strip
          lands on the bottom edge. Centring the section itself split that
          spare height above AND below the strip, leaving the skills section
          floating away from it. */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="relative z-10">
          <h1 className="font-heading font-black text-[10vw] sm:text-[11vw] leading-[0.85] px-6 md:px-12 uppercase -ml-[1vw] select-none break-words">
            {profile?.name}<br />
            {profile?.lastName}
          </h1>

          <div className="absolute top-[40%] left-[5%] md:left-[20%] z-20 mix-blend-difference bg-[#FF5F1F] p-4 md:p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-2xl transform -rotate-2">
            <p className="text-white text-xl md:text-3xl font-bold uppercase leading-tight tracking-tight">
              {profile?.manifestoLine}
            </p>
          </div>
        </div>
      </div>

      {/* mt-* stays: the manifesto slab is absolutely positioned and hangs
          below the name block, so the strip needs clearance for it. */}
      <div className="mt-24 md:mt-32 shrink-0 grid grid-cols-1 md:grid-cols-3 gap-0 border-t-4 border-black">
        <div className="p-8 border-r-0 md:border-r-4 border-b-4 md:border-b-0 border-black">
          <span className="block text-xs font-bold uppercase mb-4 opacity-50">STATUS</span>
          <p className="text-xl font-bold">{profile?.status}</p>
        </div>
        <div className="p-8 border-r-0 md:border-r-4 border-b-4 md:border-b-0 border-black">
          <span className="block text-xs font-bold uppercase mb-4 opacity-50">LOCATION</span>
          <p className="text-xl font-bold uppercase">{profile?.location}</p>
        </div>
        <div className="p-8 bg-[#FF5F1F]">
          <span className="block text-xs font-bold uppercase mb-4 text-white opacity-70">DISCIPLINE</span>
          <p className="text-xl font-bold text-white uppercase">{profile?.discipline}</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
