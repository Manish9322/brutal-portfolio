'use client';

import React, { useState } from 'react';
import {
  useGetGalleryQuery,
  useAddGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useUpdateGalleryOrderMutation,
} from '@/services/api';
import ImageField from '@/components/admin/ImageField';
import type { GalleryItem } from '@/types';

const GalleryPage: React.FC = () => {
  const { data: gallery = [] } = useGetGalleryQuery();
  const [addGalleryItem] = useAddGalleryItemMutation();
  const [updateGalleryItem] = useUpdateGalleryItemMutation();
  const [deleteGalleryItem] = useDeleteGalleryItemMutation();
  const [updateGalleryOrder] = useUpdateGalleryOrderMutation();

  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({});

  const list = (gallery as GalleryItem[]).slice().sort((a, b) => a.order - b.order);

  const handleEdit = (item: GalleryItem) => {
    setEditing(item._id);
    setFormData(item);
  };

  const handleSave = async () => {
    if (editing === 'new') {
      await addGalleryItem({ ...formData, visible: true });
    } else {
      await updateGalleryItem({ ...formData, _id: editing });
    }
    setEditing(null);
  };

  const deleteItem = (_id: string) => {
    if (window.confirm('PURGE_IMAGE?')) {
      deleteGalleryItem(_id);
    }
  };

  const move = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= list.length) return;

    const reordered = [...list];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    updateGalleryOrder({ orderedIds: reordered.map((g) => g._id) });
  };

  if (editing) {
    return (
      <div className="space-y-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b-4 border-black pb-4">
          <h3 className="text-4xl font-black uppercase tracking-tighter">GALLERY_ASSET_CFG</h3>
          <button onClick={() => setEditing(null)} className="font-black hover:text-[#FF5F1F]">X_EXIT</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <ImageField
             label="FRAME_IMAGE"
             module="gallery"
             aspect="square"
             value={formData.url || ''}
             onChange={(url) => setFormData({ ...formData, url })}
           />
           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase">CAPTION (STRICT_TEXT)</label>
             <textarea value={formData.caption || ''} onChange={e => setFormData({ ...formData, caption: e.target.value })} rows={6} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
           </div>
        </div>
        <button onClick={handleSave} className="w-full bg-black text-white py-8 text-2xl font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-all">SYNC_VAULT</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">GALLERY_ASSETS</h2>
        <button onClick={() => { setEditing('new'); setFormData({ caption: '' }); }} className="bg-black text-white px-8 py-4 font-black uppercase hover:bg-[#FF5F1F]">NEW_ENTRY</button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {list.map((item, i) => (
          <div key={item._id} className={`p-4 border-4 border-black flex justify-between items-center bg-white ${!item.visible ? 'opacity-30' : ''}`}>
             <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-black overflow-hidden"><img src={item.url} className="w-full h-full object-cover" alt="" /></div>
                <div className="max-w-md">
                   <p className="text-xs font-black uppercase truncate">{item.caption}</p>
                   <span className="text-[10px] font-bold opacity-40">POS: {item.order}</span>
                </div>
             </div>
             <div className="flex gap-2">
                <button onClick={() => move(i, 'up')} className="p-2 border-2 border-black">↑</button>
                <button onClick={() => move(i, 'down')} className="p-2 border-2 border-black">↓</button>
                <button onClick={() => updateGalleryItem({ _id: item._id, visible: !item.visible })} className={`px-4 py-2 border-2 border-black text-[10px] font-black ${item.visible ? 'bg-green-100' : 'bg-red-100'}`}>
                  {item.visible ? 'LIVE' : 'HIDDEN'}
                </button>
                <button onClick={() => handleEdit(item)} className="px-6 py-2 bg-black text-white font-black text-xs uppercase hover:bg-[#FF5F1F]">EDIT</button>
                <button onClick={() => deleteItem(item._id)} className="px-4 py-2 border-2 border-black text-red-600 font-black">X</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
