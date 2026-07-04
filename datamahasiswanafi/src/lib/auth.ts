// Utility functions for auth token management
const TOKEN_KEY = 'mahasiswa_auth_token';
const USER_KEY = 'mahasiswa_auth_user';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const setAuth = (token: string, user: AuthUser) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const getAuthUser = (): AuthUser | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        clearAuth();
        return null;
      }
    }
  }
  return null;
};

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const hasRole = (allowedRoles: string[]): boolean => {
  const user = getAuthUser();
  return !!user && allowedRoles.includes(user.role);
};

export const canCreateMahasiswa = (): boolean => hasRole(['admin', 'operator']);
export const canUpdateMahasiswa = (): boolean => hasRole(['admin', 'operator']);
export const canDeleteMahasiswa = (): boolean => hasRole(['admin']);
export const canManageUsers = (): boolean => hasRole(['admin']);
