/**
 * Zod-Schemas für die Raumbuch-Entität
 */
import { z } from 'zod';

/**
 * Schema für die Filter-Parameter
 */
export const raumbuchFilterSchema = z.object({
  bereich: z.string().optional(),
  gebaeudeteil: z.string().optional(),
  etage: z.string().optional(),
  rg: z.string().optional(),
});

/**
 * Schema für Paginierungsparameter
 */
export const paginationSchema = z.object({
  limit: z.number().min(1).optional(),
  offset: z.number().min(0).optional(),
});

/**
 * Schema für Sortieroption
 */
export const sortOptionSchema = z.object({
  sortBy: z
    .enum([
      'Raumnummer',
      'Bereich',
      'Gebaeudeteil',
      'Etage',
      'Bezeichnung',
      'RG',
      'qm',
      'WertMonat',
      'StundenMonat',
    ])
    .optional()
    .default('Raumnummer'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

/**
 * Schema für die kombinierte Abfrage
 */
export const raumbuchQuerySchema = z.object({
  standortId: z.number().int().positive(),
  filter: raumbuchFilterSchema.optional(),
  pagination: paginationSchema.optional(),
  sort: sortOptionSchema.optional(),
});

/**
 * Schema für die Basisdaten eines Raumbuch-Eintrags
 */
export const raumbuchBaseSchema = z.object({
  Raumnummer: z.string().optional().nullable(),
  Bereich: z.string().min(1, 'Bereich ist erforderlich'),
  Gebaeudeteil: z.string().min(1, 'Gebäudeteil ist erforderlich'),
  Etage: z.string().min(1, 'Etage ist erforderlich'),
  Bezeichnung: z.string().optional().nullable(),
  RG: z.string().min(1, 'Reinigungsgruppe ist erforderlich'),
  qm: z.number().nonnegative('qm muss positiv sein'),
  Anzahl: z.number().int().nonnegative('Anzahl muss positiv sein'),
  Intervall: z.string().min(1, 'Intervall ist erforderlich'),
  qmStunde: z.number().positive('qmStunde muss größer als 0 sein'),
  Reinigungstage: z.string().optional().nullable(),
  Bemerkung: z.string().optional().nullable(),
  Reduzierung: z.string().optional().nullable(),
});

/**
 * Schema für einen vollständigen Raumbuch-Eintrag (inkl. berechneter Werte)
 */
export const raumbuchSchema = raumbuchBaseSchema.extend({
  ID: z.number().int().positive(),
  RgJahr: z.number().nonnegative(),
  RgMonat: z.number().nonnegative(),
  qmMonat: z.number().nonnegative(),
  WertMonat: z.number().nonnegative(),
  StundenTag: z.number().nonnegative(),
  StundenMonat: z.number().nonnegative(),
  WertJahr: z.number().nonnegative(),
});

/**
 * Schema für die Zusammenfassung der Raumbuch-Daten
 */
export const raumbuchSummarySchema = z.object({
  total_rooms: z.number().int().nonnegative(),
  total_qm: z.number().nonnegative(),
  total_qm_monat: z.number().nonnegative(),
  total_wert_monat: z.number().nonnegative(),
  total_wert_jahr: z.number().nonnegative(),
  total_stunden_monat: z.number().nonnegative(),
  bereich_stats: z
    .array(
      z.object({
        Bereich: z.string(),
        qm: z.number().nonnegative(),
        WertMonat: z.number().nonnegative(),
        WertJahr: z.number().nonnegative(),
        StundenMonat: z.number().nonnegative(),
      })
    )
    .optional(),
  rg_stats: z
    .array(
      z.object({
        RG: z.string(),
        qm: z.number().nonnegative(),
        WertMonat: z.number().nonnegative(),
        WertJahr: z.number().nonnegative(),
        StundenMonat: z.number().nonnegative(),
      })
    )
    .optional(),
});

/**
 * Schema für Filteroptionen in der Benutzeroberfläche
 */
export const filterOptionsSchema = z.object({
  bereiche: z.array(z.string()),
  gebaeudeteil: z.array(z.string()),
  etage: z.array(z.string()),
  rg: z.array(z.string()),
});

/**
 * Schema für die Visualisierungsdaten
 */
export const visualizationDataSchema = z.object({
  bereich_data: z.record(z.string(), z.number()).optional(),
  rg_data: z.record(z.string(), z.number()).optional(),
  etage_data: z.record(z.string(), z.number()).optional(),
});

/**
 * Typ für einen RaumbuchEntry basierend auf dem Schema
 */
export type RaumbuchEntrySchema = z.infer<typeof raumbuchSchema>;

/**
 * Typ für einen FilterOptions basierend auf dem Schema
 */
export type FilterOptionsSchema = z.infer<typeof filterOptionsSchema>;

/**
 * Typ für die RaumbuchSummary basierend auf dem Schema
 */
export type RaumbuchSummarySchema = z.infer<typeof raumbuchSummarySchema>;

/**
 * Typ für die VisualizationData basierend auf dem Schema
 */
export type VisualizationDataSchema = z.infer<typeof visualizationDataSchema>;
