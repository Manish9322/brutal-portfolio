'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import TopBar, { TOP_BAR_OFFSET } from '@/components/TopBar';
import { useGetGalleryQuery } from '@/services/api';
import { sortGallery, groupByCategory, tileSpan } from '@/lib/gallery';
import Lightbox from './Lightbox';
import type { GalleryItem } from '@/types';
import { cdn, cdnSrcSet } from '@/lib/image-url';

const ALL = 'ALL';

const GalleryWall: React.FC = () => {
  const { data: gallery = [], isLoading } = useGetGalleryQuery();
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => sortGallery((gallery as GalleryItem[]).filter((g) => g.visible)),
    [gallery]
  );

  const albums = useMemo(() => groupByCategory(visible), [visible]);

  /** Flat list backing the lightbox — matches exactly what is on screen. */
  const shown = useMemo(
    () => (activeCategory === ALL ? visible : visible.filter((g) => (g.category || 'UNFILED') === activeCategory)),
    [visible, activeCategory]
  );

  const shownAlbums = activeCategory === ALL ? albums : albums.filter((a) => a.category === activeCategory);

  // Index within `shown`, so the lightbox walks the visible set in display order.
  const indexOf = (item: GalleryItem) => shown.findIndex((g) => g._id === item._id);

  return (
    <section className="border-b-4 border-black min-h-screen bg-white">
      <TopBar
        left={
          <Link
            href="/"
            className="text-xs sm:text-sm font-black uppercase tracking-widest hover:text-[#FF5F1F] transition-colors border-b-4 border-black"
          >
            [ ← EXIT ]
          </Link>
        }
        right={
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hidden md:block">
            ARCHIVE_MODE // FRAME_BUFFER
          </span>
        }
      />

      <div className="p-8 md:p-24 border-b-4 border-black bg-black text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <h1 className="relative font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-9xl uppercase leading-none tracking-tighter">
          BEHIND<br />THE SCENES
        </h1>
        <p className="relative mt-4 text-xl font-bold text-[#FF5F1F] uppercase tracking-widest">
          {visible.length} FRAMES ACROSS {albums.length} SETS
        </p>
      </div>

      {albums.length > 1 && (
        <div className={`border-b-4 border-black flex flex-wrap divide-x-4 divide-black sticky ${TOP_BAR_OFFSET} bg-white z-30`}>
          {[{ category: ALL, items: visible }, ...albums].map((album) => (
            <button
              key={album.category}
              onClick={() => setActiveCategory(album.category)}
              className={`px-5 md:px-8 py-5 text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${
                activeCategory === album.category ? 'bg-[#FF5F1F] text-white' : 'hover:bg-gray-100'
              }`}
            >
              {album.category}
              <span className="ml-2 opacity-40">[{album.items.length}]</span>
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="p-24 text-center">
          <p className="text-4xl font-black uppercase opacity-20">LOADING_FRAMES...</p>
        </div>
      )}

      {shownAlbums.map((album) => (
        <div key={album.category}>
          {/* Album header strip */}
          <div className="border-b-4 border-black px-8 py-6 flex items-baseline justify-between gap-6 bg-gray-50">
            <h2 className="font-heading font-bold text-2xl md:text-4xl uppercase tracking-tighter leading-none">
              {album.category}
            </h2>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 whitespace-nowrap">
              {album.items.length} FRAME{album.items.length === 1 ? '' : 'S'}
            </span>
          </div>

          {/* Mosaic */}
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[minmax(0,1fr)] border-b-4 border-black">
            {album.items.map((item, i) => (
              <button
                key={item._id}
                onClick={() => setLightboxIndex(indexOf(item))}
                className={`group relative aspect-square border-black border-r-4 border-b-4 overflow-hidden ${tileSpan(i)}`}
                aria-label={`Open ${item.caption}`}
              >
                <img
                  src={cdn(item.url, { width: tileSpan(i) ? 800 : 400 })}
                  srcSet={cdnSrcSet(item.url, tileSpan(i) ? 800 : 400)}
                  alt={item.caption}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-[#FF5F1F] opacity-0 group-hover:opacity-25 transition-opacity" />

                {/* Frame number, always visible */}
                <span className="absolute top-0 left-0 bg-black text-white px-2 py-1 text-[10px] font-black tracking-widest">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Caption slides up on hover */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black text-white p-4 text-left">
                  <p className="font-black uppercase text-xs md:text-sm tracking-tighter leading-tight line-clamp-2">
                    {item.caption}
                  </p>
                  <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.3em] text-[#FF5F1F]">
                    EXPAND ⤢
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {!isLoading && shown.length === 0 && (
        <div className="p-24 text-center">
          <p className="text-4xl font-black uppercase opacity-20">NO_FRAMES_IN_THIS_SET</p>
        </div>
      )}

      <div className="p-8 md:p-16 flex flex-col md:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="text-center bg-black text-white px-12 py-6 text-lg font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-all"
        >
          BACK_TO_SYSTEM_ROOT
        </Link>
        <Link
          href="/work"
          className="text-center border-4 border-black px-12 py-6 text-lg font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
        >
          SEE_THE_WORK
        </Link>
      </div>

      {lightboxIndex !== null && shown[lightboxIndex] && (
        <Lightbox
          items={shown}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
};

export default GalleryWall;
