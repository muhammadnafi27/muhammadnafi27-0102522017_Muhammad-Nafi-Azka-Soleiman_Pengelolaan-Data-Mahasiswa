# Tugas 15 Mingguan - Opsional Forgot Password dengan Token dan SMTP Gmail

Dokumen ini berisi panduan dan laporan implementasi fitur Lupa Password (Forgot Password) yang menggunakan SMTP Gmail untuk pengiriman email reset link.

## 1. Identitas
- **Nama:** Muhammad Nafi Azka Soleiman
- **NIM:** 0102522017
- **Kelas:** IF22A

## 2. Alur Sistem (Flow)
1. **Request Reset:** User memasukkan email di halaman `/forgot-password`.
2. **Backend Processing:**
   - Backend memverifikasi keberadaan email di database.
   - Jika ada, backend men-generate raw token unik (`crypto.randomBytes`).
   - Raw token di-hash menggunakan `sha256` dan disimpan di database `password_reset_tokens`.
   - Raw token dikirimkan melalui email sebagai URL query (`/reset-password?token=...`).
3. **Reset Password:** User menekan link, memasukkan password baru di frontend.
4. **Validation:** Backend mengambil hash dari token yang dikirim, mencocokkannya di database, dan memastikan token belum kedaluwarsa serta belum digunakan.
5. **Update:** Password user diubah, dan `used_at` pada tabel token di-set.

## 3. Catatan Keamanan (Security Notes)
1. **SMTP Gmail & App Password:** 
   Penggunaan SMTP Gmail di project ini HANYA diperuntukkan sebagai latihan dan prototipe. Gmail membutuhkan 2-Step Verification dan App Password khusus agar Nodemailer dapat login.
   > **⚠️ Peringatan:** Jangan pernah membagikan `.env` atau meng-commit password email Anda ke repositori publik.
2. **Production Environment:**
   Untuk skala produksi, sangat disarankan menggunakan transactional email service (seperti SendGrid, Mailgun, AWS SES), Google Workspace resmi, atau OAuth2 untuk menghindari pemblokiran pengiriman oleh filter spam Google.
3. **Penyimpanan Token:**
   Token yang disimpan di database adalah **hash token** (`sha256`), bukan raw token. Jika database bocor, penyerang tidak dapat dengan mudah melakukan generate ulang reset URL.
4. **Generic Response:**
   Endpoint `/api/auth/forgot-password` selalu mengembalikan respons *"Jika email terdaftar, link akan dikirim"* terlepas apakah email tersebut benar-benar ada di database atau tidak. Ini untuk mencegah serangan user enumeration.

## 4. Konfigurasi Lokal
Jika Anda ingin mencoba pengiriman email secara lokal:
1. Pastikan Anda memiliki akun Google.
2. Aktifkan **2-Step Verification**.
3. Buat **App Password** di setelan Google Account Anda.
4. Salin App Password (16 karakter) tersebut ke file `.env` di backend:
   ```env
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=465
   MAIL_SECURE=true
   MAIL_USER=email.anda@gmail.com
   MAIL_PASS=app_password_anda
   APP_URL=http://localhost:3001
   ```
5. Restart server backend Anda.
