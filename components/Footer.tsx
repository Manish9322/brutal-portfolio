
import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Footer: React.FC = () => {
  const { data } = usePortfolio();
  const { profile, footerResources, systemInfo } = data;

  const marqueeContent = `VERSION ${systemInfo.version} - ${systemInfo.marqueeText} - `.repeat(4);

  return (
    <footer className="p-12 md:p-24 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div className="space-y-8">
           <h4 className="font-heading font-black text-4xl md:text-6xl uppercase tracking-tighter">{profile.name}.V1</h4>
           <div className="flex gap-12">
             <div className="flex flex-col gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-40">SOCIALS</span>
               {profile.socialLinks.map(link => (
                 <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#FF5F1F] uppercase">
                   {link.platform}
                 </a>
               ))}
             </div>
             <div className="flex flex-col gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-40">RESOURCES</span>
               {footerResources.map(res => (
                 <a key={res.id} href={res.url} className="font-bold hover:text-[#FF5F1F] uppercase">
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
             © {new Date().getFullYear()} {profile.name} {profile.lastName}. ALL RIGHTS RESERVED. DESIGN BY {profile.name}.
           </div>
        </div>
      </div>
      
      <div className="mt-24 w-full h-px bg-black"></div>
      <div className="mt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] overflow-hidden whitespace-nowrap">
         <span className="animate-marquee">{marqueeContent}</span>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
