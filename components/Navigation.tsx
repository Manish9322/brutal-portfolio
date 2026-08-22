
import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Navigation: React.FC = () => {
  const { data } = usePortfolio();
  const links = [
    { name: 'WORK', href: '#work' },
    { name: 'JOURNAL', href: '#journal' },
    { name: 'ABOUT', href: '#about' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'CONTACT', href: '#contact' },
    { name: 'ADMIN', href: '#admin', isSpecial: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-[1800px] mx-auto flex justify-between items-stretch">
        <a href="#" className="p-6 border-r-4 border-black font-heading font-bold text-2xl tracking-tighter hover:bg-black hover:text-white transition-colors uppercase">
          {data.profile.name}.V1
        </a>
        <div className="flex overflow-x-auto md:overflow-visible">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`group relative flex items-center px-4 md:px-8 border-l-4 border-black text-xs md:text-sm font-bold tracking-widest hover:bg-[#FF5F1F] hover:text-white transition-colors duration-200 ${link.isSpecial ? 'bg-black text-white' : ''}`}
            >
              {link.name}
              {!link.isSpecial && <span className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
