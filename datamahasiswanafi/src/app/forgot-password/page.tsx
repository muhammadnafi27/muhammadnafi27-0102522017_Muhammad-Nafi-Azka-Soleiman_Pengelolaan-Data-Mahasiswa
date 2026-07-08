'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, GraduationCap, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { requestPasswordReset } from '../../lib/api-auth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Email wajib diisi' });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    try {
      const res = await requestPasswordReset(email.trim());
      setMessage({ type: 'success', text: res.message });
      setEmail('');
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Terjadi kesalahan' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', padding: '2rem',
      position: 'relative', overflow: 'hidden'
    }}>
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
          <ArrowLeft size={16} />
          Kembali ke Login
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6', margin: 0 }}>Lupa Password</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              Masukkan email Anda dan kami akan mengirimkan link untuk mereset password.
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
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="email@kampus.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px', color: '#f1f5f9', fontSize: '0.95rem',
                    outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem', borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                border: '1px solid rgba(59,130,246,0.5)', color: '#ffffff', fontWeight: 700, fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                boxShadow: '0 8px 20px rgba(37,99,235,0.4)',
                transition: 'all 0.2s', opacity: loading ? 0.7 : 1, marginTop: '0.75rem'
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(37,99,235,0.5)'; } }}
              onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.4)'; } }}
            >
              {loading ? (
                <div style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <><Send size={18} /> Kirim Link Reset</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
