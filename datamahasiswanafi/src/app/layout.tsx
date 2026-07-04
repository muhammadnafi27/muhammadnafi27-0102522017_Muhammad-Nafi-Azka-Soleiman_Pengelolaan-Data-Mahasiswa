import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistem Pengelolaan Data Mahasiswa UAI',
  description: 'Sistem akademik satu halaman terpadu dengan analisis database MySQL.',
  icons: {
    icon: '/icon.png',
  },
};

import Providers from '@/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
