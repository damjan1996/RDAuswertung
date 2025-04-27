import '@/styles/globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import type { ReactNode } from 'react';

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Define metadata for the entire site
export const metadata: Metadata = {
  title: {
    default: 'Ritter Digital Raumbuch Auswertung',
    template: '%s | Ritter Digital Raumbuch Auswertung',
  },
  description:
    'Eine Web-Anwendung zur Analyse und Visualisierung von Raumbuch-Daten aus dem RdRaumbuch-System.',
  keywords: ['Raumbuch', 'Ritter Digital', 'Auswertung', 'Gebäudemanagement', 'Reinigung'],
  authors: [{ name: 'Ritter Digital' }],
  creator: 'Ritter Digital',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="de" className={`${inter.variable}`}>
      <body className="min-h-screen bg-gray-50 font-sans">{children}</body>
    </html>
  );
}
