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
    Firma_ID: data.Firma_ID,
    Standort_ID: data.Standort_ID,
    Gebaeude_ID: data.Gebaeude_ID, // Changed from Objekt_ID
    Standort: data.Standort,
    Gebaeude: data.Gebaeude, // Changed from Objekt
    Raumnummer: data.Raumnummer,
    Bereich: data.Bereich,
    Gebaeudeteil: data.Gebaeudeteil,
    Etage: data.Etage,
    Bezeichnung: data.Bezeichnung,
    Reinigungsgruppe: data.Reinigungsgruppe,
    Menge: toNumber(data.Menge),
    MengeAktiv: toNumber(data.MengeAktiv),
    MengeInAktiv: toNumber(data.MengeInAktiv),
    Einheit: data.Einheit,
    Anzahl: toNumber(data.Anzahl),
    Reinigungsintervall: data.Reinigungsintervall,
    ReinigungstageMonat: toNumber(data.ReinigungstageMonat),
    ReinigungstageJahr: toNumber(data.ReinigungstageJahr),
    LeistungStunde: toNumber(data.LeistungStunde),
    LeistungStundeIst: toNumber(data.LeistungStundeIst),
    Aufschlag: toNumber(data.Aufschlag),
    StundeTag: toNumber(data.StundeTag),
    StundeMonat: toNumber(data.StundeMonat),
    MengeAktivMonat: toNumber(data.MengeAktivMonat),
    VkWertNettoMonat: toNumber(data.VkWertNettoMonat),
    VkWertBruttoMonat: toNumber(data.VkWertBruttoMonat),
    RgWertNettoMonat: toNumber(data.RgWertNettoMonat),
    RgWertBruttoMonat: toNumber(data.RgWertBruttoMonat),
    ReinigungsTage: data.ReinigungsTage,
    Reduzierung: data.Reduzierung,
    Bemerkung: data.Bemerkung,
    Bereich_ID: data.Bereich_ID,
    Gebaeudeteil_ID: data.Gebaeudeteil_ID,
    Etage_ID: data.Etage_ID,
    Reinigungsgruppe_ID: data.Reinigungsgruppe_ID,
    Einheit_ID: data.Einheit_ID,
    Reinigungsintervall_ID: data.Reinigungsintervall_ID,
    ReinigungsTage_ID: data.ReinigungsTage_ID,
    LfdNr: data.LfdNr,
    xStatus: data.xStatus,
    xDatum: data.xDatum,
    xBenutzer: data.xBenutzer,
    xVersion: data.xVersion,
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
 * @param preis - Preis pro Stunde für das Gebäude
 * @param preis7Tage - 7-Tage-Preis pro Stunde für das Gebäude
 * @param preisSonntag - Sonntags-Preis pro Stunde für das Gebäude
 * @returns Aktualisiertes Raumbuch-Objekt mit berechneten Werten
 */
