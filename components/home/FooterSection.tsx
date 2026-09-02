'use client';

import React from 'react';
import { useGetProfileQuery, useGetSettingsQuery } from '@/services/api';
import type { FooterResource, SocialLink } from '@/types';

const FooterSection: React.FC = () => {
  const { data: profile } = useGetProfileQuery();
  const { data: settings } = useGetSettingsQuery();

  const socialLinks: SocialLink[] = profile?.socialLinks ?? [];
  const footerResources: FooterResource[] = settings?.footerResources ?? [];
  const marqueeContent = `VERSION ${settings?.version ?? ''} - ${settings?.marqueeText ?? ''} - `.repeat(4);

  return (
    <footer className="p-12 md:p-24 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div className="space-y-8">
           <h4 className="font-heading font-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl uppercase tracking-tighter">{profile?.name ?? ''}.V1</h4>
           <div className="flex gap-12">
             <div className="flex flex-col gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-40">SOCIALS</span>
               {socialLinks.map(link => (
                 <a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#FF5F1F] uppercase">
                   {link.platform}
                 </a>
               ))}
             </div>
             <div className="flex flex-col gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-40">RESOURCES</span>
               {footerResources.map(res => (
                 <a key={res._id} href={res.url} className="font-bold hover:text-[#FF5F1F] uppercase">
                   {res.label}
                 </a>
               ))}
             </div>
           </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-6 text-left md:text-right">
           <p className="text-xl md:text-3xl font-black uppercase leading-none max-w-sm">
             BUILT ON RIGID GRIDS AND CLEAN LOGIC. NO FLUFF.
           </p>
           <div className="text-[10px] font-black uppercase tracking-widest opacity-40">
             © {new Date().getFullYear()} {profile?.name ?? ''} {profile?.lastName ?? ''}. ALL RIGHTS RESERVED.
           </div>
        </div>
      </div>

      <div className="mt-24 w-full h-px bg-black"></div>
      {/* w-full + max-w-full keep the clip reliable; the flex row it used to be
          let the oversized track widen the page on non-home routes. */}
      <div className="mt-8 w-full max-w-full overflow-hidden whitespace-nowrap text-[10px] font-black uppercase tracking-[0.5em]">
         <span className="animate-marquee">{marqueeContent}</span>
      </div>
    </footer>
  );
};

export default FooterSection;
