'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import StandortSelect from '@/components/forms/standort-select';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Loader from '@/components/ui/loader';
import { useStandorte } from '@/hooks/use-standorte';

import type { Standort } from '@/types/standort.types';

export default function DashboardPage() {
  const [selectedStandortId, setSelectedStandortId] = useState<number | null>(null);
  const { standorte, isLoading, error } = useStandorte();
  const router = useRouter();

  const handleStandortChange = (standortId: number) => {
    setSelectedStandortId(standortId);
  };

  const handleAuswerten = () => {
    if (selectedStandortId) {
      router.push(`/report/${selectedStandortId}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary-800">Raumbuch Auswertung Dashboard</h1>

      <p className="text-gray-600">
        Willkommen bei der Ritter Digital Raumbuch Auswertung. Mit dieser Anwendung können Sie Daten
        aus dem Raumbuch-System analysieren und visualisieren.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Standort auswählen" className="bg-white shadow-md">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : error ? (
            <Alert variant="error">Fehler beim Laden der Standorte: {error}</Alert>
          ) : (
            <div className="space-y-4">
              <StandortSelect
                standorte={standorte || []}
                value={selectedStandortId}
                onChange={handleStandortChange}
                required
              />
              <Button
                onClick={handleAuswerten}
                disabled={!selectedStandortId}
                className="w-full md:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Auswerten
              </Button>
            </div>
          )}
        </Card>

        <Card title="Informationen" className="bg-white shadow-md">
          <div className="space-y-2">
            <p>Diese Anwendung ermöglicht:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Anzeigen der Raumbuch-Daten für einen ausgewählten Standort</li>
              <li>Filtern und Sortieren der Daten nach verschiedenen Kriterien</li>
              <li>Berechnung von Statistiken und Zusammenfassungen</li>
              <li>Visualisierung der Daten mit Diagrammen</li>
              <li>Export der Daten als Excel oder PDF</li>
            </ul>
          </div>
        </Card>
      </div>

      {standorte && standorte.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card title="Kürzliche Standorte" className="bg-white shadow-md col-span-1 md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {standorte.slice(0, 6).map((standort: Standort) => (
                <Link
                  key={standort.id}
                  href={`/report/${standort.id}`}
                  className="p-4 border rounded-md hover:bg-blue-50 transition-colors flex items-center space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{standort.bezeichnung}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
