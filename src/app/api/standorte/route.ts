// C:\Development\RDAuswertung\src\app\api\standorte\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getStandorte } from '@/services/database/queries';

// Query parameters schema
const querySchema = z.object({
  search: z.string().optional(),
  sort: z.enum(['id', 'bezeichnung']).optional().default('bezeichnung'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
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
      search: searchParams.get('search') || undefined,
      sort: (searchParams.get('sort') as 'id' | 'bezeichnung' | undefined) || undefined,
      order: (searchParams.get('order') as 'asc' | 'desc' | undefined) || undefined,
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

    const { search, sort, order, limit, offset } = validatedQuery.data;

    // Get all standorte
    let standorte = await getStandorte();

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      standorte = standorte.filter(standort =>
        standort.bezeichnung.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    standorte = standorte.sort((a, b) => {
      const sortField = sort === 'id' ? 'id' : 'bezeichnung';

      if (a[sortField] < b[sortField]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });

    // Calculate total count before pagination
    const totalCount = standorte.length;

    // Apply pagination if limit is provided
    if (limit) {
      const limitNum = Number(limit);
      const offsetNum = offset ? Number(offset) : 0;

      standorte = standorte.slice(offsetNum, offsetNum + limitNum);
    }

    // Return the filtered, sorted, and paginated data
    return NextResponse.json({
      data: standorte,
      meta: {
        totalCount,
        filteredCount: standorte.length,
        limit: limit ? Number(limit) : null,
        offset: offset ? Number(offset) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching standorte:', error);
    return NextResponse.json({ error: 'Failed to fetch standorte' }, { status: 500 });
  }
}

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';
