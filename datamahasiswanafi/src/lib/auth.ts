export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
};

const TOKEN_KEY = 'mahasiswa_auth_token';
const USER_KEY = 'mahasiswa_auth_user';

export const saveAuth = (token: string, user: AuthUser): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    const userCopy = { ...user } as Record<string, unknown>;
    delete userCopy.password;
    localStorage.setItem(USER_KEY, JSON.stringify(userCopy));
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY) || null;
  }
  return null;
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      if (
        user && 
        typeof user.id === 'number' &&
        typeof user.name === 'string' &&
        typeof user.email === 'string' &&
        ['admin', 'operator', 'viewer'].includes(user.role)
      ) {
        return user as AuthUser;
      } else {
        localStorage.removeItem(USER_KEY);
        return null;
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }
  return null;
};

export const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
