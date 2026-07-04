import { getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export interface Prodi {
  id: number;
  nama_prodi: string;
  created_at?: string;
}

export interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  totalAngkatan?: number;
}

export interface MahasiswaResponse {
  message: string;
  meta: PaginationMeta;
  data: Mahasiswa[];
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'Terjadi kesalahan pada server');
  }
  return data.data !== undefined ? data.data : data;
}

export const getProdi = async (): Promise<Prodi[]> => {
  const res = await fetch(`${API_URL}/prodi`, { 
    cache: 'no-store',
    headers: getAuthHeaders()
  });
  return handleResponse<Prodi[]>(res);
};

export const getMahasiswa = async (
  search = '',
  prodiId = '',
  page = 1,
  limit = 5
): Promise<MahasiswaResponse> => {
  const queryParams = new URLSearchParams({
    search,
    prodi_id: prodiId,
    page: String(page),
    limit: String(limit)
  });
  
  const res = await fetch(`${API_URL}/mahasiswa?${queryParams.toString()}`, { 
    cache: 'no-store',
    headers: getAuthHeaders()
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || 'Terjadi kesalahan pada server');
  }
  return data;
};

export const createMahasiswa = async (formData: FormData): Promise<Mahasiswa> => {
  const res = await fetch(`${API_URL}/mahasiswa`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData, // Jangan set Content-Type secara manual agar browser menentukan boundary secara otomatis
  });
  return handleResponse<Mahasiswa>(res);
};

export const updateMahasiswa = async (id: number, formData: FormData): Promise<Mahasiswa> => {
  const res = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData,
  });
  return handleResponse<Mahasiswa>(res);
};

export const deleteMahasiswa = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  await handleResponse<void>(res);
};
