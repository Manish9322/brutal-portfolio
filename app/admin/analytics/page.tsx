'use client';

import React from 'react';
import Link from 'next/link';
import { useGetAdminStatsQuery } from '@/services/api';
import { PageHeader, Panel, StatCard, Badge, Loading, Button } from '@/components/admin/ui';

/**
 * Analytics — content and correspondence.
 *
 * Every figure here is counted from the database. Traffic (views, visitors,
 * referrers, geography) is deliberately absent rather than estimated: nothing
 * in this app records a page view, so those numbers cannot be derived. They
 * arrive when an analytics provider is connected, and until then the slot says
 * so instead of showing invented bars.
 */

/** "+3 VS LAST MONTH" / "NO CHANGE" — sign included, since direction is the point. */
const delta = (current: number, previous: number) => {
  const diff = current - previous;
  if (diff === 0) return 'NO CHANGE VS LAST MONTH';
  return `${diff > 0 ? '+' : ''}${diff} VS LAST MONTH`;
};

const daysSince = (iso: string) =>
  Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));

const MONTH_LABEL = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const monthLabel = (key: string) => MONTH_LABEL[Number(key.split('-')[1]) - 1] ?? key;

/** Horizontal bar scaled against the largest value in its own set. */
const Bar: React.FC<{ label: string; value: number; max: number; suffix?: string }> = ({
  label,
  value,
  max,
  suffix,
}) => (
  <div className="space-y-1">
    <div className="flex justify-between gap-3 text-[10px] font-black uppercase tracking-widest">
      <span className="truncate">{label}</span>
      <span className="tabular-nums text-black/40 shrink-0">
        {value}
        {suffix}
      </span>
    </div>
    <div className="h-4 border-2 border-black bg-white">
      <div
        className="h-full bg-[#FF5F1F] transition-[width] duration-500"
        style={{ width: max > 0 ? `${Math.round((value / max) * 100)}%` : '0%' }}
      />
    </div>
  </div>
);

