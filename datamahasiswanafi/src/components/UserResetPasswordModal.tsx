'use client';

import React, { useState } from 'react';
import { KeyRound, Copy, Check, X, ShieldAlert } from 'lucide-react';

interface ResetPasswordModalProps {
  userName: string;
  temporaryPassword: string;
  onClose: () => void;
}

export default function ResetPasswordModal({ userName, temporaryPassword, onClose }: ResetPasswordModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(temporaryPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.82)', backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)', zIndex: 1100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: '440px',
          backgroundColor: 'rgba(15, 23, 42, 0.97)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '24px', padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px rgba(245,158,11,0.12)',
          animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative',
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {/* Icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24',
            marginBottom: '1rem', boxShadow: '0 8px 20px rgba(245, 158, 11, 0.2)',
          }}>
            <KeyRound size={30} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', margin: 0, textAlign: 'center' }}>
            Password Berhasil Direset
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0.4rem 0 0', textAlign: 'center' }}>
            Untuk akun <strong style={{ color: '#94a3b8' }}>{userName}</strong>
          </p>
        </div>

        {/* Temporary password display */}
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
            Password Sementara
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            backgroundColor: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px', padding: '0.85rem 1rem',
          }}>
            <code style={{
              flex: 1, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.12em',
              color: '#fbbf24', fontFamily: 'monospace', wordBreak: 'break-all',
            }}>
              {temporaryPassword}
            </code>
            <button
              onClick={handleCopy}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem',
                color: copied ? '#34d399' : '#64748b', transition: 'color 0.2s',
                flexShrink: 0,
              }}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        {/* Warning note */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
          backgroundColor: 'rgba(239, 68, 68, 0.07)', border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '12px', padding: '0.85rem', marginBottom: '1.5rem',
        }}>
          <ShieldAlert size={18} color="#f87171" style={{ flexShrink: 0, marginTop: '0.05rem' }} />
          <p style={{ fontSize: '0.83rem', color: '#fca5a5', margin: 0, lineHeight: 1.5 }}>
            Password sementara hanya ditampilkan <strong>satu kali</strong>. Simpan dan berikan kepada user terkait agar segera mengganti password.
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '0.9rem', borderRadius: '12px', cursor: 'pointer',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
          }}
        >
          Saya sudah menyalin password
        </button>
      </div>
    </div>
  );
}
