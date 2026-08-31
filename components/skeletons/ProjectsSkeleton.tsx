import React from 'react';
import { SkeletonBar, SkeletonChip, SkeletonParagraph, SkeletonRegion } from './Skeleton';

/** Four placeholder cards, matching the homepage project grid. */
const ProjectsSkeleton: React.FC = () => (
  <SkeletonRegion label="Loading projects">
    <section id="work" className="border-b-4 border-black">
      <div className="p-8 border-b-4 border-black flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <h2 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase leading-none">SELECTED<br />WORKS</h2>
        <SkeletonBar className="h-12 w-44" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className={`flex flex-col border-black ${idx % 2 === 0 ? 'md:border-r-4' : ''} ${idx < 3 ? 'border-b-4' : 'border-b-4 md:border-b-0'}`}
          >
            <div className="relative aspect-video border-b-4 border-black bg-black/5 animate-pulse">
              <div className="absolute top-4 right-4 h-8 w-16 bg-white border-2 border-black" />
            </div>
            <div className="p-8 space-y-6 flex-1">
              <div className="flex justify-between items-start">
                <SkeletonBar className="h-3 w-32" />
                <SkeletonBar className="h-3 w-28" />
              </div>
              <SkeletonBar className="h-11 w-3/4" />
              <SkeletonParagraph lines={2} />
              <div className="flex flex-wrap gap-2 pt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonChip key={i} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </SkeletonRegion>
);

export default ProjectsSkeleton;
