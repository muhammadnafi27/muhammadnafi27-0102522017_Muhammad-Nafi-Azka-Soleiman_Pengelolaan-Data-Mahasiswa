import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from './src/config/database';

dotenv.config();

const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (!adminEmail || !adminPassword) {
      console.error("Gagal: ADMIN_EMAIL dan ADMIN_PASSWORD harus disetel di file .env");
      process.exit(1);
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if ((existing as any[]).length > 0) {
      console.log(`Admin dengan email ${adminEmail} sudah ada.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [adminName, adminEmail, hashedPassword, 'admin']
    );

    console.log(`Admin dengan email ${adminEmail} berhasil dibuat!`);
    process.exit(0);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    process.exit(1);
  }
};

createAdmin();
