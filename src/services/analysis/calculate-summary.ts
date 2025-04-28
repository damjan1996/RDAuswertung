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
      totalMenge: 0,
      totalMengeAktivMonat: 0,
      totalVkWertNettoMonat: 0,
      totalVkWertBruttoMonat: 0,
      totalRgWertNettoMonat: 0,
      totalRgWertBruttoMonat: 0,
      totalStundenMonat: 0,
    };
  }

  // Berechnung der Gesamtwerte
  const totalRooms = data.length;

  const totalMenge = data.reduce((sum, item) => sum + safeNumber(item.Menge), 0);

  const totalMengeAktivMonat = data.reduce(
    (sum, item) => sum + safeNumber(item.MengeAktivMonat),
    0
  );

  const totalVkWertNettoMonat = data.reduce(
    (sum, item) => sum + safeNumber(item.VkWertNettoMonat),
    0
  );

  const totalVkWertBruttoMonat = data.reduce(
    (sum, item) => sum + safeNumber(item.VkWertBruttoMonat),
    0
  );

  const totalRgWertNettoMonat = data.reduce(
    (sum, item) => sum + safeNumber(item.RgWertNettoMonat),
    0
  );

  const totalRgWertBruttoMonat = data.reduce(
    (sum, item) => sum + safeNumber(item.RgWertBruttoMonat),
    0
  );

  const totalStundenMonat = data.reduce((sum, item) => sum + safeNumber(item.StundeMonat), 0);

  // Statistiken nach Bereichen
  const groupedByBereich = groupBy(data, 'Bereich');
  const bereichStats = Object.entries(groupedByBereich).map(([bereich, items]) => ({
    bereich: bereich,
    menge: items.reduce((sum, item) => sum + safeNumber(item.Menge), 0),
    vkWertNettoMonat: items.reduce((sum, item) => sum + safeNumber(item.VkWertNettoMonat), 0),
    vkWertBruttoMonat: items.reduce((sum, item) => sum + safeNumber(item.VkWertBruttoMonat), 0),
    stundenMonat: items.reduce((sum, item) => sum + safeNumber(item.StundeMonat), 0),
  }));

  // Statistiken nach Reinigungsgruppen
  const groupedByRG = groupBy(data, 'Reinigungsgruppe');
  const rgStats = Object.entries(groupedByRG).map(([reinigungsgruppe, items]) => ({
    reinigungsgruppe: reinigungsgruppe,
    menge: items.reduce((sum, item) => sum + safeNumber(item.Menge), 0),
    vkWertNettoMonat: items.reduce((sum, item) => sum + safeNumber(item.VkWertNettoMonat), 0),
    vkWertBruttoMonat: items.reduce((sum, item) => sum + safeNumber(item.VkWertBruttoMonat), 0),
    stundenMonat: items.reduce((sum, item) => sum + safeNumber(item.StundeMonat), 0),
  }));

  return {
    totalRooms,
    totalMenge,
    totalMengeAktivMonat,
    totalVkWertNettoMonat,
    totalVkWertBruttoMonat,
    totalRgWertNettoMonat,
    totalRgWertBruttoMonat,
    totalStundenMonat,
    bereichStats,
    rgStats,
  };
}

/**
 * Gibt die Top-N Elemente nach einem bestimmten Feld zurück
 *
 * @param data - Array von Objekten
 * @param field - Feld, nach dem sortiert werden soll
 * @param limit - Anzahl der zurückzugebenden Elemente (default: 5)
 * @param ascending - Wenn true, wird aufsteigend sortiert (default: false, also absteigend)
 * @returns Sortiertes und begrenztes Array
 */
export function getTopStats<T extends Record<string, unknown>>(
  data: T[],
  field: keyof T,
  limit: number = 5,
  ascending: boolean = false
): T[] {
  if (!data || data.length === 0) {
    return [];
  }

  // Sortiere die Daten nach dem angegebenen Feld
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    // Behandle null oder undefined Werte
    if (aValue === null || aValue === undefined) return ascending ? -1 : 1;
    if (bValue === null || bValue === undefined) return ascending ? 1 : -1;

    // Vergleiche numerische Werte
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return ascending ? aValue - bValue : bValue - aValue;
    }

    // Vergleiche String-Werte
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();
    return ascending ? aString.localeCompare(bString) : bString.localeCompare(aString);
  });

  // Beschränke auf die angegebene Anzahl
  return sortedData.slice(0, limit);
}
