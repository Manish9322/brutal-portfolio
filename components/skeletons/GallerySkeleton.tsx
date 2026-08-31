import React from 'react';
import { SkeletonBar, SkeletonRegion } from './Skeleton';

/** Six square placeholders, matching the homepage gallery grid. */
const GallerySkeleton: React.FC = () => (
  <SkeletonRegion label="Loading gallery">
    <section id="gallery" className="border-b-4 border-black">
      <div className="p-8 border-b-4 border-black bg-black text-white flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <h2 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase leading-none">BEHIND<br />THE SCENES</h2>
        <div className="h-12 w-44 bg-white/20 animate-pulse" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className={`flex flex-col border-black ${idx < 3 ? 'lg:border-b-4' : ''}`}>
            <div className="aspect-square border-b-4 border-black bg-black/5 animate-pulse" aria-hidden="true" />
            <div className="p-6 flex-1 space-y-3">
              <SkeletonBar className="h-3 w-20" />
              <SkeletonBar className="h-6 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  </SkeletonRegion>
);

export default GallerySkeleton;
