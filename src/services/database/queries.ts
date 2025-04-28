/**
 * Service für Datenbankabfragen
 * Implementiert spezifische Abfragen für die Anwendung
 */

import { toNumber } from '@/lib/formatters';

import { executeQuery, executeSingleQuery } from './client';

import type { RaumbuchRow } from '@/types/raumbuch.types';
import type { Gebaeude, Standort } from '@/types/standort.types';

// Use RaumbuchRow as RaumbuchEntry for consistency with the rest of the code
type RaumbuchEntry = RaumbuchRow;

/**
 * Konvertiert ein Datenbankergebnis in ein Standort-Objekt
 *
 * @param data - Daten aus der Datenbank
 * @returns Standort-Objekt
 */
export function mapToStandort(data: any): Standort {
  return {
    id: data.ID,
    bezeichnung: data.Bezeichnung || '',
    adresse: data.Adresse || null,
    strasse: data.Strasse || null,
    plz: data.PLZ || null,
    ort: data.Ort || null,
    isActive: true,
  };
}

/**
 * Konvertiert eine Liste von Datenbankergebnissen in Standort-Objekte
 *
 * @param dataList - Liste von Daten aus der Datenbank
 * @returns Liste von Standort-Objekten
 */
export function mapToStandorte(dataList: any[]): Standort[] {
  if (!Array.isArray(dataList)) {
    return [];
  }

  return dataList.map(mapToStandort);
}

/**
 * Konvertiert ein Datenbankergebnis in ein Gebaeude-Objekt
 * Renamed from mapToObjekt to match database structure
 *
 * @param data - Daten aus der Datenbank
 * @returns Gebaeude-Objekt
 */
export function mapToGebaeude(data: any): Gebaeude {
  return {
    id: data.ID || data.Gebaeude_ID, // Changed from Objekt_ID
    firma_ID: data.Firma_ID,
    standort_ID: data.Standort_ID,
    bezeichnung: data.Bezeichnung || data.Gebaeude || '', // Changed from Objekt
    preis: toNumber(data.Preis),
    preis7Tage: toNumber(data.Preis7Tage),
    preisSonntag: toNumber(data.PreisSonntag),
    standort: data.Standort
      ? {
          id: data.Standort_ID,
          bezeichnung: data.Standort,
          adresse: data.Adresse || null,
          strasse: data.Strasse || null,
          plz: data.PLZ || null,
          ort: data.Ort || null,
          isActive: true,
        }
      : undefined,
  };
}

/**
 * Konvertiert eine Liste von Datenbankergebnissen in Gebaeude-Objekte
 * Renamed from mapToObjekte to match database structure
 *
 * @param dataList - Liste von Daten aus der Datenbank
 * @returns Liste von Gebaeude-Objekten
 */
export function mapToGebaeudeList(dataList: any[]): Gebaeude[] {
  if (!Array.isArray(dataList)) {
    return [];
  }

  return dataList.map(mapToGebaeude);
}

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
    Gebaeude_ID: data.Gebaeude_ID,
    Standort: data.Standort,
    Gebaeude: data.Gebaeude,
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
 * SQL-Abfrage für die Raumbuch-Auswertung (angepasst für neue Datenbankstruktur)
 */
