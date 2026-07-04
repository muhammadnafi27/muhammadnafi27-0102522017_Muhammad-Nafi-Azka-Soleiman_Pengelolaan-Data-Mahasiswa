import pool from './src/config/database';

async function updateDb() {
  try {
    console.log("Updating users table...");
    await pool.query(`UPDATE users SET role = 'viewer' WHERE role = 'user'`);
    await pool.query(`ALTER TABLE users ADD COLUMN name VARCHAR(100) NOT NULL AFTER id`);
    await pool.query(`ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'operator', 'viewer') NOT NULL DEFAULT 'viewer'`);
    await pool.query(`ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    console.log("Database updated successfully");
  } catch (error) {
    console.error("Error updating database:", error);
  } finally {
    pool.end();
  }
}

updateDb();
