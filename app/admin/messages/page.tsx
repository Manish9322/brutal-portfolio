'use client';

import React, { useState } from 'react';
import {
  useGetMessagesQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} from '@/services/api';
import {
  PageHeader,
  Panel,
  Button,
  Badge,
  EmptyState,
  Loading,
} from '@/components/admin/ui';
import type { ContactMessage } from '@/types';

const MessagesPage: React.FC = () => {
  const { data: messages = [], isLoading } = useGetMessagesQuery();
  const [updateMessage] = useUpdateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [openId, setOpenId] = useState<string | null>(null);

  const list = messages as ContactMessage[];
  const unread = list.filter((m) => !m.read).length;
  const open = list.find((m) => m._id === openId) ?? null;

  const openMessage = (msg: ContactMessage) => {
    setOpenId(msg._id);
    if (!msg.read) updateMessage({ _id: msg._id, read: true });
  };

  const remove = async (msg: ContactMessage) => {
    if (!window.confirm(`Delete the message from ${msg.name}? This cannot be undone.`)) return;
    await deleteMessage(msg._id);
    if (openId === msg._id) setOpenId(null);
  };

  const markAllRead = () => list.filter((m) => !m.read).forEach((m) => updateMessage({ _id: m._id, read: true }));

  if (isLoading) return <Loading label="LOADING MESSAGES" />;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <PageHeader
        title="MESSAGES"
        subtitle={`${list.length} total · ${unread} unread`}
        actions={
          unread > 0 ? (
            <Button variant="ghost" onClick={markAllRead}>
              MARK ALL READ
            </Button>
          ) : (
            <Badge tone="success">ALL READ</Badge>
          )
        }
      />

      {list.length === 0 ? (
        <EmptyState label="No messages received yet" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Inbox */}
          <div className={open ? 'lg:col-span-2' : 'lg:col-span-5'}>
            <Panel title="INBOX" flush>
              <div className="divide-y-2 divide-black/10 max-h-[70vh] overflow-y-auto">
                {list.map((msg) => (
                  <button
                    key={msg._id}
                    onClick={() => openMessage(msg)}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      openId === msg._id ? 'bg-[#FF5F1F] text-white' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest ${
                          openId === msg._id ? 'text-white/70' : 'text-black/35'
                        }`}
                      >
                        {new Date(msg.date).toLocaleDateString()}
                      </span>
                      {!msg.read && (
                        <span className="h-2 w-2 bg-[#FF5F1F] border border-black shrink-0" aria-label="Unread" />
                      )}
                    </div>
                    <p className="text-xs font-black uppercase tracking-tight truncate">{msg.name}</p>
                    <p
                      className={`text-[10px] font-bold truncate ${
                        openId === msg._id ? 'text-white/70' : 'text-black/40'
                      }`}
                    >
                      {msg.email}
                    </p>
                  </button>
                ))}
              </div>
            </Panel>
          </div>

          {/* Reading pane */}
          {open && (
            <div className="lg:col-span-3">
              <Panel
                title="MESSAGE"
                actions={
                  <>
                    <Button size="sm" variant="ghost" onClick={() => setOpenId(null)}>
                      CLOSE
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => remove(open)}>
                      DELETE
                    </Button>
                  </>
                }
              >
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-black uppercase tracking-tight">{open.name}</h2>
                    <a
                      href={`mailto:${open.email}`}
                      className="text-xs font-bold text-[#FF5F1F] hover:underline break-all"
                    >
                      {open.email}
                    </a>
                  </div>

                  <div className="border-l-4 border-black bg-gray-50 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {open.message}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t-2 border-black/10">
                    <span className="text-[9px] font-black uppercase tracking-widest text-black/30">
                      RECEIVED {new Date(open.date).toLocaleString()}
                    </span>
                    <a href={`mailto:${open.email}`}>
                      <Button variant="primary" size="sm">
                        REPLY BY EMAIL
                      </Button>
                    </a>
                  </div>
                </div>
              </Panel>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
