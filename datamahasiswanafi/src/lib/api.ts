import { getToken, clearAuth } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  requireAuth?: boolean;
  body?: Record<string, unknown> | FormData;
}

let isRedirecting = false;

export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requireAuth = true, headers, body, ...rest } = options;

  const config: RequestInit = {
    ...rest,
    headers: new Headers(headers || {}),
  };

  if (requireAuth) {
    const token = getToken();
    if (token) {
      (config.headers as Headers).set('Authorization', `Bearer ${token}`);
    }
  }

  if (body) {
    if (!(body instanceof FormData)) {
      (config.headers as Headers).set('Content-Type', 'application/json');
      config.body = JSON.stringify(body);
    } else {
      config.body = body;
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      if (typeof window !== 'undefined' && !isRedirecting && window.location.pathname !== '/login') {
        isRedirecting = true;
        clearAuth();
        window.location.href = '/login';
      }
      throw new Error('Sesi telah habis, silakan login kembali.');
    }

    if (response.status === 403) {
      throw new Error('Akses ditolak.');
    }

    const text = await response.text();
    if (!text) {
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return {} as T;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      if (!response.ok) throw new Error(text || `HTTP Error: ${response.status}`);
      return text as unknown as T;
    }

    if (!response.ok) {
      throw new Error(data?.message || `Terjadi kesalahan pada server (${response.status})`);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error atau terjadi kesalahan yang tidak diketahui');
  }
}

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
  success?: boolean;
  message?: string;
  meta: PaginationMeta;
  data: Mahasiswa[];
}

export const getProdi = async (): Promise<Prodi[]> => {
  const data = await fetchApi<{ data?: Prodi[] }>('/prodi');
  return data.data !== undefined ? data.data : (data as unknown as Prodi[]);
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
  
  return fetchApi<MahasiswaResponse>(`/mahasiswa?${queryParams.toString()}`);
};

export const createMahasiswa = async (formData: FormData): Promise<Mahasiswa> => {
  const data = await fetchApi<{ data?: Mahasiswa }>('/mahasiswa', {
    method: 'POST',
    body: formData,
  });
  return data.data !== undefined ? data.data : (data as unknown as Mahasiswa);
};

export const updateMahasiswa = async (id: number, formData: FormData): Promise<Mahasiswa> => {
  const data = await fetchApi<{ data?: Mahasiswa }>(`/mahasiswa/${id}`, {
    method: 'PUT',
    body: formData,
  });
  return data.data !== undefined ? data.data : (data as unknown as Mahasiswa);
};

export const deleteMahasiswa = async (id: number): Promise<void> => {
  await fetchApi(`/mahasiswa/${id}`, {
    method: 'DELETE',
  });
};
