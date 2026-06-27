# Sistem Pengelolaan Data Mahasiswa
### Universitas Al-Azhar Indonesia (UAI)

Sistem Informasi Pengelolaan Data Mahasiswa adalah aplikasi web full-stack berbasis arsitektur client-server yang dirancang untuk mengelola data akademik mahasiswa secara terpadu. Aplikasi ini dibangun menggunakan Next.js sebagai lapisan antarmuka client, Express.js sebagai lapisan layanan API server, dan MySQL sebagai sistem manajemen basis data relasional.

---

## Daftar Isi

1. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
2. [Skema Database](#skema-database)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [Struktur Direktori](#struktur-direktori)
5. [Fitur Aplikasi](#fitur-aplikasi)
6. [Dokumentasi REST API](#dokumentasi-rest-api)
7. [Panduan Instalasi dan Menjalankan Aplikasi](#panduan-instalasi-dan-menjalankan-aplikasi)
8. [Penyelesaian Masalah Umum](#penyelesaian-masalah-umum)
9. [Informasi Pengembang](#informasi-pengembang)

---

## Teknologi yang Digunakan

### Frontend (Client-Side)

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

| Teknologi | Versi | Kegunaan |
|---|---|---|
| Next.js | 16.x (App Router) | Framework React untuk routing berbasis file dan server-side rendering |
| React | 19.x | Library antarmuka komponen deklaratif dengan manajemen state melalui hooks |
| TypeScript | 5.x | Sistem pengetikan statis untuk keamanan tipe data saat pengembangan |
| Vanilla CSS | - | Sistem desain kustom dengan variabel CSS, glassmorphism, dan animasi fluid |
| Lucide React | - | Perpustakaan ikon berbasis SVG yang ringan dan konsisten |

### Backend (Server-Side)

![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)

| Teknologi | Versi | Kegunaan |
|---|---|---|
| Express.js | 5.x | Framework minimalis untuk membangun REST API Node.js |
| mysql2 | 3.x | Driver MySQL berbasis Promise dengan dukungan koneksi pool |
| Multer | 1.x | Middleware penanganan unggahan berkas multipart/form-data |
| TypeScript | 5.x | Pengetikan statis backend untuk keandalan kode produksi |
| dotenv | - | Manajemen variabel lingkungan secara aman dan terisolasi |
| CORS | - | Kebijakan akses lintas asal (Cross-Origin Resource Sharing) |

---

## Skema Database

Database bernama `db_mahasiswa` menggunakan MySQL dengan dua tabel utama yang terhubung melalui relasi foreign key.

### Tabel `prodi`

Menyimpan data program studi yang tersedia di universitas.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT AUTO_INCREMENT | Kunci utama (Primary Key) |
| nama_prodi | VARCHAR(100) | Nama program studi, bersifat unik |
| created_at | TIMESTAMP | Waktu data dibuat, otomatis terisi |

Data awal yang tersedia: Informatika, Sistem Informasi, Teknik Elektro, Manajemen, Akuntansi, Teknik Komputer.

### Tabel `mahasiswa`

Menyimpan seluruh data akademik mahasiswa dengan referensi ke tabel `prodi`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT AUTO_INCREMENT | Kunci utama (Primary Key) |
| nim | VARCHAR(20) | Nomor Induk Mahasiswa, bersifat unik |
| nama | VARCHAR(100) | Nama lengkap mahasiswa |
| prodi_id | INT | Kunci asing ke tabel `prodi` |
| angkatan | INT | Tahun angkatan masuk |
| foto | VARCHAR(255) | Nama berkas foto profil (nullable) |
| created_at | TIMESTAMP | Waktu data dibuat |
| updated_at | TIMESTAMP | Waktu data terakhir diperbarui |

Relasi: `mahasiswa.prodi_id` merujuk ke `prodi.id` dengan aturan `ON UPDATE CASCADE` dan `ON DELETE RESTRICT`.

---

## Arsitektur Sistem

Sistem ini menerapkan pola arsitektur **Client-Server terpisah (Decoupled)** di mana frontend dan backend berjalan pada port yang berbeda dan berkomunikasi secara eksklusif melalui protokol HTTP dan format JSON.

```
Pengguna (Browser)
       |
       | HTTP Request
       v
[Frontend: Next.js - Port 3001]
  - Halaman Dashboard (page.tsx)
  - Komponen UI (MahasiswaForm, MahasiswaTable, dll.)
  - Lapisan komunikasi API (src/lib/api.ts)
       |
       | HTTP/JSON (CORS diizinkan)
       v
[Backend: Express.js - Port 3000]
  - Router (routes/)
  - Kontroler (controllers/)
  - Middleware Unggahan (middlewares/)
  - Static File Server (/uploads)
       |
       | SQL Query (mysql2 Pool)
       v
[Database: MySQL]
  - Tabel: prodi
  - Tabel: mahasiswa
```

---

## Struktur Direktori

```
Sistem Pengelolaan Data Mahasiswa/
|
+-- README.md                      Dokumentasi utama proyek ini
+-- screenshots/                   Dokumentasi visual tangkapan layar fitur
|
+-- backend/                       Layanan API Server (Express + TypeScript)
|   +-- src/
|   |   +-- config/
|   |   |   +-- database.ts        Inisialisasi dan konfigurasi MySQL connection pool
|   |   +-- controllers/
|   |   |   +-- mahasiswa.controller.ts   Logika bisnis CRUD dan pencarian mahasiswa
|   |   |   +-- prodi.controller.ts       Logika pengambilan daftar program studi
|   |   +-- middlewares/
|   |   |   +-- upload.middleware.ts      Konfigurasi Multer: validasi tipe & batas ukuran berkas
|   |   +-- routes/
|   |   |   +-- mahasiswa.route.ts        Definisi endpoint REST API mahasiswa
|   |   |   +-- prodi.route.ts            Definisi endpoint REST API program studi
|   |   +-- app.ts                 Registrasi middleware, CORS, static files, dan rute
|   |   +-- server.ts              Titik masuk eksekusi server
|   +-- uploads/
|   |   +-- mahasiswa/             Penyimpanan fisik berkas foto profil mahasiswa
|   +-- db_mahasiswa.sql           Skrip inisialisasi skema tabel dan data awal
|   +-- seed.ts                    Skrip eksekusi otomatis seeding database
|   +-- package.json               Dependensi dan skrip backend
|   +-- tsconfig.json              Konfigurasi kompilator TypeScript backend
|
+-- datamahasiswanafi/             Antarmuka Pengguna (Next.js + TypeScript)
    +-- src/
    |   +-- app/
    |   |   +-- globals.css        Sistem desain CSS: variabel, glassmorphism, animasi
    |   |   +-- layout.tsx         Tata letak halaman induk (root layout)
    |   |   +-- page.tsx           Halaman dashboard utama (komponen induk)
    |   +-- components/
    |   |   +-- DashboardCard.tsx  Kartu statistik: total mahasiswa, prodi, angkatan
    |   |   +-- MahasiswaForm.tsx  Form penambahan dan pengeditan data mahasiswa
    |   |   +-- MahasiswaTable.tsx Tabel data dengan pagination dan lightbox foto
    |   |   +-- ConfirmModal.tsx   Dialog modal glassmorphism untuk konfirmasi hapus
    |   |   +-- Notification.tsx   Sistem toast notifikasi animasi per jenis aksi
    |   +-- lib/
    |       +-- api.ts             Abstraksi pemanggilan endpoint API backend
    +-- .env.local                 Konfigurasi URL API dan backend untuk client
    +-- package.json               Dependensi dan skrip frontend
    +-- tsconfig.json              Konfigurasi kompilator TypeScript frontend
```

---

## Fitur Aplikasi

### Halaman Dashboard Utama

Halaman utama menyajikan tiga kartu statistik yang dihitung secara dinamis dari data aktual di database: total mahasiswa, jumlah program studi yang terdaftar, dan jumlah tahun angkatan yang berbeda. Di bawah kartu statistik, terdapat form input dan tabel daftar mahasiswa yang berdampingan dalam tata letak dua kolom.

![Main Page](./screenshots/Main%20Page.png)

### Dynamic Island Navigation Header

Header aplikasi menerapkan konsep animasi Dynamic Island. Dalam kondisi normal, header menampilkan nama aplikasi, logo, dan keterangan lengkap. Ketika pengguna melakukan scroll ke bawah, header secara otomatis mengecil menjadi kapsul ramping yang memuat statistik ringkas jumlah mahasiswa. Seluruh perubahan bentuk tersebut dianimasikan menggunakan spring physics (`cubic-bezier`) sehingga transisinya terasa alami dan halus.

### Pendaftaran Data Mahasiswa Baru

Formulir input mendukung penambahan data lengkap: NIM, Nama Lengkap, Program Studi (dipilih dari daftar yang diambil langsung dari database), Tahun Angkatan, dan Foto Profil. Foto diunggah menggunakan komponen dropzone kustom yang mendukung klik dan pratinjau instan sebelum disimpan. Sistem memvalidasi duplikasi NIM di sisi server sebelum proses penyimpanan dilakukan.

![Create Mahasiswa](./screenshots/Create%20Mahasiswa.png)

Setelah data berhasil tersimpan, sistem menampilkan notifikasi toast animasi berwarna hijau secara otomatis.

![Data Berhasil Ditambah](./screenshots/Data%20Berhasil%20Ditambah.png)

### Pengeditan Data Mahasiswa

Tombol edit pada setiap baris tabel akan memuat seluruh data mahasiswa tersebut ke dalam formulir secara otomatis. Jika mahasiswa memiliki foto, pratinjau foto yang sudah tersimpan akan ditampilkan beserta tombol hapus foto (ikon X berwarna merah). Pengguna dapat mengganti foto dengan yang baru, menghapus foto yang ada, atau membiarkannya tanpa perubahan. Perubahan NIM juga divalidasi agar tidak bentrok dengan NIM mahasiswa lain.

![Edit Mahasiswa](./screenshots/Edit%20Mahasiswa.png)

Keberhasilan pengeditan dikonfirmasi dengan notifikasi toast animasi berwarna biru.

![Edit Berhasil](./screenshots/Edit%20Berhasil.png)

### Penghapusan Data dengan Konfirmasi Modal

Ketika tombol hapus ditekan, sistem tidak langsung menghapus data, melainkan menampilkan dialog konfirmasi kustom (Confirm Modal) bergaya glassmorphism. Dialog ini meminta pengguna untuk menegaskan niatnya sebelum penghapusan dieksekusi.

![Delete Notification](./screenshots/Delete%20Notification.png)

Setelah penghapusan dikonfirmasi, data dihapus dari database dan berkas foto terkait juga dihapus dari penyimpanan server secara otomatis. Sistem kemudian menampilkan notifikasi konfirmasi bahwa data telah berhasil dihapus.

![Berhasil Dihapus](./screenshots/Berhasil%20Dihapus.png)

### Pencarian dan Filter Data

Tabel mahasiswa mendukung pencarian teks bebas berdasarkan NIM atau nama secara real-time, serta pemfilteran berdasarkan program studi melalui dropdown. Semua operasi pencarian dan filter diproses di sisi server melalui parameter query string, sehingga hasil yang ditampilkan selalu akurat terhadap data aktual.

### Pagination Data

Data mahasiswa dibagi ke dalam halaman-halaman dengan kapasitas 10 data per halaman. Navigasi halaman dilengkapi dengan tombol nomor halaman, tombol sebelumnya, dan tombol berikutnya. Seluruh metadata pagination (halaman saat ini, total halaman, total data) dikelola oleh server dan dikembalikan bersama respons data.

### Lightbox Foto Profil

Setiap foto profil pada tabel dapat diklik untuk membuka tampilan pratinjau berukuran penuh dalam modal lightbox. Modal ini menampilkan foto dalam resolusi penuh beserta nama dan NIM mahasiswa. Animasi scale-up dan backdrop blur digunakan untuk memberikan pengalaman yang premium.

### Sistem Notifikasi Toast Animasi

Setiap aksi berhasil (tambah, edit, hapus) memunculkan notifikasi toast dengan identitas visual yang berbeda:
- Warna hijau dengan ikon tambah pengguna untuk aksi tambah data.
- Warna biru dengan ikon putar untuk aksi perbarui data.
- Warna oranye dengan ikon tempat sampah untuk aksi hapus data.
- Warna merah untuk kondisi kesalahan (error).

Setiap notifikasi dilengkapi progress bar countdown selama 4 detik dan tombol tutup manual.

---

## Dokumentasi REST API

Semua komunikasi antara frontend dan backend menggunakan format JSON. Backend berjalan pada `http://localhost:3000`.

### Endpoint: Program Studi

**GET /api/prodi**

Mengambil daftar seluruh program studi yang tersedia.

Respons sukses (200 OK):
```json
{
  "message": "Data prodi berhasil diambil",
  "data": [
    { "id": 1, "nama_prodi": "Informatika" },
    { "id": 2, "nama_prodi": "Sistem Informasi" }
  ]
}
```

### Endpoint: Mahasiswa

**GET /api/mahasiswa**

Mengambil daftar mahasiswa dengan dukungan pencarian, filter, dan pagination.

Parameter query yang tersedia:

| Parameter | Tipe | Keterangan |
|---|---|---|
| search | string | Pencarian berdasarkan NIM atau nama (opsional) |
| prodi_id | number | Filter berdasarkan ID program studi (opsional) |
| page | number | Nomor halaman yang diminta, default: 1 |
| limit | number | Jumlah data per halaman, default: 10 |

Respons sukses (200 OK):
```json
{
  "message": "Data mahasiswa berhasil diambil",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPage": 5,
    "totalAngkatan": 3
  },
  "data": [
    {
      "id": 1,
      "nim": "2201001",
      "nama": "Ahmad Fauzi",
      "prodi_id": 1,
      "nama_prodi": "Informatika",
      "angkatan": 2022,
      "foto": "1782575265741-921367051.png",
      "created_at": "2026-06-21T09:30:00.000Z",
      "updated_at": "2026-06-21T09:30:00.000Z"
    }
  ]
}
```

**POST /api/mahasiswa**

Menyimpan data mahasiswa baru. Request menggunakan format `multipart/form-data`.

| Field | Tipe | Keterangan |
|---|---|---|
| nim | string | Nomor Induk Mahasiswa (wajib, harus unik) |
| nama | string | Nama lengkap mahasiswa (wajib) |
| prodi_id | number | ID program studi (wajib) |
| angkatan | number | Tahun angkatan (wajib) |
| foto | file | Berkas gambar JPG/PNG/WEBP, maksimal 2MB (opsional) |

Respons sukses (201 Created):
```json
{
  "message": "Data mahasiswa berhasil ditambahkan",
  "data": { "id": 11, "nim": "2401005", "nama": "Nama Mahasiswa", ... }
}
```

Respons gagal - NIM sudah terdaftar (400 Bad Request):
```json
{
  "message": "NIM tidak boleh duplikat (NIM ini sudah terdaftar)"
}
```

**PUT /api/mahasiswa/:id**

Memperbarui data mahasiswa berdasarkan ID. Request menggunakan format `multipart/form-data`.

| Field | Tipe | Keterangan |
|---|---|---|
| nim | string | NIM baru (wajib, harus unik di antara mahasiswa lain) |
| nama | string | Nama baru (wajib) |
| prodi_id | number | ID program studi baru (wajib) |
| angkatan | number | Tahun angkatan baru (wajib) |
| foto | file | Foto baru untuk menggantikan foto lama (opsional) |
| removeFoto | string | Isi dengan nilai `"true"` untuk menghapus foto yang ada (opsional) |

Respons sukses (200 OK):
```json
{
  "message": "Data mahasiswa berhasil diperbarui",
  "data": { "id": 1, "nim": "2201001", ... }
}
```

**DELETE /api/mahasiswa/:id**

Menghapus data mahasiswa secara permanen beserta berkas foto dari penyimpanan server.

Respons sukses (200 OK):
```json
{
  "message": "Data mahasiswa berhasil dihapus"
}
```

Respons gagal - ID tidak ditemukan (404 Not Found):
```json
{
  "message": "Data mahasiswa tidak ditemukan"
}
```

---

## Panduan Instalasi dan Menjalankan Aplikasi

### Prasyarat Sistem

Pastikan perangkat lunak berikut telah terpasang sebelum memulai:

1. **Node.js** versi LTS 18 atau lebih baru.
2. **MySQL Server** versi 5.7 atau lebih baru (dapat menggunakan XAMPP, Laragon, atau instalasi langsung).
3. **npm** atau **yarn** sebagai manajer paket.

### Langkah 1: Inisialisasi Database

1. Pastikan layanan MySQL aktif dan dapat diakses.
2. Buka klien MySQL (phpMyAdmin, DBeaver, atau command line).
3. Jalankan seluruh skrip SQL yang ada dalam berkas `backend/db_mahasiswa.sql`. Skrip ini akan membuat database baru bernama `db_mahasiswa`, membuat tabel `prodi` dan `mahasiswa`, serta mengisi data awal (seed data).

   Melalui command line:
   ```bash
   mysql -u root -p < backend/db_mahasiswa.sql
   ```

   Apabila command line tidak mendukung operator `<`, gunakan skrip seed:
   ```bash
   cd backend
   npx ts-node seed.ts
   ```

### Langkah 2: Konfigurasi dan Menjalankan Backend

1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```

2. Pasang seluruh dependensi:
   ```bash
   npm install
   ```

3. Buat berkas `.env` di dalam folder `backend/` dan sesuaikan isinya dengan konfigurasi MySQL lokal Anda:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=db_mahasiswa
   ```
   Kosongkan `DB_PASSWORD` jika MySQL tidak menggunakan kata sandi.

4. Jalankan server backend dalam mode pengembangan:
   ```bash
   npm run dev
   ```

   Server akan berjalan di `http://localhost:3000`. Biarkan terminal ini tetap terbuka.

### Langkah 3: Konfigurasi dan Menjalankan Frontend

1. Buka sesi terminal baru, lalu masuk ke direktori frontend:
   ```bash
   cd datamahasiswanafi
   ```

2. Pasang seluruh dependensi:
   ```bash
   npm install
   ```

3. Pastikan berkas `.env.local` di dalam folder `datamahasiswanafi/` berisi konfigurasi berikut:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
   ```

4. Jalankan aplikasi frontend dalam mode pengembangan:
   ```bash
   npm run dev
   ```

   Aplikasi dapat diakses melalui browser di `http://localhost:3001`.

---

## Penyelesaian Masalah Umum

**Masalah: Tabel tidak menampilkan data atau muncul pesan "Gagal mengambil data"**

Penyebab: Koneksi antara frontend dan backend gagal, atau backend tidak berjalan.

Solusi:
1. Pastikan layanan MySQL aktif (cek melalui XAMPP Control Panel atau `service mysql status`).
2. Pastikan server backend sudah dijalankan dengan `npm run dev` di direktori `backend/`.
3. Verifikasi bahwa nilai `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` dalam berkas `.env` backend sudah benar.
4. Buka `http://localhost:3000/api/mahasiswa` di browser untuk memastikan API merespons.

**Masalah: Foto profil tidak muncul di tabel (tampil sebagai ikon placeholder)**

Penyebab: URL gambar tidak dapat dijangkau, atau jalur folder statis backend salah konfigurasi.

Solusi:
1. Pastikan berkas `.env.local` frontend memiliki nilai `NEXT_PUBLIC_BACKEND_URL=http://localhost:3000`.
2. Pastikan folder `backend/uploads/mahasiswa/` ada dan berkas foto tersimpan di dalamnya.
3. Coba akses langsung URL gambar di browser: `http://localhost:3000/uploads/mahasiswa/nama-file.png`.

**Masalah: Kesalahan CORS (Cross-Origin Request Blocked)**

Penyebab: Backend menolak permintaan dari origin yang tidak diizinkan.

Solusi:
1. Pastikan frontend berjalan di port 3001 dan backend di port 3000.
2. Periksa konfigurasi CORS di `backend/src/app.ts` dan pastikan `origin` menunjuk ke `http://localhost:3001`.

**Masalah: Port sudah digunakan (EADDRINUSE: address already in use)**

Solusi:
1. Temukan dan hentikan proses yang menggunakan port tersebut. Di Windows, jalankan: `netstat -ano | findstr :3000`, kemudian `taskkill /PID <nomor-pid> /F`.
2. Atau ubah port backend di berkas `.env` dan sesuaikan `NEXT_PUBLIC_API_URL` di `.env.local` frontend.

**Masalah: NIM baru selalu ditolak sebagai duplikat padahal berbeda**

Penyebab: Input NIM mengandung spasi tersembunyi di awal atau akhir.

Solusi: Sistem backend telah menerapkan `.trim()` pada nilai NIM sebelum pengecekan, sehingga ini seharusnya tidak terjadi. Pastikan server backend berjalan dengan versi kode terbaru.

---

## Informasi Pengembang

Proyek ini dikembangkan sebagai bagian dari penugasan praktikum mata kuliah Pemrograman Web menggunakan stack Next.js dan Express.js.

**Nama Mahasiswa:** Muhammad Nafi Azka Soleiman  
**NIM:** 0102522017  
**Program Studi:** Informatika  
**Mata Kuliah:** Praktikum Frontend Next.js untuk Backend Express.js  
**Institusi:** Universitas Al-Azhar Indonesia
