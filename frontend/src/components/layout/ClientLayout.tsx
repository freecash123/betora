"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { SportsSidebar } from "@/components/layout/SportsSidebar";
import { BetSlipDrawer } from "@/components/betting/BetSlipDrawer";
import { useBetSlipStore } from "@/lib/stores/betSlipStore";
import { Toaster } from "react-hot-toast";

const AuthContext = createContext<any>({
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
    const s = localStorage.getItem("betora_token");
    if (s) {
      setToken(s);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (login: string, password: string) => {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Login failed");
    setToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem("betora_token", data.accessToken);
  };

  const register = async (d: any) => {
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Registration failed");
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("betora_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useBetSlipStore();
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1A1A2E", color: "#fff", border: "1px solid #2A2A45" },
        }}
      />
      <div className="min-h-screen bg-surface">
        <DemoBanner />
        <Header />
        <div className="flex">
          <SportsSidebar />
          <main
            className={`flex-1 pt-20 pb-20 lg:pb-6 px-4 lg:px-6 transition-all ${
              isOpen ? "lg:mr-80" : ""
            }`}
          >
            {children}
          </main>
          <BetSlipDrawer />
        </div>
        <MobileNav />
      </div>
    </AuthProvider>
  );
}
