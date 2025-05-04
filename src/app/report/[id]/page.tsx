'use client';

import { motion } from 'framer-motion';
import {
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import StandortSelect from '@/components/forms/standort-select';
import FilterBar from '@/components/raumbuch/filter-bar';
import RaumbuchTable from '@/components/raumbuch/raumbuch-table';
import Alert from '@/components/ui/alert';
import Card from '@/components/ui/card';
import Loader from '@/components/ui/loader';
import { useFilter } from '@/hooks/use-filter';
import { useRaumbuchData } from '@/hooks/use-raumbuch-data';
import { useStandorte } from '@/hooks/use-standorte';

interface ReportPageProps {
  params: {
    id: string;
  };
}

const ITEMS_PER_PAGE = 20;

export default function ReportPage({ params }: ReportPageProps) {
  const standortId = Number.parseInt(params.id);
  const router = useRouter();
  const { standorte, isLoading: standorteLoading, error: standorteError } = useStandorte();
  const [selectedStandortId, setSelectedStandortId] = useState<number>(standortId);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Get filter state from hook
  const { filters, setFilter, resetFilters, filterQueryString } = useFilter();

  // Fetch raumbuch data with filters
  const {
    data: raumbuchData,
    summary,
    filterOptions,
    isLoading,
    error,
  } = useRaumbuchData(standortId, filterQueryString);

  // Pagination logic
  const { paginatedData, totalPages } = useMemo(() => {
    if (!raumbuchData) return { paginatedData: [], totalPages: 0 };

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = raumbuchData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(raumbuchData.length / ITEMS_PER_PAGE);

    return { paginatedData, totalPages };
  }, [raumbuchData, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterQueryString]);

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

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination range
  const paginationRange = useMemo(() => {
    const range = [];
    const delta = 2; // Number of pages to show around current page
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    // Always show first page
    if (left > 1) {
      range.push(1);
      if (left > 2) {
        range.push('...');
      }
    }

    // Add the range
    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    // Always show last page
    if (right < totalPages) {
      if (right < totalPages - 1) {
        range.push('...');
      }
      range.push(totalPages);
    }

    return range;
  }, [currentPage, totalPages]);

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
              onReset={() => {
                resetFilters();
                setCurrentPage(1);
              }}
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

          {/* Data Table */}
          <motion.div variants={itemVariants}>
            <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
              <div className="border-b border-gray-100">
                <div className="flex justify-between items-center px-4 py-3">
                  <h2 className="text-lg font-semibold text-primary-800">
                    Raumbuch-Daten
                    {raumbuchData.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({raumbuchData.length} {raumbuchData.length === 1 ? 'Eintrag' : 'Einträge'})
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center space-x-2">
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

              <div className="p-4">
                <RaumbuchTable data={paginatedData} summary={summary} />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-100 px-4 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="text-sm text-gray-500">
                      Zeige{' '}
                      <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>{' '}
                      bis{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * ITEMS_PER_PAGE, raumbuchData.length)}
                      </span>{' '}
                      von <span className="font-medium">{raumbuchData.length}</span> Einträgen
                    </div>

                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-3 py-2 text-sm rounded-l-md border ${
                          currentPage === 1
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="ml-1 hidden sm:inline">Zurück</span>
                      </button>

                      {paginationRange.map((number, index) => {
                        if (number === '...') {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }

                        const isActive = currentPage === number;
                        return (
                          <button
                            key={number}
                            onClick={() => handlePageChange(number as number)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm border ${
                              isActive
                                ? 'z-10 bg-accent border-accent text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {number}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-3 py-2 text-sm rounded-r-md border ${
                          currentPage === totalPages
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-1 hidden sm:inline">Weiter</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </nav>
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
