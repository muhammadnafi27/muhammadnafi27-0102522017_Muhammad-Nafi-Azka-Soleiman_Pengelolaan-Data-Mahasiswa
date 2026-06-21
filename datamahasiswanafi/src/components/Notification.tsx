import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export type NotificationType = 'success' | 'error';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <span>{message}</span>
    </div>
  );
}
