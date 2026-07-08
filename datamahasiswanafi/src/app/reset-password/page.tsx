'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Lock, ArrowLeft, GraduationCap, KeyRound, AlertCircle, CheckCircle2, EyeOff, Eye } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { submitNewPassword } from '../../lib/api-auth';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Token reset password tidak ditemukan di URL.' });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Semua field wajib diisi' });
      return;
    }
    
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password dan konfirmasi tidak cocok' });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    try {
      const res = await submitNewPassword(token, password);
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Terjadi kesalahan' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.85rem 3rem 0.85rem 2.8rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px', color: '#f1f5f9', fontSize: '0.95rem',
    outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
  };

  return (
    <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px', animation: 'fadeIn 0.5s ease-out' }}>
      <button
        onClick={() => router.push('/login')}
        style={{
          background: 'none', border: 'none', color: '#94a3b8', display: 'flex',
          alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginBottom: '1.5rem',
          fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#f1f5f9')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
      >
        <ArrowLeft size={16} /> Kembali ke Login
      </button>

      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px', padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.15)',
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 1.25rem',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(14, 165, 233, 0.4) 100%)',
            border: '1px solid rgba(96, 165, 250, 0.6)', borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)'
          }}>
            <GraduationCap size={34} color="#60a5fa" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6', margin: 0 }}>Buat Password Baru</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
            Silakan masukkan password baru Anda.
          </p>
        </div>

        {message && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginBottom: '1.5rem',
            padding: '0.85rem 1rem', borderRadius: '12px',
            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
          }}>
            {message.type === 'success' 
              ? <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              : <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
            }
            <p style={{ 
              margin: 0, fontSize: '0.85rem', lineHeight: 1.5,
              color: message.type === 'success' ? '#6ee7b7' : '#fca5a5' 
            }}>
              {message.text}
              {message.type === 'success' && ' Mengalihkan ke halaman login...'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
              Password Baru
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex' }}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!token || message?.type === 'success'}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
              Konfirmasi Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex' }}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!token || message?.type === 'success'}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token || message?.type === 'success'}
            style={{
              width: '100%', padding: '0.9rem', borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              border: '1px solid rgba(59,130,246,0.5)', color: '#ffffff', fontWeight: 700, fontSize: '0.95rem',
              cursor: (loading || !token || message?.type === 'success') ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: '0 8px 20px rgba(37,99,235,0.4)',
              transition: 'all 0.2s', opacity: (loading || !token || message?.type === 'success') ? 0.7 : 1, marginTop: '0.75rem'
            }}
            onMouseEnter={(e) => { if (!loading && token && message?.type !== 'success') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(37,99,235,0.5)'; } }}
            onMouseLeave={(e) => { if (!loading && token && message?.type !== 'success') { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.4)'; } }}
          >
            {loading ? (
              <div style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            ) : (
              <><KeyRound size={18} /> Simpan Password Baru</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', padding: '2rem',
      position: 'relative', overflow: 'hidden'
    }}>
      <Suspense fallback={
        <div style={{ color: '#fff', fontSize: '1.2rem' }}>Loading...</div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
