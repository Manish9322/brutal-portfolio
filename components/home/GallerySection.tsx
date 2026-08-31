'use client';

import React from 'react';
import Link from 'next/link';
import { useGetGalleryQuery } from '@/services/api';
import { GallerySkeleton } from '@/components/skeletons';
import { sortGallery, GALLERY_SHOWN } from '@/lib/gallery';
import type { GalleryItem } from '@/types';
import { cdn, cdnSrcSet } from '@/lib/image-url';

const GallerySection: React.FC = () => {
  const { data: gallery = [], isLoading } = useGetGalleryQuery();
  const all = sortGallery((gallery as GalleryItem[]).filter((item) => item.visible));
  const visibleItems = all.slice(0, GALLERY_SHOWN);

  if (isLoading) return <GallerySkeleton />;

  return (
    <section id="gallery" className="border-b-4 border-black">
      <div className="p-8 border-b-4 border-black bg-black text-white flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <h2 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase leading-none">BEHIND<br />THE SCENES</h2>
        {all.length > 0 && (
          <Link
            href="/gallery"
            className="self-start md:self-auto bg-[#FF5F1F] text-white px-8 py-4 text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors whitespace-nowrap"
          >
            VIEW ALL [{all.length}] →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
        {visibleItems.map((item, idx) => (
          <Link
            key={item._id}
            href="/gallery"
            className={`group flex flex-col border-black ${idx >= visibleItems.length - 3 ? '' : 'lg:border-b-4'}`}
          >
            <div className="relative aspect-square overflow-hidden border-b-4 border-black">
              <img
                src={cdn(item.url, { width: 500 })}
                srcSet={cdnSrcSet(item.url, 500)}
                alt={item.caption}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
            <div className="p-6 bg-white group-hover:bg-[#FF5F1F] group-hover:text-white transition-colors duration-300 flex-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 mb-2 block">ENTRY_{String(idx + 1).padStart(2, '0')}</span>
              <p className="text-xl font-black uppercase leading-tight tracking-tighter">
                {item.caption}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
