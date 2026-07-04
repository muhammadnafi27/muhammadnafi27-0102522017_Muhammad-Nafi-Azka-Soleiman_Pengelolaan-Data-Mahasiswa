import React, { useState, useEffect, useRef } from 'react';
/* eslint-disable @next/next/no-img-element, react-hooks/set-state-in-effect */
import { Mahasiswa, Prodi } from '../lib/api';
import { IdCard, User, BookOpen, Calendar, Save, RotateCcw, UploadCloud, X } from 'lucide-react';

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
  const [removeExistingFoto, setRemoveExistingFoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedMahasiswa) {
      setNim(selectedMahasiswa.nim);
      setNama(selectedMahasiswa.nama);
      setProdiId(String(selectedMahasiswa.prodi_id));
      setAngkatan(selectedMahasiswa.angkatan);
      setFoto(null);
      setRemoveExistingFoto(false);
      if (selectedMahasiswa.foto) {
        setFotoPreview(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/uploads/mahasiswa/${selectedMahasiswa.foto}`);
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
      setRemoveExistingFoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [selectedMahasiswa]);

  const handleRemoveFoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFoto(null);
    setFotoPreview(null);
    setRemoveExistingFoto(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side validation
    if (nim.length < 5) {
      setErrorMsg('NIM harus minimal 5 karakter');
      return;
    }
    if (angkatan < 1990 || angkatan > new Date().getFullYear() + 1) {
      setErrorMsg('Tahun angkatan tidak valid');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('nim', nim);
    formData.append('nama', nama);
    formData.append('prodi_id', prodiId);
    formData.append('angkatan', String(angkatan));
    if (foto) {
      formData.append('foto', foto);
    } else if (removeExistingFoto) {
      formData.append('removeFoto', 'true');
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
        setRemoveExistingFoto(false);
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
      {errorMsg && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          borderLeft: '4px solid #ef4444',
          color: '#fca5a5',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          {errorMsg}
        </div>
      )}
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
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={loading}
              style={{ display: 'none' }}
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem 1rem',
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                border: '2px dashed rgba(59, 130, 246, 0.4)',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                gap: '0.35rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#60a5fa';
                e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.4)';
              }}
            >
              <div style={{ 
                padding: '0.65rem', 
                backgroundColor: 'rgba(59, 130, 246, 0.15)', 
                borderRadius: '50%',
                color: '#60a5fa',
                marginBottom: '0.15rem'
              }}>
                <UploadCloud size={24} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                Klik untuk unggah foto
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Format JPG, PNG, WEBP (Maks 2MB)
              </span>
            </div>

            {fotoPreview && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.85rem', 
                  padding: '0.65rem 0.85rem', 
                  backgroundColor: 'rgba(15, 23, 42, 0.6)', 
                  borderRadius: '14px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                <img 
                  src={fotoPreview} 
                  alt="Preview Foto" 
                  style={{ 
                    width: '44px', 
                    height: '44px', 
                    objectFit: 'cover', 
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)' 
                  }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {foto ? foto.name : 'Foto saat ini'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#34d399' }}>
                    ✓ Berhasil dimuat
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={handleRemoveFoto}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    borderRadius: '10px',
                    padding: '0.4rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    marginLeft: 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
                    e.currentTarget.style.color = '#fca5a5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                    e.currentTarget.style.color = '#f87171';
                  }}
                  title="Hapus foto"
                >
                  <X size={18} />
                </button>
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
