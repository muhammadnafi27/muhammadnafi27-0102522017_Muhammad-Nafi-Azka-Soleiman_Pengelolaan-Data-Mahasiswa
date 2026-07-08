# Tugas 15 Kelas - CRUD Daftar User dan Reset Password Admin

**Nama:** Muhammad Nafi Azka Soleiman  
**NIM:** 0102522017  
**Kelas:** IF22A

---

## Tujuan

- Membuat endpoint CRUD daftar user khusus admin.
- Membatasi pengelolaan user hanya untuk peran admin.
- Memastikan response tidak mengirimkan field password ke frontend.
- Membuat fitur reset password user oleh admin.

---

## Endpoint CRUD User

| Method | Endpoint | Role | Fungsi |
|---|---|---|---|
| GET | `/api/users` | admin | Melihat daftar user |
| POST | `/api/users` | admin | Menambah user baru |
| PUT | `/api/users/:id` | admin | Mengubah nama, email, dan role user |
| DELETE | `/api/users/:id` | admin | Menghapus user |
| PATCH | `/api/users/:id/reset-password` | admin | Reset password user |

---

## Prinsip Keamanan

- Seluruh endpoint `/api/users` hanya dapat diakses oleh role **admin**.
- `authMiddleware` memvalidasi JWT pada setiap request.
- `allowRoles("admin")` menolak akses role lain dengan respons `403 Forbidden`.
- Field `password` dan hash bcrypt tidak pernah dikirimkan dalam response API.
- Password user baru di-hash menggunakan `bcrypt.hash(password, 10)` sebelum disimpan.
- Temporary password di-generate menggunakan `crypto.randomBytes` (aman secara kriptografis) dan hanya ditampilkan **satu kali** di response.
- Admin tidak dapat menghapus akun dirinya sendiri (Self-Deletion Lockout).

---

## Akun Uji

| Role | Email | Password Uji | Keterangan |
|---|---|---|---|
| Admin | admin@kampus.ac.id | Admin12345 | Akses penuh CRUD |
| Operator | operator@kampus.ac.id | Operator12345 | Tidak dapat akses `/api/users` |
| Viewer | viewer@kampus.ac.id | Viewer12345 | Tidak dapat akses `/api/users` |
| Viewer | nafiazka2003@gmail.com | NafiViewer123 | Akun uji Muhammad Nafi |

---

## Hasil Testing — Admin

| Method | Endpoint | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| GET | `/api/users` | 200 OK | 200 OK | ✅ Pass |
| POST | `/api/users` | 201 Created | 201 Created | ✅ Pass |
| PUT | `/api/users/:id` | 200 OK | 200 OK | ✅ Pass |
| DELETE | `/api/users/:id` | 200 OK | 200 OK | ✅ Pass |
| PATCH | `/api/users/:id/reset-password` | 200 OK + temporaryPassword | 200 OK + temporaryPassword | ✅ Pass |

**Catatan tambahan admin:**
- Response `GET /api/users` tidak mengandung field `password` ✅
- `temporaryPassword` berhasil digunakan untuk login ulang ✅
- Hash bcrypt tidak muncul di response ✅
- Admin yang mencoba menghapus dirinya sendiri mendapat `400` ✅

---

## Hasil Testing — Operator

| Method | Endpoint | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| GET | `/api/users` | 403 Forbidden | 403 Forbidden | ✅ Pass |
| POST | `/api/users` | 403 Forbidden | 403 Forbidden | ✅ Pass |
| PUT | `/api/users/:id` | 403 Forbidden | 403 Forbidden | ✅ Pass |
| DELETE | `/api/users/:id` | 403 Forbidden | 403 Forbidden | ✅ Pass |
| PATCH | `/api/users/:id/reset-password` | 403 Forbidden | 403 Forbidden | ✅ Pass |

---

## Hasil Testing — Viewer

| Method | Endpoint | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| GET | `/api/users` | 403 Forbidden | 403 Forbidden | ✅ Pass |
| POST | `/api/users` | 403 Forbidden | 403 Forbidden | ✅ Pass |
| PUT | `/api/users/:id` | 403 Forbidden | 403 Forbidden | ✅ Pass |
| DELETE | `/api/users/:id` | 403 Forbidden | 403 Forbidden | ✅ Pass |
| PATCH | `/api/users/:id/reset-password` | 403 Forbidden | 403 Forbidden | ✅ Pass |

---

## Hasil Testing — Tanpa Token

| Method | Endpoint | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| GET | `/api/users` | 401 Unauthorized | 401 Unauthorized | ✅ Pass |
| POST | `/api/users` | 401 Unauthorized | 401 Unauthorized | ✅ Pass |
| PUT | `/api/users/:id` | 401 Unauthorized | 401 Unauthorized | ✅ Pass |
| DELETE | `/api/users/:id` | 401 Unauthorized | 401 Unauthorized | ✅ Pass |
| PATCH | `/api/users/:id/reset-password` | 401 Unauthorized | 401 Unauthorized | ✅ Pass |

---

## Cara Penggunaan (Contoh cURL)

```
# Login sebagai admin
POST /api/auth/login
{ "email": "admin@kampus.ac.id", "password": "Admin12345" }

# Gunakan token dari response di header berikut:
Authorization: Bearer <ADMIN_TOKEN>

# Ambil daftar user
GET /api/users
Authorization: Bearer <ADMIN_TOKEN>

# Reset password user berdasarkan ID
PATCH /api/users/:id/reset-password
Authorization: Bearer <ADMIN_TOKEN>

# Operator mencoba mengakses (akan ditolak)
GET /api/users
Authorization: Bearer <OPERATOR_TOKEN>
→ 403 Forbidden
```

---

> **Catatan Keamanan:** Menyembunyikan fitur di frontend hanya meningkatkan pengalaman pengguna. Keamanan utama tetap ditegakkan di backend melalui `authMiddleware` dan `allowRoles("admin")`. Semua endpoint divalidasi secara stateless via JWT sehingga manipulasi dari sisi client tidak dapat melewati proteksi server.
