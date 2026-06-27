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
  const [totalPage, setTotalPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

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
      setTotalPage(response.meta.totalPage);
      setTotalItems(response.meta.total);
      if (response.meta.totalAngkatan !== undefined) {
        setJumlahAngkatan(response.meta.totalAngkatan);
      }
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
            <Search size={18} className="input-icon" />
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
              totalPages={totalPage}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
