'use client';

import React, { useState } from 'react';
import { generateBrutalistStatement } from '@/services/geminiService';

const AIPromptSection: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [statement, setStatement] = useState('THE SYSTEM AWAITS YOUR INPUT.');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    const result = await generateBrutalistStatement(topic);
    setStatement(result);
    setLoading(false);
  };

  return (
    <section className="bg-black text-white p-12 md:p-24 border-b-4 border-black">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter text-[#FF5F1F]">
            MANIFESTO<br />ENGINE
          </h2>
          <p className="text-xl font-bold uppercase opacity-60">CHALLENGE THE SYSTEM. ENTER A TOPIC TO GENERATE A RAW STATEMENT.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-0 border-4 border-white">
          <input
            type="text"
            value={topic}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="ENTER TOPIC (e.g. CLEAN CODE, WEB3, AI...)"
            className="flex-1 bg-transparent text-white p-6 font-black uppercase text-xl focus:outline-none focus:bg-[#FF5F1F]/10 placeholder:opacity-20"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-[#FF5F1F] text-white px-12 py-6 font-black uppercase text-xl hover:bg-white hover:text-[#FF5F1F] transition-all disabled:opacity-50 border-t-4 md:border-t-0 md:border-l-4 border-white"
          >
            {loading ? 'PROCESSING...' : 'EXECUTE'}
          </button>
        </div>

        <div className="border-4 border-dashed border-white/20 p-12 min-h-[250px] flex items-center justify-center text-center bg-white/5">
          <p className="text-3xl md:text-5xl font-black uppercase leading-tight tracking-tighter">
            "{statement}"
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIPromptSection;
