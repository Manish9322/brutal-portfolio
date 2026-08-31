'use client';

import { useCallback, useState } from 'react';
import type { UploadModule } from '@/lib/cloudinary';

export interface UploadedImage {
  url: string;
  publicId: string;
  name: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  folder?: string;
}

export function useImageUpload(module: UploadModule = 'misc') {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (file: File): Promise<UploadedImage> => {
      setIsUploading(true);
      setError(null);

      try {
        const body = new FormData();
        body.append('file', file);
        body.append('module', module);

        const response = await fetch('/api/upload', { method: 'POST', body });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) throw new Error(data.error || 'Upload failed');

        return data as UploadedImage;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [module]
  );

  const deleteImage = useCallback(async (urlOrPublicId: string): Promise<boolean> => {
    if (!urlOrPublicId) return false;
    const key = urlOrPublicId.startsWith('http')
      ? `url=${encodeURIComponent(urlOrPublicId)}`
      : `publicId=${encodeURIComponent(urlOrPublicId)}`;

    try {
      const response = await fetch(`/api/upload?${key}`, { method: 'DELETE' });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  return { uploadImage, deleteImage, isUploading, error, clearError: () => setError(null) };
}
