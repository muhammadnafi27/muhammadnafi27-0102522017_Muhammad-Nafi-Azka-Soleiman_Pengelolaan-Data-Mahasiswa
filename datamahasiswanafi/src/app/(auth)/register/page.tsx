import React from 'react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Daftar Akun Baru</h2>
        <p className="text-center text-gray-600 mb-8">Lengkapi data diri Anda di bawah ini</p>
        
        {/* Skeleton Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" placeholder="Ahmad Fauzi" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" placeholder="ahmad@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" placeholder="••••••••" />
          </div>
          <button disabled className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg opacity-70 cursor-not-allowed">
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}
