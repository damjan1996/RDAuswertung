// src/config/database.ts
/**
 * Database configuration
 */

// Parse database URL from environment
function parseDatabaseUrl(url: string) {
  try {
    // Example URL: sqlserver://username:password@server:port/database
    const regex = /sqlserver:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
    const matches = url.match(regex);

    if (!matches || matches.length < 6) {
      throw new Error('Invalid database URL format');
    }

    return {
      username: matches[1],
      password: matches[2],
      server: matches[3],
      port: parseInt(matches[4], 10),
      database: matches[5],
    };
  } catch (error) {
    console.error('Failed to parse database URL:', error);
    // Return default values if parsing fails
    return {
      username: 'sa',
      password: process.env.DB_PASSWORD || '',
      server: process.env.DB_SERVER || 'localhost',
      port: parseInt(process.env.DB_PORT || '1433', 10),
      database: process.env.DB_NAME || 'RdRaumbuchHerne',
    };
  }
}

// Read from environment variables
const dbUrl = process.env.DATABASE_URL || '';
const parsedUrl = parseDatabaseUrl(dbUrl);

export const DATABASE_CONFIG = {
  username: parsedUrl.username,
  password: parsedUrl.password,
  server: parsedUrl.server,
  port: parsedUrl.port,
  database: parsedUrl.database,
  schema: process.env.DATABASE_SCHEMA || 'BIRD',
  timeout: parseInt(process.env.DATABASE_TIMEOUT || '30', 10),
};

// Default standort ID if none is specified
export const DEFAULT_STANDORT_ID = parseInt(process.env.DEFAULT_STANDORT_ID || '-1', 10);

// Logging
console.log(
  `Database configuration loaded for: ${DATABASE_CONFIG.database} on ${DATABASE_CONFIG.server}`
);
