import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Öffentliche Pfade, die keinen Auth-Check benötigen
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/check'];

  // Check, ob wir uns auf einer öffentlichen Seite befinden
  const isPublicPath = publicPaths.some(publicPath => path.startsWith(publicPath));

  // Statische Ressourcen ignorieren
  const isStaticResource =
    path.startsWith('/_next') || path.startsWith('/favicon.ico') || path.includes('.');

  // Wenn es ein statischer Pfad ist oder API-Route außer auth-spezifische
  if (
    isStaticResource ||
    (path.startsWith('/api/') && !path.startsWith('/api/auth/') && path !== '/api/auth/login')
  ) {
    return NextResponse.next();
  }

  // Authentifizierungsstatus aus Cookies überprüfen
  const authSession = request.cookies.get('auth_session');
  const isAuthenticated = authSession?.value === 'true';

  // Wenn Benutzer nicht authentifiziert ist und versucht, auf geschützte Routen zuzugreifen
  if (!isAuthenticated && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Wenn Benutzer authentifiziert ist und auf Login-Seite zugreifen will
  if (isAuthenticated && path === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Matcher konfigurieren, um Middleware nur auf relevanten Pfaden auszuführen
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
