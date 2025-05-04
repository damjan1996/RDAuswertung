'use client';

import { motion } from 'framer-motion';
import {
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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

interface StandortPageProps {
  params: {
    id: string;
  };
}

const ITEMS_PER_PAGE = 20;
const VISIBLE_PAGE_BUTTONS = 5;

export default function StandortPage({ params }: StandortPageProps) {
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

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate visible page numbers with ellipsis logic
  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= VISIBLE_PAGE_BUTTONS) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const showLeftEllipsis = currentPage > Math.ceil(VISIBLE_PAGE_BUTTONS / 2);
    const showRightEllipsis = currentPage < totalPages - Math.floor(VISIBLE_PAGE_BUTTONS / 2);

    // Always show first page
    pages.push(1);

    // Show left ellipsis if needed
    if (showLeftEllipsis) {
      pages.push('...');
    }

    // Calculate range for middle pages
    let startPage = Math.max(2, currentPage - Math.floor(VISIBLE_PAGE_BUTTONS / 2));
    const endPage = Math.min(totalPages - 1, startPage + VISIBLE_PAGE_BUTTONS - 3);

    // Adjust if we're near the end
    if (endPage === totalPages - 1 && !showRightEllipsis) {
      startPage = Math.max(2, endPage - VISIBLE_PAGE_BUTTONS + 3);
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Show right ellipsis if needed
    if (showRightEllipsis) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

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
              onReset={() => {
                resetFilters();
                setCurrentPage(1);
              }}
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
                <h3 className="text-lg font-medium text-primary-800">
                  Raumbuch-Daten
                  {raumbuchData.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({raumbuchData.length} {raumbuchData.length === 1 ? 'Eintrag' : 'Einträge'})
                    </span>
                  )}
                </h3>
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
                <RaumbuchTable data={paginatedData} summary={summary} />
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-100 px-6 py-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Items info */}
                    <div className="text-sm text-gray-500">
                      Zeige{' '}
                      <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>{' '}
                      bis{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * ITEMS_PER_PAGE, raumbuchData.length)}
                      </span>{' '}
                      von <span className="font-medium">{raumbuchData.length}</span> Einträgen
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center space-x-2">
                      {/* First page */}
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Erste Seite"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </button>

                      {/* Previous page */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Vorherige Seite"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {/* Page numbers */}
                      <div className="flex items-center space-x-1">
                        {visiblePageNumbers.map((number, index) => (
                          <div key={index}>
                            {number === '...' ? (
                              <span className="px-3 py-1 text-gray-500">...</span>
                            ) : (
                              <button
                                onClick={() => handlePageChange(number as number)}
                                className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                                  currentPage === number
                                    ? 'border-accent bg-accent text-white'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {number}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Next page */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Nächste Seite"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      {/* Last page */}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Letzte Seite"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Page size selector (optional) */}
                    <div className="hidden sm:block">
                      <select
                        value={ITEMS_PER_PAGE}
                        onChange={e => {
                          // Handle page size change if needed
                          const newPageSize = parseInt(e.target.value);
                          // You would need to implement this logic
                        }}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                      >
                        <option value="10">10 pro Seite</option>
                        <option value="20">20 pro Seite</option>
                        <option value="50">50 pro Seite</option>
                        <option value="100">100 pro Seite</option>
                      </select>
                    </div>
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
