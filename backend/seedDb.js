const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');

async function seed() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      multipleStatements: true
    });
    
    console.log("Connected to MySQL server...");

    const sqlPath = path.join(__dirname, 'db_mahasiswa.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log("Executing db_mahasiswa.sql...");
    await connection.query(sql);

    console.log("Database seeded successfully!");
    connection.end();
  } catch (error) {
    console.error("Failed to seed database:");
    console.error(error);
  }
}

seed();
