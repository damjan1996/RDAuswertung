// C:\Development\RDAuswertung\src\app\export\excel\[id]\route.ts

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

    // Get gebaeude details to include the name in the Excel file
    const gebaeude = await getGebaeudeById(gebaeude_ID); // Changed from getObjektById
    if (!gebaeude) {
      return NextResponse.json({ error: 'Gebäude not found' }, { status: 404 });
    }

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

    // Generate Excel
    const excelBuffer = await generateExcel(raumbuchData, gebaeude.bezeichnung, summary);

    // Set filename based on gebaeude name
    const filename = `Raumbuch_${gebaeude.bezeichnung.replace(/[^a-z0-9]/gi, '_')}_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    // Return the Excel file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json({ error: 'Failed to generate Excel' }, { status: 500 });
  }
}

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';
