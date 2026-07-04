import React, { useEffect, useState } from 'react';
import { UserPlus, RefreshCw, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';

export type NotificationType = 'create' | 'update' | 'delete' | 'success' | 'error';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = React.useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for exit animation
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [handleClose]);

  const getNotificationConfig = () => {
    switch (type) {
      case 'create':
        return {
          icon: <UserPlus size={22} />,
          title: 'Mahasiswa Ditambahkan',
          borderColor: 'rgba(16, 185, 129, 0.4)',
          bgColor: 'rgba(6, 78, 59, 0.85)',
          glowColor: 'rgba(16, 185, 129, 0.3)',
          iconBg: 'rgba(16, 185, 129, 0.2)',
          iconColor: '#34d399',
          progressColor: '#10b981'
        };
      case 'update':
        return {
          icon: <RefreshCw size={22} className="spin-slow" />,
          title: 'Mahasiswa Diperbarui',
          borderColor: 'rgba(59, 130, 246, 0.4)',
          bgColor: 'rgba(30, 58, 138, 0.85)',
          glowColor: 'rgba(59, 130, 246, 0.3)',
          iconBg: 'rgba(59, 130, 246, 0.2)',
          iconColor: '#60a5fa',
          progressColor: '#3b82f6'
        };
      case 'delete':
        return {
          icon: <Trash2 size={22} />,
          title: 'Mahasiswa Dihapus',
          borderColor: 'rgba(249, 115, 22, 0.4)',
          bgColor: 'rgba(124, 45, 18, 0.85)',
          glowColor: 'rgba(249, 115, 22, 0.3)',
          iconBg: 'rgba(249, 115, 22, 0.2)',
          iconColor: '#fb923c',
          progressColor: '#f97316'
        };
      case 'error':
        return {
          icon: <AlertCircle size={22} />,
          title: 'Terjadi Kesalahan',
          borderColor: 'rgba(239, 68, 68, 0.4)',
          bgColor: 'rgba(127, 29, 29, 0.85)',
          glowColor: 'rgba(239, 68, 68, 0.3)',
          iconBg: 'rgba(239, 68, 68, 0.2)',
          iconColor: '#f87171',
          progressColor: '#ef4444'
        };
      default:
        return {
          icon: <CheckCircle2 size={22} />,
          title: 'Berhasil',
          borderColor: 'rgba(16, 185, 129, 0.4)',
          bgColor: 'rgba(6, 78, 59, 0.85)',
          glowColor: 'rgba(16, 185, 129, 0.3)',
          iconBg: 'rgba(16, 185, 129, 0.2)',
          iconColor: '#34d399',
          progressColor: '#10b981'
        };
    }
  };

  const config = getNotificationConfig();

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.75rem',
        right: '1.75rem',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '420px',
        backgroundColor: config.bgColor,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${config.borderColor}`,
        borderRadius: '18px',
        padding: '1rem 1.25rem 1.15rem 1.25rem',
        boxShadow: `0 20px 35px rgba(0, 0, 0, 0.6), 0 0 20px ${config.glowColor}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.9rem',
        overflow: 'hidden',
        animation: isExiting ? 'toastExit 0.3s cubic-bezier(0.4, 0, 1, 1) forwards' : 'toastEnter 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      <div
        style={{
          padding: '0.6rem',
          borderRadius: '14px',
          backgroundColor: config.iconBg,
          color: config.iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '0.1rem'
        }}
      >
        {config.icon}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
          {config.title}
        </span>
        <span style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.4 }}>
          {message}
        </span>
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '0.2rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
      >
        <X size={18} />
      </button>

      {/* Countdown Progress Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          backgroundColor: config.progressColor,
          width: '100%',
          animation: 'toastProgress 4s linear forwards'
        }}
      />
    </div>
  );
}
