'use client';

import React, { useState } from 'react';
import { useAdminAuth } from '@/lib/admin-auth';
import { Button, Field, Input } from '@/components/admin/ui';

/** Inline so the admin doesn't pull in an icon library for one glyph. */
const EyeIcon: React.FC<{ off?: boolean }> = ({ off }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="square"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <line x1="3" y1="3" x2="21" y2="21" />}
  </svg>
);

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [pending, setPending] = useState(false);
  const { login, error } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || pending) return;

    setPending(true);
    try {
      const ok = await login(password);
      if (!ok) {
        setPassword('');
        setRevealed(false);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm bg-white border-2 p-6 sm:p-8 transition-colors ${
          error ? 'border-[#FF5F1F]' : 'border-black'
        }`}
      >
        <div className="mb-6">
          <h1 className="font-heading font-black text-xl uppercase tracking-tighter leading-none">
            CMS.V1
          </h1>
          <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-black/40">
            Authorised personnel only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="PASSWORD">
            <div className="relative">
              <Input
                type={revealed ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                disabled={pending}
                autoComplete="current-password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setRevealed((v) => !v)}
                disabled={pending}
                aria-label={revealed ? 'Hide password' : 'Show password'}
                aria-pressed={revealed}
                title={revealed ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 w-10 flex items-center justify-center border-l-2 border-black text-black/45 hover:text-white hover:bg-black transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <EyeIcon off={revealed} />
              </button>
            </div>
          </Field>

          {error && (
            <p role="alert" className="text-[10px] font-black uppercase tracking-widest text-[#FF5F1F]">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" block disabled={pending || !password}>
            {pending ? 'CHECKING...' : 'SIGN IN'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
