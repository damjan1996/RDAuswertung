'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import type React from 'react';

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
  headerClassName?: string;
  rowClassName?: string;
  summaryRowClassName?: string;
  renderSortIcon?: (column: Column<T>) => React.ReactNode;
}

const Table = forwardRef<HTMLTableElement, TableProps<any>>(
  (
    {
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
      headerClassName = '',
      rowClassName = '',
      summaryRowClassName = '',
      renderSortIcon,
    },
    ref
  ) => {
    const handleSort = (column: Column<any>) => {
      if (onSort && column.sortable !== false) {
        onSort(column.accessor);
      }
    };

    // Default sort icon renderer if not provided
    const defaultRenderSortIcon = (column: Column<any>) => {
      if (!currentSort || currentSort.key !== column.accessor) {
        return <ArrowUpDown className="h-4 w-4 ml-1 text-primary-300" />;
      }
      return currentSort.direction === 'asc' ? (
        <ArrowUp className="h-4 w-4 ml-1 text-accent" />
      ) : (
        <ArrowDown className="h-4 w-4 ml-1 text-accent" />
      );
    };

    // Use provided renderSortIcon or default
    const sortIconRenderer = renderSortIcon || defaultRenderSortIcon;

    return (
      <div className={cn('overflow-x-auto rounded-lg', className)}>
        <table
          ref={ref}
          className={cn(
            'min-w-full divide-y divide-gray-200',
            bordered && 'border border-gray-100',
            'w-full border-collapse'
          )}
        >
          <thead className={cn('bg-primary-50 text-primary-700', headerClassName)}>
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={cn(
                    'text-left text-xs font-medium uppercase tracking-wider',
                    compact ? 'px-3 py-2' : 'px-4 py-3',
                    bordered && 'border-x border-gray-100',
                    column.sortable !== false && onSort && 'cursor-pointer select-none',
                    column.className
                  )}
                  onClick={() => onSort && column.sortable !== false && handleSort(column)}
                >
                  <div className="flex items-center">
                    <span>{column.header}</span>
                    {onSort && column.sortable !== false && (
                      <div className="ml-1">{sortIconRenderer(column)}</div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <motion.tr
                  key={rowIdx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIdx * 0.01, duration: 0.2 }}
                  className={cn(
                    onRowClick && 'cursor-pointer',
                    stripped && rowIdx % 2 === 1 && 'bg-primary-50/20',
                    hoverable && 'hover:bg-primary-50/40 transition-colors',
                    rowClassName
                  )}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIdx) => (
                    <td
                      key={colIdx}
                      className={cn(
                        'whitespace-nowrap text-sm text-primary-700',
                        compact ? 'px-3 py-2' : 'px-4 py-3',
                        bordered && 'border-x border-gray-100',
                        column.className
                      )}
                    >
                      {column.cell ? column.cell(row) : (row[column.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className={cn(
                    'text-center py-8 text-sm text-primary-500',
                    compact ? 'px-3 py-4' : 'px-4 py-8'
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {emptyMessage}
                  </motion.div>
                </td>
              </tr>
            )}
          </tbody>

          {summaryRow && (
            <tfoot
              className={cn('bg-primary-50/50 font-medium text-primary-800', summaryRowClassName)}
            >
              <tr>
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className={cn(
                      'whitespace-nowrap text-sm',
                      compact ? 'px-3 py-2' : 'px-4 py-3',
                      bordered && 'border-x border-gray-100',
                      'border-t border-gray-200',
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
);

Table.displayName = 'Table';

export default Table;
