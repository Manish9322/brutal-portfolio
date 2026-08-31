'use client';

import React, { useState } from 'react';
import { useGetBlogsQuery, useAddBlogMutation, useUpdateBlogMutation } from '@/services/api';
import type { Blog } from '@/types';

const BlogsPage: React.FC = () => {
  const { data: blogs = [] } = useGetBlogsQuery();
  const [addBlog] = useAddBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Blog>>({});

  const list = blogs as Blog[];

  const handleEdit = (blog: Blog) => {
    setEditing(blog._id);
    setFormData(blog);
  };

  const handleSave = async () => {
    if (editing === 'new') {
      await addBlog({
        ...formData,
        date: new Date().toISOString().split('T')[0],
        published: true,
        slug: (formData.title || '').toLowerCase().replace(/ /g, '-'),
      });
    } else {
      await updateBlog({ ...formData, _id: editing });
    }
    setEditing(null);
  };

  if (editing) {
    return (
      <div className="space-y-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b-4 border-black pb-4">
          <h3 className="text-4xl font-black uppercase tracking-tighter">{editing === 'new' ? 'WRITE_LOG' : 'EDIT_LOG'}</h3>
          <button onClick={() => setEditing(null)} className="font-black hover:text-[#FF5F1F]">DISCARD</button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase">TITLE</label>
            <input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border-4 border-black p-4 font-black text-2xl uppercase focus:border-[#FF5F1F] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase">EXCERPT (SHORT DESCRIPTION)</label>
            <input value={formData.excerpt || ''} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} className="w-full border-4 border-black p-4 font-bold text-lg outline-none focus:border-[#FF5F1F]" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase">CONTENT (MARKDOWN)</label>
            <textarea value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={12} className="w-full border-4 border-black p-6 font-mono text-lg outline-none focus:border-[#FF5F1F]" placeholder="# START WRITING..." />
          </div>
        </div>
        <button onClick={handleSave} className="w-full bg-[#FF5F1F] text-white py-8 text-2xl font-black uppercase tracking-widest hover:bg-black transition-all">PUBLISH_CHANGES</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">EDITORIAL_CONTENT</h2>
        <button onClick={() => { setEditing('new'); setFormData({ content: '' }); }} className="bg-black text-white px-8 py-4 font-black uppercase hover:bg-[#FF5F1F]">NEW_POST</button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {list.map((blog) => (
          <div key={blog._id} className="border-4 border-black p-8 group hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-black text-[#FF5F1F]">{blog.date}</span>
              <span className={`px-3 py-1 text-[10px] font-black uppercase border-2 border-black ${blog.published ? 'bg-green-100' : 'bg-gray-200'}`}>
                {blog.published ? 'LIVE' : 'DRAFT'}
              </span>
            </div>
            <h4 className="text-3xl font-black uppercase mb-4">{blog.title}</h4>
            <p className="text-lg opacity-70 mb-8 max-w-2xl">{blog.excerpt}</p>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(blog)} className="px-8 py-3 bg-black text-white font-black uppercase text-xs hover:bg-[#FF5F1F]">EDIT_CONTENT</button>
              <button onClick={() => updateBlog({ _id: blog._id, published: !blog.published })} className="px-8 py-3 border-4 border-black font-black uppercase text-xs hover:bg-black hover:text-white transition-all">
                {blog.published ? 'UNPUBLISH' : 'PUBLISH'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
