'use client';

import React, { useId, useRef, useState } from 'react';
import { useImageUpload } from '@/hooks/use-image-upload';
import type { UploadModule } from '@/lib/cloudinary';
import { cdn } from '@/lib/image-url';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';

interface ImageFieldProps {
  label: string;
  /** Current image URL, or '' when empty. */
  value: string;
  /** Called with the new URL, or '' when the image is removed. */
  onChange: (url: string) => void;
  /** Decides the Cloudinary folder the file lands in. */
  module: UploadModule;
  /** Aspect ratio of the preview box. */
  aspect?: 'video' | 'square';
  /** Show the raw URL input alongside the picker. */
  allowUrl?: boolean;
  className?: string;
}

/**
 * Brutalist image input: drop a file, pick one, or paste a URL.
 *
 * Once an image is set it offers REPLACE and REMOVE. Removing an asset that
 * this site uploaded also deletes it from Cloudinary; a URL from anywhere else
 * is simply detached from the record.
 */
const ImageField: React.FC<ImageFieldProps> = ({
  label,
  value,
  onChange,
  module,
  aspect = 'video',
  allowUrl = true,
  className = '',
}) => {
  const inputId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const { uploadImage, deleteImage, isUploading, error, clearError } = useImageUpload(module);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    clearError();
    setNotice(null);
    try {
      const previous = value;
      const uploaded = await uploadImage(file);
      onChange(uploaded.url);
      // Replacing: clean up the file we just orphaned.
      if (previous && previous !== uploaded.url) {
        const gone = await deleteImage(previous);
        setNotice(gone ? 'PREVIOUS_ASSET_PURGED' : null);
      }
    } catch {
      /* error is surfaced by the hook */
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    setConfirmingRemove(false);
    const target = value;
    onChange('');
    setNotice(null);
    const gone = await deleteImage(target);
    setNotice(gone ? 'ASSET_PURGED_FROM_CLOUDINARY' : 'DETACHED (asset not hosted here)');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const aspectClass = aspect === 'square' ? 'aspect-square' : 'aspect-video';

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={inputId} className="text-[10px] font-black uppercase tracking-widest opacity-50">
          {label}
        </label>
        {allowUrl && (
          <button
            type="button"
            onClick={() => setShowUrl((v) => !v)}
            className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-[#FF5F1F] transition-opacity"
          >
            {showUrl ? 'HIDE_URL' : 'USE_URL'}
          </button>
        )}
      </div>

      <input
        id={inputId}
        ref={fileInput}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {value ? (
        <div className="border-2 border-black">
          <div className={`relative ${aspectClass} bg-gray-100 overflow-hidden border-b-2 border-black`}>
            <img src={cdn(value, { width: 800 })} alt={label} decoding="async" className="w-full h-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="text-white font-black uppercase tracking-widest animate-pulse text-sm">
                  UPLOADING...
                </span>
              </div>
            )}
          </div>
          <div className="flex divide-x-2 divide-black">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={isUploading}
              className="flex-1 p-2.5 font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-40"
            >
              REPLACE
            </button>
            <button
              type="button"
              onClick={() => setConfirmingRemove(true)}
              disabled={isUploading}
              className="flex-1 p-2.5 font-black uppercase text-[10px] tracking-widest text-red-600 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-40"
            >
              REMOVE
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInput.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInput.current?.click();
          }}
          className={`${aspectClass} border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
            isDragging ? 'border-[#FF5F1F] bg-[#FF5F1F]/10' : 'border-black bg-gray-50 hover:bg-gray-100'
          }`}
        >
          {isUploading ? (
            <span className="font-black uppercase tracking-widest animate-pulse text-sm">UPLOADING...</span>
          ) : (
            <>
              <span className="flex items-center justify-center h-9 w-9 border-2 border-black text-lg leading-none">
                +
              </span>
              <span className="font-black uppercase tracking-widest text-xs">DROP_IMAGE / CLICK_TO_BROWSE</span>
              <span className="text-[10px] font-black uppercase opacity-30">
                PNG · JPG · WEBP — MAX 10MB
              </span>
            </>
          )}
        </div>
      )}

      {showUrl && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full border-2 border-black px-3 py-2 font-bold text-sm outline-none focus:border-[#FF5F1F]"
        />
      )}

      {error && (
        <p className="text-[10px] font-black uppercase tracking-widest text-red-600">{error}</p>
      )}
      {notice && !error && (
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{notice}</p>
      )}

      <ConfirmDialog
        open={confirmingRemove}
        title={`REMOVE ${label}?`}
        previewUrl={value ? cdn(value, { width: 400 }) : undefined}
        message={
          <>
            This deletes the file from Cloudinary straight away — before the record is saved, so
            cancelling the editor afterwards will not bring it back.
          </>
        }
        confirmLabel="REMOVE"
        onConfirm={handleRemove}
        onCancel={() => setConfirmingRemove(false)}
      />
    </div>
  );
};

export default ImageField;
