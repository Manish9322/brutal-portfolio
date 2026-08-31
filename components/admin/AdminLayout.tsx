'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import { useGetMessagesQuery } from '@/services/api';
import type { ContactMessage } from '@/types';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAdminAuth();
  const pathname = usePathname();
  const { data: messages = [] } = useGetMessagesQuery();
  const unreadMessages = (messages as ContactMessage[]).filter((m) => !m.read).length;

  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'analytics', label: 'ANALYTICS' },
    { id: 'messages', label: 'MESSAGES', badge: unreadMessages > 0 ? unreadMessages : null },
    { id: 'profile', label: 'PROFILE' },
    { id: 'settings', label: 'GLOBAL SETTINGS' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'education', label: 'EDUCATION' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'testimonials', label: 'TESTIMONIALS' },
    { id: 'blogs', label: 'BLOGS' },
    { id: 'media', label: 'MEDIA' },
    { id: 'seo', label: 'SEO' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <aside className="w-full md:w-80 border-r-4 border-black flex flex-col sticky top-0 h-screen overflow-y-auto z-50">
        <div className="p-8 border-b-4 border-black bg-black text-white flex justify-between items-center">
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter">CMS.V1</h1>
          <Link href="/" className="text-xs font-bold border border-white px-2 py-1 hover:bg-[#FF5F1F]">EXIT</Link>
        </div>
        <nav className="flex-1 flex flex-col divide-y-4 divide-black">
          {menuItems.map((item) => {
            const href = `/admin/${item.id}`;
            const isActive = pathname === href;
            return (
              <Link
                key={item.id}
                href={href}
                className={`p-6 text-left font-black tracking-widest transition-colors flex justify-between items-center ${
                  isActive ? 'bg-[#FF5F1F] text-white' : 'hover:bg-gray-100'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-black border-2 ${isActive ? 'border-white bg-white text-[#FF5F1F]' : 'border-black bg-black text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="p-8 bg-gray-200 font-black border-t-4 border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest"
        >
          TERMINATE
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-12">
        <div className="max-w-5xl mx-auto border-4 border-black bg-white p-8 md:p-12 shadow-[12px_12px_0px_0px_black]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
