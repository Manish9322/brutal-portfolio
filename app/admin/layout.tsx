'use client';

import React from 'react';
import { useAdminAuth } from '@/lib/admin-auth';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayoutShell from '@/components/admin/AdminLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  // Nothing renders until the stored session has been read, which also keeps
  // the admin tree out of the server-rendered HTML.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <p className="text-white font-black uppercase tracking-[0.3em] text-sm animate-pulse">
          VERIFYING_CREDENTIALS...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return <AdminLogin />;

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
