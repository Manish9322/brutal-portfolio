
import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const Dashboard: React.FC = () => {
  const { data } = usePortfolio();

  const stats = [
    { label: 'PROJECTS', value: data.projects.length },
    { label: 'SKILLS', value: data.skills.reduce((acc, s) => acc + s.items.length, 0) },
    { label: 'EXPERIENCE', value: data.experiences.length },
    { label: 'BLOG POSTS', value: data.blogs.length },
  ];

  return (
    <div className="space-y-12">
      <header className="border-b-4 border-black pb-8">
        <h2 className="font-heading font-black text-6xl uppercase tracking-tighter">COMMAND<br />CENTER</h2>
        <p className="mt-4 text-xl font-bold uppercase text-[#FF5F1F]">SYSTEM STATUS: OPTIMAL</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="border-4 border-black p-8 bg-gray-50 flex flex-col justify-between group hover:bg-black hover:text-white transition-colors duration-300">
            <span className="text-xs font-black uppercase opacity-50 mb-8">{stat.label}</span>
            <span className="text-9xl font-black leading-none">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="border-4 border-black p-8 space-y-4">
        <h3 className="text-2xl font-black uppercase tracking-tight">LOG_HISTORY</h3>
        <div className="space-y-2 font-mono text-sm uppercase">
          <p className="text-green-600">[2024-05-20] SYSTEM BOOT SUCCESSFUL</p>
          <p className="text-blue-600">[2024-05-19] SEO METADATA OPTIMIZED</p>
          <p className="text-gray-400">[2024-05-18] CACHE PURGED</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
