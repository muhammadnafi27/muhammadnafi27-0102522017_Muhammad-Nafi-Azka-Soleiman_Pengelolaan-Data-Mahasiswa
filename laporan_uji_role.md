# Laporan Uji Role Authorization (Admin, Operator, Viewer)

Sistem telah diuji dengan tiga peran berbeda sesuai dengan ketentuan Tugas 14 Mingguan. Pengujian ini memastikan bahwa matriks otorisasi dijalankan secara ketat baik di sisi frontend maupun backend.

## 1. Role: Admin (Full Access)
- **Token JWT**: Berisi payload `role: "admin"`.
- **Frontend**: 
  - Admin dapat melihat keseluruhan tabel mahasiswa.
  - Komponen `MahasiswaForm` dirender dengan normal.
  - Tombol aksi **Edit** dan **Hapus** ditampilkan pada `MahasiswaTable`.
- **Backend API**:
  - `GET /api/mahasiswa` ➔ HTTP 200 OK
  - `POST /api/mahasiswa` ➔ HTTP 201 Created
  - `PUT /api/mahasiswa/:id` ➔ HTTP 200 OK
  - `DELETE /api/mahasiswa/:id` ➔ HTTP 200 OK

## 2. Role: Operator (Limited Access)
- **Token JWT**: Berisi payload `role: "operator"`.
- **Frontend**: 
  - Operator dapat melihat data mahasiswa dan form penambahan data.
  - Tombol aksi **Edit** ditampilkan pada `MahasiswaTable`.
  - Tombol aksi **Hapus disembunyikan** dengan aman dari antarmuka pengguna.
- **Backend API**:
  - `GET /api/mahasiswa` ➔ HTTP 200 OK
  - `POST /api/mahasiswa` ➔ HTTP 201 Created
  - `PUT /api/mahasiswa/:id` ➔ HTTP 200 OK
  - `DELETE /api/mahasiswa/:id` ➔ HTTP 403 Forbidden (jika ditembus langsung lewat API)

## 3. Role: Viewer (Read-Only Access)
- **Token JWT**: Berisi payload `role: "viewer"`.
- **Frontend**: 
  - Viewer hanya diizinkan melihat tabel mahasiswa.
  - Komponen `MahasiswaForm` **dihapus** dari layout halaman utama (conditional rendering).
  - Tombol aksi **Edit** dan **Hapus** disembunyikan seluruhnya dari kolom Aksi pada tabel.
- **Backend API**:
  - `GET /api/mahasiswa` ➔ HTTP 200 OK
  - `POST /api/mahasiswa` ➔ HTTP 403 Forbidden
  - `PUT /api/mahasiswa/:id` ➔ HTTP 403 Forbidden
  - `DELETE /api/mahasiswa/:id` ➔ HTTP 403 Forbidden

## Kesimpulan
Sistem terdistribusi ini sekarang sepenuhnya memenuhi prinsip *Secure by Default* dan *Defense in Depth*, di mana otorisasi dikunci tidak hanya di antarmuka pengguna (Frontend/React) melainkan diverifikasi secara ketat dan *stateless* di server (Backend/Express) melalui JWT middleware `allowRoles`.
