'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, getToken, saveAuth, clearAuth, getStoredUser } from '@/lib/auth';
import { fetchApi } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
  login: (token: string, user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const response = await fetchApi<{ success: boolean; data: { user: AuthUser } }>('/auth/me');
      if (response.success && response.data?.user) {
        saveAuth(getToken()!, response.data.user);
        setUser(response.data.user);
      }
    } catch {
      clearAuth();
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Optimistic user state
      const stored = getStoredUser();
      if (stored) setUser(stored);

      await refreshUser();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, userData: AuthUser) => {
    saveAuth(token, userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetchApi('/auth/logout', { method: 'POST', requireAuth: true });
    } catch {
      // Ignore errors on logout
    } finally {
      clearAuth();
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, refreshUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
