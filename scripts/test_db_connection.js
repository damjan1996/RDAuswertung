// scripts/test_db_connection.js
/**
 * Simple database connection test script
 * Only depends on db_client.js
 */
const dbClient = require('./db_client');

/**
 * A simple test that performs basic queries to verify database connectivity
 */
async function runTest() {
    console.log('Testing database connection...');

    try {
        // Basic connection test
        console.log('1. Basic connection test:');
        const connected = await dbClient.testConnection();
        console.log(`   Result: ${connected ? 'SUCCESS ✓' : 'FAILED ✗'}`);

        if (!connected) {
            console.error('Connection test failed. Cannot proceed with further tests.');
            return false;
        }

        // Check SQL Server version
        console.log('\n2. SQL Server version check:');
        const versionResult = await dbClient.executeQuery('SELECT @@version as version');
        console.log(`   Version: ${versionResult[0].version.split('\n')[0]}`);

        // Check database info
        console.log('\n3. Database information:');
        const dbInfo = await dbClient.executeQuery(`
      SELECT DB_NAME() as CurrentDB, 
             USER_NAME() as CurrentUser,
             @@SERVERNAME as ServerName
    `);
        console.log(`   Current Database: ${dbInfo[0].CurrentDB}`);
        console.log(`   Current User: ${dbInfo[0].CurrentUser}`);
        console.log(`   Server Name: ${dbInfo[0].ServerName}`);

        // Check BIRD schema tables
        console.log('\n4. Tables in BIRD schema:');
        const tables = await dbClient.executeQuery(`
      SELECT name, create_date 
      FROM sys.tables 
      WHERE SCHEMA_NAME(schema_id) = 'BIRD'
      ORDER BY name
    `);

        console.log(`   Found ${tables.length} tables`);
        tables.forEach(table => {
            const createDate = new Date(table.create_date).toISOString().split('T')[0];
            console.log(`   - ${table.name} (created: ${createDate})`);
        });

        // Test with actual data - Standort table
        console.log('\n5. Testing Standort table:');
        try {
            const standortCount = await dbClient.executeQuery(`
        SELECT COUNT(*) as count FROM BIRD.Standort
      `);
            console.log(`   Count: ${standortCount[0].count} records`);

            if (standortCount[0].count > 0) {
                const firstStandort = await dbClient.executeQuery(`
          SELECT TOP 1 ID, Bezeichnung FROM BIRD.Standort
        `);
                console.log(`   Sample: ID=${firstStandort[0].ID}, Name="${firstStandort[0].Bezeichnung}"`);
            }
        } catch (error) {
            console.error(`   Error accessing Standort table: ${error.message}`);
        }

        // Test with actual data - Raumbuch table
        console.log('\n6. Testing Raumbuch table:');
        try {
            const raumbuchCount = await dbClient.executeQuery(`
        SELECT COUNT(*) as count FROM BIRD.Raumbuch
      `);
            console.log(`   Count: ${raumbuchCount[0].count} records`);

            if (raumbuchCount[0].count > 0) {
                const firstRaumbuch = await dbClient.executeQuery(`
          SELECT TOP 1 ID, Raumnummer, Bereich, Etage FROM BIRD.Raumbuch
        `);
                console.log(`   Sample: ID=${firstRaumbuch[0].ID}, Raumnummer="${firstRaumbuch[0].Raumnummer}", Bereich="${firstRaumbuch[0].Bereich}", Etage="${firstRaumbuch[0].Etage}"`);
            }
        } catch (error) {
            console.error(`   Error accessing Raumbuch table: ${error.message}`);
        }

        console.log('\n✓ All database tests completed successfully.');
        return true;
    } catch (error) {
        console.error(`Database test failed: ${error.message}`);
        return false;
    }
}

// Run the test if the script is executed directly
if (require.main === module) {
    runTest()
      .then(success => {
          if (success) {
              console.log('\nCONNECTION TEST PASSED ✓');
          } else {
              console.error('\nCONNECTION TEST FAILED ✗');
          }
          process.exit(success ? 0 : 1);
      })
      .catch(error => {
          console.error('Unexpected error during test:', error);
          process.exit(1);
      });
}

module.exports = { runTest };