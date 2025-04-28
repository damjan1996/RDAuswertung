// C:\Development\RDAuswertung\src\app\api\raumbuch\[id]\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  calculateSummary,
  prepareDataForVisualization,
} from '@/services/analysis/raumbuch-analysis';
import { getRaumbuchData } from '@/services/database/queries';

// Validate ID parameter
const paramsSchema = z.object({
  id: z
    .string()
    .min(1)
    .refine(val => !isNaN(Number(val)), {
      message: 'ID must be a valid number',
    }),
});

// Filter query parameters schema
const filterSchema = z.object({
  bereich: z.string().optional(),
  gebaeudeteil: z.string().optional(),
  etage: z.string().optional(),
  reinigungsgruppe: z.string().optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate gebaeude ID
    const validatedParams = paramsSchema.safeParse({ id: params.id });
    if (!validatedParams.success) {
      return NextResponse.json({ error: 'Invalid gebaeude ID' }, { status: 400 });
    }

    const gebaeude_ID = Number(params.id); // Changed from objekt_ID

    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const filterParams = {
      bereich: searchParams.get('bereich') || undefined,
      gebaeudeteil: searchParams.get('gebaeudeteil') || undefined,
      etage: searchParams.get('etage') || undefined,
      reinigungsgruppe: searchParams.get('reinigungsgruppe') || undefined,
    };

    // Validate filter parameters
    const validatedFilters = filterSchema.safeParse(filterParams);
    if (!validatedFilters.success) {
      return NextResponse.json({ error: 'Invalid filter parameters' }, { status: 400 });
    }

    // Get raumbuch data
    let raumbuchData = await getRaumbuchData(gebaeude_ID);

    // Apply filters if provided
    const filters = validatedFilters.data;

    if (filters.bereich) {
      raumbuchData = raumbuchData.filter(item => item.Bereich === filters.bereich);
    }

    if (filters.gebaeudeteil) {
      raumbuchData = raumbuchData.filter(item => item.Gebaeudeteil === filters.gebaeudeteil);
    }

    if (filters.etage) {
      raumbuchData = raumbuchData.filter(item => item.Etage === filters.etage);
    }

    if (filters.reinigungsgruppe) {
      raumbuchData = raumbuchData.filter(
        item => item.Reinigungsgruppe === filters.reinigungsgruppe
      );
    }

    // Calculate summary data
    const summary = calculateSummary(raumbuchData);

    // Prepare visualization data
    const visualizationData = prepareDataForVisualization(raumbuchData);

    // Create filter options for the frontend
    const filterOptions = {
      bereiche: [...new Set(raumbuchData.map(item => item.Bereich))].filter(Boolean).sort(),
      gebaeudeteil: [...new Set(raumbuchData.map(item => item.Gebaeudeteil))]
        .filter(Boolean)
        .sort(),
      etage: [...new Set(raumbuchData.map(item => item.Etage))].filter(Boolean).sort(),
      reinigungsgruppe: [...new Set(raumbuchData.map(item => item.Reinigungsgruppe))]
        .filter(Boolean)
        .sort(),
    };

    return NextResponse.json({
      data: raumbuchData,
      summary,
      visualizationData,
      filterOptions,
    });
  } catch (error) {
    console.error('Error fetching raumbuch data:', error);
    return NextResponse.json({ error: 'Failed to fetch raumbuch data' }, { status: 500 });
  }
}
