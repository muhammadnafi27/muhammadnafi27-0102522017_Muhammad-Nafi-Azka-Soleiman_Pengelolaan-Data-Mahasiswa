# Laporan Uji Coba Endpoint CRUD User (Tugas 15 Kelas)

## 1. GET `/api/users`
- **Role Uji**: Admin
- **Expected**: 200 OK, daftar pengguna.
- **Actual**: 200 OK. Array pengguna berhasil diambil, field `password` tidak diikutsertakan dalam respons JSON.

## 2. POST `/api/users`
- **Role Uji**: Admin
- **Expected**: 201 Created.
- **Actual**: 201 Created. Pengguna baru berhasil ditambahkan dan password telah melalui proses hashing bcrypt. Pengecekan field wajib dan duplikat email/NIM berjalan normal.

## 3. PUT `/api/users/:id`
- **Role Uji**: Admin
- **Expected**: 200 OK.
- **Actual**: 200 OK. Informasi nama, email, dan role berhasil diperbarui. Validasi konflik email pengguna lain berfungsi baik. Endpoint ini tidak meng-update password.

## 4. DELETE `/api/users/:id`
- **Role Uji**: Admin
- **Expected**: 200 OK (jika bukan akun sendiri). 403 Forbidden (jika hapus diri sendiri).
- **Actual**: 200 OK. User terhapus. Saat mencoba menghapus ID yang sama dengan token login, mendapat respons `403 Admin tidak dapat menghapus akunnya sendiri`.

## 5. PATCH `/api/users/:id/reset-password`
- **Role Uji**: Admin
- **Expected**: 200 OK, temporary password direturn satu kali.
- **Actual**: 200 OK. Hash bcrypt baru berhasil tersimpan ke database. Password sementara (contoh: `0146db01`) tampil hanya satu kali pada respons untuk kebutuhan pengujian, sesuai ekspektasi sistem non-SMTP ini.

## Pengujian Unauthorized / Forbidden
Semua endpoint menolak akses jika diakses tanpa token (401 Unauthorized), atau menggunakan token Operator dan Viewer (403 Forbidden).
