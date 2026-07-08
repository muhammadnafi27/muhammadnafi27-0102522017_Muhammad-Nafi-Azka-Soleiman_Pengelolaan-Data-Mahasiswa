# Dokumentasi Testing Role Authorization (Tugas 14 Kelas)

Dokumentasi ini menjelaskan hasil pengujian backend role authorization untuk endpoint mahasiswa menggunakan middleware `authMiddleware` dan `allowRoles`.

## Akun Uji yang Digunakan
1. **Admin**: `admin@kampus.ac.id` (Password: `Admin12345`, Role: `admin`)
2. **Operator**: `operator@kampus.ac.id` (Password: `Operator12345`, Role: `operator`)
3. **Viewer**: `viewer@kampus.ac.id` (Password: `Viewer12345`, Role: `viewer`)

## Matriks Hasil Pengujian Endpoint

| Role | Endpoint | Method | Expected Status | Actual Status | Status |
|---|---|---|---|---|---|
| **Admin** | `/api/mahasiswa` | GET | `200 OK` | `200 OK` | **PASS** |
| **Admin** | `/api/mahasiswa` | POST | `200`/`201`/`400` (Bukan 403) | `400 Bad Request` | **PASS** |
| **Admin** | `/api/mahasiswa/:id` | PUT | `200`/`404` (Bukan 403) | `404 Not Found` | **PASS** |
| **Admin** | `/api/mahasiswa/:id` | DELETE | `200`/`404` (Bukan 403) | `404 Not Found` | **PASS** |
| **Operator** | `/api/mahasiswa` | GET | `200 OK` | `200 OK` | **PASS** |
| **Operator** | `/api/mahasiswa` | POST | `200`/`201`/`400` (Bukan 403) | `400 Bad Request` | **PASS** |
| **Operator** | `/api/mahasiswa/:id` | PUT | `200`/`404` (Bukan 403) | `404 Not Found` | **PASS** |
| **Operator** | `/api/mahasiswa/:id` | DELETE | `403 Forbidden` | `403 Forbidden` | **PASS** |
| **Viewer** | `/api/mahasiswa` | GET | `200 OK` | `200 OK` | **PASS** |
| **Viewer** | `/api/mahasiswa` | POST | `403 Forbidden` | `403 Forbidden` | **PASS** |
| **Viewer** | `/api/mahasiswa/:id` | PUT | `403 Forbidden` | `403 Forbidden` | **PASS** |
| **Viewer** | `/api/mahasiswa/:id` | DELETE | `403 Forbidden` | `403 Forbidden` | **PASS** |

*Catatan: Respon `400 Bad Request` (karena payload kosong/tidak valid) dan `404 Not Found` (karena ID mahasiswa tidak ditemukan) membuktikan bahwa request telah lolos dari pengecekan authorization di level middleware (`allowRoles`) dan berhasil mencapai controller backend.*

## Kesimpulan Keamanan
Security utama sistem ini sepenuhnya dikendalikan di sisi backend menggunakan kombinasi:
1. `authMiddleware` untuk validasi keaslian JWT Token.
2. `allowRoles` untuk membatasi akses endpoint berdasarkan role (`admin`, `operator`, `viewer`) sebelum file atau payload diproses lebih lanjut.