const RAUMBUCH_QUERY = `
    SELECT Raumbuch.ID
         ,Raumbuch.Firma_ID
         ,Raumbuch.Standort_ID
         ,Raumbuch.Gebaeude_ID
         ,Standort.Bezeichnung Standort
         ,Raumbuch.Gebaeude
         ,Raumbuch.Raumnummer
         ,Raumbuch.Bereich
         ,Raumbuch.Gebaeudeteil
         ,Raumbuch.Etage
         ,Raumbuch.Bezeichnung
         ,Raumbuch.Reinigungsgruppe
         ,Raumbuch.Menge
         ,Raumbuch.MengeAktiv
         ,Raumbuch.MengeInAktiv
         ,Raumbuch.Einheit
         ,Raumbuch.Anzahl
         ,Raumbuch.Reinigungsintervall
         ,Raumbuch.ReinigungstageMonat
         ,Raumbuch.ReinigungstageJahr
         ,Raumbuch.LeistungStunde
         ,Raumbuch.LeistungStundeIst
         ,Raumbuch.Aufschlag
         ,Raumbuch.StundeTag
         ,Raumbuch.StundeMonat
         ,Raumbuch.MengeAktivMonat
         ,Raumbuch.VkWertNettoMonat
         ,Raumbuch.VkWertBruttoMonat
         ,Raumbuch.RgWertNettoMonat
         ,Raumbuch.RgWertBruttoMonat
         ,Raumbuch.ReinigungsTage
         ,Raumbuch.Reduzierung
         ,Raumbuch.Bemerkung
         ,Raumbuch.Bereich_ID
         ,Raumbuch.Gebaeudeteil_ID
         ,Raumbuch.Etage_ID
         ,Raumbuch.Reinigungsgruppe_ID
         ,Raumbuch.Einheit_ID
         ,Raumbuch.Reinigungsintervall_ID
         ,Raumbuch.ReinigungsTage_ID
         ,Raumbuch.LfdNr
         ,Raumbuch.xStatus
         ,Raumbuch.xDatum
         ,Raumbuch.xBenutzer
         ,Raumbuch.xVersion
    FROM BIRD.Raumbuch WITH (NOLOCK)
  INNER JOIN BIRD.Standort WITH (NOLOCK) ON Standort.ID = Standort_ID
    WHERE Gebaeude_ID = @gebaeude_ID
`;

/**
 * SQL-Abfrage für alle verfügbaren Standorte
 */
const STANDORTE_QUERY = `
    SELECT ID, Bezeichnung, Adresse, Strasse, PLZ, Ort
    FROM BIRD.Standort
    ORDER BY Bezeichnung
`;

/**
 * SQL-Abfrage für alle verfügbaren Gebäude (umbenannt von OBJEKTE_QUERY)
 */
const GEBAEUDE_QUERY = `
    SELECT Gebaeude.ID Gebaeude_ID
         ,Gebaeude.Firma_ID
         ,Gebaeude.Standort_ID
         ,Standort.Bezeichnung Standort
         ,Standort.Adresse
         ,Standort.Strasse
         ,Standort.PLZ
         ,Standort.Ort
         ,Gebaeude.Bezeichnung Gebaeude
         ,Gebaeude.Preis
         ,Gebaeude.Preis7Tage
         ,Gebaeude.PreisSonntag
    FROM BIRD.Gebaeude WITH (NOLOCK)
INNER JOIN BIRD.Standort WITH (NOLOCK) ON Standort.ID = Standort_ID
    ORDER BY Standort, Gebaeude
`;

/**
 * Ruft die Raumbuch-Daten für ein Gebäude ab
 * Renamed from getRaumbuchData to match database structure
 *
 * @param gebaeude_ID - ID des Gebäudes
 * @returns Liste der Raumbuch-Einträge
 */
