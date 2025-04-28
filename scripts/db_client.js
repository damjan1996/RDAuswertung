// scripts/db_client.js
/**
 * Standalone SQL Server database client
 * Only depends on the mssql module
 */

// Check for required modules
try {
  require.resolve('mssql');
} catch (e) {
  console.error('Required module "mssql" not found. Please install it using:');
  console.error('npm install mssql');
  process.exit(1);
}

const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Function to parse .env file manually
function parseEnvFile() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      console.log(`Parsing .env file from ${envPath}`);
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envLines = envContent.split('\n');

      envLines.forEach(line => {
        // Skip comments and empty lines
        if (line.trim().startsWith('#') || !line.trim()) return;

        // Parse key=value format
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';

          // Remove quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }

          // Set as environment variable if not already set
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });

      return true;
    }
    return false;
  } catch (error) {
    console.warn('Error parsing .env file:', error.message);
    return false;
  }
}

// Try to parse .env file
parseEnvFile();

// Hardcoded default config (use if .env parsing fails)
const DEFAULT_CONFIG = {
  user: 'sa',
  password: 'YJ5C19QZ7ZUW!',
  server: '116.202.224.248',
  port: 1433,
  database: 'RdRaumbuchHerne',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectTimeout: 30000,
    requestTimeout: 30000
  }
};

// Parse DATABASE_URL from environment
function parseDatabaseUrl() {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.warn('DATABASE_URL not found in environment variables');
      return null;
    }

    // Example URL: sqlserver://username:password@server:port/database
    const regex = /sqlserver:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
    const matches = url.match(regex);

    if (!matches || matches.length < 6) {
      console.warn('DATABASE_URL has invalid format');
      return null;
    }

    return {
      user: matches[1],
      password: matches[2],
      server: matches[3],
      port: parseInt(matches[4], 10),
      database: matches[5],
      options: {
        encrypt: true,
        trustServerCertificate: true,
        connectTimeout: 30000,
        requestTimeout: 30000
      }
    };
  } catch (error) {
    console.error('Failed to parse database URL:', error);
    return null;
  }
}

// Get database configuration
function getDbConfig() {
  // Try to parse from DATABASE_URL first
  const parsedConfig = parseDatabaseUrl();
  if (parsedConfig) {
    return parsedConfig;
  }

  // Fall back to individual environment variables if DATABASE_URL parsing failed
  if (process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_SERVER && process.env.DB_NAME) {
    return {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      port: parseInt(process.env.DB_PORT || '1433', 10),
      database: process.env.DB_NAME,
      options: {
        encrypt: true,
        trustServerCertificate: true,
        connectTimeout: parseInt(process.env.DB_TIMEOUT || '30000', 10),
        requestTimeout: parseInt(process.env.DB_TIMEOUT || '30000', 10)
      }
    };
  }

  // Fall back to default config if all else fails
  console.warn('Using hardcoded default database configuration');
  return DEFAULT_CONFIG;
}

// Get configuration
const dbConfig = getDbConfig();
console.log(`Database configuration: ${dbConfig.database} on ${dbConfig.server}`);

// Create a pool once
let pool = null;

/**
 * Gets a connection pool for SQL Server
 */
async function getPool() {
  if (!pool) {
    try {
      console.log('Creating new SQL Server connection pool...');
      pool = await new sql.ConnectionPool(dbConfig).connect();

      // Handle pool errors
      pool.on('error', err => {
        console.error('SQL Pool error:', err);
        pool = null;
      });

      console.log('SQL Server connection pool created successfully');
    } catch (err) {
      console.error('Failed to create SQL connection pool:', err);
      throw err;
    }
  }
  return pool;
}

/**
 * Executes a SQL query with parameters
 */
async function executeQuery(query, params = {}) {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Add parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('SQL Query Error:', err);
    throw err;
  }
}

/**
 * Executes a SQL query and returns a single result
 */
async function executeSingleQuery(query, params = {}) {
  const results = await executeQuery(query, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Tests connection to the database
 */
async function testConnection() {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT 1 as result');
    return result.recordset[0].result === 1;
  } catch (err) {
    console.error('Database connection test failed:', err);
    return false;
  }
}

/**
 * Returns a client object with methods to interact with the database
 */
function getClient() {
  return {
    executeQuery,
    executeSingleQuery,
    testConnection,
    getPool
  };
}

// Clean up resources when the process exits
process.on('exit', () => {
  if (pool) {
    console.log('Closing database connection pool...');
    pool.close();
  }
});

// Export functions and client
module.exports = {
  getPool,
  executeQuery,
  executeSingleQuery,
  testConnection,
  getClient
};

// If script is run directly, test the connection
if (require.main === module) {
  console.log('Running database connection test...');
  testConnection()
    .then(connected => {
      console.log(connected
        ? 'Successfully connected to the database!'
        : 'Failed to connect to the database');

      if (connected) {
        return executeQuery('SELECT @@version as version')
          .then(result => {
            console.log('SQL Server version:', result[0].version);
            process.exit(0);
          });
      } else {
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Error testing connection:', err);
      process.exit(1);
    });
}