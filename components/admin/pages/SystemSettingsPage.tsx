
import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';

const SystemSettingsPage: React.FC = () => {
  const { data, updateData } = usePortfolio();

  const handleAboutChange = (field: string, value: string) => {
    updateData({ about: { ...data.about, [field]: value } });
  };

  const handleSystemChange = (field: string, value: string) => {
    updateData({ systemInfo: { ...data.systemInfo, [field]: value } });
  };

  const updateResource = (id: string, field: 'label' | 'url', value: string) => {
    const updated = data.footerResources.map(res => 
      res.id === id ? { ...res, [field]: value } : res
    );
    updateData({ footerResources: updated });
  };

  const addResource = () => {
    const newRes = { id: Date.now().toString(), label: 'NEW_RESOURCE', url: '#' };
    updateData({ footerResources: [...data.footerResources, newRes] });
  };

  const removeResource = (id: string) => {
    updateData({ footerResources: data.footerResources.filter(r => r.id !== id) });
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      <header className="border-b-4 border-black pb-8">
        <h2 className="font-heading font-black text-6xl uppercase tracking-tighter text-[#FF5F1F]">GLOBAL_CONFIG</h2>
        <p className="mt-4 text-xl font-bold uppercase">SYSTEM-WIDE CONTENT PARAMETERS</p>
      </header>

      {/* About Manifesto Editor */}
      <section className="space-y-8">
        <h3 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-2">ABOUT_MANIFESTO</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50">MANIFESTO_HEADING</label>
            <input 
              value={data.about.manifestoHeading}
              onChange={e => handleAboutChange('manifestoHeading', e.target.value.toUpperCase())}
              className="w-full border-4 border-black p-4 font-black text-4xl uppercase focus:border-[#FF5F1F] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50">MANIFESTO_DESCRIPTION</label>
            <textarea 
              value={data.about.description}
              onChange={e => handleAboutChange('description', e.target.value)}
              rows={5}
              className="w-full border-4 border-black p-4 font-bold text-xl outline-none focus:border-[#FF5F1F]"
            />
          </div>
        </div>
      </section>

      {/* Footer Resources */}
      <section className="space-y-8">
        <div className="flex justify-between items-center border-b-4 border-black pb-2">
          <h3 className="text-3xl font-black uppercase tracking-tighter">FOOTER_RESOURCES</h3>
          <button onClick={addResource} className="bg-black text-white px-6 py-2 text-xs font-black uppercase hover:bg-[#FF5F1F]">ADD_RESOURCE</button>
        </div>
        <div className="space-y-4">
          {data.footerResources.map(res => (
            <div key={res.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 border-4 border-black bg-gray-50">
              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40">LABEL</label>
                <input 
                  value={res.label}
                  onChange={e => updateResource(res.id, 'label', e.target.value.toUpperCase())}
                  className="w-full border-2 border-black p-2 font-black text-sm uppercase outline-none focus:border-[#FF5F1F]"
                />
              </div>
              <div className="md:col-span-7 space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40">URL</label>
                <input 
                  value={res.url}
                  onChange={e => updateResource(res.id, 'url', e.target.value)}
                  className="w-full border-2 border-black p-2 font-bold text-sm outline-none focus:border-[#FF5F1F]"
                />
              </div>
              <div className="md:col-span-2">
                <button 
                  onClick={() => removeResource(res.id)}
                  className="w-full bg-red-500 text-white py-2 text-xs font-black uppercase hover:bg-black transition-colors"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* System Marquee & Version */}
      <section className="space-y-8">
        <h3 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-2">SYSTEM_INFO</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="md:col-span-1 space-y-2">
             <label className="text-[10px] font-black uppercase opacity-50">VERSION</label>
             <input 
               value={data.systemInfo.version}
               onChange={e => handleSystemChange('version', e.target.value)}
               className="w-full border-4 border-black p-4 font-black text-xl outline-none focus:border-[#FF5F1F]"
             />
           </div>
           <div className="md:col-span-3 space-y-2">
             <label className="text-[10px] font-black uppercase opacity-50">MARQUEE_TEXT</label>
             <input 
               value={data.systemInfo.marqueeText}
               onChange={e => handleSystemChange('marqueeText', e.target.value.toUpperCase())}
               className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]"
             />
           </div>
        </div>
      </section>
    </div>
  );
};

export default SystemSettingsPage;
