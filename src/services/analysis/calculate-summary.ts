/**
 * Service zum Berechnen von Zusammenfassungen für Raumbuch-Daten
 */

import { groupBy } from '@/lib/utils';

import type { RaumbuchRow, RaumbuchSummary } from '@/types/raumbuch.types';

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
 * Berechnet eine Zusammenfassung der Raumbuch-Daten
 *
 * @param data - Liste der Raumbuch-Einträge
 * @returns Zusammenfassung mit verschiedenen Statistiken
 */
export function calculateSummary(data: RaumbuchEntry[]): RaumbuchSummary {
  if (!data || data.length === 0) {
    return {
      totalRooms: 0,
      totalQm: 0,
      totalQmMonat: 0,
      totalWertMonat: 0,
      totalWertJahr: 0,
      totalStundenMonat: 0,
    };
  }

  // Berechnung der Gesamtwerte
  const totalRooms = data.length;

  const totalQm = data.reduce((sum, item) => sum + safeNumber(item.qm), 0);

  const totalQmMonat = data.reduce((sum, item) => sum + safeNumber(item.qmMonat), 0);

  const totalWertMonat = data.reduce((sum, item) => sum + safeNumber(item.WertMonat), 0);

  const totalWertJahr = data.reduce((sum, item) => sum + safeNumber(item.WertJahr), 0);

  const totalStundenMonat = data.reduce((sum, item) => sum + safeNumber(item.StundenMonat), 0);

  // Statistiken nach Bereichen
  const groupedByBereich = groupBy(data, 'Bereich');
  const bereichStats = Object.entries(groupedByBereich).map(([bereich, items]) => ({
    bereich: bereich,
    qm: items.reduce((sum, item) => sum + safeNumber(item.qm), 0),
    wertMonat: items.reduce((sum, item) => sum + safeNumber(item.WertMonat), 0),
    wertJahr: items.reduce((sum, item) => sum + safeNumber(item.WertJahr), 0),
    stundenMonat: items.reduce((sum, item) => sum + safeNumber(item.StundenMonat), 0),
  }));

  // Statistiken nach Reinigungsgruppen
  const groupedByRG = groupBy(data, 'RG');
  const rgStats = Object.entries(groupedByRG).map(([rg, items]) => ({
    rg: rg,
    qm: items.reduce((sum, item) => sum + safeNumber(item.qm), 0),
    wertMonat: items.reduce((sum, item) => sum + safeNumber(item.WertMonat), 0),
    wertJahr: items.reduce((sum, item) => sum + safeNumber(item.WertJahr), 0),
    stundenMonat: items.reduce((sum, item) => sum + safeNumber(item.StundenMonat), 0),
  }));

  return {
    totalRooms,
    totalQm,
    totalQmMonat,
    totalWertMonat,
    totalWertJahr,
    totalStundenMonat,
    bereichStats,
    rgStats,
  };
}

/**
 * Berechnet die Top-N-Werte aus den Statistiken
 *
 * @param stats - Statistiken (Bereich oder RG)
 * @param field - Zu vergleichendes Feld
 * @param count - Anzahl der zu liefernden Einträge
 * @param ascending - Ob aufsteigend (true) oder absteigend (false) sortiert werden soll
 * @returns Sortierte und begrenzte Statistiken
 */
export function getTopStats(
  stats: Array<Record<string, unknown>>,
  field: string = 'qm',
  count: number = 5,
  ascending: boolean = false
): Array<Record<string, unknown>> {
  if (!stats || stats.length === 0) {
    return [];
  }

  // Sortieren nach dem angegebenen Feld
  const sortedStats = [...stats].sort((a, b) => {
    const aValue = safeNumber(a[field]);
    const bValue = safeNumber(b[field]);
    return ascending ? aValue - bValue : bValue - aValue;
  });

  // Begrenzen auf die angegebene Anzahl
  return sortedStats.slice(0, count);
}