export function calculateDerivedValues(
  raumbuch: Partial<RaumbuchEntry>,
  preis: number,
  preis7Tage: number,
  preisSonntag: number
): RaumbuchEntry {
  // Sicherstellen, dass alle benötigten Werte vorhanden sind
  const menge = toNumber(raumbuch.Menge);
  const anzahl = toNumber(raumbuch.Anzahl);
  const leistungStunde = toNumber(raumbuch.LeistungStunde);
  const reinigungstageJahr = toNumber(raumbuch.ReinigungstageJahr);

  // ReinigungstageMonat berechnen
  const reinigungstageMonat = parseFloat(((reinigungstageJahr * 4.33333) / 52).toFixed(2));

  // MengeAktivMonat berechnen
  const mengeAktivMonat = parseFloat((menge * reinigungstageMonat).toFixed(2));

  // StundeTag berechnen
  const stundeTag = parseFloat((menge / leistungStunde).toFixed(3));

  // StundeMonat berechnen
  const stundeMonat = parseFloat((reinigungstageMonat * stundeTag).toFixed(2));

  // Preis basierend auf Anzahl wählen
  let verwendeterPreis = preis;
  if (anzahl === 7) {
    verwendeterPreis = preis7Tage;
  } else if (anzahl === 1 && raumbuch.ReinigungsTage === 'Sonntag') {
    verwendeterPreis = preisSonntag;
  }

  // VkWertNettoMonat berechnen
  const vkWertNettoMonat = parseFloat(
    (((menge / leistungStunde) * reinigungstageJahr * verwendeterPreis) / 12).toFixed(2)
  );

  // VkWertBruttoMonat berechnen (angenommen 19% MwSt)
  const vkWertBruttoMonat = parseFloat((vkWertNettoMonat * 1.19).toFixed(2));

  // RgWertNettoMonat berechnen (angenommen 10% Abschlag vom VK-Preis)
  const rgWertNettoMonat = parseFloat((vkWertNettoMonat * 0.9).toFixed(2));

  // RgWertBruttoMonat berechnen
  const rgWertBruttoMonat = parseFloat((rgWertNettoMonat * 1.19).toFixed(2));

  // Grundwerte vom ursprünglichen Objekt übernehmen und berechnete Werte hinzufügen
  return {
    ID: raumbuch.ID || 0,
    Firma_ID: raumbuch.Firma_ID || 0,
    Standort_ID: raumbuch.Standort_ID || 0,
    Gebaeude_ID: raumbuch.Gebaeude_ID || 0, // Changed from Objekt_ID
    Standort: raumbuch.Standort || '',
    Gebaeude: raumbuch.Gebaeude || '', // Changed from Objekt
    Raumnummer: raumbuch.Raumnummer || '',
    Bereich: raumbuch.Bereich || '',
    Gebaeudeteil: raumbuch.Gebaeudeteil || '',
    Etage: raumbuch.Etage || '',
    Bezeichnung: raumbuch.Bezeichnung || '',
    Reinigungsgruppe: raumbuch.Reinigungsgruppe || '',
    Menge: menge,
    MengeAktiv: toNumber(raumbuch.MengeAktiv),
    MengeInAktiv: toNumber(raumbuch.MengeInAktiv),
    Einheit: raumbuch.Einheit || '',
    Anzahl: anzahl,
    Reinigungsintervall: raumbuch.Reinigungsintervall || '',
    ReinigungstageMonat: reinigungstageMonat,
    ReinigungstageJahr: reinigungstageJahr,
    LeistungStunde: leistungStunde,
    LeistungStundeIst: toNumber(raumbuch.LeistungStundeIst),
    Aufschlag: toNumber(raumbuch.Aufschlag),
    StundeTag: stundeTag,
    StundeMonat: stundeMonat,
    MengeAktivMonat: mengeAktivMonat,
    VkWertNettoMonat: vkWertNettoMonat,
    VkWertBruttoMonat: vkWertBruttoMonat,
    RgWertNettoMonat: rgWertNettoMonat,
    RgWertBruttoMonat: rgWertBruttoMonat,
    ReinigungsTage: raumbuch.ReinigungsTage || '',
    Reduzierung: raumbuch.Reduzierung || '',
    Bemerkung: raumbuch.Bemerkung || '',
    Bereich_ID: raumbuch.Bereich_ID || 0,
    Gebaeudeteil_ID: raumbuch.Gebaeudeteil_ID || 0,
    Etage_ID: raumbuch.Etage_ID || 0,
    Reinigungsgruppe_ID: raumbuch.Reinigungsgruppe_ID || 0,
    Einheit_ID: raumbuch.Einheit_ID || null,
    Reinigungsintervall_ID: raumbuch.Reinigungsintervall_ID || null,
    ReinigungsTage_ID: raumbuch.ReinigungsTage_ID || null,
    LfdNr: raumbuch.LfdNr || null,
    xStatus: raumbuch.xStatus || null,
    xDatum: raumbuch.xDatum || null,
    xBenutzer: raumbuch.xBenutzer || null,
    xVersion: raumbuch.xVersion || null,
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
  if (toNumber(raumbuch.Menge) < 0) {
    errors.push('Menge darf nicht negativ sein');
  }

  if (toNumber(raumbuch.LeistungStunde) < 0) {
    errors.push('LeistungStunde darf nicht negativ sein');
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

  if (!raumbuch.Reinigungsgruppe) {
    errors.push('Reinigungsgruppe muss angegeben werden');
  }

  if (!raumbuch.Reinigungsintervall) {
    errors.push('Reinigungsintervall muss angegeben werden');
  }

  return errors;
}
