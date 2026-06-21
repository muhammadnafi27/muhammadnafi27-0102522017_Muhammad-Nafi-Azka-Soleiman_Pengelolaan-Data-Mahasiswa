'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GraduationCap } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import MahasiswaForm from '../components/MahasiswaForm';
import MahasiswaTable from '../components/MahasiswaTable';
import Notification, { NotificationType } from '../components/Notification';
import { getMahasiswa, createMahasiswa, updateMahasiswa, deleteMahasiswa, Mahasiswa, MahasiswaInput } from '../lib/api';

interface NotificationState {
  id: number;
  message: string;
  type: NotificationType;
}

export default function Home() {
  const [mahasiswas, setMahasiswas] = useState<Mahasiswa[]>([]);
  const [editingMahasiswa, setEditingMahasiswa] = useState<Mahasiswa | null>(null);
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const fetchMahasiswa = useCallback(async () => {
    try {
      const data = await getMahasiswa();
      setMahasiswas(data);
    } catch (error: any) {
      addNotification(error.message || 'Gagal memuat data', 'error');
    }
  }, []);

  useEffect(() => {
    fetchMahasiswa();
  }, [fetchMahasiswa]);

  const addNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleCreateOrUpdate = async (data: MahasiswaInput) => {
    try {
      if (editingMahasiswa) {
        await updateMahasiswa(editingMahasiswa.id, data);
        addNotification('Data mahasiswa berhasil diperbarui', 'success');
      } else {
        await createMahasiswa(data);
        addNotification('Data mahasiswa berhasil ditambahkan', 'success');
      }
      setEditingMahasiswa(null);
      fetchMahasiswa();
    } catch (error: any) {
      addNotification(error.message || 'Terjadi kesalahan saat menyimpan data', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus data mahasiswa ini?')) {
      try {
        await deleteMahasiswa(id);
        addNotification('Data mahasiswa berhasil dihapus', 'success');
        fetchMahasiswa();
      } catch (error: any) {
        addNotification(error.message || 'Terjadi kesalahan saat menghapus data', 'error');
      }
    }
  };

  const totalMahasiswa = mahasiswas.length;
  const jumlahProdi = new Set(mahasiswas.map(m => m.prodi)).size;
  const jumlahAngkatan = new Set(mahasiswas.map(m => m.angkatan)).size;

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

      <header className="header">
        <div className="brand">
          <GraduationCap size={40} className="brand-icon" />
          <h1>Pengelolaan Data Mahasiswa UAI</h1>
        </div>
        <p className="subtitle">
          Sistem akademik satu halaman terpadu dengan analisis database MySQL.
        </p>
      </header>

      <DashboardCard 
        totalMahasiswa={totalMahasiswa} 
        jumlahProdi={jumlahProdi} 
        jumlahAngkatan={jumlahAngkatan} 
      />
      
      <div className="content-grid">
        <div>
          <MahasiswaForm
            selectedMahasiswa={editingMahasiswa}
            onSubmit={handleCreateOrUpdate}
            onCancelEdit={() => setEditingMahasiswa(null)}
          />
        </div>
        <div>
          <MahasiswaTable
            data={mahasiswas}
            onEdit={setEditingMahasiswa}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
