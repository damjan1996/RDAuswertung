import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Ritter Digital Raumbuch Auswertung - Startseite',
  description: 'Startseite der Raumbuch Auswertungsanwendung',
};

// This will redirect to the dashboard
export default function Home() {
  // Redirect to dashboard on the server side
  redirect('/dashboard');

  // This is just a fallback that won't be shown
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          Ritter Digital Raumbuch Auswertung
        </h1>

        <p className="text-xl text-gray-700 mb-8">
          Willkommen bei der Web-Anwendung zur Analyse und Visualisierung von Raumbuch-Daten.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Zum Dashboard
        </Link>
      </div>
    </div>
  );
}
