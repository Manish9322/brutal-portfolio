
import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Gallery: React.FC = () => {
  const { data } = usePortfolio();
  const visibleItems = data.gallery
    .filter(item => item.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="gallery" className="border-b-4 border-black">
      <div className="p-8 border-b-4 border-black bg-black text-white">
        <h2 className="font-heading font-bold text-6xl md:text-8xl uppercase leading-none">BEHIND<br />THE SCENES</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
        {visibleItems.map((item, idx) => (
          <div key={item.id} className={`group flex flex-col border-black ${idx >= visibleItems.length - 3 ? '' : 'lg:border-b-4'}`}>
            <div className="relative aspect-square overflow-hidden border-b-4 border-black">
              <img 
                src={item.url} 
                alt={item.caption} 
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
            <div className="p-6 bg-white group-hover:bg-[#FF5F1F] group-hover:text-white transition-colors duration-300 flex-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 mb-2 block">ENTRY_{idx + 1}</span>
              <p className="text-xl font-black uppercase leading-tight tracking-tighter">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
