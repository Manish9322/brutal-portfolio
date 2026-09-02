'use client';

import React, { useState } from 'react';
import { useGetProfileQuery, useAddMessageMutation } from '@/services/api';
import { ContactSkeleton } from '@/components/skeletons';

const ContactSection: React.FC = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [addMessage] = useAddMessageMutation();
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    try {
      await addMessage(formState).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
      return;
    }

    setSubmitted(true);
    setFormState({ name: '', email: '', message: '' });

    setTimeout(() => setSubmitted(false), 5000);
  };

  const telegram = profile?.telegram ?? '';
  // Hidden either by the admin toggle, or simply because no handle is set.
  // A profile saved before the toggle existed has no flag, which counts as visible.
  const showTelegram = profile?.telegramVisible !== false && telegram.trim() !== '';
  const telegramUrl = telegram.startsWith('@')
    ? `https://t.me/${telegram.substring(1)}`
    : `https://t.me/${telegram}`;

  return (
    <section id="contact" className="grid grid-cols-1 lg:grid-cols-2 border-b-4 border-black">
      {isLoading ? <ContactSkeleton /> : (
      <div className="p-12 md:p-24 space-y-12">
        <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-7xl lg:text-9xl uppercase leading-[0.8]">LET'S<br />TALK</h2>
        <div className="space-y-4">
           <p className="text-2xl font-bold uppercase">FOR INQUIRIES, COLLABORATIONS OR SYSTEM AUDITS.</p>
           <p className="text-xl opacity-70">Expect a direct, unfiltered response within 24 hours.</p>
        </div>
        <div className="pt-12 space-y-6">
           <div className="group border-b-4 border-black pb-4 hover:border-[#FF5F1F] transition-colors">
              <span className="block text-xs font-black uppercase opacity-50 mb-2">EMAIL</span>
              <a href={`mailto:${profile?.email ?? ''}`} className="text-3xl font-black truncate block">{profile?.email}</a>
           </div>
           {showTelegram && (
             <div className="group border-b-4 border-black pb-4 hover:border-[#FF5F1F] transition-colors">
                <span className="block text-xs font-black uppercase opacity-50 mb-2">TELEGRAM</span>
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="text-3xl font-black">{telegram}</a>
             </div>
           )}
        </div>
      </div>
      )}

      <form className="p-12 md:p-24 bg-black flex flex-col justify-center space-y-8" onSubmit={handleSubmit}>
        {submitted ? (
          <div className="bg-[#FF5F1F] text-white p-12 border-4 border-white animate-in zoom-in-95">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-4">TRANSMISSION_RECEIVED</h3>
            <p className="text-xl font-bold uppercase">YOUR MESSAGE HAS BEEN ENCRYPTED AND LOGGED. STAND BY FOR A RESPONSE.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-white text-xs font-black uppercase tracking-widest">FULL NAME</label>
              <input
                required
                type="text"
                value={formState.name}
                onChange={e => setFormState({...formState, name: e.target.value})}
                placeholder="TYPE HERE..."
                className="w-full bg-transparent border-b-4 border-white p-4 text-white text-2xl font-bold focus:outline-none focus:border-[#FF5F1F] placeholder:opacity-20 uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white text-xs font-black uppercase tracking-widest">EMAIL ADDRESS</label>
              <input
                required
                type="email"
                value={formState.email}
                onChange={e => setFormState({...formState, email: e.target.value})}
                placeholder="NAME@DOMAIN.COM"
                className="w-full bg-transparent border-b-4 border-white p-4 text-white text-2xl font-bold focus:outline-none focus:border-[#FF5F1F] placeholder:opacity-20 uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white text-xs font-black uppercase tracking-widest">MESSAGE</label>
              <textarea
                required
                rows={4}
                value={formState.message}
                onChange={e => setFormState({...formState, message: e.target.value})}
                placeholder="WHAT DO YOU NEED?"
                className="w-full bg-transparent border-b-4 border-white p-4 text-white text-2xl font-bold focus:outline-none focus:border-[#FF5F1F] placeholder:opacity-20 uppercase resize-none"
              ></textarea>
            </div>
            {/* Sized like the other primary CTAs on the site: 4px border, hard
                shadow on hover, and a type ramp instead of a fixed text-2xl,
                which wrapped and overflowed its tracking at 375px. */}
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-4 border-4 border-white bg-white text-black px-6 py-5 md:py-7 text-base sm:text-lg md:text-2xl font-black uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all hover:bg-[#FF5F1F] hover:text-white hover:border-[#FF5F1F] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] motion-reduce:hover:translate-y-0"
            >
              SEND TRANSMISSION
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </>
        )}
      </form>
    </section>
  );
};

export default ContactSection;
