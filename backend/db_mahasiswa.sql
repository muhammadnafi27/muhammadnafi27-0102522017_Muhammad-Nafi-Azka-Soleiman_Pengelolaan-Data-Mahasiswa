-- db_mahasiswa.sql
-- Database untuk Modul Praktikum Frontend Next.js + Backend Express.js CRUD
-- Stack: Express.js + TypeScript + mysql2 + MySQL

DROP DATABASE IF EXISTS db_mahasiswa;
CREATE DATABASE db_mahasiswa
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_mahasiswa;

-- 1. Tabel Program Studi (prodi)
CREATE TABLE prodi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_prodi VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed data awal prodi
INSERT INTO prodi (nama_prodi) VALUES
('Informatika'),
('Sistem Informasi'),
('Teknik Elektro'),
('Manajemen'),
('Akuntansi'),
('Teknik Komputer');

-- 2. Tabel Mahasiswa dengan relasi ke prodi
CREATE TABLE mahasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  prodi_id INT NOT NULL,
  angkatan INT NOT NULL,
  foto VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_mahasiswa_prodi FOREIGN KEY (prodi_id) 
    REFERENCES prodi(id) 
    ON UPDATE CASCADE 
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Seed data awal mahasiswa
INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, foto) VALUES
('2201001', 'Ahmad Fauzi', 1, 2022, NULL),
('2201002', 'Siti Aisyah', 2, 2022, NULL),
('2201003', 'Budi Santoso', 6, 2022, NULL),
('2301001', 'Dewi Lestari', 1, 2023, NULL),
('2301002', 'Rizky Pratama', 2, 2023, NULL),
('2301003', 'Nadia Putri', 6, 2023, NULL),
('2401001', 'Fajar Ramadhan', 1, 2024, NULL),
('2401002', 'Maya Anggraini', 2, 2024, NULL),
('2401003', 'Andi Wijaya', 6, 2024, NULL),
('2401004', 'Citra Maharani', 1, 2024, NULL);

-- Query debugging/pengecekan akhir
SELECT m.id, m.nim, m.nama, p.nama_prodi, m.angkatan, m.foto, m.created_at, m.updated_at
FROM mahasiswa m
JOIN prodi p ON m.prodi_id = p.id;

-- 3. Tabel Users (Otentikasi Premium)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_lengkap VARCHAR(100) NOT NULL,
  nim VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  prodi_id INT DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_prodi FOREIGN KEY (prodi_id) 
    REFERENCES prodi(id) 
    ON UPDATE CASCADE 
    ON DELETE SET NULL
) ENGINE=InnoDB;
