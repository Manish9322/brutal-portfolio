import React from 'react';
import { SkeletonBar, SkeletonRegion } from './Skeleton';

/** Keeps the real TECHNICAL ARSENAL header, skeletons only the four columns. */
const SkillsSkeleton: React.FC = () => (
  <SkeletonRegion label="Loading skills">
    <section id="skills" className="border-b-4 border-black">
      <div className="bg-[#FF5F1F] p-8 border-b-4 border-black">
        <h2 className="text-white font-heading font-bold text-4xl uppercase tracking-tighter">TECHNICAL ARSENAL</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-black">
        {Array.from({ length: 4 }).map((_, col) => (
          <div key={col} className="flex flex-col">
            <div className="p-6 bg-gray-100 border-b-4 border-black">
              <SkeletonBar className="h-3 w-28" />
            </div>
            <div className="flex-1 p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, row) => (
                <div key={row} className="flex items-center justify-between">
                  <SkeletonBar className={`h-7 ${row % 3 === 0 ? 'w-2/3' : row % 3 === 1 ? 'w-1/2' : 'w-3/5'}`} />
                  <div className="h-4 w-4 bg-black opacity-10" />
                </div>
              ))}
            </div>
            <div className="border-t-4 border-black p-5 flex items-center justify-between gap-4">
              <SkeletonBar className="h-3 w-20" />
              <div className="h-8 w-8 border-4 border-black/20 animate-pulse" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    </section>
  </SkeletonRegion>
);

export default SkillsSkeleton;
