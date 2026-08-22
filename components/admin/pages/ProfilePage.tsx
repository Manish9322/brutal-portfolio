
import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';

const ProfilePage: React.FC = () => {
  const { data, updateData } = usePortfolio();

  const handleChange = (field: string, value: string) => {
    updateData({ profile: { ...data.profile, [field]: value } });
  };

  const updateSocialLink = (id: string, field: 'platform' | 'url', value: string) => {
    const updatedLinks = data.profile.socialLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    );
    updateData({ profile: { ...data.profile, socialLinks: updatedLinks } });
  };

  const addSocialLink = () => {
    const newLink = { id: Date.now().toString(), platform: 'NEW PLATFORM', url: 'https://' };
    updateData({ profile: { ...data.profile, socialLinks: [...data.profile.socialLinks, newLink] } });
  };

  const removeSocialLink = (id: string) => {
    const updatedLinks = data.profile.socialLinks.filter(link => link.id !== id);
    updateData({ profile: { ...data.profile, socialLinks: updatedLinks } });
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
            <label className="text-xs font-black uppercase tracking-widest opacity-50">{field.label}</label>
            <input 
              value={(data.profile as any)[field.key]}
              onChange={e => handleChange(field.key, e.target.value)}
              className="w-full border-4 border-black p-4 font-black text-xl uppercase focus:border-[#FF5F1F] outline-none"
            />
          </div>
        ))}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-black uppercase tracking-widest opacity-50">MANIFESTO LINE (HERO)</label>
          <textarea 
            value={data.profile.manifestoLine}
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
          {data.profile.socialLinks.map((link) => (
            <div key={link.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 border-4 border-black bg-gray-50">
              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40">PLATFORM</label>
                <input 
                  value={link.platform}
                  onChange={e => updateSocialLink(link.id, 'platform', e.target.value.toUpperCase())}
                  className="w-full border-2 border-black p-2 font-black text-sm uppercase outline-none focus:border-[#FF5F1F]"
                />
              </div>
              <div className="md:col-span-7 space-y-2">
                <label className="text-[10px] font-black uppercase opacity-40">TARGET_URL</label>
                <input 
                  value={link.url}
                  onChange={e => updateSocialLink(link.id, 'url', e.target.value)}
                  className="w-full border-2 border-black p-2 font-bold text-sm outline-none focus:border-[#FF5F1F]"
                />
              </div>
              <div className="md:col-span-2">
                <button 
                  onClick={() => removeSocialLink(link.id)}
                  className="w-full bg-red-500 text-white py-2 text-xs font-black uppercase hover:bg-black transition-colors"
                >
                  PURGE
                </button>
              </div>
            </div>
          ))}
          {data.profile.socialLinks.length === 0 && (
             <p className="text-center py-8 font-black uppercase opacity-20 border-4 border-dashed border-black">NO_SOCIAL_ASSETS_LINKED</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
