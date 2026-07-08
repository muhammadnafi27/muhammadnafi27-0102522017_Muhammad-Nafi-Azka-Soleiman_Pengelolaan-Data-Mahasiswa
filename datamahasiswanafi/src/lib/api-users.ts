import { fetchApi } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  created_at?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'operator' | 'viewer';
}

export const getUsers = async (): Promise<User[]> => {
  const data = await fetchApi<{ data: User[] }>('/users');
  return data.data;
};

export const createUser = async (payload: UserFormData): Promise<void> => {
  await fetchApi('/users', { method: 'POST', body: payload as Record<string, unknown> });
};

export const updateUser = async (id: number, payload: Omit<UserFormData, 'password'>): Promise<void> => {
  await fetchApi(`/users/${id}`, { method: 'PUT', body: payload as Record<string, unknown> });
};

export const deleteUser = async (id: number): Promise<void> => {
  await fetchApi(`/users/${id}`, { method: 'DELETE' });
};

export const resetUserPassword = async (id: number): Promise<{ temporaryPassword: string }> => {
  const data = await fetchApi<{ temporaryPassword: string }>(`/users/${id}/reset-password`, { method: 'PATCH' });
  return data;
};
