'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/login');
      } else {
        setIsAuth(true);
      }
    };
    checkAuth();
  }, [router]);

  if (isAuth === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
        Memeriksa otentikasi...
      </div>
    );
  }

  return <>{children}</>;
}
