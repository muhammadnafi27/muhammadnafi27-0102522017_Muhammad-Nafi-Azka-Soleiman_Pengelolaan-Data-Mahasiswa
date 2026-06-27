import React, { useState, useEffect, useRef } from 'react';
import { Mahasiswa, Prodi } from '../lib/api';
import { IdCard, User, BookOpen, Calendar, Save, RotateCcw, Upload, Image as ImageIcon } from 'lucide-react';

interface MahasiswaFormProps {
  selectedMahasiswa: Mahasiswa | null;
  prodis: Prodi[];
  onSubmit: (formData: FormData) => Promise<void>;
  onCancelEdit: () => void;
}

export default function MahasiswaForm({ selectedMahasiswa, prodis, onSubmit, onCancelEdit }: MahasiswaFormProps) {
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [prodiId, setProdiId] = useState('');
  const [angkatan, setAngkatan] = useState(new Date().getFullYear());
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedMahasiswa) {
      setNim(selectedMahasiswa.nim);
      setNama(selectedMahasiswa.nama);
      setProdiId(String(selectedMahasiswa.prodi_id));
      setAngkatan(selectedMahasiswa.angkatan);
      setFoto(null);
      if (selectedMahasiswa.foto) {
        setFotoPreview(`http://localhost:3000/uploads/${selectedMahasiswa.foto}`);
      } else {
        setFotoPreview(null);
      }
    } else {
      setNim('');
      setNama('');
      setProdiId('');
      setAngkatan(new Date().getFullYear());
      setFoto(null);
      setFotoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [selectedMahasiswa]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('nim', nim);
    formData.append('nama', nama);
    formData.append('prodi_id', prodiId);
    formData.append('angkatan', String(angkatan));
    if (foto) {
      formData.append('foto', foto);
    }

    try {
      await onSubmit(formData);
      if (!selectedMahasiswa) {
        setNim('');
        setNama('');
        setProdiId('');
        setAngkatan(new Date().getFullYear());
        setFoto(null);
        setFotoPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNim('');
    setNama('');
    setProdiId('');
    setAngkatan(new Date().getFullYear());
    setFoto(null);
    setFotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
              placeholder="Masukkan NIM..."
              value={nim}
              onChange={(e) => setNim(e.target.value)}
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
              placeholder="Masukkan nama lengkap..."
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Program Studi</label>
          <div className="input-wrapper">
            <BookOpen size={18} className="input-icon" />
            <select
              value={prodiId}
              onChange={(e) => setProdiId(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.85rem',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                color: 'var(--text-dark)',
                backgroundColor: '#f8fafc',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">Pilih Program Studi...</option>
              {prodis.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama_prodi}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Tahun Angkatan</label>
          <div className="input-wrapper">
            <Calendar size={18} className="input-icon" />
            <input
              type="number"
              placeholder="Contoh: 2024"
              value={angkatan}
              onChange={(e) => setAngkatan(Number(e.target.value))}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Foto Mahasiswa</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="input-wrapper">
              <Upload size={18} className="input-icon" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.85rem',
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  color: 'var(--text-muted)',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>
            {fotoPreview && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '0.75rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px dashed var(--border)'
                }}
              >
                <img 
                  src={fotoPreview} 
                  alt="Preview Foto" 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    border: '1px solid var(--border)' 
                  }} 
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {foto ? foto.name : 'Foto saat ini'}
                </span>
              </div>
            )}
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
          
          {selectedMahasiswa ? (
            <button type="button" className="btn-secondary" onClick={onCancelEdit} disabled={loading}>
              <RotateCcw size={16} />
              Batal Edit
            </button>
          ) : (
            <button type="button" className="btn-secondary" onClick={handleReset} disabled={loading}>
              <RotateCcw size={16} />
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
