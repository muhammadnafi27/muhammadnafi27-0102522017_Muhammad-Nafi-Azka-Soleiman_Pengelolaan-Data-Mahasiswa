'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, CreditCard, Mail, BookOpen, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import AuthLeftPanel from '@/components/AuthLeftPanel';
import { fetchApi } from '@/lib/api';

interface Prodi {
  id: number;
  nama_prodi: string;
}

export default function RegisterPage() {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [prodiId, setProdiId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [prodis, setProdis] = useState<Prodi[]>([]);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load prodi for selection
  useEffect(() => {
    const fetchProdis = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/prodi`);
        if (!res.ok) throw new Error('Gagal mengambil data program studi');
        const data = await res.json();
        // Since getProdi might return nested array or data attribute:
        setProdis(data.data !== undefined ? data.data : data);
      } catch (err) {
        console.error(err);
        // Fallback prodis in case API fails
        setProdis([
          { id: 1, nama_prodi: 'Informatika' },
          { id: 2, nama_prodi: 'Sistem Informasi' },
          { id: 3, nama_prodi: 'Teknik Elektro' },
          { id: 4, nama_prodi: 'Manajemen' },
          { id: 5, nama_prodi: 'Akuntansi' },
          { id: 6, nama_prodi: 'Teknik Komputer' }
        ]);
      }
    };
    fetchProdis();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      await fetchApi('/auth/register', {
        method: 'POST',
        requireAuth: false,
        body: {
          nama_lengkap: namaLengkap,
          nim,
          email,
          prodi_id: prodiId ? parseInt(prodiId) : null,
          password
        }
      });

      setSuccessMsg('Registrasi berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Left Side Branding */}
        <AuthLeftPanel />

        {/* Right Side Form */}
        <div className="auth-right">
          <div className="auth-right-container">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Buat Akun Baru</h2>
              <p className="auth-form-subtitle">Daftarkan diri Anda untuk mengakses sistem</p>
            </div>

            {errorMsg && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderLeft: '4px solid #ef4444',
                color: '#fca5a5',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderLeft: '4px solid #10b981',
                color: '#6ee7b7',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="auth-form-group">
                  <label className="auth-label">Nama Lengkap</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Nama lengkap"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">NIM</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <CreditCard size={18} />
                    </span>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="NIM"
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="auth-form-group">
                  <label className="auth-label">Email</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Program Studi</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <BookOpen size={18} />
                    </span>
                    <select
                      className="auth-select"
                      value={prodiId}
                      onChange={(e) => setProdiId(e.target.value)}
                      required
                    >
                      <option value="" disabled hidden>Pilih Prodi</option>
                      {prodis.map((p) => (
                        <option key={p.id} value={p.id} style={{ backgroundColor: '#090d16', color: '#fff' }}>
                          {p.nama_prodi}
                        </option>
                      ))}
                    </select>
                    <span className="auth-select-arrow">
                      <ChevronDown size={18} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="Buat password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
                style={{ marginTop: '0.5rem' }}
              >
                {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
              </button>
            </form>

            <p className="auth-footer-text">
              Sudah punya akun? 
              <Link href="/login" className="auth-link">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
