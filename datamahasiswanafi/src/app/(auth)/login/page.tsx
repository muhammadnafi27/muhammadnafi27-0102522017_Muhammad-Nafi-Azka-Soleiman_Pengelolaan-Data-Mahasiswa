'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { AuthUser } from '@/lib/auth';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import AuthLeftPanel from '@/components/AuthLeftPanel';
import Notification from '@/components/Notification';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setShowNotification(false);
    setLoading(true);

    try {
      const response = await fetchApi<{ success: boolean; message: string; data: { token: string; user: AuthUser } }>('/auth/login', {
        method: 'POST',
        requireAuth: false,
        body: { email: username, password }
      });
      
      login(response.data.token, response.data.user);
      router.push('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {showNotification && (
        <Notification 
          message={errorMsg} 
          type="error" 
          onClose={() => setShowNotification(false)} 
        />
      )}
      
      <div className="auth-card">
        {/* Left Side Branding */}
        <AuthLeftPanel />

        {/* Right Side Form */}
        <div className="auth-right">
          <div className="auth-right-container">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Selamat Datang</h2>
              <p className="auth-form-subtitle">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

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
