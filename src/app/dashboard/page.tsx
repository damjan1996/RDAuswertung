'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import StandortSelect from '@/components/forms/standort-select';
import Alert from '@/components/ui/alert';
import Card from '@/components/ui/card';
import Loader from '@/components/ui/loader';
import { useStandorte } from '@/hooks/use-standorte';

export default function DashboardPage() {
  const [selectedStandortId, setSelectedStandortId] = useState<number | null>(null);
  const { standorte, isLoading, error } = useStandorte();
  const router = useRouter();

  const handleStandortChange = (standortId: number) => {
    setSelectedStandortId(standortId);
  };

  const handleAuswerten = () => {
    if (selectedStandortId) {
      router.push(`/report/${selectedStandortId}`);
    }
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
      className="space-y-6 max-w-3xl mx-auto px-4 py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-3xl font-bold text-primary-800">Raumbuch Auswertung</h1>
        <p className="text-gray-600 mt-1">
          Analysieren und visualisieren Sie Daten aus dem Raumbuch-System
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card
          title="Standort auswählen"
          className="bg-white shadow-sm border border-gray-100 max-w-2xl mx-auto"
        >
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : error ? (
            <Alert variant="error">Fehler beim Laden der Standorte: {error}</Alert>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm mb-4">
                Wählen Sie einen Standort aus, um dessen Daten zu analysieren.
              </p>
              <StandortSelect
                standorte={standorte || []}
                value={selectedStandortId}
                onChange={handleStandortChange}
                required
              />
              <button
                onClick={handleAuswerten}
                disabled={!selectedStandortId}
                className="flex items-center px-4 py-2 rounded-md w-full justify-center bg-accent hover:bg-accent-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="h-4 w-4 mr-2" />
                Auswerten
              </button>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
