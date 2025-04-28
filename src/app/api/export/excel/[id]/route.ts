// C:\Development\RDAuswertung\src\app\api\export\excel\[id]\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { calculateSummary } from '@/services/analysis/raumbuch-analysis';
import { getGebaeudeById, getRaumbuchData } from '@/services/database/queries';
import { generateExcel } from '@/services/export/excel-export';

// Validate ID parameter
const paramsSchema = z.object({
  id: z
    .string()
    .min(1)
    .refine(val => !isNaN(Number(val)), {
      message: 'ID must be a valid number',
    }),
});

// Apply query parameters schema for filtering
const querySchema = z.object({
  bereich: z.string().optional(),
  gebaeudeteil: z.string().optional(),
  etage: z.string().optional(),
  reinigungsgruppe: z.string().optional(), // Geändert von "rg" zu "reinigungsgruppe"
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate gebaeude ID
    const validatedParams = paramsSchema.safeParse({ id: params.id });
    if (!validatedParams.success) {
      return NextResponse.json({ error: 'Invalid gebaeude ID' }, { status: 400 });
    }

    const gebaeudeId = Number(params.id); // Geändert von standortId zu gebaeudeId

    // Validate query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      bereich: searchParams.get('bereich') || undefined,
      gebaeudeteil: searchParams.get('gebaeudeteil') || undefined,
      etage: searchParams.get('etage') || undefined,
      reinigungsgruppe: searchParams.get('reinigungsgruppe') || undefined, // Geändert von "rg" zu "reinigungsgruppe"
    };

    const validatedQuery = querySchema.safeParse(queryParams);
    if (!validatedQuery.success) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }

    // Get gebaeude information
    const gebaeude = await getGebaeudeById(gebaeudeId); // Geändert von getStandortById zu getGebaeudeById
    if (!gebaeude) {
      return NextResponse.json({ error: 'Gebaeude not found' }, { status: 404 });
    }

    // Get raumbuch data with filters
    let raumbuchData = await getRaumbuchData(gebaeudeId);

    // Apply filters if any are provided
    const filters = validatedQuery.success ? validatedQuery.data : {};
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
      ); // Geändert von "RG" zu "Reinigungsgruppe"
    }

    // Calculate summary for Excel sheets
    const summary = calculateSummary(raumbuchData);

    // Generate Excel file
    const excelBuffer = await generateExcel(raumbuchData, gebaeude.bezeichnung, summary);

    // Set response headers
    const filename = `Raumbuch_Auswertung_${gebaeude.bezeichnung}_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Excel export error:', error);
    return NextResponse.json({ error: 'Failed to generate Excel file' }, { status: 500 });
  }
}
