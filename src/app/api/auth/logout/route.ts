import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const cookieStore = cookies();

    // Authentifizierungscookies löschen
    cookieStore.delete('auth_session');
    cookieStore.delete('auth_user');

    return NextResponse.json({
      success: true,
      message: 'Erfolgreich abgemeldet',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Fehler bei der Abmeldung',
      },
      { status: 500 }
    );
  }
}
