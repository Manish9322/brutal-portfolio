'use client';

import React, { useRef, useState } from 'react';
import { useImageUpload } from '@/hooks/use-image-upload';
import type { UploadModule } from '@/lib/cloudinary';

export interface ImageListItem {
  _id?: string;
  url: string;
  caption?: string;
}

interface ImageListFieldProps {
  label: string;
  value: ImageListItem[];
  onChange: (items: ImageListItem[]) => void;
  module: UploadModule;
  className?: string;
}

/**
 * Multi-image input for arrays like a project's screenshots.
 *
 * Supports adding several files at once, editing each caption, reordering,
 * replacing a single image, and removing one (which also purges it from
 * Cloudinary when this site owns the asset).
 */
const ImageListField: React.FC<ImageListFieldProps> = ({
  label,
  value,
  onChange,
  module,
  className = '',
}) => {
  const addInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadImage, deleteImage, isUploading, error, clearError } = useImageUpload(module);

  const items = value ?? [];

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    clearError();

    const uploaded: ImageListItem[] = [];
    for (const file of Array.from(files)) {
      try {
        const result = await uploadImage(file);
        uploaded.push({ url: result.url, caption: '' });
      } catch {
        break; // hook surfaces the error; keep whatever already succeeded
      }
    }

    if (uploaded.length) onChange([...items, ...uploaded]);
  };

  const replaceAt = async (index: number, file?: File | null) => {
    if (!file) return;
    clearError();
    try {
      const previous = items[index]?.url;
      const result = await uploadImage(file);
      onChange(items.map((item, i) => (i === index ? { ...item, url: result.url } : item)));
      if (previous && previous !== result.url) await deleteImage(previous);
    } catch {
      /* surfaced by the hook */
    }
  };

  const removeAt = async (index: number) => {
    if (!window.confirm('REMOVE_SCREENSHOT?')) return;
    const target = items[index]?.url;
    onChange(items.filter((_, i) => i !== index));
    if (target) await deleteImage(target);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const setCaption = (index: number, caption: string) =>
    onChange(items.map((item, i) => (i === index ? { ...item, caption } : item)));

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
          {label} [{items.length}]
        </label>
        {isUploading && (
          <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">
            UPLOADING...
          </span>
        )}
      </div>

      <input
        ref={addInput}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={replaceInput}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          if (replacingIndex !== null) replaceAt(replacingIndex, e.target.files?.[0]);
          setReplacingIndex(null);
          e.target.value = '';
        }}
      />

      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item._id ?? `${item.url}-${index}`}
              className="border-4 border-black bg-white flex flex-col sm:flex-row"
            >
              <div className="sm:w-48 shrink-0 aspect-video sm:aspect-auto bg-gray-100 border-b-4 sm:border-b-0 sm:border-r-4 border-black overflow-hidden">
                <img src={item.url} alt={item.caption || `Screenshot ${index + 1}`} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                    CAPTURE_{String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <input
                  value={item.caption ?? ''}
                  onChange={(e) => setCaption(index, e.target.value)}
                  placeholder="CAPTION"
                  className="w-full border-2 border-black p-2 font-bold text-sm outline-none focus:border-[#FF5F1F]"
                />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => move(index, -1)} className="px-3 py-2 border-2 border-black text-xs font-black hover:bg-gray-100">↑</button>
                  <button type="button" onClick={() => move(index, 1)} className="px-3 py-2 border-2 border-black text-xs font-black hover:bg-gray-100">↓</button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplacingIndex(index);
                      replaceInput.current?.click();
                    }}
                    disabled={isUploading}
                    className="px-4 py-2 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-[#FF5F1F] disabled:opacity-40"
                  >
                    REPLACE
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    disabled={isUploading}
                    className="px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-500 hover:text-white disabled:opacity-40"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => addInput.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') addInput.current?.click();
        }}
        className={`border-4 border-dashed p-6 flex items-center justify-center gap-4 cursor-pointer transition-colors ${
          isDragging ? 'border-[#FF5F1F] bg-[#FF5F1F]/10' : 'border-black bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <span className="flex items-center justify-center h-9 w-9 border-4 border-black text-xl leading-none">+</span>
        <span className="font-black uppercase tracking-widest text-xs">ADD_SCREENSHOTS (MULTIPLE OK)</span>
      </div>

      {error && <p className="text-[10px] font-black uppercase tracking-widest text-red-600">{error}</p>}
    </div>
  );
};

export default ImageListField;
