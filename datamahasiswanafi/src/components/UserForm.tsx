'use client';

import React, { useState } from 'react';
import { X, UserPlus, Pencil, Eye, EyeOff, Shield } from 'lucide-react';
import { User, UserFormData } from '../lib/api-users';

interface UserFormProps {
  editingUser: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
}

const ROLE_OPTIONS: Array<{ value: 'admin' | 'operator' | 'viewer'; label: string; color: string }> = [
  { value: 'admin',    label: 'Admin',    color: '#f59e0b' },
  { value: 'operator', label: 'Operator', color: '#06b6d4' },
  { value: 'viewer',   label: 'Viewer',   color: '#a78bfa' },
];

export default function UserForm({ editingUser, onSubmit, onCancel }: UserFormProps) {
  const [form, setForm] = useState<UserFormData>({
    name: editingUser?.name ?? '',
    email: editingUser?.email ?? '',
    password: '',
    role: editingUser?.role ?? 'viewer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  const isEdit = !!editingUser;

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRx.test(form.email)) e.email = 'Email tidak valid';
    if (!isEdit && !form.password) e.password = 'Password wajib diisi';
    if (!form.role) e.role = 'Role wajib dipilih';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload: UserFormData = { name: form.name.trim(), email: form.email.trim(), role: form.role };
      if (!isEdit && form.password) payload.password = form.password;
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#f1f5f9', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', display: 'block' };
  const errStyle: React.CSSProperties = { fontSize: '0.78rem', color: '#f87171', marginTop: '0.3rem' };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '460px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '24px', padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.12)',
          animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8',
            }}>
              {isEdit ? <Pencil size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                {isEdit ? 'Edit User' : 'Tambah User Baru'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                {isEdit ? `Mengubah data: ${editingUser.name}` : 'Isi data user baru'}
              </p>
            </div>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem', borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Nama</label>
            <input
              style={{ ...inputStyle, borderColor: errors.name ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)' }}
              placeholder="Nama lengkap"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <span style={errStyle}>{errors.name}</span>}
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              style={{ ...inputStyle, borderColor: errors.email ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)' }}
              placeholder="email@contoh.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <span style={errStyle}>{errors.email}</span>}
          </div>

          {/* Password (only for create) */}
          {!isEdit && (
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={{ ...inputStyle, borderColor: errors.password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)', paddingRight: '3rem' }}
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span style={errStyle}>{errors.password}</span>}
            </div>
          )}

          {/* Role */}
          <div>
            <label style={labelStyle}>Role</label>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: opt.value })}
                  style={{
                    flex: 1, padding: '0.65rem 0', borderRadius: '10px', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.85rem',
                    border: form.role === opt.value ? `1.5px solid ${opt.color}` : '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: form.role === opt.value ? `${opt.color}22` : 'rgba(255,255,255,0.04)',
                    color: form.role === opt.value ? opt.color : '#64748b',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  }}
                >
                  <Shield size={14} />
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.role && <span style={errStyle}>{errors.role}</span>}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1, padding: '0.85rem', borderRadius: '12px', cursor: 'pointer',
                backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2, padding: '0.85rem', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <div style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                isEdit ? <><Pencil size={16} /> Simpan Perubahan</> : <><UserPlus size={16} /> Tambah User</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
