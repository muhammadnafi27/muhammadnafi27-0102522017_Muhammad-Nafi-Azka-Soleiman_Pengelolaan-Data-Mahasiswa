const mysql = require('mysql2/promise');
require('dotenv').config({path: '.env'});

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_mahasiswa'
  });
  
  // Drop table if exists to update schema
  await conn.query(`DROP TABLE IF EXISTS users`);
  
  await conn.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama_lengkap VARCHAR(100) NOT NULL,
      nim VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      prodi_id INT DEFAULT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_users_prodi FOREIGN KEY (prodi_id) 
        REFERENCES prodi(id) 
        ON UPDATE CASCADE 
        ON DELETE SET NULL
    ) ENGINE=InnoDB
  `);
  
  console.log('Premium users table created successfully.');
  await conn.end();
}
run().catch(console.error);
