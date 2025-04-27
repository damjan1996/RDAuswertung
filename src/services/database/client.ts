/**
 * Service für direkten Datenbankzugriff mit erweiterten Funktionen jenseits von Prisma
 */

import SQL, { ConnectionPool } from 'mssql';

import { DATABASE_CONFIG } from '@/config/database';

/**
 * Verbindungskonfiguration für MSSQL
 */
const sqlConfig: SQL.config = {
  user: DATABASE_CONFIG.username,
  password: DATABASE_CONFIG.password,
  server: DATABASE_CONFIG.server,
  database: DATABASE_CONFIG.database,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectTimeout: DATABASE_CONFIG.timeout * 1000,
  },
};

/**
 * Hält eine Verbindungs-Pool-Instanz
 */
let pool: SQL.ConnectionPool | null = null;

/**
 * Stellt sicher, dass der Pool initialisiert ist und gibt ihn zurück
 *
 * @returns Eine MSSQL Connection Pool Instanz
 */
export async function getPool(): Promise<SQL.ConnectionPool> {
  if (!pool) {
    try {
      pool = await new ConnectionPool(sqlConfig).connect();
      console.log('SQL Server connection pool created');

      // Event-Handler für Pool-Fehler
      pool.on('error', err => {
        console.error('SQL Pool Error:', err);
        pool = null;
      });
    } catch (err) {
      console.error('Failed to create SQL connection pool:', err);
      throw err;
    }
  }

  return pool;
}

/**
 * Führt eine Query mit Parametern aus
 *
 * @param query - SQL-Query
 * @param params - Query-Parameter
 * @returns Query-Ergebnis
 */
export async function executeQuery<T = Record<string, unknown>>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T[]> {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Parameter hinzufügen
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.query(query);
    return result.recordset as T[];
  } catch (err) {
    console.error('SQL Query Error:', err);
    throw err;
  }
}

/**
 * Führt eine Query mit Parametern aus und gibt ein einzelnes Ergebnis zurück
 *
 * @param query - SQL-Query
 * @param params - Query-Parameter
 * @returns Einzelnes Query-Ergebnis oder null, wenn nichts gefunden wurde
 */
export async function executeSingleQuery<T = Record<string, unknown>>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T | null> {
  const results = await executeQuery<T>(query, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Führt eine Stored Procedure aus
 *
 * @param procedureName - Name der Stored Procedure
 * @param params - Parameter für die Stored Procedure
 * @returns Ergebnis der Stored Procedure
 */
export async function executeStoredProcedure<T = Record<string, unknown>>(
  procedureName: string,
  params: Record<string, unknown> = {}
): Promise<T[]> {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Parameter hinzufügen
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.execute(procedureName);
    return result.recordset as T[];
  } catch (err) {
    console.error('SQL Stored Procedure Error:', err);
    throw err;
  }
}

/**
 * Schließt den Connection Pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    try {
      await pool.close();
      console.log('SQL connection pool closed');
      pool = null;
    } catch (err) {
      console.error('Error closing SQL connection pool:', err);
      throw err;
    }
  }
}

/**
 * Testet die Datenbankverbindung
 *
 * @returns true, wenn die Verbindung erfolgreich war, sonst false
 */
export async function testConnection(): Promise<boolean> {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT 1 as result');
    return result.recordset[0].result === 1;
  } catch (err) {
    console.error('Database connection test failed:', err);
    return false;
  }
}
