
import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Projects: React.FC = () => {
  const { data } = usePortfolio();
  const visibleProjects = data.projects.filter(p => p.visible);

  return (
    <section id="work" className="border-b-4 border-black">
      <div className="p-8 border-b-4 border-black">
        <h2 className="font-heading font-bold text-6xl md:text-8xl uppercase leading-none">SELECTED<br />WORKS</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {visibleProjects.map((project, idx) => (
          <div 
            key={project.id} 
            className={`flex flex-col border-black ${idx % 2 === 0 ? 'md:border-r-4' : ''} ${idx < visibleProjects.length - 1 ? 'border-b-4' : 'border-b-4 md:border-b-0'}`}
          >
            <div className="relative aspect-video overflow-hidden border-b-4 border-black group">
               <img 
                 src={project.image} 
                 alt={project.title} 
                 className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
               />
               <div className="absolute inset-0 bg-[#FF5F1F] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
               <div className="absolute top-4 right-4 bg-white px-4 py-2 border-2 border-black font-black text-sm uppercase">
                 {project.year}
               </div>
            </div>
            <div className="p-8 space-y-6 flex-1 bg-white hover:bg-black hover:text-white transition-colors duration-300">
               <div className="flex justify-between items-start">
                  <span className="text-xs font-black uppercase tracking-widest text-[#FF5F1F]">{project.category}</span>
                  <a href={project.link} className="hover:underline font-bold">VIEW CASE STUDY</a>
               </div>
               <h3 className="text-5xl font-heading font-bold uppercase tracking-tighter">{project.title}</h3>
               <p className="text-lg leading-snug">{project.description}</p>
               <div className="flex flex-wrap gap-2 pt-4">
                  {project.techStack?.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-transparent border-2 border-current text-[10px] font-black uppercase tracking-widest">
                      {tech}
                    </span>
                  ))}
               </div>
            </div>
          </div>
        ))}
      </div>
      {visibleProjects.length === 0 && (
         <div className="p-24 text-center">
            <p className="text-4xl font-black uppercase opacity-10">ARCHIVE_TEMPORARILY_OFFLINE</p>
         </div>
      )}
    </section>
  );
};

export default Projects;
