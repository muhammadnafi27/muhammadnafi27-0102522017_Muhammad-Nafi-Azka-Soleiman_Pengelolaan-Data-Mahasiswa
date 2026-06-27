import React from 'react';
import { Mahasiswa } from '../lib/api';
import { Pencil, Trash2, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface MahasiswaTableProps {
  data: Mahasiswa[];
  onEdit: (mahasiswa: Mahasiswa) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function MahasiswaTable({
  data,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}: MahasiswaTableProps) {

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Generate page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="card">
      <div className="table-header" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700 }}>Daftar Mahasiswa</h2>
        <span className="badge-total">Total: {totalItems} Mahasiswa</span>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ borderTopLeftRadius: '10px' }}>No</th>
              <th>Foto</th>
              <th>NIM</th>
              <th>Nama</th>
              <th>Prodi</th>
              <th>Angkatan</th>
              <th style={{ borderTopRightRadius: '10px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((mhs, index) => (
                <tr key={mhs.id}>
                  <td>{(currentPage - 1) * 5 + index + 1}</td>
                  <td>
                    {mhs.foto ? (
                      <img 
                        src={`http://localhost:3000/uploads/mahasiswa/${mhs.foto}`} 
                        alt={mhs.nama} 
                        style={{ 
                          width: '56px', 
                          height: '56px', 
                          borderRadius: '14px', 
                          objectFit: 'cover',
                          border: '2px solid rgba(59, 130, 246, 0.4)',
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4), 0 0 10px rgba(59, 130, 246, 0.2)'
                        }} 
                      />
                    ) : (
                      <div 
                        style={{ 
                          width: '56px', 
                          height: '56px', 
                          borderRadius: '14px', 
                          backgroundColor: 'rgba(15, 23, 42, 0.6)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: '#60a5fa',
                          border: '1px dashed rgba(59, 130, 246, 0.4)',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <User size={26} />
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#ffffff' }}>{mhs.nim}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{mhs.nama}</span>
                  </td>
                  <td>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.45rem 0.95rem',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(14, 165, 233, 0.15) 100%)',
                      color: '#60a5fa',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: '1px solid rgba(59, 130, 246, 0.35)',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
                      backdropFilter: 'blur(8px)'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#60a5fa', boxShadow: '0 0 8px #60a5fa' }} />
                      {mhs.nama_prodi || 'Tidak Diketahui'}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#34d399',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                      {mhs.angkatan}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-icon-edit"
                      onClick={() => onEdit(mhs)}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon-delete"
                      onClick={() => onDelete(mhs.id)}
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                  Belum ada data mahasiswa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: '1.5rem', paddingTop: '1.5rem' }}>
          <button 
            onClick={handlePrev} 
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="pagination-numbers">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`pagination-number ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}
          </div>

          <button 
            onClick={handleNext} 
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
