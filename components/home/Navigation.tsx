'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGetProfileQuery } from '@/services/api';

const LINKS = [
  { name: 'WORK', href: '/#work' },
  { name: 'JOURNAL', href: '/journal' },
  { name: 'EDUCATION', href: '/education' },
  { name: 'SKILLS', href: '/#skills' },
  { name: 'CONTACT', href: '/#contact' },
  { name: 'ADMIN', href: '/admin', isSpecial: true },
];

const Navigation: React.FC = () => {
  const { data: profile } = useGetProfileQuery();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation, on Escape, and lock scroll while the drawer is open.
  useEffect(() => setIsOpen(false), [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-[1800px] mx-auto flex justify-between items-stretch">
        <Link
          href="/"
          className="p-4 sm:p-6 border-r-4 border-black font-heading font-bold text-lg sm:text-2xl tracking-tighter hover:bg-black hover:text-white transition-colors uppercase flex items-center"
        >
          {profile?.name ?? ''}.V1
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`group relative flex items-center px-4 xl:px-8 border-l-4 border-black text-xs xl:text-sm font-bold tracking-widest hover:bg-[#FF5F1F] hover:text-white transition-colors duration-200 ${link.isSpecial ? 'bg-black text-white' : ''}`}
            >
              {link.name}
              {!link.isSpecial && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              )}
            </Link>
          ))}
        </div>

        {/* Hamburger — tablet and below */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="lg:hidden px-5 sm:px-8 border-l-4 border-black flex flex-col items-center justify-center gap-[5px] hover:bg-[#FF5F1F] transition-colors group"
        >
          <span className="block h-1 w-7 bg-black group-hover:bg-white transition-colors" />
          <span className="block h-1 w-7 bg-black group-hover:bg-white transition-colors" />
          <span className="block h-1 w-7 bg-black group-hover:bg-white transition-colors" />
        </button>
      </div>

      {/* Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/60 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <aside
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white border-l-4 border-black flex flex-col animate-in slide-in-from-right duration-300"
          >
            <div className="flex items-stretch justify-between border-b-4 border-black bg-black text-white">
              <span className="p-6 font-heading font-bold text-xl tracking-tighter uppercase flex items-center">
                {profile?.name ?? ''}.V1
              </span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="px-6 border-l-4 border-white font-black text-2xl hover:bg-[#FF5F1F] transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col divide-y-4 divide-black">
              {LINKS.map((link, i) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`p-6 font-black tracking-widest text-lg flex items-center justify-between transition-colors ${
                    link.isSpecial ? 'bg-black text-white hover:bg-[#FF5F1F]' : 'hover:bg-[#FF5F1F] hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="text-[10px] opacity-30 font-black">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </Link>
              ))}
            </div>

            <div className="border-t-4 border-black p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
                {profile?.discipline ?? 'PORTFOLIO'}
              </p>
            </div>
          </aside>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
