'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GraduationCap, Search, Filter } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import MahasiswaForm from '../components/MahasiswaForm';
import MahasiswaTable from '../components/MahasiswaTable';
import Notification, { NotificationType } from '../components/Notification';
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

  // Search, Filter, Pagination States
  const [search, setSearch] = useState('');
  const [filterProdi, setFilterProdi] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

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
    } catch (error: any) {
      console.error(error);
    }
  };

  const fetchMahasiswaData = useCallback(async () => {
    try {
      const response = await getMahasiswa(search, filterProdi, currentPage, 5);
      setMahasiswas(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
      
      // Calculate active years/angkatan count from response
      const angkatans = new Set(response.data.map((m) => m.angkatan));
      setJumlahAngkatan(angkatans.size);
    } catch (error: any) {
      addNotification(error.message || 'Gagal memuat data mahasiswa', 'error');
    }
  }, [search, filterProdi, currentPage]);

  useEffect(() => {
    fetchProdis();
  }, []);

  useEffect(() => {
    fetchMahasiswaData();
  }, [fetchMahasiswaData]);

  // Reset page to 1 when filters or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterProdi]);

  const handleCreateOrUpdate = async (formData: FormData) => {
    try {
      if (editingMahasiswa) {
        await updateMahasiswa(editingMahasiswa.id, formData);
        addNotification('Data mahasiswa berhasil diperbarui', 'success');
      } else {
        await createMahasiswa(formData);
        addNotification('Data mahasiswa berhasil ditambahkan', 'success');
      }
      setEditingMahasiswa(null);
      fetchMahasiswaData();
    } catch (error: any) {
      addNotification(error.message || 'Terjadi kesalahan saat menyimpan data', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus data mahasiswa ini?')) {
      try {
        await deleteMahasiswa(id);
        addNotification('Data mahasiswa berhasil dihapus', 'success');
        fetchMahasiswaData();
      } catch (error: any) {
        addNotification(error.message || 'Terjadi kesalahan saat menghapus data', 'error');
      }
    }
  };

  return (
    <div className="app">
      {notifications.map((notif) => (
        <Notification
          key={notif.id}
          message={notif.message}
          type={notif.type}
          onClose={() => removeNotification(notif.id)}
        />
      ))}

      <header className="header" style={{ padding: '2.5rem 2rem 1rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="brand">
          <GraduationCap size={40} className="brand-icon" />
          <h1>Pengelolaan Data Mahasiswa UAI</h1>
        </div>
        <p className="subtitle">
          Sistem akademik satu halaman terpadu dengan analisis database MySQL.
        </p>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 2.5rem 2rem' }}>
        <DashboardCard 
          totalMahasiswa={totalItems} 
          jumlahProdi={jumlahProdi} 
          jumlahAngkatan={jumlahAngkatan} 
        />
        
        {/* Search and Filter Controls */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '1.25rem', 
            marginBottom: '2rem', 
            flexWrap: 'wrap', 
            alignItems: 'center',
            backgroundColor: 'var(--surface)',
            padding: '1.25rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ flex: 1, minWidth: '250px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1.1rem', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Cari NIM atau Nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.85rem',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                color: 'var(--text-dark)',
                backgroundColor: '#f8fafc',
                outline: 'none',
                transition: 'var(--transition)'
              }}
              className="search-input"
            />
          </div>

          <div style={{ minWidth: '220px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Filter size={18} style={{ position: 'absolute', left: '1.1rem', color: 'var(--text-muted)' }} />
            <select
              value={filterProdi}
              onChange={(e) => setFilterProdi(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.85rem',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                color: 'var(--text-dark)',
                backgroundColor: '#f8fafc',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer'
              }}
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
          <div>
            <MahasiswaForm
              selectedMahasiswa={editingMahasiswa}
              prodis={prodis}
              onSubmit={handleCreateOrUpdate}
              onCancelEdit={() => setEditingMahasiswa(null)}
            />
          </div>
          <div>
            <MahasiswaTable
              data={mahasiswas}
              onEdit={setEditingMahasiswa}
              onDelete={handleDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
