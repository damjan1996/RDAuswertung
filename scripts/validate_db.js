// scripts/validate_db.js
/**
 * Standalone database validation script
 * Only depends on db_client.js
 */

// Import only our local db_client module
const dbClient = require('./db_client');

/**
 * Validates the database schema and structure
 */
async function validateDatabase() {
  console.log('Validating database schema and structure...');

  try {
    // Test SQL connection
    console.log('Testing SQL Server connection...');
    const connected = await dbClient.testConnection();

    if (!connected) {
      console.error('Failed to connect to SQL Server. Validation aborted.');
      return false;
    }

    console.log('Database connection successful!');

    // Get database and schema information
    console.log('\nChecking database information:');
    const dbInfo = await dbClient.executeQuery(`
      SELECT DB_NAME() AS DatabaseName, 
             SCHEMA_NAME(schema_id) AS SchemaName, 
             name AS TableName
      FROM sys.tables 
      WHERE SCHEMA_NAME(schema_id) = 'BIRD'
      ORDER BY name
    `);

    console.log(`Database name: ${dbInfo.length > 0 ? dbInfo[0].DatabaseName : 'Unknown'}`);
    console.log(`Found ${dbInfo.length} tables in the BIRD schema:`);
    dbInfo.forEach(table => console.log(`- ${table.TableName}`));

    // Check Raumbuch table structure
    console.log('\nChecking Raumbuch table structure...');
    try {
      const raumbuchColumns = await dbClient.executeQuery(`
        SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Raumbuch' AND TABLE_SCHEMA = 'BIRD'
        ORDER BY ORDINAL_POSITION
      `);

      console.log(`Raumbuch table has ${raumbuchColumns.length} columns`);

      // Check for key columns we need
      const requiredColumns = [
        'ID', 'Firma_ID', 'Standort_ID', 'Objekt_ID', 'Raumnummer',
        'Bereich', 'Gebaeudeteil', 'Etage', 'Bezeichnung', 'Reinigungsgruppe',
        'Menge', 'Einheit', 'Anzahl', 'Reinigungsintervall'
      ];

      const foundColumns = raumbuchColumns.map(col => col.COLUMN_NAME);
      const missingColumns = requiredColumns.filter(col => !foundColumns.includes(col));

      if (missingColumns.length > 0) {
        console.warn('Warning: Some required columns are missing:', missingColumns);
      } else {
        console.log('All required columns are present in the Raumbuch table');
      }

      // Show the first 10 columns for reference
      console.log('\nSample of columns in Raumbuch table:');
      raumbuchColumns.slice(0, 10).forEach(col => {
        const lengthInfo = col.CHARACTER_MAXIMUM_LENGTH
          ? `(${col.CHARACTER_MAXIMUM_LENGTH})`
          : '';
        console.log(`- ${col.COLUMN_NAME}: ${col.DATA_TYPE}${lengthInfo}`);
      });
    } catch (error) {
      console.error('Error checking Raumbuch table structure:', error);
    }

    // Check for sample data
    console.log('\nFetching sample data from Raumbuch...');
    try {
      const sampleCount = await dbClient.executeQuery(`
        SELECT COUNT(*) AS count FROM BIRD.Raumbuch
      `);

      console.log(`Raumbuch table has ${sampleCount[0].count} total rows`);

      if (sampleCount[0].count > 0) {
        const sampleData = await dbClient.executeQuery(`
          SELECT TOP 5
            ID, Firma_ID, Standort_ID, Objekt_ID, Raumnummer, Bereich, Gebaeudeteil, Etage
          FROM BIRD.Raumbuch
        `);

        console.log('Sample data from Raumbuch:');
        console.log(JSON.stringify(sampleData, null, 2));
      }
    } catch (error) {
      console.error('Error fetching sample data:', error);
    }

    // Check Standort table
    console.log('\nChecking Standort table...');
    try {
      const standortCount = await dbClient.executeQuery(`
        SELECT COUNT(*) AS count FROM BIRD.Standort
      `);

      console.log(`Standort table has ${standortCount[0].count} total rows`);

      if (standortCount[0].count > 0) {
        const standortData = await dbClient.executeQuery(`
          SELECT TOP 5 ID, Bezeichnung, Adresse, Strasse, PLZ, Ort
          FROM BIRD.Standort
        `);

        console.log('Sample data from Standort:');
        console.log(JSON.stringify(standortData, null, 2));
      }
    } catch (error) {
      console.error('Error checking Standort table:', error);
    }

    console.log('\nDatabase validation completed successfully');
    return true;
  } catch (error) {
    console.error('Database validation failed:', error);
    return false;
  }
}

// Run the validation if this script is executed directly
if (require.main === module) {
  validateDatabase()
    .then(success => {
      console.log(`\nValidation ${success ? 'SUCCEEDED' : 'FAILED'}`);
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      console.error('Unexpected error during validation:', err);
      process.exit(1);
    });
}

module.exports = { validateDatabase };