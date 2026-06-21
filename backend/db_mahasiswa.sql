-- db_mahasiswa.sql
-- Database untuk Modul Praktikum Frontend Next.js + Backend Express.js CRUD
-- Stack: Express.js + TypeScript + mysql2 + MySQL

DROP DATABASE IF EXISTS db_mahasiswa;
CREATE DATABASE db_mahasiswa
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_mahasiswa;

-- Tabel utama yang digunakan oleh endpoint:
-- GET    /api/mahasiswa
-- POST   /api/mahasiswa
-- PUT    /api/mahasiswa/:id
-- DELETE /api/mahasiswa/:id
CREATE TABLE mahasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  prodi VARCHAR(100) NOT NULL,
  angkatan INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES
('2201001', 'Ahmad Fauzi', 'Informatika', 2022),
('2201002', 'Siti Aisyah', 'Sistem Informasi', 2022),
('2201003', 'Budi Santoso', 'Teknik Komputer', 2022),
('2301001', 'Dewi Lestari', 'Informatika', 2023),
('2301002', 'Rizky Pratama', 'Sistem Informasi', 2023),
('2301003', 'Nadia Putri', 'Teknik Komputer', 2023),
('2401001', 'Fajar Ramadhan', 'Informatika', 2024),
('2401002', 'Maya Anggraini', 'Sistem Informasi', 2024),
('2401003', 'Andi Wijaya', 'Teknik Komputer', 2024),
('2401004', 'Citra Maharani', 'Informatika', 2024);

-- Cek data
SELECT * FROM mahasiswa;
