'use client';

import React from 'react';
import Link from 'next/link';
import { useGetExperiencesQuery } from '@/services/api';
import { sortExperience, experienceRange, isCurrent } from '@/lib/experience';
import type { Experience } from '@/types';

const CareerLog: React.FC = () => {
  const { data: experiences = [], isLoading } = useGetExperiencesQuery();
  const all = sortExperience((experiences as Experience[]).filter((e) => e.visible));

  const totalProjects = all.reduce((sum, e) => sum + (e.projects?.length ?? 0), 0);
  const stack = Array.from(new Set(all.flatMap((e) => e.technologies ?? [])));

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
          ARCHIVE_MODE // CAREER_LOG
        </span>
      </header>

      <div className="p-8 md:p-24 border-b-4 border-black bg-black text-white">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-9xl uppercase leading-none tracking-tighter">
          CAREER<br />LOG
        </h1>
        <p className="mt-4 text-xl font-bold text-[#FF5F1F] uppercase tracking-widest">
          {all.length} POSTINGS / {totalProjects} SHIPPED PRODUCTS / {stack.length} TECHNOLOGIES
        </p>
      </div>

      {isLoading && (
        <div className="p-24 text-center">
          <p className="text-4xl font-black uppercase opacity-20">LOADING_LOG...</p>
        </div>
      )}

      {all.map((exp, idx) => {
        const current = isCurrent(exp);

        return (
          <article
            key={exp._id}
            className={`border-b-4 border-black flex flex-col lg:flex-row ${idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
          >
            {/* Sticky meta rail */}
            <aside className="w-full lg:w-1/3 p-8 md:p-12 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
              <div className="lg:sticky lg:top-32 space-y-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-heading font-black text-7xl md:text-8xl leading-none opacity-10">
                    {String(all.length - idx).padStart(2, '0')}
                  </span>
                  {current && (
                    <span className="bg-[#FF5F1F] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest animate-pulse whitespace-nowrap">
                      ● ACTIVE
                    </span>
                  )}
                </div>

                <div>
                  <span className="block text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">
                    PERIOD
                  </span>
                  <p className="font-heading font-bold text-2xl md:text-3xl uppercase leading-none tracking-tighter">
                    {experienceRange(exp) || exp.period}
                  </p>
                </div>

                <dl className="space-y-4 border-t-4 border-black pt-6">
                  {[
                    { label: 'LOCATION', value: exp.location },
                    { label: 'INDUSTRY', value: exp.industry },
                    { label: 'TEAM_SIZE', value: exp.teamSize },
                  ]
                    .filter((row) => row.value)
                    .map((row) => (
                      <div key={row.label}>
                        <dt className="text-[10px] font-black uppercase tracking-widest opacity-40">
                          {row.label}
                        </dt>
                        <dd className="font-bold uppercase text-sm mt-1">{row.value}</dd>
                      </div>
                    ))}
                </dl>

                {exp.website && (
                  <a
                    href={exp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between gap-4 w-full bg-black text-white px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-colors"
                  >
                    COMPANY_SITE <span>↗</span>
                  </a>
                )}
              </div>
            </aside>

            {/* Body */}
            <div className="w-full lg:w-2/3 p-8 md:p-12 space-y-10">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.9] tracking-tighter">
                  {exp.role}
                </h2>
                <p className="mt-4 font-heading font-bold text-xl md:text-2xl uppercase tracking-widest text-[#FF5F1F]">
                  {exp.company}
                </p>
              </div>

              {exp.description && (
                <p className="text-lg md:text-xl leading-relaxed opacity-70 max-w-3xl">
                  {exp.description}
                </p>
              )}

              {exp.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {(exp.responsibilities?.length > 0 || exp.achievements?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 border-4 border-black divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
                  {exp.responsibilities?.length > 0 && (
                    <div className="p-6 md:p-8">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6">
                        MANDATE
                      </h3>
                      <ul className="space-y-4">
                        {exp.responsibilities.map((r, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="font-black opacity-30 shrink-0">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm md:text-base leading-relaxed">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {exp.achievements?.length > 0 && (
                    <div className="p-6 md:p-8 bg-black text-white">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF5F1F] mb-6">
                        OUTPUT
                      </h3>
                      <ul className="space-y-4">
                        {exp.achievements.map((a, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="font-black text-[#FF5F1F] shrink-0">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm md:text-base leading-relaxed">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {exp.projects?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                    PRODUCTS_SHIPPED
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exp.projects.map((pr) => (
                      <div
                        key={pr._id ?? pr.name}
                        className="border-4 border-black p-6 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <h4 className="text-xl font-black uppercase tracking-tighter mb-3">
                          {pr.name}
                        </h4>
                        {pr.description && (
                          <p className="text-sm leading-relaxed opacity-70">{pr.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}

      {!isLoading && all.length === 0 && (
        <div className="p-24 text-center">
          <p className="text-4xl font-black uppercase opacity-20">NO_POSTINGS_LOGGED</p>
        </div>
      )}

      <div className="p-8 md:p-16 flex flex-col md:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="text-center bg-black text-white px-12 py-6 text-lg font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-all"
        >
          BACK_TO_SYSTEM_ROOT
        </Link>
        <Link
          href="/#contact"
          className="text-center border-4 border-black px-12 py-6 text-lg font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
        >
          HIRE_ME
        </Link>
      </div>
    </section>
  );
};

export default CareerLog;
