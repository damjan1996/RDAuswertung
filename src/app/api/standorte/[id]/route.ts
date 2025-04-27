// C:\Development\RDAuswertung\src\app\api\standorte\[id]\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getStandortById } from '@/services/database/queries';

// Validate ID parameter
const paramsSchema = z.object({
  id: z
    .string()
    .min(1)
    .refine(val => !isNaN(Number(val)), {
      message: 'ID must be a valid number',
    }),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate standort ID
    const validatedParams = paramsSchema.safeParse({ id: params.id });
    if (!validatedParams.success) {
      return NextResponse.json({ error: 'Invalid standort ID' }, { status: 400 });
    }

    const standortId = Number(params.id);

    // Get standort by ID
    const standort = await getStandortById(standortId);

    if (!standort) {
      return NextResponse.json({ error: 'Standort not found' }, { status: 404 });
    }

    return NextResponse.json(standort);
  } catch (error) {
    console.error('Error fetching standort:', error);
    return NextResponse.json({ error: 'Failed to fetch standort' }, { status: 500 });
  }
}
