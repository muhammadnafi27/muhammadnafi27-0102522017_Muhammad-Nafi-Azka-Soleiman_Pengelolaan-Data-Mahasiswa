/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GraduationCap, Search, Filter, LogOut } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import MahasiswaForm from '../components/MahasiswaForm';
import MahasiswaTable from '../components/MahasiswaTable';
import Notification, { NotificationType } from '../components/Notification';
import ConfirmModal from '../components/ConfirmModal';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { getMahasiswa, createMahasiswa, updateMahasiswa, deleteMahasiswa, getProdi, Mahasiswa, Prodi } from '../lib/api';

interface NotificationState {
  id: number;
  message: string;
  type: NotificationType;
}

export default function Home() {
  const [mahasiswas, setMahasiswas] = useState<Mahasiswa[]>([]);
  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [editingMahasiswa, setEditingMahasiswa] = useState<Mahasiswa | null>(null);
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const { user, logout } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  // Search, Filter, Pagination States
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filterProdi, setFilterProdi] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Stats
  const [jumlahProdi, setJumlahProdi] = useState(0);
  const [jumlahAngkatan, setJumlahAngkatan] = useState(0);

  const addNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const fetchProdis = async () => {
    try {
      const data = await getProdi();
      setProdis(data);
      setJumlahProdi(data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMahasiswaData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMahasiswa(search, filterProdi, currentPage, 5);
      setMahasiswas(response.data);
      setTotalPage(response.meta.totalPage);
      setTotalItems(response.meta.total);
      if (response.meta.totalAngkatan !== undefined) {
        setJumlahAngkatan(response.meta.totalAngkatan);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gagal memuat data mahasiswa';
      addNotification(msg, 'error');
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [search, filterProdi, currentPage]);

  useEffect(() => {
    fetchProdis();
  }, []);

  // Debounced search
  useEffect(() => {
    if (search !== '') setIsSearching(true);
    const timeoutId = setTimeout(() => {
      fetchMahasiswaData();
    }, 500); // 500ms debounce
    return () => clearTimeout(timeoutId);
  }, [search, filterProdi, currentPage, fetchMahasiswaData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterProdi]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCreateOrUpdate = async (formData: FormData) => {
    try {
      if (editingMahasiswa) {
        await updateMahasiswa(editingMahasiswa.id, formData);
        addNotification('Data mahasiswa berhasil diperbarui', 'update');
      } else {
        await createMahasiswa(formData);
        addNotification('Data mahasiswa berhasil ditambahkan', 'create');
      }
      setEditingMahasiswa(null);
      fetchMahasiswaData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data';
      addNotification(msg, 'error');
    }
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId !== null) {
      try {
        await deleteMahasiswa(deletingId);
        addNotification('Data mahasiswa berhasil dihapus', 'delete');
        fetchMahasiswaData();
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus data';
        addNotification(msg, 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <div className="app">
          {notifications.map((notif) => (
            <Notification
              key={notif.id}
              message={notif.message}
              type={notif.type}
              onClose={() => removeNotification(notif.id)}
            />
          ))}

          <ConfirmModal
            isOpen={deletingId !== null}
            onConfirm={confirmDelete}
            onCancel={() => setDeletingId(null)}
          />

          <div className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
            <header className="dynamic-island">
              <div className="brand">
                <div className="brand-icon-box">
                  <GraduationCap size={42} className="brand-icon" />
                </div>
                <div className="brand-text">
                  <h1>Pengelolaan Data Mahasiswa UAI</h1>
                  <p className="subtitle">
                    Sistem akademik satu halaman terpadu dengan analisis database MySQL.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="island-badge" style={{ display: 'none' }}>
                  {/* Sembunyikan badge lama jika ingin, atau tampilkan di atas */}
                </div>

                <button 
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                  }}
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </div>
            </header>
          </div>

          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 2.5rem 2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>Selamat Datang, {user?.name || 'User'}!</h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem' }}>Kelola data mahasiswa dan pantau analitik dengan mudah.</p>
            </div>

            <DashboardCard 
              totalMahasiswa={totalItems} 
              jumlahProdi={jumlahProdi} 
              jumlahAngkatan={jumlahAngkatan} 
            />
            
            {/* Search and Filter Controls */}
            <div className="search-filter-container">
              <div className="input-wrapper" style={{ flex: 1, minWidth: '250px' }}>
                <Search size={18} className="input-icon" style={{ opacity: isSearching ? 0.3 : 1 }} />
                {isSearching && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      left: '1.25rem',
                      width: '18px', 
                      height: '18px',
                      border: '2px solid rgba(59, 130, 246, 0.3)',
                      borderTopColor: '#3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} 
                  />
                )}
                <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
                <input
                  type="text"
                  placeholder="Cari NIM atau Nama..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="input-wrapper" style={{ minWidth: '220px' }}>
                <Filter size={18} className="input-icon" />
                <select
                  value={filterProdi}
                  onChange={(e) => setFilterProdi(e.target.value)}
                >
                  <option value="">Semua Program Studi</option>
                  {prodis.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama_prodi}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="content-grid">
              {user?.role !== 'viewer' && (
                <div>
                  <MahasiswaForm
                    selectedMahasiswa={editingMahasiswa}
                    prodis={prodis}
                    onSubmit={handleCreateOrUpdate}
                    onCancelEdit={() => setEditingMahasiswa(null)}
                  />
                </div>
              )}
              <div style={user?.role === 'viewer' ? { gridColumn: '1 / -1' } : {}}>
                <MahasiswaTable
                  data={mahasiswas}
                  isLoading={isLoading}
                  onEdit={setEditingMahasiswa}
                  onDelete={handleDelete}
                  currentPage={currentPage}
                  totalPages={totalPage}
                  totalItems={totalItems}
                  onPageChange={setCurrentPage}
                  userRole={user?.role}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
