import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistem Pengelolaan Data Mahasiswa UAI',
  description: 'Sistem akademik satu halaman terpadu dengan analisis database MySQL.',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
