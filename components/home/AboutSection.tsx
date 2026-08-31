'use client';

import React from 'react';
import { useGetAboutQuery } from '@/services/api';

const AboutSection: React.FC = () => {
  const { data: about } = useGetAboutQuery();

  return (
    <section id="about" className="grid grid-cols-1 md:grid-cols-2 border-b-4 border-black">
      <div className="p-12 md:p-24 bg-black text-white flex flex-col justify-center">
        <h2 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-12 uppercase leading-none">
          {(about?.manifestoHeading ?? '').split(' ').map((word: string, i: number) => (
            <React.Fragment key={i}>{word}<br /></React.Fragment>
          ))}
        </h2>
        <div className="w-24 h-4 bg-[#FF5F1F]"></div>
      </div>

      <div className="p-12 md:p-24 flex flex-col justify-center space-y-12">
        <p className="text-2xl md:text-4xl font-bold uppercase leading-tight">
          CODE IS ARCHITECTURE. IT SHOULD BE STRUCTURALLY SOUND, EFFICIENT, AND UNAPOLOGETIC.
        </p>
        <p className="text-lg md:text-xl font-medium leading-relaxed">
          {about?.description}
        </p>
        <div className="pt-8">
           <a href="#contact" className="inline-block bg-black text-white px-12 py-6 text-xl font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-all transform hover:-translate-y-1 active:translate-y-1">
             WORK WITH ME
           </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
