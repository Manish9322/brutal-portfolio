
import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { MediaAsset } from '../../../types';

const AdminMedia: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const [newAsset, setNewAsset] = useState<Partial<MediaAsset>>({ url: '', label: '', type: 'image' });

  const addAsset = () => {
    if (!newAsset.url) return;
    const asset = { ...newAsset, id: Date.now().toString(), dateAdded: new Date().toISOString() } as MediaAsset;
    updateData({ media: [...data.media, asset] });
    setNewAsset({ url: '', label: '', type: 'image' });
  };

  const removeAsset = (id: string) => {
    updateData({ media: data.media.filter(m => m.id !== id) });
  };

  return (
    <div className="space-y-12">
      <header className="border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">MEDIA_VAULT</h2>
      </header>

      <div className="bg-black text-white p-8 space-y-6">
        <h3 className="text-xl font-black uppercase tracking-widest">UPLOAD_NEW_ASSET</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <input value={newAsset.url} onChange={e => setNewAsset({ ...newAsset, url: e.target.value })} placeholder="ASSET_URL (BASE64 OR DIRECT LINK)" className="bg-transparent border-b-4 border-white p-4 font-bold outline-none focus:border-[#FF5F1F]" />
           <input value={newAsset.label} onChange={e => setNewAsset({ ...newAsset, label: e.target.value })} placeholder="LABEL_NAME" className="bg-transparent border-b-4 border-white p-4 font-bold outline-none focus:border-[#FF5F1F] uppercase" />
        </div>
        <button onClick={addAsset} className="w-full bg-[#FF5F1F] py-4 font-black uppercase hover:bg-white hover:text-[#FF5F1F] transition-all">INJECT_ASSET</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.media.map(asset => (
          <div key={asset.id} className="relative aspect-square border-4 border-black group overflow-hidden">
             <img src={asset.url} alt={asset.label} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all scale-105 group-hover:scale-100" />
             <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                <span className="text-white text-[10px] font-black uppercase">{asset.label}</span>
                <button onClick={() => removeAsset(asset.id)} className="w-full bg-[#FF5F1F] text-white py-2 font-black text-xs uppercase hover:bg-white hover:text-black">PURGE</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMedia;
