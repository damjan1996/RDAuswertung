// C:\Development\RDAuswertung\src\app\api\raumbuch\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getRaumbuchData } from '@/services/database/queries';

// Query parameters schema for raumbuch filtering
const querySchema = z.object({
  standortId: z
    .string()
    .optional()
    .refine(val => !val || !isNaN(Number(val)), {
      message: 'standortId must be a valid number',
    }),
  bereich: z.string().optional(),
  gebaeudeteil: z.string().optional(),
  etage: z.string().optional(),
  rg: z.string().optional(),
  limit: z
    .string()
    .optional()
    .refine(val => !val || !isNaN(Number(val)), {
      message: 'limit must be a valid number',
    }),
  offset: z
    .string()
    .optional()
    .refine(val => !val || !isNaN(Number(val)), {
      message: 'offset must be a valid number',
    }),
});

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      standortId: searchParams.get('standortId') || undefined,
      bereich: searchParams.get('bereich') || undefined,
      gebaeudeteil: searchParams.get('gebaeudeteil') || undefined,
      etage: searchParams.get('etage') || undefined,
      rg: searchParams.get('rg') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    };

    const validatedQuery = querySchema.safeParse(queryParams);

    if (!validatedQuery.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validatedQuery.error.format() },
        { status: 400 }
      );
    }

    const { standortId, bereich, gebaeudeteil, etage, rg, limit, offset } = validatedQuery.data;

    // If no standortId provided, return an error since we need at least a standort
    if (!standortId) {
      return NextResponse.json({ error: 'standortId is required' }, { status: 400 });
    }

    // Get raumbuch data
    let raumbuchData = await getRaumbuchData(Number(standortId));

    // Apply filters if provided
    if (bereich) {
      raumbuchData = raumbuchData.filter(item => item.Bereich === bereich);
    }

    if (gebaeudeteil) {
      raumbuchData = raumbuchData.filter(item => item.Gebaeudeteil === gebaeudeteil);
    }

    if (etage) {
      raumbuchData = raumbuchData.filter(item => item.Etage === etage);
    }

    if (rg) {
      raumbuchData = raumbuchData.filter(item => item.RG === rg);
    }

    // Calculate total count before pagination
    const totalCount = raumbuchData.length;

    // Apply pagination if limit is provided
    if (limit) {
      const limitNum = Number(limit);
      const offsetNum = offset ? Number(offset) : 0;

      raumbuchData = raumbuchData.slice(offsetNum, offsetNum + limitNum);
    }

    // Return the filtered and paginated data
    return NextResponse.json({
      data: raumbuchData,
      meta: {
        totalCount,
        filteredCount: raumbuchData.length,
        limit: limit ? Number(limit) : null,
        offset: offset ? Number(offset) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching raumbuch data:', error);
    return NextResponse.json({ error: 'Failed to fetch raumbuch data' }, { status: 500 });
  }
}

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';
