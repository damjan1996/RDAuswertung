'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import type React from 'react';

interface SummaryBoxProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
  valueClassName?: string;
  colorScheme?: 'primary' | 'accent' | 'green' | 'amber' | 'purple' | 'gray';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
}

export default function SummaryBox({
  title,
  value,
  unit,
  icon,
  className = '',
  valueClassName = '',
  colorScheme = 'primary',
  subtitle,
  trend,
}: SummaryBoxProps) {
  // Format the value if it's a number
  const formattedValue =
    typeof value === 'number'
      ? value.toLocaleString('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : value;

  // Format trend value if provided
  const formattedTrend =
    trend?.value !== undefined
      ? trend.value.toLocaleString('de-DE', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
          signDisplay: 'always',
        })
      : null;

  // Color classes based on the color scheme
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      border: 'border-primary-100',
      title: 'text-primary-700',
      value: 'text-primary-900',
      unit: 'text-primary-600',
      icon: 'text-primary-500',
    },
    accent: {
      bg: 'bg-accent-50',
      border: 'border-accent-100',
      title: 'text-primary-700',
      value: 'text-primary-900',
      unit: 'text-accent-600',
      icon: 'text-accent',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      title: 'text-green-700',
      value: 'text-green-900',
      unit: 'text-green-600',
      icon: 'text-green-500',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      title: 'text-amber-700',
      value: 'text-amber-900',
      unit: 'text-amber-600',
      icon: 'text-amber-500',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      title: 'text-purple-700',
      value: 'text-purple-900',
      unit: 'text-purple-600',
      icon: 'text-purple-500',
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-100',
      title: 'text-gray-700',
      value: 'text-gray-900',
      unit: 'text-gray-600',
      icon: 'text-gray-500',
    },
  };

  // Stellen Sie sicher, dass das Farbschema gültig ist, oder verwenden Sie "primary" als Fallback
  const validColorScheme = (Object.keys(colorClasses) as Array<keyof typeof colorClasses>).includes(
    colorScheme
  )
    ? colorScheme
    : 'primary';
  const colors = colorClasses[validColorScheme];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        'flex flex-col p-4 rounded-lg border shadow-sm',
        colors.bg,
        colors.border,
        className
      )}
    >
      <motion.div variants={itemVariants} className="flex items-center mb-2">
        {icon && <span className={cn('mr-2', colors.icon)}>{icon}</span>}
        <h3 className={cn('text-sm font-medium', colors.title)}>{title}</h3>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-baseline">
        <span className={cn('text-2xl font-bold', colors.value, valueClassName)}>
          {formattedValue}
        </span>
        {unit && <span className={cn('ml-1 text-sm', colors.unit)}>{unit}</span>}
      </motion.div>

      {subtitle && (
        <motion.div variants={itemVariants} className="mt-1 text-xs text-primary-500">
          {subtitle}
        </motion.div>
      )}

      {trend && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className={cn(
            'mt-2 text-xs font-medium flex items-center',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}
        >
          <svg
            className={cn('w-3 h-3 mr-1', trend.isPositive ? 'rotate-0' : 'rotate-180')}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 5L5 12H10V19H14V12H19L12 5Z" fill="currentColor" />
          </svg>
          {formattedTrend}%
        </motion.div>
      )}
    </motion.div>
  );
}
