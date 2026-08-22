
import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Skill } from '../../../types';

const AdminSkills: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const [newSkill, setNewSkill] = useState('');
  const [activeCategory, setActiveCategory] = useState(data.skills[0]?.category || '');

  const addSkill = () => {
    if (!newSkill) return;
    const updated = data.skills.map(s => 
      s.category === activeCategory ? { ...s, items: [...s.items, newSkill.toUpperCase()] } : s
    );
    updateData({ skills: updated });
    setNewSkill('');
  };

  const removeSkill = (category: string, skill: string) => {
    const updated = data.skills.map(s => 
      s.category === category ? { ...s, items: s.items.filter(i => i !== skill) } : s
    );
    updateData({ skills: updated });
  };

  return (
    <div className="space-y-12">
      <header className="border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">TECHNICAL_RESOURCES</h2>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-4">
          <label className="text-[10px] font-black uppercase">SELECT CATEGORY</label>
          <div className="flex flex-col divide-y-4 divide-black border-4 border-black">
            {data.skills.map(s => (
              <button 
                key={s.category}
                onClick={() => setActiveCategory(s.category)}
                className={`p-4 text-left font-black uppercase tracking-widest ${activeCategory === s.category ? 'bg-[#FF5F1F] text-white' : 'hover:bg-gray-100'}`}
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
            {data.skills.find(s => s.category === activeCategory)?.items.map(skill => (
              <div key={skill} className="p-4 border-4 border-black flex justify-between items-center group bg-white">
                <span className="font-black uppercase tracking-tighter">{skill}</span>
                <button onClick={() => removeSkill(activeCategory, skill)} className="text-[#FF5F1F] font-black hover:scale-125 transition-transform">X</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;
