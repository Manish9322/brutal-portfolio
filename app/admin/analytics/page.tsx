'use client';

import React, { useMemo } from 'react';
import { useGetProjectsQuery } from '@/services/api';
import { PageHeader, Panel, StatCard, Badge } from '@/components/admin/ui';
import type { Project } from '@/types';

const METRICS = [
  { label: 'TOTAL VIEWS', value: '42.8K', hint: '+12% VS LAST MONTH' },
  { label: 'UNIQUE VISITORS', value: '18.2K', hint: '+5% VS LAST MONTH' },
  { label: 'BOUNCE RATE', value: '14.2%', hint: '-2% VS LAST MONTH' },
  { label: 'AVG SESSION', value: '04:12', hint: '+22S VS LAST MONTH' },
];

const SOURCES = [
  { source: 'DIRECT', value: 85 },
  { source: 'GITHUB', value: 65 },
  { source: 'LINKEDIN', value: 45 },
  { source: 'SEARCH', value: 30 },
];

const AnalyticsPage: React.FC = () => {
  const { data: projects = [] } = useGetProjectsQuery();

  const projectStats = useMemo(
    () =>
      (projects as Project[])
        .map((p) => ({
          name: p.title,
          clicks: Math.floor(Math.random() * 2000) + 500,
          conversion: `${(Math.random() * 5 + 1).toFixed(1)}%`,
        }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 8),
    [projects]
  );

  const geo = useMemo(
    () =>
      ['USA', 'GERMANY', 'UK', 'JAPAN', 'SINGAPORE', 'BRAZIL', 'INDIA', 'CANADA'].map((country) => ({
        country,
        share: `${(Math.random() * 20).toFixed(1)}%`,
      })),
    []
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="ANALYTICS"
        subtitle="Traffic and engagement"
        actions={<Badge tone="accent">SAMPLE DATA</Badge>}
      />

      <Panel title="NOTE">
        <p className="text-[11px] font-bold uppercase tracking-wide text-black/50 leading-relaxed">
          These figures are placeholders — no analytics provider is connected yet. Wire one up and this page
          can read real numbers.
        </p>
      </Panel>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map((m) => (
          <StatCard key={m.label} label={m.label} value={m.value} hint={m.hint} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="TRAFFIC SOURCES">
          <div className="space-y-3">
            {SOURCES.map((s) => (
              <div key={s.source} className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>{s.source}</span>
                  <span className="tabular-nums text-black/40">{s.value}%</span>
                </div>
                <div className="h-4 border-2 border-black bg-white">
                  <div className="h-full bg-[#FF5F1F]" style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="TOP PROJECTS" flush>
          <div className="divide-y-2 divide-black/10">
            {projectStats.map((p, i) => (
              <div key={p.name} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0 flex items-center gap-3">
                  <span className="text-[10px] font-black tabular-nums text-black/25">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wide truncate">{p.name}</span>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs font-black tabular-nums">{p.clicks}</div>
                  <div className="text-[9px] font-black text-[#FF5F1F]">{p.conversion}</div>
                </div>
              </div>
            ))}
            {projectStats.length === 0 && (
              <p className="px-4 py-6 text-[11px] font-black uppercase tracking-widest text-black/30">
                No projects yet
              </p>
            )}
          </div>
        </Panel>
      </div>

      <Panel title="GEOGRAPHY">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {geo.map((g) => (
            <div
              key={g.country}
              className="border-2 border-black px-3 py-2 flex items-center justify-between gap-2"
            >
              <span className="text-[10px] font-black uppercase tracking-wide truncate">{g.country}</span>
              <span className="text-[10px] font-black tabular-nums text-black/40">{g.share}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
};

export default AnalyticsPage;
