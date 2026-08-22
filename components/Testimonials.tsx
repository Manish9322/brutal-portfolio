
import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Testimonials: React.FC = () => {
  const { data } = usePortfolio();
  const visibleTestimonials = data.testimonials
    .filter(t => t.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="testimonials" className="border-b-4 border-black overflow-hidden">
      <div className="p-8 border-b-4 border-black bg-white">
        <h2 className="font-heading font-bold text-6xl md:text-8xl uppercase leading-none">TESTIMONIALS</h2>
      </div>
      <div className="flex flex-col">
        {visibleTestimonials.map((t, idx) => (
          <div key={t.id} className={`flex flex-col lg:flex-row divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-black ${idx !== visibleTestimonials.length - 1 ? 'border-b-4 border-black' : ''}`}>
            <div className="lg:w-2/3 p-12 lg:p-24 bg-white hover:bg-black hover:text-white transition-colors duration-500">
               <span className="text-8xl font-black leading-none opacity-20 block mb-4">“</span>
               <p className="text-3xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter italic">
                 {t.quote}
               </p>
            </div>
            <div className="lg:w-1/3 p-12 lg:p-24 bg-[#FF5F1F] text-white flex flex-col justify-end">
               <div className="space-y-4">
                  <span className="block text-xs font-black uppercase tracking-[0.3em] opacity-60">CLIENT_ID</span>
                  <h4 className="text-4xl font-heading font-bold uppercase leading-none">{t.author}</h4>
                  <p className="text-xl font-bold uppercase">{t.role}</p>
                  {t.projectRef && (
                    <div className="pt-8 border-t-2 border-white/20">
                      <span className="text-[10px] font-black uppercase opacity-60">RELATED_PROJECT</span>
                      <p className="font-black uppercase text-2xl">{t.projectRef}</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        ))}
        {visibleTestimonials.length === 0 && (
           <div className="p-24 text-center bg-gray-50 border-black">
              <p className="text-4xl font-black uppercase opacity-10">NO_SOCIAL_PROOF_TRANSMITTED</p>
           </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
