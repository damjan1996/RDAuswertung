/**
 * Service für Datenbankabfragen
 * Implementiert spezifische Abfragen für die Anwendung
 */

import { DEFAULT_STANDORT_ID } from '@/config/database';
import { prisma } from '@/lib/db';
import { toNumber } from '@/lib/formatters';
import {
  calculateDerivedValues,
  mapToRaumbuchEntries,
  mapToRaumbuchEntry,
} from '@/models/raumbuch';

import { executeQuery, executeSingleQuery } from './client';

import type { RaumbuchRow } from '@/types/raumbuch.types';
import type { Standort, StandortRow } from '@/types/standort.types';

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
    preis: toNumber(data.Preis),
    preis7Tage: toNumber(data.Preis7Tage),
    strasse: data.Strasse || null,
    hausnummer: data.Hausnummer || null,
    plz: data.PLZ || null,
    ort: data.Ort || null,
    isActive: Boolean(data.IsActive),
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
 * SQL-Abfrage für die Raumbuch-Auswertung
 */
const RAUMBUCH_QUERY = `
    SELECT
        Raumbuch.ID
         ,Raumbuch.Raumnummer
         ,Bereich.Bezeichnung Bereich
         ,Gebaeudeteil.Bezeichnung Gebaeudeteil
         ,Etage.Bezeichnung Etage
         ,Raumbuch.Bezeichnung
         ,Reinigungsgruppe.Bezeichnung RG
         ,Raumbuch.qm
         ,Raumbuch.Anzahl
         ,Reinigungsintervall.Bezeichnung Intervall
         ,ReinigungsintervallTage.Reinigungstage RgJahr
         ,ROUND(ReinigungsintervallTage.Reinigungstage * 4.33333 / 52,2) RgMonat
         ,ROUND(Raumbuch.qm * ReinigungsintervallTage.Reinigungstage * 4.33333 / 52,2) qmMonat
         ,CASE WHEN Raumbuch.Anzahl = 7 THEN ROUND((Raumbuch.qm / Raumbuch.qmStunde * ReinigungsintervallTage.Reinigungstage * Standort.Preis7Tage ) / 12,2) ELSE ROUND((Raumbuch.qm / Raumbuch.qmStunde * ReinigungsintervallTage.Reinigungstage * Standort.Preis ) / 12,2) END WertMonat
         ,ROUND(Raumbuch.qm/Raumbuch.qmStunde,3) StundenTag
         ,ROUND(ROUND(ReinigungsintervallTage.Reinigungstage * 4.33333 / 52,2) * ROUND(Raumbuch.qm/Raumbuch.qmStunde,3),2) StundenMonat
         ,CASE WHEN Raumbuch.Anzahl = 7 THEN ROUND((Raumbuch.qm / Raumbuch.qmStunde * ReinigungsintervallTage.Reinigungstage * Standort.Preis7Tage ) / 12,2) * 12 ELSE ROUND((Raumbuch.qm / Raumbuch.qmStunde * ReinigungsintervallTage.Reinigungstage * Standort.Preis ) / 12,2) * 12 END WertJahr
         ,Raumbuch.qmStunde
         ,ReinigungsTage.Bezeichnung Reinigungstage
         ,Raumbuch.Bemerkung
         ,Raumbuch.Reduzierung
    FROM BIRD.Raumbuch WITH (NOLOCK)
INNER JOIN BIRD.Standort WITH (NOLOCK) ON Standort.ID = Raumbuch.Standort_ID
        INNER JOIN BIRD.Bereich WITH (NOLOCK) ON Bereich.ID = Raumbuch.Bereich_ID AND Bereich.Standort_ID = Raumbuch.Standort_ID
        INNER JOIN BIRD.Gebaeudeteil WITH (NOLOCK) ON Gebaeudeteil.ID = Raumbuch.Gebaeudeteil_ID AND Gebaeudeteil.Standort_ID = Raumbuch.Standort_ID
        INNER JOIN BIRD.Etage WITH (NOLOCK) ON Etage.ID = Raumbuch.Etage_ID  AND Etage.Standort_ID = Raumbuch.Standort_ID
        INNER JOIN BIRD.Reinigungsgruppe WITH (NOLOCK) ON Reinigungsgruppe.ID = Raumbuch.Reinigungsgruppe_ID
        INNER JOIN BIRD.Reinigungsintervall WITH (NOLOCK) ON Reinigungsintervall.ID = Raumbuch.Reinigungsintervall_ID
        LEFT OUTER JOIN BIRD.ReinigungsTage WITH (NOLOCK) ON ReinigungsTage.ID = Raumbuch.ReinigungsTage_ID
        LEFT OUTER JOIN BIRD.ReinigungsintervallTage WITH (NOLOCK) ON ReinigungsintervallTage.Reinigungsintervall_ID = Raumbuch.Reinigungsintervall_ID
        AND ReinigungsintervallTage.Anzahl = Raumbuch.Anzahl
    WHERE Raumbuch.Standort_ID = @standortId
    ORDER BY
        Gebaeudeteil.Bezeichnung
            ,Etage.Bezeichnung
            ,Bereich.Bezeichnung
            ,Raumbuch.Raumnummer
            ,Raumbuch.Bezeichnung
`;

