'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import { useGetMessagesQuery } from '@/services/api';
import type { ContactMessage } from '@/types';

/** Grouped so the 14 destinations stay scannable instead of one long list. */
const NAV_GROUPS = [
  {
    heading: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'DASHBOARD' },
      { id: 'analytics', label: 'ANALYTICS' },
      { id: 'messages', label: 'MESSAGES', badgeKey: 'unread' as const },
    ],
  },
  {
    heading: 'CONTENT',
    items: [
      { id: 'projects', label: 'PROJECTS' },
      { id: 'experience', label: 'EXPERIENCE' },
      { id: 'education', label: 'EDUCATION' },
      { id: 'skills', label: 'SKILLS' },
      { id: 'testimonials', label: 'TESTIMONIALS' },
      { id: 'blogs', label: 'BLOGS' },
    ],
  },
  {
    heading: 'ASSETS',
    items: [
      { id: 'gallery', label: 'GALLERY' },
      { id: 'media', label: 'MEDIA' },
    ],
  },
  {
    heading: 'CONFIG',
    items: [
      { id: 'profile', label: 'PROFILE' },
      { id: 'settings', label: 'SETTINGS' },
      { id: 'seo', label: 'SEO' },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAdminAuth();
  const pathname = usePathname();
  const { data: messages = [] } = useGetMessagesQuery();
  const unread = (messages as ContactMessage[]).filter((m) => !m.read).length;

  const [navOpen, setNavOpen] = useState(false);

  // Close the drawer on navigation and on Escape; lock scroll while it is open.
  useEffect(() => setNavOpen(false), [pathname]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setNavOpen(false);
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [navOpen]);

  const current = ALL_ITEMS.find((i) => pathname === `/admin/${i.id}`);

  const nav = (
    <nav className="flex-1 overflow-y-auto">
      {NAV_GROUPS.map((group) => (
        <div key={group.heading} className="border-b-2 border-black/10 last:border-b-0">
          <p className="px-4 pt-4 pb-2 text-[9px] font-black uppercase tracking-[0.25em] text-black/30">
            {group.heading}
          </p>
          {group.items.map((item) => {
            const href = `/admin/${item.id}`;
            const isActive = pathname === href;
            const badge = item.badgeKey === 'unread' && unread > 0 ? unread : null;
            return (
              <Link
                key={item.id}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`px-4 py-2.5 flex items-center justify-between gap-2 text-[11px] font-black uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'bg-[#FF5F1F] text-white'
                    : 'text-black/70 hover:bg-gray-100 hover:text-black'
                }`}
                style={{ display: 'flex' }}
              >
                <span className="truncate">{item.label}</span>
                {badge && (
                  <span
                    className={`shrink-0 px-1.5 py-0.5 text-[9px] font-black tabular-nums border ${
                      isActive ? 'bg-white text-[#FF5F1F] border-white' : 'bg-black text-white border-black'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const sidebarBody = (
    <>
      <div className="px-4 py-3 border-b-2 border-black bg-black text-white flex items-center justify-between gap-2 shrink-0">
        <span className="font-heading font-black text-sm uppercase tracking-tighter">CMS.V1</span>
        <Link
          href="/"
          className="border border-white/60 px-2 py-1 text-[9px] font-black uppercase tracking-widest hover:bg-[#FF5F1F] hover:border-[#FF5F1F] transition-colors"
        >
          VIEW SITE
        </Link>
      </div>
      {nav}
      <button
        onClick={logout}
        className="shrink-0 px-4 py-3 border-t-2 border-black bg-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
      >
        SIGN OUT
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 border-b-2 border-black bg-white flex items-stretch">
        <button
          onClick={() => setNavOpen(true)}
          aria-label="Open menu"
          aria-expanded={navOpen}
          className="px-4 border-r-2 border-black flex flex-col justify-center gap-1 hover:bg-[#FF5F1F] group"
        >
          <span className="block h-0.5 w-5 bg-black group-hover:bg-white" />
          <span className="block h-0.5 w-5 bg-black group-hover:bg-white" />
          <span className="block h-0.5 w-5 bg-black group-hover:bg-white" />
        </button>
        <div className="flex-1 min-w-0 px-4 py-3 flex items-center">
          <span className="text-[11px] font-black uppercase tracking-widest truncate">
            {current?.label ?? 'ADMIN'}
          </span>
        </div>
        <Link
          href="/"
          className="px-4 border-l-2 border-black flex items-center text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
        >
          SITE
        </Link>
      </header>

      {/* Mobile drawer */}
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 animate-in fade-in duration-150"
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
            className="absolute inset-y-0 left-0 w-[80%] max-w-xs bg-white border-r-2 border-black flex flex-col animate-in slide-in-from-left duration-200"
          >
            <button
              onClick={() => setNavOpen(false)}
              aria-label="Close menu"
              className="absolute top-2 right-2 z-10 h-7 w-7 flex items-center justify-center text-white font-black hover:text-[#FF5F1F]"
            >
              ✕
            </button>
            {sidebarBody}
          </aside>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-56 xl:w-64 shrink-0 border-r-2 border-black bg-white flex-col sticky top-0 h-screen">
          {sidebarBody}
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto border-2 border-black bg-white p-4 sm:p-5">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
