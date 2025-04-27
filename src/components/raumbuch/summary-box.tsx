'use client';

import React from 'react';

interface SummaryBoxProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
  valueClassName?: string;
  colorScheme?: 'blue' | 'green' | 'orange' | 'purple' | 'gray';
}

export default function SummaryBox({
  title,
  value,
  unit,
  icon,
  className = '',
  valueClassName = '',
  colorScheme = 'blue',
}: SummaryBoxProps) {
  // Format the value if it's a number
  const formattedValue =
    typeof value === 'number'
      ? value.toLocaleString('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : value;

  // Color classes based on the color scheme
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'text-blue-700',
      value: 'text-blue-900',
      unit: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      title: 'text-green-700',
      value: 'text-green-900',
      unit: 'text-green-600',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      title: 'text-orange-700',
      value: 'text-orange-900',
      unit: 'text-orange-600',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      title: 'text-purple-700',
      value: 'text-purple-900',
      unit: 'text-purple-600',
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      title: 'text-gray-700',
      value: 'text-gray-900',
      unit: 'text-gray-600',
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-lg border ${colors.bg} ${colors.border} ${className}`}
    >
      <div className="text-center">
        <h3 className={`text-sm font-medium mb-1 ${colors.title}`}>{title}</h3>
        <div className="flex items-center justify-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className={`text-2xl font-bold ${colors.value} ${valueClassName}`}>
            {formattedValue}
          </span>
          {unit && <span className={`ml-1 text-sm ${colors.unit}`}>{unit}</span>}
        </div>
      </div>
    </div>
  );
}
