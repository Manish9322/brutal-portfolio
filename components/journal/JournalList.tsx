'use client';

import React from 'react';
import Link from 'next/link';
import { useGetBlogsQuery } from '@/services/api';
import type { Blog } from '@/types';

const JournalList: React.FC = () => {
  const { data: blogs = [] } = useGetBlogsQuery();
  const publishedBlogs = (blogs as Blog[])
    .filter((b) => b.published)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section id="journal" className="border-b-4 border-black min-h-screen bg-white">
      <header className="border-b-4 border-black p-8 md:p-12 sticky top-0 bg-white z-40 flex justify-between items-center">
        <Link
          href="/"
          className="font-black uppercase tracking-widest hover:text-[#FF5F1F] transition-colors border-b-4 border-black"
        >
          [ ← EXIT_TO_SYSTEM_ROOT ]
        </Link>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 hidden md:block">
          ARCHIVE_MODE // LOG_INDEX
        </span>
      </header>

      <div className="p-8 md:p-24 border-b-4 border-black bg-black text-white">
        <h2 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-9xl uppercase leading-none tracking-tighter">
          JOURNAL
        </h2>
        <p className="mt-4 text-xl font-bold text-[#FF5F1F] uppercase tracking-widest">
          RAW ARCHITECTURAL THOUGHTS & SYSTEM LOGS
        </p>
      </div>

      <div className="divide-y-4 divide-black">
        {publishedBlogs.length > 0 ? (
          publishedBlogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/journal/${blog.slug}`}
              className="group block p-8 md:p-16 hover:bg-[#FF5F1F] transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4 flex-1">
                  <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 group-hover:text-black">
                    LOG_ENTRY // {blog.date}
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-none tracking-tighter group-hover:text-white transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-xl md:text-2xl font-bold opacity-60 max-w-3xl group-hover:opacity-100 group-hover:text-black/80">
                    {blog.excerpt}
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-24 h-24 border-4 border-black group-hover:bg-black group-hover:text-white transition-all transform group-hover:rotate-90">
                  <span className="text-4xl font-black">→</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-24 text-center">
            <p className="text-4xl font-black uppercase opacity-20">NO_LOGS_AVAILABLE</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JournalList;
