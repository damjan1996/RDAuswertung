'use client';

import React from 'react';

import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Select from '@/components/ui/select';
import { RaumbuchFilter } from '@/types/raumbuch.types';

// Define FilterOptions type locally since it's not exported from raumbuch.types
export interface FilterOptions {
  bereiche?: string[];
  gebaeudeteil?: string[];
  etage?: string[];
  rg?: string[];
}

// Use RaumbuchFilter as Filters type
type Filters = RaumbuchFilter;

interface FilterBarProps {
  filterOptions: FilterOptions;
  filters: Filters;
  onChange: (name: keyof Filters, value: string) => void;
  onReset: () => void;
  className?: string;
}

export default function FilterBar({
  filterOptions,
  filters,
  onChange,
  onReset,
  className = '',
}: FilterBarProps) {
  // Check if filters are applied
  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  return (
    <Card title="Filter" className={`bg-white ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Bereich filter */}
        <Select
          id="bereich-filter"
          label="Bereich"
          value={filters.bereich || ''}
          onChange={e => onChange('bereich', e.target.value)}
        >
          <option value="">Alle Bereiche</option>
          {filterOptions.bereiche?.map(bereich => (
            <option key={bereich} value={bereich}>
              {bereich}
            </option>
          ))}
        </Select>

        {/* Gebäudeteil filter */}
        <Select
          id="gebaeudeteil-filter"
          label="Gebäudeteil"
          value={filters.gebaeudeteil || ''}
          onChange={e => onChange('gebaeudeteil', e.target.value)}
        >
          <option value="">Alle Gebäudeteile</option>
          {filterOptions.gebaeudeteil?.map(gebaeudeteil => (
            <option key={gebaeudeteil} value={gebaeudeteil}>
              {gebaeudeteil}
            </option>
          ))}
        </Select>

        {/* Etage filter */}
        <Select
          id="etage-filter"
          label="Etage"
          value={filters.etage || ''}
          onChange={e => onChange('etage', e.target.value)}
        >
          <option value="">Alle Etagen</option>
          {filterOptions.etage?.map(etage => (
            <option key={etage} value={etage}>
              {etage}
            </option>
          ))}
        </Select>

        {/* Reinigungsgruppe filter */}
        <Select
          id="rg-filter"
          label="Reinigungsgruppe"
          value={filters.rg || ''}
          onChange={e => onChange('rg', e.target.value)}
        >
          <option value="">Alle Reinigungsgruppen</option>
          {filterOptions.rg?.map(rg => (
            <option key={rg} value={rg}>
              {rg}
            </option>
          ))}
        </Select>
      </div>

      {/* Reset button - only show if filters are applied */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <Button onClick={onReset} variant="secondary" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Filter zurücksetzen
          </Button>
        </div>
      )}
    </Card>
  );
}
