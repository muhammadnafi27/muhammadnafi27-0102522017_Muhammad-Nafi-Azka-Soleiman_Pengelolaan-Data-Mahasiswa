const jwt = require('jsonwebtoken');

async function runTests() {
  const baseUrl = 'http://localhost:3000/api';
  
  // Create tokens
  const validSecret = 'super_secret_key_123';
  const wrongSecret = 'wrong_secret';
  
  const validPayload = { id: 1, email: 'admin@example.com', role: 'admin' };
  const incompletePayload = { id: 1, email: 'admin@example.com' };
  const invalidRolePayload = { id: 1, email: 'admin@example.com', role: 'invalid_role' };
  
  const validToken = jwt.sign(validPayload, validSecret, { expiresIn: '1h' });
  const wrongSecretToken = jwt.sign(validPayload, wrongSecret, { expiresIn: '1h' });
  const expiredToken = jwt.sign(validPayload, validSecret, { expiresIn: '-1h' });
  const incompleteToken = jwt.sign(incompletePayload, validSecret, { expiresIn: '1h' });
  const invalidRoleToken = jwt.sign(invalidRolePayload, validSecret, { expiresIn: '1h' });
  const randomToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI.eyJzdWIiOiIxMjM.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  console.log('--- MENGUJI MIDDLEWARE MAHASISWA ---');

  // 1. Route mahasiswa tanpa header
  let res = await fetch(`${baseUrl}/mahasiswa`);
  console.log('1. Mahasiswa tanpa header:', res.status === 401 ? 'PASS' : 'FAIL');

  // 2. Header Authorization kosong
  res = await fetch(`${baseUrl}/mahasiswa`, { headers: { 'Authorization': '' } });
  console.log('2. Authorization kosong:', res.status === 401 ? 'PASS' : 'FAIL');

  // 3. Header menggunakan Basic
  res = await fetch(`${baseUrl}/mahasiswa`, { headers: { 'Authorization': 'Basic dXNlcjpwYXNz' } });
  console.log('3. Header Basic:', res.status === 401 ? 'PASS' : 'FAIL');

  // 4. Bearer tanpa token
  res = await fetch(`${baseUrl}/mahasiswa`, { headers: { 'Authorization': 'Bearer ' } });
  console.log('4. Bearer tanpa token:', res.status === 401 ? 'PASS' : 'FAIL');

  // 5. Token acak
  res = await fetch(`${baseUrl}/mahasiswa`, { headers: { 'Authorization': `Bearer ${randomToken}` } });
  console.log('5. Token acak:', res.status === 401 ? 'PASS' : 'FAIL');

  // 6. Token dengan secret salah
  res = await fetch(`${baseUrl}/mahasiswa`, { headers: { 'Authorization': `Bearer ${wrongSecretToken}` } });
  console.log('6. Token secret salah:', res.status === 401 ? 'PASS' : 'FAIL');

  // 7. Token expired
  res = await fetch(`${baseUrl}/mahasiswa`, { headers: { 'Authorization': `Bearer ${expiredToken}` } });
  console.log('7. Token expired:', res.status === 401 ? 'PASS' : 'FAIL');

  // 8. Token dengan payload tidak lengkap
  res = await fetch(`${baseUrl}/mahasiswa`, { headers: { 'Authorization': `Bearer ${incompleteToken}` } });
  console.log('8. Payload tidak lengkap:', res.status === 401 ? 'PASS' : 'FAIL');

  // 9. Token dengan role tidak valid
  res = await fetch(`${baseUrl}/mahasiswa`, { headers: { 'Authorization': `Bearer ${invalidRoleToken}` } });
  console.log('9. Role tidak valid:', res.status === 401 ? 'PASS' : 'FAIL');

  // 10. Token valid
  res = await fetch(`${baseUrl}/mahasiswa`, { headers: { 'Authorization': `Bearer ${validToken}` } });
  console.log('10. Token valid:', res.status === 200 ? 'PASS' : 'FAIL');

  console.log('--- MENGUJI REGISTER DAN LOGIN PUBLIK ---');
  // 11. Register tanpa token
  res = await fetch(`${baseUrl}/auth/register`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}) // Intentionally empty to get 400 instead of 401
  });
  console.log('11. Register tanpa token:', res.status === 400 ? 'PASS' : 'FAIL');

  // 12. Login tanpa token
  res = await fetch(`${baseUrl}/auth/login`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}) 
  });
  console.log('12. Login tanpa token:', res.status === 400 ? 'PASS' : 'FAIL');

  console.log('--- MENGUJI AUTH ROUTES ---');
  // 13. auth/me tanpa token
  res = await fetch(`${baseUrl}/auth/me`);
  console.log('13. auth/me tanpa token:', res.status === 401 ? 'PASS' : 'FAIL');

  // 14. auth/me dengan token valid
  res = await fetch(`${baseUrl}/auth/me`, { headers: { 'Authorization': `Bearer ${validToken}` } });
  console.log('14. auth/me dengan token valid:', res.status === 200 ? 'PASS' : 'FAIL');

  // 15. Logout tanpa token
  res = await fetch(`${baseUrl}/auth/logout`, { method: 'POST' });
  console.log('15. Logout tanpa token:', res.status === 401 ? 'PASS' : 'FAIL');

  // 16. Logout dengan token valid
  res = await fetch(`${baseUrl}/auth/logout`, { method: 'POST', headers: { 'Authorization': `Bearer ${validToken}` } });
  console.log('16. Logout dengan token valid:', res.status === 200 ? 'PASS' : 'FAIL');

  console.log('--- MENGUJI METODE MAHASISWA (ALL PROTECTED) ---');
  // 17. Seluruh GET mahasiswa dilindungi
  res = await fetch(`${baseUrl}/mahasiswa`);
  console.log('17. GET mahasiswa dilindungi:', res.status === 401 ? 'PASS' : 'FAIL');

  // 18. Seluruh POST mahasiswa dilindungi
  res = await fetch(`${baseUrl}/mahasiswa`, { method: 'POST' });
  console.log('18. POST mahasiswa dilindungi:', res.status === 401 ? 'PASS' : 'FAIL');

  // 19. Seluruh PUT atau PATCH mahasiswa dilindungi
  res = await fetch(`${baseUrl}/mahasiswa/1`, { method: 'PUT' });
  console.log('19. PUT mahasiswa dilindungi:', res.status === 401 ? 'PASS' : 'FAIL');

  // 20. Seluruh DELETE mahasiswa dilindungi
  res = await fetch(`${baseUrl}/mahasiswa/1`, { method: 'DELETE' });
  console.log('20. DELETE mahasiswa dilindungi:', res.status === 401 ? 'PASS' : 'FAIL');
}

runTests();
