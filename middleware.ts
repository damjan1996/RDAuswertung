import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization');
  const url = request.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // Prüfe die Zugangsdaten (am besten über Umgebungsvariablen)
    if (user === process.env.AUTH_USER && pwd === process.env.AUTH_PASSWORD) {
      return NextResponse.next();
    }
  }

  // Nicht authentifiziert - Zurückgeben des 401 Headers
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
