/**
 * Service zur Aufbereitung von Raumbuch-Daten für Visualisierungen
 */

import { groupBy } from '@/lib/utils';

import type { RaumbuchRow, VisualizationData } from '@/types/raumbuch.types';

// Verwende RaumbuchRow als RaumbuchEntry
type RaumbuchEntry = RaumbuchRow;

/**
 * Schützt die Berechnung gegen NULL-Werte und ungültige Zahlen
 *
 * @param value - Der zu verarbeitende Wert
 * @param defaultValue - Standardwert, wenn der Wert ungültig ist
 * @returns Eine gültige Zahl oder den Standardwert
 */
function safeNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  const parsed = typeof value === 'number' ? value : parseFloat(String(value));
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Bereitet Daten für Visualisierungen auf
 *
 * @param data - Liste der Raumbuch-Einträge
 * @returns Aufbereitete Daten für verschiedene Visualisierungen
 */
export function prepareDataForVisualization(data: RaumbuchEntry[]): VisualizationData {
  if (!data || data.length === 0) {
    return {
      bereichData: {},
      rgData: {},
      etageData: {},
    };
  }

  try {
    // Daten für Kreisdiagramm nach Bereichen
    const bereichData = prepareBereichData(data);

    // Daten für Balkendiagramm nach Reinigungsgruppen
    const rgData = prepareRgData(data);

    // Daten für Balkendiagramm nach Etagen
    const etageData = prepareEtageData(data);

    return {
      bereichData,
      rgData,
      etageData,
    };
  } catch (error) {
    console.error('Fehler bei der Datenvorbereitung für Visualisierung:', error);
    return {
      bereichData: {},
      rgData: {},
      etageData: {},
    };
  }
}

/**
 * Bereitet Daten für Bereich-Visualisierung auf
 *
 * @param data - Liste der Raumbuch-Einträge
 * @returns Aufbereitete Daten für Bereich-Visualisierung
 */
function prepareBereichData(data: RaumbuchEntry[]): Record<string, number> {
  const groupedByBereich = groupBy(data, 'Bereich');

  // Summiere qm pro Bereich
  const result: Record<string, number> = {};

  Object.entries(groupedByBereich).forEach(([bereich, items]) => {
    if (bereich && bereich !== 'undefined' && bereich !== 'null') {
      result[bereich] = items.reduce((sum, item) => sum + safeNumber(item.qm), 0);
    }
  });

  return result;
}

/**
 * Bereitet Daten für Reinigungsgruppen-Visualisierung auf
 *
 * @param data - Liste der Raumbuch-Einträge
 * @returns Aufbereitete Daten für Reinigungsgruppen-Visualisierung
 */
function prepareRgData(data: RaumbuchEntry[]): Record<string, number> {
  const groupedByRG = groupBy(data, 'RG');

  // Summiere WertMonat pro Reinigungsgruppe
  const result: Record<string, number> = {};

  Object.entries(groupedByRG).forEach(([rg, items]) => {
    if (rg && rg !== 'undefined' && rg !== 'null') {
      result[rg] = items.reduce((sum, item) => sum + safeNumber(item.WertMonat), 0);
    }
  });

  return result;
}

/**
 * Bereitet Daten für Etagen-Visualisierung auf
 *
 * @param data - Liste der Raumbuch-Einträge
 * @returns Aufbereitete Daten für Etagen-Visualisierung
 */
function prepareEtageData(data: RaumbuchEntry[]): Record<string, number> {
  const groupedByEtage = groupBy(data, 'Etage');

  // Summiere StundenMonat pro Etage
  const result: Record<string, number> = {};

  Object.entries(groupedByEtage).forEach(([etage, items]) => {
    if (etage && etage !== 'undefined' && etage !== 'null') {
      result[etage] = items.reduce((sum, item) => sum + safeNumber(item.StundenMonat), 0);
    }
  });

  return result;
}

/**
 * Bereitet Daten für Gebäudeteil-Visualisierung auf
 *
 * @param data - Liste der Raumbuch-Einträge
 * @returns Aufbereitete Daten für Gebäudeteil-Visualisierung
 */
export function prepareGebaeudeTeilData(data: RaumbuchEntry[]): Record<string, number> {
  const groupedByGebaeudeteil = groupBy(data, 'Gebaeudeteil');

  // Summiere qm pro Gebäudeteil
  const result: Record<string, number> = {};

  Object.entries(groupedByGebaeudeteil).forEach(([gebaeudeteil, items]) => {
    if (gebaeudeteil && gebaeudeteil !== 'undefined' && gebaeudeteil !== 'null') {
      result[gebaeudeteil] = items.reduce((sum, item) => sum + safeNumber(item.qm), 0);
    }
  });

  return result;
}
