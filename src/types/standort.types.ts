/**
 * Type definitions for Standort (location) data
 */
import { BaseEntity } from './database.types';

/**
 * Interface representing a Standort (location)
 */
export interface Standort extends BaseEntity {
  bezeichnung: string;
  adresse: string | null;
  strasse: string | null;
  plz: string | null;
  ort: string | null;
  isActive: boolean;
}

/**
 * Interface representing a Gebaeude (building)
 * Renamed from Objekt to match database structure
 */
export interface Gebaeude extends BaseEntity {
  firma_ID: number;
  standort_ID: number;
  bezeichnung: string;
  preis: number;
  preis7Tage: number;
  preisSonntag: number;
  standort?: Standort;
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
 * Type for Gebaeude selection options in dropdown menus
 * Renamed from ObjektOption to match database structure
 */
export interface GebaeudeOption {
  id: number;
  bezeichnung: string;
  standort_ID: number;
  standort: string;
}

/**
 * Filter options specific to Standort
 */
export interface StandortFilter {
  bezeichnung?: string;
}

/**
 * Raw database row for Standort data (before conversion to Standort interface)
 */
export interface StandortRow {
  ID: number;
  Bezeichnung: string;
  Adresse: string | null;
  Strasse: string | null;
  PLZ: string | null;
  Ort: string | null;
}

/**
 * Raw database row for Gebaeude data (before conversion to Gebaeude interface)
 * Renamed from ObjektRow to match database structure
 */
export interface GebaeudeRow {
  Gebaeude_ID: number; // Changed from Objekt_ID
  Firma_ID: number;
  Standort_ID: number;
  Standort: string;
  Adresse: string | null;
  Strasse: string | null;
  PLZ: string | null;
  Ort: string | null;
  Gebaeude: string; // Changed from Objekt
  Preis: number | null;
  Preis7Tage: number | null;
  PreisSonntag: number | null;
}
