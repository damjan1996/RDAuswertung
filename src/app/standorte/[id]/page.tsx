'use client';

import { motion } from 'framer-motion';
import { ArrowDownToLine, FileSpreadsheet, FileText, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import BereichChart from '@/components/charts/bereich-chart';
import RgChart from '@/components/charts/rg-chart';
import StandortSelect from '@/components/forms/standort-select';
import FilterBar from '@/components/raumbuch/filter-bar';
import RaumbuchTable from '@/components/raumbuch/raumbuch-table';
import SummaryGrid from '@/components/raumbuch/summary-grid';
import Alert from '@/components/ui/alert';
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
  const standortId = Number.parseInt(params.id);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className="space-y-6 max-w-7xl mx-auto px-4 py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary-800">Standort Details</h1>
          {selectedStandort && (
            <p className="text-primary-600 mt-1">
              Daten für <span className="font-medium">{selectedStandort.bezeichnung}</span>
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {standorteLoading ? (
            <div className="w-64 h-10 bg-primary-50 animate-pulse rounded-lg"></div>
          ) : (
            <StandortSelect
              standorte={standorte || []}
              value={selectedStandortId}
              onChange={handleStandortChange}
            />
          )}
        </div>
      </motion.div>

      {/* Error states */}
      {standorteError && (
        <motion.div variants={itemVariants}>
          <Alert variant="error">Fehler beim Laden der Standorte: {standorteError}</Alert>
        </motion.div>
      )}

      {error && (
        <motion.div variants={itemVariants}>
          <Alert variant="error">Fehler beim Laden der Raumbuch-Daten: {error}</Alert>
        </motion.div>
      )}

      {/* Loading state */}
      {isLoading && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-16 space-y-4"
        >
          <Loader size="large" />
          <p className="text-primary-600 animate-pulse">Daten werden geladen...</p>
        </motion.div>
      )}

      {/* Content when data is loaded */}
      {!isLoading && !error && raumbuchData && summary && (
        <>
          {/* Summary Section */}
          <motion.div variants={itemVariants}>
            <Card
              title={`Zusammenfassung für ${selectedStandort?.bezeichnung || `Standort ${standortId}`}`}
              className="bg-white shadow-sm border border-gray-100"
            >
              <SummaryGrid summary={summary} />
            </Card>
          </motion.div>

          {/* Charts Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Quadratmeter nach Bereich"
              className="bg-white shadow-sm border border-gray-100"
            >
              {visualizationData?.bereichData && (
                <BereichChart data={visualizationData.bereichData} />
              )}
            </Card>
            <Card
              title="Wert pro Monat nach Reinigungsgruppe"
              className="bg-white shadow-sm border border-gray-100"
            >
              {visualizationData?.rgData && <RgChart data={visualizationData.rgData} />}
            </Card>
          </motion.div>

          {/* Filter Bar */}
          <motion.div variants={itemVariants}>
            <FilterBar
              filterOptions={filterOptions}
              initialFilters={filters}
              onSubmit={newFilters => {
                Object.entries(newFilters).forEach(([key, value]) => {
                  setFilter(key as any, value as string);
                });
              }}
              onReset={resetFilters}
            />
          </motion.div>

          {/* Export Buttons */}
          <motion.div variants={itemVariants} className="flex justify-end space-x-4 mb-4">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center px-4 py-2 rounded-md border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Filter zurücksetzen
              </button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                onClick={handleExcelExport}
                className="flex items-center px-4 py-2 rounded-md border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel-Export
              </button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                onClick={handlePdfExport}
                className="flex items-center px-4 py-2 rounded-md bg-accent hover:bg-accent-600 text-white transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF-Export
              </button>
            </motion.div>
          </motion.div>

          {/* Data Table */}
          <motion.div variants={itemVariants}>
            <div className="bg-white shadow-sm border border-gray-100 overflow-hidden rounded-lg">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-medium text-primary-800">Raumbuch-Daten</h3>
                <button
                  type="button"
                  onClick={handleExcelExport}
                  className="flex items-center px-3 py-1.5 text-sm text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Exportieren
                </button>
              </div>
              <div className="p-6">
                <RaumbuchTable data={raumbuchData} summary={summary} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
