import type { GalleryItem } from '@/types';

/** Gallery tiles shown on the homepage before linking through to /gallery. */
export const GALLERY_SHOWN = 6;

export function sortGallery(items: GalleryItem[]): GalleryItem[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export interface Album {
  category: string;
  items: GalleryItem[];
}

/** Groups items into albums by category, preserving gallery order. */
export function groupByCategory(items: GalleryItem[]): Album[] {
  const albums = new Map<string, GalleryItem[]>();

  for (const item of sortGallery(items)) {
    const key = item.category?.trim() || 'UNFILED';
    if (!albums.has(key)) albums.set(key, []);
    albums.get(key)!.push(item);
  }

  return [...albums.entries()].map(([category, list]) => ({ category, items: list }));
}

/**
 * Mosaic sizing: every 5th tile spans two columns so the grid never reads as a
 * flat, uniform wall of squares.
 */
export function tileSpan(index: number): string {
  return index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : '';
}
