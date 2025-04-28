'use client';

import { useEffect, useState } from 'react';

import type { RaumbuchRow, RaumbuchSummary, VisualizationData } from '@/types/raumbuch.types';

// Verwende RaumbuchRow als RaumbuchEntry
type RaumbuchEntry = RaumbuchRow;

// Definiere FilterOptions
interface FilterOptions {
  bereiche?: string[];
  gebaeudeteil?: string[];
  etage?: string[];
  reinigungsgruppe?: string[];
}

/**
 * Hook zum Abrufen und Verarbeiten von Raumbuch-Daten für einen bestimmten Standort/Gebäude
 *
 * @param gebaeudeId - ID des Gebäudes
 * @param filterQuery - Optionale Filter-Parameter als Query-String
 * @returns Ein Objekt mit Raumbuch-Daten, Zusammenfassung, Visualisierungsdaten und Filteroptionen
 */
export function useRaumbuchData(gebaeudeId: number, filterQuery?: string) {
  const [data, setData] = useState<RaumbuchEntry[]>([]);
  const [summary, setSummary] = useState<RaumbuchSummary | null>(null);
  const [visualizationData, setVisualizationData] = useState<VisualizationData | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    bereiche: [],
    gebaeudeteil: [],
    etage: [],
    reinigungsgruppe: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Abbruch wenn keine gebaeudeId
    if (!gebaeudeId) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // Query-Parameter zusammenbauen
        const queryParams = filterQuery ? `?${filterQuery}` : '';
        const response = await fetch(`/api/raumbuch/${gebaeudeId}${queryParams}`);

        if (!response.ok) {
          throw new Error(
            `Fehler beim Abrufen der Daten: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();

        // Daten setzen
        setData(result.data || []);
        setSummary(result.summary || null);
        setVisualizationData(result.visualizationData || null);
        setFilterOptions(
          result.filterOptions || {
            bereiche: [],
            gebaeudeteil: [],
            etage: [],
            reinigungsgruppe: [],
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
        console.error('Fehler in useRaumbuchData:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [gebaeudeId, filterQuery]);

  return {
    data,
    summary,
    visualizationData,
    filterOptions,
    isLoading,
    error,
  };
}
