
import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Testimonial } from '../../../types';

const TestimonialsPage: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});

  const handleEdit = (item: Testimonial) => {
    setEditing(item.id);
    setFormData(item);
  };

  const handleSave = () => {
    let newList;
    if (editing === 'new') {
      const newItem = { ...formData, id: Date.now().toString(), order: data.testimonials.length + 1, isFeatured: false, visible: true } as Testimonial;
      newList = [...data.testimonials, newItem];
    } else {
      newList = data.testimonials.map(t => t.id === editing ? { ...t, ...formData } : t);
    }
    updateData({ testimonials: newList });
    setEditing(null);
  };

  const toggleVisible = (id: string) => {
    updateData({ testimonials: data.testimonials.map(t => t.id === id ? { ...t, visible: !t.visible } : t) });
  };

  const deleteItem = (id: string) => {
    if (window.confirm('DELETE_CREDIBILITY_ENTRY?')) {
      updateData({ testimonials: data.testimonials.filter(t => t.id !== id) });
    }
  };

  const move = (idx: number, dir: 'up' | 'down') => {
    const list = [...data.testimonials].sort((a,b) => a.order - b.order);
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= list.length) return;
    
    const tempOrder = list[idx].order;
    list[idx].order = list[target].order;
    list[target].order = tempOrder;
    
    updateData({ testimonials: list });
  };

  if (editing) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
        <div className="flex justify-between items-center border-b-4 border-black pb-4">
          <h3 className="text-4xl font-black uppercase tracking-tighter">{editing === 'new' ? 'NEW_TESTIMONIAL' : 'EDIT_QUOTE'}</h3>
          <button onClick={() => setEditing(null)} className="font-black hover:text-[#FF5F1F]">CLOSE_FORM</button>
        </div>
        <div className="space-y-6">
           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase">QUOTE_CONTENT</label>
             <textarea value={formData.quote || ''} onChange={e => setFormData({ ...formData, quote: e.target.value.toUpperCase() })} rows={4} className="w-full border-4 border-black p-4 font-black text-2xl uppercase outline-none focus:border-[#FF5F1F]" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase">AUTHOR_NAME</label>
               <input value={formData.author || ''} onChange={e => setFormData({ ...formData, author: e.target.value.toUpperCase() })} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase">AUTHOR_ROLE</label>
               <input value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value.toUpperCase() })} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase">PROJECT_REFERENCE</label>
               <input value={formData.projectRef || ''} onChange={e => setFormData({ ...formData, projectRef: e.target.value.toUpperCase() })} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
             </div>
             <div className="flex items-end">
                <button 
                  onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                  className={`w-full py-4 border-4 border-black font-black uppercase ${formData.isFeatured ? 'bg-[#FF5F1F] text-white' : 'bg-white text-black'}`}
                >
                  {formData.isFeatured ? 'FEATURED_ACTIVE' : 'MAKE_FEATURED'}
                </button>
             </div>
           </div>
        </div>
        <button onClick={handleSave} className="w-full bg-black text-white py-8 text-2xl font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-all">PERSIST_QUOTE</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-[#FF5F1F]">SOCIAL_PROOF</h2>
        <button onClick={() => { setEditing('new'); setFormData({}); }} className="bg-black text-white px-8 py-4 font-black hover:bg-[#FF5F1F]">NEW_QUOTE</button>
      </div>
      <div className="space-y-6">
        {data.testimonials.sort((a,b) => a.order - b.order).map((t, idx) => (
          <div key={t.id} className={`border-4 border-black p-6 bg-white hover:bg-gray-50 transition-colors ${!t.visible ? 'opacity-30' : ''}`}>
            <div className="flex justify-between items-start mb-4">
               <div className="space-y-1">
                  <h4 className="text-2xl font-black uppercase tracking-tighter">{t.author}</h4>
                  <p className="text-xs font-bold opacity-60 uppercase">{t.role} @ {t.projectRef}</p>
               </div>
               <div className="flex gap-2">
                 {t.isFeatured && <span className="bg-[#FF5F1F] text-white px-2 py-1 text-[10px] font-black">FEATURED</span>}
                 <span className="text-[10px] font-black opacity-40">ORDER: {t.order}</span>
               </div>
            </div>
            <p className="text-lg font-bold uppercase italic mb-6">"{t.quote}"</p>
            <div className="flex gap-2">
               <button onClick={() => move(idx, 'up')} className="p-2 border-2 border-black hover:bg-gray-100">↑</button>
               <button onClick={() => move(idx, 'down')} className="p-2 border-2 border-black hover:bg-gray-100">↓</button>
               <button onClick={() => toggleVisible(t.id)} className={`px-4 py-2 border-2 border-black text-[10px] font-black uppercase ${t.visible ? 'bg-green-100' : 'bg-red-100'}`}>{t.visible ? 'VISIBLE' : 'HIDDEN'}</button>
               <button onClick={() => handleEdit(t)} className="px-6 py-2 bg-black text-white font-black text-xs uppercase hover:bg-[#FF5F1F]">EDIT</button>
               <button onClick={() => deleteItem(t.id)} className="px-6 py-2 border-4 border-black font-black text-xs uppercase hover:bg-red-500 hover:text-white">DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsPage;
