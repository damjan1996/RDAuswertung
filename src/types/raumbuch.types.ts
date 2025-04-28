// src/types/raumbuch.types.ts
/**
 * Type definitions for Raumbuch (room book) data
 */
import { BaseEntity } from './database.types';

/**
 * Raw database row for Raumbuch data (matches database column names exactly)
 */
export interface RaumbuchRow {
  ID: number;
  Firma_ID: number;
  Standort_ID: number;
  Gebaeude_ID: number; // Changed from Objekt_ID to match database
  Standort: string | null;
  Gebaeude: string | null; // Changed from Objekt to match database
  Raumnummer: string | null;
  Bereich: string | null;
  Gebaeudeteil: string | null;
  Etage: string | null;
  Bezeichnung: string | null;
  Reinigungsgruppe: string | null;
  Menge: number | null;
  MengeAktiv: number | null;
  MengeInAktiv: number | null;
  Einheit: string | null;
  Anzahl: number | null;
  Reinigungsintervall: string | null;
  ReinigungstageMonat: number | null;
  ReinigungstageJahr: number | null;
  LeistungStunde: number | null;
  LeistungStundeIst: number | null;
  Aufschlag: number | null;
  StundeTag: number | null;
  StundeMonat: number | null;
  MengeAktivMonat: number | null;
  VkWertNettoMonat: number | null;
  VkWertBruttoMonat: number | null;
  RgWertNettoMonat: number | null;
  RgWertBruttoMonat: number | null;
  ReinigungsTage: string | null;
  Reduzierung: string | null;
  Bemerkung: string | null;
  Bereich_ID: number;
  Gebaeudeteil_ID: number;
  Etage_ID: number;
  Reinigungsgruppe_ID: number;
  Einheit_ID: number | null;
  Reinigungsintervall_ID: number | null;
  ReinigungsTage_ID: number | null;
  LfdNr: number | null;
  xStatus: number | null;
  xDatum: Date | null;
  xBenutzer: string | null;
  xVersion: number | null;
}

/**
 * Interface representing a Raumbuch entry (used in application code)
 */
export interface Raumbuch extends BaseEntity {
  firma_ID: number;
  standort_ID: number;
  gebaeude_ID: number; // Changed from objekt_ID to match database
  standort: string | null;
  gebaeude: string | null; // Changed from objekt to match database
  raumnummer: string | null;
  bereich: string | null;
  gebaeudeteil: string | null;
  etage: string | null;
  bezeichnung: string | null;
  reinigungsgruppe: string | null;
  menge: number;
  mengeAktiv: number;
  mengeInAktiv: number;
  einheit: string | null;
  anzahl: number;
  reinigungsintervall: string | null;
  reinigungstageMonat: number;
  reinigungstageJahr: number;
  leistungStunde: number;
  leistungStundeIst: number;
  aufschlag: number;
  stundeTag: number;
  stundeMonat: number;
  mengeAktivMonat: number;
  vkWertNettoMonat: number;
  vkWertBruttoMonat: number;
  rgWertNettoMonat: number;
  rgWertBruttoMonat: number;
  reinigungsTage: string | null;
  reduzierung: string | null;
  bemerkung: string | null;
  bereich_ID: number;
  gebaeudeteil_ID: number;
  etage_ID: number;
  reinigungsgruppe_ID: number;
  einheit_ID: number | null;
  reinigungsintervall_ID: number | null;
  reinigungsTage_ID: number | null;
  lfdNr: number | null;
  xStatus: number | null;
  xDatum: Date | null;
  xBenutzer: string | null;
  xVersion: number | null;
}

/**
 * Type for creating a new Raumbuch entry
 */
export type RaumbuchCreate = Omit<Raumbuch, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Type for updating an existing Raumbuch entry
 */
export type RaumbuchUpdate = Partial<RaumbuchCreate>;

/**
 * Filter options specific to Raumbuch
 */
export interface RaumbuchFilter {
  bereich?: string;
  gebaeudeteil?: string;
  etage?: string;
  reinigungsgruppe?: string;
  standort_ID?: number;
  gebaeude_ID?: number; // Changed from objekt_ID to match database
}

/**
 * Summary statistics for Raumbuch data
 */
export interface RaumbuchSummary {
  totalRooms: number;
  totalMenge: number;
  totalMengeAktivMonat: number;
  totalVkWertNettoMonat: number;
  totalVkWertBruttoMonat: number;
  totalRgWertNettoMonat: number;
  totalRgWertBruttoMonat: number;
  totalStundenMonat: number;
  bereichStats?: BereichStat[];
  rgStats?: RgStat[];
}

/**
 * Statistics by Bereich (area)
 */
export interface BereichStat {
  bereich: string;
  menge: number;
  vkWertNettoMonat: number;
  vkWertBruttoMonat: number;
  stundenMonat: number;
}

/**
 * Statistics by Reinigungsgruppe (cleaning group)
 */
export interface RgStat {
  reinigungsgruppe: string;
  menge: number;
  vkWertNettoMonat: number;
  vkWertBruttoMonat: number;
  stundenMonat: number;
}

/**
 * Visualization data for charts
 */
export interface VisualizationData {
  bereichData?: Record<string, number>;
  rgData?: Record<string, number>;
  etageData?: Record<string, number>;
}

/**
 * Export format options
 */
export enum ExportFormat {
  Excel = 'excel',
  PDF = 'pdf',
  CSV = 'csv',
}

/**
 * Response from exporting Raumbuch data
 */
export interface ExportResponse {
  fileName: string;
  fileUrl: string;
  format: ExportFormat;
}
