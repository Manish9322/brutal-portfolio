
import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';

const DashboardPage: React.FC = () => {
  const { data } = usePortfolio();
  const unreadCount = data.messages.filter(m => !m.read).length;

  const stats = [
    { label: 'PROJECTS', value: data.projects.length },
    { label: 'UNREAD COMMS', value: unreadCount, highlight: unreadCount > 0 },
    { label: 'BLOG LOGS', value: data.blogs.length },
    { label: 'EXPERIENCE', value: data.experiences.length },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="border-b-4 border-black pb-8">
        <h2 className="font-heading font-black text-6xl uppercase tracking-tighter">COMMAND<br />CENTER</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <span className="bg-[#FF5F1F] text-white px-4 py-1 text-xs font-black uppercase tracking-widest">SYSTEM_STATUS: OPTIMAL</span>
          <span className="bg-black text-white px-4 py-1 text-xs font-black uppercase tracking-widest">CONFIDENCE_LEVEL: 100%</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className={`border-4 border-black p-8 flex flex-col justify-between group transition-colors duration-300 ${
              stat.highlight ? 'bg-[#FF5F1F] text-white animate-pulse' : 'bg-gray-50 hover:bg-black hover:text-white'
            }`}
          >
            <span className={`text-xs font-black uppercase opacity-50 mb-8 ${stat.highlight ? 'opacity-100 text-white' : ''}`}>
              {stat.label}
            </span>
            <span className="text-9xl font-black leading-none">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border-4 border-black p-8 space-y-4 bg-white">
          <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-2">CORE_METRICS</h3>
          <div className="space-y-3">
             {[
               { label: 'TOTAL_ASSETS', val: data.media.length },
               { label: 'TOTAL_TESTIMONIALS', val: data.testimonials.length },
               { label: 'ACTIVE_SOCIALS', val: data.profile.socialLinks.length },
               { label: 'SYSTEM_VERSION', val: data.systemInfo.version }
             ].map(m => (
               <div key={m.label} className="flex justify-between font-black uppercase text-sm">
                 <span className="opacity-40">{m.label}</span>
                 <span>{m.val}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="border-4 border-black p-8 space-y-4 bg-black text-white">
          <h3 className="text-2xl font-black uppercase tracking-tight text-[#FF5F1F] border-b-2 border-[#FF5F1F]/20 pb-2">SYS_LOG</h3>
          <div className="space-y-2 font-mono text-[10px] uppercase">
            <p className="text-green-400">[2024-05-20] KERNEL_BOOT_SUCCESS</p>
            <p className="text-blue-400">[2024-05-19] DATA_INTEGRITY_VERIFIED</p>
            <p className="text-[#FF5F1F]">[2024-05-19] UNAPOLOGETIC_STYLE_DEPLOYED</p>
            <p className="text-gray-500">[2024-05-18] CACHE_INVALIDATED</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
