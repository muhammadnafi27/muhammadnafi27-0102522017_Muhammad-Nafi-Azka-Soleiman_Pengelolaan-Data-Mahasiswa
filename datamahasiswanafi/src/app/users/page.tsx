'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GraduationCap, LogOut, ShieldCheck, UserPlus, Users, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import Notification, { NotificationType } from '../../components/Notification';
import ConfirmModal from '../../components/ConfirmModal';
import UserForm from '../../components/UserForm';
import UserTable from '../../components/UserTable';
import UserResetPasswordModal from '../../components/UserResetPasswordModal';
import { useAuth } from '../../context/AuthContext';
import { getRoleBadgeStyle } from '../../lib/permissions';
import {
  getUsers, createUser, updateUser, deleteUser, resetUserPassword,
  User, UserFormData,
} from '../../lib/api-users';

interface NotificationState { id: number; message: string; type: NotificationType; }

export default function UsersPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const roleBadge = getRoleBadgeStyle(user?.role);

  const [users, setUsers]             = useState<User[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  // Form modal state
  const [showForm, setShowForm]           = useState(false);
  const [editingUser, setEditingUser]     = useState<User | null>(null);

  // Delete modal
  const [deletingUser, setDeletingUser]   = useState<User | null>(null);

  // Reset password modal
  const [resetResult, setResetResult]     = useState<{ user: User; tempPass: string } | null>(null);
  const [resettingId, setResettingId]     = useState<number | null>(null);

  const addNotif = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };
  const removeNotif = (id: number) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      addNotif(err instanceof Error ? err.message : 'Gagal memuat daftar user', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Admin guard — show message instead of redirect so role is visible
  const isAdmin = user?.role === 'admin';

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, { name: data.name, email: data.email, role: data.role });
        addNotif('Data user berhasil diperbarui', 'update');
      } else {
        await createUser(data);
        addNotif('User baru berhasil ditambahkan', 'create');
      }
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      addNotif(err instanceof Error ? err.message : 'Gagal menyimpan data user', 'error');
      throw err; // re-throw so form stays open on error
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser(deletingUser.id);
      addNotif(`User "${deletingUser.name}" berhasil dihapus`, 'delete');
      fetchUsers();
    } catch (err) {
      addNotif(err instanceof Error ? err.message : 'Gagal menghapus user', 'error');
    } finally {
      setDeletingUser(null);
    }
  };

  const handleResetPassword = async (u: User) => {
    setResettingId(u.id);
    try {
      const { temporaryPassword } = await resetUserPassword(u.id);
      setResetResult({ user: u, tempPass: temporaryPassword });
    } catch (err) {
      addNotif(err instanceof Error ? err.message : 'Gagal reset password', 'error');
    } finally {
      setResettingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <div className="app">
          {/* Notifications */}
          {notifications.map((n) => (
            <Notification key={n.id} message={n.message} type={n.type} onClose={() => removeNotif(n.id)} />
          ))}

          {/* Delete confirmation */}
          <ConfirmModal
            isOpen={!!deletingUser}
            title="Hapus User"
            message={`Yakin ingin menghapus user "${deletingUser?.name}"? Tindakan ini tidak dapat dibatalkan.`}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeletingUser(null)}
          />

          {/* Form modal */}
          {showForm && (
            <UserForm
              editingUser={editingUser}
              onSubmit={handleFormSubmit}
              onCancel={() => { setShowForm(false); setEditingUser(null); }}
            />
          )}

          {/* Reset password result modal */}
          {resetResult && (
            <UserResetPasswordModal
              userName={resetResult.user.name}
              temporaryPassword={resetResult.tempPass}
              onClose={() => setResetResult(null)}
            />
          )}

          {/* Header */}
          <div className="header-wrapper">
            <header className="dynamic-island">
              <div className="brand">
                <div className="brand-icon-box">
                  <GraduationCap size={42} className="brand-icon" />
                </div>
                <div className="brand-text">
                  <h1>Pengelolaan Data Mahasiswa UAI</h1>
                  <p className="subtitle">Sistem akademik satu halaman terpadu dengan analisis database MySQL.</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.45rem',
                  padding: '0.4rem 0.85rem', backgroundColor: roleBadge.bg,
                  border: `1px solid ${roleBadge.border}`, borderRadius: '8px',
                  color: roleBadge.color, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.03em',
                }}>
                  <ShieldCheck size={14} />
                  {roleBadge.label}
                </div>
                <button onClick={logout} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171', padding: '0.5rem 1rem', borderRadius: '8px',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
                >
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            </header>
          </div>

          <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', padding: '0 3rem 3rem' }}>
            {/* Page title row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
                  <button
                    onClick={() => router.push('/')}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', padding: '0.2rem' }}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 style={{ fontSize: '1.9rem', fontWeight: 700, color: '#fff', margin: 0 }}>Manajemen User</h2>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>Kelola akun admin, operator, dan viewer.</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => { setEditingUser(null); setShowForm(true); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.55rem',
                    padding: '0.75rem 1.4rem', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(99,102,241,0.35)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                >
                  <UserPlus size={18} />
                  Tambah User
                </button>
              )}
            </div>

            {/* Access denied for non-admin */}
            {!isAdmin ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '4rem 2rem',
                backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '20px',
              }}>
                <ShieldAlert size={56} color="rgba(248, 113, 113, 0.6)" style={{ marginBottom: '1.25rem' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>
                  Akses Ditolak
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '380px', lineHeight: 1.6 }}>
                  Halaman ini hanya dapat diakses oleh admin.
                </p>
              </div>
            ) : (
              /* User table card */
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }}>
                {/* Card header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <Users size={20} color="#818cf8" />
                  <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '1rem' }}>
                    Daftar User
                  </span>
                  <span style={{
                    marginLeft: 'auto', fontSize: '0.8rem', fontWeight: 600,
                    backgroundColor: 'rgba(99,102,241,0.12)', color: '#818cf8',
                    border: '1px solid rgba(99,102,241,0.25)', borderRadius: '6px',
                    padding: '0.2rem 0.6rem',
                  }}>
                    {users.length} user
                  </span>
                </div>

                <UserTable
                  users={users}
                  isLoading={isLoading}
                  currentUserId={user?.id}
                  onEdit={(u) => { setEditingUser(u); setShowForm(true); }}
                  onDelete={setDeletingUser}
                  onResetPassword={(u) => {
                    if (resettingId === u.id) return;
                    handleResetPassword(u);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
