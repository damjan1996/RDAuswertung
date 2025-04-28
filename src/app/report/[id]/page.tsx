'use client';

import { motion } from 'framer-motion';
import {
  ArrowDownToLine,
  BarChart3,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Table,
} from 'lucide-react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFilter } from '@/hooks/use-filter';
import { useRaumbuchData } from '@/hooks/use-raumbuch-data';
import { useStandorte } from '@/hooks/use-standorte';

interface ReportPageProps {
  params: {
    id: string;
  };
}

export default function ReportPage({ params }: ReportPageProps) {
  const standortId = Number.parseInt(params.id);
  const router = useRouter();
  const { standorte, isLoading: standorteLoading, error: standorteError } = useStandorte();
  const [selectedStandortId, setSelectedStandortId] = useState<number>(standortId);
  const [activeTab, setActiveTab] = useState('tabelle');

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
    router.push(`/report/${newStandortId}${filterQueryString ? `?${filterQueryString}` : ''}`);
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
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className="space-y-4 max-w-7xl mx-auto px-4 py-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header with title and standort selector */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2"
      >
        <div>
          <h1 className="text-2xl font-bold text-primary-800">Raumbuch Auswertung</h1>
          {selectedStandort && (
            <p className="text-primary-600 text-sm">
              Daten für <span className="font-medium">{selectedStandort.bezeichnung}</span>
            </p>
          )}
        </div>

        <div className="flex items-center">
          {standorteLoading ? (
            <div className="w-64 h-10 bg-primary-50 animate-pulse rounded-lg"></div>
          ) : (
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium text-primary-700">Standort:</span>
              <StandortSelect
                standorte={standorte || []}
                value={selectedStandortId}
                onChange={handleStandortChange}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Error states */}
      {(standorteError || error) && (
        <motion.div variants={itemVariants}>
          {standorteError && (
            <Alert variant="error">Fehler beim Laden der Standorte: {standorteError}</Alert>
          )}
          {error && <Alert variant="error">Fehler beim Laden der Raumbuch-Daten: {error}</Alert>}
        </motion.div>
      )}

      {/* Loading state */}
      {isLoading && (
        <motion.div variants={itemVariants} className="flex items-center justify-center py-8">
          <Loader size="large" />
          <p className="ml-3 text-primary-600 animate-pulse">Daten werden geladen...</p>
        </motion.div>
      )}

      {/* Content when data is loaded */}
      {!isLoading && !error && raumbuchData && summary && (
        <>
          {/* Summary Section */}
          <motion.div variants={itemVariants} className="mb-4">
            <Card
              title={`Zusammenfassung für ${selectedStandort?.bezeichnung || `Standort ${standortId}`}`}
              className="bg-white shadow-sm border border-gray-100"
            >
              <SummaryGrid summary={summary} />
            </Card>
          </motion.div>

          {/* Filter Bar */}
          <motion.div variants={itemVariants} className="mb-3">
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
          <motion.div variants={itemVariants} className="flex justify-end space-x-2 mb-3">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center px-3 py-1.5 text-sm border border-primary-200 rounded-md text-primary-700 hover:bg-primary-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Filter zurücksetzen
              </button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                onClick={handleExcelExport}
                className="flex items-center px-3 py-1.5 text-sm border border-primary-200 rounded-md text-primary-700 hover:bg-primary-50 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                Excel-Export
              </button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                onClick={handlePdfExport}
                className="flex items-center px-3 py-1.5 text-sm border-transparent rounded-md bg-accent hover:bg-accent-600 text-white transition-colors"
              >
                <FileText className="h-4 w-4 mr-1" />
                PDF-Export
              </button>
            </motion.div>
          </motion.div>

          {/* Tabs for Table and Charts */}
          <motion.div variants={itemVariants}>
            <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
              <div className="border-b border-gray-100">
                <div className="flex justify-between items-center px-4 py-3">
                  <h2 className="text-lg font-semibold text-primary-800">Raumbuch-Daten</h2>
                  <div className="flex items-center space-x-2">
                    <Tabs
                      defaultValue="tabelle"
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-48"
                    >
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger
                          value="tabelle"
                          className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary"
                        >
                          <Table className="h-4 w-4 mr-1" />
                          <span>Tabelle</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="diagramme"
                          className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary"
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          <span>Diagramme</span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <button
                      type="button"
                      onClick={handleExcelExport}
                      className="flex items-center px-3 py-1.5 text-sm text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <ArrowDownToLine className="h-4 w-4 mr-1" />
                      Exportieren
                    </button>
                  </div>
                </div>
              </div>

              {activeTab === 'tabelle' ? (
                <div className="p-4">
                  <RaumbuchTable data={raumbuchData} summary={summary} />
                </div>
              ) : (
                <div className="p-4 space-y-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <h3 className="text-base font-medium text-primary-800 mb-3">
                      Quadratmeter nach Bereich
                    </h3>
                    {visualizationData?.bereichData && (
                      <BereichChart data={visualizationData.bereichData} />
                    )}
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <h3 className="text-base font-medium text-primary-800 mb-3">
                      Wert pro Monat nach Reinigungsgruppe
                    </h3>
                    {visualizationData?.rgData && <RgChart data={visualizationData.rgData} />}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
