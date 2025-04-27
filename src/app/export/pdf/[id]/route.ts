// C:\Development\RDAuswertung\src\app\export\pdf\[id]\route.ts

import { NextRequest } from 'next/server';
import { z } from 'zod';

import {
  calculateSummary,
  prepareDataForVisualization,
} from '@/services/analysis/raumbuch-analysis';
import { getRaumbuchData, getStandortById } from '@/services/database/queries';
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

// Apply query parameters schema for filtering
const querySchema = z.object({
  bereich: z.string().optional(),
  gebaeudeteil: z.string().optional(),
  etage: z.string().optional(),
  rg: z.string().optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate standort ID
    const validatedParams = paramsSchema.safeParse({ id: params.id });
    if (!validatedParams.success) {
      return new Response(JSON.stringify({ error: 'Invalid standort ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const standortId = Number(params.id);

    // Validate query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      bereich: searchParams.get('bereich') || undefined,
      gebaeudeteil: searchParams.get('gebaeudeteil') || undefined,
      etage: searchParams.get('etage') || undefined,
      rg: searchParams.get('rg') || undefined,
    };

    const validatedQuery = querySchema.safeParse(queryParams);
    if (!validatedQuery.success) {
      return new Response(JSON.stringify({ error: 'Invalid query parameters' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get standort information
    const standort = await getStandortById(standortId);
    if (!standort) {
      return new Response(JSON.stringify({ error: 'Standort not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get raumbuch data with filters
    let raumbuchData = await getRaumbuchData(standortId);

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
    if (filters.rg) {
      raumbuchData = raumbuchData.filter(item => item.RG === filters.rg);
    }

    // Calculate summary and prepare visualization data
    const summary = calculateSummary(raumbuchData);
    const visualizationData = prepareDataForVisualization(raumbuchData);

    // Generate PDF file
    const pdfBuffer = await generatePdf(raumbuchData, standort.bezeichnung, {
      summary,
      visualizationData,
    });

    // Set filename
    const filename = `Raumbuch_Auswertung_${standort.bezeichnung}_${new Date().toISOString().split('T')[0]}.pdf`;

    // Return the PDF file as a downloadable file
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate PDF file' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
