
import React from 'react';

const NotFound: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const memoryDump = [
    { addr: '0x00404', status: 'NOT_FOUND', payload: 'URI_STUB' },
    { addr: '0x00F1F', status: 'SEG_FAULT', payload: 'ACCENT_ERR' },
    { addr: '0x00000', status: 'NULL_PTR', payload: 'USER_LOC' },
    { addr: '0x00808', status: 'TIMEOUT', payload: 'SYS_RETRY' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 flex items-center justify-center font-heading overflow-hidden relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-4xl w-full border-[8px] border-white p-8 md:p-16 relative z-10 bg-black shadow-[20px_20px_0px_0px_#FF5F1F]">
        <div className="flex justify-between items-start mb-12">
          <span className="bg-[#FF5F1F] text-black px-4 py-2 font-black text-sm uppercase tracking-widest animate-pulse">
            CRITICAL_ERROR
          </span>
          <span className="text-white/40 text-xs font-black uppercase">SYS_LOG_V1.0.4</span>
        </div>

        <h1 className="text-[20vw] md:text-[15vw] leading-none font-black uppercase tracking-tighter mb-8 italic">
          404
        </h1>

        <div className="space-y-8">
          <div className="border-t-4 border-white pt-8">
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-4">
              RESOURCE_NOT_LOCATED
            </h2>
            <p className="text-xl md:text-2xl font-bold opacity-60 uppercase max-w-2xl">
              THE REQUESTED PATH HAS BEEN PURGED FROM THE SYSTEM OR NEVER EXISTED IN THIS ARCHITECTURE.
            </p>
          </div>

          {/* Trace Table */}
          <div className="border-4 border-white divide-y-4 divide-white overflow-hidden bg-white/5">
            <div className="grid grid-cols-3 p-4 text-[10px] font-black uppercase tracking-widest opacity-40">
              <span>MEMORY_ADDR</span>
              <span>STATUS</span>
              <span>PAYLOAD</span>
            </div>
            {memoryDump.map((line, i) => (
              <div key={i} className="grid grid-cols-3 p-4 font-mono text-xs md:text-sm group hover:bg-[#FF5F1F] hover:text-black transition-colors cursor-default">
                <span className="font-black">{line.addr}</span>
                <span className={line.status === 'NOT_FOUND' ? 'text-[#FF5F1F] group-hover:text-black' : ''}>{line.status}</span>
                <span className="opacity-50 group-hover:opacity-100">{line.payload}</span>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <button 
              onClick={onReset}
              className="w-full bg-white text-black py-8 text-3xl font-black uppercase tracking-[0.3em] hover:bg-[#FF5F1F] hover:text-white transition-all transform hover:-translate-y-2 active:translate-y-0"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        </div>

        <div className="mt-12 text-[10px] font-black uppercase opacity-20 flex justify-between">
          <span>ABORTED_DUE_TO_BAD_HASH</span>
          <span>AXEL_OS_PREVIEW</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
