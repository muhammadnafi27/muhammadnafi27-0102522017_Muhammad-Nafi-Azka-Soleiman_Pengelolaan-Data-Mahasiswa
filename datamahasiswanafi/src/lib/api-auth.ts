import { fetchApi } from './api';

export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  const data = await fetchApi<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: { email } as Record<string, unknown>,
    requireAuth: false
  });
  return data;
};

export const submitNewPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  const data = await fetchApi<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: { token, newPassword } as Record<string, unknown>,
    requireAuth: false
  });
  return data;
};
