'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { SportsSidebar } from '@/components/layout/SportsSidebar';
import { BetSlipDrawer } from '@/components/betting/BetSlipDrawer';
import { useBetSlipStore } from '@/lib/stores/betSlipStore';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('betora_token');
    if (stored) {
      setToken(stored);
      fetchUser(stored);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (t: string) => {
    try {
      const res = await fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {}
    setIsLoading(false);
  };

  const login = async (login: string, password: string) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Login failed');
    setToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem('betora_token', data.accessToken);
  };

  const register = async (regData: any) => {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Registration failed');
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('betora_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useBetSlipStore();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-surface">
        <DemoBanner />
        <Header />
        <div className="flex">
          <SportsSidebar />
          <main className={`flex-1 pt-20 pb-20 lg:pb-6 px-4 lg:px-6 transition-all ${isOpen ? 'lg:mr-80' : ''}`}>
            {children}
          </main>
          <BetSlipDrawer />
        </div>
        <MobileNav />
      </div>
    </AuthProvider>
  );
}