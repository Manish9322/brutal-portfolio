'use client';

import React from 'react';
import Link from 'next/link';
import { useGetProjectsQuery } from '@/services/api';
import { ProjectsSkeleton } from '@/components/skeletons';
import { selectHomepageProjects } from '@/lib/projects';
import ProjectImage from '@/components/ProjectImage';
import type { Project } from '@/types';

/** Tech-stack tags shown per card before the remainder collapses into a "+N" badge. */
const TAGS_SHOWN = 5;

const ProjectsSection: React.FC = () => {
  const { data: projects = [], isLoading } = useGetProjectsQuery();
  const all = (projects as Project[]).filter((p) => p.visible);
  const visibleProjects = selectHomepageProjects(all);

  if (isLoading) return <ProjectsSkeleton />;

  return (
    <section id="work" className="border-b-4 border-black">
      <div className="p-8 border-b-4 border-black flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <h2 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase leading-none">SELECTED<br />WORKS</h2>
        {all.length > 0 && (
          <Link
            href="/work"
            className="self-start md:self-auto bg-black text-white px-8 py-4 text-sm font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-colors whitespace-nowrap"
          >
            VIEW ALL [{all.length}] →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {visibleProjects.map((project, idx) => (
          <Link
            key={project._id}
            href={`/work/${project._id}`}
            className={`flex flex-col border-black ${idx % 2 === 0 ? 'md:border-r-4' : ''} ${idx < visibleProjects.length - 1 ? 'border-b-4' : 'border-b-4 md:border-b-0'}`}
          >
            <div className="relative aspect-video overflow-hidden border-b-4 border-black group">
               <ProjectImage
                 src={project.image}
                 alt={project.title}
                 label={project.title}
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
                  <span className="font-bold">VIEW CASE STUDY</span>
               </div>
               <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold uppercase tracking-tighter break-words">{project.title}</h3>
               <p className="text-lg leading-snug">{project.description}</p>
               <div className="flex flex-wrap gap-2 pt-4">
                  {project.techStack?.slice(0, TAGS_SHOWN).map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-transparent border-2 border-current text-[10px] font-black uppercase tracking-widest">
                      {tech}
                    </span>
                  ))}
                  {(project.techStack?.length ?? 0) > TAGS_SHOWN && (
                    <span className="px-3 py-1 bg-[#FF5F1F] text-white border-2 border-[#FF5F1F] text-[10px] font-black uppercase tracking-widest">
                      +{project.techStack.length - TAGS_SHOWN}
                    </span>
                  )}
               </div>
            </div>
          </Link>
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

export default ProjectsSection;
