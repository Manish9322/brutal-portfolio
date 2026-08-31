'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  /** Resolves true when the password matched. */
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  /** Set when the server rejected the attempt or is misconfigured. */
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'axel_admin_authenticated';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  /**
   * The password lives in ADMIN_PASSWORD and is compared on the server, so it
   * is never shipped in the client bundle.
   *
   * Note this only gates the UI — the session is a localStorage flag and the
   * API routes themselves are still unauthenticated.
   */
  const login = async (password: string): Promise<boolean> => {
    setError(null);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEY, 'true');
        return true;
      }

      const data = await response.json().catch(() => ({}));
      setError(data.error || 'Invalid credentials.');
      return false;
    } catch {
      setError('Could not reach the server.');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