/**
 * SQL-Abfrage für alle verfügbaren Standorte
 */
const STANDORTE_QUERY = `
    SELECT ID, Bezeichnung, Preis, Preis7Tage
    FROM BIRD.Standort
    ORDER BY Bezeichnung
`;

/**
 * Ruft die Raumbuch-Daten für einen Standort ab
 *
 * @param standortId - ID des Standorts
 * @returns Liste der Raumbuch-Einträge
 */
export async function getRaumbuchData(
  standortId: number = DEFAULT_STANDORT_ID
): Promise<RaumbuchEntry[]> {
  try {
    // Verwende die direkte SQL-Abfrage für komplexe Joins und Berechnungen
    const data = await executeQuery(RAUMBUCH_QUERY, { standortId });
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
 * Ruft einen Standort anhand seiner ID ab
 *
 * @param standortId - ID des Standorts
 * @returns Standort oder null, falls nicht gefunden
 */
export async function getStandortById(standortId: number): Promise<Standort | null> {
  try {
    const query = `SELECT ID, Bezeichnung, Preis, Preis7Tage FROM BIRD.Standort WHERE ID = @standortId`;
    const data = await executeSingleQuery(query, { standortId });

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
 * Ruft einen Raumbuch-Eintrag anhand seiner ID ab
 *
 * @param id - ID des Raumbuch-Eintrags
 * @returns Raumbuch-Eintrag oder null, falls nicht gefunden
 */
export async function getRaumbuchEntryById(id: number): Promise<RaumbuchEntry | null> {
  try {
    // Verwenden Sie Prisma für einfache Abfragen
    const entry = await prisma.raumbuch.findUnique({
      where: { id },
      include: {
        standort: true,
        bereich: true,
        gebaeudeteil: true,
        etage: true,
        reinigungsgruppe: true,
        reinigungsintervall: true,
        reinigungsTage: true,
      },
    });

    if (!entry) {
      return null;
    }

    // Für tiefere Transformationen müssten hier weitere Schritte erfolgen
    // Dies ist ein vereinfachter Ansatz
    const basicEntry = {
      ID: entry.id,
      Raumnummer: entry.raumnummer || '',
      Bereich: entry.bereich.bezeichnung,
      Gebaeudeteil: entry.gebaeudeteil.bezeichnung,
      Etage: entry.etage.bezeichnung,
      Bezeichnung: entry.bezeichnung || '',
      RG: entry.reinigungsgruppe.bezeichnung,
      qm: entry.qm,
      Anzahl: entry.anzahl,
      Intervall: entry.reinigungsintervall.bezeichnung,
      qmStunde: entry.qmStunde,
      Reinigungstage: entry.reinigungsTage?.bezeichnung || '',
      Bemerkung: entry.bemerkung || '',
      Reduzierung: entry.reduzierung || '',
    };

    // Berechnete Werte hinzufügen
    return calculateDerivedValues(
      basicEntry,
      entry.standort.preis.toNumber(),
      entry.standort.preis7Tage.toNumber()
    );
  } catch (error) {
    console.error('Fehler beim Abrufen des Raumbuch-Eintrags:', error);
    return null;
  }
}
