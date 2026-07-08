# Tugas 14 Mingguan - Role Authorization Admin, Operator, dan Viewer

**Nama:** Muhammad Nafi Azka Soleiman
**NIM:** 0102522017
**Kelas:** IF22A

## Tujuan
Menambahkan middleware allowRoles, menerapkan role pada endpoint mahasiswa, membuat akun uji, melakukan testing endpoint, dan menyembunyikan tombol frontend sesuai role.

## Akun Uji

| Role | Email | Hak Akses |
|---|---|---|
| Admin | admin@kampus.ac.id | Full Access (Create, Read, Update, Delete) |
| Operator | operator@kampus.ac.id | Limited Access (Create, Read, Update) |
| Viewer | viewer@kampus.ac.id | Read-Only Access (Read) |

## Matriks Endpoint

| Method | Endpoint | Admin | Operator | Viewer |
|---|---|---|---|---|
| GET | `/api/mahasiswa` | ✅ Boleh | ✅ Boleh | ✅ Boleh |
| POST | `/api/mahasiswa` | ✅ Boleh | ✅ Boleh | ❌ Tidak boleh |
| PUT | `/api/mahasiswa/:id` | ✅ Boleh | ✅ Boleh | ❌ Tidak boleh |
| DELETE | `/api/mahasiswa/:id` | ✅ Boleh | ❌ Tidak boleh | ❌ Tidak boleh |

## Hasil Testing

| Role | Method | Endpoint | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| Admin | GET | `/api/mahasiswa` | Berhasil (200 OK) | Berhasil (200 OK) | ✅ Pass |
| Admin | POST | `/api/mahasiswa` | Berhasil (201 Created) | Berhasil (201 Created) | ✅ Pass |
| Admin | PUT | `/api/mahasiswa/:id` | Berhasil (200 OK) | Berhasil (200 OK) | ✅ Pass |
| Admin | DELETE | `/api/mahasiswa/:id` | Berhasil (200 OK) | Berhasil (200 OK) | ✅ Pass |
| Operator | GET | `/api/mahasiswa` | Berhasil (200 OK) | Berhasil (200 OK) | ✅ Pass |
| Operator | POST | `/api/mahasiswa` | Berhasil (201 Created) | Berhasil (201 Created) | ✅ Pass |
| Operator | PUT | `/api/mahasiswa/:id` | Berhasil (200 OK) | Berhasil (200 OK) | ✅ Pass |
| Operator | DELETE | `/api/mahasiswa/:id` | Gagal (403 Forbidden) | Gagal (403 Forbidden) | ✅ Pass |
| Viewer | GET | `/api/mahasiswa` | Berhasil (200 OK) | Berhasil (200 OK) | ✅ Pass |
| Viewer | POST | `/api/mahasiswa` | Gagal (403 Forbidden) | Gagal (403 Forbidden) | ✅ Pass |
| Viewer | PUT | `/api/mahasiswa/:id` | Gagal (403 Forbidden) | Gagal (403 Forbidden) | ✅ Pass |
| Viewer | DELETE | `/api/mahasiswa/:id` | Gagal (403 Forbidden) | Gagal (403 Forbidden) | ✅ Pass |
| Tanpa Login | GET | `/api/mahasiswa` | Gagal (401 Unauthorized) | Gagal (401 Unauthorized) | ✅ Pass |
| Tanpa Login | POST | `/api/mahasiswa` | Gagal (401 Unauthorized) | Gagal (401 Unauthorized) | ✅ Pass |
| Tanpa Login | PUT | `/api/mahasiswa/:id` | Gagal (401 Unauthorized) | Gagal (401 Unauthorized) | ✅ Pass |
| Tanpa Login | DELETE | `/api/mahasiswa/:id` | Gagal (401 Unauthorized) | Gagal (401 Unauthorized) | ✅ Pass |

## Catatan Keamanan
Menyembunyikan tombol di frontend (seperti tombol hapus atau form tambah) hanya untuk meningkatkan pengalaman pengguna, sedangkan keamanan utama tetap dilakukan di backend menggunakan authMiddleware dan allowRoles.
