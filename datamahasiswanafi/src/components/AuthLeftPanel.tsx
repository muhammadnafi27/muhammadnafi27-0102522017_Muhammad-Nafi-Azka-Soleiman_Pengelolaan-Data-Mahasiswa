'use client';

import React from 'react';
import { GraduationCap, Users, Grid, BarChart3 } from 'lucide-react';

export default function AuthLeftPanel() {
  return (
    <div className="auth-left">
      <div className="auth-left-container">
        <div className="auth-brand-header">
          <div className="auth-brand-logo">
            <GraduationCap size={44} color="#ffffff" />
          </div>
          
          <div className="auth-left-content">
            <h1 className="auth-left-title">
              Pengelolaan Data<br />Mahasiswa UAI
            </h1>
            <p className="auth-left-subtitle">
              Sistem akademik satu halaman terpadu dengan analisis database MySQL.
            </p>
          </div>
        </div>

        <div className="auth-features-list">
          <div className="auth-feature-item">
            <div className="auth-feature-icon-box">
              <Users size={32} color="#ffffff" />
            </div>
            <div className="auth-feature-text">
              <h4>Data Mahasiswa</h4>
              <p>Kelola data lengkap mahasiswa</p>
            </div>
          </div>

          <div className="auth-feature-item">
            <div className="auth-feature-icon-box">
              <Grid size={32} color="#ffffff" />
            </div>
            <div className="auth-feature-text">
              <h4>Program Studi</h4>
              <p>6 program studi terdaftar</p>
            </div>
          </div>

          <div className="auth-feature-item">
            <div className="auth-feature-icon-box">
              <BarChart3 size={32} color="#ffffff" />
            </div>
            <div className="auth-feature-text">
              <h4>Analisis Data</h4>
              <p>Dashboard analitik real-time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
