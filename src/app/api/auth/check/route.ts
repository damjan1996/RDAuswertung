import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const cookieStore = cookies();
    const authSession = cookieStore.get('auth_session');
    const authUser = cookieStore.get('auth_user');

    if (authSession?.value === 'true') {
      return NextResponse.json({
        isAuthenticated: true,
        user: authUser?.value || null,
      });
    }

    return NextResponse.json({
      isAuthenticated: false,
      user: null,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      {
        isAuthenticated: false,
        user: null,
        error: 'Fehler bei der Authentifizierungsprüfung',
      },
      { status: 500 }
    );
  }
}