const AnalyticsPage: React.FC = () => {
  const { data, isLoading, isError, refetch, isFetching } = useGetAdminStatsQuery();

  if (isLoading) return <Loading label="COUNTING RECORDS" />;

  if (isError || !data) {
    return (
      <div className="space-y-5">
        <PageHeader title="ANALYTICS" subtitle="Content and correspondence" />
        <Panel title="UNAVAILABLE">
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-black/50">
              Could not read the stats. The database may be unreachable.
            </p>
            <Button variant="primary" onClick={() => refetch()}>
              RETRY
            </Button>
          </div>
        </Panel>
      </div>
    );
  }

  const { messages, content, cadence, categories, staleDays, generatedAt } = data;

  const cadenceMax = Math.max(1, ...cadence.map((c: any) => c.total));
  const categoryMax = Math.max(1, ...categories.map((c: any) => c.count));

  const contentTotal =
    content.projects.total +
    content.blogs.total +
    content.gallery.total +
    content.experience +
    content.education +
    content.testimonials;

  const attention = [
    content.projects.hidden > 0 && {
      label: `${content.projects.hidden} PROJECT${content.projects.hidden === 1 ? '' : 'S'} HIDDEN`,
      href: '/admin/projects',
    },
    content.projects.missingImage > 0 && {
      label: `${content.projects.missingImage} PROJECT${content.projects.missingImage === 1 ? '' : 'S'} WITHOUT A COVER`,
      href: '/admin/projects',
    },
    content.projects.stale > 0 && {
      label: `${content.projects.stale} PROJECT${content.projects.stale === 1 ? '' : 'S'} UNTOUCHED ${staleDays}+ DAYS`,
      href: '/admin/projects',
    },
    content.blogs.missingExcerpt > 0 && {
      label: `${content.blogs.missingExcerpt} POST${content.blogs.missingExcerpt === 1 ? '' : 'S'} WITHOUT AN EXCERPT`,
      href: '/admin/blogs',
    },
    content.gallery.hidden > 0 && {
      label: `${content.gallery.hidden} FRAME${content.gallery.hidden === 1 ? '' : 'S'} HIDDEN`,
      href: '/admin/gallery',
    },
    messages.unread > 0 && {
      label: `${messages.unread} UNREAD MESSAGE${messages.unread === 1 ? '' : 'S'}${
        messages.oldestUnreadAt ? ` — OLDEST ${daysSince(messages.oldestUnreadAt)}D AGO` : ''
      }`,
      href: '/admin/messages',
    },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="ANALYTICS"
        subtitle="Content and correspondence"
        actions={
          <div className="flex items-center gap-2">
            <Badge tone="muted">LIVE FROM DB</Badge>
            <Button size="sm" variant="ghost" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'REFRESHING' : 'REFRESH'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="MESSAGES"
          value={messages.total}
          hint={delta(messages.thisMonth, messages.lastMonth)}
        />
        <StatCard
          label="UNREAD"
          value={messages.unread}
          highlight={messages.unread > 0}
          hint={
            messages.oldestUnreadAt
              ? `OLDEST ${daysSince(messages.oldestUnreadAt)}D AGO`
              : 'INBOX CLEAR'
          }
        />
        <StatCard
          label="LIVE PROJECTS"
          value={content.projects.visible}
          hint={`${content.projects.hidden} HIDDEN / ${content.projects.total} TOTAL`}
        />
        <StatCard
          label="CONTENT ITEMS"
          value={contentTotal}
          hint={`${content.media} MEDIA ASSETS`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="PUBLISHING CADENCE" description="Items created per month, last 6 months">
          <div className="space-y-3">
            {cadence.map((c: any) => (
              <Bar key={c.month} label={monthLabel(c.month)} value={c.total} max={cadenceMax} />
            ))}
          </div>
        </Panel>

        <Panel title="PROJECTS BY CATEGORY">
          {categories.length === 0 ? (
            <p className="text-[11px] font-black uppercase tracking-widest text-black/30">
              No projects yet
            </p>
          ) : (
            <div className="space-y-3">
              {categories.map((c: any) => (
                <Bar key={c.name} label={c.name} value={c.count} max={categoryMax} />
              ))}
            </div>
          )}
        </Panel>
      </div>

      <Panel title="NEEDS ATTENTION" description="Gaps worth closing before the next share">
        {attention.length === 0 ? (
          <p className="text-[11px] font-black uppercase tracking-widest text-black/30">
            Nothing outstanding
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {attention.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="border-2 border-black px-3 py-2 flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                <span className="truncate">{a.label}</span>
                <span className="shrink-0 opacity-40">→</span>
              </Link>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="LIBRARY">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'PROJECTS', value: content.projects.total },
            { label: 'BLOG POSTS', value: content.blogs.total },
            { label: 'GALLERY FRAMES', value: content.gallery.total },
            { label: 'TESTIMONIALS', value: content.testimonials },
            { label: 'ROLES', value: content.experience },
            { label: 'QUALIFICATIONS', value: content.education },
            { label: 'SKILLS', value: content.skills.items },
            { label: 'MEDIA ASSETS', value: content.media },
          ].map((row) => (
            <div
              key={row.label}
              className="border-2 border-black px-3 py-2 flex items-center justify-between gap-2"
            >
              <span className="text-[10px] font-black uppercase tracking-wide truncate">
                {row.label}
              </span>
              <span className="text-[10px] font-black tabular-nums text-black/40">{row.value}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="TRAFFIC">
        <div className="space-y-2">
          <Badge tone="muted">NOT CONNECTED</Badge>
          <p className="text-[11px] font-bold uppercase tracking-wide text-black/50 leading-relaxed">
            Views, visitors, referrers and geography are not recorded by this app, so they are not
            shown rather than estimated. Connect an analytics provider and this panel becomes real.
          </p>
        </div>
      </Panel>

      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/25">
        COUNTED {new Date(generatedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default AnalyticsPage;
