/**
 * Raumbuch-Modell und zugehörige Funktionen
 */

import { toNumber } from '@/lib/formatters';
import { RaumbuchRow } from '@/types/raumbuch.types';

// Verwende RaumbuchRow als RaumbuchEntry
type RaumbuchEntry = RaumbuchRow;

/**
 * Konvertiert ein Datenbankergebnis in ein RaumbuchEntry-Objekt
 *
 * @param data - Daten aus der Datenbank
 * @returns RaumbuchEntry-Objekt
 */
export function mapToRaumbuchEntry(data: any): RaumbuchEntry {
  return {
    ID: data.ID,
    Raumnummer: data.Raumnummer,
    Bereich: data.Bereich,
    Gebaeudeteil: data.Gebaeudeteil,
    Etage: data.Etage,
    Bezeichnung: data.Bezeichnung,
    RG: data.RG,
    qm: toNumber(data.qm),
    Anzahl: toNumber(data.Anzahl),
    Intervall: data.Intervall,
    RgJahr: toNumber(data.RgJahr),
    RgMonat: toNumber(data.RgMonat),
    qmMonat: toNumber(data.qmMonat),
    WertMonat: toNumber(data.WertMonat),
    StundenTag: toNumber(data.StundenTag),
    StundenMonat: toNumber(data.StundenMonat),
    WertJahr: toNumber(data.WertJahr),
    qmStunde: toNumber(data.qmStunde),
    Reinigungstage: data.Reinigungstage,
    Bemerkung: data.Bemerkung,
    Reduzierung: data.Reduzierung,
    Standort_ID: data.Standort_ID || 0,
  };
}

/**
 * Konvertiert eine Liste von Datenbankergebnissen in RaumbuchEntry-Objekte
 *
 * @param dataList - Liste von Daten aus der Datenbank
 * @returns Liste von RaumbuchEntry-Objekten
 */
export function mapToRaumbuchEntries(dataList: any[]): RaumbuchEntry[] {
  if (!Array.isArray(dataList)) {
    return [];
  }

  return dataList.map(mapToRaumbuchEntry);
}

/**
 * Berechnet abgeleitete Werte für ein Raumbuch-Objekt
 *
 * @param raumbuch - Raumbuch-Objekt mit Basisdaten
 * @param standortPreis - Preis pro Stunde für den Standort
 * @param standortPreis7Tage - 7-Tage-Preis pro Stunde für den Standort
 * @returns Aktualisiertes Raumbuch-Objekt mit berechneten Werten
 */
export function calculateDerivedValues(
  raumbuch: Partial<RaumbuchEntry>,
  standortPreis: number,
  standortPreis7Tage: number
): RaumbuchEntry {
  // Sicherstellen, dass alle benötigten Werte vorhanden sind
  const qm = toNumber(raumbuch.qm);
  const anzahl = toNumber(raumbuch.Anzahl);
  const qmStunde = toNumber(raumbuch.qmStunde);
  const rgJahr = toNumber(raumbuch.RgJahr);

  // RgMonat berechnen
  const rgMonat = parseFloat(((rgJahr * 4.33333) / 52).toFixed(2));

  // qmMonat berechnen
  const qmMonat = parseFloat((qm * rgMonat).toFixed(2));

  // StundenTag berechnen
  const stundenTag = parseFloat((qm / qmStunde).toFixed(3));

  // StundenMonat berechnen
  const stundenMonat = parseFloat((rgMonat * stundenTag).toFixed(2));

  // WertMonat berechnen
  const preis = anzahl === 7 ? standortPreis7Tage : standortPreis;
  const wertMonat = parseFloat((((qm / qmStunde) * rgJahr * preis) / 12).toFixed(2));

  // WertJahr berechnen
  const wertJahr = parseFloat((wertMonat * 12).toFixed(2));

  // Grundwerte vom ursprünglichen Objekt übernehmen und berechnete Werte hinzufügen
  return {
    ID: raumbuch.ID || 0,
    Raumnummer: raumbuch.Raumnummer || '',
    Bereich: raumbuch.Bereich || '',
    Gebaeudeteil: raumbuch.Gebaeudeteil || '',
    Etage: raumbuch.Etage || '',
    Bezeichnung: raumbuch.Bezeichnung || '',
    RG: raumbuch.RG || '',
    qm,
    Anzahl: anzahl,
    Intervall: raumbuch.Intervall || '',
    RgJahr: rgJahr,
    RgMonat: rgMonat,
    qmMonat,
    WertMonat: wertMonat,
    StundenTag: stundenTag,
    StundenMonat: stundenMonat,
    WertJahr: wertJahr,
    qmStunde,
    Reinigungstage: raumbuch.Reinigungstage || '',
    Bemerkung: raumbuch.Bemerkung || '',
    Reduzierung: raumbuch.Reduzierung || '',
    Standort_ID: raumbuch.Standort_ID || 0, // Hier fehlt die Eigenschaft
  };
}

/**
 * Validiert ein Raumbuch-Objekt
 *
 * @param raumbuch - Zu validierendes Raumbuch-Objekt
 * @returns Array mit Fehlermeldungen oder leeres Array, wenn keine Fehler gefunden wurden
 */
export function validateRaumbuch(raumbuch: Partial<RaumbuchEntry>): string[] {
  const errors: string[] = [];

  // Prüfen auf negative Werte
  if (toNumber(raumbuch.qm) < 0) {
    errors.push('qm darf nicht negativ sein');
  }

  if (toNumber(raumbuch.qmStunde) < 0) {
    errors.push('qmStunde darf nicht negativ sein');
  }

  if (toNumber(raumbuch.Anzahl) < 0) {
    errors.push('Anzahl darf nicht negativ sein');
  }

  // Prüfen auf Pflichtfelder
  if (!raumbuch.Bereich) {
    errors.push('Bereich muss angegeben werden');
  }

  if (!raumbuch.Gebaeudeteil) {
    errors.push('Gebäudeteil muss angegeben werden');
  }

  if (!raumbuch.Etage) {
    errors.push('Etage muss angegeben werden');
  }

  if (!raumbuch.RG) {
    errors.push('Reinigungsgruppe (RG) muss angegeben werden');
  }

  if (!raumbuch.Intervall) {
    errors.push('Intervall muss angegeben werden');
  }

  return errors;
}
