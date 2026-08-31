'use client';

import React from 'react';
import Link from 'next/link';
import { useGetEducationQuery } from '@/services/api';
import { AcademiaSkeleton } from '@/components/skeletons';
import { sortEducation, ACADEMIA_SHOWN } from '@/lib/education';
import type { Education } from '@/types';

const AcademiaSection: React.FC = () => {
  const { data: education = [], isLoading } = useGetEducationQuery();
  const all = sortEducation((education as Education[]).filter((e) => e.visible));
  const visibleEducation = all.slice(0, ACADEMIA_SHOWN);

  if (isLoading) return <AcademiaSkeleton />;

  if (all.length === 0) return null;

  return (
    <section id="academia" className="border-b-4 border-black flex flex-col md:flex-row bg-gray-50">
      <div className="w-full md:w-1/3 p-12 border-b-4 md:border-b-0 md:border-r-4 border-black">
        <div className="sticky top-32 flex flex-col items-start gap-8">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl uppercase leading-none">ACADEMIA</h2>
          {all.length > 0 && (
            <Link
              href="/education"
              className="bg-black text-white px-8 py-4 text-sm font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-colors whitespace-nowrap"
            >
              VIEW ALL [{all.length}] →
            </Link>
          )}
        </div>
      </div>
      <div className="w-full md:w-2/3 divide-y-4 divide-black">
        {visibleEducation.map((edu) => (
          <Link
            key={edu._id}
            href="/education"
            className="block p-12 hover:bg-white transition-colors duration-300"
          >
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-4 gap-2">
                <h4 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter break-words">{edu.degree}</h4>
                <span className="font-bold text-[#FF5F1F] whitespace-nowrap">{edu.period || edu.year}</span>
            </div>
            <p className="font-heading font-bold text-xl uppercase mb-4 text-black opacity-80">{edu.institution}</p>
            <p className="text-lg opacity-70 max-w-2xl">{edu.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AcademiaSection;
