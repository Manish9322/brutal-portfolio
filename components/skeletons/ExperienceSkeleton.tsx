import React from 'react';
import { SkeletonBar, SkeletonParagraph, SkeletonRegion } from './Skeleton';

/** Sticky HISTORY rail stays real; the three entries are placeholders. */
const ExperienceSkeleton: React.FC = () => (
  <SkeletonRegion label="Loading experience">
    <section className="border-b-4 border-black flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 p-12 bg-gray-100 border-b-4 md:border-b-0 md:border-r-4 border-black">
        <div className="sticky top-32 flex flex-col items-start gap-8">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl uppercase leading-none">HISTORY</h2>
          <SkeletonBar className="h-12 w-40" />
        </div>
      </div>
      <div className="w-full md:w-2/3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className={`p-12 ${idx !== 2 ? 'border-b-4 border-black' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-2">
              <SkeletonBar className="h-9 w-2/3" />
              <SkeletonBar className="h-6 w-40" />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-black flex-1" />
              <SkeletonBar className="h-6 w-48" />
              <div className="h-px bg-black w-8" />
            </div>
            <SkeletonParagraph lines={2} className="max-w-2xl" />
          </div>
        ))}
      </div>
    </section>
  </SkeletonRegion>
);

export default ExperienceSkeleton;
