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
    <div className="card" style={{ padding: '1.75rem' }}>
      <div className="table-header" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700 }}>Daftar Mahasiswa</h2>
        <span className="badge-total">Total: {totalItems} Mahasiswa</span>
      </div>
      <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none', borderRadius: '10px', overflow: 'hidden' }}>
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
                        src={`http://localhost:3000/uploads/${mhs.foto}`} 
                        alt={mhs.nama} 
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          objectFit: 'cover',
                          border: '1px solid var(--border)' 
                        }} 
                      />
                    ) : (
                      <div 
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          backgroundColor: '#eff6ff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'var(--primary)',
                          border: '1px solid #dbeafe'
                        }}
                      >
                        <User size={20} />
                      </div>
                    )}
                  </td>
                  <td><strong>{mhs.nim}</strong></td>
                  <td>{mhs.nama}</td>
                  <td>{mhs.nama_prodi || 'Tidak Diketahui'}</td>
                  <td>{mhs.angkatan}</td>
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
