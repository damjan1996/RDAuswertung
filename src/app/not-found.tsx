import Link from 'next/link';
import React from 'react';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-5xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Seite nicht gefunden</h2>
        <p className="text-gray-600 mb-8">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
        >
          Zurück zum Dashboard
        </Link>
      </div>
    </div>
  );
}
