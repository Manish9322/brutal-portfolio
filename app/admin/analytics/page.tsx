'use client';

import React, { useMemo } from 'react';
import { useGetProjectsQuery } from '@/services/api';
import type { Project } from '@/types';

const AnalyticsPage: React.FC = () => {
  const { data: projects = [] } = useGetProjectsQuery();

  // Mock analytics data - in a real app these would come from an API
  const metrics = [
    { label: 'TOTAL_VIEWS', value: '42.8K', trend: '+12%', status: 'HIGH' },
    { label: 'UNIQUE_VISITORS', value: '18.2K', trend: '+5%', status: 'STABLE' },
    { label: 'BOUNCE_RATE', value: '14.2%', trend: '-2%', status: 'OPTIMAL' },
    { label: 'AVG_SESSION', value: '04:12', trend: '+22s', status: 'CRITICAL' },
  ];

  const projectStats = useMemo(
    () =>
      (projects as Project[])
        .map((p) => ({
          name: p.title,
          clicks: Math.floor(Math.random() * 2000) + 500,
          conversion: (Math.random() * 5 + 1).toFixed(1) + '%',
        }))
        .sort((a, b) => b.clicks - a.clicks),
    [projects]
  );

  const geoStats = useMemo(
    () =>
      ['USA', 'GERMANY', 'UK', 'JAPAN', 'SINGAPORE', 'BRAZIL', 'INDIA', 'CANADA'].map((country) => ({
        country,
        share: (Math.random() * 20).toFixed(1) + '%',
      })),
    []
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="border-b-4 border-black pb-8">
        <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tighter">DATA_INTELLIGENCE</h2>
        <p className="mt-4 text-xl font-bold uppercase text-[#FF5F1F]">SYSTEM PERFORMANCE MONITORING</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m) => (
          <div key={m.label} className="border-4 border-black p-8 bg-gray-50 flex flex-col justify-between group hover:bg-[#FF5F1F] hover:text-white transition-all">
            <div className="flex justify-between items-start mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100">{m.label}</span>
              <span className="text-xs font-black">{m.trend}</span>
            </div>
            <div className="space-y-2">
              <span className="text-5xl font-black leading-none">{m.value}</span>
              <p className="text-[10px] font-black opacity-30 group-hover:opacity-70">{m.status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border-4 border-black p-8 space-y-8">
          <h3 className="text-2xl font-black uppercase">TRAFFIC_SOURCE_DISTRIBUTION</h3>
          <div className="space-y-6">
            {[
              { source: 'DIRECT', val: 85, color: 'bg-black' },
              { source: 'GITHUB', val: 65, color: 'bg-[#FF5F1F]' },
              { source: 'LINKEDIN', val: 45, color: 'bg-gray-400' },
              { source: 'SEARCH', val: 30, color: 'bg-gray-200' },
            ].map(s => (
              <div key={s.source} className="space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span>{s.source}</span>
                  <span>{s.val}%</span>
                </div>
                <div className="h-8 border-2 border-black w-full bg-white relative">
                  <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${s.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-4 border-black p-8 space-y-8 bg-black text-white">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-[#FF5F1F]">CONVERSION_LOG</h3>
          <div className="space-y-4">
            {projectStats.map((p, i) => (
              <div key={p.name} className="flex justify-between items-end border-b-2 border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-black opacity-40">RANK_{i+1}</span>
                  <p className="text-lg font-black uppercase truncate max-w-[150px]">{p.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black">{p.clicks}</span>
                  <p className="text-[10px] font-black text-[#FF5F1F]">{p.conversion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-4 border-black p-8 space-y-4 bg-gray-50">
        <h3 className="text-2xl font-black uppercase">GEOGRAPHIC_INTEL</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {geoStats.map(({ country, share }) => (
             <div key={country} className="p-4 border-2 border-black bg-white flex justify-between items-center group hover:bg-black hover:text-white transition-colors">
               <span className="font-black text-xs">{country}</span>
               <span className="text-[10px] opacity-40 group-hover:opacity-100">{share}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
