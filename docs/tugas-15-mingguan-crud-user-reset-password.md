# Tugas 15 Mingguan - CRUD User dan Reset Password Admin

## 1. Identitas
**Nama:** Muhammad Nafi Azka Soleiman  
**NIM:** 0102522017  
**Kelas:** IF22A  

## 2. Tujuan
- Membuat endpoint CRUD user.
- Melindungi endpoint user hanya untuk admin.
- Memastikan daftar user tidak mengirim field password.
- Membuat halaman `/users` di frontend untuk admin.
- Menambahkan fitur reset password oleh admin.
- Memahami pertimbangan SMTP Gmail.

## 3. Endpoint CRUD user
| Method | Endpoint | Role | Fungsi |
|---|---|---|---|
| GET | `/api/users` | Admin | Menampilkan daftar seluruh user (tanpa password). |
| POST | `/api/users` | Admin | Menambahkan user baru. Password di-hash menggunakan bcrypt. |
| PUT | `/api/users/:id` | Admin | Memperbarui data user (nama, email, role). |
| DELETE | `/api/users/:id` | Admin | Menghapus user. |
| PATCH | `/api/users/:id/reset-password` | Admin | Mereset password user secara acak, lalu mereturn *temporary password* 1x di response. |

## 4. Keamanan Backend
- **authMiddleware:** Mengamankan semua route API `/api/users` agar hanya user yang memiliki token JWT valid yang dapat mengakses.
- **allowRoles("admin"):** Memastikan hanya user dengan role `admin` yang bisa mengeksekusi operasi CRUD.
- **bcrypt hash password:** Menggunakan `bcrypt.hash()` untuk memastikan password tersimpan dengan aman (terenkripsi 1 arah).
- **SELECT field aman saja:** Query `GET /api/users` didesain untuk hanya me-return field publik (`id`, `name`, `email`, `role`, `created_at`), menghilangkan field `password` dari response.
- **temporary password:** Digenerate acak sepanjang 10 karakter saat admin melakukan reset, lalu di-return sekali ke frontend dan disimpan ke database dalam bentuk hash bcrypt.

## 5. Fitur Frontend
- **Halaman `/users`:** Dashboard modern dengan gaya *Glassmorphism* untuk mengelola akun sistem. Tersedia hanya bagi admin.
- **Tabel daftar user:** Menampilkan informasi user beserta role badge yang elegan.
- **Tambah user:** Modal popup clean yang memudahkan input user baru.
- **Edit user:** Modal popup yang mengisi data existing user secara otomatis.
- **Hapus user:** Dialog konfirmasi penghapusan demi mencegah misklik (termasuk validasi tidak bisa menghapus diri sendiri dari tabel).
- **Reset password:** Modal popup untuk mengonfirmasi aksi, dilanjutkan dengan modal card elegan yang menunjukkan temporary password agar admin dapat memberikannya ke user.
- **Proteksi halaman admin only:** Filter level-komponen untuk memblokir operator dan viewer agar tidak bisa masuk ke halaman ini. Menampilkan UI khusus "Akses Ditolak".

## 6. Akun Uji
| Role | Email | Password Uji | Hak Akses |
|---|---|---|---|
| Admin | `admin@kampus.ac.id` | `Admin12345` | Akses penuh CRUD Mahasiswa dan Manajemen User. |
| Operator | `operator@kampus.ac.id` | `Operator12345` | Akses CRUD Mahasiswa (Tanpa Manajemen User & tanpa fitur hapus Mahasiswa). |
| Viewer | `viewer@kampus.ac.id` | `Viewer12345` | Akses Read-only Mahasiswa. |

## 7. Hasil Testing Backend
| Role | Method | Endpoint | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| Admin | GET | `/api/users` | 200 OK (array users tanpa password) | 200 OK (array users tanpa password) | ✅ Sesuai |
| Admin | POST | `/api/users` | 201 Created (password dihash di DB) | 201 Created | ✅ Sesuai |
| Admin | PUT | `/api/users/:id` | 200 OK (data terupdate) | 200 OK | ✅ Sesuai |
| Admin | DELETE| `/api/users/:id` | 200 OK (data terhapus) | 200 OK | ✅ Sesuai |
| Admin | PATCH | `/api/users/:id/reset-password`| 200 OK (menampilkan temporary password 1x) | 200 OK (temp_pass tampil) | ✅ Sesuai |
| Operator| GET | `/api/users` | 403 Forbidden | 403 Forbidden | ✅ Sesuai |
| Operator| POST | `/api/users` | 403 Forbidden | 403 Forbidden | ✅ Sesuai |
| Viewer | GET | `/api/users` | 403 Forbidden | 403 Forbidden | ✅ Sesuai |
| Viewer | DELETE| `/api/users/:id` | 403 Forbidden | 403 Forbidden | ✅ Sesuai |
| - | GET | `/api/users` (tanpa token) | 401 Unauthorized | 401 Unauthorized | ✅ Sesuai |

## 8. Hasil Testing Frontend
| Role | Halaman `/users` | Menu Manajemen User | CRUD User | Reset Password | Status |
|---|---|---|---|---|---|
| Admin | Bisa diakses | Tampil di header | Berjalan lancar (Tambah, Edit, Hapus) | Menampilkan Modal berisi Temp Password | ✅ Sesuai |
| Operator | Diblokir (Akses Ditolak) | Tidak tampil | Tidak bisa | Tidak bisa | ✅ Sesuai |
| Viewer | Diblokir (Akses Ditolak) | Tidak tampil | Tidak bisa | Tidak bisa | ✅ Sesuai |

## 9. Pertimbangan SMTP Gmail
- SMTP Gmail dapat digunakan untuk latihan/prototipe.
- Gunakan App Password, bukan password utama Gmail.
- App Password membutuhkan 2-Step Verification.
- Credential harus disimpan di `.env`.
- `.env` **tidak boleh** di-commit.
- Production lebih baik memakai SMTP institusi, Google Workspace resmi, OAuth2, atau transactional email service (seperti AWS SES atau SendGrid).

## 10. Catatan Tambahan
- Seluruh hash dan token telah dijaga agar tidak ter-log di console atau terekspos di response sembarangan.
- Fitur mahasiswa pada Tugas 14 dipastikan tidak terdampak (tetap berfungsi sempurna).
- UI Manajemen User telah dirancang ulang agar memanfaatkan ruang layar penuh, menghilangkan variasi warna yang terlalu ramai menjadi lebih *sleek* dan seragam.
