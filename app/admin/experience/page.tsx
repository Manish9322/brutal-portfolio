'use client';

import React, { useState } from 'react';
import {
  useGetExperiencesQuery,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useUpdateExperienceOrderMutation,
} from '@/services/api';
import type { Experience } from '@/types';

const ExperiencePage: React.FC = () => {
  const { data: experiences = [] } = useGetExperiencesQuery();
  const [addExperience] = useAddExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [updateExperienceOrder] = useUpdateExperienceOrderMutation();

  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({});

  const list = experiences as Experience[];

  const handleEdit = (exp: Experience) => {
    setEditing(exp._id);
    setFormData(exp);
  };

  const handleSave = async () => {
    if (editing === 'new') {
      await addExperience({ ...formData, visible: true });
    } else {
      await updateExperience({ ...formData, _id: editing });
    }
    setEditing(null);
  };

  const toggleVisible = (exp: Experience) => {
    updateExperience({ _id: exp._id, visible: !exp.visible });
  };

  const move = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const reordered = [...list];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    updateExperienceOrder({ orderedIds: reordered.map((e) => e._id) });
  };

  if (editing) {
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex justify-between items-center border-b-4 border-black pb-4">
          <h3 className="text-4xl font-black uppercase tracking-tighter">{editing === 'new' ? 'NEW_EXPERIENCE' : 'EDIT_EXPERIENCE'}</h3>
          <button onClick={() => setEditing(null)} className="font-black hover:text-[#FF5F1F]">CANCEL</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase">ROLE TITLE</label>
            <input
              value={formData.role || ''}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="w-full border-4 border-black p-4 font-bold text-xl uppercase focus:border-[#FF5F1F] outline-none"
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-black uppercase">COMPANY</label>
            <input
              value={formData.company || ''}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              className="w-full border-4 border-black p-4 font-bold text-xl uppercase focus:border-[#FF5F1F] outline-none"
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-black uppercase">PERIOD</label>
            <input
              value={formData.period || ''}
              onChange={e => setFormData({ ...formData, period: e.target.value })}
              className="w-full border-4 border-black p-4 font-bold text-xl uppercase focus:border-[#FF5F1F] outline-none"
            />
          </div>
          <div className="space-y-4 md:col-span-2">
            <label className="text-xs font-black uppercase">DESCRIPTION</label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border-4 border-black p-4 font-bold text-lg focus:border-[#FF5F1F] outline-none"
            />
          </div>
        </div>
        <button onClick={handleSave} className="w-full bg-[#FF5F1F] text-white py-8 text-2xl font-black uppercase tracking-widest hover:bg-black transition-all">
          PERSIST_STATE
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">EXPERIENCE_LOG</h2>
        <button onClick={() => { setEditing('new'); setFormData({}); }} className="bg-black text-white px-8 py-4 font-black uppercase hover:bg-[#FF5F1F]">ADD_NEW</button>
      </div>
      <div className="divide-y-4 divide-black border-4 border-black">
        {list.map((exp, idx) => (
          <div key={exp._id} className={`p-6 flex justify-between items-center ${!exp.visible ? 'opacity-30' : ''}`}>
            <div>
              <p className="text-xs font-black text-[#FF5F1F]">{exp.period}</p>
              <h4 className="text-2xl font-black uppercase">{exp.role} @ {exp.company}</h4>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => move(idx, 'up')} className="p-2 border-2 border-black hover:bg-gray-100">↑</button>
               <button onClick={() => move(idx, 'down')} className="p-2 border-2 border-black hover:bg-gray-100">↓</button>
               <button onClick={() => toggleVisible(exp)} className={`p-2 border-2 border-black uppercase text-xs font-black ${exp.visible ? 'bg-green-100' : 'bg-red-100'}`}>{exp.visible ? 'HIDE' : 'SHOW'}</button>
               <button onClick={() => handleEdit(exp)} className="px-4 py-2 bg-black text-white text-xs font-black uppercase hover:bg-[#FF5F1F]">EDIT</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperiencePage;
