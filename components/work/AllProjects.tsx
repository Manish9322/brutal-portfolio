'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useGetProjectsQuery } from '@/services/api';
import { sortProjects } from '@/lib/projects';
import ProjectImage from '@/components/ProjectImage';
import type { Project } from '@/types';

const ALL = 'ALL';

const AllProjects: React.FC = () => {
  const { data: projects = [], isLoading } = useGetProjectsQuery();
  const [activeCategory, setActiveCategory] = useState(ALL);

  const visible = useMemo(
    () => sortProjects((projects as Project[]).filter((p) => p.visible)),
    [projects]
  );

  const categories = useMemo(() => {
    const found = visible.map((p) => p.category).filter(Boolean);
    return [ALL, ...Array.from(new Set(found))];
  }, [visible]);

  const shown = activeCategory === ALL
    ? visible
    : visible.filter((p) => p.category === activeCategory);

  return (
    <section className="border-b-4 border-black min-h-screen bg-white">
      <header className="border-b-4 border-black p-8 md:p-12 sticky top-0 bg-white z-40 flex justify-between items-center">
        <Link
          href="/"
          className="font-black uppercase tracking-widest hover:text-[#FF5F1F] transition-colors border-b-4 border-black"
        >
          [ ← EXIT_TO_SYSTEM_ROOT ]
        </Link>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 hidden md:block">
          ARCHIVE_MODE // WORK_INDEX
        </span>
      </header>

      <div className="p-8 md:p-24 border-b-4 border-black bg-black text-white">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-9xl uppercase leading-none tracking-tighter">
          ALL<br />WORKS
        </h1>
        <p className="mt-4 text-xl font-bold text-[#FF5F1F] uppercase tracking-widest">
          {visible.length} SYSTEMS BUILT, SHIPPED AND DOCUMENTED
        </p>
      </div>

      {categories.length > 2 && (
        <div className="border-b-4 border-black flex flex-wrap divide-x-4 divide-black">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 md:px-10 py-6 text-xs font-black uppercase tracking-widest transition-colors ${
                activeCategory === cat ? 'bg-[#FF5F1F] text-white' : 'hover:bg-gray-100'
              }`}
            >
              {cat}
              <span className="ml-3 opacity-40">
                [{cat === ALL ? visible.length : visible.filter((p) => p.category === cat).length}]
              </span>
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="p-24 text-center">
          <p className="text-4xl font-black uppercase opacity-20">LOADING_ARCHIVE...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((project, idx) => (
          <Link
            key={project._id}
            href={`/work/${project._id}`}
            className="group flex flex-col border-b-4 border-black md:border-r-4 last:border-r-0 hover:bg-black hover:text-white transition-colors duration-300"
          >
            <div className="relative aspect-video overflow-hidden border-b-4 border-black">
              <ProjectImage
                src={project.image}
                alt={project.title}
                label={project.title}
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
              />
              <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 border-2 border-black font-black text-xs uppercase">
                {project.year}
              </div>
              {project.featured && (
                <div className="absolute top-4 left-4 bg-[#FF5F1F] text-white px-3 py-1 border-2 border-black font-black text-[10px] uppercase tracking-widest">
                  FEATURED
                </div>
              )}
              <div className="absolute bottom-0 left-0 bg-black text-white px-3 py-1 font-black text-[10px] tracking-widest">
                {String(idx + 1).padStart(2, '0')}
              </div>
            </div>

            <div className="p-8 space-y-5 flex-1 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5F1F]">
                {project.category}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold uppercase tracking-tighter leading-none break-words">
                {project.title}
              </h2>
              <p className="text-base leading-snug opacity-70 group-hover:opacity-100 flex-1">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 border-2 border-current text-[10px] font-black uppercase tracking-widest"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack?.length > 4 && (
                  <span className="px-2 py-1 text-[10px] font-black opacity-40">
                    +{project.techStack.length - 4}
                  </span>
                )}
              </div>
              <span className="pt-2 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                OPEN_CASE_FILE
                <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {!isLoading && shown.length === 0 && (
        <div className="p-24 text-center">
          <p className="text-4xl font-black uppercase opacity-20">NO_PROJECTS_IN_THIS_CATEGORY</p>
        </div>
      )}
    </section>
  );
};

export default AllProjects;
