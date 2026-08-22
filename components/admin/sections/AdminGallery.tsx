
import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { GalleryItem } from '../../../types';

const AdminGallery: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({});

  const handleEdit = (item: GalleryItem) => {
    setEditing(item.id);
    setFormData(item);
  };

  const handleSave = () => {
    let newList;
    if (editing === 'new') {
      const newItem = { ...formData, id: Date.now().toString(), order: data.gallery.length + 1, visible: true } as GalleryItem;
      newList = [...data.gallery, newItem];
    } else {
      newList = data.gallery.map(i => i.id === editing ? { ...i, ...formData } : i);
    }
    updateData({ gallery: newList });
    setEditing(null);
  };

  const deleteItem = (id: string) => {
    if (window.confirm('PURGE_IMAGE?')) {
      updateData({ gallery: data.gallery.filter(i => i.id !== id) });
    }
  };

  const move = (idx: number, dir: 'up' | 'down') => {
    const list = [...data.gallery].sort((a,b) => a.order - b.order);
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= list.length) return;
    
    // Swap orders
    const tempOrder = list[idx].order;
    list[idx].order = list[target].order;
    list[target].order = tempOrder;
    
    updateData({ gallery: list });
  };

  if (editing) {
    return (
      <div className="space-y-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b-4 border-black pb-4">
          <h3 className="text-4xl font-black uppercase tracking-tighter">GALLERY_ASSET_CFG</h3>
          <button onClick={() => setEditing(null)} className="font-black hover:text-[#FF5F1F]">X_EXIT</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase">IMG_URL</label>
             <input value={formData.url || ''} onChange={e => setFormData({ ...formData, url: e.target.value })} className="w-full border-4 border-black p-4 font-bold outline-none focus:border-[#FF5F1F]" />
             {formData.url && <div className="mt-4 aspect-square border-4 border-black overflow-hidden"><img src={formData.url} alt="Preview" className="w-full h-full object-cover" /></div>}
           </div>
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
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">GALLERY</h2>
        <button onClick={() => { setEditing('new'); setFormData({ caption: '' }); }} className="bg-black text-white px-8 py-4 font-black uppercase hover:bg-[#FF5F1F]">NEW_ENTRY</button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {data.gallery.sort((a,b) => a.order - b.order).map((item, i) => (
          <div key={item.id} className={`p-4 border-4 border-black flex justify-between items-center bg-white ${!item.visible ? 'opacity-30' : ''}`}>
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
                <button onClick={() => updateData({ gallery: data.gallery.map(g => g.id === item.id ? { ...g, visible: !g.visible } : g) })} className={`px-4 py-2 border-2 border-black text-[10px] font-black ${item.visible ? 'bg-green-100' : 'bg-red-100'}`}>
                  {item.visible ? 'LIVE' : 'HIDDEN'}
                </button>
                <button onClick={() => handleEdit(item)} className="px-6 py-2 bg-black text-white font-black text-xs uppercase hover:bg-[#FF5F1F]">EDIT</button>
                <button onClick={() => deleteItem(item.id)} className="px-4 py-2 border-2 border-black text-red-600 font-black">X</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
