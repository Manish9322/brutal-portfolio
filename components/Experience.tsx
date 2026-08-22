
import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Experience: React.FC = () => {
  const { data } = usePortfolio();
  const experiences = data.experiences.filter(exp => exp.visible);

  return (
    <section className="border-b-4 border-black flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 p-12 bg-gray-100 border-b-4 md:border-b-0 md:border-r-4 border-black">
        <h2 className="font-heading font-bold text-6xl uppercase leading-none sticky top-32">HISTORY</h2>
      </div>
      <div className="w-full md:w-2/3">
        {experiences.map((exp, idx) => (
          <div key={exp.id} className={`p-12 relative ${idx !== experiences.length - 1 ? 'border-b-4 border-black' : ''}`}>
             <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8">
                <h3 className="text-4xl font-black uppercase tracking-tighter">{exp.role}</h3>
                <span className="text-xl font-bold text-[#FF5F1F]">{exp.period}</span>
             </div>
             <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-black flex-1"></div>
                <span className="font-heading font-bold text-2xl tracking-widest">{exp.company}</span>
                <div className="h-px bg-black w-8"></div>
             </div>
             <p className="text-xl max-w-2xl leading-relaxed">
               {exp.description}
             </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
