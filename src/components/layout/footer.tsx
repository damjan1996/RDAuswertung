'use client';

import Link from 'next/link';
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; {currentYear} Ritter Digital Raumbuch Auswertung</p>
          </div>

          <div className="flex space-x-6">
            <Link href="/" className="text-white hover:text-blue-200 text-sm">
              Startseite
            </Link>
            <Link href="/dashboard" className="text-white hover:text-blue-200 text-sm">
              Dashboard
            </Link>
            <a
              href="mailto:info@ritter-digital.de"
              className="text-white hover:text-blue-200 text-sm"
            >
              Kontakt
            </a>
          </div>

          <div className="mt-4 md:mt-0">
            <p className="text-xs text-gray-300">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
