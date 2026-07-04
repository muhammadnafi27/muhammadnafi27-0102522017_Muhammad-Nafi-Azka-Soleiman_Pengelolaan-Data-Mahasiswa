'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, UserPlus, User, Lock } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon-box" style={{ margin: '0 auto 1rem auto' }}>
            <GraduationCap size={42} className="brand-icon" />
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600 }}>Daftar Akun Baru</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Buat akun untuk mengelola data mahasiswa
          </p>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderLeft: '4px solid #ef4444',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderLeft: '4px solid #10b981',
            color: '#6ee7b7',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Pilih username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Buat password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Konfirmasi Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Mendaftarkan...' : (
              <>
                <UserPlus size={18} />
                Daftar
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          Sudah punya akun? <Link href="/login" style={{ color: '#60a5fa', textDecoration: 'none' }}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
