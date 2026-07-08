# Sistem Pengelolaan Data Mahasiswa
### Universitas Al-Azhar Indonesia (UAI)

Sistem Informasi Pengelolaan Data Mahasiswa adalah aplikasi web full-stack berbasis arsitektur client-server yang dirancang untuk mengelola data akademik mahasiswa secara terpadu. Aplikasi ini dibangun menggunakan Next.js sebagai lapisan antarmuka client, Express.js sebagai lapisan layanan API server, dan MySQL sebagai sistem manajemen basis data relasional. Sistem ini dilengkapi dengan otentikasi JWT (JSON Web Token) dan proteksi endpoint untuk keamanan data.

---

## Daftar Isi

1. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
2. [Skema Database](#skema-database)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [Struktur Direktori](#struktur-direktori)
5. [Fitur Aplikasi](#fitur-aplikasi)
6. [Sistem Otentikasi (Tugas 13)](#sistem-otentikasi-tugas-13)
7. [Role-Based Access Control (Tugas 14 Mingguan)](#role-based-access-control-tugas-14-mingguan)
8. [Dokumentasi REST API](#dokumentasi-rest-api)
9. [Panduan Instalasi dan Menjalankan Aplikasi](#panduan-instalasi-dan-menjalankan-aplikasi)
10. [Checklist Testing](#checklist-testing)
11. [Penyelesaian Masalah Umum](#penyelesaian-masalah-umum)
12. [Informasi Pengembang](#informasi-pengembang)

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
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

| Teknologi | Versi | Kegunaan |
|---|---|---|
| Express.js | 5.2.1 | Framework minimalis untuk membangun REST API Node.js |
| mysql2 | 3.22.5 | Driver MySQL berbasis Promise dengan dukungan koneksi pool |
| Multer | 2.2.0 | Middleware penanganan unggahan berkas multipart/form-data |
| bcrypt | 6.0.0 | Library hashing password dengan algoritma bcrypt dan salt rounds |
| jsonwebtoken | 9.0.3 | Implementasi JSON Web Token untuk otentikasi stateless |
| helmet | 8.2.0 | Middleware keamanan HTTP headers |
| express-rate-limit | 8.5.2 | Pembatasan laju request untuk pencegahan brute-force |
| zod | 4.4.3 | Library validasi skema data runtime |
| TypeScript | 6.0.3 | Pengetikan statis backend untuk keandalan kode produksi |
| dotenv | 17.4.2 | Manajemen variabel lingkungan secara aman dan terisolasi |
| CORS | 2.8.6 | Kebijakan akses lintas asal (Cross-Origin Resource Sharing) |

---

## Skema Database

Database bernama `db_mahasiswa` menggunakan MySQL dengan tiga tabel yang terhubung melalui relasi foreign key.

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

### Tabel `users` (Tugas 13)

Menyimpan data akun pengguna untuk otentikasi sistem.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT AUTO_INCREMENT | Kunci utama (Primary Key) |
| name | VARCHAR(100) | Nama tampilan pengguna |
| nama_lengkap | VARCHAR(100) | Nama lengkap pengguna |
| nim | VARCHAR(20) | Nomor Induk Mahasiswa, bersifat unik |
| email | VARCHAR(100) | Alamat email, bersifat unik |
| prodi_id | INT | Kunci asing ke tabel `prodi` (nullable) |
| password | VARCHAR(255) | Hash password menggunakan bcrypt |
| role | ENUM('admin','operator','viewer') | Peran pengguna, default: `viewer` |
| created_at | TIMESTAMP | Waktu akun dibuat |
| updated_at | TIMESTAMP | Waktu akun terakhir diperbarui |

Relasi: `users.prodi_id` merujuk ke `prodi.id` dengan aturan `ON UPDATE CASCADE` dan `ON DELETE SET NULL`.

Password disimpan dalam bentuk hash bcrypt dengan salt rounds 10. Password plain text tidak pernah disimpan di database.

![Tabel Users dan Hash Password](./screenshots/tugas%20kelas/User%20Tabel%20&%20Hash%20Paswords.png)

---

## Role-Based Access Control (Tugas 14 Mingguan)

Pada Tugas 14 Mingguan, sistem ditingkatkan dengan implementasi **Role-Based Access Control (RBAC)** yang mengamankan endpoint backend dan menyesuaikan tampilan UI frontend berdasarkan peran pengguna yang sedang login.

### Middleware `allowRoles`

Middleware `allowRoles` diposisikan setelah `authMiddleware` pada setiap rute yang memerlukan kontrol akses. Urutan eksekusi:

1. `authMiddleware` — memverifikasi JWT dan mengisi `req.user`
2. `allowRoles(...)` — memeriksa apakah `req.user.role` termasuk dalam daftar role yang diizinkan
3. Upload middleware (jika ada)
4. Controller

### Matriks Akses Endpoint

| Method | Endpoint | Admin | Operator | Viewer |
|---|---|---|---|---|
| GET | `/api/mahasiswa` | ✅ Boleh | ✅ Boleh | ✅ Boleh |
| POST | `/api/mahasiswa` | ✅ Boleh | ✅ Boleh | ❌ 403 |
| PUT | `/api/mahasiswa/:id` | ✅ Boleh | ✅ Boleh | ❌ 403 |
| DELETE | `/api/mahasiswa/:id` | ✅ Boleh | ❌ 403 | ❌ 403 |

### Akun Uji Tersedia

| Role | Email | Password Uji | Hak Akses |
|---|---|---|---|
| Admin | admin@kampus.ac.id | Admin12345 | Full Access |
| Operator | operator@kampus.ac.id | Operator12345 | Create, Read, Update |
| Viewer | viewer@kampus.ac.id | Viewer12345 | Read Only |

### Tampilan Antarmuka per Role

#### Admin — Full Access
Admin memiliki hak penuh. Form tambah mahasiswa, tombol edit, dan tombol hapus ditampilkan seluruhnya. Role badge berwarna **amber** terlihat di header.

![Tampilan Admin](./screenshots/tugas%20kelas/Tampilan%20Admin.png)
![Fitur Admin Hapus](./screenshots/tugas%20kelas/Fitur%20Admin%20Hapus.png)

#### Operator — Akses Terbatas
Operator dapat menambah dan mengedit data mahasiswa, tetapi **tombol hapus tidak ditampilkan** di UI dan endpoint DELETE mengembalikan 403 Forbidden. Role badge berwarna **cyan**.

![Tampilan Operator](./screenshots/tugas%20kelas/Tampilan%20Operator.png)
![Operator Denied](./screenshots/tugas%20kelas/Operator%20Denied.png)

#### Viewer — Hanya Lihat
Viewer hanya dapat melihat data mahasiswa. Form tambah, tombol edit, dan tombol hapus **tidak dirender sama sekali** dari DOM. Kolom Aksi pada tabel pun menghilang. Banner informasi profesional ditampilkan. Role badge berwarna **violet**.

![Tampilan Viewer](./screenshots/tugas%20kelas/Tampilan%20Viewer.png)

### Tabel Referensi Data Seed

![Isi Tabel User Peran](./screenshots/tugas%20kelas/Isi%20Tabel%20User%20Peran.png)
![Tambahan Tabel User](./screenshots/tugas%20kelas/Tambahan%20Tabel%20User.png)

### Catatan Keamanan

Menyembunyikan tombol di frontend hanya untuk meningkatkan pengalaman pengguna. **Keamanan utama tetap dilakukan di backend** menggunakan `authMiddleware` dan `allowRoles`. Seluruh endpoint divalidasi secara stateless melalui JWT, sehingga manipulasi DOM dari sisi browser tidak dapat melewati proteksi server.

---

## Arsitektur Sistem

Sistem ini menerapkan pola arsitektur **Client-Server terpisah (Decoupled)** dengan lapisan otentikasi JWT yang melindungi endpoint sensitif.

```
Pengguna (Browser)
       |
       | HTTP Request
       v
[Frontend: Next.js - Port 3001]
  - Halaman Login (/login)
  - Halaman Register (/register)
  - Halaman Dashboard (/ - Protected)
  - AuthContext (State Management)
  - API Client (Authorization Bearer Token)
  - ProtectedRoute (Guard Component)
       |
       | HTTP/JSON + Authorization Header (CORS diizinkan)
       v
[Backend: Express.js - Port 3000]
  - Auth Routes (register, login, me, logout) - Publik/Protected
  - Mahasiswa Routes (CRUD) - Protected (authMiddleware)
  - Prodi Routes (GET) - Publik
  - authMiddleware (JWT Verification)
  - bcrypt (Password Hashing)
  - Static File Server (/uploads)
       |
       | SQL Query (mysql2 Pool - Parameterized)
       v
[Database: MySQL]
  - Tabel: prodi
  - Tabel: mahasiswa
  - Tabel: users (bcrypt hashed passwords)
```

### Alur Otentikasi

```
[Register] --> POST /auth/register --> bcrypt.hash(password) --> INSERT users
                                                                      |
[Login] --> POST /auth/login --> bcrypt.compare() --> jwt.sign() --> Token
                                                                      |
[Frontend] <-- Simpan token di localStorage <-- Response {token, user}
                                                                      |
[Request Protected] --> Authorization: Bearer <token> --> authMiddleware
                                                                      |
                                                jwt.verify() --> req.user --> Controller
```

---

## Struktur Direktori

```
Sistem Pengelolaan Data Mahasiswa/
|
+-- README.md                      Dokumentasi utama proyek ini
+-- screenshots/                   Dokumentasi visual tangkapan layar fitur
|   +-- tugas kelas/               Screenshot khusus tugas pertemuan
|
+-- backend/                       Layanan API Server (Express + TypeScript)
|   +-- src/
|   |   +-- controllers/
|   |   |   +-- auth.controller.ts     Logika register, login, me, dan logout
|   |   |   +-- mahasiswa.controller.ts   Logika bisnis CRUD dan pencarian mahasiswa
|   |   |   +-- prodi.controller.ts       Logika pengambilan daftar program studi
|   |   +-- middlewares/
|   |   |   +-- auth.middleware.ts      Verifikasi JWT, validasi role payload, isi req.user
|   |   |   +-- role.middleware.ts      Middleware allowRoles untuk otorisasi berbasis peran
|   |   |   +-- upload.middleware.ts    Konfigurasi Multer: validasi tipe & batas ukuran
|   |   +-- routes/
|   |   |   +-- auth.route.ts          Definisi endpoint otentikasi (register/login/me/logout)
|   |   |   +-- mahasiswa.route.ts     Definisi endpoint CRUD mahasiswa (authMiddleware + allowRoles)
|   |   |   +-- prodi.route.ts         Definisi endpoint program studi (publik)
|   |   +-- config/
|   |   |   +-- env.ts                Validasi environment variable terpusat
|   |   |   +-- database.ts           Inisialisasi MySQL connection pool
|   |   +-- app.ts                 Registrasi middleware, CORS, static files, dan rute
|   |   +-- server.ts              Titik masuk eksekusi server
|   +-- uploads/
|   |   +-- mahasiswa/             Penyimpanan fisik berkas foto profil mahasiswa
|   +-- db_mahasiswa.sql           Skrip inisialisasi skema tabel, seed data, dan akun uji
|   +-- .env.example               Contoh konfigurasi environment variable
|   +-- package.json               Dependensi dan skrip backend
|   +-- tsconfig.json              Konfigurasi kompilator TypeScript backend
|
+-- datamahasiswanafi/             Antarmuka Pengguna (Next.js + TypeScript)
    +-- src/
    |   +-- app/
    |   |   +-- (auth)/
    |   |   |   +-- login/
    |   |   |   |   +-- page.tsx       Halaman login dengan form email/NIM dan password
    |   |   |   +-- register/
    |   |   |       +-- page.tsx       Halaman registrasi akun baru
    |   |   +-- globals.css        Sistem desain CSS: variabel, glassmorphism, animasi
    |   |   +-- icon.png           Favicon topi wisuda biru untuk tab browser
    |   |   +-- layout.tsx         Tata letak halaman induk (root layout + Providers)
    |   |   +-- page.tsx           Halaman dashboard utama (protected)
    |   +-- components/
    |   |   +-- AuthLeftPanel.tsx   Panel branding kiri halaman otentikasi
    |   |   +-- DashboardCard.tsx  Kartu statistik: total mahasiswa, prodi, angkatan
    |   |   +-- MahasiswaForm.tsx  Form penambahan dan pengeditan data mahasiswa
    |   |   +-- MahasiswaTable.tsx Tabel data dengan pagination dan lightbox foto
    |   |   +-- ConfirmModal.tsx   Dialog modal glassmorphism untuk konfirmasi hapus
    |   |   +-- Notification.tsx   Sistem toast notifikasi animasi per jenis aksi
    |   |   +-- ProtectedRoute.tsx Komponen guard untuk halaman yang memerlukan login
    |   |   +-- Providers.tsx      Wrapper AuthProvider untuk App Router
    |   +-- context/
    |   |   +-- AuthContext.tsx    State management otentikasi (login/logout/refresh)
    |   +-- lib/
    |       +-- api.ts             API client terpusat dengan Authorization header otomatis
    |       +-- auth.ts            Utility penyimpanan token dan user di localStorage
    |       +-- permissions.ts    Helper canCreate/canEdit/canDelete dan getRoleBadgeStyle
    +-- .env.local                 Konfigurasi URL API dan backend untuk client
    +-- .env.example               Contoh konfigurasi environment variable
    +-- package.json               Dependensi dan skrip frontend
    +-- tsconfig.json              Konfigurasi kompilator TypeScript frontend
|
+-- docs/
|   +-- tugas-14-mingguan-role-authorization.md   Dokumentasi dan hasil testing role authorization
+-- laporan_uji_role.md            Laporan singkat hasil uji endpoint per role
```

---

## Fitur Aplikasi

### 1. Halaman Login (Tugas 13)

Halaman login menampilkan desain dua panel modern dengan tema dark navy. Panel kiri menampilkan branding aplikasi dengan ikon topi wisuda, judul "Pengelolaan Data Mahasiswa UAI", dan tiga fitur utama sistem. Panel kanan berisi form login dengan field Email/NIM dan Password.

Pengguna dapat masuk menggunakan alamat email atau Nomor Induk Mahasiswa (NIM). Sistem secara otomatis mendeteksi apakah input merupakan email atau NIM dan melakukan pencarian yang sesuai di database.

Fitur halaman login:
- Input email atau NIM dengan ikon Mail.
- Input password dengan ikon Lock.
- Tombol toggle show/hide password (ikon Eye dan EyeOff).
- Validasi form di sisi client sebelum pengiriman.
- Loading state pada tombol saat proses login berlangsung.
- Notifikasi popup error di pojok kanan atas jika login gagal.
- Redirect otomatis ke dashboard jika pengguna sudah terautentikasi.
- Tautan navigasi ke halaman register.

![Halaman Login](./screenshots/tugas%20kelas/Login%20Page.png)

![Login dengan Pengisian Data](./screenshots/tugas%20kelas/Login%20Isi.png)

![Notifikasi Error Login](./screenshots/tugas%20kelas/Salah%20Username%20Password.png)

---

### 2. Halaman Register (Tugas 13)

Halaman registrasi menggunakan layout dua panel yang konsisten dengan halaman login. Form registrasi menyediakan field yang sinkron dengan struktur tabel users di database backend.

Field registrasi:
- Nama Lengkap (minimal 3 karakter).
- NIM (Nomor Induk Mahasiswa, harus unik).
- Email (harus valid dan unik).
- Program Studi (dropdown diambil langsung dari database).
- Password (minimal 6 karakter, maksimal 72 karakter).
- Konfirmasi Password (harus cocok dengan password).

Fitur halaman register:
- Validasi lengkap di sisi client sebelum pengiriman.
- Show/hide password untuk field password dan konfirmasi password.
- Deteksi email atau NIM duplikat dari response backend.
- Loading state pada tombol saat proses registrasi.
- Pesan sukses hijau setelah registrasi berhasil.
- Redirect otomatis ke halaman login setelah 2 detik.
- Redirect otomatis ke dashboard jika pengguna sudah login.
- Pengguna baru selalu mendapatkan role `viewer`.

![Halaman Register](./screenshots/tugas%20kelas/Halaman%20Register.png)

![Pengisian Form Register](./screenshots/tugas%20kelas/Isi%20Halaman%20Register.png)

![Registrasi Berhasil](./screenshots/tugas%20kelas/Register%20Berhasil.png)

---

### 3. Halaman Dashboard Utama

Halaman utama menyajikan tiga kartu statistik yang dihitung secara dinamis dari data aktual di database: total mahasiswa, jumlah program studi yang terdaftar, dan jumlah tahun angkatan yang berbeda. Di bawah kartu statistik, terdapat form input dan tabel daftar mahasiswa yang berdampingan dalam tata letak dua kolom.

Header aplikasi menerapkan konsep animasi **Dynamic Island**. Dalam kondisi normal, header menampilkan nama aplikasi, logo, dan keterangan lengkap. Ketika pengguna melakukan scroll ke bawah, header secara otomatis mengecil menjadi kapsul ramping yang memuat statistik ringkas jumlah mahasiswa.

Di bawah header, terdapat sapaan "Selamat Datang, (Nama User)!" yang menampilkan nama pengguna yang sedang login secara dinamis.

Tombol **Keluar** tersedia di header Dynamic Island dengan ikon LogOut. Tombol ini memanggil endpoint logout, menghapus token dan data user dari localStorage, dan mengarahkan pengguna ke halaman login.

![Halaman Utama Aplikasi](./screenshots/tugas%20kelas/Homescreen.png)

---

### 4. Pendaftaran Data Mahasiswa Baru

Formulir input mendukung penambahan data lengkap: NIM, Nama Lengkap, Program Studi (dipilih dari dropdown yang diambil langsung dari database), Tahun Angkatan, dan Foto Profil. Foto diunggah menggunakan komponen dropzone kustom yang mendukung pratinjau instan sebelum disimpan.

Sistem memvalidasi duplikasi NIM di sisi server sebelum proses penyimpanan dilakukan. Selain itu, validasi di sisi client juga memastikan NIM minimal 5 karakter dan tahun angkatan berada dalam rentang yang wajar (1990 - sekarang).

Seluruh endpoint CRUD mahasiswa dilindungi oleh `authMiddleware` sehingga hanya pengguna yang terautentikasi yang dapat menambah, mengubah, atau menghapus data.

![Mengisi Data Mahasiswa Baru](./screenshots/tugas%20kelas/Isi%20Data%20Mahasiswa%20Baru.png)

Setelah data berhasil tersimpan, sistem menampilkan notifikasi toast animasi berwarna hijau secara otomatis dan tabel langsung diperbarui.

![Data Mahasiswa Berhasil Disimpan](./screenshots/tugas%20kelas/Data%20Mahasiswa%20Disimpan.png)

---

### 5. Pengeditan Data Mahasiswa

Tombol edit (ikon pensil) pada setiap baris tabel akan memuat seluruh data mahasiswa tersebut ke dalam formulir secara otomatis. Jika mahasiswa memiliki foto, pratinjau foto yang sudah tersimpan akan ditampilkan beserta tombol hapus foto. Pengguna dapat mengganti foto dengan yang baru, menghapus foto yang ada, atau membiarkannya tanpa perubahan.

![Form Edit Mahasiswa](./screenshots/tugas%20kelas/Edit%20Mahasiswa.png)

Keberhasilan pengeditan dikonfirmasi dengan notifikasi toast animasi berwarna biru.

![Edit Data Berhasil](./screenshots/tugas%20kelas/Edit%20Berhasil.png)

---

### 6. Penghapusan Data dengan Konfirmasi Modal

Ketika tombol hapus ditekan, sistem **tidak langsung menghapus data**, melainkan menampilkan dialog konfirmasi kustom bergaya glassmorphism (Confirm Modal). Dialog ini meminta pengguna untuk menegaskan niatnya sebelum penghapusan dieksekusi.

![Dialog Konfirmasi Hapus](./screenshots/tugas%20kelas/Hapus%20Mahasiswa.png)

Setelah penghapusan dikonfirmasi, data dihapus dari database dan berkas foto terkait juga dihapus dari penyimpanan server secara otomatis.

![Data Berhasil Dihapus](./screenshots/tugas%20kelas/Hapus%20Berhasil.png)

---

### 7. Pencarian Data (Search)

Tabel mahasiswa mendukung pencarian teks bebas berdasarkan **NIM atau nama** secara real-time. Sistem menerapkan debounce (penundaan 500ms) agar tidak membebani server dengan permintaan berlebihan. Selama debounce berlangsung, ikon spinner berputar ditampilkan di samping kolom pencarian.

![Fitur Pencarian Mahasiswa](./screenshots/tugas%20kelas/Searching.png)

---

### 8. Filter Berdasarkan Program Studi

Pengguna dapat memfilter data mahasiswa berdasarkan program studi melalui dropdown. Daftar program studi diambil langsung dari endpoint `GET /api/prodi` sehingga selalu sinkron dengan data di database. Pemfilteran diproses di sisi server melalui parameter query string.

![Fitur Filter Program Studi](./screenshots/tugas%20kelas/Filtering.png)

---

### 9. Pagination Data

Data mahasiswa dibagi ke dalam halaman-halaman dengan kapasitas 5 data per halaman. Navigasi halaman dilengkapi dengan tombol nomor halaman, tombol sebelumnya, dan tombol berikutnya. Seluruh metadata pagination (halaman saat ini, total halaman, total data) dikelola oleh server dan dikembalikan bersama respons data.

![Navigasi Pagination](./screenshots/tugas%20kelas/Pagination.png)

---

### 10. Fitur Tambahan

- **Skeleton Loading:** Saat data sedang dimuat, tabel menampilkan animasi shimmer (kerangka transparan) alih-alih layar kosong.
- **Empty State:** Jika data kosong atau pencarian tidak membuahkan hasil, tabel menampilkan ilustrasi "Data Tidak Ditemukan" yang informatif.
- **Lightbox Foto Profil:** Setiap foto pada tabel dapat diklik untuk membuka pratinjau berukuran penuh dalam modal lightbox beserta nama dan NIM.
- **Sistem Notifikasi Toast:** Setiap aksi (tambah/edit/hapus/login error) memunculkan notifikasi dengan warna berbeda: hijau (tambah), biru (edit), oranye (hapus), merah (error). Notifikasi dilengkapi progress bar countdown 4 detik.
- **Upload Foto Mahasiswa:** Mendukung format JPG, PNG, dan WEBP dengan batas maksimal 2MB. Foto lama otomatis dihapus dari server saat diganti atau dihapus.

---

## Sistem Otentikasi (Tugas 13)

Bagian ini menjelaskan secara detail implementasi sistem otentikasi yang dikerjakan pada Tugas Pertemuan 13.

### Komponen Backend Otentikasi

#### 1. Tabel Users

Tabel `users` dibuat di dalam file `db_mahasiswa.sql` dengan struktur yang mendukung otentikasi berbasis email/NIM dan role-based access. Password disimpan sebagai hash bcrypt (VARCHAR 255) dan tidak pernah disimpan dalam bentuk plain text. Role default untuk pengguna baru adalah `viewer`.

#### 2. Endpoint Register (`POST /auth/register`)

Endpoint publik yang menerima data registrasi pengguna baru. Proses yang dilakukan:
- Validasi kelengkapan field (nama_lengkap, nim, email, password wajib).
- Pengecekan duplikasi email dan NIM di database.
- Hashing password menggunakan `bcrypt.hash()` dengan salt rounds 10.
- Insert data pengguna baru dengan role `viewer`.
- Response tidak mengembalikan password atau hash.

#### 3. Endpoint Login (`POST /auth/login`)

Endpoint publik yang memproses otentikasi pengguna. Proses yang dilakukan:
- Validasi kelengkapan field email dan password.
- Deteksi otomatis apakah input berupa email atau NIM.
- Validasi format email jika input mengandung karakter `@`.
- Pencarian user berdasarkan email ATAU NIM menggunakan parameterized query.
- Verifikasi password menggunakan `bcrypt.compare()`.
- Pembuatan JWT menggunakan `jwt.sign()` dengan payload (id, email, role) dan masa berlaku 2 jam.
- Pesan error generik ("Email/NIM atau password salah") yang tidak membocorkan keberadaan akun.
- Response mengembalikan token dan data user tanpa password.

#### 4. Endpoint Auth/Me (`GET /auth/me`)

Endpoint protected yang mengembalikan data profil pengguna yang sedang login. Digunakan oleh frontend untuk memvalidasi sesi saat aplikasi dimuat atau browser di-refresh.

#### 5. Endpoint Logout (`POST /auth/logout`)

Endpoint protected yang mengkonfirmasi logout. Implementasi bersifat stateless karena JWT tidak disimpan di server. Penghapusan sesi dilakukan sepenuhnya di sisi client.

#### 6. Auth Middleware

Middleware yang memverifikasi JWT pada setiap request ke endpoint protected:
- Membaca token dari header `Authorization: Bearer <token>`.
- Memvalidasi format header dan keberadaan token.
- Memverifikasi token menggunakan `jwt.verify()` dengan JWT_SECRET.
- Memvalidasi tipe data payload (id: number, email: string, role: enum).
- Menyimpan data user ke `req.user` untuk digunakan oleh controller.
- Menolak token kosong, invalid, atau expired dengan status 401.

#### 7. Proteksi Endpoint Mahasiswa dengan allowRoles (Tugas 14)

Seluruh endpoint CRUD mahasiswa dilindungi oleh `authMiddleware` + `allowRoles`:

| Method | Endpoint | Middleware | Admin | Operator | Viewer |
|---|---|---|---|---|---|
| GET | /api/mahasiswa | authMiddleware + allowRoles | ✅ | ✅ | ✅ |
| POST | /api/mahasiswa | authMiddleware + allowRoles | ✅ | ✅ | ❌ 403 |
| PUT | /api/mahasiswa/:id | authMiddleware + allowRoles | ✅ | ✅ | ❌ 403 |
| DELETE | /api/mahasiswa/:id | authMiddleware + allowRoles | ✅ | ❌ 403 | ❌ 403 |

Endpoint yang tetap publik (tanpa authMiddleware):

| Method | Endpoint | Akses |
|---|---|---|
| POST | /auth/register | Publik |
| POST | /auth/login | Publik |
| GET | /api/prodi | Publik |

### Komponen Frontend Otentikasi

#### 1. Penyimpanan Token (localStorage)

Token JWT disimpan di `localStorage` dengan key `mahasiswa_auth_token`. Data user disimpan dengan key `mahasiswa_auth_user`. Sebelum menyimpan data user, field password dihapus dari objek untuk keamanan. Semua akses localStorage dilindungi dengan pengecekan `typeof window !== 'undefined'` untuk mencegah error saat Server-Side Rendering.

#### 2. API Client Terpusat

File `src/lib/api.ts` menyediakan fungsi `fetchApi` yang secara otomatis:
- Menyematkan header `Authorization: Bearer <token>` pada setiap request.
- Menambahkan `Content-Type: application/json` untuk body berupa objek.
- Menangani response 401 dengan menghapus sesi dan redirect ke `/login`.
- Mencegah redirect loop menggunakan flag `isRedirecting`.

#### 3. AuthContext (State Management)

`AuthContext` menggunakan React Context API untuk mengelola state otentikasi secara global:
- State: `user`, `isAuthenticated`, `isLoading`.
- Fungsi: `login()`, `logout()`, `refreshUser()`.
- Saat aplikasi dimuat, context memeriksa token di localStorage dan memanggil `GET /auth/me` untuk memvalidasi sesi.
- Jika token invalid atau expired, sesi dihapus otomatis.

#### 4. ProtectedRoute (Guard Component)

Komponen wrapper yang melindungi halaman dashboard:
- Menunggu proses loading selesai sebelum menampilkan konten.
- Jika pengguna tidak terautentikasi, redirect ke `/login`.
- Konten halaman tidak dirender sama sekali sebelum validasi selesai.

#### 5. Redirect Otentikasi

- Pengguna yang sudah login dan membuka `/login` atau `/register` diarahkan ke dashboard.
- Pengguna belum login yang membuka halaman protected diarahkan ke `/login`.
- Loading state ditampilkan selama pemeriksaan otentikasi berlangsung.

#### 6. Tombol Logout

Tombol "Keluar" dengan ikon LogOut terletak di header Dynamic Island:
- Memanggil `POST /auth/logout` ke backend.
- Menghapus token dan data user dari localStorage.
- Mereset state AuthContext.
- Redirect ke halaman `/login`.
- Tetap menghapus data lokal jika request backend gagal.

### Keamanan

| Aspek | Implementasi |
|---|---|
| Penyimpanan password | bcrypt hash dengan salt rounds 10 |
| Otentikasi | JWT stateless dengan masa berlaku 2 jam |
| JWT Secret | Disimpan di `.env`, tidak di-commit ke repository |
| Proteksi endpoint | authMiddleware pada seluruh CRUD mahasiswa |
| SQL Injection | Parameterized query pada seluruh operasi database |
| CORS | Dikonfigurasi dengan origin spesifik dari FRONTEND_URL |
| Error message | Pesan generik yang tidak membocorkan keberadaan akun |
| Password di response | Tidak pernah dikembalikan dalam response API |
| Password di localStorage | Dihapus dari objek user sebelum disimpan |
| `.env` di repository | Masuk dalam `.gitignore`, tidak di-tracking |
| Token di console | Tidak pernah dicatat ke console log |

---

## Dokumentasi REST API

Semua komunikasi antara frontend dan backend menggunakan format JSON. Backend berjalan pada `http://localhost:3000`.

### Endpoint: Otentikasi (Tugas 13)

**POST /auth/register**

Mendaftarkan pengguna baru ke dalam sistem.

| Field | Tipe | Keterangan |
|---|---|---|
| nama_lengkap | string | Nama lengkap pengguna (wajib) |
| nim | string | Nomor Induk Mahasiswa (wajib, harus unik) |
| email | string | Alamat email (wajib, harus unik) |
| prodi_id | number | ID program studi (opsional) |
| password | string | Password minimal 6 karakter (wajib) |

Respons sukses (201 Created):
```json
{
  "message": "Registrasi berhasil",
  "data": {
    "id": 1,
    "nama_lengkap": "Muhammad Nafi",
    "nim": "0102522017",
    "email": "nafi@uai.ac.id",
    "role": "viewer"
  }
}
```

Respons gagal - email/NIM duplikat (409 Conflict):
```json
{
  "message": "Email atau NIM sudah terdaftar"
}
```

**POST /auth/login**

Mengotentikasi pengguna dan menghasilkan JWT.

| Field | Tipe | Keterangan |
|---|---|---|
| email | string | Email atau NIM pengguna (wajib) |
| password | string | Password pengguna (wajib) |

Respons sukses (200 OK):
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "<JWT_TOKEN>",
    "user": {
      "id": 1,
      "name": "Muhammad Nafi",
      "email": "nafi@uai.ac.id",
      "role": "viewer"
    }
  }
}
```

Respons gagal (401 Unauthorized):
```json
{
  "message": "Email/NIM atau password salah"
}
```

**GET /auth/me** (Protected)

Mengambil data profil pengguna yang sedang login.

Header yang diperlukan:
```
Authorization: Bearer <JWT_TOKEN>
```

Respons sukses (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Muhammad Nafi",
      "email": "nafi@uai.ac.id",
      "role": "viewer",
      "created_at": "2026-07-04T10:00:00.000Z",
      "updated_at": "2026-07-04T10:00:00.000Z"
    }
  }
}
```

**POST /auth/logout** (Protected)

Mengakhiri sesi pengguna (stateless).

Respons sukses (200 OK):
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

### Endpoint: Program Studi

**GET /api/prodi**

Mengambil daftar seluruh program studi yang tersedia. Endpoint ini bersifat publik dan tidak memerlukan otentikasi.

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

### Endpoint: Mahasiswa (Protected)

Seluruh endpoint mahasiswa memerlukan header `Authorization: Bearer <token>`.

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
Authorization: Bearer <token>
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

Respons gagal - tanpa token (401 Unauthorized):
```json
{
  "success": false,
  "message": "Token tidak ditemukan"
}
```

**POST /api/mahasiswa** (Protected)

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
  "data": { "id": 11, "nim": "2401005", "nama": "Nama Mahasiswa" }
}
```

**PUT /api/mahasiswa/:id** (Protected)

Memperbarui data mahasiswa berdasarkan ID. Request menggunakan format `multipart/form-data`.

| Field | Tipe | Keterangan |
|---|---|---|
| nim | string | NIM baru (wajib, harus unik di antara mahasiswa lain) |
| nama | string | Nama baru (wajib) |
| prodi_id | number | ID program studi baru (wajib) |
| angkatan | number | Tahun angkatan baru (wajib) |
| foto | file | Foto baru untuk menggantikan foto lama (opsional) |
| removeFoto | string | Isi dengan nilai `"true"` untuk menghapus foto yang ada (opsional) |

**DELETE /api/mahasiswa/:id** (Protected)

Menghapus data mahasiswa secara permanen beserta berkas foto dari penyimpanan server.

Respons sukses (200 OK):
```json
{
  "message": "Data mahasiswa berhasil dihapus"
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
3. Jalankan seluruh skrip SQL yang ada dalam berkas `backend/db_mahasiswa.sql`. Skrip ini akan membuat database baru bernama `db_mahasiswa`, membuat tabel `prodi`, `mahasiswa`, dan `users`, serta mengisi data awal (seed data).

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

3. Buat berkas `.env` di dalam folder `backend/` dan sesuaikan isinya:
   ```env
   PORT=3000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=db_mahasiswa
   FRONTEND_URL=http://localhost:3001
   JWT_SECRET=masukkan_secret_key_yang_kuat_dan_panjang
   JWT_EXPIRES_IN=2h
   ```
   Kosongkan `DB_PASSWORD` jika MySQL tidak menggunakan kata sandi. Ganti `JWT_SECRET` dengan string acak yang kuat.

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

### Langkah 4: Membuat Akun dan Masuk

1. Buka `http://localhost:3001/register` di browser.
2. Isi form registrasi dengan data yang valid.
3. Setelah registrasi berhasil, Anda akan diarahkan ke halaman login.
4. Masukkan email atau NIM beserta password yang telah didaftarkan.
5. Setelah login berhasil, Anda akan diarahkan ke dashboard utama.

---

## Checklist Testing

### Pengujian Backend (API)

Gunakan Postman, Insomnia, atau cURL untuk menguji setiap endpoint berikut:

#### Pengujian Otentikasi (Tugas 13)

| No | Pengujian | Endpoint | Hasil yang Diharapkan |
|---|---|---|---|
| 1 | Register berhasil | POST `/auth/register` | Status 201, data user tanpa password |
| 2 | Register nama kosong | POST `/auth/register` | Status 400, pesan field wajib |
| 3 | Register email duplikat | POST `/auth/register` | Status 409, pesan sudah terdaftar |
| 4 | Register NIM duplikat | POST `/auth/register` | Status 409, pesan sudah terdaftar |
| 5 | Login berhasil dengan email | POST `/auth/login` | Status 200, token dan data user |
| 6 | Login berhasil dengan NIM | POST `/auth/login` | Status 200, token dan data user |
| 7 | Login email uppercase | POST `/auth/login` | Status 200, email dinormalisasi |
| 8 | Login password salah | POST `/auth/login` | Status 401, pesan generik |
| 9 | Login email tidak ditemukan | POST `/auth/login` | Status 401, pesan generik |
| 10 | Auth/me dengan token valid | GET `/auth/me` | Status 200, data user |
| 11 | Auth/me tanpa token | GET `/auth/me` | Status 401 |
| 12 | Logout dengan token | POST `/auth/logout` | Status 200 |
| 13 | Password hash terverifikasi | Database | bcrypt hash valid |

#### Pengujian Protected Route

| No | Pengujian | Endpoint | Hasil yang Diharapkan |
|---|---|---|---|
| 1 | GET mahasiswa tanpa token | GET `/api/mahasiswa` | Status 401, token tidak ditemukan |
| 2 | GET mahasiswa token palsu | GET `/api/mahasiswa` | Status 401, token tidak valid |
| 3 | GET mahasiswa token valid | GET `/api/mahasiswa` | Status 200, data mahasiswa |
| 4 | POST mahasiswa tanpa token | POST `/api/mahasiswa` | Status 401 |
| 5 | PUT mahasiswa tanpa token | PUT `/api/mahasiswa/:id` | Status 401 |
| 6 | DELETE mahasiswa tanpa token | DELETE `/api/mahasiswa/:id` | Status 401 |
| 7 | Register tanpa token | POST `/auth/register` | Status 201 (publik) |
| 8 | Login tanpa token | POST `/auth/login` | Status 200 (publik) |
| 9 | GET prodi tanpa token | GET `/api/prodi` | Status 200 (publik) |

#### Pengujian CRUD Mahasiswa

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

### Pengujian Frontend (UI)

#### Pengujian Otentikasi

| No | Pengujian | Kriteria Keberhasilan |
|---|---|---|
| 1 | Halaman login tampil | Desain dua panel dark navy, form email/NIM dan password |
| 2 | Halaman register tampil | Form lengkap dengan nama, NIM, email, prodi, password |
| 3 | Login berhasil | Redirect ke dashboard, nama user tampil di header |
| 4 | Login gagal | Notifikasi popup error muncul di pojok kanan atas |
| 5 | Register berhasil | Pesan sukses hijau, redirect ke login setelah 2 detik |
| 6 | Register email duplikat | Pesan error ditampilkan |
| 7 | Show/hide password | Ikon mata toggle visibility password |
| 8 | Loading state | Tombol disabled dan teks berubah saat proses |
| 9 | Token tersimpan | localStorage berisi key `mahasiswa_auth_token` |
| 10 | User tersimpan | localStorage berisi key `mahasiswa_auth_user` tanpa password |
| 11 | Refresh browser | Sesi tetap aktif, auth/me dipanggil |
| 12 | Halaman protected tanpa login | Redirect ke /login |
| 13 | Login kembali ke /login | Redirect ke dashboard |
| 14 | Tombol logout | Token dan user dihapus, redirect ke /login |

#### Pengujian CRUD dan UI

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

#### Pengujian Role-Based UI (Tugas 14 Mingguan)

| Role | Role Badge | Form Tambah | Tombol Edit | Tombol Hapus | Data Tampil | Status |
|---|---|---|---|---|---|---|
| Admin | 🟡 Amber | ✅ Tampil | ✅ Tampil | ✅ Tampil | ✅ | ✅ Pass |
| Operator | 🔵 Cyan | ✅ Tampil | ✅ Tampil | ❌ Tersembunyi | ✅ | ✅ Pass |
| Viewer | 🟣 Violet | ❌ Tersembunyi | ❌ Tersembunyi | ❌ Tersembunyi | ✅ | ✅ Pass |

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
| 9 | **Login gagal "Email/NIM atau password salah"** | Email/NIM tidak terdaftar atau password salah | Pastikan akun sudah terdaftar melalui halaman register. Password bersifat case-sensitive |
| 10 | **Token expired (401)** | JWT sudah melewati masa berlaku 2 jam | Login ulang untuk mendapatkan token baru |
| 11 | **Redirect loop /login** | Token rusak di localStorage | Buka DevTools > Application > Local Storage, hapus key `mahasiswa_auth_token` dan `mahasiswa_auth_user`, lalu refresh |
| 12 | **JWT_SECRET error** | Variabel `JWT_SECRET` belum diatur di `.env` | Tambahkan `JWT_SECRET=string_acak_kuat` di berkas `backend/.env` |
| 13 | **Gagal mengambil data program studi** | Endpoint `/api/prodi` memerlukan token | Pastikan endpoint prodi bersifat publik (tanpa authMiddleware) |
| 14 | **UI tidak berubah / CSS lama masih muncul** | Cache browser menyimpan CSS versi sebelumnya | Lakukan Hard Reload (`Ctrl + F5` atau `Cmd + Shift + R`) |
| 15 | **MySQL XAMPP corrupt (Incorrect file format)** | File system MySQL rusak (mati mendadak) | Rename folder `data` ke `data_old`, copy folder `backup` ke `data`, lalu pindahkan `ibdata1` dan folder database dari `data_old` ke `data` baru |

---

## Informasi Pengembang

Proyek ini dikembangkan sebagai bagian dari penugasan praktikum mata kuliah Pemrograman Web menggunakan stack Next.js dan Express.js.

**Nama Mahasiswa:** Muhammad Nafi Azka Soleiman  
**NIM:** 0102522017  
**Program Studi:** Informatika  
**Mata Kuliah:** Praktikum Frontend Next.js untuk Backend Express.js  
**Institusi:** Universitas Al-Azhar Indonesia  

### Riwayat Tugas

| Pertemuan | Deskripsi | Status |
|---|---|---|
| Tugas Awal | CRUD Mahasiswa, Search, Filter, Pagination, Upload Foto | Selesai |
| Tugas 13 | Tabel Users, Register, Login, bcrypt, JWT, authMiddleware, Protected Route, Halaman Login, Halaman Register, Tombol Logout, localStorage Token | Selesai |
| Tugas 14 Mingguan | Middleware allowRoles, Role Authorization Endpoint Mahasiswa, Akun Uji Admin/Operator/Viewer, Laporan Testing, Frontend Conditional Rendering per Role, Role Badge, Viewer Info Banner | Selesai |
