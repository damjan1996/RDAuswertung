/**
 * Zod-Schemas für die Standort-Entität
 */
import { z } from 'zod';

/**
 * Schema für einen Standort
 */
export const standortSchema = z.object({
  ID: z.number().int().positive(),
  Bezeichnung: z.string().min(1, 'Bezeichnung ist erforderlich'),
  Preis: z.number().nonnegative('Preis muss positiv sein'),
  Preis7Tage: z.number().nonnegative('Preis7Tage muss positiv sein'),
});

/**
 * Schema für die Erstellung eines neuen Standorts
 */
export const createStandortSchema = standortSchema.omit({ ID: true });

/**
 * Schema für die Aktualisierung eines bestehenden Standorts
 */
export const updateStandortSchema = createStandortSchema.partial();

/**
 * Schema für Standort-Filter
 */
export const standortFilterSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(['id', 'bezeichnung']).optional().default('bezeichnung'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});

/**
 * Schema für die Standort-Details-Anfrage-Parameter
 */
export const standortParamsSchema = z.object({
  id: z
    .string()
    .refine(val => !isNaN(Number(val)), {
      message: 'ID muss eine Zahl sein',
    })
    .transform(val => parseInt(val, 10)),
});

/**
 * Schema für die Standort-Liste-Antwort
 */
export const standorteResponseSchema = z.object({
  data: z.array(standortSchema),
  meta: z.object({
    totalCount: z.number().int().nonnegative(),
    filteredCount: z.number().int().nonnegative(),
    limit: z.number().int().positive().nullable(),
    offset: z.number().int().nonnegative(),
  }),
});

/**
 * Typen basierend auf den Schemas
 */
export type StandortSchema = z.infer<typeof standortSchema>;
export type CreateStandortSchema = z.infer<typeof createStandortSchema>;
export type UpdateStandortSchema = z.infer<typeof updateStandortSchema>;
export type StandortFilterSchema = z.infer<typeof standortFilterSchema>;
export type StandortParamsSchema = z.infer<typeof standortParamsSchema>;
export type StandorteResponseSchema = z.infer<typeof standorteResponseSchema>;
