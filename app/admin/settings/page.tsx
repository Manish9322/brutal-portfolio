'use client';

import React from 'react';
import {
  useGetAboutQuery,
  useUpdateAboutMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '@/services/api';
import { useDebouncedDraft } from '@/hooks/use-debounced-draft';

const SystemSettingsPage: React.FC = () => {
  const { data: remoteAbout } = useGetAboutQuery();
  const { data: remoteSettings } = useGetSettingsQuery();
  const [updateAbout] = useUpdateAboutMutation();
  const [updateSettings] = useUpdateSettingsMutation();

  const [about, setAbout] = useDebouncedDraft<any>(remoteAbout, (draft) => {
    updateAbout(draft);
  });

  const [settings, setSettings] = useDebouncedDraft<any>(remoteSettings, (draft) => {
    // Resources added in the browser carry a placeholder id; drop it so Mongoose
    // mints a real ObjectId instead of rejecting the cast.
    updateSettings({
      ...draft,
      footerResources: (draft.footerResources ?? []).map(({ _id, ...rest }: any) =>
        typeof _id === 'string' && _id.startsWith('new-') ? rest : { _id, ...rest }
      ),
    });
  });

  if (!about || !settings) {
    return <p className="font-black uppercase opacity-20 py-24 text-center">LOADING_CONFIG...</p>;
  }


  const handleAboutChange = (field: string, value: string) => {
    setAbout({ ...about, [field]: value });
  };

  const handleSystemChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value });
  };




  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      <header className="border-b-4 border-black pb-8">
        <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-[#FF5F1F]">GLOBAL_CONFIG</h2>
        <p className="mt-4 text-xl font-bold uppercase">SYSTEM-WIDE CONTENT PARAMETERS</p>
      </header>

      {/* About Manifesto Editor */}
      <section className="space-y-8">
        <h3 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-2">ABOUT_MANIFESTO</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50">MANIFESTO_HEADING</label>
            <input
              value={about.manifestoHeading ?? ''}
              onChange={e => handleAboutChange('manifestoHeading', e.target.value.toUpperCase())}
              className="w-full border-4 border-black p-4 font-black text-4xl uppercase focus:border-[#FF5F1F] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50">MANIFESTO_DESCRIPTION</label>
            <textarea
              value={about.description ?? ''}
              onChange={e => handleAboutChange('description', e.target.value)}
              rows={5}
              className="w-full border-4 border-black p-4 font-bold text-xl outline-none focus:border-[#FF5F1F]"
            />
          </div>
        </div>
      </section>

      {/* Footer resources moved to /admin/profile, beside the identity fields. */}

      {/* System Marquee & Version */}
      <section className="space-y-8">
        <h3 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-2">SYSTEM_INFO</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="md:col-span-1 space-y-2">
             <label className="text-[10px] font-black uppercase opacity-50">VERSION</label>
             <input
               value={settings.version ?? ''}
               onChange={e => handleSystemChange('version', e.target.value)}
               className="w-full border-4 border-black p-4 font-black text-xl outline-none focus:border-[#FF5F1F]"
             />
           </div>
           <div className="md:col-span-3 space-y-2">
             <label className="text-[10px] font-black uppercase opacity-50">MARQUEE_TEXT</label>
             <input
               value={settings.marqueeText ?? ''}
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
