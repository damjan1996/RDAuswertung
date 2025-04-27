'use client';

import React from 'react';

import { cn } from '@/lib/utils';

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  summaryRow?: T;
  stripped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  hoverable?: boolean;
  currentSort?: {
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null;
  onSort?: (key: keyof T) => void;
}

export default function Table<T>({
  columns,
  data,
  className = '',
  onRowClick,
  emptyMessage = 'Keine Daten verfügbar',
  summaryRow,
  stripped = true,
  bordered = true,
  compact = false,
  hoverable = true,
  currentSort,
  onSort,
}: TableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (onSort && column.sortable !== false) {
      onSort(column.accessor);
    }
  };

  return (
    <div className={cn('overflow-x-auto rounded-md', className)}>
      <table
        className={cn('min-w-full divide-y divide-gray-300', bordered && 'border border-gray-300')}
      >
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                scope="col"
                className={cn(
                  'text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  compact ? 'px-3 py-2' : 'px-4 py-3',
                  bordered && 'border-x border-gray-300',
                  column.sortable !== false && onSort && 'cursor-pointer select-none',
                  column.className
                )}
                onClick={() => onSort && column.sortable !== false && handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>

                  {/* Show sort indicator */}
                  {onSort && currentSort && currentSort.key === column.accessor && (
                    <span>
                      {currentSort.direction === 'asc' ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={cn(
                  onRowClick && 'cursor-pointer',
                  stripped && rowIdx % 2 === 1 && 'bg-gray-50',
                  hoverable && 'hover:bg-gray-100'
                )}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className={cn(
                      'whitespace-nowrap text-sm text-gray-500',
                      compact ? 'px-3 py-2' : 'px-4 py-3',
                      bordered && 'border-x border-gray-300',
                      column.className
                    )}
                  >
                    {column.cell ? column.cell(row) : (row[column.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className={cn(
                  'text-center py-4 text-sm text-gray-500',
                  compact ? 'px-3 py-2' : 'px-4 py-3'
                )}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>

        {summaryRow && (
          <tfoot className="bg-gray-50 font-semibold">
            <tr>
              {columns.map((column, colIdx) => (
                <td
                  key={colIdx}
                  className={cn(
                    'whitespace-nowrap text-sm text-gray-700',
                    compact ? 'px-3 py-2' : 'px-4 py-3',
                    bordered && 'border-x border-gray-300',
                    'border-t border-gray-300',
                    column.className
                  )}
                >
                  {column.cell
                    ? column.cell(summaryRow)
                    : (summaryRow[column.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
