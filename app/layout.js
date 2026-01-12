import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DBE Exam Bank - CAPS Past Papers by Topic',
  description: 'Practice exam questions by topic from DBE past papers for Grade 11 & 12',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/">
                  <h1 className="text-2xl font-bold cursor-pointer hover:text-blue-200">
                    DBE Exam Bank
                  </h1>
                </Link>
              </div>
              <div className="flex space-x-4">
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Home
                </Link>
                <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <p>© 2024 DBE Exam Bank. Educational purposes only.</p>
            <p className="text-sm text-gray-400 mt-2">
              All exam papers sourced from official DBE and educational websites
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
