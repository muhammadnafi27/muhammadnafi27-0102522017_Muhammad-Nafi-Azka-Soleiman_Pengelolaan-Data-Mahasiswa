# Tugas 14 Mingguan - Role Authorization Admin, Operator, dan Viewer

**Nama:** Muhammad Nafi Azka Soleiman
**NIM:** 0102522017
**Kelas:** IF22A

## Tujuan

Menambahkan middleware `allowRoles`, menerapkan role pada endpoint mahasiswa, membuat akun uji, membuat laporan hasil uji endpoint, dan menyembunyikan tombol frontend sesuai role.

## Middleware `allowRoles`

Middleware `allowRoles` ditempatkan setelah `authMiddleware` pada setiap rute yang membutuhkan kontrol akses. Jika `req.user` tidak ada, respon 401 dikembalikan. Jika role tidak termasuk dalam daftar yang diizinkan, respon 403 dikembalikan. Jika valid, eksekusi dilanjutkan ke middleware/controller berikutnya.

## Matriks Role Endpoint

| Role | GET Mahasiswa | POST Mahasiswa | PUT Mahasiswa | DELETE Mahasiswa |
|---|---|---|---|---|
| Admin | ✅ Boleh | ✅ Boleh | ✅ Boleh | ✅ Boleh |
| Operator | ✅ Boleh | ✅ Boleh | ✅ Boleh | ❌ 403 Forbidden |
| Viewer | ✅ Boleh | ❌ 403 Forbidden | ❌ 403 Forbidden | ❌ 403 Forbidden |

## Akun Uji

| Role | Email | Password Uji | Hak Akses |
|---|---|---|---|
| Admin | admin@kampus.ac.id | Admin12345 | Full Access (CRUD) |
| Operator | operator@kampus.ac.id | Operator12345 | Create, Read, Update |
| Viewer | viewer@kampus.ac.id | Viewer12345 | Read Only |

## Hasil Testing Endpoint

| Role | Method | Endpoint | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| Tanpa Login | GET | `/api/mahasiswa` | 401 Unauthorized | 401 Unauthorized | ✅ Pass |
| Tanpa Login | POST | `/api/mahasiswa` | 401 Unauthorized | 401 Unauthorized | ✅ Pass |
| Tanpa Login | PUT | `/api/mahasiswa/:id` | 401 Unauthorized | 401 Unauthorized | ✅ Pass |
| Tanpa Login | DELETE | `/api/mahasiswa/:id` | 401 Unauthorized | 401 Unauthorized | ✅ Pass |
| Admin | GET | `/api/mahasiswa` | 200 OK | 200 OK | ✅ Pass |
| Admin | POST | `/api/mahasiswa` | 201 Created | 201 Created | ✅ Pass |
| Admin | PUT | `/api/mahasiswa/:id` | 200 OK | 200 OK | ✅ Pass |
| Admin | DELETE | `/api/mahasiswa/:id` | 200 OK | 200 OK | ✅ Pass |
| Operator | GET | `/api/mahasiswa` | 200 OK | 200 OK | ✅ Pass |
| Operator | POST | `/api/mahasiswa` | 201 Created | 201 Created | ✅ Pass |
| Operator | PUT | `/api/mahasiswa/:id` | 200 OK | 200 OK | ✅ Pass |
| Operator | DELETE | `/api/mahasiswa/:id` | 403 Forbidden | 403 Forbidden | ✅ Pass |
| Viewer | GET | `/api/mahasiswa` | 200 OK | 200 OK | ✅ Pass |
| Viewer | POST | `/api/mahasiswa` | 403 Forbidden | 403 Forbidden | ✅ Pass |
| Viewer | PUT | `/api/mahasiswa/:id` | 403 Forbidden | 403 Forbidden | ✅ Pass |
| Viewer | DELETE | `/api/mahasiswa/:id` | 403 Forbidden | 403 Forbidden | ✅ Pass |

## Hasil Testing Frontend

| Role | Tombol Tambah | Tombol Edit | Tombol Hapus | Status |
|---|---|---|---|---|
| Admin | ✅ Tampil | ✅ Tampil | ✅ Tampil | ✅ Pass |
| Operator | ✅ Tampil | ✅ Tampil | ❌ Tersembunyi | ✅ Pass |
| Viewer | ❌ Tersembunyi | ❌ Tersembunyi | ❌ Tersembunyi | ✅ Pass |

## Catatan Keamanan

Menyembunyikan tombol di frontend hanya untuk meningkatkan pengalaman pengguna. Keamanan utama tetap dilakukan di backend menggunakan `authMiddleware` dan `allowRoles`. Seluruh endpoint divalidasi secara stateless melalui JWT, sehingga manipulasi DOM dari sisi browser tidak dapat melewati proteksi server.
