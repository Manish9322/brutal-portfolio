
import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ContactMessage } from '../../../types';

const MessagesPage: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const [viewing, setViewing] = useState<ContactMessage | null>(null);

  const toggleRead = (id: string) => {
    const updated = data.messages.map(m => 
      m.id === id ? { ...m, read: true } : m
    );
    updateData({ messages: updated });
    if (viewing?.id === id) setViewing({ ...viewing, read: true });
  };

  const deleteMessage = (id: string) => {
    if (window.confirm('PURGE_MESSAGE_PERMANENTLY?')) {
      const updated = data.messages.filter(m => m.id !== id);
      updateData({ messages: updated });
      if (viewing?.id === id) setViewing(null);
    }
  };

  const openMessage = (msg: ContactMessage) => {
    setViewing(msg);
    if (!msg.read) toggleRead(msg.id);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="border-b-4 border-black pb-8">
        <h2 className="font-heading font-black text-6xl uppercase tracking-tighter">INCOMING_COMMS</h2>
        <p className="mt-4 text-xl font-bold uppercase text-[#FF5F1F]">
          {data.messages.filter(m => !m.read).length} UNREAD TRANSMISSIONS
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* List View */}
        <div className={`w-full ${viewing ? 'lg:w-1/3' : 'w-full'} space-y-4`}>
          <div className="divide-y-4 divide-black border-4 border-black">
            {data.messages.length > 0 ? (
              data.messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`w-full p-6 text-left transition-all relative overflow-hidden group ${
                    viewing?.id === msg.id ? 'bg-[#FF5F1F] text-white' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-black uppercase ${viewing?.id === msg.id ? 'text-white' : 'text-[#FF5F1F]'}`}>
                      {new Date(msg.date).toLocaleDateString()}
                    </span>
                    {!msg.read && <span className="h-2 w-2 bg-[#FF5F1F] border border-black animate-pulse"></span>}
                  </div>
                  <h4 className="text-xl font-black uppercase truncate">{msg.name}</h4>
                  <p className={`text-xs font-bold opacity-60 truncate ${viewing?.id === msg.id ? 'text-white' : ''}`}>
                    {msg.email}
                  </p>
                  <div className="mt-4 text-[10px] font-black opacity-30 group-hover:opacity-100 uppercase tracking-widest">
                    OPEN_LOG →
                  </div>
                </button>
              ))
            ) : (
              <div className="p-12 text-center bg-gray-50">
                <p className="text-2xl font-black uppercase opacity-20">NO_TRANSMISSIONS_DETECTED</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Content */}
        {viewing && (
          <div className="flex-1 border-4 border-black p-8 md:p-12 bg-white animate-in slide-in-from-right-10 duration-300">
            <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-8">
               <div className="space-y-4">
                  <span className="bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                    ENTRY_ID_{viewing.id}
                  </span>
                  <h3 className="text-5xl font-black uppercase tracking-tighter leading-none">{viewing.name}</h3>
                  <p className="text-2xl font-bold text-[#FF5F1F]">{viewing.email}</p>
               </div>
               <div className="flex flex-col gap-2">
                  <button onClick={() => setViewing(null)} className="text-xs font-black hover:text-[#FF5F1F] uppercase">CLOSE_X</button>
                  <button onClick={() => deleteMessage(viewing.id)} className="text-xs font-black text-red-600 hover:text-black uppercase">PURGE_!</button>
               </div>
            </div>
            
            <div className="space-y-8">
               <div className="text-xs font-black uppercase opacity-40">MESSAGE_PAYLOAD:</div>
               <div className="p-8 border-l-8 border-black bg-gray-50 text-2xl font-medium leading-relaxed italic">
                 "{viewing.message}"
               </div>
               <div className="pt-12 flex justify-between items-center text-[10px] font-black uppercase opacity-20">
                  <span>RECEIVED: {new Date(viewing.date).toLocaleString()}</span>
                  <span>STATUS: LOGGED_AND_ARCHIVED</span>
               </div>
            </div>

            <div className="mt-12 pt-12 border-t-4 border-black">
               <a 
                 href={`mailto:${viewing.email}`}
                 className="inline-block bg-black text-white px-12 py-6 text-xl font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-all"
               >
                 RESPOND_VIA_MAIL
               </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
