'use client';

import React, { useRef, useState } from 'react';
import { useImageUpload } from '@/hooks/use-image-upload';
import type { UploadModule } from '@/lib/cloudinary';

interface FileFieldProps {
  label: string;
  /** Current file URL, or '' when empty. */
  value: string;
  onChange: (url: string) => void;
  module: UploadModule;
  /** Extra accept types beyond PDF/DOC — pass 'image/*' to also allow images. */
  accept?: string;
  className?: string;
}

const filenameFrom = (url: string) => {
  try {
    return decodeURIComponent(url.split('/').pop() || url).slice(0, 42);
  } catch {
    return url.slice(0, 42);
  }
};

/**
 * Document input for things the footer links to (resume, archive, decks).
 *
 * Uploads through /api/upload as a raw asset, so the delivery URL keeps its
 * extension and downloads correctly. Replacing or removing purges the old file.
 */
const FileField: React.FC<FileFieldProps> = ({
  label,
  value,
  onChange,
  module,
  accept = '.pdf,.doc,.docx,application/pdf',
  className = '',
}) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const { uploadImage, deleteImage, isUploading, error, clearError } = useImageUpload(module);
  const [isDragging, setIsDragging] = useState(false);

  const hasFile = Boolean(value) && value !== '#';

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    clearError();
    try {
      const previous = hasFile ? value : '';
      const uploaded = await uploadImage(file);
      onChange(uploaded.url);
      if (previous && previous !== uploaded.url) await deleteImage(previous);
    } catch {
      /* surfaced by the hook */
    }
  };

  const handleRemove = async () => {
    if (!hasFile) return;
    if (!window.confirm('REMOVE_FILE?')) return;
    const target = value;
    onChange('');
    await deleteImage(target);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</label>

      <input
        ref={fileInput}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {hasFile ? (
        <div className="border-2 border-black bg-white">
          <div className="p-3 flex items-center gap-3 border-b-2 border-black">
            <span className="flex items-center justify-center h-9 w-9 bg-black text-white text-[9px] font-black shrink-0">
              FILE
            </span>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-0 font-bold text-xs truncate hover:text-[#FF5F1F] transition-colors"
              title={value}
            >
              {filenameFrom(value)}
            </a>
          </div>
          <div className="flex divide-x-2 divide-black">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={isUploading}
              className="flex-1 p-3 font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-40"
            >
              {isUploading ? 'UPLOADING...' : 'REPLACE'}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="flex-1 p-3 font-black uppercase text-[10px] tracking-widest text-red-600 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-40"
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
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => fileInput.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInput.current?.click();
          }}
          className={`border-2 border-dashed p-4 flex items-center justify-center gap-3 cursor-pointer transition-colors ${
            isDragging ? 'border-[#FF5F1F] bg-[#FF5F1F]/10' : 'border-black bg-gray-50 hover:bg-gray-100'
          }`}
        >
          {isUploading ? (
            <span className="font-black uppercase tracking-widest text-[10px] animate-pulse">UPLOADING...</span>
          ) : (
            <>
              <span className="flex items-center justify-center h-7 w-7 border-2 border-black text-base leading-none">+</span>
              <span className="font-black uppercase tracking-widest text-[10px]">UPLOAD_FILE (PDF / DOC)</span>
            </>
          )}
        </div>
      )}

      {error && <p className="text-[10px] font-black uppercase tracking-widest text-red-600">{error}</p>}
    </div>
  );
};

export default FileField;
