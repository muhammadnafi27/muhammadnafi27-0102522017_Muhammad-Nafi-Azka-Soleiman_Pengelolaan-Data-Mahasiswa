'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, getAuthUser, setAuth, clearAuth, AuthUser } from '@/lib/auth';
import { getMe, login as loginApi, logoutApi } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        return;
      }
      
      const response = await getMe() as { user?: AuthUser };
      if (response && response.user) {
        setUser(response.user);
        setAuth(token, response.user);
      }
    } catch (error) {
      console.error('Failed to refresh user', error);
      clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = getAuthUser();
      if (storedUser) {
        setUser(storedUser);
      }
      await refreshUser();
    };
    initAuth();
  }, []);

  const login = async (credentials: Record<string, unknown>) => {
    const response = await loginApi(credentials) as { token?: string; user?: AuthUser };
    if (response && response.token && response.user) {
      setAuth(response.token, response.user);
      setUser(response.user);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout API failed, continuing local logout', error);
    } finally {
      clearAuth();
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  const hasRole = (roles: string[]) => user ? roles.includes(user.role) : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
        canCreate: hasRole(['admin', 'operator']),
        canUpdate: hasRole(['admin', 'operator']),
        canDelete: hasRole(['admin']),
        canManageUsers: hasRole(['admin']),
      }}
    >
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
