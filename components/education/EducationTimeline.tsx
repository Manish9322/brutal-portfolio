'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useGetEducationQuery } from '@/services/api';
import { sortEducation, formatRange } from '@/lib/education';
import type { Education } from '@/types';

const FILTERS = [
  { id: 'all', label: 'ALL' },
  { id: 'degree', label: 'DEGREES' },
  { id: 'certification', label: 'CERTIFICATES' },
  { id: 'course', label: 'COURSES' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

const TYPE_LABEL: Record<string, string> = {
  degree: 'DEGREE',
  certification: 'CERTIFICATE',
  course: 'COURSE',
};

const EducationTimeline: React.FC = () => {
  const { data: education = [], isLoading } = useGetEducationQuery();
  const [filter, setFilter] = useState<FilterId>('all');

  const all = useMemo(
    () => sortEducation((education as Education[]).filter((e) => e.visible)),
    [education]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length };
    for (const item of all) c[item.type] = (c[item.type] ?? 0) + 1;
    return c;
  }, [all]);

  const shown = filter === 'all' ? all : all.filter((e) => e.type === filter);
  const availableFilters = FILTERS.filter((f) => f.id === 'all' || counts[f.id]);

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
          ARCHIVE_MODE // CREDENTIALS
        </span>
      </header>

      <div className="p-8 md:p-24 border-b-4 border-black bg-black text-white">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-9xl uppercase leading-none tracking-tighter">
          THE<br />RECORD
        </h1>
        <p className="mt-4 text-xl font-bold text-[#FF5F1F] uppercase tracking-widest">
          {counts.degree ?? 0} QUALIFICATIONS / {counts.certification ?? 0} CERTIFICATIONS
        </p>
      </div>

      {availableFilters.length > 2 && (
        <div className="border-b-4 border-black flex flex-wrap divide-x-4 divide-black">
          {availableFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-6 md:px-10 py-6 text-xs font-black uppercase tracking-widest transition-colors ${
                filter === f.id ? 'bg-[#FF5F1F] text-white' : 'hover:bg-gray-100'
              }`}
            >
              {f.label}
              <span className="ml-3 opacity-40">[{counts[f.id] ?? 0}]</span>
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="p-24 text-center">
          <p className="text-4xl font-black uppercase opacity-20">LOADING_RECORD...</p>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* The spine: a hard vertical rule the entries hang off */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-black md:-translate-x-1/2" aria-hidden="true" />

        {shown.map((item, idx) => {
          const isCert = item.type === 'certification';
          const onRight = idx % 2 === 1;

          return (
            <article
              key={item._id}
              className="relative pl-20 pr-6 md:px-0 py-10 md:py-16 md:grid md:grid-cols-2 md:gap-0"
            >
              {/* Node marker on the spine */}
              <div
                className={`absolute left-8 md:left-1/2 top-14 md:top-20 -translate-x-1/2 z-10 flex items-center justify-center
                  w-8 h-8 border-4 border-black rotate-45 ${isCert ? 'bg-[#FF5F1F]' : 'bg-white'}`}
                aria-hidden="true"
              />

              {/* Date rail — sits opposite the card */}
              <div className={`hidden md:flex items-start pt-16 ${onRight ? 'md:order-1 justify-end pr-16' : 'md:order-2 justify-start pl-16'}`}>
                <div className={onRight ? 'text-right' : 'text-left'}>
                  <span className="block text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">
                    {TYPE_LABEL[item.type] ?? 'ENTRY'}
                  </span>
                  <p className="font-heading font-bold text-3xl lg:text-4xl uppercase leading-none tracking-tighter">
                    {formatRange(item)}
                  </p>
                  {item.location && (
                    <p className="mt-3 text-sm font-bold uppercase opacity-50">{item.location}</p>
                  )}
                  {item.gpa && (
                    <p className="mt-4 inline-block bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-widest">
                      SCORE {item.gpa}
                    </p>
                  )}
                </div>
              </div>

              {/* Card */}
              <div className={onRight ? 'md:order-2' : 'md:order-1'}>
                <div
                  className={`border-4 border-black bg-white p-8 md:p-10 transition-all duration-300
                    hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
                    ${onRight ? 'md:ml-16' : 'md:mr-16'}`}
                >
                  {/* Mobile-only meta, since the date rail is hidden there */}
                  <div className="md:hidden mb-5 flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 border-2 border-black text-[10px] font-black uppercase tracking-widest ${isCert ? 'bg-[#FF5F1F] text-white' : 'bg-white'}`}>
                      {TYPE_LABEL[item.type] ?? 'ENTRY'}
                    </span>
                    <span className="text-xs font-black uppercase opacity-60">{formatRange(item)}</span>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-black uppercase leading-none tracking-tighter">
                    {item.degree}
                  </h2>
                  {item.field && (
                    <p className="mt-3 text-sm font-black uppercase tracking-widest text-[#FF5F1F]">
                      {item.field}
                    </p>
                  )}
                  <p className="mt-4 font-heading font-bold text-lg uppercase opacity-80 leading-tight">
                    {item.institution}
                  </p>

                  {item.description && (
                    <p className="mt-6 text-base md:text-lg leading-relaxed opacity-70">
                      {item.description}
                    </p>
                  )}

                  {item.achievements?.length > 0 && (
                    <ul className="mt-8 space-y-3 border-t-4 border-black pt-6">
                      {item.achievements.map((a, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="font-black text-[#FF5F1F] shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm md:text-base leading-relaxed">{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3 md:hidden">
                    {item.gpa && (
                      <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-widest">
                        SCORE {item.gpa}
                      </span>
                    )}
                    {item.location && (
                      <span className="border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest">
                        {item.location}
                      </span>
                    )}
                  </div>

                  {(item.certificateUrl || item.website) && (
                    <div className="mt-8 flex flex-wrap gap-4">
                      {item.certificateUrl && (
                        <a
                          href={item.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#FF5F1F] text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-black transition-colors"
                        >
                          VIEW_CERTIFICATE ↗
                        </a>
                      )}
                      {item.website && (
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-4 border-black px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                        >
                          INSTITUTION ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {/* Terminator */}
        {shown.length > 0 && (
          <div className="relative pl-20 md:pl-0 pb-16 md:text-center">
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 md:-translate-x-1/2 w-6 h-6 bg-black" aria-hidden="true" />
            <p className="pt-12 text-[10px] font-black uppercase tracking-[0.5em] opacity-30">
              START_OF_RECORD
            </p>
          </div>
        )}
      </div>

      {!isLoading && shown.length === 0 && (
        <div className="p-24 text-center">
          <p className="text-4xl font-black uppercase opacity-20">NO_ENTRIES_OF_THIS_TYPE</p>
        </div>
      )}

      <div className="p-8 md:p-16 border-t-4 border-black flex flex-col md:flex-row gap-4 justify-center">
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
          GET_IN_TOUCH
        </Link>
      </div>
    </section>
  );
};

export default EducationTimeline;
