async function runTests() {
  const baseUrl = 'http://localhost:3000/api/auth';
  let token = '';

  console.log('--- SETUP REGISTER TEST USER ---');
  await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      nama_lengkap: 'Admin User', 
      nim: '00000', 
      email: 'admin@example.com', 
      password: 'Password123' 
    })
  });

  console.log('--- MENGUJI LOGIN ---');
  
  // 1. Login berhasil
  let res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'Password123' })
  });
  let data = await res.json();
  console.log('1. Login berhasil:', res.status === 200 && data.success === true ? 'PASS' : 'FAIL', res.status);
  token = data.data?.token || '';

  // 2. Login dengan email uppercase
  res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ADMIN@EXAMPLE.COM', password: 'Password123' })
  });
  console.log('2. Login uppercase:', res.status === 200 ? 'PASS' : 'FAIL');

  // 3. Email kosong
  res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'Password123' })
  });
  console.log('3. Email kosong:', res.status === 400 ? 'PASS' : 'FAIL');

  // 4. Password kosong
  res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com' })
  });
  console.log('4. Password kosong:', res.status === 400 ? 'PASS' : 'FAIL');

  // 5. Email tidak valid
  res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'adminexample.com', password: 'Password123' })
  });
  console.log('5. Email tidak valid:', res.status === 400 ? 'PASS' : 'FAIL');

  // 6. Email tidak ditemukan
  res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'notfound@example.com', password: 'Password123' })
  });
  console.log('6. Email tidak ditemukan:', res.status === 401 ? 'PASS' : 'FAIL');

  // 7. Password salah
  res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'WrongPassword' })
  });
  console.log('7. Password salah:', res.status === 401 ? 'PASS' : 'FAIL');

  // 8. Password benar
  console.log('8. Password benar:', token ? 'PASS' : 'FAIL');

  // 13. Response login tidak memiliki password
  console.log('13. Response tanpa password:', data.data?.user?.password === undefined ? 'PASS' : 'FAIL');

  console.log('--- MENGUJI AUTH/ME ---');

  // 14. auth/me mengembalikan data user
  res = await fetch(`${baseUrl}/me`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  let meData = await res.json();
  console.log('14. auth/me data user:', res.status === 200 && meData.success ? 'PASS' : 'FAIL', res.status);

  // 15. auth/me tidak mengembalikan password
  console.log('15. auth/me tanpa password:', meData.data?.user?.password === undefined ? 'PASS' : 'FAIL');

  console.log('--- MENGUJI LOGOUT ---');
  // 16. Logout menghasilkan response berhasil
  res = await fetch(`${baseUrl}/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('16. Logout berhasil:', res.status === 200 ? 'PASS' : 'FAIL');
}

runTests();
