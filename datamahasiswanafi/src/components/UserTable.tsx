'use client';

import React from 'react';
import { Pencil, Trash2, KeyRound, Shield, Users } from 'lucide-react';
import { User } from '../lib/api-users';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  currentUserId?: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
}

const ROLE_BADGE: Record<string, { bg: string; color: string; border: string; label: string }> = {
  admin:    { bg: 'rgba(59,130,246,0.15)',   color: '#60a5fa',  border: 'rgba(59,130,246,0.35)',   label: 'Admin' },
  operator: { bg: 'rgba(6,182,212,0.15)',    color: '#22d3ee',  border: 'rgba(6,182,212,0.35)',    label: 'Operator' },
  viewer:   { bg: 'rgba(56,189,248,0.15)',   color: '#38bdf8',  border: 'rgba(56,189,248,0.35)',   label: 'Viewer' },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function SkeletonRow() {
  const shimmer: React.CSSProperties = { height: '16px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.06)', animation: 'shimmer 1.6s infinite' };
  return (
    <tr>
      {[80, 160, 140, 80, 100].map((w, i) => (
        <td key={i} style={{ padding: '1rem 1.25rem' }}>
          <div style={{ ...shimmer, width: w }} />
        </td>
      ))}
      <td style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ ...shimmer, width: 32, height: 32, borderRadius: '8px' }} />
          <div style={{ ...shimmer, width: 32, height: 32, borderRadius: '8px' }} />
          <div style={{ ...shimmer, width: 32, height: 32, borderRadius: '8px' }} />
        </div>
      </td>
    </tr>
  );
}

export default function UserTable({ users, isLoading, currentUserId, onEdit, onDelete, onResetPassword }: UserTableProps) {
  const theadStyle: React.CSSProperties = {
    padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700,
    color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  };
  const tdStyle: React.CSSProperties = {
    padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#cbd5e1',
    borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle',
  };
  const actionBtn = (color: string): React.CSSProperties => ({
    width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: `${color}15`, color, transition: 'all 0.15s',
  });

  if (!isLoading && users.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <Users size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
        <p style={{ color: '#475569', fontWeight: 600 }}>Belum ada user terdaftar.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={theadStyle}>ID</th>
            <th style={theadStyle}>Nama</th>
            <th style={theadStyle}>Email</th>
            <th style={theadStyle}>Role</th>
            <th style={theadStyle}>Dibuat</th>
            <th style={{ ...theadStyle, textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            : users.map((u) => {
                const badge = ROLE_BADGE[u.role] ?? ROLE_BADGE.viewer;
                const isSelf = u.id === currentUserId;
                return (
                  <tr key={u.id} style={{ transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.025)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'monospace', color: '#475569', fontSize: '0.8rem' }}>#{u.id}</span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#f1f5f9' }}>
                      {u.name}
                      {isSelf && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', fontWeight: 600, color: '#818cf8',
                          backgroundColor: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
                          padding: '0.1rem 0.45rem', borderRadius: '5px' }}>Anda</span>
                      )}
                    </td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        backgroundColor: badge.bg, border: `1px solid ${badge.border}`,
                        color: badge.color, borderRadius: '7px', padding: '0.25rem 0.7rem',
                        fontSize: '0.78rem', fontWeight: 700,
                      }}>
                        <Shield size={12} />
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: '#64748b', fontSize: '0.83rem' }}>{formatDate(u.created_at)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button style={actionBtn('#22d3ee')} title="Edit"
                          onClick={() => onEdit(u)}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(34,211,238,0.25)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(34,211,238,0.08)'; }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button style={actionBtn('#60a5fa')} title="Reset Password"
                          onClick={() => onResetPassword(u)}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.25)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.08)'; }}
                        >
                          <KeyRound size={15} />
                        </button>
                        {!isSelf && (
                          <button style={actionBtn('#38bdf8')} title="Hapus"
                            onClick={() => onDelete(u)}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.25)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.08)'; }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}
