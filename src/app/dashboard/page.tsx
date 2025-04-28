'use client';

import { motion } from 'framer-motion';
import { BarChart3, Building, Download, FileText, Home, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import StandortSelect from '@/components/forms/standort-select';
import Alert from '@/components/ui/alert';
import Card from '@/components/ui/card';
import Loader from '@/components/ui/loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStandorte } from '@/hooks/use-standorte';

import type { Standort } from '@/types/standort.types';

export default function DashboardPage() {
  const [selectedStandortId, setSelectedStandortId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('übersicht');
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
          <h1 className="text-3xl font-bold text-primary-800">Raumbuch Auswertung</h1>
          <p className="text-gray-600 mt-1">
            Analysieren und visualisieren Sie Daten aus dem Raumbuch-System
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {selectedStandortId && (
            <button
              onClick={handleAuswerten}
              className="flex items-center px-4 py-2 rounded-md bg-accent hover:bg-accent-600 text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Auswerten
            </button>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs
          defaultValue="übersicht"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger
              value="übersicht"
              className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary"
            >
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Übersicht</span>
            </TabsTrigger>
            <TabsTrigger
              value="standorte"
              className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary"
            >
              <Building className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Standorte</span>
            </TabsTrigger>
            <TabsTrigger
              value="berichte"
              className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Berichte</span>
            </TabsTrigger>
            <TabsTrigger
              value="statistiken"
              className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Statistiken</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="übersicht" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="col-span-2">
                <Card
                  title="Standort auswählen"
                  className="bg-white shadow-sm border border-gray-100 h-full"
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
                        className="flex items-center px-4 py-2 rounded-md w-full md:w-auto bg-accent hover:bg-accent-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Auswerten
                      </button>
                    </div>
                  )}
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card
                  title="Informationen"
                  className="bg-white shadow-sm border border-gray-100 h-full"
                >
                  <div className="space-y-4">
                    <p className="text-gray-500 text-sm">Diese Anwendung ermöglicht:</p>
                    <ul className="space-y-2">
                      {[
                        {
                          icon: <MapPin className="h-4 w-4" />,
                          text: 'Anzeigen der Raumbuch-Daten für einen ausgewählten Standort',
                        },
                        {
                          icon: <Search className="h-4 w-4" />,
                          text: 'Filtern und Sortieren der Daten nach verschiedenen Kriterien',
                        },
                        {
                          icon: <BarChart3 className="h-4 w-4" />,
                          text: 'Berechnung von Statistiken und Zusammenfassungen',
                        },
                        {
                          icon: <FileText className="h-4 w-4" />,
                          text: 'Visualisierung der Daten mit Diagrammen',
                        },
                        {
                          icon: <Download className="h-4 w-4" />,
                          text: 'Export der Daten als Excel oder PDF',
                        },
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-50 flex items-center justify-center mr-3 text-primary">
                            {item.icon}
                          </span>
                          <span className="text-sm text-gray-600">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="standorte" className="mt-0">
            <Card title="Alle Standorte" className="bg-white shadow-sm border border-gray-100">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : error ? (
                <Alert variant="error">Fehler beim Laden der Standorte: {error}</Alert>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {standorte?.map((standort: Standort) => (
                    <motion.div
                      key={standort.id}
                      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <Link
                        href={`/report/${standort.id}`}
                        className="p-4 border border-gray-100 rounded-lg hover:border-primary-200 transition-colors flex items-center space-x-3 bg-white h-full"
                      >
                        <span className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary">
                          <MapPin className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="font-medium text-primary-800 block">
                            {standort.bezeichnung}
                          </span>
                          <span className="text-xs text-gray-500">ID: {standort.id}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="berichte" className="mt-0">
            <Card title="Verfügbare Berichte" className="bg-white shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Raumübersicht',
                  'Flächenauswertung',
                  'Ausstattungsübersicht',
                  'Zustandsbericht',
                ].map((report, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className="p-4 border border-gray-100 rounded-lg hover:border-primary-200 transition-colors bg-white"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div>
                        <span className="font-medium text-primary-800 block">{report}</span>
                        <span className="text-xs text-gray-500">
                          Wählen Sie einen Standort für diesen Bericht
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="statistiken" className="mt-0">
            <Card
              title="Statistiken & Analysen"
              className="bg-white shadow-sm border border-gray-100"
            >
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 mx-auto text-primary-200 mb-4" />
                <h3 className="text-lg font-medium text-primary-800 mb-2">
                  Statistiken sind verfügbar nach Standortauswahl
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Wählen Sie einen Standort aus und klicken Sie auf &quot;Auswerten&quot;, um
                  detaillierte Statistiken und Analysen zu sehen.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {standorte && standorte.length > 0 && activeTab === 'übersicht' && (
        <motion.div variants={itemVariants}>
          <Card title="Kürzliche Standorte" className="bg-white shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {standorte.slice(0, 6).map((standort: Standort) => (
                <motion.div
                  key={standort.id}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Link
                    href={`/report/${standort.id}`}
                    className="p-4 border border-gray-100 rounded-lg hover:border-primary-200 transition-colors flex items-center space-x-3 bg-white h-full"
                  >
                    <span className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span className="font-medium text-primary-800">{standort.bezeichnung}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
