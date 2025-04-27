'use client';

import { useEffect, useState } from 'react';

import type { Standort } from '@/types/standort.types';

interface UseStandorteOptions {
  initialData?: Standort[];
  search?: string;
  sort?: 'id' | 'bezeichnung';
  order?: 'asc' | 'desc';
  limit?: number;
}

/**
 * Hook zum Abrufen von Standorten
 *
 * @param options - Optionen für die Standortdaten
 * @returns Ein Objekt mit Standorten und Ladestatus
 */
export function useStandorte(options: UseStandorteOptions = {}) {
  const [standorte, setStandorte] = useState<Standort[] | null>(options.initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!options.initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStandorte() {
      // Skip fetch if we already have initial data
      if (
        options.initialData &&
        !options.search &&
        !options.sort &&
        !options.order &&
        !options.limit
      ) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Build query parameters
        const params = new URLSearchParams();

        if (options.search) {
          params.append('search', options.search);
        }

        if (options.sort) {
          params.append('sort', options.sort);
        }

        if (options.order) {
          params.append('order', options.order);
        }

        if (options.limit) {
          params.append('limit', options.limit.toString());
        }

        // Make the API request
        const queryString = params.toString();
        const url = `/api/standorte${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Fehler beim Abrufen der Standorte: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();

        // Update state with the fetched data
        setStandorte(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
        console.error('Fehler in useStandorte:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStandorte();
  }, [options.initialData, options.search, options.sort, options.order, options.limit]);

  return {
    standorte,
    isLoading,
    error,
  };
}
