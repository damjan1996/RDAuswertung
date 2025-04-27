'use client';

import React, { useMemo, useState } from 'react';

import Input from '@/components/ui/input';
import Table from '@/components/ui/table';

import type { RaumbuchRow, RaumbuchSummary } from '@/types/raumbuch.types';

// Verwenden Sie RaumbuchRow als RaumbuchEntry
type RaumbuchEntry = RaumbuchRow;

interface RaumbuchTableProps {
  data: RaumbuchEntry[];
  summary: RaumbuchSummary;
  className?: string;
}

export default function RaumbuchTable({ data, summary, className = '' }: RaumbuchTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RaumbuchEntry;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Format a number to fixed decimal places
  const formatNumber = (value: number | null | undefined, decimals = 2) => {
    if (value === null || value === undefined) return '';
    // Sicherstellen, dass value eine Nummer ist
    const numValue = typeof value === 'number' ? value : parseFloat(String(value));
    // Prüfen, ob die Konvertierung erfolgreich war
    if (isNaN(numValue)) return '';
    return numValue.toFixed(decimals);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle column sort
  const handleSort = (key: keyof RaumbuchEntry) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

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
          item.RG?.toLowerCase().includes(lowercasedFilter) ||
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
      accessor: 'RG' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.RG || '',
    },
    {
      header: 'qm',
      accessor: 'qm' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.qm),
      className: 'text-right',
    },
    {
      header: 'Anz.',
      accessor: 'Anzahl' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.Anzahl || '',
      className: 'text-right',
    },
    {
      header: 'Intervall',
      accessor: 'Intervall' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => row.Intervall || '',
    },
    {
      header: 'Rg/Jahr',
      accessor: 'RgJahr' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.RgJahr),
      className: 'text-right',
    },
    {
      header: 'Rg/Monat',
      accessor: 'RgMonat' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.RgMonat),
      className: 'text-right',
    },
    {
      header: 'qm/Monat',
      accessor: 'qmMonat' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.qmMonat),
      className: 'text-right',
    },
    {
      header: '€/Monat',
      accessor: 'WertMonat' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.WertMonat),
      className: 'text-right',
    },
    {
      header: 'h/Tag',
      accessor: 'StundenTag' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.StundenTag, 3),
      className: 'text-right',
    },
    {
      header: 'h/Monat',
      accessor: 'StundenMonat' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.StundenMonat),
      className: 'text-right',
    },
    {
      header: '€/Jahr',
      accessor: 'WertJahr' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.WertJahr),
      className: 'text-right',
    },
    {
      header: 'qm/h',
      accessor: 'qmStunde' as keyof RaumbuchEntry,
      cell: (row: RaumbuchEntry) => formatNumber(row.qmStunde),
      className: 'text-right',
    },
  ];

  // Summary row calculations
  const summaryRow: RaumbuchEntry = {
    ID: 0, // Hinzugefügt
    Raumnummer: '',
    Bereich: '',
    Gebaeudeteil: '',
    Etage: '',
    Bezeichnung: 'Summe:',
    RG: '',
    qm: summary.totalQm,
    Anzahl: 0, // Geändert zu 0 statt leerer String
    Intervall: '',
    RgJahr: 0, // Geändert zu 0
    RgMonat: 0, // Geändert zu 0
    qmMonat: summary.totalQmMonat,
    WertMonat: summary.totalWertMonat,
    StundenTag: 0, // Geändert zu 0
    StundenMonat: summary.totalStundenMonat,
    WertJahr: summary.totalWertJahr,
    qmStunde: 0, // Geändert zu 0
    Reinigungstage: '', // Hinzugefügt
    Bemerkung: '', // Hinzugefügt
    Reduzierung: '', // Hinzugefügt
    Standort_ID: 0, // Hinzugefügt
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
          summaryRow={summaryRow}
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
