
import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

interface BlogPostProps {
  slug: string;
  onBack: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ slug, onBack }) => {
  const { data } = usePortfolio();
  const blog = data.blogs.find(b => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-12 space-y-8">
        <h1 className="text-6xl font-black uppercase">POST_NOT_FOUND</h1>
        <button onClick={onBack} className="bg-[#FF5F1F] text-black px-12 py-6 font-black uppercase">BACK_TO_INDEX</button>
      </div>
    );
  }

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h2 key={i} className="text-4xl md:text-6xl font-black uppercase mt-12 mb-6 tracking-tighter">{line.replace('# ', '')}</h2>;
      if (line.startsWith('## ')) return <h3 key={i} className="text-2xl md:text-4xl font-black uppercase mt-8 mb-4 tracking-tight">{line.replace('## ', '')}</h3>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-xl md:text-2xl leading-relaxed mb-6 font-medium">{line}</p>;
    });
  };

  return (
    <article className="min-h-screen bg-white selection:bg-black selection:text-[#FF5F1F]">
      <header className="border-b-4 border-black p-8 md:p-12 sticky top-0 bg-white z-40 flex justify-between items-center">
        <div className="flex gap-4 md:gap-8">
          <button 
            onClick={onBack}
            className="font-black uppercase tracking-widest hover:text-[#FF5F1F] transition-colors"
          >
            [ ← JOURNAL ]
          </button>
          <a 
            href="#"
            className="font-black uppercase tracking-widest hover:text-[#FF5F1F] transition-colors hidden md:block"
          >
            [ HOME ]
          </a>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 hidden lg:block">
          READ_MODE // {blog.slug.toUpperCase()}
        </span>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-32">
        <div className="mb-16 space-y-4">
          <span className="bg-[#FF5F1F] text-white px-4 py-2 font-black text-xs uppercase tracking-widest">
            {blog.date}
          </span>
          <h1 className="text-6xl md:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter">
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
            <p className="text-3xl font-black uppercase tracking-tighter">{data.profile.name} {data.profile.lastName}</p>
            <p className="text-lg font-bold uppercase opacity-60">{data.profile.discipline}</p>
          </div>
          <div className="flex flex-col w-full md:w-auto gap-4">
            <button 
              onClick={onBack}
              className="w-full md:w-auto bg-black text-white px-16 py-8 text-2xl font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-all"
            >
              BACK_TO_LOG_INDEX
            </button>
            <a 
              href="#"
              className="w-full md:w-auto text-center border-4 border-black px-16 py-4 text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              SYSTEM_REBOOT (HOME)
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
