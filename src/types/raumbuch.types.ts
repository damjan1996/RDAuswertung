/**
 * Type definitions for Raumbuch (room book) data
 */
import { BaseEntity } from './database.types';

/**
 * Interface representing a Raumbuch entry
 */
export interface Raumbuch extends BaseEntity {
  raumnummer: string | null;
  bereich: string | null;
  gebaeudeteil: string | null;
  etage: string | null;
  bezeichnung: string | null;
  rg: string | null; // Reinigungsgruppe
  qm: number;
  anzahl: number;
  intervall: string | null;
  rgJahr: number;
  rgMonat: number;
  qmMonat: number;
  wertMonat: number;
  stundenTag: number;
  stundenMonat: number;
  wertJahr: number;
  qmStunde: number;
  reinigungstage: string | null;
  bemerkung: string | null;
  reduzierung: string | null;
  standortId: number;
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
  rg?: string;
  standortId?: number;
}

/**
 * Summary statistics for Raumbuch data
 */
export interface RaumbuchSummary {
  totalRooms: number;
  totalQm: number;
  totalQmMonat: number;
  totalWertMonat: number;
  totalWertJahr: number;
  totalStundenMonat: number;
  bereichStats?: BereichStat[];
  rgStats?: RgStat[];
}

/**
 * Statistics by Bereich (area)
 */
export interface BereichStat {
  bereich: string;
  qm: number;
  wertMonat: number;
  wertJahr: number;
  stundenMonat: number;
}

/**
 * Statistics by Reinigungsgruppe (cleaning group)
 */
export interface RgStat {
  rg: string;
  qm: number;
  wertMonat: number;
  wertJahr: number;
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

/**
 * Raw database row for Raumbuch data (before conversion to Raumbuch interface)
 */
export interface RaumbuchRow {
  ID: number;
  Raumnummer: string | null;
  Bereich: string | null;
  Gebaeudeteil: string | null;
  Etage: string | null;
  Bezeichnung: string | null;
  RG: string | null;
  qm: number | null;
  Anzahl: number | null;
  Intervall: string | null;
  RgJahr: number | null;
  RgMonat: number | null;
  qmMonat: number | null;
  WertMonat: number | null;
  StundenTag: number | null;
  StundenMonat: number | null;
  WertJahr: number | null;
  qmStunde: number | null;
  Reinigungstage: string | null;
  Bemerkung: string | null;
  Reduzierung: string | null;
  Standort_ID: number;
}
