
import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Skills: React.FC = () => {
  const { data } = usePortfolio();
  const { skills } = data;

  return (
    <section id="skills" className="border-b-4 border-black">
      <div className="bg-[#FF5F1F] p-8 border-b-4 border-black">
        <h2 className="text-white font-heading font-bold text-4xl uppercase tracking-tighter">TECHNICAL ARSENAL</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-black">
        {skills.map((skillGroup) => (
          <div key={skillGroup.category} className="flex flex-col">
            <div className="p-6 bg-gray-100 border-b-4 border-black">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-60">{skillGroup.category}</h3>
            </div>
            <div className="flex-1 p-6 space-y-4">
              {skillGroup.items.map((skill) => (
                <div key={skill} className="flex items-center justify-between group">
                  <span className="text-2xl font-black uppercase tracking-tight group-hover:text-[#FF5F1F] transition-colors">{skill}</span>
                  <div className="h-4 w-4 bg-black opacity-10 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
