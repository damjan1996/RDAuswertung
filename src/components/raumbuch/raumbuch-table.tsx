'use client';

import React, { useCallback, useMemo, useState } from 'react';

import Input from '@/components/ui/input';
import Table from '@/components/ui/table';

import type { RaumbuchRow, RaumbuchSummary } from '@/types/raumbuch.types';

// Use RaumbuchRow as RaumbuchEntry
type RaumbuchEntry = RaumbuchRow;

interface RaumbuchTableProps {
  data: RaumbuchEntry[];
  summary: RaumbuchSummary;
  className?: string;
}

// Define a stricter type for sort configuration
interface SortConfig {
  key: keyof RaumbuchEntry;
  direction: 'asc' | 'desc';
}

export default function RaumbuchTable({ data, summary, className = '' }: RaumbuchTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Format a number to fixed decimal places
  const formatNumber = (value: number | null | undefined, decimals = 2) => {
    if (value === null || value === undefined) return '';
    // Make sure value is a number
    const numValue = typeof value === 'number' ? value : parseFloat(String(value));
    // Check if conversion was successful
    if (isNaN(numValue)) return '';
    return numValue.toFixed(decimals);
  };

  // Handle search input change - make serializable with useCallback
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle column sort - make serializable with useCallback
  // Modified to accept string | number | symbol to match Table component's expectations
  const handleSort = useCallback(
    (key: string | number | symbol) => {
      // Only proceed if the key is a valid key of RaumbuchEntry
      if (typeof key === 'string' && key in data[0]) {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
        }

        setSortConfig({ key: key as keyof RaumbuchEntry, direction });
      }
    },
    [sortConfig, data]
  );

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    // First apply search filter
    let filteredData = data;

    if (searchTerm.trim() !== '') {
      const lowercasedFilter = searchTerm.toLowerCase();

      filteredData = data.filter(item => {
        return (
          item.Raumnummer?.toLowerCase().includes(lowercasedFilter) ||
          false ||
          item.Bereich?.toLowerCase().includes(lowercasedFilter) ||
          false ||
          item.Gebaeudeteil?.toLowerCase().includes(lowercasedFilter) ||
          false ||
          item.Etage?.toLowerCase().includes(lowercasedFilter) ||
          false ||
          item.Bezeichnung?.toLowerCase().includes(lowercasedFilter) ||
          false ||
          item.Reinigungsgruppe?.toLowerCase().includes(lowercasedFilter) ||
          false
        );
      });
    }

    // Then apply sorting if needed
    if (sortConfig !== null) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle null or undefined values in sorting
        if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;

        // Sort based on value type
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Convert to string for comparison
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();

        return sortConfig.direction === 'asc'
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      });
    }

    return filteredData;
  }, [data, searchTerm, sortConfig]);

  // Define columns for the table
  const columns = [
    {
      header: 'Raumnr.',
      accessor: 'Raumnummer' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.Raumnummer || '',
    },
    {
      header: 'Bereich',
      accessor: 'Bereich' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.Bereich || '',
    },
    {
      header: 'Gebäudeteil',
      accessor: 'Gebaeudeteil' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.Gebaeudeteil || '',
    },
    {
      header: 'Etage',
      accessor: 'Etage' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.Etage || '',
    },
    {
      header: 'Bezeichnung',
      accessor: 'Bezeichnung' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.Bezeichnung || '',
    },
    {
      header: 'RG',
      accessor: 'Reinigungsgruppe' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.Reinigungsgruppe || '',
    },
    {
      header: 'Menge',
      accessor: 'Menge' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.Menge),
      className: 'text-right',
    },
    {
      header: 'Einheit',
      accessor: 'Einheit' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.Einheit || '',
    },
    {
      header: 'Anz.',
      accessor: 'Anzahl' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.Anzahl || '',
      className: 'text-right',
    },
    {
      header: 'Intervall',
      accessor: 'Reinigungsintervall' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.Reinigungsintervall || '',
    },
    {
      header: 'Rg/Jahr',
      accessor: 'ReinigungstageJahr' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.ReinigungstageJahr),
      className: 'text-right',
    },
    {
      header: 'Rg/Monat',
      accessor: 'ReinigungstageMonat' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.ReinigungstageMonat),
      className: 'text-right',
    },
    {
      header: 'Menge/Monat',
      accessor: 'MengeAktivMonat' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.MengeAktivMonat),
      className: 'text-right',
    },
    {
      header: 'VK Netto',
      accessor: 'VkWertNettoMonat' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.VkWertNettoMonat),
      className: 'text-right',
    },
    {
      header: 'VK Brutto',
      accessor: 'VkWertBruttoMonat' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.VkWertBruttoMonat),
      className: 'text-right',
    },
    {
      header: 'RG Netto',
      accessor: 'RgWertNettoMonat' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.RgWertNettoMonat),
      className: 'text-right',
    },
    {
      header: 'RG Brutto',
      accessor: 'RgWertBruttoMonat' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.RgWertBruttoMonat),
      className: 'text-right',
    },
    {
      header: 'h/Tag',
      accessor: 'StundeTag' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.StundeTag, 3),
      className: 'text-right',
    },
    {
      header: 'h/Monat',
      accessor: 'StundeMonat' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.StundeMonat),
      className: 'text-right',
    },
    {
      header: 'Leistung/h',
      accessor: 'LeistungStunde' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.LeistungStunde),
      className: 'text-right',
    },
  ];

  // Summary row calculations
  const summaryRow: Partial<RaumbuchEntry> = {
    ID: 0,
    Raumnummer: '',
    Bereich: '',
    Gebaeudeteil: '',
    Etage: '',
    Bezeichnung: 'Summe:',
    Reinigungsgruppe: '',
    Menge: summary.totalMenge,
    Einheit: '',
    Anzahl: 0,
    Reinigungsintervall: '',
    ReinigungstageJahr: 0,
    ReinigungstageMonat: 0,
    MengeAktivMonat: summary.totalMengeAktivMonat,
    VkWertNettoMonat: summary.totalVkWertNettoMonat,
    VkWertBruttoMonat: summary.totalVkWertBruttoMonat,
    RgWertNettoMonat: summary.totalRgWertNettoMonat,
    RgWertBruttoMonat: summary.totalRgWertBruttoMonat,
    StundeTag: 0,
    StundeMonat: summary.totalStundenMonat,
    LeistungStunde: 0,
    ReinigungsTage: '',
    Bemerkung: '',
    Reduzierung: '',
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search input */}
      <div className="mb-4">
        <Input
          type="text"
          id="search"
          placeholder="Suchen..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="max-w-md"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      </div>

      {/* Table with raumbuch data */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={filteredAndSortedData}
          summaryRow={summaryRow as RaumbuchEntry}
          currentSort={sortConfig}
          onSort={handleSort}
        />
      </div>

      {/* Table info */}
      <div className="text-sm text-gray-500">
        Zeige {filteredAndSortedData.length} von {data.length} Einträgen
        {searchTerm && ` (gefiltert mit "${searchTerm}")`}
      </div>
    </div>
  );
}
