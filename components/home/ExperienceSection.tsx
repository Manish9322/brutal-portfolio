'use client';

import React from 'react';
import Link from 'next/link';
import { useGetExperiencesQuery } from '@/services/api';
import { ExperienceSkeleton } from '@/components/skeletons';
import { sortExperience, experienceRange, HISTORY_SHOWN } from '@/lib/experience';
import type { Experience } from '@/types';

const ExperienceSection: React.FC = () => {
  const { data: allExperiences = [], isLoading } = useGetExperiencesQuery();
  const all = sortExperience((allExperiences as Experience[]).filter((exp) => exp.visible));
  const experiences = all.slice(0, HISTORY_SHOWN);

  if (isLoading) return <ExperienceSkeleton />;

  return (
    <section className="border-b-4 border-black flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 p-6 sm:p-8 md:p-12 bg-gray-100 border-b-4 md:border-b-0 md:border-r-4 border-black">
        <div className="sticky top-32 flex flex-col items-start gap-8">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl uppercase leading-none">HISTORY</h2>
          {all.length > 0 && (
            <Link
              href="/experience"
              className="bg-black text-white px-8 py-4 text-sm font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-colors whitespace-nowrap"
            >
              VIEW ALL [{all.length}] →
            </Link>
          )}
        </div>
      </div>
      <div className="w-full md:w-2/3">
        {experiences.map((exp, idx) => (
          <Link
            key={exp._id}
            href="/experience"
            className={`block p-6 sm:p-8 md:p-12 relative hover:bg-gray-50 transition-colors duration-300 ${idx !== experiences.length - 1 ? 'border-b-4 border-black' : ''}`}
          >
             <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-2">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter break-words">{exp.role}</h3>
                <span className="text-base sm:text-lg md:text-xl font-bold text-[#FF5F1F] whitespace-nowrap">{experienceRange(exp) || exp.period}</span>
             </div>
             <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-black flex-1 shrink"></div>
                {/* min-w-0 lets this shrink past its longest word; Syncopate is
                    wide enough that a long company name overflows otherwise. */}
                <span className="font-heading font-bold text-base sm:text-xl md:text-2xl tracking-widest min-w-0 break-words text-right">
                  {exp.company}
                </span>
                <div className="h-px bg-black w-4 sm:w-8 shrink-0"></div>
             </div>
             <p className="text-xl max-w-2xl leading-relaxed">
               {exp.description}
             </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
