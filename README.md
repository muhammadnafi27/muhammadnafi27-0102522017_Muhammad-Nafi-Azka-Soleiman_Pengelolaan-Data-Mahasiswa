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
8. [Checklist Testing](#checklist-testing)
9. [Penyelesaian Masalah Umum](#penyelesaian-masalah-umum)
10. [Informasi Pengembang](#informasi-pengembang)

---

## Teknologi yang Digunakan

### Frontend (Client-Side)

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

| Teknologi | Versi | Kegunaan |
|---|---|---|
| Next.js | 16.2.9 (App Router) | Framework React untuk routing berbasis file dan server-side rendering |
| React | 19.2.4 | Library antarmuka komponen deklaratif dengan manajemen state melalui hooks |
| TypeScript | 5.x | Sistem pengetikan statis untuk keamanan tipe data saat pengembangan |
| Vanilla CSS | - | Sistem desain kustom dengan variabel CSS, glassmorphism, dan animasi fluid |
| Lucide React | 1.21.0 | Perpustakaan ikon berbasis SVG yang ringan dan konsisten |

### Backend (Server-Side)

![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)

| Teknologi | Versi | Kegunaan |
|---|---|---|
| Express.js | 5.2.1 | Framework minimalis untuk membangun REST API Node.js |
| mysql2 | 3.22.5 | Driver MySQL berbasis Promise dengan dukungan koneksi pool |
| Multer | 2.2.0 | Middleware penanganan unggahan berkas multipart/form-data |
| TypeScript | 6.0.3 | Pengetikan statis backend untuk keandalan kode produksi |
| dotenv | 17.4.2 | Manajemen variabel lingkungan secara aman dan terisolasi |
| CORS | 2.8.6 | Kebijakan akses lintas asal (Cross-Origin Resource Sharing) |

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

### 1. Halaman Dashboard Utama

Halaman utama menyajikan tiga kartu statistik yang dihitung secara dinamis dari data aktual di database: total mahasiswa, jumlah program studi yang terdaftar, dan jumlah tahun angkatan yang berbeda. Di bawah kartu statistik, terdapat form input dan tabel daftar mahasiswa yang berdampingan dalam tata letak dua kolom.

Header aplikasi menerapkan konsep animasi **Dynamic Island**. Dalam kondisi normal, header menampilkan nama aplikasi, logo, dan keterangan lengkap. Ketika pengguna melakukan scroll ke bawah, header secara otomatis mengecil menjadi kapsul ramping yang memuat statistik ringkas jumlah mahasiswa.

![Halaman Utama Aplikasi](./screenshots/tugas%20kelas/Homescreen.png)

---

### 2. Pendaftaran Data Mahasiswa Baru

Formulir input mendukung penambahan data lengkap: NIM, Nama Lengkap, Program Studi (dipilih dari dropdown yang diambil langsung dari database), Tahun Angkatan, dan Foto Profil. Foto diunggah menggunakan komponen dropzone kustom yang mendukung pratinjau instan sebelum disimpan.

Sistem memvalidasi duplikasi NIM di sisi server sebelum proses penyimpanan dilakukan. Selain itu, validasi di sisi client juga memastikan NIM minimal 5 karakter dan tahun angkatan berada dalam rentang yang wajar (1990 - sekarang).

![Mengisi Data Mahasiswa Baru](./screenshots/tugas%20kelas/Isi%20Data%20Mahasiswa%20Baru.png)

Setelah data berhasil tersimpan, sistem menampilkan notifikasi toast animasi berwarna hijau secara otomatis dan tabel langsung diperbarui.

![Data Mahasiswa Berhasil Disimpan](./screenshots/tugas%20kelas/Data%20Mahasiswa%20Disimpan.png)

---

### 3. Pengeditan Data Mahasiswa

Tombol edit (ikon pensil) pada setiap baris tabel akan memuat seluruh data mahasiswa tersebut ke dalam formulir secara otomatis. Jika mahasiswa memiliki foto, pratinjau foto yang sudah tersimpan akan ditampilkan beserta tombol hapus foto. Pengguna dapat mengganti foto dengan yang baru, menghapus foto yang ada, atau membiarkannya tanpa perubahan.

![Form Edit Mahasiswa](./screenshots/tugas%20kelas/Edit%20Mahasiswa.png)

Keberhasilan pengeditan dikonfirmasi dengan notifikasi toast animasi berwarna biru.

![Edit Data Berhasil](./screenshots/tugas%20kelas/Edit%20Berhasil.png)

---

### 4. Penghapusan Data dengan Konfirmasi Modal

Ketika tombol hapus ditekan, sistem **tidak langsung menghapus data**, melainkan menampilkan dialog konfirmasi kustom bergaya glassmorphism (Confirm Modal). Dialog ini meminta pengguna untuk menegaskan niatnya sebelum penghapusan dieksekusi.

![Dialog Konfirmasi Hapus](./screenshots/tugas%20kelas/Hapus%20Mahasiswa.png)

Setelah penghapusan dikonfirmasi, data dihapus dari database dan berkas foto terkait juga dihapus dari penyimpanan server secara otomatis.

![Data Berhasil Dihapus](./screenshots/tugas%20kelas/Hapus%20Berhasil.png)

---

### 5. Pencarian Data (Search)

Tabel mahasiswa mendukung pencarian teks bebas berdasarkan **NIM atau nama** secara real-time. Sistem menerapkan debounce (penundaan 500ms) agar tidak membebani server dengan permintaan berlebihan. Selama debounce berlangsung, ikon spinner berputar ditampilkan di samping kolom pencarian.

![Fitur Pencarian Mahasiswa](./screenshots/tugas%20kelas/Searching.png)

---

### 6. Filter Berdasarkan Program Studi

Pengguna dapat memfilter data mahasiswa berdasarkan program studi melalui dropdown. Daftar program studi diambil langsung dari endpoint `GET /api/prodi` sehingga selalu sinkron dengan data di database. Pemfilteran diproses di sisi server melalui parameter query string.

![Fitur Filter Program Studi](./screenshots/tugas%20kelas/Filtering.png)

---

### 7. Pagination Data

Data mahasiswa dibagi ke dalam halaman-halaman dengan kapasitas 5 data per halaman. Navigasi halaman dilengkapi dengan tombol nomor halaman, tombol sebelumnya (←), dan tombol berikutnya (→). Seluruh metadata pagination (halaman saat ini, total halaman, total data) dikelola oleh server dan dikembalikan bersama respons data.

![Navigasi Pagination](./screenshots/tugas%20kelas/Pagination.png)

---

### 8. Fitur Tambahan

- **Skeleton Loading:** Saat data sedang dimuat, tabel menampilkan animasi shimmer (kerangka transparan) alih-alih layar kosong.
- **Empty State:** Jika data kosong atau pencarian tidak membuahkan hasil, tabel menampilkan ilustrasi "Data Tidak Ditemukan" yang informatif.
- **Lightbox Foto Profil:** Setiap foto pada tabel dapat diklik untuk membuka pratinjau berukuran penuh dalam modal lightbox beserta nama dan NIM.
- **Sistem Notifikasi Toast:** Setiap aksi (tambah/edit/hapus) memunculkan notifikasi dengan warna berbeda: hijau (tambah), biru (edit), oranye (hapus), merah (error). Notifikasi dilengkapi progress bar countdown 4 detik.
- **Upload Foto Mahasiswa:** Mendukung format JPG, PNG, dan WEBP dengan batas maksimal 2MB. Foto lama otomatis dihapus dari server saat diganti atau dihapus.

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

Contoh penggunaan:
```
GET /api/mahasiswa?search=ahmad&prodi_id=1&page=1&limit=5
```

Respons sukses (200 OK):
```json
{
  "message": "Data mahasiswa berhasil diambil",
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 50,
    "totalPage": 10,
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
  "data": { "id": 11, "nim": "2401005", "nama": "Nama Mahasiswa", "..." : "..." }
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
  "data": { "id": 1, "nim": "2201001", "..." : "..." }
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
   DB_HOST=127.0.0.1
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

## Checklist Testing

### Pengujian Backend (API)

Gunakan Postman, Insomnia, atau cURL untuk menguji setiap endpoint berikut:

| No | Pengujian | Endpoint | Hasil yang Diharapkan |
|---|---|---|---|
| 1 | Koneksi database | - | Server backend berjalan tanpa error SQL di terminal |
| 2 | Ambil daftar prodi | GET `/api/prodi` | Mengembalikan array 6 prodi dengan status 200 |
| 3 | Ambil daftar mahasiswa | GET `/api/mahasiswa` | Mengembalikan data + meta pagination, status 200 |
| 4 | Pencarian mahasiswa | GET `/api/mahasiswa?search=ahmad` | Hanya mengembalikan data yang cocok |
| 5 | Filter prodi | GET `/api/mahasiswa?prodi_id=1` | Hanya mengembalikan mahasiswa prodi Informatika |
| 6 | Pagination | GET `/api/mahasiswa?page=2&limit=5` | Mengembalikan halaman kedua (data ke-6 s.d. ke-10) |
| 7 | Tambah mahasiswa + foto | POST `/api/mahasiswa` (form-data) | Status 201, file tersimpan di `uploads/mahasiswa/` |
| 8 | Update dengan foto baru | PUT `/api/mahasiswa/:id` + foto baru | Status 200, foto lama dihapus dari server |
| 9 | Update tanpa ganti foto | PUT `/api/mahasiswa/:id` tanpa field foto | Status 200, foto lama tetap tersimpan |
| 10 | Hapus mahasiswa | DELETE `/api/mahasiswa/:id` | Status 200, baris terhapus + file foto ikut terhapus |
| 11 | NIM duplikat | POST `/api/mahasiswa` dengan NIM yang sudah ada | Status 400, pesan "NIM tidak boleh duplikat" |

### Contoh Request Postman (Tambah Mahasiswa)

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/mahasiswa`
- **Body → form-data:**

| Key | Value | Tipe |
|---|---|---|
| nim | 220101 | Text |
| nama | Budi Santoso | Text |
| prodi_id | 1 | Text |
| angkatan | 2022 | Text |
| foto | *(pilih file gambar)* | File |

### Pengujian Frontend (UI)

| No | Pengujian | Kriteria Keberhasilan |
|---|---|---|
| 1 | Halaman utama | Dashboard menampilkan 3 kartu statistik dan tabel data |
| 2 | Tambah mahasiswa | Data baru muncul di tabel, notifikasi hijau muncul |
| 3 | Edit mahasiswa | Form terisi otomatis, data berubah setelah submit |
| 4 | Hapus mahasiswa | Modal konfirmasi muncul, data hilang setelah konfirmasi |
| 5 | Upload foto | Pratinjau foto muncul di form, foto tampil di tabel |
| 6 | Pencarian | Mengetik NIM/nama memfilter tabel secara real-time |
| 7 | Filter prodi | Memilih prodi dari dropdown memfilter data tabel |
| 8 | Pagination | Tombol halaman berfungsi, data berubah sesuai halaman |
| 9 | Skeleton loading | Animasi shimmer muncul saat data sedang dimuat |
| 10 | Empty state | Pesan "Data Tidak Ditemukan" muncul jika pencarian kosong |
| 11 | Responsif | Tampilan rapi di layar laptop (1024px+) dan mobile (375px) |

### Data Dummy SQL untuk Testing

Jalankan query berikut di MySQL untuk menambahkan data dummy:

```sql
INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, foto) VALUES
('230101', 'Andi Sucipto', 1, 2023, NULL),
('230102', 'Dewi Lestari', 2, 2023, NULL),
('230103', 'Farhan Ramadhan', 3, 2023, NULL),
('240101', 'Siti Nurhaliza', 1, 2024, NULL),
('240102', 'Reza Rahadian', 2, 2024, NULL),
('240103', 'Chelsea Islan', 3, 2024, NULL),
('240104', 'Dian Sastrowardoyo', 1, 2024, NULL),
('240105', 'Nicholas Saputra', 4, 2024, NULL),
('240106', 'Vanesha Prescilla', 5, 2024, NULL),
('240107', 'Iqbaal Ramadhan', 1, 2024, NULL);
```

---

## Penyelesaian Masalah Umum

| No | Masalah | Penyebab | Solusi |
|---|---|---|---|
| 1 | **Backend tidak jalan (EADDRINUSE)** | Port `3000` sudah dipakai aplikasi lain | Matikan proses lain dengan `npx kill-port 3000` lalu jalankan ulang `npm run dev` |
| 2 | **Database tidak terkoneksi (ECONNREFUSED / ETIMEDOUT)** | MySQL Server mati atau credentials salah | Hidupkan MySQL via XAMPP Control Panel. Cek `DB_HOST`, `DB_USER`, `DB_PASSWORD` di `.env`. Gunakan `127.0.0.1` alih-alih `localhost` jika XAMPP |
| 3 | **Foreign Key Error saat DELETE prodi** | Ada mahasiswa yang masih berelasi dengan prodi tersebut | Hapus atau pindahkan mahasiswa terlebih dahulu |
| 4 | **NIM Duplicate (400 Bad Request)** | NIM sudah terdaftar di database | Gunakan NIM yang berbeda dan unik |
| 5 | **Upload foto gagal (File too large)** | Ukuran file melebihi 2MB | Kompres gambar sebelum diunggah |
| 6 | **Foto tidak tampil di frontend** | URL backend salah atau folder uploads kosong | Pastikan `NEXT_PUBLIC_BACKEND_URL` di `.env.local` benar. Cek apakah file ada di `backend/uploads/mahasiswa/` |
| 7 | **CORS Error (Failed to Fetch)** | Origin frontend belum diizinkan di backend | Cek `app.use(cors({ origin: '...' }))` di `backend/src/app.ts`, pastikan port Next.js (3001) terdaftar |
| 8 | **Environment variable tidak terbaca** | Lupa restart dev server setelah mengubah `.env` | Matikan terminal (`Ctrl+C`) lalu jalankan ulang `npm run dev` |
| 9 | **Search tidak bekerja** | Query `LIKE` tidak menggunakan wildcard | Sudah di-handle di controller dengan `%${search}%` |
| 10 | **Pagination menampilkan NaN** | Tipe data `limit` terbaca sebagai string | Sudah di-handle dengan `parseInt()` di controller backend |
| 11 | **UI tidak berubah / CSS lama masih muncul** | Cache browser menyimpan CSS versi sebelumnya | Lakukan Hard Reload (`Ctrl + F5` atau `Cmd + Shift + R`) |
| 12 | **MySQL XAMPP corrupt (Incorrect file format)** | File system MySQL rusak (mati mendadak) | Rename folder `data` → `data_old`, copy folder `backup` → `data`, lalu pindahkan `ibdata1` dan folder database dari `data_old` ke `data` baru |

---

## Informasi Pengembang

Proyek ini dikembangkan sebagai bagian dari penugasan praktikum mata kuliah Pemrograman Web menggunakan stack Next.js dan Express.js.

**Nama Mahasiswa:** Muhammad Nafi Azka Soleiman  
**NIM:** 0102522017  
**Program Studi:** Informatika  
**Mata Kuliah:** Praktikum Frontend Next.js untuk Backend Express.js  
**Institusi:** Universitas Al-Azhar Indonesia
