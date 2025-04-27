'use client';

import React, { FormEvent, useState } from 'react';

import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { RaumbuchFilter } from '@/types/raumbuch.types';

// Define FilterOptions type locally
export interface FilterOptions {
  bereiche?: string[];
  gebaeudeteil?: string[];
  etage?: string[];
  rg?: string[];
}

// Use RaumbuchFilter as Filters type
type Filters = RaumbuchFilter;

interface FilterFormProps {
  filterOptions: FilterOptions;
  initialFilters?: Filters;
  onSubmit: (filters: Filters) => void;
  onReset?: () => void;
  className?: string;
}

export default function FilterForm({
  filterOptions,
  initialFilters = {},
  onSubmit,
  onReset,
  className = '',
}: FilterFormProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  // Handle filters change
  const handleFilterChange = (name: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filters);
  };

  // Handle form reset
  const handleReset = () => {
    setFilters({});
    if (onReset) {
      onReset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bereich filter */}
        <div>
          <Select
            id="bereich-filter"
            label="Bereich"
            value={filters.bereich || ''}
            onChange={e => handleFilterChange('bereich', e.target.value)}
          >
            <option value="">Alle Bereiche</option>
            {filterOptions.bereiche?.map(bereich => (
              <option key={bereich} value={bereich}>
                {bereich}
              </option>
            ))}
          </Select>
        </div>

        {/* Gebäudeteil filter */}
        <div>
          <Select
            id="gebaeudeteil-filter"
            label="Gebäudeteil"
            value={filters.gebaeudeteil || ''}
            onChange={e => handleFilterChange('gebaeudeteil', e.target.value)}
          >
            <option value="">Alle Gebäudeteile</option>
            {filterOptions.gebaeudeteil?.map(gebaeudeteil => (
              <option key={gebaeudeteil} value={gebaeudeteil}>
                {gebaeudeteil}
              </option>
            ))}
          </Select>
        </div>

        {/* Etage filter */}
        <div>
          <Select
            id="etage-filter"
            label="Etage"
            value={filters.etage || ''}
            onChange={e => handleFilterChange('etage', e.target.value)}
          >
            <option value="">Alle Etagen</option>
            {filterOptions.etage?.map(etage => (
              <option key={etage} value={etage}>
                {etage}
              </option>
            ))}
          </Select>
        </div>

        {/* Reinigungsgruppe filter */}
        <div>
          <Select
            id="rg-filter"
            label="Reinigungsgruppe"
            value={filters.rg || ''}
            onChange={e => handleFilterChange('rg', e.target.value)}
          >
            <option value="">Alle Reinigungsgruppen</option>
            {filterOptions.rg?.map(rg => (
              <option key={rg} value={rg}>
                {rg}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={handleReset}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          Zurücksetzen
        </Button>

        <Button type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          Filtern
        </Button>
      </div>
    </form>
  );
}
