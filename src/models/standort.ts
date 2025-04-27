'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { RaumbuchFilter } from '@/types/raumbuch.types';

// Verwende RaumbuchFilter als Filters
type Filters = RaumbuchFilter;

/**
 * Hook zum Verwalten von Filtern in der Raumbuch-Auswertung
 * Synchronisiert Filter-Zustand mit URL-Parametern
 */
export function useFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialisiere Filter aus URL-Parametern
  const initialFilters: Filters = useMemo(() => {
    const filters: Filters = {};

    if (searchParams.has('bereich')) {
      filters.bereich = searchParams.get('bereich') || '';
    }

    if (searchParams.has('gebaeudeteil')) {
      filters.gebaeudeteil = searchParams.get('gebaeudeteil') || '';
    }

    if (searchParams.has('etage')) {
      filters.etage = searchParams.get('etage') || '';
    }

    if (searchParams.has('rg')) {
      filters.rg = searchParams.get('rg') || '';
    }

    return filters;
  }, [searchParams]);

  // Filter-State
  const [filters, setFiltersState] = useState<Filters>(initialFilters);

  // Generiert einen Query-String aus den Filtern
  const filterQueryString = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    return queryString ? queryString : '';
  }, [filters]);

  // Aktualisiert einen einzelnen Filter
  const setFilter = useCallback(
    (name: keyof Filters, value: string) => {
      const newFilters = { ...filters, [name]: value };

      // Update state
      setFiltersState(newFilters);

      // Update URL
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      // Navigiere mit aktualisierten Parametern
      router.push(`${pathname}?${params.toString()}`);
    },
    [filters, router, pathname, searchParams]
  );

  // Setzt alle Filter zurück
  const resetFilters = useCallback(() => {
    setFiltersState({});
    router.push(pathname);
  }, [router, pathname]);

  return {
    filters,
    setFilter,
    resetFilters,
    filterQueryString,
  };
}
