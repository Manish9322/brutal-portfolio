'use client';

import React from 'react';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '@/services/api';
import { useDebouncedDraft } from '@/hooks/use-debounced-draft';
import FileField from '@/components/admin/FileField';

const ProfilePage: React.FC = () => {
  const { data: remoteProfile } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const { data: remoteSettings } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const [profile, setProfile] = useDebouncedDraft<any>(remoteProfile, (draft) => {
    // Links added in the browser carry a placeholder id; drop it so Mongoose
    // mints a real ObjectId instead of rejecting the cast.
    updateProfile({
      ...draft,
      socialLinks: (draft.socialLinks ?? []).map(({ _id, ...rest }: any) =>
        typeof _id === 'string' && _id.startsWith('new-') ? rest : { _id, ...rest }
      ),
    });
  });

  // Footer resources live on the settings document but are edited here, beside
  // the rest of the identity fields.
  const [settings, setSettings] = useDebouncedDraft<any>(remoteSettings, (draft) => {
    updateSettings({
      ...draft,
      footerResources: (draft.footerResources ?? []).map(({ _id, ...rest }: any) =>
        typeof _id === 'string' && _id.startsWith('new-') ? rest : { _id, ...rest }
      ),
    });
  });

  if (!profile) {
    return <p className="font-black uppercase opacity-20 py-24 text-center">LOADING_IDENTITY...</p>;
  }

  const footerResources: any[] = settings?.footerResources ?? [];

  const updateResource = (id: string, patch: Record<string, string>) =>
    setSettings({
      ...settings,
      footerResources: footerResources.map((r) => (r._id === id ? { ...r, ...patch } : r)),
    });

  const addResource = () =>
    setSettings({
      ...settings,
      footerResources: [...footerResources, { _id: `new-${Date.now()}`, label: 'NEW_RESOURCE', url: '' }],
    });

  const removeResource = (id: string) =>
    setSettings({ ...settings, footerResources: footerResources.filter((r) => r._id !== id) });

  const socialLinks: any[] = profile.socialLinks ?? [];
  const telegramVisible = profile.telegramVisible !== false;

  const handleChange = (field: string, value: string | boolean) => {
    setProfile({ ...profile, [field]: value });
  };

  const updateSocialLink = (id: string, field: 'platform' | 'url', value: string) => {
    const updatedLinks = socialLinks.map((link) =>
      link._id === id ? { ...link, [field]: value } : link
    );
    setProfile({ ...profile, socialLinks: updatedLinks });
  };

  const addSocialLink = () => {
    const newLink = { _id: `new-${Date.now()}`, platform: 'NEW PLATFORM', url: 'https://' };
    setProfile({ ...profile, socialLinks: [...socialLinks, newLink] });
  };

  const removeSocialLink = (id: string) => {
    setProfile({ ...profile, socialLinks: socialLinks.filter((link) => link._id !== id) });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-[#FF5F1F]">MANAGE_CORE_IDENTITY</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { label: 'FIRST NAME', key: 'name' },
          { label: 'LAST NAME', key: 'lastName' },
          { label: 'STATUS', key: 'status' },
          { label: 'LOCATION', key: 'location' },
          { label: 'DISCIPLINE', key: 'discipline' },
          { label: 'CONTACT EMAIL', key: 'email' },
          { label: 'TELEGRAM HANDLE', key: 'telegram' },
        ].map(field => (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center justify-between gap-4 min-h-[22px]">
              <label className="text-xs font-black uppercase tracking-widest opacity-50">{field.label}</label>
              {field.key === 'telegram' && (
                <button
                  type="button"
                  onClick={() => handleChange('telegramVisible', !telegramVisible)}
                  aria-pressed={telegramVisible}
                  title="Toggle whether this shows in the contact section"
                  className={`px-3 py-1 border-2 border-black text-[10px] font-black uppercase tracking-widest transition-colors ${
                    telegramVisible
                      ? 'bg-[#FF5F1F] text-white hover:bg-black'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {telegramVisible ? 'SHOWN_ON_SITE' : 'HIDDEN'}
                </button>
              )}
            </div>
            <input
              value={profile[field.key] ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              className={`w-full border-4 border-black p-4 font-black text-xl uppercase focus:border-[#FF5F1F] outline-none ${
                field.key === 'telegram' && !telegramVisible ? 'opacity-40' : ''
              }`}
            />
          </div>
        ))}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-black uppercase tracking-widest opacity-50">MANIFESTO LINE (HERO)</label>
          <textarea
            value={profile.manifestoLine ?? ''}
            onChange={e => handleChange('manifestoLine', e.target.value)}
            rows={3}
            className="w-full border-4 border-black p-4 font-black text-xl uppercase focus:border-[#FF5F1F] outline-none"
          />
        </div>
      </div>

      <div className="space-y-8 pt-8 border-t-4 border-black">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black uppercase tracking-tighter">SOCIAL_CONNECTS</h3>
          <button
            onClick={addSocialLink}
            className="bg-black text-white px-6 py-2 text-xs font-black uppercase hover:bg-[#FF5F1F]"
          >
            ADD_LINK
          </button>
        </div>

        <div className="space-y-4">
          {socialLinks.map((link) => (
            <div key={link._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 border-4 border-black bg-gray-50">
              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40">PLATFORM</label>
                <input
                  value={link.platform}
                  onChange={e => updateSocialLink(link._id, 'platform', e.target.value.toUpperCase())}
                  className="w-full border-2 border-black p-2 font-black text-sm uppercase outline-none focus:border-[#FF5F1F]"
                />
              </div>
              <div className="md:col-span-7 space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40">TARGET_URL</label>
                <input
                  value={link.url}
                  onChange={e => updateSocialLink(link._id, 'url', e.target.value)}
                  className="w-full border-2 border-black p-2 font-bold text-sm outline-none focus:border-[#FF5F1F]"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={() => removeSocialLink(link._id)}
                  className="w-full bg-red-500 text-white py-2 text-xs font-black uppercase hover:bg-black transition-colors"
                >
                  PURGE
                </button>
              </div>
            </div>
          ))}
          {socialLinks.length === 0 && (
             <p className="text-center py-8 font-black uppercase opacity-20 border-4 border-dashed border-black">NO_SOCIAL_ASSETS_LINKED</p>
          )}
        </div>
      </div>

      <div className="space-y-8 pt-8 border-t-4 border-black">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">FOOTER_RESOURCES</h3>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest opacity-40">
              THE DOWNLOAD LINKS SHOWN IN THE SITE FOOTER
            </p>
          </div>
          <button
            onClick={addResource}
            className="bg-black text-white px-6 py-2 text-xs font-black uppercase hover:bg-[#FF5F1F] whitespace-nowrap"
          >
            ADD_RESOURCE
          </button>
        </div>

        {!settings ? (
          <p className="font-black uppercase opacity-20 py-8 text-center">LOADING_RESOURCES...</p>
        ) : (
          <div className="space-y-4">
            {footerResources.map((res) => (
              <div key={res._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-4 border-black bg-gray-50">
                <div className="md:col-span-4 space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40">LABEL</label>
                  <input
                    value={res.label ?? ''}
                    onChange={(e) => updateResource(res._id, { label: e.target.value.toUpperCase() })}
                    className="w-full border-2 border-black p-2 font-black text-sm uppercase outline-none focus:border-[#FF5F1F]"
                  />
                  <input
                    value={res.url ?? ''}
                    onChange={(e) => updateResource(res._id, { url: e.target.value })}
                    placeholder="OR PASTE A LINK"
                    className="w-full border-2 border-black p-2 font-bold text-[11px] outline-none focus:border-[#FF5F1F]"
                  />
                </div>
                <div className="md:col-span-6">
                  <FileField
                    label="FILE"
                    module="resources"
                    value={res.url ?? ''}
                    onChange={(url) => updateResource(res._id, { url })}
                  />
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={() => removeResource(res._id)}
                    className="w-full bg-red-500 text-white py-2 text-xs font-black uppercase hover:bg-black transition-colors"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
            {footerResources.length === 0 && (
              <p className="text-center py-8 font-black uppercase opacity-20 border-4 border-dashed border-black">
                NO_FOOTER_RESOURCES
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
