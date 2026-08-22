
import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';

const AdminSEO: React.FC = () => {
  const { data, updateData } = usePortfolio();

  const handleChange = (field: string, value: any) => {
    updateData({ seo: { ...data.seo, [field]: value } });
  };

  return (
    <div className="space-y-12">
      <header className="border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">SEO_METADATA</h2>
      </header>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase">META_TITLE</label>
          <input value={data.seo.metaTitle} onChange={e => handleChange('metaTitle', e.target.value)} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase">META_DESCRIPTION</label>
          <textarea value={data.seo.metaDescription} onChange={e => handleChange('metaDescription', e.target.value)} rows={3} className="w-full border-4 border-black p-4 font-bold text-lg outline-none focus:border-[#FF5F1F]" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase">OG_IMAGE_URL (SOCIAL PREVIEW)</label>
          <input value={data.seo.ogImage} onChange={e => handleChange('ogImage', e.target.value)} className="w-full border-4 border-black p-4 font-bold text-lg outline-none focus:border-[#FF5F1F]" />
          <div className="mt-4 aspect-video border-4 border-black overflow-hidden bg-gray-100">
             <img src={data.seo.ogImage} alt="OG Preview" className="w-full h-full object-cover grayscale" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase">KEYWORDS (COMMA SEPARATED)</label>
          <input 
            value={data.seo.keywords.join(', ')} 
            onChange={e => handleChange('keywords', e.target.value.split(',').map(s => s.trim()))} 
            className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSEO;
