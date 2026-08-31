'use client';

import React, { useEffect, useState } from 'react';
import { useGetSkillsQuery, useUpdateSkillMutation } from '@/services/api';
import type { Skill } from '@/types';

const SkillsPage: React.FC = () => {
  const { data: skills = [] } = useGetSkillsQuery();
  const [updateSkill] = useUpdateSkillMutation();
  const [newSkill, setNewSkill] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const list = skills as Skill[];
  const activeGroup = list.find((s) => s._id === activeCategoryId) ?? list[0];

  // Select the first category once the collection arrives.
  useEffect(() => {
    if (!activeCategoryId && list.length > 0) setActiveCategoryId(list[0]._id);
  }, [list, activeCategoryId]);

  const addSkill = () => {
    if (!newSkill || !activeGroup) return;
    updateSkill({ _id: activeGroup._id, items: [...activeGroup.items, newSkill.toUpperCase()] });
    setNewSkill('');
  };

  const removeSkill = (group: Skill, skill: string) => {
    updateSkill({ _id: group._id, items: group.items.filter((i) => i !== skill) });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">TECHNICAL_RESOURCES</h2>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-4">
          <label className="text-[10px] font-black uppercase">SELECT CATEGORY</label>
          <div className="flex flex-col divide-y-4 divide-black border-4 border-black">
            {list.map(s => (
              <button
                key={s._id}
                onClick={() => setActiveCategoryId(s._id)}
                className={`p-4 text-left font-black uppercase tracking-widest ${activeGroup?._id === s._id ? 'bg-[#FF5F1F] text-white' : 'hover:bg-gray-100'}`}
              >
                {s.category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              placeholder="ENTER NEW SKILL..."
              className="flex-1 border-4 border-black p-4 font-black text-xl uppercase focus:border-[#FF5F1F] outline-none"
            />
            <button onClick={addSkill} className="bg-black text-white px-8 font-black uppercase hover:bg-[#FF5F1F]">PUSH</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {activeGroup?.items.map(skill => (
              <div key={skill} className="p-4 border-4 border-black flex justify-between items-center group bg-white">
                <span className="font-black uppercase tracking-tighter">{skill}</span>
                <button onClick={() => removeSkill(activeGroup, skill)} className="text-[#FF5F1F] font-black hover:scale-125 transition-transform">X</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
