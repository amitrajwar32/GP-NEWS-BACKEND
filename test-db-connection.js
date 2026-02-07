import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;

dotenv.config();

async function testConnection() {
  console.log('\n=== Testing PostgreSQL Connection ===\n');
  
  console.log('Connection Details:');
  console.log('  Host:', process.env.DB_HOST);
  console.log('  Port:', process.env.DB_PORT);
  console.log('  Database:', process.env.DB_NAME);
  console.log('  User:', process.env.DB_USER);
  console.log('  SSL:', process.env.DB_SSL === 'true' ? 'ENABLED' : 'DISABLED');
  console.log('  DATABASE_URL:', process.env.DATABASE_URL ? 'SET (hidden)' : 'NOT SET');
  
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 15000,
  });

  try {
    console.log('\nAttempting connection...');
    await client.connect();
    console.log('✓ Connection successful!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✓ Query test passed:', result.rows[0]);
    
    await client.end();
    console.log('\n✓ All tests passed!');
  } catch (error) {
    console.error('\n✗ Connection failed:');
    console.error('  Code:', error.code);
    console.error('  Message:', error.message);
    console.error('  Errno:', error.errno);
    process.exit(1);
  }
}

testConnection();
