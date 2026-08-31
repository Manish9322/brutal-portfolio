'use client';

import React from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useGetBlogsQuery, useGetProfileQuery } from '@/services/api';
import type { Blog } from '@/types';

interface BlogPostViewProps {
  slug: string;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ slug }) => {
  const { data: blogs = [], isLoading } = useGetBlogsQuery();
  const { data: profile } = useGetProfileQuery();
  const blog = (blogs as Blog[]).find((b) => b.slug === slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-12">
        <p className="text-4xl font-black uppercase opacity-20">LOADING_LOG_ENTRY...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-12 space-y-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-center">POST_NOT_FOUND</h1>
        <Link href="/journal" className="bg-[#FF5F1F] text-black px-12 py-6 font-black uppercase">BACK_TO_INDEX</Link>
      </div>
    );
  }

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h2 key={i} className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase mt-12 mb-6 tracking-tighter">{line.replace('# ', '')}</h2>;
      if (line.startsWith('## ')) return <h3 key={i} className="text-2xl md:text-4xl font-black uppercase mt-8 mb-4 tracking-tight">{line.replace('## ', '')}</h3>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-xl md:text-2xl leading-relaxed mb-6 font-medium">{line}</p>;
    });
  };

  return (
    <article className="min-h-screen bg-white selection:bg-black selection:text-[#FF5F1F]">
      <TopBar
        left={
          <>
            <Link
              href="/journal"
              className="text-xs sm:text-sm font-black uppercase tracking-widest hover:text-[#FF5F1F] transition-colors"
            >
              [ ← JOURNAL ]
            </Link>
            <Link
              href="/"
              className="text-xs sm:text-sm font-black uppercase tracking-widest hover:text-[#FF5F1F] transition-colors hidden md:block"
            >
              [ HOME ]
            </Link>
          </>
        }
        right={
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hidden lg:block truncate max-w-[40vw]">
            READ_MODE // {blog.slug.toUpperCase()}
          </span>
        }
      />

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-32">
        <div className="mb-16 space-y-4">
          <span className="bg-[#FF5F1F] text-white px-4 py-2 font-black text-xs uppercase tracking-widest">
            {blog.date}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter">
            {blog.title}
          </h1>
        </div>

        <div className="border-l-8 border-black pl-8 md:pl-16 py-8 italic text-3xl md:text-4xl font-bold uppercase leading-tight mb-16">
          {blog.excerpt}
        </div>

        <div className="prose prose-xl max-w-none mb-24">
          {renderContent(blog.content)}
        </div>

        <div className="mt-24 border-t-8 border-black pt-16 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <p className="text-xs font-black uppercase opacity-40">AUTHOR</p>
            <p className="text-3xl font-black uppercase tracking-tighter">{profile?.name ?? ''} {profile?.lastName ?? ''}</p>
            <p className="text-lg font-bold uppercase opacity-60">{profile?.discipline ?? ''}</p>
          </div>
          <div className="flex flex-col w-full md:w-auto gap-4">
            <Link
              href="/journal"
              className="w-full md:w-auto text-center bg-black text-white px-16 py-8 text-2xl font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-all"
            >
              BACK_TO_LOG_INDEX
            </Link>
            <Link
              href="/"
              className="w-full md:w-auto text-center border-4 border-black px-16 py-4 text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              SYSTEM_REBOOT (HOME)
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostView;
