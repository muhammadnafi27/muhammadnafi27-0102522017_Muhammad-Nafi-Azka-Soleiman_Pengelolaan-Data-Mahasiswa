import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log("Connected to MySQL.");

    const sqlPath = path.join(__dirname, 'db_mahasiswa.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await connection.query(sql);
    console.log("Database seeded successfully!");
    
    await connection.end();
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

seed();
