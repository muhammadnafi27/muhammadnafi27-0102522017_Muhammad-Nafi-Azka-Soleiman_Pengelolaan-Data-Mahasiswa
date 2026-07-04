'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setToken, setUser } from '@/lib/auth';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import AuthLeftPanel from '@/components/AuthLeftPanel';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Left Side Branding */}
        <AuthLeftPanel />

        {/* Right Side Form */}
        <div className="auth-right">
          <div className="auth-right-container">
            <div className="auth-form-header">
              <div className="auth-header-icon">
                <LogIn size={22} />
              </div>
              <h2 className="auth-form-title">Selamat Datang</h2>
              <p className="auth-form-subtitle">Masuk ke akun Anda untuk melanjutkan</p>
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

            <form onSubmit={handleLogin}>
              <div className="auth-form-group">
                <label className="auth-label">Email / NIM</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <Mail size={18} />
                  </span>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Masukkan email atau NIM"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
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
                    placeholder="Masukkan password"
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

              <div className="auth-extra-row">
                <label className="auth-checkbox-label">
                  <input type="checkbox" className="auth-checkbox" />
                  Ingat saya
                </label>
                <Link href="#" className="auth-forgot-link">
                  Lupa password?
                </Link>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <p className="auth-footer-text">
              Belum punya akun? 
              <Link href="/register" className="auth-link">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
