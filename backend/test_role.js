const jwt = require('jsonwebtoken');

async function runTests() {
  const baseUrl = 'http://localhost:3000/api';
  
  // 1. Try to login
  const credentials = {
    admin: { email: 'admin@kampus.ac.id', password: 'Admin12345' },
    operator: { email: 'operator@kampus.ac.id', password: 'Operator12345' },
    viewer: { email: 'viewer@kampus.ac.id', password: 'Viewer12345' }
  };
  
  const tokens = {};
  
  console.log('--- GETTING TOKENS VIA LOGIN ---');
  for (const role of ['admin', 'operator', 'viewer']) {
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials[role])
      });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        tokens[role] = data.data.token;
        console.log(`Login ${role} berhasil. Token didapatkan.`);
      } else {
        console.log(`Login ${role} GAGAL. Status: ${res.status}, Message: ${data.message}`);
      }
    } catch (err) {
      console.log(`Login ${role} ERROR:`, err.message);
    }
  }

  console.log('\n--- TESTING ENDPOINTS ---');

  // Test matrix
  const tests = [
    { role: 'admin', endpoint: '/mahasiswa', method: 'GET', expected: [200] },
    { role: 'admin', endpoint: '/mahasiswa', method: 'POST', expected: [200, 201, 400], body: {} },
    { role: 'admin', endpoint: '/mahasiswa/999', method: 'PUT', expected: [200, 400, 404], body: {} },
    { role: 'admin', endpoint: '/mahasiswa/999', method: 'DELETE', expected: [200, 404] },

    { role: 'operator', endpoint: '/mahasiswa', method: 'GET', expected: [200] },
    { role: 'operator', endpoint: '/mahasiswa', method: 'POST', expected: [200, 201, 400], body: {} },
    { role: 'operator', endpoint: '/mahasiswa/999', method: 'PUT', expected: [200, 400, 404], body: {} },
    { role: 'operator', endpoint: '/mahasiswa/999', method: 'DELETE', expected: [403] },

    { role: 'viewer', endpoint: '/mahasiswa', method: 'GET', expected: [200] },
    { role: 'viewer', endpoint: '/mahasiswa', method: 'POST', expected: [403], body: {} },
    { role: 'viewer', endpoint: '/mahasiswa/999', method: 'PUT', expected: [403], body: {} },
    { role: 'viewer', endpoint: '/mahasiswa/999', method: 'DELETE', expected: [403] },
  ];

  for (const t of tests) {
    const token = tokens[t.role];
    if (!token) {
      console.log(`Skipping test ${t.method} ${t.endpoint} for ${t.role} (no token)`);
      continue;
    }

    try {
      const options = {
        method: t.method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      if (t.body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(t.body);
      }

      const res = await fetch(`${baseUrl}${t.endpoint}`, options);
      const isPass = t.expected.includes(res.status);
      console.log(`[${t.role.toUpperCase()}] ${t.method} ${t.endpoint} -> Expected: [${t.expected.join(',')}], Actual: ${res.status} | Result: ${isPass ? 'PASS' : 'FAIL'}`);
    } catch (err) {
      console.log(`[${t.role.toUpperCase()}] ${t.method} ${t.endpoint} -> ERROR:`, err.message);
    }
  }
}

runTests();
