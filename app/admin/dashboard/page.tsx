'use client';

import React from 'react';
import Link from 'next/link';
import {
  useGetProjectsQuery,
  useGetMessagesQuery,
  useGetBlogsQuery,
  useGetExperiencesQuery,
  useGetMediaQuery,
  useGetTestimonialsQuery,
  useGetGalleryQuery,
  useGetEducationQuery,
  useGetProfileQuery,
  useGetSettingsQuery,
} from '@/services/api';
import { PageHeader, Panel, StatCard, MetricRow, Badge, Button } from '@/components/admin/ui';
import type { ContactMessage, Project } from '@/types';

const DashboardPage: React.FC = () => {
  const { data: projects = [] } = useGetProjectsQuery();
  const { data: messages = [] } = useGetMessagesQuery();
  const { data: blogs = [] } = useGetBlogsQuery();
  const { data: experiences = [] } = useGetExperiencesQuery();
  const { data: media = [] } = useGetMediaQuery();
  const { data: testimonials = [] } = useGetTestimonialsQuery();
  const { data: gallery = [] } = useGetGalleryQuery();
  const { data: education = [] } = useGetEducationQuery();
  const { data: profile } = useGetProfileQuery();
  const { data: settings } = useGetSettingsQuery();

  const unread = (messages as ContactMessage[]).filter((m) => !m.read).length;
  const hiddenProjects = (projects as Project[]).filter((p) => !p.visible).length;
  const missingImages = (projects as Project[]).filter((p) => !p.image).length;

  const stats = [
    { label: 'PROJECTS', value: projects.length, hint: `${hiddenProjects} hidden`, href: '/admin/projects' },
    { label: 'UNREAD MESSAGES', value: unread, highlight: unread > 0, href: '/admin/messages' },
    { label: 'BLOG POSTS', value: blogs.length, href: '/admin/blogs' },
    { label: 'GALLERY FRAMES', value: gallery.length, href: '/admin/gallery' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="DASHBOARD"
        subtitle="Content at a glance"
        actions={<Badge tone={unread > 0 ? 'accent' : 'success'}>{unread > 0 ? `${unread} UNREAD` : 'ALL CLEAR'}</Badge>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="block hover:opacity-80 transition-opacity">
            <StatCard label={s.label} value={s.value} hint={s.hint} highlight={s.highlight} />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="CONTENT COUNTS">
          <div className="space-y-2.5">
            <MetricRow label="EXPERIENCE" value={experiences.length} />
            <MetricRow label="EDUCATION" value={education.length} />
            <MetricRow label="TESTIMONIALS" value={testimonials.length} />
            <MetricRow label="MEDIA ASSETS" value={media.length} />
            <MetricRow label="SOCIAL LINKS" value={profile?.socialLinks?.length ?? 0} />
            <MetricRow label="FOOTER RESOURCES" value={settings?.footerResources?.length ?? 0} />
            <MetricRow label="SITE VERSION" value={settings?.version ?? '—'} />
          </div>
        </Panel>

        <Panel title="NEEDS ATTENTION">
          <div className="space-y-2.5">
            {unread > 0 && (
              <MetricRow
                label="UNREAD MESSAGES"
                value={<Link href="/admin/messages" className="text-[#FF5F1F] underline">{unread}</Link>}
              />
            )}
            {missingImages > 0 && (
              <MetricRow
                label="PROJECTS WITHOUT AN IMAGE"
                value={<Link href="/admin/projects" className="text-[#FF5F1F] underline">{missingImages}</Link>}
              />
            )}
            {hiddenProjects > 0 && (
              <MetricRow
                label="PROJECTS HIDDEN FROM THE SITE"
                value={<Link href="/admin/projects" className="text-[#FF5F1F] underline">{hiddenProjects}</Link>}
              />
            )}
            {!profile?.telegram && <MetricRow label="TELEGRAM HANDLE" value="NOT SET" />}
            {unread === 0 && missingImages === 0 && hiddenProjects === 0 && profile?.telegram && (
              <p className="text-[11px] font-black uppercase tracking-widest text-black/30">
                Nothing needs attention.
              </p>
            )}
          </div>
        </Panel>
      </div>

      <Panel title="QUICK ACTIONS">
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/projects"><Button variant="primary">NEW PROJECT</Button></Link>
          <Link href="/admin/blogs"><Button variant="ghost">NEW POST</Button></Link>
          <Link href="/admin/gallery"><Button variant="ghost">ADD FRAME</Button></Link>
          <Link href="/admin/media"><Button variant="ghost">UPLOAD MEDIA</Button></Link>
        </div>
      </Panel>
    </div>
  );
};

export default DashboardPage;
