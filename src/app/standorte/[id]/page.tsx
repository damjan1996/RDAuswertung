'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import BereichChart from '@/components/charts/bereich-chart';
import RgChart from '@/components/charts/rg-chart';
import StandortSelect from '@/components/forms/standort-select';
import FilterBar from '@/components/raumbuch/filter-bar';
import RaumbuchTable from '@/components/raumbuch/raumbuch-table';
import SummaryGrid from '@/components/raumbuch/summary-grid';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Loader from '@/components/ui/loader';
import { useFilter } from '@/hooks/use-filter';
import { useRaumbuchData } from '@/hooks/use-raumbuch-data';
import { useStandorte } from '@/hooks/use-standorte';

interface StandortPageProps {
  params: {
    id: string;
  };
}

export default function StandortPage({ params }: StandortPageProps) {
  const standortId = parseInt(params.id);
  const router = useRouter();
  const { standorte, isLoading: standorteLoading, error: standorteError } = useStandorte();
  const [selectedStandortId, setSelectedStandortId] = useState<number>(standortId);

  // Get filter state from hook
  const { filters, setFilter, resetFilters, filterQueryString } = useFilter();

  // Fetch raumbuch data with filters
  const {
    data: raumbuchData,
    summary,
    visualizationData,
    filterOptions,
    isLoading,
    error,
  } = useRaumbuchData(standortId, filterQueryString);

  // Selected standort info
  const selectedStandort = standorte?.find(s => s.id === standortId);

  // Handle standort change
  const handleStandortChange = (newStandortId: number) => {
    setSelectedStandortId(newStandortId);
    router.push(`/standorte/${newStandortId}${filterQueryString ? `?${filterQueryString}` : ''}`);
  };

  // Handle export actions
  const handleExcelExport = () => {
    const exportUrl = `/export/excel/${standortId}${filterQueryString ? `?${filterQueryString}` : ''}`;
    window.open(exportUrl, '_blank');
  };

  const handlePdfExport = () => {
    const exportUrl = `/export/pdf/${standortId}${filterQueryString ? `?${filterQueryString}` : ''}`;
    window.open(exportUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary-800">Standort Details</h1>

        <div className="flex items-center space-x-4">
          {standorteLoading ? (
            <div className="w-64 h-10 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <StandortSelect
              standorte={standorte || []}
              value={selectedStandortId}
              onChange={handleStandortChange}
              className="w-64"
            />
          )}
        </div>
      </div>

      {/* Error states */}
      {standorteError && (
        <Alert variant="error">Fehler beim Laden der Standorte: {standorteError}</Alert>
      )}

      {error && <Alert variant="error">Fehler beim Laden der Raumbuch-Daten: {error}</Alert>}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader size="large" />
        </div>
      )}

      {/* Content when data is loaded */}
      {!isLoading && !error && raumbuchData && summary && (
        <>
          {/* Summary Section */}
          <Card
            title={`Zusammenfassung für ${selectedStandort?.bezeichnung || `Standort ${standortId}`}`}
          >
            <SummaryGrid summary={summary} />
          </Card>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Quadratmeter nach Bereich">
              {visualizationData?.bereichData && (
                <BereichChart data={visualizationData.bereichData} />
              )}
            </Card>
            <Card title="Wert pro Monat nach Reinigungsgruppe">
              {visualizationData?.rgData && <RgChart data={visualizationData.rgData} />}
            </Card>
          </div>

          {/* Filter Bar */}
          <FilterBar
            filterOptions={filterOptions}
            filters={filters}
            onChange={setFilter}
            onReset={resetFilters}
          />

          {/* Export Buttons */}
          <div className="flex justify-end space-x-4 mb-4">
            <Button variant="secondary" onClick={handleExcelExport}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Excel-Export
            </Button>
            <Button variant="primary" onClick={handlePdfExport}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              PDF-Export
            </Button>
          </div>

          {/* Data Table */}
          <Card title="Raumbuch-Daten" className="overflow-hidden">
            <RaumbuchTable data={raumbuchData} summary={summary} />
          </Card>
        </>
      )}
    </div>
  );
}
