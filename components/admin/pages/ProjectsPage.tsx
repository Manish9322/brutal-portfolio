
import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Project } from '../../../types';

const ProjectsPage: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const handleEdit = (project: Project) => {
    setEditing(project.id);
    setFormData(project);
  };

  const handleSave = () => {
    let newProjects;
    if (editing === 'new') {
      const newProject = { ...formData, id: Date.now().toString(), visible: true } as Project;
      newProjects = [...data.projects, newProject];
    } else {
      newProjects = data.projects.map(p => p.id === editing ? { ...p, ...formData } : p);
    }
    updateData({ projects: newProjects });
    setEditing(null);
  };

  const toggleVisible = (id: string) => {
    updateData({ projects: data.projects.map(p => p.id === id ? { ...p, visible: !p.visible } : p) });
  };

  const move = (idx: number, dir: 'up' | 'down') => {
    const list = [...data.projects];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= list.length) return;
    [list[idx], list[target]] = [list[target], list[idx]];
    updateData({ projects: list });
  };

  if (editing) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right-10 duration-300">
        <div className="flex justify-between items-center border-b-4 border-black pb-4">
          <h3 className="text-4xl font-black uppercase tracking-tighter">PROJECT_V1_CONFIG</h3>
          <button onClick={() => setEditing(null)} className="font-black hover:text-[#FF5F1F]">X_ABORT</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase">TITLE</label>
            <input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase">CATEGORY</label>
            <input value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase">IMG_SOURCE</label>
            <input value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full border-4 border-black p-4 font-bold text-lg outline-none focus:border-[#FF5F1F]" />
            {formData.image && <div className="mt-4 border-4 border-black aspect-video overflow-hidden"><img src={formData.image} alt="Preview" className="w-full h-full object-cover grayscale" /></div>}
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase">TECH_STACK (COMMA SEP)</label>
            <input value={formData.techStack?.join(', ') || ''} onChange={e => setFormData({ ...formData, techStack: e.target.value.split(',').map(s => s.trim().toUpperCase()) })} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase">INTEL_LOG</label>
            <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full border-4 border-black p-4 font-bold text-lg outline-none focus:border-[#FF5F1F]" />
          </div>
        </div>
        <button onClick={handleSave} className="w-full bg-black text-white py-8 text-2xl font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-all">COMMIT_TO_SYSTEM</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">PROJECTS</h2>
        <button onClick={() => { setEditing('new'); setFormData({ techStack: [], year: '2024' }); }} className="bg-black text-white px-8 py-4 font-black hover:bg-[#FF5F1F]">NEW_ASSET</button>
      </div>
      <div className="divide-y-4 divide-black border-4 border-black">
        {data.projects.map((p, i) => (
          <div key={p.id} className={`p-6 flex justify-between items-center bg-white ${!p.visible ? 'opacity-30' : ''}`}>
            <div className="flex gap-4 items-center">
               <div className="w-16 h-16 border-2 border-black overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={p.image} className="w-full h-full object-cover grayscale" alt="" />
               </div>
               <div>
                 <span className="text-[10px] font-black text-[#FF5F1F] uppercase">{p.category}</span>
                 <h4 className="text-2xl font-black uppercase">{p.title}</h4>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => move(i, 'up')} className="p-2 border-2 border-black">↑</button>
               <button onClick={() => move(i, 'down')} className="p-2 border-2 border-black">↓</button>
               <button onClick={() => toggleVisible(p.id)} className={`px-4 py-2 border-2 border-black text-[10px] font-black uppercase ${p.visible ? 'bg-green-100' : 'bg-red-100'}`}>{p.visible ? 'VISIBLE' : 'HIDDEN'}</button>
               <button onClick={() => handleEdit(p)} className="px-6 py-2 bg-black text-white font-black uppercase text-xs hover:bg-[#FF5F1F]">EDIT</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
