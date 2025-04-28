/**
 * Service für die Analyse und Verarbeitung von Raumbuch-Daten.
 * Kombiniert die verschiedenen Analysefunktionen.
 */

import { toNumber } from '@/lib/formatters';

import { calculateSummary } from './calculate-summary';
import { prepareDataForVisualization } from './prepare-visualization';

import type { RaumbuchRow, RaumbuchSummary, VisualizationData } from '@/types/raumbuch.types';

// Definiere fehlende Typen
type RaumbuchEntry = RaumbuchRow;

// Definiere FilterOptions
export interface FilterOptions {
  bereiche: string[];
  gebaeudeteil: string[];
  etage: string[];
  reinigungsgruppe: string[]; // Geändert von rg zu reinigungsgruppe
}

/**
 * Sichert Zahlen-Konvertierung für Berechnungen
 *
 * @param value - Zu konvertierender Wert
 * @param defaultValue - Standardwert, wenn Konvertierung nicht möglich ist
 * @returns Konvertierter Zahlenwert oder Standardwert
 */
export function safeNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  try {
    const parsed = typeof value === 'number' ? value : parseFloat(String(value));
    return isNaN(parsed) ? defaultValue : parsed;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Vorverarbeitung von Raumbuch-Daten um NULL-Werte zu behandeln
 *
 * @param data - Liste von Raumbuch-Daten
 * @returns Vorverarbeitete Daten
 */
export function preprocessData(data: RaumbuchEntry[]): RaumbuchEntry[] {
  if (!data || data.length === 0) {
    return [];
  }

  const numericFields: (keyof RaumbuchEntry)[] = [
    'Menge',
    'Anzahl',
    'ReinigungstageJahr',
    'ReinigungstageMonat',
    'MengeAktivMonat',
    'VkWertNettoMonat',
    'StundeTag',
    'StundeMonat',
    'LeistungStunde',
    'VkWertBruttoMonat',
    'RgWertNettoMonat',
    'RgWertBruttoMonat',
    'MengeAktiv',
    'MengeInAktiv',
    'LeistungStundeIst',
    'Aufschlag',
  ];

  return data.map(item => {
    const processedItem = { ...item };

    // Numerische Felder als Zahlen konvertieren oder 0 setzen
    numericFields.forEach(field => {
      if (field in processedItem) {
        // Typ-Assertion verwenden
        (processedItem as Record<keyof RaumbuchEntry, unknown>)[field] = safeNumber(
          (processedItem as Record<keyof RaumbuchEntry, unknown>)[field],
          0
        );
      }
    });

    return processedItem;
  });
}

/**
 * Erstellt Filteroptionen aus den Raumbuch-Daten
 *
 * @param data - Liste von Raumbuch-Daten
 * @returns Filteroptionen
 */
export function createFilterOptions(data: RaumbuchEntry[]): FilterOptions {
  if (!data || data.length === 0) {
    return {
      bereiche: [],
      gebaeudeteil: [],
      etage: [],
      reinigungsgruppe: [], // Geändert von rg zu reinigungsgruppe
    };
  }

  // Sammeln eindeutiger Werte
  const bereiche = new Set<string>();
  const gebaeudeteil = new Set<string>();
  const etage = new Set<string>();
  const reinigungsgruppe = new Set<string>(); // Geändert von rg zu reinigungsgruppe

  data.forEach(item => {
    if (item.Bereich) bereiche.add(item.Bereich);
    if (item.Gebaeudeteil) gebaeudeteil.add(item.Gebaeudeteil);
    if (item.Etage) etage.add(item.Etage);
    if (item.Reinigungsgruppe) reinigungsgruppe.add(item.Reinigungsgruppe); // Geändert von RG zu Reinigungsgruppe
  });

  return {
    bereiche: [...bereiche].sort(),
    gebaeudeteil: [...gebaeudeteil].sort(),
    etage: [...etage].sort(),
    reinigungsgruppe: [...reinigungsgruppe].sort(), // Geändert von rg zu reinigungsgruppe
  };
}

/**
 * Analysiert Raumbuch-Daten und bereitet sie für die Verwendung vor
 *
 * @param data - Liste von Raumbuch-Daten
 * @returns Analyseergebnis mit Zusammenfassung, Visualisierungsdaten und Filteroptionen
 */
export function analyzeRaumbuchData(data: RaumbuchEntry[]) {
  // Vorverarbeitung der Daten
  const processedData = preprocessData(data);

  // Zusammenfassung berechnen
  const summary = calculateSummary(processedData);

  // Visualisierungsdaten vorbereiten
  const visualizationData = prepareDataForVisualization(processedData);

  // Filteroptionen erstellen
  const filterOptions = createFilterOptions(processedData);

  return {
    processedData,
    summary,
    visualizationData,
    filterOptions,
  };
}

// Re-export der spezifischen Analysefunktionen für Verwendung außerhalb
export { calculateSummary, prepareDataForVisualization };
