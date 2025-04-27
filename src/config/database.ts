/**
 * Datenbankeinstellungen für die RitterDigitalAuswertung-Anwendung.
 * Enthält Verbindungsparameter für die SQL Server Datenbank.
 */

// SQL Server Verbindungsparameter
export const DATABASE_CONFIG = {
  server: process.env.DB_SERVER || '116.202.224.248',
  database: process.env.DB_NAME || 'RdRaumbuch',
  username: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YJ5C19QZ7ZUW!',
  driver: process.env.DB_DRIVER || '{ODBC Driver 17 for SQL Server}',
  trusted_connection: process.env.DB_TRUSTED_CONNECTION || 'no',
  timeout: parseInt(process.env.DB_TIMEOUT || '30', 10),
};

// Default ID für den Standort, falls nicht explizit angegeben
export const DEFAULT_STANDORT_ID = 1;

// Prisma Database URL basierend auf den Config-Werten generieren
export const generatePrismaUrl = () => {
  const { server, database, username, password, trusted_connection } = DATABASE_CONFIG;

  // MSSQL-Verbindungsstring für Prisma erstellen
  return `sqlserver://${server}:1433;database=${database};user=${username};password=${password};trustServerCertificate=true;${trusted_connection === 'yes' ? 'Trusted_Connection=yes;' : ''}encrypt=true`;
};

// Für direkte Verwendung in der .env-Datei
export const PRISMA_DATABASE_URL = generatePrismaUrl();
