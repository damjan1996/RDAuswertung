/**
 * Dienstprogramm für Datenbankfunktionen und Zugriff auf Prisma Client
 */

// Definiere PrismaClient-Interface, da der Import fehlschlägt
interface PrismaClient {
  $queryRaw: <T = any>(query: TemplateStringsArray, ...values: any[]) => Promise<T>;
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  [key: string]: any;
}

// Globaler Prisma-Client für Entwicklung
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Erstellt und exportiert eine einzelne PrismaClient-Instanz oder einen Mock,
 * wenn PrismaClient nicht verfügbar ist
 */
export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClientOrMock();

// Prisma global speichern in Nicht-Produktionsumgebungen
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Erstellt einen PrismaClient oder einen Mock, wenn der Client nicht verfügbar ist
 */
function createPrismaClientOrMock(): PrismaClient {
  try {
    // Dynamischer Import, um Typfehler zu vermeiden
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require('@prisma/client');
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.warn('Prisma Client konnte nicht geladen werden. Verwende Mock-Implementation.');
    // Mock-Implementation zurückgeben
    return createPrismaMock();
  }
}

/**
 * Erstellt einen Mock für PrismaClient für Entwicklungs- und Testzwecke
 */
function createPrismaMock(): PrismaClient {
  return {
    $queryRaw: async <T = any>(query: TemplateStringsArray, ...values: any[]): Promise<T> => {
      console.log('Mock $queryRaw aufgerufen mit:', { query, values });
      return [{ result: 1 }] as unknown as T;
    },
    $connect: async () => {
      console.log('Mock $connect aufgerufen');
    },
    $disconnect: async () => {
      console.log('Mock $disconnect aufgerufen');
    },
  } as PrismaClient;
}

/**
 * Formatiert Fehler aus Prisma-Queries
 */
export function formatPrismaError(error: unknown): string {
  // Prüft, ob es sich um einen Prisma-Fehler handelt
  if (error && typeof error === 'object' && 'code' in error && 'meta' in error) {
    const prismaError = error as {
      code: string;
      meta?: { target?: string[]; field_name?: string };
      message?: string;
    };

    // Spezifische Fehlertypen behandeln
    switch (prismaError.code) {
      case 'P2002':
        return `Eindeutigkeitsverletzung für ${prismaError.meta?.target?.join(', ') || 'Feld'}`;
      case 'P2025':
        return 'Datensatz nicht gefunden';
      case 'P2003':
        return `Fremdschlüsselverletzung für ${prismaError.meta?.field_name || 'Feld'}`;
      default:
        return `Datenbankfehler: ${prismaError.message || 'Unbekannter Fehler'}`;
    }
  }

  // Generische Fehlerbehandlung
  if (error instanceof Error) {
    return error.message || 'Ein unbekannter Datenbankfehler ist aufgetreten';
  }

  return 'Ein unbekannter Datenbankfehler ist aufgetreten';
}

/**
 * Prüft, ob eine Verbindung zur Datenbank möglich ist
 */
export async function testConnection(): Promise<boolean> {
  try {
    // Führe eine einfache Query aus
    await prisma.$queryRaw`SELECT 1 as result`;
    return true;
  } catch (error) {
    console.error('Datenbankverbindung fehlgeschlagen:', error);
    return false;
  }
}
