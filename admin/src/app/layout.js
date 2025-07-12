// app/layout.js (Example, adjust as per your project's root layout)
import './globals.css'; // Your global styles
import { Inter } from 'next/font/google';
import { AdminAuthProvider } from '@/context/AdminAuthContext'; // Import your new context
import AdminNavbar from '@/components/AdminNavbar';
import AdminFooter from '@/components/AdminFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'UniUpdates Admin',
  description: 'Admin Panel for UniUpdates',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminAuthProvider>
          <AdminNavbar /> {/* Include your admin navbar */}
          {children}
          <AdminFooter /> {/* Include your admin footer */}
        </AdminAuthProvider>
      </body>
    </html>
  );
}