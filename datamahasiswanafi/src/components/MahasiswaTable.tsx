import React, { useState } from 'react';
import { Mahasiswa } from '../lib/api';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface MahasiswaTableProps {
  data: Mahasiswa[];
  onEdit: (mahasiswa: Mahasiswa) => void;
  onDelete: (id: number) => void;
}

export default function MahasiswaTable({ data, onEdit, onDelete }: MahasiswaTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
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
        <span className="badge-total">Total: {data.length} Mahasiswa</span>
      </div>
      <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none', borderRadius: '10px', overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th style={{ borderTopLeftRadius: '10px' }}>No</th>
              <th>NIM</th>
              <th>Nama</th>
              <th>Prodi</th>
              <th>Angkatan</th>
              <th style={{ borderTopRightRadius: '10px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((mhs, index) => (
                <tr key={mhs.id}>
                  <td>{startIndex + index + 1}</td>
                  <td><strong>{mhs.nim}</strong></td>
                  <td>{mhs.nama}</td>
                  <td>{mhs.prodi}</td>
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
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
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
                onClick={() => setCurrentPage(number)}
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
