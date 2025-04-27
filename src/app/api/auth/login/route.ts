import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { LoginResponse, UserCredentials } from '@/types/auth.types';

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    // Anmeldedaten aus dem Request-Body lesen
    const body: UserCredentials = await request.json();
    const { username, password } = body;

    // Prüfe gegen die Umgebungsvariablen oder hartcodierte Werte
    const validUsername = process.env.AUTH_USER || 'ritterdigital';
    const validPassword = process.env.AUTH_PASSWORD || 'passwort123';

    // Überprüfe Anmeldedaten
    if (username === validUsername && password === validPassword) {
      // Erfolgreich authentifiziert
      const cookieStore = cookies();

      // Session-Cookie setzen (httpOnly, secure im Produktionsmodus)
      cookieStore.set('auth_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8, // 8 Stunden
        path: '/',
        sameSite: 'strict',
      });

      // Benutzer-Cookie setzen (für Frontend-Anzeige)
      cookieStore.set('auth_user', username, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8, // 8 Stunden
        path: '/',
        sameSite: 'strict',
      });

      return NextResponse.json({
        success: true,
        message: 'Anmeldung erfolgreich',
        user: username,
      });
    }

    // Ungültige Anmeldedaten
    return NextResponse.json(
      {
        success: false,
        message: 'Ungültiger Benutzername oder Passwort',
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ein Fehler ist aufgetreten',
      },
      { status: 500 }
    );
  }
}
