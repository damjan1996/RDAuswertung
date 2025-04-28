// C:\Development\RDAuswertung\src\app\export\pdf\[id]\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  calculateSummary,
  prepareDataForVisualization,
} from '@/services/analysis/raumbuch-analysis';
import { getGebaeudeById, getRaumbuchData } from '@/services/database/queries';
import { generatePdf } from '@/services/export/pdf-export';

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

    // Get gebaeude details to include the name in the PDF
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

    // Prepare visualization data
    const visualizationData = prepareDataForVisualization(raumbuchData);

    // Generate PDF
    const pdfBuffer = await generatePdf(raumbuchData, gebaeude.bezeichnung, {
      summary,
      visualizationData,
    });

    // Set filename based on gebaeude name
    const filename = `Raumbuch_${gebaeude.bezeichnung.replace(/[^a-z0-9]/gi, '_')}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;

    // Return the PDF file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';
