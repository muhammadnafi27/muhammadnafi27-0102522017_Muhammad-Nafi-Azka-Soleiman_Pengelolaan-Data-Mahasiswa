const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  created_at?: string;
}

export interface MahasiswaInput {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'Terjadi kesalahan pada server');
  }
  return data.data !== undefined ? data.data : data;
}

export const getMahasiswa = async (): Promise<Mahasiswa[]> => {
  const res = await fetch(`${API_URL}/mahasiswa`, { cache: 'no-store' });
  return handleResponse<Mahasiswa[]>(res);
};

export const createMahasiswa = async (payload: MahasiswaInput): Promise<Mahasiswa> => {
  const res = await fetch(`${API_URL}/mahasiswa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Mahasiswa>(res);
};

export const updateMahasiswa = async (id: number, payload: MahasiswaInput): Promise<void> => {
  const res = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  await handleResponse<void>(res);
};

export const deleteMahasiswa = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(res);
};
