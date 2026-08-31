import React from 'react';
import { SkeletonBar, SkeletonParagraph, SkeletonRegion } from './Skeleton';

/** Sticky ACADEMIA rail stays real; three placeholder entries beside it. */
const AcademiaSkeleton: React.FC = () => (
  <SkeletonRegion label="Loading education">
    <section id="academia" className="border-b-4 border-black flex flex-col md:flex-row bg-gray-50">
      <div className="w-full md:w-1/3 p-12 border-b-4 md:border-b-0 md:border-r-4 border-black">
        <div className="sticky top-32 flex flex-col items-start gap-8">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl uppercase leading-none">ACADEMIA</h2>
          <SkeletonBar className="h-12 w-40" />
        </div>
      </div>
      <div className="w-full md:w-2/3 divide-y-4 divide-black">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="p-12">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-4 gap-2">
              <SkeletonBar className="h-8 w-3/5" />
              <SkeletonBar className="h-5 w-28" />
            </div>
            <SkeletonBar className="h-6 w-2/5 mb-4" />
            <SkeletonParagraph lines={2} className="max-w-2xl" />
          </div>
        ))}
      </div>
    </section>
  </SkeletonRegion>
);

export default AcademiaSkeleton;
