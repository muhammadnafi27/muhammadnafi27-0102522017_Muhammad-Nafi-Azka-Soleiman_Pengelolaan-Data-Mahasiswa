import React, { useState, useEffect } from 'react';
import { MahasiswaInput, Mahasiswa } from '../lib/api';
import { IdCard, User, BookOpen, Calendar, Save, RotateCcw } from 'lucide-react';

interface MahasiswaFormProps {
  selectedMahasiswa: Mahasiswa | null;
  onSubmit: (data: MahasiswaInput) => Promise<void>;
  onCancelEdit: () => void;
}

export default function MahasiswaForm({ selectedMahasiswa, onSubmit, onCancelEdit }: MahasiswaFormProps) {
  const [formData, setFormData] = useState<MahasiswaInput>({
    nim: '',
    nama: '',
    prodi: '',
    angkatan: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMahasiswa) {
      setFormData({
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama,
        prodi: selectedMahasiswa.prodi,
        angkatan: selectedMahasiswa.angkatan,
      });
    } else {
      setFormData({ nim: '', nama: '', prodi: '', angkatan: new Date().getFullYear() });
    }
  }, [selectedMahasiswa]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'angkatan' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      if (!selectedMahasiswa) {
        setFormData({ nim: '', nama: '', prodi: '', angkatan: new Date().getFullYear() });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="form-title">
        {selectedMahasiswa ? 'Edit Data Mahasiswa' : 'Tambah Data Mahasiswa'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>NIM</label>
          <div className="input-wrapper">
            <IdCard size={18} className="input-icon" />
            <input
              type="text"
              name="nim"
              placeholder="Masukkan NIM..."
              value={formData.nim}
              onChange={handleChange}
              required
              disabled={!!selectedMahasiswa || loading}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Nama Lengkap</label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input
              type="text"
              name="nama"
              placeholder="Masukkan nama lengkap..."
              value={formData.nama}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Program Studi</label>
          <div className="input-wrapper">
            <BookOpen size={18} className="input-icon" />
            <input
              type="text"
              name="prodi"
              placeholder="Masukkan program studi..."
              value={formData.prodi}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Tahun Angkatan</label>
          <div className="input-wrapper">
            <Calendar size={18} className="input-icon" />
            <input
              type="number"
              name="angkatan"
              placeholder="Contoh: 2024"
              value={formData.angkatan}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        <div className="actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              'Menyimpan...'
            ) : (
              <>
                <Save size={16} />
                {selectedMahasiswa ? 'Update Data' : 'Simpan Data'}
              </>
            )}
          </button>
          {selectedMahasiswa && (
            <button type="button" className="btn-secondary" onClick={onCancelEdit} disabled={loading}>
              <RotateCcw size={16} />
              Batal Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
