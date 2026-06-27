const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetMahasiswaResponse {
  message: string;
  data: Mahasiswa[];
  pagination: PaginationInfo;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'Terjadi kesalahan pada server');
  }
  return data.data !== undefined ? data.data : data;
}

export const getProdi = async (): Promise<Prodi[]> => {
  const res = await fetch(`${API_URL}/prodi`, { cache: 'no-store' });
  return handleResponse<Prodi[]>(res);
};

export const getMahasiswa = async (
  search = '',
  prodiId = '',
  page = 1,
  limit = 5
): Promise<GetMahasiswaResponse> => {
  const queryParams = new URLSearchParams({
    search,
    prodi_id: prodiId,
    page: String(page),
    limit: String(limit)
  });
  const res = await fetch(`${API_URL}/mahasiswa?${queryParams.toString()}`, { cache: 'no-store' });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || 'Terjadi kesalahan pada server');
  }
  return data;
};

export const createMahasiswa = async (formData: FormData): Promise<Mahasiswa> => {
  const res = await fetch(`${API_URL}/mahasiswa`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<Mahasiswa>(res);
};

export const updateMahasiswa = async (id: number, formData: FormData): Promise<Mahasiswa> => {
  const res = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: 'PUT',
    body: formData,
  });
  return handleResponse<Mahasiswa>(res);
};

export const deleteMahasiswa = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(res);
};
