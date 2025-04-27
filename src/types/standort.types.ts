/**
 * Type definitions for Standort (location) data
 */
import { BaseEntity } from './database.types';

/**
 * Interface representing a Standort (location)
 */
export interface Standort extends BaseEntity {
  bezeichnung: string;
  preis: number;
  preis7Tage: number;
  strasse?: string | null;
  hausnummer?: string | null;
  plz?: string | null;
  ort?: string | null;
  isActive: boolean;
}

/**
 * Type for creating a new Standort
 */
export type StandortCreate = Omit<Standort, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Type for updating an existing Standort
 */
export type StandortUpdate = Partial<StandortCreate>;

/**
 * Type for Standort selection options in dropdown menus
 */
export interface StandortOption {
  id: number;
  bezeichnung: string;
}

/**
 * Filter options specific to Standort
 */
export interface StandortFilter {
  bezeichnung?: string;
  isActive?: boolean;
}

/**
 * Raw database row for Standort data (before conversion to Standort interface)
 */
export interface StandortRow {
  ID: number;
  Bezeichnung: string;
  Preis: number;
  Preis7Tage: number;
  Strasse?: string | null;
  Hausnummer?: string | null;
  PLZ?: string | null;
  Ort?: string | null;
  IsActive: boolean | number;
}

/**
 * Summary statistics for a Standort
 */
export interface StandortSummary {
  totalBereich: number;
  totalGebaeudeteil: number;
  totalEtage: number;
  totalReinigungsgruppen: number;
  totalRaumbuchEntries: number;
}

/**
 * Bereich (area) related to a Standort
 */
export interface Bereich extends BaseEntity {
  bezeichnung: string;
  standortId: number;
}

/**
 * Gebaeudeteil (building part) related to a Standort
 */
export interface Gebaeudeteil extends BaseEntity {
  bezeichnung: string;
  standortId: number;
}

/**
 * Etage (floor) related to a Standort
 */
export interface Etage extends BaseEntity {
  bezeichnung: string;
  standortId: number;
}

/**
 * Reinigungsgruppe (cleaning group) settings
 */
export interface Reinigungsgruppe extends BaseEntity {
  bezeichnung: string;
}

/**
 * Reinigungsintervall (cleaning interval) settings
 */
export interface Reinigungsintervall extends BaseEntity {
  bezeichnung: string;
}

/**
 * Raw database rows for related entities
 */
export interface BereichRow {
  ID: number;
  Bezeichnung: string;
  Standort_ID: number;
}

export interface GebaeudeTeilRow {
  ID: number;
  Bezeichnung: string;
  Standort_ID: number;
}

export interface EtageRow {
  ID: number;
  Bezeichnung: string;
  Standort_ID: number;
}

export interface ReinigungsgruppeRow {
  ID: number;
  Bezeichnung: string;
}

export interface ReinigungsintervallRow {
  ID: number;
  Bezeichnung: string;
}
