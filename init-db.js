import pkg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pkg;

async function initializeDatabase() {
  let client;
  
  try {
    // First connect to postgres default database to create our database
    const adminClient = new Client({
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      database: 'postgres',
    });

    await adminClient.connect();
    
    // Check if database exists
    const result = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'gn_news_portal'"
    );

    if (!result.rows.length) {
      await adminClient.query('CREATE DATABASE gn_news_portal');
      console.log('✓ Database created');
    }

    await adminClient.end();

    // Now connect to the actual database
    client = new Client({
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      database: 'gn_news_portal',
    });

    await client.connect();

    // Read schema file
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema statements...');
    
    // Execute schema - split by semicolon for multiple statements
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement);
      }
    }

    console.log('✓ Database initialized successfully');

    // Check if social_media table has data
    const socialMediaResult = await client.query('SELECT COUNT(*) as count FROM social_media');
    console.log(`✓ Social media links count: ${socialMediaResult.rows[0].count}`);

    await client.end();

  } catch (error) {
    console.error('Database initialization error:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
