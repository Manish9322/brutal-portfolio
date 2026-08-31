import React from 'react';
import { SkeletonBar, SkeletonRegion } from './Skeleton';

/** Two quote slabs, keeping the black / orange split of the real section. */
const TestimonialSkeleton: React.FC = () => (
  <SkeletonRegion label="Loading testimonials">
    <section id="testimonials" className="border-b-4 border-black overflow-hidden">
      <div className="p-8 border-b-4 border-black bg-white">
        <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-7xl lg:text-8xl uppercase leading-none">TESTIMONIALS</h2>
      </div>
      {Array.from({ length: 2 }).map((_, idx) => (
        <div
          key={idx}
          className={`flex flex-col lg:flex-row divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-black ${idx === 0 ? 'border-b-4 border-black' : ''}`}
        >
          <div className="lg:w-2/3 p-12 lg:p-24 space-y-5">
            <SkeletonBar className="h-16 w-16" />
            <SkeletonBar className="h-10 w-full" />
            <SkeletonBar className="h-10 w-11/12" />
            <SkeletonBar className="h-10 w-2/3" />
          </div>
          <div
            className="lg:w-1/3 p-12 lg:p-24 bg-[#FF5F1F]/30 flex flex-col justify-end animate-pulse"
            aria-hidden="true"
          >
            <div className="space-y-4">
              <div className="h-3 w-24 bg-white/50" />
              <div className="h-9 w-3/4 bg-white/50" />
              <div className="h-5 w-1/2 bg-white/50" />
            </div>
          </div>
        </div>
      ))}
    </section>
  </SkeletonRegion>
);

export default TestimonialSkeleton;
