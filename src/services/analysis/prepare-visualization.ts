/**
 * Service zur Vorbereitung von Visualisierungsdaten
 */

import { toNumber } from '@/lib/formatters';
import { groupBy } from '@/lib/utils';

import type { RaumbuchRow, VisualizationData } from '@/types/raumbuch.types';

// Alias-Typ
type RaumbuchEntry = RaumbuchRow;

/**
 * Bereitet Daten für Visualisierungen vor
 *
 * @param data - Raumbuch-Einträge
 * @returns Vorbereitete Daten für verschiedene Visualisierungen
 */
export function prepareDataForVisualization(data: RaumbuchEntry[]): VisualizationData {
  if (!data || data.length === 0) {
    return {};
  }

  // Gruppiert nach Bereich
  const bereichData = getBereichData(data);

  // Gruppiert nach Reinigungsgruppe
  const rgData = getRgData(data);

  // Gruppiert nach Etage
  const etageData = getEtageData(data);

  return {
    bereichData,
    rgData,
    etageData,
  };
}

/**
 * Erzeugt Daten für Bereich-Visualisierung
 *
 * @param data - Raumbuch-Einträge
 * @returns Record mit Bereich als Key und Wert als Value
 */
function getBereichData(data: RaumbuchEntry[]): Record<string, number> {
  const groupedByBereich = groupBy(data, 'Bereich');

  // Summe der Menge pro Bereich
  const bereichData: Record<string, number> = {};
  Object.entries(groupedByBereich).forEach(([bereich, items]) => {
    if (!bereich) return; // Überspringe leere Bereiche

    const sum = items.reduce((acc, item) => acc + toNumber(item.Menge), 0);
    bereichData[bereich] = Number(sum.toFixed(2));
  });

  return bereichData;
}

/**
 * Erzeugt Daten für Reinigungsgruppe-Visualisierung
 *
 * @param data - Raumbuch-Einträge
 * @returns Record mit Reinigungsgruppe als Key und Wert als Value
 */
function getRgData(data: RaumbuchEntry[]): Record<string, number> {
  const groupedByRg = groupBy(data, 'Reinigungsgruppe');

  // Summe der Verkaufswerte pro Reinigungsgruppe
  const rgData: Record<string, number> = {};
  Object.entries(groupedByRg).forEach(([rg, items]) => {
    if (!rg) return; // Überspringe leere Reinigungsgruppen

    const sum = items.reduce((acc, item) => acc + toNumber(item.VkWertNettoMonat), 0);
    rgData[rg] = Number(sum.toFixed(2));
  });

  return rgData;
}

/**
 * Erzeugt Daten für Etage-Visualisierung
 *
 * @param data - Raumbuch-Einträge
 * @returns Record mit Etage als Key und Wert als Value
 */
function getEtageData(data: RaumbuchEntry[]): Record<string, number> {
  const groupedByEtage = groupBy(data, 'Etage');

  // Summe der Stunden pro Etage
  const etageData: Record<string, number> = {};
  Object.entries(groupedByEtage).forEach(([etage, items]) => {
    if (!etage) return; // Überspringe leere Etagen

    const sum = items.reduce((acc, item) => acc + toNumber(item.StundeMonat), 0);
    etageData[etage] = Number(sum.toFixed(2));
  });

  return etageData;
}

/**
 * Bereitet die Gebäudeteil-Daten für Visualisierung auf
 *
 * @param data - Liste der Raumbuch-Einträge
 * @returns Vorbereitete Daten für Gebäudeteil-Visualisierung
 */
export function prepareGebaeudeteilData(data: RaumbuchEntry[]): Record<string, number> {
  if (!data || data.length === 0) {
    return {};
  }

  const groupedByGebaeudeteil = groupBy(data, 'Gebaeudeteil');

  // Gebäudeteil-Daten (für Flächenaufteilung)
  const gebaeudeteilData: Record<string, number> = {};
  Object.entries(groupedByGebaeudeteil).forEach(([gebaeudeteil, items]) => {
    if (!gebaeudeteil) return; // Überspringe leere Gebäudeteile

    const sum = items.reduce((acc, item) => acc + toNumber(item.Menge), 0);
    gebaeudeteilData[gebaeudeteil] = Number(sum.toFixed(2));
  });

  return gebaeudeteilData;
}
