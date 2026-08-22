
import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Education } from '../../../types';

const EducationPage: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({});

  const handleEdit = (edu: Education) => {
    setEditing(edu.id);
    setFormData(edu);
  };

  const handleSave = () => {
    let newList;
    if (editing === 'new') {
      const newItem = { ...formData, id: Date.now().toString(), visible: true } as Education;
      newList = [...data.education, newItem];
    } else {
      // Fixed reference error: changed 'i' to 'e' to match the map callback parameter
      newList = data.education.map(e => e.id === editing ? { ...e, ...formData } : e);
    }
    updateData({ education: newList });
    setEditing(null);
  };

  const deleteItem = (id: string) => {
    if (window.confirm('WIPE_HISTORY?')) {
      updateData({ education: data.education.filter(e => e.id !== id) });
    }
  };

  if (editing) {
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex justify-between items-center border-b-4 border-black pb-4">
          <h3 className="text-4xl font-black uppercase tracking-tighter">EDIT_EDUCATION</h3>
          <button onClick={() => setEditing(null)} className="font-black hover:text-[#FF5F1F]">BACK</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50">DEGREE/PROGRAM</label>
            <input value={formData.degree || ''} onChange={e => setFormData({ ...formData, degree: e.target.value })} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50">INSTITUTION</label>
            <input value={formData.institution || ''} onChange={e => setFormData({ ...formData, institution: e.target.value })} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50">YEAR</label>
            <input value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50">DETAILS</label>
            <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full border-4 border-black p-4 font-bold text-lg outline-none focus:border-[#FF5F1F]" />
          </div>
        </div>
        <button onClick={handleSave} className="w-full bg-black text-white py-8 text-2xl font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-colors">UPDATE_TRANSCRIPT</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">ACADEMIC_RECORD</h2>
        <button onClick={() => { setEditing('new'); setFormData({}); }} className="bg-[#FF5F1F] text-white px-8 py-4 font-black uppercase hover:bg-black">ADD_EDU</button>
      </div>
      <div className="space-y-4">
        {data.education.map((edu) => (
          <div key={edu.id} className="border-4 border-black p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
            <div>
              <p className="text-xs font-black text-[#FF5F1F]">{edu.year}</p>
              <h4 className="text-2xl font-black uppercase">{edu.degree}</h4>
              <p className="font-bold opacity-70">{edu.institution}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(edu)} className="px-6 py-3 border-4 border-black font-black uppercase hover:bg-black hover:text-white transition-all">EDIT</button>
              <button onClick={() => deleteItem(edu.id)} className="px-6 py-3 border-4 border-black font-black uppercase hover:bg-red-500 hover:text-white transition-all">X</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationPage;
