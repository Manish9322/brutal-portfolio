
import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';

const AdminProfile: React.FC = () => {
  const { data, updateData } = usePortfolio();

  const handleChange = (field: string, value: string) => {
    updateData({ profile: { ...data.profile, [field]: value } });
  };

  return (
    <div className="space-y-12">
      <header className="border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase">CORE_PROFILE</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { label: 'FIRST NAME', key: 'name' },
          { label: 'LAST NAME', key: 'lastName' },
          { label: 'STATUS', key: 'status' },
          { label: 'LOCATION', key: 'location' },
          { label: 'DISCIPLINE', key: 'discipline' },
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
    </div>
  );
};

export default AdminProfile;
