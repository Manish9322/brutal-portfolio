import React from 'react';
import { SkeletonBar, SkeletonRegion } from './Skeleton';

/**
 * Only the left column of ContactSection is data-driven, so this stands in for
 * that half while the form on the right stays interactive throughout.
 */
const ContactSkeleton: React.FC = () => (
  <SkeletonRegion label="Loading contact details">
    <div className="p-12 md:p-24 space-y-12">
      <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-7xl lg:text-9xl uppercase leading-[0.8]">
        LET&apos;S<br />TALK
      </h2>
      <div className="space-y-4">
        <SkeletonBar className="h-7 w-4/5" />
        <SkeletonBar className="h-6 w-3/5" />
      </div>
      <div className="pt-12 space-y-6">
        {['EMAIL', 'TELEGRAM'].map((label) => (
          <div key={label} className="border-b-4 border-black pb-4">
            <span className="block text-xs font-black uppercase opacity-50 mb-2">{label}</span>
            <SkeletonBar className="h-9 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  </SkeletonRegion>
);

export default ContactSkeleton;