export async function getRaumbuchData(gebaeude_ID: number = -1): Promise<RaumbuchEntry[]> {
  try {
    // Verwende die direkte SQL-Abfrage für komplexe Joins und Berechnungen
    const data = await executeQuery(RAUMBUCH_QUERY, { gebaeude_ID });
    return mapToRaumbuchEntries(data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Raumbuch-Daten:', error);
    return [];
  }
}

/**
 * Ruft alle verfügbaren Standorte ab
 *
 * @returns Liste der Standorte
 */
export async function getStandorte(): Promise<Standort[]> {
  try {
    const data = await executeQuery(STANDORTE_QUERY);
    return mapToStandorte(data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Standorte:', error);
    return [];
  }
}

/**
 * Ruft alle verfügbaren Gebäude ab
 * Renamed from getObjekte to match database structure
 *
 * @returns Liste der Gebäude
 */
export async function getGebaeude(): Promise<Gebaeude[]> {
  try {
    const data = await executeQuery(GEBAEUDE_QUERY);
    return mapToGebaeudeList(data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Gebäude:', error);
    return [];
  }
}

/**
 * Ruft einen Standort anhand seiner ID ab
 *
 * @param standort_ID - ID des Standorts
 * @returns Standort oder null, falls nicht gefunden
 */
export async function getStandortById(standort_ID: number): Promise<Standort | null> {
  try {
    const query = `SELECT ID, Bezeichnung, Adresse, Strasse, PLZ, Ort FROM BIRD.Standort WHERE ID = @standort_ID`;
    const data = await executeSingleQuery(query, { standort_ID });

    if (!data) {
      return null;
    }

    return mapToStandort(data);
  } catch (error) {
    console.error('Fehler beim Abrufen des Standorts:', error);
    return null;
  }
}

/**
 * Ruft ein Gebäude anhand seiner ID ab
 * Renamed from getObjektById to match database structure
 *
 * @param gebaeude_ID - ID des Gebäudes
 * @returns Gebäude oder null, falls nicht gefunden
 */
export async function getGebaeudeById(gebaeude_ID: number): Promise<Gebaeude | null> {
  try {
    const query = `
        SELECT Gebaeude.ID Gebaeude_ID
             ,Gebaeude.Firma_ID
             ,Gebaeude.Standort_ID
             ,Standort.Bezeichnung Standort
             ,Standort.Adresse
             ,Standort.Strasse
             ,Standort.PLZ
             ,Standort.Ort
             ,Gebaeude.Bezeichnung Gebaeude
             ,Gebaeude.Preis
             ,Gebaeude.Preis7Tage
             ,Gebaeude.PreisSonntag
        FROM BIRD.Gebaeude WITH (NOLOCK)
      INNER JOIN BIRD.Standort WITH (NOLOCK) ON Standort.ID = Standort_ID
        WHERE Gebaeude.ID = @gebaeude_ID
    `;
    const data = await executeSingleQuery(query, { gebaeude_ID });

    if (!data) {
      return null;
    }

    return mapToGebaeude(data);
  } catch (error) {
    console.error('Fehler beim Abrufen des Gebäudes:', error);
    return null;
  }
}

/**
 * Ruft einen Raumbuch-Eintrag anhand seiner ID ab
 *
 * @param id - ID des Raumbuch-Eintrags
 * @returns Raumbuch-Eintrag oder null, falls nicht gefunden
 */
export async function getRaumbuchEntryById(id: number): Promise<RaumbuchEntry | null> {
  try {
    const query = `
        SELECT Raumbuch.ID
             ,Raumbuch.Firma_ID
             ,Raumbuch.Standort_ID
             ,Raumbuch.Gebaeude_ID
             ,Standort.Bezeichnung Standort
             ,Raumbuch.Gebaeude
             ,Raumbuch.Raumnummer
             ,Raumbuch.Bereich
             ,Raumbuch.Gebaeudeteil
             ,Raumbuch.Etage
             ,Raumbuch.Bezeichnung
             ,Raumbuch.Reinigungsgruppe
             ,Raumbuch.Menge
             ,Raumbuch.MengeAktiv
             ,Raumbuch.MengeInAktiv
             ,Raumbuch.Einheit
             ,Raumbuch.Anzahl
             ,Raumbuch.Reinigungsintervall
             ,Raumbuch.ReinigungstageMonat
             ,Raumbuch.ReinigungstageJahr
             ,Raumbuch.LeistungStunde
             ,Raumbuch.LeistungStundeIst
             ,Raumbuch.Aufschlag
             ,Raumbuch.StundeTag
             ,Raumbuch.StundeMonat
             ,Raumbuch.MengeAktivMonat
             ,Raumbuch.VkWertNettoMonat
             ,Raumbuch.VkWertBruttoMonat
             ,Raumbuch.RgWertNettoMonat
             ,Raumbuch.RgWertBruttoMonat
             ,Raumbuch.ReinigungsTage
             ,Raumbuch.Reduzierung
             ,Raumbuch.Bemerkung
             ,Raumbuch.Bereich_ID
             ,Raumbuch.Gebaeudeteil_ID
             ,Raumbuch.Etage_ID
             ,Raumbuch.Reinigungsgruppe_ID
             ,Raumbuch.Einheit_ID
             ,Raumbuch.Reinigungsintervall_ID
             ,Raumbuch.ReinigungsTage_ID
             ,Raumbuch.LfdNr
             ,Raumbuch.xStatus
             ,Raumbuch.xDatum
             ,Raumbuch.xBenutzer
             ,Raumbuch.xVersion
        FROM BIRD.Raumbuch WITH (NOLOCK)
      INNER JOIN BIRD.Standort WITH (NOLOCK) ON Standort.ID = Standort_ID
        WHERE Raumbuch.ID = @id
    `;
    const data = await executeSingleQuery(query, { id });

    if (!data) {
      return null;
    }

    return mapToRaumbuchEntry(data);
  } catch (error) {
    console.error('Fehler beim Abrufen des Raumbuch-Eintrags:', error);
    return null;
  }
}
