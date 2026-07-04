'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GraduationCap, Search, Filter } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import MahasiswaForm from '../components/MahasiswaForm';
import MahasiswaTable from '../components/MahasiswaTable';
import Notification, { NotificationType } from '../components/Notification';
import ConfirmModal from '../components/ConfirmModal';
import { getMahasiswa, createMahasiswa, updateMahasiswa, deleteMahasiswa, getProdi, Mahasiswa, Prodi } from '../lib/api';

interface NotificationState {
  id: number;
  message: string;
  type: NotificationType;
}

import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { LogOut, User } from 'lucide-react';

export default function Home() {
  const [mahasiswas, setMahasiswas] = useState<Mahasiswa[]>([]);
  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [editingMahasiswa, setEditingMahasiswa] = useState<Mahasiswa | null>(null);
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

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

  const { user, logout, canCreate, canUpdate } = useAuth();

  const addNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
      addNotification(error instanceof Error ? error.message : 'Gagal memuat data mahasiswa', 'error');
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [search, filterProdi, currentPage]);

  useEffect(() => {
    let isMounted = true;
    const fetchProdis = async () => {
      try {
        const data = await getProdi();
        if (isMounted) {
          setProdis(data);
          setJumlahProdi(data.length);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProdis();
    return () => {
      isMounted = false;
    };
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMahasiswaData();
    }, 500); // 500ms debounce
    return () => clearTimeout(timeoutId);
  }, [search, filterProdi, currentPage, fetchMahasiswaData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsSearching(true);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterProdi(e.target.value);
    setCurrentPage(1);
  };

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
      addNotification(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data', 'error');
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
        addNotification(error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus data', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <ProtectedRoute>
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
          <div className="w-full max-w-7xl mx-auto px-4 py-2 flex justify-end items-center gap-4 text-sm">
            {user && (
              <div className="flex items-center gap-2 text-gray-600 bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-gray-200/50">
                <User size={16} />
                <span className="font-medium text-gray-800">{user.name}</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">{user.role}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-red-100"
            >
              <LogOut size={16} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
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
            <div className="island-badge">
              <GraduationCap size={16} />
              <span>{totalItems} Mahasiswa</span>
            </div>
          </header>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 2.5rem 2rem' }}>
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
                onChange={handleSearchChange}
              />
            </div>

            <div className="input-wrapper" style={{ minWidth: '220px' }}>
              <Filter size={18} className="input-icon" />
              <select
                value={filterProdi}
                onChange={handleFilterChange}
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
            {(canCreate || canUpdate) && (
              <div>
                <MahasiswaForm
                  key={editingMahasiswa ? `edit-${editingMahasiswa.id}` : 'new'}
                  selectedMahasiswa={editingMahasiswa}
                  prodis={prodis}
                  onSubmit={handleCreateOrUpdate}
                  onCancelEdit={() => setEditingMahasiswa(null)}
                />
              </div>
            )}
            <div style={!canCreate && !canUpdate ? { gridColumn: '1 / -1' } : {}}>
              <MahasiswaTable
                data={mahasiswas}
                isLoading={isLoading}
                onEdit={setEditingMahasiswa}
                onDelete={handleDelete}
                currentPage={currentPage}
                totalPages={totalPage}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
