'use client';

import React, { useCallback, useEffect } from 'react';
import type { GalleryItem } from '@/types';

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ items, index, onClose, onNavigate }) => {
  const item = items[index];

  const go = useCallback(
    (delta: number) => {
      const next = (index + delta + items.length) % items.length;
      onNavigate(next);
    },
    [index, items.length, onNavigate]
  );

  // Keyboard control, and lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [go, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || 'Gallery image'}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between border-b-4 border-white p-4 md:p-6 text-white shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#FF5F1F]">
            {item.category || 'UNFILED'}
          </span>
          <p className="font-black uppercase tracking-tighter text-lg md:text-2xl truncate">
            {item.caption}
          </p>
        </div>
        <div className="flex items-center gap-4 md:gap-8 shrink-0 pl-4">
          <span className="font-black text-sm md:text-lg tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="border-4 border-white px-4 py-2 font-black uppercase text-xs tracking-widest hover:bg-[#FF5F1F] hover:border-[#FF5F1F] transition-colors"
          >
            CLOSE ✕
          </button>
        </div>
      </div>

      {/* Image stage */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-10 min-h-0">
        <img
          src={item.url}
          alt={item.caption}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full object-contain border-4 border-white"
        />
      </div>

      {/* Bottom controls */}
      <div
        className="flex items-stretch border-t-4 border-white divide-x-4 divide-white text-white shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => go(-1)}
          className="flex-1 p-4 md:p-6 font-black uppercase tracking-widest text-sm hover:bg-[#FF5F1F] transition-colors flex items-center justify-center gap-3"
        >
          <span>←</span> PREV
        </button>
        <button
          onClick={() => go(1)}
          className="flex-1 p-4 md:p-6 font-black uppercase tracking-widest text-sm hover:bg-[#FF5F1F] transition-colors flex items-center justify-center gap-3"
        >
          NEXT <span>→</span>
        </button>
      </div>

      <p className="hidden md:block text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/30 pb-3">
        ← → TO NAVIGATE // ESC TO CLOSE
      </p>
    </div>
  );
};

export default Lightbox;
