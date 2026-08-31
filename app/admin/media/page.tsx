'use client';

import React, { useRef, useState } from 'react';
import { useGetMediaQuery, useAddMediaMutation, useDeleteMediaMutation } from '@/services/api';
import { useImageUpload } from '@/hooks/use-image-upload';
import {
  PageHeader,
  Panel,
  Field,
  FormGrid,
  Input,
  Button,
  EmptyState,
  Loading,
  Badge,
} from '@/components/admin/ui';
import type { MediaAsset } from '@/types';
import { cdn, cdnSrcSet } from '@/lib/image-url';

const MediaPage: React.FC = () => {
  const { data: media = [], isLoading } = useGetMediaQuery();
  const [addMedia] = useAddMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();
  const { uploadImage, deleteImage, isUploading, error } = useImageUpload('media');

  const fileInput = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<Partial<MediaAsset>>({ url: '', label: '', type: 'image' });
  const [isDragging, setIsDragging] = useState(false);

  const list = media as MediaAsset[];

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    try {
      const uploaded = await uploadImage(file);
      setDraft((prev) => ({
        ...prev,
        url: uploaded.url,
        label: prev.label || uploaded.name.toUpperCase(),
      }));
    } catch {
      /* surfaced by the hook */
    }
  };

  const save = async () => {
    if (!draft.url) return;
    await addMedia({ ...draft, dateAdded: new Date().toISOString() });
    setDraft({ url: '', label: '', type: 'image' });
  };

  const remove = async (asset: MediaAsset) => {
    if (!window.confirm('Delete this asset? It is also removed from Cloudinary.')) return;
    await deleteMedia(asset._id);
    await deleteImage(asset.url);
  };

  if (isLoading) return <Loading label="LOADING MEDIA" />;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="MEDIA"
        subtitle="Shared asset library"
        actions={<Badge tone="muted">{list.length} ASSETS</Badge>}
      />

      <Panel title="UPLOAD">
        <div className="space-y-4">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />

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
            className={`border-2 border-dashed p-6 flex items-center justify-center gap-3 cursor-pointer transition-colors ${
              isDragging ? 'border-[#FF5F1F] bg-[#FF5F1F]/10' : 'border-black bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {isUploading ? (
              <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">
                UPLOADING...
              </span>
            ) : (
              <>
                <span className="flex h-7 w-7 items-center justify-center border-2 border-black text-sm leading-none">
                  +
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  DROP AN IMAGE OR CLICK TO BROWSE
                </span>
              </>
            )}
          </div>

          {draft.url && (
            <div className="border-2 border-black p-3 flex items-center gap-3">
              <img src={cdn(draft.url, { width: 120 })} alt="" className="h-14 w-14 border-2 border-black object-cover shrink-0" />
              <span className="flex-1 min-w-0 text-[10px] font-bold text-black/40 truncate">{draft.url}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDraft({ url: '', label: '', type: 'image' })}
              >
                CLEAR
              </Button>
            </div>
          )}

          <FormGrid>
            <Field label="ASSET URL" hint="Or paste a link directly">
              <Input
                value={draft.url ?? ''}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                placeholder="https://"
              />
            </Field>
            <Field label="LABEL">
              <Input
                value={draft.label ?? ''}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                caps
              />
            </Field>
          </FormGrid>

          {error && (
            <p className="text-[10px] font-black uppercase tracking-widest text-red-600">{error}</p>
          )}

          <Button variant="accent" onClick={save} disabled={!draft.url || isUploading}>
            ADD TO LIBRARY
          </Button>
        </div>
      </Panel>

      {list.length === 0 ? (
        <EmptyState label="No assets in the library yet" />
      ) : (
        <Panel title="LIBRARY" flush>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
            {list.map((asset) => (
              <figure key={asset._id} className="border-2 border-black bg-white group">
                <div className="aspect-square overflow-hidden bg-gray-100 border-b-2 border-black">
                  <img
                    src={cdn(asset.url, { width: 400 })}
                    srcSet={cdnSrcSet(asset.url, 400)}
                    alt={asset.label}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <figcaption className="p-2 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wide truncate">{asset.label}</p>
                  <Button size="sm" variant="danger" block onClick={() => remove(asset)}>
                    DELETE
                  </Button>
                </figcaption>
              </figure>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
};

export default MediaPage;
