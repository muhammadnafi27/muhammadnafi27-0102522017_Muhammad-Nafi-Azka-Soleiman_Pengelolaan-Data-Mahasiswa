import React from 'react';
import { Users, Library, Calendar } from 'lucide-react';

interface DashboardCardProps {
  totalMahasiswa: number;
  jumlahProdi: number;
  jumlahAngkatan: number;
}

export default function DashboardCard({ totalMahasiswa, jumlahProdi, jumlahAngkatan }: DashboardCardProps) {
  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <div className="dashboard-icon">
          <Users size={32} />
        </div>
        <div>
          <h3 className="dashboard-label">Jumlah Mahasiswa Aktif</h3>
          <p className="dashboard-value">{totalMahasiswa}</p>
          <span className="dashboard-description">Total mahasiswa terdaftar</span>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="dashboard-icon">
          <Library size={32} />
        </div>
        <div>
          <h3 className="dashboard-label">Jumlah Program Studi</h3>
          <p className="dashboard-value">{jumlahProdi}</p>
          <span className="dashboard-description">Program studi terdaftar</span>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="dashboard-icon">
          <Calendar size={32} />
        </div>
        <div>
          <h3 className="dashboard-label">Jumlah Angkatan</h3>
          <p className="dashboard-value">{jumlahAngkatan}</p>
          <span className="dashboard-description">Tahun angkatan terdaftar</span>
        </div>
      </div>
    </div>
  );
}
