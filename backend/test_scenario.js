const baseUrl = 'http://localhost:3000/api';

async function testScenario() {
  console.log("=== MEMULAI PENGUJIAN SKENARIO KHUSUS ===\n");

  // Helper functions
  const login = async (role, email, password) => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.status === 200) {
      console.log(`[+] Login sebagai ${role} BERHASIL.`);
      return data.data.token;
    }
    console.log(`[-] Login sebagai ${role} GAGAL.`);
    return null;
  };

  const request = async (method, endpoint, token, body = null) => {
    const options = { method, headers: { 'Authorization': `Bearer ${token}` } };
    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${baseUrl}${endpoint}`, options);
    return res.status;
  };

  // 1. Admin Scenario
  console.log("1. MENGUJI ADMIN");
  const adminToken = await login('admin', 'admin@kampus.ac.id', 'Admin12345');
  console.log("   -> Salin token admin (disembunyikan untuk keamanan)");
  console.log("   -> Mencoba semua endpoint:");
  let s = await request('GET', '/mahasiswa', adminToken);
  console.log(`      - GET /mahasiswa     => Status ${s} ${s === 200 ? '(Sesuai Hak Akses)' : ''}`);
  s = await request('POST', '/mahasiswa', adminToken, {});
  console.log(`      - POST /mahasiswa    => Status ${s} ${s !== 403 ? '(Sesuai Hak Akses, lolos 403)' : ''}`);
  s = await request('PUT', '/mahasiswa/9999', adminToken, {});
  console.log(`      - PUT /mahasiswa/:id => Status ${s} ${s !== 403 ? '(Sesuai Hak Akses, lolos 403)' : ''}`);
  s = await request('DELETE', '/mahasiswa/9999', adminToken);
  console.log(`      - DELETE /mahasiswa  => Status ${s} ${s !== 403 ? '(Sesuai Hak Akses, lolos 403)' : ''}`);
  console.log("");

  // 2. Operator Scenario
  console.log("2. MENGUJI OPERATOR");
  const operatorToken = await login('operator', 'operator@kampus.ac.id', 'Operator12345');
  s = await request('POST', '/mahasiswa', operatorToken, {});
  console.log(`   -> Coba POST mahasiswa   => Status ${s} ${s !== 403 ? '(Lolos 403 - Akses Diberikan)' : ''}`);
  s = await request('PUT', '/mahasiswa/9999', operatorToken, {});
  console.log(`   -> Coba PUT mahasiswa    => Status ${s} ${s !== 403 ? '(Lolos 403 - Akses Diberikan)' : ''}`);
  s = await request('DELETE', '/mahasiswa/9999', operatorToken);
  console.log(`   -> Coba DELETE mahasiswa => Status ${s} ${s === 403 ? '(GAGAL dengan 403 - BENAR)' : '(TIDAK SESUAI)'}`);
  console.log("");

  // 3. Viewer Scenario
  console.log("3. MENGUJI VIEWER");
  const viewerToken = await login('viewer', 'viewer@kampus.ac.id', 'Viewer12345');
  s = await request('GET', '/mahasiswa', viewerToken);
  console.log(`   -> Coba GET mahasiswa  => Status ${s} ${s === 200 ? '(Akses Diberikan)' : ''}`);
  s = await request('POST', '/mahasiswa', viewerToken, {});
  console.log(`   -> Coba POST mahasiswa => Status ${s} ${s === 403 ? '(GAGAL dengan 403 - BENAR)' : '(TIDAK SESUAI)'}`);
  console.log("\n=== PENGUJIAN SELESAI ===");
}

testScenario();
