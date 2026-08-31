'use client';

import React from 'react';
import { useGetSeoQuery, useUpdateSeoMutation } from '@/services/api';
import { useDebouncedDraft } from '@/hooks/use-debounced-draft';
import ImageField from '@/components/admin/ImageField';

const SEOPage: React.FC = () => {
  const { data: remoteSeo } = useGetSeoQuery();
  const [updateSeo] = useUpdateSeoMutation();
  const [seo, setSeo] = useDebouncedDraft<any>(remoteSeo, (draft) => {
    updateSeo(draft);
  });

  if (!seo) {
    return <p className="font-black uppercase opacity-20 py-24 text-center">LOADING_METADATA...</p>;
  }

  const handleChange = (field: string, value: any) => {
    setSeo({ ...seo, [field]: value });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">SEARCH_OPTIMIZATION</h2>
      </header>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase">META_TITLE</label>
          <input value={seo.metaTitle ?? ''} onChange={e => handleChange('metaTitle', e.target.value)} className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase">META_DESCRIPTION</label>
          <textarea value={seo.metaDescription ?? ''} onChange={e => handleChange('metaDescription', e.target.value)} rows={3} className="w-full border-4 border-black p-4 font-bold text-lg outline-none focus:border-[#FF5F1F]" />
        </div>
        <ImageField
          label="OG_IMAGE (SOCIAL PREVIEW)"
          module="seo"
          value={seo.ogImage ?? ''}
          onChange={(url) => handleChange('ogImage', url)}
        />
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase">KEYWORDS (COMMA SEPARATED)</label>
          <input
            value={(seo.keywords ?? []).join(', ')}
            onChange={e => handleChange('keywords', e.target.value.split(',').map((s: string) => s.trim()))}
            className="w-full border-4 border-black p-4 font-black text-xl uppercase outline-none focus:border-[#FF5F1F]"
          />
        </div>
      </div>
    </div>
  );
};

export default SEOPage;
