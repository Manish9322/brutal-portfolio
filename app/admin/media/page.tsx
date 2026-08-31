'use client';

import React, { useRef, useState } from 'react';
import { useGetMediaQuery, useAddMediaMutation, useDeleteMediaMutation } from '@/services/api';
import { useImageUpload } from '@/hooks/use-image-upload';
import type { MediaAsset } from '@/types';

const MediaPage: React.FC = () => {
  const { data: media = [] } = useGetMediaQuery();
  const [addMedia] = useAddMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();
  const [newAsset, setNewAsset] = useState<Partial<MediaAsset>>({ url: '', label: '', type: 'image' });
  const fileInput = useRef<HTMLInputElement>(null);
  const { uploadImage, deleteImage, isUploading, error } = useImageUpload('media');

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    try {
      const uploaded = await uploadImage(file);
      setNewAsset((prev) => ({ ...prev, url: uploaded.url, label: prev.label || uploaded.name.toUpperCase() }));
    } catch {
      /* surfaced by the hook */
    }
  };

  const list = media as MediaAsset[];

  const addAsset = async () => {
    if (!newAsset.url) return;
    await addMedia({ ...newAsset, dateAdded: new Date().toISOString() });
    setNewAsset({ url: '', label: '', type: 'image' });
  };

  const removeAsset = async (asset: MediaAsset) => {
    if (!window.confirm('PURGE_ASSET?')) return;
    await deleteMedia(asset._id);
    await deleteImage(asset.url);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-[#FF5F1F]">MEDIA_VAULT</h2>
      </header>

      <div className="bg-black text-white p-8 space-y-6">
        <h3 className="text-xl font-black uppercase tracking-widest">UPLOAD_NEW_ASSET</h3>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
        />

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
          onClick={() => fileInput.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInput.current?.click(); }}
          className="border-4 border-dashed border-white/40 p-8 flex items-center justify-center gap-4 cursor-pointer hover:border-[#FF5F1F] hover:bg-white/5 transition-colors"
        >
          {isUploading ? (
            <span className="font-black uppercase tracking-widest animate-pulse text-sm">UPLOADING...</span>
          ) : (
            <>
              <span className="flex items-center justify-center h-9 w-9 border-4 border-current text-xl leading-none">+</span>
              <span className="font-black uppercase tracking-widest text-xs">DROP_FILE / CLICK_TO_BROWSE</span>
            </>
          )}
        </div>

        {newAsset.url && (
          <div className="flex items-center gap-4 border-4 border-white p-3">
            <img src={newAsset.url} alt="" className="h-20 w-20 object-cover border-2 border-white" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 truncate flex-1">
              {newAsset.url}
            </span>
            <button
              onClick={() => setNewAsset({ url: '', label: '', type: 'image' })}
              className="px-4 py-2 border-2 border-white text-[10px] font-black uppercase hover:bg-[#FF5F1F]"
            >
              CLEAR
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <input value={newAsset.url} onChange={e => setNewAsset({ ...newAsset, url: e.target.value })} placeholder="ASSET_URL (OR PASTE A LINK)" className="bg-transparent border-b-4 border-white p-4 font-bold outline-none focus:border-[#FF5F1F]" />
           <input value={newAsset.label} onChange={e => setNewAsset({ ...newAsset, label: e.target.value })} placeholder="LABEL_NAME" className="bg-transparent border-b-4 border-white p-4 font-bold outline-none focus:border-[#FF5F1F] uppercase" />
        </div>

        {error && <p className="text-[10px] font-black uppercase tracking-widest text-[#FF5F1F]">{error}</p>}
        <button onClick={addAsset} className="w-full bg-[#FF5F1F] py-4 font-black uppercase hover:bg-white hover:text-[#FF5F1F] transition-all">INJECT_ASSET</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map(asset => (
          <div key={asset._id} className="relative aspect-square border-4 border-black group overflow-hidden">
             <img src={asset.url} alt={asset.label} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all scale-105 group-hover:scale-100" />
             <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                <span className="text-white text-[10px] font-black uppercase">{asset.label}</span>
                <button onClick={() => removeAsset(asset)} className="w-full bg-[#FF5F1F] text-white py-2 font-black text-xs uppercase hover:bg-white hover:text-black">PURGE</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPage;
