'use client';

import React from 'react';
import Link from 'next/link';
import { useGetProjectQuery, useGetProjectsQuery } from '@/services/api';
import { sortProjects } from '@/lib/projects';
import ProjectImage from '@/components/ProjectImage';
import TopBar from '@/components/TopBar';
import type { Project } from '@/types';
import { cdn, cdnSrcSet } from '@/lib/image-url';

const isUrl = (v?: string) => !!v && /^https?:\/\//i.test(v);

const ProjectDetail: React.FC<{ id: string }> = ({ id }) => {
  const { data: project, isLoading, isError } = useGetProjectQuery(id);
  const { data: allProjects = [] } = useGetProjectsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-12">
        <p className="text-4xl font-black uppercase opacity-20">LOADING_CASE_FILE...</p>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-12 space-y-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-center">PROJECT_NOT_FOUND</h1>
        <Link href="/work" className="bg-[#FF5F1F] text-black px-12 py-6 font-black uppercase">
          BACK_TO_ARCHIVE
        </Link>
      </div>
    );
  }

  const p = project as Project;
  const siblings = sortProjects((allProjects as Project[]).filter((x) => x.visible));
  const index = siblings.findIndex((x) => x._id === p._id);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  const meta = [
    { label: 'YEAR', value: p.year },
    { label: 'ROLE', value: p.role || p.category },
    { label: 'TEAM_SIZE', value: p.team },
    { label: 'TIMELINE', value: p.timeline },
  ].filter((m) => m.value);

  const screenshots = (p.screenshots || []).filter((s) => isUrl(s.url));

  return (
    <article className="min-h-screen bg-white selection:bg-black selection:text-[#FF5F1F]">
      <TopBar
        left={
          <>
            <Link href="/work" className="text-xs sm:text-sm font-black uppercase tracking-widest hover:text-[#FF5F1F] transition-colors">
              [ ← WORKS ]
            </Link>
            <Link href="/" className="text-xs sm:text-sm font-black uppercase tracking-widest hover:text-[#FF5F1F] transition-colors hidden md:block">
              [ HOME ]
            </Link>
          </>
        }
        right={
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hidden lg:block">
            CASE_FILE // {String(index + 1).padStart(2, '0')}
          </span>
        }
      />

      {/* Title block */}
      <div className="p-8 md:p-24 border-b-4 border-black">
        <span className="bg-[#FF5F1F] text-white px-4 py-2 font-black text-xs uppercase tracking-widest">
          {p.category}
        </span>
        {/* The desktop title is 7vw with leading-[0.85], so its glyphs sit high
            and swallow the gap — it needs more breathing room than small screens. */}
        <h1 className="mt-6 md:mt-10 lg:mt-12 text-3xl sm:text-4xl md:text-[7vw] font-black uppercase leading-[0.85] tracking-tighter break-words">
          {p.title}
        </h1>
        <p className="mt-8 text-xl md:text-3xl font-bold uppercase leading-tight max-w-4xl opacity-70">
          {p.description}
        </p>
      </div>

      {/* Meta strip */}
      {meta.length > 0 && (
        <div className="border-b-4 border-black grid grid-cols-2 lg:grid-cols-4 divide-x-0 lg:divide-x-4 divide-black">
          {meta.map((m, i) => (
            <div
              key={m.label}
              className={`p-8 border-black ${i < meta.length - 1 ? 'border-b-4 lg:border-b-0' : ''} ${i % 2 === 0 ? 'border-r-4 lg:border-r-0' : ''}`}
            >
              <span className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                {m.label}
              </span>
              <p className="text-lg md:text-xl font-black uppercase leading-tight">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Hero image */}
      <div className="border-b-4 border-black bg-gray-100 h-[40vh] md:h-[60vh]">
        <ProjectImage
          src={p.image}
          alt={p.title}
          label={p.title}
          width={1400}
          priority
          className="w-full h-full object-cover"
        />
      </div>

      {/* Links + stack */}
      <div className="border-b-4 border-black flex flex-col lg:flex-row">
        <div className="lg:w-2/3 p-8 md:p-16 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-6">TECH_STACK</h2>
          <div className="flex flex-wrap gap-3">
            {p.techStack?.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="lg:w-1/3 flex flex-col divide-y-4 divide-black">
          {isUrl(p.liveUrl) && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-8 bg-[#FF5F1F] text-white font-black uppercase tracking-widest text-xl hover:bg-black transition-colors flex items-center justify-between"
            >
              LIVE_DEPLOY <span>↗</span>
            </a>
          )}
          {isUrl(p.githubUrl) && (
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-8 bg-black text-white font-black uppercase tracking-widest text-xl hover:bg-[#FF5F1F] transition-colors flex items-center justify-between"
            >
              SOURCE_CODE <span>↗</span>
            </a>
          )}
          {!isUrl(p.liveUrl) && !isUrl(p.githubUrl) && (
            <div className="flex-1 p-8 flex items-center justify-center">
              <span className="font-black uppercase opacity-20 text-center">NO_PUBLIC_ENDPOINTS</span>
            </div>
          )}
        </div>
      </div>

      {/* Overview */}
      {p.longDescription && (
        <section className="border-b-4 border-black flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-8 md:p-12 bg-gray-100 border-b-4 md:border-b-0 md:border-r-4 border-black">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase leading-none sticky top-32">
              THE<br />BRIEF
            </h2>
          </div>
          <div className="w-full md:w-2/3 p-8 md:p-16">
            {p.longDescription.split('\n').filter((l) => l.trim()).map((para, i) => (
              <p key={i} className="text-lg md:text-2xl leading-relaxed mb-6 font-medium">
                {para}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Challenges vs solutions */}
      {(p.challenges?.length > 0 || p.solutions?.length > 0) && (
        <section className="border-b-4 border-black grid grid-cols-1 lg:grid-cols-2 divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-black">
          <div className="p-8 md:p-16 bg-black text-white">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase leading-none mb-10 text-[#FF5F1F]">
              FRICTION
            </h2>
            <ol className="space-y-8">
              {p.challenges?.map((c, i) => (
                <li key={i} className="flex gap-6">
                  <span className="text-3xl font-black opacity-30 leading-none shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-lg leading-relaxed font-medium">{c}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="p-8 md:p-16 bg-white">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase leading-none mb-10">
              RESOLUTION
            </h2>
            <ol className="space-y-8">
              {p.solutions?.map((s, i) => (
                <li key={i} className="flex gap-6">
                  <span className="text-3xl font-black text-[#FF5F1F] leading-none shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-lg leading-relaxed font-medium">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <section className="border-b-4 border-black">
          <div className="p-8 border-b-4 border-black bg-black text-white">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl uppercase leading-none">
              SCREEN<br />CAPTURES
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
            {screenshots.map((shot, i) => (
              <figure key={shot._id ?? i} className="group flex flex-col">
                <div className="relative aspect-video overflow-hidden border-b-4 border-black bg-gray-100">
                  <img
                    src={cdn(shot.url, { width: 900 })}
                    srcSet={cdnSrcSet(shot.url, 900)}
                    alt={shot.caption || `${p.title} screenshot ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <figcaption className="p-6 font-black uppercase text-sm tracking-tighter group-hover:bg-[#FF5F1F] group-hover:text-white transition-colors flex-1">
                  <span className="text-[10px] opacity-40 block mb-1">CAPTURE_{String(i + 1).padStart(2, '0')}</span>
                  {shot.caption || p.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Prev / next */}
      <nav className="grid grid-cols-1 md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black border-b-4 border-black">
        {prev ? (
          <Link href={`/work/${prev._id}`} className="group p-8 md:p-12 hover:bg-black hover:text-white transition-colors">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 block mb-3">← PREVIOUS</span>
            <p className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{prev.title}</p>
          </Link>
        ) : (
          <div className="p-8 md:p-12 opacity-20 flex items-center">
            <span className="font-black uppercase text-sm">START_OF_ARCHIVE</span>
          </div>
        )}
        {next ? (
          <Link href={`/work/${next._id}`} className="group p-8 md:p-12 text-right hover:bg-black hover:text-white transition-colors">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 block mb-3">NEXT →</span>
            <p className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{next.title}</p>
          </Link>
        ) : (
          <div className="p-8 md:p-12 opacity-20 flex items-center justify-end">
            <span className="font-black uppercase text-sm">END_OF_ARCHIVE</span>
          </div>
        )}
      </nav>

      <div className="p-8 md:p-16 flex flex-col md:flex-row gap-4 justify-center">
        <Link
          href="/work"
          className="text-center bg-black text-white px-12 py-6 text-lg font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-all"
        >
          BACK_TO_ALL_WORKS
        </Link>
        <Link
          href="/#contact"
          className="text-center border-4 border-black px-12 py-6 text-lg font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
        >
          START_A_PROJECT
        </Link>
      </div>
    </article>
  );
};

export default ProjectDetail;
