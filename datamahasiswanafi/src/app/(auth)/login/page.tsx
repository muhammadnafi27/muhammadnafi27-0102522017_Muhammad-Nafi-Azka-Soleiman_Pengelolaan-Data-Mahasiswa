'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setToken, setUser } from '@/lib/auth';
import { GraduationCap, LogIn, User, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      setToken(data.token);
      setUser(data.user);
      router.push('/');
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
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600 }}>Login Portal</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Silakan masuk untuk mengelola data
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

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Masukkan username"
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
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Memproses...' : (
              <>
                <LogIn size={18} />
                Masuk
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          Belum punya akun? <Link href="/register" style={{ color: '#60a5fa', textDecoration: 'none' }}>Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}
