'use client';

import React, { useState } from 'react';
import { useGetSkillsQuery } from '@/services/api';
import { SkillsSkeleton } from '@/components/skeletons';
import type { Skill } from '@/types';

/** Skills listed per category before the rest collapse behind the expander. */
const SKILLS_SHOWN = 5;

const SkillsSection: React.FC = () => {
  const { data: skills = [], isLoading } = useGetSkillsQuery();
  const [expanded, setExpanded] = useState<string[]>([]);

  if (isLoading) return <SkillsSkeleton />;

  const toggle = (id: string) =>
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section id="skills" className="border-b-4 border-black">
      <div className="bg-[#FF5F1F] p-8 border-b-4 border-black">
        <h2 className="text-white font-heading font-bold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tighter">TECHNICAL ARSENAL</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-black">
        {(skills as Skill[]).map((skillGroup) => {
          const isOpen = expanded.includes(skillGroup._id);
          const shown = isOpen ? skillGroup.items : skillGroup.items.slice(0, SKILLS_SHOWN);
          const overflow = skillGroup.items.length - shown.length;

          return (
            <div key={skillGroup._id} className="flex flex-col">
              <div className="p-6 bg-gray-100 border-b-4 border-black">
                <h3 className="text-xs font-black uppercase tracking-widest opacity-60">{skillGroup.category}</h3>
              </div>

              <div className="flex-1 p-6 space-y-4">
                {shown.map((skill) => (
                  <div key={skill} className="flex items-center justify-between group">
                    <span className="text-2xl font-black uppercase tracking-tight group-hover:text-[#FF5F1F] transition-colors">
                      {skill}
                    </span>
                    <div className="h-4 w-4 bg-black opacity-10 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>

              {skillGroup.items.length > SKILLS_SHOWN && (
                <button
                  onClick={() => toggle(skillGroup._id)}
                  aria-expanded={isOpen}
                  aria-label={
                    isOpen
                      ? `Collapse ${skillGroup.category}`
                      : `Show ${overflow} more ${skillGroup.category} skills`
                  }
                  className="group/btn w-full border-t-4 border-black p-5 flex items-center justify-between gap-4 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors"
                >
                  <span>{isOpen ? 'COLLAPSE' : `${overflow} MORE`}</span>
                  <span
                    aria-hidden="true"
                    className={`flex items-center justify-center h-8 w-8 border-4 border-current text-xl leading-none transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : 'group-hover/btn:rotate-90'
                    }`}
                  >
                    +
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SkillsSection;
