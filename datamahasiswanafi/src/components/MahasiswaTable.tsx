import React, { useState } from 'react';
import { Mahasiswa } from '../lib/api';
import { Pencil, Trash2, ChevronLeft, ChevronRight, User, ZoomIn, X } from 'lucide-react';

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
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; nama: string; nim: string } | null>(null);

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
                      <div 
                        onClick={() => setPreviewPhoto({ 
                          url: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/uploads/mahasiswa/${mhs.foto}`, 
                          nama: mhs.nama, 
                          nim: mhs.nim 
                        })}
                        style={{ 
                          position: 'relative', 
                          display: 'inline-block', 
                          cursor: 'pointer',
                          borderRadius: '16px',
                          overflow: 'hidden'
                        }}
                        title="Klik untuk memperbesar foto"
                      >
                        <img 
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/uploads/mahasiswa/${mhs.foto}`} 
                          alt={mhs.nama} 
                          style={{ 
                            width: '68px', 
                            height: '68px', 
                            borderRadius: '16px', 
                            objectFit: 'cover',
                            border: '2px solid rgba(59, 130, 246, 0.5)',
                            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.3)',
                            transition: 'all 0.3s ease'
                          }} 
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.08)';
                            e.currentTarget.style.borderColor = '#60a5fa';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(15, 23, 42, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          borderRadius: '16px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                        >
                          <ZoomIn size={22} color="#ffffff" />
                        </div>
                      </div>
                    ) : (
                      <div 
                        style={{ 
                          width: '68px', 
                          height: '68px', 
                          borderRadius: '16px', 
                          backgroundColor: 'rgba(15, 23, 42, 0.6)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: '#60a5fa',
                          border: '1.5px dashed rgba(59, 130, 246, 0.4)',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        <User size={30} />
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
      {/* Photo Preview Lightbox Modal */}
      {previewPhoto && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.25s ease-out'
          }}
          onClick={() => setPreviewPhoto(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '24px',
              padding: '1.75rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '480px',
              width: '100%',
              animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <button 
              onClick={() => setPreviewPhoto(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
              <X size={20} />
            </button>

            <img 
              src={previewPhoto.url} 
              alt={previewPhoto.nama} 
              style={{
                width: '100%',
                maxHeight: '380px',
                objectFit: 'cover',
                borderRadius: '16px',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                marginBottom: '1.25rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
              }}
            />

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                {previewPhoto.nama}
              </h3>
              <span style={{ fontSize: '0.9rem', color: '#60a5fa', fontWeight: 600 }}>
                NIM: {previewPhoto.nim}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
