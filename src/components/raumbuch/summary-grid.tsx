'use client';

import { motion } from 'framer-motion';
import { AreaChart, CalendarDays, Clock, DollarSign, Home } from 'lucide-react';

import SummaryBox from '@/components/raumbuch/summary-box';
import { cn } from '@/lib/utils';

import type { RaumbuchSummary } from '@/types/raumbuch.types';

interface SummaryGridProps {
  summary: RaumbuchSummary;
  className?: string;
}

export default function SummaryGrid({ summary, className = '' }: SummaryGridProps) {
  // Define summary boxes configuration
  const summaryBoxes = [
    {
      title: 'Anzahl Räume',
      value: summary.totalRooms,
      unit: '',
      colorScheme: 'primary' as const,
      icon: <Home className="h-5 w-5" />,
      subtitle: 'Gesamtanzahl der Räume',
    },
    {
      title: 'Gesamtfläche',
      value: summary.totalMenge,
      unit: 'm²',
      colorScheme: 'green' as const,
      icon: <AreaChart className="h-5 w-5" />,
      subtitle: 'Summe aller Flächen',
    },
    {
      title: 'VK-Preis (Netto)',
      value: summary.totalVkWertNettoMonat,
      unit: '€',
      colorScheme: 'accent' as const,
      icon: <DollarSign className="h-5 w-5" />,
      subtitle: 'Verkaufspreis netto pro Monat',
    },
    {
      title: 'RG-Wert (Netto)',
      value: summary.totalRgWertNettoMonat,
      unit: '€',
      colorScheme: 'purple' as const,
      icon: <CalendarDays className="h-5 w-5" />,
      subtitle: 'Rechnungswert netto pro Monat',
    },
    {
      title: 'Arbeitsstunden pro Monat',
      value: summary.totalStundenMonat,
      unit: 'h',
      colorScheme: 'gray' as const,
      icon: <Clock className="h-5 w-5" />,
      subtitle: 'Monatlicher Arbeitsaufwand',
    },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4', className)}
    >
      {summaryBoxes.map((box, index) => (
        <motion.div key={index} variants={itemVariants}>
          <SummaryBox
            title={box.title}
            value={box.value}
            unit={box.unit}
            icon={box.icon}
            colorScheme={box.colorScheme}
            subtitle={box.subtitle}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
