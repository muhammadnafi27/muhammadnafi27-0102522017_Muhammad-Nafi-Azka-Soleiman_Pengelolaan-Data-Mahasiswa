const mysql = require('mysql2/promise');

async function cleanDb() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_mahasiswa',
    multipleStatements: true
  });

  // Delete bad test data
  await connection.query("DELETE FROM mahasiswa WHERE nim NOT LIKE '2%'");
  await connection.query("DELETE FROM mahasiswa WHERE nim = '2501001'");
  
  const [rows] = await connection.query('SELECT * FROM mahasiswa ORDER BY id');
  console.log('Remaining data:', rows.length, 'rows');
  rows.forEach(r => console.log(`  ${r.nim} - ${r.nama}`));
  
  await connection.end();
}

cleanDb().catch(console.error);
